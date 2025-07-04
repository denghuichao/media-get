import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import os from 'os';
import { fileURLToPath } from 'url';
import { initializeDatabase, DownloadTaskDB } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default data directory: ~/data/media-get
const DEFAULT_DATA_DIR = path.join(os.homedir(), 'data', 'media-get');
const DATA_DIR = process.env.DATA_DIR || DEFAULT_DATA_DIR;

// Configuration
const DOWNLOADS_DIR = process.env.DOWNLOADS_DIR || path.join(DATA_DIR, 'downloads');
const DOWNLOAD_TOOL = process.env.DOWNLOAD_TOOL || 'yt-dlp'; // 'you-get' or 'yt-dlp'
const WORKER_INTERVAL = parseInt(process.env.WORKER_INTERVAL) || 5000; // 5 seconds
const MAX_CONCURRENT_DOWNLOADS = parseInt(process.env.MAX_CONCURRENT_DOWNLOADS) || 3;
const CLEANUP_INTERVAL_HOURS = parseInt(process.env.CLEANUP_INTERVAL_HOURS) || 24;
const MAX_DOWNLOAD_AGE_HOURS = parseInt(process.env.MAX_DOWNLOAD_AGE_HOURS) || 24;

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  console.log(`Created downloads directory: ${DOWNLOADS_DIR}`);
}

// Track active downloads
const activeDownloads = new Map();

// Dispatcher thread class for managing worker processes
class DownloadDispatcher {
  constructor() {
    this.isRunning = false;
    this.workerInterval = null;
    this.cleanupInterval = null;
    this.activeWorkers = new Map();
  }

  // Start the dispatcher
  async start() {
    if (this.isRunning) {
      console.log('Dispatcher is already running');
      return;
    }

    console.log('Starting Download Dispatcher...');
    this.isRunning = true;

    // Start scanning for pending tasks
    this.workerInterval = setInterval(() => {
      this.scanAndDispatchTasks().catch(error => {
        console.error('Error in dispatcher loop:', error);
      });
    }, WORKER_INTERVAL);

    // Start cleanup process
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldDownloads();
    }, CLEANUP_INTERVAL_HOURS * 60 * 60 * 1000);

    // Run initial cleanup
    setTimeout(() => this.cleanupOldDownloads(), 5000);

    console.log(`Dispatcher started with ${MAX_CONCURRENT_DOWNLOADS} max concurrent downloads`);
  }

  // Stop the dispatcher
  stop() {
    if (!this.isRunning) {
      return;
    }

    console.log('Stopping Download Dispatcher...');
    this.isRunning = false;

    if (this.workerInterval) {
      clearInterval(this.workerInterval);
      this.workerInterval = null;
    }

    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    // Wait for active workers to complete
    console.log(`Waiting for ${this.activeWorkers.size} active workers to complete...`);
  }

  // Scan for pending tasks and dispatch to worker threads
  async scanAndDispatchTasks() {
    try {
      // Check if we can process more downloads
      if (this.activeWorkers.size >= MAX_CONCURRENT_DOWNLOADS) {
        return;
      }

      // Get pending tasks
      const availableSlots = MAX_CONCURRENT_DOWNLOADS - this.activeWorkers.size;
      const pendingTasks = await DownloadTaskDB.getPendingTasks(availableSlots);

      if (pendingTasks.length === 0) {
        return;
      }

      console.log(`Dispatcher found ${pendingTasks.length} pending tasks, dispatching to workers...`);

      // Dispatch each task to a worker thread
      for (const task of pendingTasks) {
        if (this.activeWorkers.size >= MAX_CONCURRENT_DOWNLOADS) {
          break;
        }

        this.dispatchToWorker(task);
      }

    } catch (error) {
      console.error('Error scanning for tasks:', error);
    }
  }

  // Dispatch a single task to a worker thread
  async dispatchToWorker(task) {
    const taskId = task.task_id;

    if (this.activeWorkers.has(taskId)) {
      console.log(`Task ${taskId} is already being processed`);
      return;
    }

    console.log(`Dispatching task ${taskId} to worker thread`);

    // Create worker for this task
    const worker = new DownloadWorker(task, this);
    this.activeWorkers.set(taskId, worker);

    // Start processing
    worker.process().catch(error => {
      console.error(`Worker for task ${taskId} failed:`, error);
    }).finally(() => {
      // Remove from active workers when done
      this.activeWorkers.delete(taskId);
    });
  }

  // Cleanup old download directories
  cleanupOldDownloads() {
    try {
      const now = Date.now();
      const maxAge = MAX_DOWNLOAD_AGE_HOURS * 60 * 60 * 1000;

      const items = fs.readdirSync(DOWNLOADS_DIR);
      let cleanedCount = 0;

      for (const item of items) {
        const itemPath = path.join(DOWNLOADS_DIR, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory() && (now - stats.mtime.getTime()) > maxAge) {
          fs.rmSync(itemPath, { recursive: true, force: true });
          cleanedCount++;
          console.log(`Cleaned up old download directory: ${item}`);
        }
      }

      if (cleanedCount > 0) {
        console.log(`Cleanup completed: removed ${cleanedCount} old download directories`);
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  // Get dispatcher status
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeWorkers: this.activeWorkers.size,
      maxConcurrent: MAX_CONCURRENT_DOWNLOADS,
      workerInterval: WORKER_INTERVAL,
      activeTaskIds: Array.from(this.activeWorkers.keys())
    };
  }
}

// Worker thread class for processing individual download tasks
class DownloadWorker {
  constructor(task, dispatcher) {
    this.task = task;
    this.dispatcher = dispatcher;
    this.taskId = task.task_id;
  }

  // Process the download task
  async process() {
    console.log(`Worker processing download task: ${this.taskId}`);

    try {
      // Update task status to processing
      await DownloadTaskDB.updateTaskProgress(this.taskId, 0, 'processing');

      // Generate task download directory using task_id
      const { dirName, fullPath: downloadDir } = this.generateTaskDownloadDir();

      const ffmpegAvailable = await this.checkFFmpegAvailable();
      console.log(`FFmpeg available for task ${this.taskId}:`, ffmpegAvailable);

      const initialFiles = fs.existsSync(downloadDir) ? fs.readdirSync(downloadDir) : [];

      // Prepare download tool arguments
      const args = this.prepareDownloadArgs(downloadDir);

      console.log(`Worker ${this.taskId} executing ${DOWNLOAD_TOOL} with args:`, args);

      // Update progress to 25%
      await DownloadTaskDB.updateTaskProgress(this.taskId, 25);

      // Execute download
      const output = await this.executeDownloadTool(args);
      console.log(`Worker ${this.taskId} download output:`, output);

      // Update progress to 75%
      await DownloadTaskDB.updateTaskProgress(this.taskId, 75);

      // Process downloaded files
      const result = await this.processDownloadedFiles(downloadDir, initialFiles, dirName, ffmpegAvailable);

      // Complete the task
      await DownloadTaskDB.completeTask(this.taskId, result);
      console.log(`Worker completed task: ${this.taskId}`);

    } catch (error) {
      console.error(`Worker failed for task ${this.taskId}:`, error.message);
      await DownloadTaskDB.failTask(this.taskId, error.message);
    }
  }

  // Generate task download directory using task_id
  generateTaskDownloadDir() {
    const dirName = this.taskId; // Use task_id directly as directory name
    const taskDir = path.join(DOWNLOADS_DIR, dirName);

    if (!fs.existsSync(taskDir)) {
      fs.mkdirSync(taskDir, { recursive: true });
    }

    return { dirName, fullPath: taskDir };
  }

  // Prepare download arguments based on the tool
  prepareDownloadArgs(downloadDir) {
    if (DOWNLOAD_TOOL === 'yt-dlp') {
      const args = [
        // Use a shorter output template with length limits
        '-o', path.join(downloadDir, '%(title).60s.%(ext)s'),
        '--no-playlist', // Don't download playlists by default
        '--write-info-json', // Write metadata
        '--write-thumbnail', // Download thumbnail
        '--ignore-errors', // Continue with errors to handle unavailable formats gracefully
        '--no-warnings', // Reduce noise in logs
        '--extract-flat', 'false' // Ensure full extraction
      ];

      // Add format selection if specified
      if (this.task.media_info && this.task.media_info.itag) {
        args.push('-f', this.task.media_info.itag);
      } else {
        // Default to best quality video+audio or best available
        args.push('-f', 'best[height<=1080]/best');
      }

      // Add retry options for better reliability
      args.push('--retries', '3');
      args.push('--fragment-retries', '3');

      // Add output template restrictions for better file naming
      args.push('--restrict-filenames');
      // Limit filename length to avoid filesystem issues
      args.push('--trim-filenames', '200');

      args.push(this.task.url);
      return args;
    } else {
      // you-get arguments
      const args = ['-o', downloadDir];

      // Add format selection if specified
      if (this.task.media_info && this.task.media_info.itag) {
        args.push(`--format=${this.task.media_info.itag}`);
      }

      args.push(this.task.url);
      return args;
    }
  }

  // Execute download tool command
  executeDownloadTool(args) {
    return new Promise((resolve, reject) => {
      console.log(`Worker ${this.taskId} executing: ${DOWNLOAD_TOOL} ${args.join(' ')}`);

      const downloadProcess = spawn(DOWNLOAD_TOOL, args, {
        stdio: ['ignore', 'pipe', 'pipe'], // Explicitly set stdio
        env: { ...process.env, PYTHONUNBUFFERED: '1' } // For yt-dlp Python output
      });

      let stdout = '';
      let stderr = '';

      downloadProcess.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        // Log progress for yt-dlp
        if (output.includes('[download]') || output.includes('%')) {
          console.log(`Worker ${this.taskId} progress:`, output.trim());
        }
      });

      downloadProcess.stderr.on('data', (data) => {
        const error = data.toString();
        stderr += error;
        // yt-dlp sometimes outputs useful info to stderr
        if (DOWNLOAD_TOOL === 'yt-dlp' && (error.includes('[info]') || error.includes('[download]'))) {
          console.log(`Worker ${this.taskId} info:`, error.trim());
        } else if (!error.includes('WARNING') && error.trim()) {
          console.warn(`Worker ${this.taskId} stderr:`, error.trim());
        }
      });

      downloadProcess.on('close', (code) => {
        console.log(`Worker ${this.taskId} process exited with code: ${code}`);

        if (code === 0) {
          resolve(stdout);
        } else {
          // For yt-dlp, provide more detailed error information
          let errorMessage = `${DOWNLOAD_TOOL} process exited with code ${code}`;
          if (stderr) {
            // Filter out common warnings that aren't real errors
            const filteredStderr = stderr
              .split('\n')
              .filter(line =>
                !line.includes('WARNING') &&
                !line.includes('[info]') &&
                line.trim()
              )
              .join('\n');

            if (filteredStderr) {
              errorMessage += `\nError output: ${filteredStderr}`;
            }
          }

          if (stdout && stdout.includes('ERROR')) {
            errorMessage += `\nStdout errors: ${stdout}`;
          }

          reject(new Error(errorMessage));
        }
      });

      downloadProcess.on('error', (error) => {
        console.error(`Worker ${this.taskId} process error:`, error);
        reject(new Error(`Failed to start ${DOWNLOAD_TOOL}: ${error.message}`));
      });

      // Handle process timeout (optional)
      const timeout = setTimeout(() => {
        console.warn(`Worker ${this.taskId} download timeout, killing process`);
        downloadProcess.kill('SIGTERM');
        reject(new Error('Download process timeout'));
      }, 300000); // 5 minutes timeout

      downloadProcess.on('close', () => {
        clearTimeout(timeout);
      });
    });
  }

  // Execute you-get command (backward compatibility)
  executeYouGet(args) {
    return this.executeDownloadTool(args);
  }

  // Execute FFmpeg command
  executeFFmpeg(args) {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', args);
      let stdout = '';
      let stderr = '';

      ffmpeg.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr || `FFmpeg process exited with code ${code}`));
        }
      });

      ffmpeg.on('error', (error) => {
        reject(error);
      });
    });
  }

  // Check if FFmpeg is available
  async checkFFmpegAvailable() {
    try {
      await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', ['-version']);
        ffmpeg.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error('FFmpeg not available'));
        });
        ffmpeg.on('error', reject);
      });
      return true;
    } catch {
      return false;
    }
  }

  // Process downloaded files
  async processDownloadedFiles(downloadDir, initialFiles, dirName, ffmpegAvailable) {
    const allFiles = fs.readdirSync(downloadDir);
    const newFiles = allFiles.filter(file => !initialFiles.includes(file));
    console.log(`Worker ${this.taskId} new files after download:`, newFiles);

    const { mediaFiles, metadataFiles } = this.findMediaFiles(newFiles);
    console.log(`Worker ${this.taskId} media files:`, mediaFiles);

    // Extract metadata from yt-dlp info.json if available
    const extractedMetadata = this.extractMetadataFromInfoJson(downloadDir, metadataFiles);

    // Use extracted metadata or fallback to task metadata
    const title = extractedMetadata?.title || this.task.media_info?.title || 'download';
    const itag = extractedMetadata?.format_id || this.task.media_info?.itag || 'default';

    console.log(`Worker ${this.taskId} using metadata - title: "${title}", format: "${itag}"`);

    // Rename files with title_itag prefix
    const renamedMediaFiles = this.renameDownloadedFiles(mediaFiles, downloadDir, title, itag);

    let finalFiles = [];
    let message = 'Download completed successfully';

    if (renamedMediaFiles.length === 1) {
      finalFiles = renamedMediaFiles;
    } else if (renamedMediaFiles.length === 2 && ffmpegAvailable) {
      console.log(`Worker ${this.taskId} attempting to merge DASH video and audio files...`);

      try {
        const { videoOnlyFile, audioOnlyFile } = await this.identifyDashFiles(renamedMediaFiles, downloadDir);

        if (videoOnlyFile && audioOnlyFile) {
          console.log(`Worker ${this.taskId} identified video: ${videoOnlyFile.filename}, audio: ${audioOnlyFile.filename}`);

          const outputFilename = this.generateCleanFilename(title, itag, 'mp4');

          const mergedFile = await this.mergeVideoAudio(
            videoOnlyFile.filename,
            audioOnlyFile.filename,
            outputFilename,
            downloadDir
          );
          finalFiles = [mergedFile];
          message = 'Download completed and video/audio merged successfully';
          console.log(`Worker ${this.taskId} successfully merged DASH streams into:`, mergedFile);
        } else {
          console.log(`Worker ${this.taskId} could not identify separate video/audio files, using all files`);
          finalFiles = renamedMediaFiles;
          message = 'Download completed (files could not be automatically merged)';
        }
      } catch (mergeError) {
        console.error(`Worker ${this.taskId} failed to merge DASH files:`, mergeError.message);
        finalFiles = renamedMediaFiles;
        message = 'Download completed but merging failed - returning all files';
      }
    } else if (renamedMediaFiles.length > 0) {
      finalFiles = renamedMediaFiles;
      message = `Download completed. ${renamedMediaFiles.length} files downloaded${!ffmpegAvailable ? ' (install FFmpeg for automatic merging)' : ''}`;
      console.log(`Worker ${this.taskId} multiple files downloaded (${renamedMediaFiles.length}), returning all files`);
    }

    if (finalFiles.length === 0) {
      throw new Error(`No media files found. All files: ${newFiles.join(', ')}`);
    }

    // Prepare result data
    return {
      files: finalFiles.map(filename => {
        const filePath = path.join(downloadDir, filename);
        const stats = fs.statSync(filePath);
        const fileSizeBytes = stats.size;
        const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(1);

        // Determine file type based on extension
        const ext = path.extname(filename).toLowerCase();
        let type = 'video'; // default

        // Video formats
        const videoExtensions = [
          '.mp4', '.mkv', '.webm', '.flv', '.avi', '.mov', '.wmv', '.m4v',
          '.mpg', '.mpeg', '.3gp', '.f4v', '.ts', '.mts', '.m2ts'
        ];

        // Audio formats
        const audioExtensions = [
          '.mp3', '.m4a', '.aac', '.flac', '.ogg', '.wav', '.wma',
          '.opus', '.vorbis', '.ac3', '.dts'
        ];

        // Image formats
        const imageExtensions = [
          '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg',
          '.tiff', '.tif'
        ];

        if (audioExtensions.includes(ext)) {
          type = 'audio';
        } else if (imageExtensions.includes(ext)) {
          type = 'image';
        } else if (videoExtensions.includes(ext)) {
          type = 'video';
        } else {
          // For unknown extensions, try to guess based on context or keep as video
          console.log(`Worker ${this.taskId} unknown extension ${ext} for file ${filename}, defaulting to video`);
          type = 'video';
        }

        return {
          filename,
          downloadPath: `/downloads/${dirName}/${filename}`,
          size: `${fileSizeMB} MB`,
          type,
          format: ext.slice(1)
        };
      }),
      downloadDir: dirName,
      message
    };
  }

  // Extract metadata from yt-dlp info.json files
  extractMetadataFromInfoJson(downloadDir, metadataFiles) {
    try {
      const infoJsonFile = metadataFiles.find(file => file.endsWith('.info.json'));
      if (!infoJsonFile) {
        console.log(`Worker ${this.taskId} no info.json file found`);
        return null;
      }

      const infoJsonPath = path.join(downloadDir, infoJsonFile);
      if (!fs.existsSync(infoJsonPath)) {
        console.log(`Worker ${this.taskId} info.json file does not exist: ${infoJsonPath}`);
        return null;
      }

      const infoData = JSON.parse(fs.readFileSync(infoJsonPath, 'utf8'));
      console.log(`Worker ${this.taskId} extracted metadata from info.json:`, {
        title: infoData.title,
        format_id: infoData.format_id,
        ext: infoData.ext,
        duration: infoData.duration
      });

      return {
        title: infoData.title || 'download',
        format_id: infoData.format_id || this.task.media_info?.itag || 'default',
        ext: infoData.ext,
        duration: infoData.duration,
        uploader: infoData.uploader,
        upload_date: infoData.upload_date,
        view_count: infoData.view_count,
        like_count: infoData.like_count,
        width: infoData.width,
        height: infoData.height,
        fps: infoData.fps,
        vcodec: infoData.vcodec,
        acodec: infoData.acodec
      };
    } catch (error) {
      console.warn(`Worker ${this.taskId} failed to parse info.json:`, error.message);
      return null;
    }
  }

  // Helper function to filter downloaded files
  findMediaFiles(files) {
    const mediaFiles = [];
    const metadataFiles = [];

    files.forEach(file => {
      const fileName = file.toLowerCase();

      // Skip temporary, partial, and hidden files
      if (fileName.includes('.part') ||
        fileName.includes('.tmp') ||
        fileName.includes('.temp') ||
        fileName.startsWith('.') ||
        fileName.includes('~') ||
        fileName.endsWith('.ytdl') ||
        fileName.includes('.f') && /\.f\d+\./.test(fileName)) { // yt-dlp fragment files
        return;
      }

      // yt-dlp specific metadata files
      if (fileName.endsWith('.cmt.xml') ||
        fileName.endsWith('.info.json') ||
        fileName.endsWith('.description') ||
        fileName.endsWith('.annotations.xml') ||
        fileName.endsWith('.live_chat.json') ||
        fileName.endsWith('.srt') ||
        fileName.endsWith('.vtt') ||
        fileName.endsWith('.ass') ||
        fileName.endsWith('.ssa') ||
        fileName.endsWith('.ttml') ||
        fileName.endsWith('.srv1') ||
        fileName.endsWith('.srv2') ||
        fileName.endsWith('.srv3')) {
        metadataFiles.push(file);
      } else {
        // Extended media extensions for yt-dlp
        const mediaExtensions = [
          // Video formats
          '.mp4', '.mkv', '.webm', '.flv', '.avi', '.mov', '.wmv', '.m4v',
          '.mpg', '.mpeg', '.3gp', '.f4v', '.ts', '.mts', '.m2ts',
          // Audio formats  
          '.mp3', '.m4a', '.aac', '.flac', '.ogg', '.wav', '.wma',
          '.opus', '.vorbis', '.ac3', '.dts',
          // Image formats (thumbnails)
          '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg',
          '.tiff', '.tif'
        ];

        if (mediaExtensions.some(ext => fileName.endsWith(ext))) {
          mediaFiles.push(file);
        } else {
          // Check for unknown extensions that might be media files
          const ext = path.extname(fileName);
          if (ext && ext.length > 1 && ext.length <= 5 && !fileName.includes(' ')) {
            console.log(`Worker ${this.taskId} found unknown file type: ${file}, treating as media`);
            mediaFiles.push(file);
          }
        }
      }
    });

    console.log(`Worker ${this.taskId} classified files - Media: ${mediaFiles.length}, Metadata: ${metadataFiles.length}`);
    return { mediaFiles, metadataFiles };
  }

  // Generate a clean filename from title and itag
  generateCleanFilename(title, itag, extension = 'mp4') {
    // Clean the title first
    let cleanTitle = title
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/[^\w\-\u4e00-\u9fff\.]/g, '') // Keep only word chars, dashes, Chinese chars, and dots
      .replace(/\.+/g, '.') // Replace multiple dots with single dot
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes

    // Calculate available space for title
    // Format: {title}_{itag}.{extension}
    const itagPart = `_${itag}`;
    const extensionPart = `.${extension}`;
    const overhead = itagPart.length + extensionPart.length;

    // Filesystem filename limit is usually 255 bytes
    // Leave some margin and limit to 200 characters total
    const maxFilenameLength = 200;
    const maxTitleLength = maxFilenameLength - overhead;

    // Truncate title if too long, but try to keep it meaningful
    if (cleanTitle.length > maxTitleLength) {
      // Try to truncate at word boundary
      const truncated = cleanTitle.substring(0, maxTitleLength);
      const lastDash = truncated.lastIndexOf('-');
      const lastSpace = truncated.lastIndexOf(' ');
      const cutPoint = Math.max(lastDash, lastSpace);

      if (cutPoint > maxTitleLength * 0.7) {
        // If we can cut at a reasonable point, do so
        cleanTitle = truncated.substring(0, cutPoint);
      } else {
        // Otherwise just hard truncate and add ellipsis indicator
        cleanTitle = truncated.substring(0, maxTitleLength - 3) + '...';
      }
    }

    // Remove any trailing dashes or dots
    cleanTitle = cleanTitle.replace(/[-\.]+$/, '');

    // Ensure we have at least some title
    if (!cleanTitle || cleanTitle.length < 3) {
      cleanTitle = 'video';
    }

    const finalFilename = `${cleanTitle}_${itag}.${extension}`;

    // Log if filename was truncated
    if (title.length > maxTitleLength) {
      console.log(`Worker ${this.taskId} truncated filename: "${title}" -> "${finalFilename}"`);
    }

    return finalFilename;
  }

  // Validate and fix filename length
  validateFilenameLength(filename, maxLength = 200) {
    if (filename.length <= maxLength) {
      return filename;
    }

    const parts = filename.split('.');
    const extension = parts.pop();
    const nameWithoutExt = parts.join('.');

    const maxNameLength = maxLength - extension.length - 1; // -1 for the dot

    if (maxNameLength > 10) {
      const truncatedName = nameWithoutExt.substring(0, maxNameLength - 3) + '...';
      return `${truncatedName}.${extension}`;
    } else {
      // If even with truncation we can't fit, use a very short name
      return `file_${Date.now()}.${extension}`;
    }
  }

  // Rename downloaded files with title_itag prefix
  renameDownloadedFiles(mediaFiles, downloadDir, title, itag) {
    const renamedFiles = [];

    for (const originalFile of mediaFiles) {
      const originalPath = path.join(downloadDir, originalFile);
      const ext = path.extname(originalFile).slice(1); // Remove the dot
      let newFilename = this.generateCleanFilename(title, itag, ext);

      // Validate and fix filename length
      newFilename = this.validateFilenameLength(newFilename);

      const newPath = path.join(downloadDir, newFilename);

      try {
        // Check if the new filename already exists
        if (fs.existsSync(newPath) && newPath !== originalPath) {
          // Add a random suffix to avoid conflicts
          const randomSuffix = crypto.randomBytes(4).toString('hex');
          const baseName = path.parse(newFilename).name;
          const extension = path.parse(newFilename).ext;
          let uniqueFilename = `${baseName}_${randomSuffix}${extension}`;

          // Validate the unique filename length too
          uniqueFilename = this.validateFilenameLength(uniqueFilename);

          const uniquePath = path.join(downloadDir, uniqueFilename);
          fs.renameSync(originalPath, uniquePath);
          renamedFiles.push(uniqueFilename);
          console.log(`Worker ${this.taskId} renamed ${originalFile} to ${uniqueFilename}`);
        } else if (originalPath !== newPath) {
          fs.renameSync(originalPath, newPath);
          renamedFiles.push(newFilename);
          console.log(`Worker ${this.taskId} renamed ${originalFile} to ${newFilename}`);
        } else {
          // Even if no rename needed, validate the original filename length
          const validatedOriginal = this.validateFilenameLength(originalFile);
          if (validatedOriginal !== originalFile) {
            const validatedPath = path.join(downloadDir, validatedOriginal);
            fs.renameSync(originalPath, validatedPath);
            renamedFiles.push(validatedOriginal);
            console.log(`Worker ${this.taskId} shortened long filename ${originalFile} to ${validatedOriginal}`);
          } else {
            renamedFiles.push(originalFile);
          }
        }
      } catch (error) {
        console.warn(`Worker ${this.taskId} failed to rename ${originalFile}:`, error.message);
        renamedFiles.push(originalFile); // Keep original name if rename fails
      }
    }

    return renamedFiles;
  }

  // Detect if files are video/audio based on content analysis
  async analyzeFileContent(filePath) {
    try {
      const result = await new Promise((resolve, reject) => {
        const ffprobe = spawn('ffprobe', [
          '-v', 'quiet',
          '-print_format', 'json',
          '-show_streams',
          filePath
        ]);

        let stdout = '';
        ffprobe.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        ffprobe.on('close', (code) => {
          if (code === 0) {
            try {
              const data = JSON.parse(stdout);
              resolve(data);
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error('ffprobe failed'));
          }
        });

        ffprobe.on('error', reject);
      });

      const streams = result.streams || [];
      const hasVideo = streams.some(s => s.codec_type === 'video');
      const hasAudio = streams.some(s => s.codec_type === 'audio');

      return { hasVideo, hasAudio };
    } catch (error) {
      console.warn(`Worker ${this.taskId} could not analyze file content:`, error.message);
      return { hasVideo: false, hasAudio: false };
    }
  }

  // Smart file identification for DASH merging
  async identifyDashFiles(mediaFiles, downloadDir) {
    const fileAnalysis = [];

    for (const file of mediaFiles) {
      const filePath = path.join(downloadDir, file);
      const analysis = await this.analyzeFileContent(filePath);
      fileAnalysis.push({
        filename: file,
        ...analysis
      });
    }

    const videoOnlyFile = fileAnalysis.find(f => f.hasVideo && !f.hasAudio);
    const audioOnlyFile = fileAnalysis.find(f => f.hasAudio && !f.hasVideo);

    return { videoOnlyFile, audioOnlyFile };
  }

  // Merge video and audio files using FFmpeg
  async mergeVideoAudio(videoFile, audioFile, outputFile, downloadDir) {
    const videoPath = path.join(downloadDir, videoFile);
    const audioPath = path.join(downloadDir, audioFile);
    const outputPath = path.join(downloadDir, outputFile);

    console.log(`Worker ${this.taskId} merging: ${videoFile} + ${audioFile} -> ${outputFile}`);

    const args = [
      '-i', videoPath,
      '-i', audioPath,
      '-c:v', 'copy',
      '-c:a', 'copy',
      '-y',
      outputPath
    ];

    await this.executeFFmpeg(args);

    try {
      fs.unlinkSync(videoPath);
      fs.unlinkSync(audioPath);
      console.log(`Worker ${this.taskId} cleaned up temporary files`);
    } catch (error) {
      console.warn(`Worker ${this.taskId} could not clean up temporary files:`, error.message);
    }

    return outputFile;
  }
}

// Check if download tool is available and working
async function checkDownloadToolAvailable() {
  try {
    const result = await new Promise((resolve, reject) => {
      const process = spawn(DOWNLOAD_TOOL, ['--version']);
      let output = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`${DOWNLOAD_TOOL} version check failed with code ${code}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });

    console.log(`${DOWNLOAD_TOOL} version check:`, result.split('\n')[0]);
    return true;
  } catch (error) {
    console.error(`${DOWNLOAD_TOOL} is not available:`, error.message);
    console.error(`Please install ${DOWNLOAD_TOOL} to use this worker system.`);
    if (DOWNLOAD_TOOL === 'yt-dlp') {
      console.error('Install with: pip install yt-dlp');
    }
    return false;
  }
}

// Initialize and start the dispatcher
async function startWorkerSystem() {
  console.log('Starting MediaGet Download Worker System...');
  console.log(`Download tool: ${DOWNLOAD_TOOL}`);
  console.log(`Data directory: ${DATA_DIR}`);
  console.log(`Downloads directory: ${DOWNLOADS_DIR}`);
  console.log(`Worker interval: ${WORKER_INTERVAL}ms`);
  console.log(`Max concurrent downloads: ${MAX_CONCURRENT_DOWNLOADS}`);
  console.log(`Cleanup interval: ${CLEANUP_INTERVAL_HOURS} hours`);
  console.log(`Max download age: ${MAX_DOWNLOAD_AGE_HOURS} hours`);

  try {
    // Check if download tool is available
    const toolAvailable = await checkDownloadToolAvailable();
    if (!toolAvailable) {
      throw new Error(`Download tool ${DOWNLOAD_TOOL} is not available. Please install it first.`);
    }

    // Initialize database
    await initializeDatabase();
    console.log('Database initialized');

    // Create and start dispatcher
    const dispatcher = new DownloadDispatcher();
    await dispatcher.start();

    console.log('MediaGet Download Worker System is running...');

    // Handle graceful shutdown
    const shutdown = () => {
      console.log('Shutting down worker system...');
      dispatcher.stop();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    return dispatcher;

  } catch (error) {
    console.error('Failed to start worker system:', error);
    process.exit(1);
  }
}

// Start the worker system
startWorkerSystem();
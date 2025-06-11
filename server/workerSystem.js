import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import os from 'os';
import { fileURLToPath } from 'url';
import { DownloadTaskDB, UserCookiesDB } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default data directory: ~/data/media-get
const DEFAULT_DATA_DIR = path.join(os.homedir(), 'data', 'media-get');
const DATA_DIR = process.env.DATA_DIR || DEFAULT_DATA_DIR;

// Configuration
const DOWNLOADS_DIR = process.env.DOWNLOADS_DIR || path.join(DATA_DIR, 'downloads');
const WORKER_INTERVAL = parseInt(process.env.WORKER_INTERVAL) || 5000; // 5 seconds
const MAX_CONCURRENT_DOWNLOADS = parseInt(process.env.MAX_CONCURRENT_DOWNLOADS) || 3;
const CLEANUP_INTERVAL_HOURS = parseInt(process.env.CLEANUP_INTERVAL_HOURS) || 24;
const MAX_DOWNLOAD_AGE_HOURS = parseInt(process.env.MAX_DOWNLOAD_AGE_HOURS) || 24;

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  console.log(`Created downloads directory: ${DOWNLOADS_DIR}`);
}

// Dispatcher thread class for managing worker processes
export class DownloadDispatcher {
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

    console.log('Starting MediaGet Download Worker System...');
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

    console.log(`Dispatching task ${taskId} to worker thread (playlist: ${task.is_playlist})`);

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

  // Cleanup old download directories and mark files as invalid
  cleanupOldDownloads() {
    try {
      const now = Date.now();
      const maxAge = MAX_DOWNLOAD_AGE_HOURS * 60 * 60 * 1000;
      
      const items = fs.readdirSync(DOWNLOADS_DIR);
      let cleanedCount = 0;
      const cleanedTaskIds = [];
      
      for (const item of items) {
        const itemPath = path.join(DOWNLOADS_DIR, item);
        
        try {
          const stats = fs.statSync(itemPath);
          
          if (stats.isDirectory() && (now - stats.mtime.getTime()) > maxAge) {
            // The directory name should be the task_id
            cleanedTaskIds.push(item);
            
            fs.rmSync(itemPath, { recursive: true, force: true });
            cleanedCount++;
            console.log(`Cleaned up old download directory: ${item}`);
          }
        } catch (statError) {
          console.warn(`Error checking stats for ${item}:`, statError.message);
        }
      }
      
      if (cleanedCount > 0) {
        console.log(`Cleanup completed: removed ${cleanedCount} old download directories`);
        
        // Mark corresponding tasks as invalid in database
        if (cleanedTaskIds.length > 0) {
          DownloadTaskDB.markFilesCleanedUp(cleanedTaskIds).then(result => {
            console.log(`Marked ${result.changes} tasks as invalid due to file cleanup`);
          }).catch(error => {
            console.error('Error marking tasks as invalid:', error);
          });
        }
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
export class DownloadWorker {
  constructor(task, dispatcher) {
    this.task = task;
    this.dispatcher = dispatcher;
    this.taskId = task.task_id;
  }

  // Process the download task
  async process() {
    console.log(`Worker processing download task: ${this.taskId} (playlist: ${this.task.is_playlist})`);

    try {
      // Update task status to processing
      await DownloadTaskDB.updateTaskProgress(this.taskId, 0, 'processing');
      
      // Generate task download directory using task_id
      const { dirName, fullPath: downloadDir } = this.generateTaskDownloadDir();
      
      const ffmpegAvailable = await this.checkFFmpegAvailable();
      console.log(`FFmpeg available for task ${this.taskId}:`, ffmpegAvailable);
      
      const initialFiles = fs.existsSync(downloadDir) ? fs.readdirSync(downloadDir) : [];
      
      // Prepare you-get arguments
      const args = ['-o', downloadDir];
      
      // Add format selection if specified
      if (this.task.media_info && this.task.media_info.itag) {
        args.push(`--format=${this.task.media_info.itag}`);
      }
      
      // Add playlist option if this is a playlist download
      if (this.task.is_playlist) {
        args.push('-l');  // Use -l flag for playlist downloads
        console.log(`Worker ${this.taskId} downloading playlist with -l flag`);
      }
      
      // Add cookies if available
      const cookiesFile = await this.prepareCookiesFile();
      if (cookiesFile) {
        args.push('--cookies', cookiesFile);
        console.log(`Worker ${this.taskId} using cookies file: ${cookiesFile}`);
      }
      
      args.push(this.task.url);
      
      console.log(`Worker ${this.taskId} executing you-get with args:`, args);
      
      // Update progress to 25%
      await DownloadTaskDB.updateTaskProgress(this.taskId, 25);
      
      // Execute download
      const output = await this.executeYouGet(args);
      console.log(`Worker ${this.taskId} download output:`, output);
      
      // Update progress to 75%
      await DownloadTaskDB.updateTaskProgress(this.taskId, 75);
      
      // Process downloaded files
      const result = await this.processDownloadedFiles(downloadDir, initialFiles, dirName, ffmpegAvailable);
      
      // Complete the task
      await DownloadTaskDB.completeTask(this.taskId, result);
      console.log(`Worker completed task: ${this.taskId} with ${result.files.length} files`);
      
      // Clean up cookies file if it was created
      if (cookiesFile) {
        this.cleanupCookiesFile(cookiesFile);
      }
      
    } catch (error) {
      console.error(`Worker failed for task ${this.taskId}:`, error.message);
      
      // Clean error message by removing ANSI escape codes
      const cleanError = this.cleanErrorMessage(error.message);
      await DownloadTaskDB.failTask(this.taskId, cleanError);
    }
  }

  // Clean error message by removing ANSI escape codes and formatting
  cleanErrorMessage(errorMessage) {
    if (!errorMessage) return 'Download failed due to an unknown error';
    
    // Remove ANSI escape codes (color codes, formatting)
    let cleaned = errorMessage.replace(/\x1b\[[0-9;]*m/g, '');
    
    // Remove extra whitespace and newlines
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Split into lines and filter out empty/debug lines
    const lines = cleaned.split('\n').filter(line => {
      const trimmed = line.trim();
      return trimmed && 
             !trimmed.startsWith('you-get:   (') && // Debug info
             !trimmed.startsWith('[0m') && // Color codes
             !trimmed.startsWith('[33m') && // Color codes
             trimmed.length > 5; // Meaningful content
    });
    
    // Look for specific you-get error patterns and extract meaningful messages
    const errorPatterns = [
      {
        pattern: /you-get: You will need login cookies/i,
        message: 'Login required - Please sign in to the website first'
      },
      {
        pattern: /you-get: \[error\]/i,
        message: 'Download error occurred'
      },
      {
        pattern: /oops, something went wrong/i,
        message: 'Download failed - Please try again'
      },
      {
        pattern: /network.*error|connection.*error|timeout/i,
        message: 'Network connection error - Please check your internet connection'
      },
      {
        pattern: /not found|404/i,
        message: 'Content not found - The video may have been removed or is private'
      },
      {
        pattern: /permission denied|403|unauthorized/i,
        message: 'Access denied - You may need to sign in to view this content'
      },
      {
        pattern: /unsupported.*site|not.*supported/i,
        message: 'This website is not supported'
      },
      {
        pattern: /invalid.*url|malformed.*url/i,
        message: 'Invalid URL format'
      }
    ];
    
    // Check for known error patterns
    for (const { pattern, message } of errorPatterns) {
      if (pattern.test(cleaned)) {
        return message;
      }
    }
    
    // If no specific pattern matches, try to extract the most relevant error line
    const relevantLines = lines.filter(line => {
      const lower = line.toLowerCase();
      return lower.includes('error') || 
             lower.includes('failed') || 
             lower.includes('wrong') ||
             lower.includes('problem') ||
             lower.includes('issue');
    });
    
    if (relevantLines.length > 0) {
      // Take the first relevant error line and clean it up
      let errorLine = relevantLines[0];
      
      // Remove you-get prefixes
      errorLine = errorLine.replace(/^you-get:\s*/i, '');
      errorLine = errorLine.replace(/^\[error\]\s*/i, '');
      
      // Capitalize first letter
      errorLine = errorLine.charAt(0).toUpperCase() + errorLine.slice(1);
      
      // Limit length
      if (errorLine.length > 100) {
        errorLine = errorLine.substring(0, 100) + '...';
      }
      
      return errorLine;
    }
    
    // Fallback: return a generic message
    return 'Download failed - Please try again or check if the URL is valid';
  }

  // Prepare cookies file for you-get
  async prepareCookiesFile() {
    try {
      // Check if task has cookies or if user has saved cookies for this platform
      let cookiesData = null;
      
      if (this.task.cookies) {
        cookiesData = this.task.cookies;
      } else {
        // Try to get user's saved cookies for this platform
        const userCookies = await UserCookiesDB.getCookies(this.task.user_id, this.task.platform_name);
        if (userCookies) {
          cookiesData = userCookies.cookies_data;
        }
      }
      
      if (!cookiesData) {
        return null;
      }
      
      // Create temporary cookies file
      const cookiesFileName = `cookies_${this.taskId}_${Date.now()}.txt`;
      const cookiesFilePath = path.join(DOWNLOADS_DIR, cookiesFileName);
      
      fs.writeFileSync(cookiesFilePath, cookiesData, 'utf8');
      
      return cookiesFilePath;
      
    } catch (error) {
      console.warn(`Worker ${this.taskId} failed to prepare cookies file:`, error.message);
      return null;
    }
  }

  // Clean up temporary cookies file
  cleanupCookiesFile(cookiesFilePath) {
    try {
      if (fs.existsSync(cookiesFilePath)) {
        fs.unlinkSync(cookiesFilePath);
        console.log(`Worker ${this.taskId} cleaned up cookies file`);
      }
    } catch (error) {
      console.warn(`Worker ${this.taskId} failed to cleanup cookies file:`, error.message);
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

  // Execute you-get command
  executeYouGet(args) {
    return new Promise((resolve, reject) => {
      const youget = spawn('you-get', args);
      let stdout = '';
      let stderr = '';

      youget.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      youget.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      youget.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr || `Process exited with code ${code}`));
        }
      });

      youget.on('error', (error) => {
        reject(error);
      });
    });
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
    
    // Get title and itag for renaming
    const title = this.task.media_info?.title || 'download';
    const itag = this.task.media_info?.itag || 'default';
    
    // Rename files with title_itag prefix
    const renamedMediaFiles = this.renameDownloadedFiles(mediaFiles, downloadDir, title, itag);
    
    let finalFiles = [];
    let message = this.task.is_playlist 
      ? `Playlist download completed. ${renamedMediaFiles.length} files downloaded.`
      : 'Download completed successfully';
    
    if (renamedMediaFiles.length === 1 && !this.task.is_playlist) {
      finalFiles = renamedMediaFiles;
    } else if (renamedMediaFiles.length === 2 && ffmpegAvailable && !this.task.is_playlist) {
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
      if (this.task.is_playlist) {
        message = `Playlist download completed. ${renamedMediaFiles.length} files downloaded.`;
      } else {
        message = `Download completed. ${renamedMediaFiles.length} files downloaded${!ffmpegAvailable ? ' (install FFmpeg for automatic merging)' : ''}`;
      }
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
        
        // Determine file type
        const ext = path.extname(filename).toLowerCase();
        let type = 'video';
        if (['.mp3', '.m4a', '.aac', '.flac', '.ogg', '.wav'].includes(ext)) {
          type = 'audio';
        } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(ext)) {
          type = 'image';
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
      message,
      isPlaylist: this.task.is_playlist
    };
  }

  // Helper function to filter downloaded files
  findMediaFiles(files) {
    const mediaFiles = [];
    const metadataFiles = [];
    
    files.forEach(file => {
      const fileName = file.toLowerCase();
      
      if (fileName.includes('.part') || 
          fileName.includes('.tmp') || 
          fileName.startsWith('.') ||
          fileName.includes('~')) {
        return;
      }
      
      if (fileName.endsWith('.cmt.xml') || 
          fileName.endsWith('.info.json') || 
          fileName.endsWith('.description') ||
          fileName.endsWith('.annotations.xml') ||
          fileName.endsWith('.srt') ||
          fileName.endsWith('.vtt') ||
          fileName.endsWith('.ass') ||
          fileName.endsWith('.ssa')) {
        metadataFiles.push(file);
      } else {
        const mediaExtensions = [
          '.mp4', '.mkv', '.webm', '.flv', '.avi', '.mov', '.wmv', '.m4v',
          '.mp3', '.m4a', '.aac', '.flac', '.ogg', '.wav', '.wma',
          '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'
        ];
        
        if (mediaExtensions.some(ext => fileName.endsWith(ext))) {
          mediaFiles.push(file);
        }
      }
    });
    
    return { mediaFiles, metadataFiles };
  }

  // Generate a clean filename from title and itag
  generateCleanFilename(title, itag, extension = 'mp4') {
    const cleanTitle = title
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-\u4e00-\u9fff]/g, '')
      .substring(0, 80); // Shorter to accommodate itag prefix
    
    return `${cleanTitle}_${itag}.${extension}`;
  }

  // Rename downloaded files with title_itag prefix
  renameDownloadedFiles(mediaFiles, downloadDir, title, itag) {
    const renamedFiles = [];
    
    for (let i = 0; i < mediaFiles.length; i++) {
      const originalFile = mediaFiles[i];
      const originalPath = path.join(downloadDir, originalFile);
      const ext = path.extname(originalFile).slice(1); // Remove the dot
      
      // For playlists, add index to filename
      let newFilename;
      if (this.task.is_playlist && mediaFiles.length > 1) {
        const paddedIndex = String(i + 1).padStart(3, '0');
        newFilename = this.generateCleanFilename(`${title}_${paddedIndex}`, itag, ext);
      } else {
        newFilename = this.generateCleanFilename(title, itag, ext);
      }
      
      const newPath = path.join(downloadDir, newFilename);
      
      try {
        // Check if the new filename already exists
        if (fs.existsSync(newPath) && newPath !== originalPath) {
          // Add a random suffix to avoid conflicts
          const randomSuffix = crypto.randomBytes(4).toString('hex');
          const baseName = path.parse(newFilename).name;
          const extension = path.parse(newFilename).ext;
          const uniqueFilename = `${baseName}_${randomSuffix}${extension}`;
          const uniquePath = path.join(downloadDir, uniqueFilename);
          fs.renameSync(originalPath, uniquePath);
          renamedFiles.push(uniqueFilename);
          console.log(`Worker ${this.taskId} renamed ${originalFile} to ${uniqueFilename}`);
        } else if (originalPath !== newPath) {
          fs.renameSync(originalPath, newPath);
          renamedFiles.push(newFilename);
          console.log(`Worker ${this.taskId} renamed ${originalFile} to ${newFilename}`);
        } else {
          renamedFiles.push(originalFile);
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
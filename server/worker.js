import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { initializeDatabase, DownloadTaskDB } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DOWNLOADS_DIR = process.env.DOWNLOADS_DIR || path.join(__dirname, 'downloads');
const WORKER_INTERVAL = parseInt(process.env.WORKER_INTERVAL) || 5000; // 5 seconds
const MAX_CONCURRENT_DOWNLOADS = parseInt(process.env.MAX_CONCURRENT_DOWNLOADS) || 3;
const CLEANUP_INTERVAL_HOURS = parseInt(process.env.CLEANUP_INTERVAL_HOURS) || 24;
const MAX_DOWNLOAD_AGE_HOURS = parseInt(process.env.MAX_DOWNLOAD_AGE_HOURS) || 24;

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
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
      
      // Prepare you-get arguments
      const args = ['-o', downloadDir];
      
      // Add format selection if specified
      if (this.task.media_info && this.task.media_info.itag) {
        args.push(`--format=${this.task.media_info.itag}`);
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
      message
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
    
    for (const originalFile of mediaFiles) {
      const originalPath = path.join(downloadDir, originalFile);
      const ext = path.extname(originalFile).slice(1); // Remove the dot
      const newFilename = this.generateCleanFilename(title, itag, ext);
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

// Initialize and start the dispatcher
async function startWorkerSystem() {
  console.log('Starting MediaGet Download Worker System...');
  console.log(`Downloads directory: ${DOWNLOADS_DIR}`);
  console.log(`Worker interval: ${WORKER_INTERVAL}ms`);
  console.log(`Max concurrent downloads: ${MAX_CONCURRENT_DOWNLOADS}`);
  console.log(`Cleanup interval: ${CLEANUP_INTERVAL_HOURS} hours`);
  console.log(`Max download age: ${MAX_DOWNLOAD_AGE_HOURS} hours`);
  
  try {
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
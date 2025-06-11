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

// Helper function to execute you-get commands
function executeYouGet(args) {
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

// Helper function to execute FFmpeg commands
function executeFFmpeg(args) {
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

// Generate task download directory using task_id
function generateTaskDownloadDir(taskId) {
  const dirName = taskId; // Use task_id directly as directory name
  const taskDir = path.join(DOWNLOADS_DIR, dirName);
  
  if (!fs.existsSync(taskDir)) {
    fs.mkdirSync(taskDir, { recursive: true });
  }
  
  return { dirName, fullPath: taskDir };
}

// Helper function to filter downloaded files
function findMediaFiles(files) {
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

// Check if FFmpeg is available
async function checkFFmpegAvailable() {
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

// Detect if files are video/audio based on content analysis
async function analyzeFileContent(filePath) {
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
    console.warn('Could not analyze file content:', error.message);
    return { hasVideo: false, hasAudio: false };
  }
}

// Smart file identification for DASH merging
async function identifyDashFiles(mediaFiles, downloadDir) {
  const fileAnalysis = [];
  
  for (const file of mediaFiles) {
    const filePath = path.join(downloadDir, file);
    const analysis = await analyzeFileContent(filePath);
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
async function mergeVideoAudio(videoFile, audioFile, outputFile, downloadDir) {
  const videoPath = path.join(downloadDir, videoFile);
  const audioPath = path.join(downloadDir, audioFile);
  const outputPath = path.join(downloadDir, outputFile);
  
  console.log(`Merging: ${videoFile} + ${audioFile} -> ${outputFile}`);
  
  const args = [
    '-i', videoPath,
    '-i', audioPath,
    '-c:v', 'copy',
    '-c:a', 'copy',
    '-y',
    outputPath
  ];
  
  await executeFFmpeg(args);
  
  try {
    fs.unlinkSync(videoPath);
    fs.unlinkSync(audioPath);
    console.log('Cleaned up temporary files');
  } catch (error) {
    console.warn('Could not clean up temporary files:', error.message);
  }
  
  return outputFile;
}

// Generate a clean filename from title and itag
function generateCleanFilename(title, itag, extension = 'mp4') {
  const cleanTitle = title
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fff]/g, '')
    .substring(0, 80); // Shorter to accommodate itag prefix
  
  return `${cleanTitle}_${itag}.${extension}`;
}

// Rename downloaded files with title_itag prefix
function renameDownloadedFiles(mediaFiles, downloadDir, title, itag) {
  const renamedFiles = [];
  
  for (const originalFile of mediaFiles) {
    const originalPath = path.join(downloadDir, originalFile);
    const ext = path.extname(originalFile).slice(1); // Remove the dot
    const newFilename = generateCleanFilename(title, itag, ext);
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
        console.log(`Renamed ${originalFile} to ${uniqueFilename}`);
      } else if (originalPath !== newPath) {
        fs.renameSync(originalPath, newPath);
        renamedFiles.push(newFilename);
        console.log(`Renamed ${originalFile} to ${newFilename}`);
      } else {
        renamedFiles.push(originalFile);
      }
    } catch (error) {
      console.warn(`Failed to rename ${originalFile}:`, error.message);
      renamedFiles.push(originalFile); // Keep original name if rename fails
    }
  }
  
  return renamedFiles;
}

// Process a single download task
async function processDownloadTask(task) {
  const taskId = task.task_id;
  console.log(`Processing download task: ${taskId}`);

  try {
    // Update task status to processing
    await DownloadTaskDB.updateTaskStatus(taskId, 'processing', 0);
    
    // Generate task download directory using task_id
    const { dirName, fullPath: downloadDir } = generateTaskDownloadDir(taskId);
    
    const ffmpegAvailable = await checkFFmpegAvailable();
    console.log('FFmpeg available:', ffmpegAvailable);
    
    const initialFiles = fs.existsSync(downloadDir) ? fs.readdirSync(downloadDir) : [];
    
    const args = ['-o', downloadDir];
    
    // Add format selection if specified
    if (task.media_info && task.media_info.itag) {
      args.push(`--format=${task.media_info.itag}`);
    }
    
    args.push(task.url);
    
    console.log('Executing you-get with args:', args);
    
    // Update progress to 25%
    await DownloadTaskDB.updateTaskStatus(taskId, 'processing', 25);
    
    const output = await executeYouGet(args);
    console.log('Download output:', output);
    
    // Update progress to 75%
    await DownloadTaskDB.updateTaskStatus(taskId, 'processing', 75);
    
    const allFiles = fs.readdirSync(downloadDir);
    const newFiles = allFiles.filter(file => !initialFiles.includes(file));
    console.log('New files after download:', newFiles);
    
    const { mediaFiles, metadataFiles } = findMediaFiles(newFiles);
    console.log('Media files:', mediaFiles);
    
    // Get title and itag for renaming
    const title = task.media_info?.title || 'download';
    const itag = task.media_info?.itag || 'default';
    
    // Rename files with title_itag prefix
    const renamedMediaFiles = renameDownloadedFiles(mediaFiles, downloadDir, title, itag);
    
    let finalFiles = [];
    let message = 'Download completed successfully';
    
    if (renamedMediaFiles.length === 1) {
      finalFiles = renamedMediaFiles;
    } else if (renamedMediaFiles.length === 2 && ffmpegAvailable) {
      console.log('Attempting to merge DASH video and audio files...');
      
      try {
        const { videoOnlyFile, audioOnlyFile } = await identifyDashFiles(renamedMediaFiles, downloadDir);
        
        if (videoOnlyFile && audioOnlyFile) {
          console.log(`Identified video file: ${videoOnlyFile.filename}`);
          console.log(`Identified audio file: ${audioOnlyFile.filename}`);
          
          const outputFilename = generateCleanFilename(title, itag, 'mp4');
          
          const mergedFile = await mergeVideoAudio(
            videoOnlyFile.filename, 
            audioOnlyFile.filename, 
            outputFilename,
            downloadDir
          );
          finalFiles = [mergedFile];
          message = 'Download completed and video/audio merged successfully';
          console.log('Successfully merged DASH streams into:', mergedFile);
        } else {
          console.log('Could not identify separate video/audio files, using all files');
          finalFiles = renamedMediaFiles;
          message = 'Download completed (files could not be automatically merged)';
        }
      } catch (mergeError) {
        console.error('Failed to merge DASH files:', mergeError.message);
        finalFiles = renamedMediaFiles;
        message = 'Download completed but merging failed - returning all files';
      }
    } else if (renamedMediaFiles.length > 0) {
      finalFiles = renamedMediaFiles;
      message = `Download completed. ${renamedMediaFiles.length} files downloaded${!ffmpegAvailable ? ' (install FFmpeg for automatic merging)' : ''}`;
      console.log(`Multiple files downloaded (${renamedMediaFiles.length}), returning all files`);
    }
    
    if (finalFiles.length > 0) {
      // Prepare result data
      const result = {
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
      
      // Update task as completed
      await DownloadTaskDB.updateTaskStatus(taskId, 'completed', 100, result);
      console.log(`Task ${taskId} completed successfully`);
    } else {
      console.log('No media files found. All files:', newFiles);
      await DownloadTaskDB.updateTaskStatus(
        taskId, 
        'failed', 
        100, 
        null, 
        `Download completed but no media files found. Files: ${newFiles.join(', ')}`
      );
    }
    
  } catch (error) {
    console.error(`Download task ${taskId} failed:`, error.message);
    await DownloadTaskDB.updateTaskStatus(
      taskId, 
      'failed', 
      100, 
      null, 
      error.message
    );
  } finally {
    // Remove from active downloads
    activeDownloads.delete(taskId);
  }
}

// Cleanup old download directories
function cleanupOldDownloads() {
  try {
    const now = Date.now();
    const maxAge = MAX_DOWNLOAD_AGE_HOURS * 60 * 60 * 1000; // Convert to milliseconds
    
    const items = fs.readdirSync(DOWNLOADS_DIR);
    let cleanedCount = 0;
    
    for (const item of items) {
      const itemPath = path.join(DOWNLOADS_DIR, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory() && (now - stats.mtime.getTime()) > maxAge) {
        // Remove old directory
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

// Main worker loop
async function workerLoop() {
  try {
    // Check if we can process more downloads
    if (activeDownloads.size >= MAX_CONCURRENT_DOWNLOADS) {
      return;
    }
    
    // Get pending tasks
    const availableSlots = MAX_CONCURRENT_DOWNLOADS - activeDownloads.size;
    const pendingTasks = await DownloadTaskDB.getPendingTasks(availableSlots);
    
    if (pendingTasks.length === 0) {
      return;
    }
    
    console.log(`Found ${pendingTasks.length} pending tasks, processing...`);
    
    // Process each task
    for (const task of pendingTasks) {
      if (activeDownloads.size >= MAX_CONCURRENT_DOWNLOADS) {
        break;
      }
      
      // Mark as active
      activeDownloads.set(task.task_id, task);
      
      // Process task asynchronously
      processDownloadTask(task).catch(error => {
        console.error(`Error processing task ${task.task_id}:`, error);
        activeDownloads.delete(task.task_id);
      });
    }
    
  } catch (error) {
    console.error('Error in worker loop:', error);
  }
}

// Initialize and start worker
async function startWorker() {
  console.log('Starting MediaGet Download Worker...');
  console.log(`Downloads directory: ${DOWNLOADS_DIR}`);
  console.log(`Worker interval: ${WORKER_INTERVAL}ms`);
  console.log(`Max concurrent downloads: ${MAX_CONCURRENT_DOWNLOADS}`);
  console.log(`Cleanup interval: ${CLEANUP_INTERVAL_HOURS} hours`);
  console.log(`Max download age: ${MAX_DOWNLOAD_AGE_HOURS} hours`);
  
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized');
    
    // Start worker loop
    setInterval(workerLoop, WORKER_INTERVAL);
    console.log('Worker loop started');
    
    // Schedule periodic cleanup
    setInterval(cleanupOldDownloads, CLEANUP_INTERVAL_HOURS * 60 * 60 * 1000);
    
    // Run initial cleanup
    setTimeout(cleanupOldDownloads, 5000);
    
    console.log('MediaGet Download Worker is running...');
    
  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down worker...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down worker...');
  process.exit(0);
});

// Start the worker
startWorker();
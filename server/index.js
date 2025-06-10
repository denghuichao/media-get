import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration from environment
const DOWNLOADS_DIR = process.env.DOWNLOADS_DIR || path.join(__dirname, 'downloads');
const CLEANUP_INTERVAL_HOURS = parseInt(process.env.CLEANUP_INTERVAL_HOURS) || 24;
const MAX_DOWNLOAD_AGE_HOURS = parseInt(process.env.MAX_DOWNLOAD_AGE_HOURS) || 24;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/downloads', express.static(DOWNLOADS_DIR));

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// User data storage (in production, use a proper database)
const USER_DATA_FILE = path.join(__dirname, 'user-data.json');
let userData = {};

// Load existing user data
function loadUserData() {
  try {
    if (fs.existsSync(USER_DATA_FILE)) {
      const data = fs.readFileSync(USER_DATA_FILE, 'utf8');
      userData = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    userData = {};
  }
}

// Save user data
function saveUserData() {
  try {
    fs.writeFileSync(USER_DATA_FILE, JSON.stringify(userData, null, 2));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

// Initialize user data
loadUserData();

// Generate unique download directory for user
function generateUserDownloadDir(userId) {
  const randomStr = crypto.randomBytes(8).toString('hex');
  const dirName = `${userId}_${randomStr}`;
  const userDir = path.join(DOWNLOADS_DIR, dirName);
  
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  
  return { dirName, fullPath: userDir };
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

// Schedule periodic cleanup
setInterval(cleanupOldDownloads, CLEANUP_INTERVAL_HOURS * 60 * 60 * 1000);

// Run initial cleanup on startup
setTimeout(cleanupOldDownloads, 5000);

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

// Parse you-get JSON output
function parseYouGetJson(output) {
  try {
    const lines = output.split('\n');
    let jsonStart = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('{')) {
        jsonStart = i;
        break;
      }
    }
    
    if (jsonStart === -1) {
      throw new Error('No JSON found in you-get output');
    }
    
    const jsonString = lines.slice(jsonStart).join('\n');
    const data = JSON.parse(jsonString);
    
    const info = {
      site: data.site || '',
      title: data.title || '',
      formats: []
    };
    
    if (data.streams && typeof data.streams === 'object') {
      for (const [formatId, streamData] of Object.entries(data.streams)) {
        let type = 'video';
        const container = streamData.container || 'mp4';
        const quality = streamData.quality || '';
        
        if (['mp3', 'm4a', 'aac', 'flac', 'ogg', 'wav'].includes(container.toLowerCase())) {
          type = 'audio';
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(container.toLowerCase())) {
          type = 'image';
        } else if (quality.toLowerCase().includes('audio') || quality.toLowerCase().includes('kbps')) {
          type = 'audio';
        }
        
        let size = 'Unknown';
        if (streamData.size && typeof streamData.size === 'number') {
          const sizeInMB = streamData.size / (1024 * 1024);
          if (sizeInMB >= 1) {
            size = `${sizeInMB.toFixed(1)} MiB`;
          } else {
            const sizeInKB = streamData.size / 1024;
            size = `${sizeInKB.toFixed(1)} KiB`;
          }
        }
        
        let qualityNote = quality;
        if (formatId.includes('dash-') && streamData.src && Array.isArray(streamData.src) && streamData.src.length > 1) {
          qualityNote += ' (Video+Audio will be merged)';
        }
        
        info.formats.push({
          itag: formatId,
          container: container,
          quality: qualityNote,
          size: size,
          type: type
        });
      }
    }
    
    return info;
  } catch (error) {
    console.error('Error parsing you-get JSON:', error);
    throw new Error('Failed to parse you-get output');
  }
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

// Generate a clean filename from title
function generateCleanFilename(title, extension = 'mp4') {
  const cleanTitle = title
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fff]/g, '')
    .substring(0, 100);
  
  return `${cleanTitle}.${extension}`;
}

// Save download record for user
function saveDownloadRecord(userId, downloadData) {
  if (!userData[userId]) {
    userData[userId] = { downloads: [] };
  }
  
  const downloadRecord = {
    id: crypto.randomUUID(),
    ...downloadData,
    timestamp: new Date().toISOString()
  };
  
  userData[userId].downloads.unshift(downloadRecord);
  
  // Keep only last 100 downloads per user
  if (userData[userId].downloads.length > 100) {
    userData[userId].downloads = userData[userId].downloads.slice(0, 100);
  }
  
  saveUserData();
  return downloadRecord;
}

// Get user downloads
function getUserDownloads(userId) {
  return userData[userId]?.downloads || [];
}

// API Routes

// Analyze URL endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`Analyzing URL: ${url}`);
    
    const output = await executeYouGet(['--json', url]);
    const mediaInfo = parseYouGetJson(output);
    
    if (!mediaInfo.title) {
      return res.status(404).json({ error: 'No media found at this URL' });
    }

    res.json(mediaInfo);
  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ 
      error: 'Failed to analyze URL. Please check if the URL is valid and supported.',
      details: error.message 
    });
  }
});

// Download endpoint
app.post('/api/download', async (req, res) => {
  try {
    const { url, itag, outputName, userId } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log(`Starting download for user ${userId}: ${url} with format: ${itag}`);
    
    // Generate unique download directory for this user/download
    const { dirName, fullPath: downloadDir } = generateUserDownloadDir(userId);
    
    const ffmpegAvailable = await checkFFmpegAvailable();
    console.log('FFmpeg available:', ffmpegAvailable);
    
    const initialFiles = fs.existsSync(downloadDir) ? fs.readdirSync(downloadDir) : [];
    
    const args = ['-o', downloadDir];
    
    if (itag) {
      args.push(`--format=${itag}`);
    }
    
    if (outputName) {
      args.push('-O', outputName);
    }
    
    args.push(url);
    
    console.log('Executing you-get with args:', args);
    
    // Get media info for record keeping
    let mediaInfo;
    try {
      const analyzeOutput = await executeYouGet(['--json', url]);
      mediaInfo = parseYouGetJson(analyzeOutput);
    } catch (error) {
      console.warn('Could not get media info:', error.message);
      mediaInfo = { site: 'Unknown', title: 'Unknown', formats: [] };
    }
    
    const output = await executeYouGet(args);
    console.log('Download output:', output);
    
    const allFiles = fs.readdirSync(downloadDir);
    const newFiles = allFiles.filter(file => !initialFiles.includes(file));
    console.log('New files after download:', newFiles);
    
    const { mediaFiles, metadataFiles } = findMediaFiles(newFiles);
    console.log('Media files:', mediaFiles);
    
    let finalFile = null;
    let message = 'Download completed successfully';
    let status = 'completed';
    
    if (mediaFiles.length === 1) {
      finalFile = mediaFiles[0];
    } else if (mediaFiles.length === 2 && ffmpegAvailable) {
      console.log('Attempting to merge DASH video and audio files...');
      
      try {
        const { videoOnlyFile, audioOnlyFile } = await identifyDashFiles(mediaFiles, downloadDir);
        
        if (videoOnlyFile && audioOnlyFile) {
          console.log(`Identified video file: ${videoOnlyFile.filename}`);
          console.log(`Identified audio file: ${audioOnlyFile.filename}`);
          
          let outputFilename;
          if (outputName) {
            outputFilename = `${outputName}.mp4`;
          } else {
            outputFilename = generateCleanFilename(mediaInfo.title);
          }
          
          finalFile = await mergeVideoAudio(
            videoOnlyFile.filename, 
            audioOnlyFile.filename, 
            outputFilename,
            downloadDir
          );
          message = 'Download completed and video/audio merged successfully';
          console.log('Successfully merged DASH streams into:', finalFile);
        } else {
          console.log('Could not identify separate video/audio files, using first file');
          finalFile = mediaFiles[0];
          message = 'Download completed (files could not be automatically merged)';
        }
      } catch (mergeError) {
        console.error('Failed to merge DASH files:', mergeError.message);
        finalFile = mediaFiles[0];
        message = 'Download completed but merging failed - returning first file';
      }
    } else if (mediaFiles.length > 0) {
      finalFile = mediaFiles[0];
      message = `Download completed. ${mediaFiles.length} files downloaded${!ffmpegAvailable ? ' (install FFmpeg for automatic merging)' : ''}`;
      console.log(`Multiple files downloaded (${mediaFiles.length}), returning first: ${finalFile}`);
    }
    
    if (finalFile) {
      // Get file stats
      const filePath = path.join(downloadDir, finalFile);
      const stats = fs.statSync(filePath);
      const fileSizeBytes = stats.size;
      const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(1);
      
      // Determine file type
      const ext = path.extname(finalFile).toLowerCase();
      let type = 'video';
      if (['.mp3', '.m4a', '.aac', '.flac', '.ogg', '.wav'].includes(ext)) {
        type = 'audio';
      } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(ext)) {
        type = 'image';
      }
      
      // Save download record
      const downloadRecord = saveDownloadRecord(userId, {
        url,
        title: mediaInfo.title,
        site: mediaInfo.site,
        format: path.extname(finalFile).slice(1),
        quality: itag || 'default',
        size: `${fileSizeMB} MB`,
        status,
        type,
        downloadPath: `/downloads/${dirName}/${finalFile}`,
        filename: finalFile,
        downloadDir: dirName
      });
      
      const downloadUrl = `/downloads/${dirName}/${finalFile}`;
      res.json({ 
        success: true, 
        downloadUrl,
        filename: finalFile,
        message: message,
        downloadId: downloadRecord.id
      });
    } else {
      console.log('No media files found. All files:', newFiles);
      
      // Save failed download record
      saveDownloadRecord(userId, {
        url,
        title: mediaInfo.title,
        site: mediaInfo.site,
        format: 'unknown',
        quality: itag || 'default',
        size: '0 MB',
        status: 'failed',
        type: 'video'
      });
      
      res.status(500).json({ 
        error: 'Download completed but no media files found',
        details: `Files downloaded: ${newFiles.join(', ')}`
      });
    }
    
  } catch (error) {
    console.error('Download error:', error.message);
    
    // Save failed download record if we have user info
    if (req.body.userId) {
      saveDownloadRecord(req.body.userId, {
        url: req.body.url,
        title: 'Failed Download',
        site: 'Unknown',
        format: 'unknown',
        quality: req.body.itag || 'default',
        size: '0 MB',
        status: 'failed',
        type: 'video'
      });
    }
    
    res.status(500).json({ 
      error: 'Download failed. Please try again.',
      details: error.message 
    });
  }
});

// Get user downloads
app.get('/api/downloads/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const downloads = getUserDownloads(userId);
    res.json(downloads);
  } catch (error) {
    console.error('Error fetching user downloads:', error);
    res.status(500).json({ error: 'Failed to fetch downloads' });
  }
});

// Delete download record
app.delete('/api/downloads/:userId/:downloadId', (req, res) => {
  try {
    const { userId, downloadId } = req.params;
    
    if (!userData[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const downloadIndex = userData[userId].downloads.findIndex(d => d.id === downloadId);
    if (downloadIndex === -1) {
      return res.status(404).json({ error: 'Download not found' });
    }
    
    const download = userData[userId].downloads[downloadIndex];
    
    // Remove file if it exists
    if (download.downloadDir) {
      const downloadDirPath = path.join(DOWNLOADS_DIR, download.downloadDir);
      if (fs.existsSync(downloadDirPath)) {
        fs.rmSync(downloadDirPath, { recursive: true, force: true });
      }
    }
    
    // Remove from records
    userData[userId].downloads.splice(downloadIndex, 1);
    saveUserData();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting download:', error);
    res.status(500).json({ error: 'Failed to delete download' });
  }
});

// Get supported sites
app.get('/api/supported-sites', (req, res) => {
  const sites = [
    { name: 'YouTube', url: 'youtube.com', types: ['video', 'audio'] },
    { name: 'Twitter/X', url: 'x.com', types: ['video', 'image'] },
    { name: 'Instagram', url: 'instagram.com', types: ['video', 'image'] },
    { name: 'TikTok', url: 'tiktok.com', types: ['video'] },
    { name: 'Vimeo', url: 'vimeo.com', types: ['video'] },
    { name: 'Facebook', url: 'facebook.com', types: ['video'] },
    { name: 'Tumblr', url: 'tumblr.com', types: ['video', 'image', 'audio'] },
    { name: 'SoundCloud', url: 'soundcloud.com', types: ['audio'] },
    { name: 'Dailymotion', url: 'dailymotion.com', types: ['video'] },
    { name: 'Bilibili', url: 'bilibili.com', types: ['video'] },
  ];
  
  res.json(sites);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Check you-get installation
app.get('/api/check-youget', async (req, res) => {
  try {
    const output = await executeYouGet(['--version']);
    const ffmpegAvailable = await checkFFmpegAvailable();
    
    res.json({ 
      installed: true, 
      version: output.trim(),
      ffmpegAvailable: ffmpegAvailable,
      message: `you-get is properly installed${ffmpegAvailable ? ' with FFmpeg support for video/audio merging' : ' (install FFmpeg for automatic video/audio merging)'}`
    });
  } catch (error) {
    res.status(500).json({ 
      installed: false, 
      error: 'you-get is not installed or not accessible',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Downloads will be saved to: ${DOWNLOADS_DIR}`);
  console.log(`Cleanup interval: ${CLEANUP_INTERVAL_HOURS} hours`);
  console.log(`Max download age: ${MAX_DOWNLOAD_AGE_HOURS} hours`);
});
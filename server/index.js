import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { initializeDatabase, DownloadTaskDB, UserCookiesDB } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Default data directory: ~/data/media-get
const DEFAULT_DATA_DIR = path.join(os.homedir(), 'data', 'media-get');
const DATA_DIR = process.env.DATA_DIR || DEFAULT_DATA_DIR;

// Configuration from environment
const DOWNLOADS_DIR = process.env.DOWNLOADS_DIR || path.join(DATA_DIR, 'downloads');
const DOWNLOAD_TOOL = process.env.DOWNLOAD_TOOL || 'yt-dlp'; // 'you-get' or 'yt-dlp'

// Middleware
app.use(cors());
app.use(express.json());
app.use('/downloads', express.static(DOWNLOADS_DIR));

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  console.log(`Created downloads directory: ${DOWNLOADS_DIR}`);
}

// Worker system import and initialization
let workerSystem = null;

async function startWorkerSystem() {
  console.log('Starting MediaGet Download Worker System...');
  console.log(`Data directory: ${DATA_DIR}`);
  console.log(`Downloads directory: ${DOWNLOADS_DIR}`);

  try {
    // Import worker system dynamically
    const { DownloadDispatcher } = await import('./workerSystem.js');

    // Create and start dispatcher
    const dispatcher = new DownloadDispatcher();
    await dispatcher.start();

    workerSystem = dispatcher;
    console.log('MediaGet Download Worker System is running...');

    return dispatcher;

  } catch (error) {
    console.error('Failed to start worker system:', error);
    // Don't exit the server if worker fails to start
    console.warn('Server will continue without worker system');
  }
}

// Initialize database and worker system on startup
async function initializeServer() {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');

    // Start worker system
    await startWorkerSystem();

  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

// Helper function to execute download tools commands
function executeDownloadTool(args, tool = DOWNLOAD_TOOL) {
  return new Promise((resolve, reject) => {
    const downloadTool = spawn(tool, args);
    let stdout = '';
    let stderr = '';

    downloadTool.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    downloadTool.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    downloadTool.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr || `Process exited with code ${code}`));
      }
    });

    downloadTool.on('error', (error) => {
      reject(error);
    });
  });
}

// Backward compatibility function for you-get
function executeYouGet(args) {
  return executeDownloadTool(args, 'you-get');
}

// Parse yt-dlp JSON output
function parseYtDlpJson(output) {
  try {
    const lines = output.split('\n').filter(line => line.trim());
    let jsonData = null;

    // Find the JSON line
    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (data.formats || data.title) {
          jsonData = data;
          break;
        }
      } catch (e) {
        // Continue to next line
      }
    }

    if (!jsonData) {
      throw new Error('No valid JSON found in yt-dlp output');
    }

    const info = {
      site: jsonData.extractor_key || jsonData.extractor || '',
      title: jsonData.title || '',
      formats: []
    };

    if (jsonData.formats && Array.isArray(jsonData.formats)) {
      for (const format of jsonData.formats) {
        let type = 'video';
        const ext = format.ext || 'mp4';
        const quality = format.format_note || format.quality || '';

        // Determine type based on video/audio codecs
        if (format.vcodec === 'none' && format.acodec !== 'none') {
          type = 'audio';
        } else if (format.acodec === 'none' && format.vcodec !== 'none') {
          type = 'video';
        } else if (['mp3', 'm4a', 'aac', 'flac', 'ogg', 'wav'].includes(ext.toLowerCase())) {
          type = 'audio';
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext.toLowerCase())) {
          type = 'image';
        }

        let size = 'Unknown';
        if (format.filesize && typeof format.filesize === 'number') {
          const sizeInMB = format.filesize / (1024 * 1024);
          if (sizeInMB >= 1) {
            size = `${sizeInMB.toFixed(1)} MB`;
          } else {
            const sizeInKB = format.filesize / 1024;
            size = `${sizeInKB.toFixed(1)} KB`;
          }
        } else if (format.filesize_approx && typeof format.filesize_approx === 'number') {
          const sizeInMB = format.filesize_approx / (1024 * 1024);
          if (sizeInMB >= 1) {
            size = `~${sizeInMB.toFixed(1)} MB`;
          } else {
            const sizeInKB = format.filesize_approx / 1024;
            size = `~${sizeInKB.toFixed(1)} KB`;
          }
        }

        let qualityNote = quality;
        if (format.height) {
          qualityNote = `${format.height}p${qualityNote ? ' ' + qualityNote : ''}`;
        } else if (format.width) {
          qualityNote = `${format.width}x${qualityNote ? ' ' + qualityNote : ''}`;
        } else if (format.abr) {
          qualityNote = `${format.abr}kbps${qualityNote ? ' ' + qualityNote : ''}`;
        }

        info.formats.push({
          itag: format.format_id || format.id,
          container: ext,
          quality: qualityNote || ext,
          size: size,
          type: type
        });
      }
    }

    return info;
  } catch (error) {
    console.error('Error parsing yt-dlp JSON:', error);
    throw new Error('Failed to parse yt-dlp output');
  }
}

// Parse download tool output based on the tool used
function parseDownloadToolOutput(output, tool = DOWNLOAD_TOOL) {
  if (tool === 'yt-dlp') {
    return parseYtDlpJson(output);
  } else {
    return parseYouGetJson(output);
  }
}
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

// Helper function to detect if URL might be a playlist
function isPlaylistUrl(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();
    const searchParams = urlObj.searchParams;

    // YouTube playlist indicators
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return searchParams.has('list') ||
        pathname.includes('/playlist') ||
        pathname.includes('/channel') ||
        pathname.includes('/user');
    }

    // Bilibili playlist indicators
    if (hostname.includes('bilibili.com')) {
      return pathname.includes('/favlist') ||
        pathname.includes('/medialist') ||
        pathname.includes('/collection');
    }

    // Other common playlist patterns
    return pathname.includes('playlist') ||
      pathname.includes('album') ||
      pathname.includes('collection') ||
      searchParams.has('playlist') ||
      searchParams.has('album');
  } catch {
    return false;
  }
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

    console.log(`Analyzing URL with ${DOWNLOAD_TOOL}: ${url}`);

    let output;
    let mediaInfo;

    if (DOWNLOAD_TOOL === 'yt-dlp') {
      output = await executeDownloadTool(['--dump-json', url], 'yt-dlp');
      mediaInfo = parseYtDlpJson(output);
    } else {
      output = await executeDownloadTool(['--json', url], 'you-get');
      mediaInfo = parseYouGetJson(output);
    }

    if (!mediaInfo.title) {
      return res.status(404).json({ error: 'No media found at this URL' });
    }

    // Add playlist detection info
    mediaInfo.isPlaylist = isPlaylistUrl(url);

    res.json(mediaInfo);
  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({
      error: 'Failed to analyze URL. Please check if the URL is valid and supported.',
      details: error.message
    });
  }
});

// Create download task endpoint
app.post('/api/download', async (req, res) => {
  try {
    const { url, itag, outputName, userId, cookies, downloadPlaylist = false } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log(`Creating download task for user ${userId}: ${url} with format: ${itag}, playlist: ${downloadPlaylist}`);

    // Get media info for the task
    let mediaInfo;
    try {
      let analyzeOutput;
      if (DOWNLOAD_TOOL === 'yt-dlp') {
        analyzeOutput = await executeDownloadTool(['--dump-json', url], 'yt-dlp');
        mediaInfo = parseYtDlpJson(analyzeOutput);
      } else {
        analyzeOutput = await executeDownloadTool(['--json', url], 'you-get');
        mediaInfo = parseYouGetJson(analyzeOutput);
      }
    } catch (error) {
      console.warn('Could not get media info:', error.message);
      mediaInfo = { site: 'Unknown', title: 'Unknown', formats: [] };
    }

    // Find selected format info
    let selectedFormat = null;
    if (itag && mediaInfo.formats) {
      selectedFormat = mediaInfo.formats.find(f => f.itag === itag);
    }

    // Determine media type and platform
    let mediaType = 'video';
    if (selectedFormat) {
      mediaType = selectedFormat.type;
    } else if (mediaInfo.formats && mediaInfo.formats.length > 0) {
      mediaType = mediaInfo.formats[0].type;
    }

    // Create download task
    const taskId = uuidv4();
    const taskData = {
      user_id: userId,
      task_id: taskId,
      media_type: mediaType,
      platform_name: mediaInfo.site,
      url: url,
      media_info: {
        title: mediaInfo.title,
        site: mediaInfo.site,
        itag: itag,
        selectedFormat: selectedFormat,
        outputName: outputName,
        downloadPlaylist: downloadPlaylist
      },
      cookies: cookies || null,
      is_playlist: downloadPlaylist
    };

    const task = await DownloadTaskDB.createTask(taskData);

    console.log(`Created download task: ${taskId} (playlist: ${downloadPlaylist})`);

    res.json({
      success: true,
      taskId: taskId,
      message: downloadPlaylist
        ? 'Playlist download task created successfully. Processing will begin shortly.'
        : 'Download task created successfully. Processing will begin shortly.',
      task: {
        id: taskId,
        status: 'pending',
        title: mediaInfo.title,
        site: mediaInfo.site,
        url: url,
        isPlaylist: downloadPlaylist
      }
    });

  } catch (error) {
    console.error('Download task creation error:', error.message);
    res.status(500).json({
      error: 'Failed to create download task. Please try again.',
      details: error.message
    });
  }
});

// Get task status endpoint
app.get('/api/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await DownloadTaskDB.getTask(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Transform task data for frontend
    const response = {
      id: task.task_id,
      status: task.status,
      progress: task.progress,
      title: task.media_info?.title || 'Unknown',
      site: task.platform_name,
      url: task.url,
      mediaType: task.media_type,
      isPlaylist: task.is_playlist,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      error: task.error
    };

    // Add result data if completed
    if (task.status === 'completed' && task.result) {
      response.result = task.result;
      response.downloadUrl = task.result.files?.[0]?.downloadPath;
      response.filename = task.result.files?.[0]?.filename;
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task status' });
  }
});

// Get user downloads (tasks) with filtering
app.get('/api/downloads/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      limit = 100,
      offset = 0,
      platform,
      media_type,
      status
    } = req.query;

    const params = {
      uid: userId,
      page_info: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    };

    // Add filters if provided
    if (platform) params.platform = platform;
    if (media_type) params.media_type = media_type;
    if (status) params.status = status;

    const tasks = await DownloadTaskDB.getTasksByUid(params);

    // Transform tasks to match frontend expectations
    const downloads = tasks.map(task => ({
      id: task.task_id,
      url: task.url,
      title: task.media_info?.title || 'Unknown',
      site: task.platform_name,
      format: task.result?.files?.[0]?.format || 'unknown',
      quality: task.media_info?.selectedFormat?.quality || 'default',
      size: task.result?.files?.[0]?.size || '0 MB',
      status: task.status,
      type: task.media_type,
      timestamp: task.created_at,
      downloadPath: task.result?.files?.[0]?.downloadPath,
      filename: task.result?.files?.[0]?.filename,
      downloadDir: task.result?.downloadDir,
      progress: task.progress,
      error: task.error,
      isPlaylist: task.is_playlist,
      files: task.result?.files || null,
      fileCount: task.result?.files?.length || (task.result?.files ? 1 : 0)
    }));

    res.json(downloads);
  } catch (error) {
    console.error('Error fetching user downloads:', error);
    res.status(500).json({ error: 'Failed to fetch downloads' });
  }
});

// Delete download task
app.delete('/api/downloads/:userId/:taskId', async (req, res) => {
  try {
    const { userId, taskId } = req.params;

    // Get task to find download directory
    const task = await DownloadTaskDB.getTask(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Remove files if they exist
    if (task.result && task.result.downloadDir) {
      const downloadDirPath = path.join(DOWNLOADS_DIR, task.result.downloadDir);
      if (fs.existsSync(downloadDirPath)) {
        fs.rmSync(downloadDirPath, { recursive: true, force: true });
      }
    }

    // Delete task from database
    await DownloadTaskDB.deleteTask(taskId, userId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting download:', error);
    res.status(500).json({ error: 'Failed to delete download' });
  }
});

// Get user download statistics
app.get('/api/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await DownloadTaskDB.getTaskStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Save user cookies for a platform
app.post('/api/cookies/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { platform, cookies } = req.body;

    if (!platform || !cookies) {
      return res.status(400).json({ error: 'Platform and cookies are required' });
    }

    await UserCookiesDB.saveCookies(userId, platform, cookies);

    res.json({
      success: true,
      message: 'Cookies saved successfully'
    });
  } catch (error) {
    console.error('Error saving cookies:', error);
    res.status(500).json({ error: 'Failed to save cookies' });
  }
});

// Get user cookies for a platform
app.get('/api/cookies/:userId/:platform', async (req, res) => {
  try {
    const { userId, platform } = req.params;

    const cookies = await UserCookiesDB.getCookies(userId, platform);

    if (!cookies) {
      return res.status(404).json({ error: 'No cookies found for this platform' });
    }

    res.json({
      platform: cookies.platform_name,
      cookies: cookies.cookies_data,
      updatedAt: cookies.updated_at
    });
  } catch (error) {
    console.error('Error fetching cookies:', error);
    res.status(500).json({ error: 'Failed to fetch cookies' });
  }
});

// Get all user cookies
app.get('/api/cookies/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const cookies = await UserCookiesDB.getUserCookies(userId);

    res.json(cookies.map(cookie => ({
      platform: cookie.platform_name,
      updatedAt: cookie.updated_at
    })));
  } catch (error) {
    console.error('Error fetching user cookies:', error);
    res.status(500).json({ error: 'Failed to fetch user cookies' });
  }
});

// Delete user cookies for a platform
app.delete('/api/cookies/:userId/:platform', async (req, res) => {
  try {
    const { userId, platform } = req.params;

    await UserCookiesDB.deleteCookies(userId, platform);

    res.json({
      success: true,
      message: 'Cookies deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting cookies:', error);
    res.status(500).json({ error: 'Failed to delete cookies' });
  }
});

// Get global statistics (admin endpoint)
app.get('/api/admin/stats', async (req, res) => {
  try {
    const stats = await DownloadTaskDB.getGlobalStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching global stats:', error);
    res.status(500).json({ error: 'Failed to fetch global statistics' });
  }
});

// Get worker system status
app.get('/api/worker/status', (req, res) => {
  if (workerSystem) {
    res.json({
      running: true,
      status: workerSystem.getStatus()
    });
  } else {
    res.json({
      running: false,
      error: 'Worker system not initialized'
    });
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
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    workerSystem: workerSystem ? 'running' : 'not running'
  });
});

// Check you-get installation
app.get('/api/check-youget', async (req, res) => {
  try {
    const output = await executeYouGet(['--version']);

    // Check FFmpeg availability
    let ffmpegAvailable = false;
    try {
      await new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', ['-version']);
        ffmpeg.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error('FFmpeg not available'));
        });
        ffmpeg.on('error', reject);
      });
      ffmpegAvailable = true;
    } catch {
      ffmpegAvailable = false;
    }

    res.json({
      installed: true,
      version: output.trim(),
      ffmpegAvailable: ffmpegAvailable,
      workerSystem: workerSystem ? 'running' : 'not running',
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

// Get current config (download tool etc)
app.get('/api/config', (req, res) => {
  res.json({
    downloadTool: DOWNLOAD_TOOL
  });
});

// Handle graceful shutdown
const shutdown = () => {
  console.log('Shutting down server...');

  if (workerSystem) {
    console.log('Stopping worker system...');
    workerSystem.stop();
  }

  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start server
app.listen(PORT, async () => {
  console.log(`MediaGet API Server running on port ${PORT}`);
  console.log(`Data directory: ${DATA_DIR}`);
  console.log(`Downloads will be served from: ${DOWNLOADS_DIR}`);

  // Initialize server components
  await initializeServer();
});
import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { initializeDatabase, DownloadTaskDB } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration from environment
const DOWNLOADS_DIR = process.env.DOWNLOADS_DIR || path.join(__dirname, 'downloads');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/downloads', express.static(DOWNLOADS_DIR));

// Ensure downloads directory exists
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Initialize database on startup
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});

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

// Create download task endpoint
app.post('/api/download', async (req, res) => {
  try {
    const { url, itag, outputName, userId } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    console.log(`Creating download task for user ${userId}: ${url} with format: ${itag}`);
    
    // Get media info for the task
    let mediaInfo;
    try {
      const analyzeOutput = await executeYouGet(['--json', url]);
      mediaInfo = parseYouGetJson(analyzeOutput);
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
        outputName: outputName
      }
    };

    const task = await DownloadTaskDB.createTask(taskData);
    
    console.log(`Created download task: ${taskId}`);
    
    res.json({ 
      success: true, 
      taskId: taskId,
      message: 'Download task created successfully. Processing will begin shortly.',
      task: {
        id: taskId,
        status: 'pending',
        title: mediaInfo.title,
        site: mediaInfo.site,
        url: url
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
    
    const task = await DownloadTaskDB.getTaskById(taskId);
    
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

// Get user downloads (tasks)
app.get('/api/downloads/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 100, offset = 0 } = req.query;
    
    const tasks = await DownloadTaskDB.getUserTasks(userId, parseInt(limit), parseInt(offset));
    
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
      error: task.error
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
    const task = await DownloadTaskDB.getTaskById(taskId);
    
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
  console.log(`MediaGet API Server running on port ${PORT}`);
  console.log(`Downloads will be served from: ${DOWNLOADS_DIR}`);
});
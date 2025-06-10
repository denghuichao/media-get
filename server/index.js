import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Ensure downloads directory exists
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Helper function to remove ANSI escape codes
function stripAnsiCodes(text) {
  // Remove ANSI escape sequences like [7m, [0m, [1m, etc.
  return text.replace(/\x1b\[[0-9;]*m/g, '');
}

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

// Parse you-get info output - Updated to handle real format and strip ANSI codes
function parseYouGetInfo(output) {
  // First, strip all ANSI escape codes from the output
  const cleanOutput = stripAnsiCodes(output);
  const lines = cleanOutput.split('\n');
  
  const info = {
    site: '',
    title: '',
    formats: []
  };

  let currentFormat = null;
  let inStreamsSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Extract site and title
    if (trimmed.startsWith('site:')) {
      info.site = trimmed.replace('site:', '').trim();
    } else if (trimmed.startsWith('title:')) {
      info.title = trimmed.replace('title:', '').trim();
    }
    
    // Check if we're in the streams section
    if (trimmed.includes('streams:') || trimmed.includes('Available quality')) {
      inStreamsSection = true;
      continue;
    }
    
    if (!inStreamsSection) continue;
    
    // Parse format entries - handle both old and new you-get output formats
    if (trimmed.startsWith('- format:')) {
      // New format (like Bilibili)
      const formatMatch = trimmed.match(/- format:\s*(.+)/);
      if (formatMatch) {
        currentFormat = {
          itag: formatMatch[1].trim(),
          container: '',
          quality: '',
          size: '',
          type: 'video'
        };
      }
    } else if (trimmed.startsWith('- itag:')) {
      // Old format (like YouTube)
      const itagMatch = trimmed.match(/- itag:\s*(.+)/);
      if (itagMatch) {
        currentFormat = {
          itag: itagMatch[1].trim(),
          container: '',
          quality: '',
          size: '',
          type: 'video'
        };
      }
    } else if (currentFormat) {
      // Parse format details
      if (trimmed.startsWith('container:')) {
        currentFormat.container = trimmed.replace('container:', '').trim();
      } else if (trimmed.startsWith('quality:')) {
        currentFormat.quality = trimmed.replace('quality:', '').trim();
      } else if (trimmed.startsWith('size:')) {
        const sizeMatch = trimmed.match(/size:\s*(.+?)(?:\s*\(|$)/);
        currentFormat.size = sizeMatch ? sizeMatch[1].trim() : trimmed.replace('size:', '').trim();
        
        // When we hit size, this format entry is complete
        if (currentFormat.itag && currentFormat.container) {
          // Determine media type based on container or quality info
          let type = 'video';
          const containerLower = currentFormat.container.toLowerCase();
          const qualityLower = currentFormat.quality.toLowerCase();
          
          if (['mp3', 'm4a', 'aac', 'flac', 'ogg', 'wav'].includes(containerLower)) {
            type = 'audio';
          } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(containerLower)) {
            type = 'image';
          } else if (qualityLower.includes('audio') || qualityLower.includes('kbps')) {
            type = 'audio';
          }
          
          currentFormat.type = type;
          info.formats.push({ ...currentFormat });
        }
        currentFormat = null;
      }
    }
    
    // Handle single-line format entries (some sites)
    const singleLineMatch = trimmed.match(/^(\w+)\s+(\w+)\s+(.+?)\s+(.+)$/);
    if (singleLineMatch && inStreamsSection && !trimmed.startsWith('-') && !trimmed.includes(':')) {
      const [, itag, container, quality, size] = singleLineMatch;
      let type = 'video';
      
      if (['mp3', 'm4a', 'aac', 'flac', 'ogg'].includes(container.toLowerCase())) {
        type = 'audio';
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(container.toLowerCase())) {
        type = 'image';
      }
      
      info.formats.push({
        itag,
        container,
        quality,
        size,
        type
      });
    }
  }

  return info;
}

// API Routes

// Analyze URL endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`Analyzing URL: ${url}`);
    
    // Execute you-get with info flag
    const output = await executeYouGet(['-i', url]);
    console.log('you-get raw output:', output); // Debug log
    
    const mediaInfo = parseYouGetInfo(output);
    console.log('Parsed info:', mediaInfo); // Debug log
    
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
    const { url, itag, outputName } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Starting download: ${url} with format: ${itag}`);
    
    // Prepare you-get arguments
    const args = ['-o', downloadsDir];
    
    if (itag) {
      // Use --format for new you-get versions, --itag for older ones
      args.push(`--format=${itag}`);
    }
    
    if (outputName) {
      args.push('-O', outputName);
    }
    
    args.push(url);
    
    console.log('Executing you-get with args:', args);
    
    // Execute download
    const output = await executeYouGet(args);
    
    // Find downloaded file
    const files = fs.readdirSync(downloadsDir);
    const downloadedFile = files.find(file => 
      file.includes(outputName || 'download') || 
      files.length === 1
    ) || files[files.length - 1]; // Get the most recent file
    
    if (downloadedFile) {
      const downloadUrl = `/downloads/${downloadedFile}`;
      res.json({ 
        success: true, 
        downloadUrl,
        filename: downloadedFile,
        message: 'Download completed successfully'
      });
    } else {
      res.status(500).json({ error: 'Download completed but file not found' });
    }
    
  } catch (error) {
    console.error('Download error:', error.message);
    res.status(500).json({ 
      error: 'Download failed. Please try again.',
      details: error.message 
    });
  }
});

// Get supported sites
app.get('/api/supported-sites', (req, res) => {
  // This could be dynamically generated by parsing you-get's help
  // For now, we'll return a static list based on the documentation
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
    // Add more sites as needed
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
    res.json({ 
      installed: true, 
      version: output.trim(),
      message: 'you-get is properly installed'
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
  console.log(`Downloads will be saved to: ${downloadsDir}`);
});
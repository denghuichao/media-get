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
    // Extract JSON from output (you-get may output warnings before JSON)
    const lines = output.split('\n');
    let jsonStart = -1;
    
    // Find the line where JSON starts (look for opening brace)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('{')) {
        jsonStart = i;
        break;
      }
    }
    
    if (jsonStart === -1) {
      throw new Error('No JSON found in you-get output');
    }
    
    // Join lines from JSON start to end
    const jsonString = lines.slice(jsonStart).join('\n');
    const data = JSON.parse(jsonString);
    
    // Convert you-get JSON format to our API format
    const info = {
      site: data.site || '',
      title: data.title || '',
      formats: []
    };
    
    // Process streams object
    if (data.streams && typeof data.streams === 'object') {
      for (const [formatId, streamData] of Object.entries(data.streams)) {
        // Determine media type based on container or quality
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
        
        // Convert size from bytes to human readable format
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
        
        // Add note for DASH formats that require merging
        let qualityNote = quality;
        if (formatId.includes('dash-') && streamData.src && Array.isArray(streamData.src) && streamData.src.length > 1) {
          qualityNote += ' (Video + Audio merged)';
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
function findMainMediaFile(files) {
  // Filter out comment files, metadata files, and temporary files
  const filteredFiles = files.filter(file => {
    const fileName = file.toLowerCase();
    
    // Skip comment and metadata files
    if (fileName.endsWith('.cmt.xml') || 
        fileName.endsWith('.info.json') || 
        fileName.endsWith('.description') ||
        fileName.endsWith('.annotations.xml') ||
        fileName.endsWith('.srt') ||
        fileName.endsWith('.vtt') ||
        fileName.endsWith('.ass') ||
        fileName.endsWith('.ssa')) {
      return false;
    }
    
    // Skip temporary files and partial downloads
    if (fileName.includes('.part') || 
        fileName.includes('.tmp') || 
        fileName.startsWith('.') ||
        fileName.includes('~')) {
      return false;
    }
    
    // Look for main media files
    const mediaExtensions = [
      '.mp4', '.mkv', '.webm', '.flv', '.avi', '.mov', '.wmv', '.m4v',  // Video
      '.mp3', '.m4a', '.aac', '.flac', '.ogg', '.wav', '.wma',         // Audio
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'        // Image
    ];
    
    return mediaExtensions.some(ext => fileName.endsWith(ext));
  });
  
  // Return the first main media file found
  return filteredFiles.length > 0 ? filteredFiles[0] : null;
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
    
    // Execute you-get with JSON flag
    const output = await executeYouGet(['--json', url]);
    console.log('you-get raw output:', output); // Debug log
    
    const mediaInfo = parseYouGetJson(output);
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
    
    // Add format specification
    if (itag) {
      // Use --format for new you-get versions, --itag for older ones
      args.push(`--format=${itag}`);
    }
    
    // Add custom output name if provided
    if (outputName) {
      args.push('-O', outputName);
    }
    
    // Add URL
    args.push(url);
    
    console.log('Executing you-get with args:', args);
    
    // Execute download
    const output = await executeYouGet(args);
    console.log('Download output:', output);
    
    // Find downloaded file(s)
    const files = fs.readdirSync(downloadsDir);
    console.log('Files in downloads directory:', files);
    
    // Find the main media file (excluding comments and metadata)
    const downloadedFile = findMainMediaFile(files);
    
    if (downloadedFile) {
      const downloadUrl = `/downloads/${downloadedFile}`;
      res.json({ 
        success: true, 
        downloadUrl,
        filename: downloadedFile,
        message: 'Download completed successfully'
      });
    } else {
      // If no main media file found, list all files for debugging
      console.log('No main media file found. Available files:', files);
      res.status(500).json({ 
        error: 'Download completed but main media file not found',
        details: `Available files: ${files.join(', ')}`
      });
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
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
        
        // Check if this is a DASH format that might need merging
        let qualityNote = quality;
        if (formatId.includes('dash-') && streamData.src && Array.isArray(streamData.src) && streamData.src.length > 1) {
          qualityNote += ' (Video+Audio merged)';
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
  // Separate main media files from metadata files
  const mediaFiles = [];
  const metadataFiles = [];
  
  files.forEach(file => {
    const fileName = file.toLowerCase();
    
    // Skip temporary files and partial downloads
    if (fileName.includes('.part') || 
        fileName.includes('.tmp') || 
        fileName.startsWith('.') ||
        fileName.includes('~')) {
      return;
    }
    
    // Categorize files
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
      // Check for main media files
      const mediaExtensions = [
        '.mp4', '.mkv', '.webm', '.flv', '.avi', '.mov', '.wmv', '.m4v',  // Video
        '.mp3', '.m4a', '.aac', '.flac', '.ogg', '.wav', '.wma',         // Audio
        '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'        // Image
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

// Merge video and audio files using FFmpeg
async function mergeVideoAudio(videoFile, audioFile, outputFile) {
  const videoPath = path.join(downloadsDir, videoFile);
  const audioPath = path.join(downloadsDir, audioFile);
  const outputPath = path.join(downloadsDir, outputFile);
  
  // FFmpeg command to merge video and audio
  const args = [
    '-i', videoPath,
    '-i', audioPath,
    '-c:v', 'copy',  // Copy video stream without re-encoding
    '-c:a', 'copy',  // Copy audio stream without re-encoding
    '-y',            // Overwrite output file if it exists
    outputPath
  ];
  
  await executeFFmpeg(args);
  
  // Clean up separate files after successful merge
  try {
    fs.unlinkSync(videoPath);
    fs.unlinkSync(audioPath);
  } catch (error) {
    console.warn('Could not clean up temporary files:', error.message);
  }
  
  return outputFile;
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
    
    // Check if FFmpeg is available
    const ffmpegAvailable = await checkFFmpegAvailable();
    console.log('FFmpeg available:', ffmpegAvailable);
    
    // Get initial file list
    const initialFiles = fs.existsSync(downloadsDir) ? fs.readdirSync(downloadsDir) : [];
    
    // Prepare you-get arguments
    const args = ['-o', downloadsDir];
    
    // Add format specification
    if (itag) {
      // Use --format for format selection
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
    
    // Get new files after download
    const allFiles = fs.readdirSync(downloadsDir);
    const newFiles = allFiles.filter(file => !initialFiles.includes(file));
    console.log('New files after download:', newFiles);
    
    // Categorize the downloaded files
    const { mediaFiles, metadataFiles } = findMediaFiles(newFiles);
    console.log('Media files:', mediaFiles);
    console.log('Metadata files:', metadataFiles);
    
    let finalFile = null;
    
    // Handle different download scenarios
    if (mediaFiles.length === 1) {
      // Single file download - perfect!
      finalFile = mediaFiles[0];
    } else if (mediaFiles.length === 2 && ffmpegAvailable) {
      // Two files (likely video + audio) - try to merge with FFmpeg
      console.log('Attempting to merge video and audio files...');
      
      // Identify video and audio files
      const videoFile = mediaFiles.find(file => 
        file.toLowerCase().includes('video') || 
        file.toLowerCase().endsWith('.mp4') ||
        file.toLowerCase().endsWith('.webm') ||
        file.toLowerCase().endsWith('.mkv')
      );
      
      const audioFile = mediaFiles.find(file => 
        file.toLowerCase().includes('audio') || 
        file.toLowerCase().endsWith('.m4a') ||
        file.toLowerCase().endsWith('.mp3') ||
        file.toLowerCase().endsWith('.aac')
      );
      
      if (videoFile && audioFile) {
        try {
          // Generate output filename
          const baseName = outputName || 'merged-video';
          const outputFile = `${baseName}.mp4`;
          
          // Merge the files
          finalFile = await mergeVideoAudio(videoFile, audioFile, outputFile);
          console.log('Successfully merged video and audio into:', finalFile);
        } catch (mergeError) {
          console.error('Failed to merge files:', mergeError.message);
          // Fall back to returning the first media file
          finalFile = mediaFiles[0];
        }
      } else {
        // Can't identify video/audio files clearly
        finalFile = mediaFiles[0];
      }
    } else if (mediaFiles.length > 0) {
      // Multiple files but can't merge, return the first one
      finalFile = mediaFiles[0];
      console.log(`Multiple files downloaded (${mediaFiles.length}), returning first: ${finalFile}`);
    }
    
    if (finalFile) {
      const downloadUrl = `/downloads/${finalFile}`;
      res.json({ 
        success: true, 
        downloadUrl,
        filename: finalFile,
        message: mediaFiles.length > 1 && !ffmpegAvailable 
          ? 'Download completed. Multiple files downloaded - install FFmpeg for automatic merging.'
          : 'Download completed successfully'
      });
    } else {
      // No media files found
      console.log('No media files found. All files:', newFiles);
      res.status(500).json({ 
        error: 'Download completed but no media files found',
        details: `Files downloaded: ${newFiles.join(', ')}`
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
  console.log(`Downloads will be saved to: ${downloadsDir}`);
});
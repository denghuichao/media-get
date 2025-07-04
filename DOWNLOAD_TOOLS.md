# MediaGet Download Tool Selection Guide

## Overview

MediaGet now supports two powerful download tools:

- **yt-dlp** (default): Comprehensive, actively developed, best for YouTube and international sites
- **you-get**: Fast, lightweight, excellent for Chinese platforms

## Quick Comparison

| Feature | you-get | yt-dlp |
|---------|---------|--------|
| **Performance** | ⚡ Very Fast | 🔧 Comprehensive |
| **YouTube Support** | ✅ Good | 🌟 Excellent |
| **Chinese Sites** | 🌟 Excellent | ✅ Good |
| **Site Coverage** | ~100 sites | 1000+ sites |
| **Development** | Slower updates | Very active |
| **Format Options** | Basic | Advanced |
| **Installation Size** | Smaller | Larger |

## Switching Between Tools

### Method 1: Environment Variable
```bash
# Use yt-dlp
export DOWNLOAD_TOOL=yt-dlp

# Use you-get
export DOWNLOAD_TOOL=you-get
```

### Method 2: npm Scripts
```bash
# Start with yt-dlp
npm run start:yt-dlp

# Start with you-get
npm run start:you-get
```

### Method 3: Startup Script
```bash
# Start with specific tool
./start.sh --tool=yt-dlp
./start.sh --tool=you-get
```

### Method 4: Docker
```bash
# Docker with yt-dlp
DOWNLOAD_TOOL=yt-dlp docker-compose up -d

# Docker with you-get
DOWNLOAD_TOOL=you-get docker-compose up -d
```

## Installation Requirements

### For you-get
```bash
pip install you-get
```

### For yt-dlp
```bash
pip install yt-dlp
# OR
pipx install yt-dlp
```

### Install Both (Recommended)
```bash
pip install you-get yt-dlp
```

## When to Use Which Tool

### Use **yt-dlp** for:
- YouTube videos and playlists
- Maximum site compatibility
- Advanced format selection
- Live streams
- Latest platform updates
- Best quality options

### Use **you-get** for:
- Bilibili, Weibo, and Chinese platforms
- Faster downloads
- Simpler format options
- Smaller resource footprint
- Stable, proven downloads

## Configuration Examples

### .env Configuration
```env
# Use yt-dlp by default (recommended)
DOWNLOAD_TOOL=yt-dlp

# Other settings
MAX_CONCURRENT_DOWNLOADS=3
WORKER_INTERVAL=5000
```

### Runtime Switching
You can change the tool without restarting by setting the environment variable:

```bash
# Switch to yt-dlp
export DOWNLOAD_TOOL=yt-dlp

# Switch to you-get
export DOWNLOAD_TOOL=you-get
```

## Troubleshooting

### Tool Not Found
If you get "command not found" errors:

1. **Check installation:**
   ```bash
   which you-get
   which yt-dlp
   ```

2. **Install missing tool:**
   ```bash
   pip install you-get yt-dlp
   ```

3. **Check PATH:**
   ```bash
   echo $PATH
   pip show you-get yt-dlp
   ```

### Performance Issues
- **you-get**: Faster for most sites but fewer options
- **yt-dlp**: More features but can be slower on some sites

### Site-Specific Issues
- If a site doesn't work with one tool, try the other
- yt-dlp usually has better support for new sites
- you-get may work better for some Chinese platforms

## Testing Your Setup

Run the test script to verify both tools work:

```bash
npm run test:tools
# OR
./test-tools.sh
```

This will check:
- Tool installations
- Basic functionality
- Dependencies (Python, FFmpeg)
- Current configuration

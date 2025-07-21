# MediaGet -- **🚀 Powerful Download Engine**: Built on yt-dlp with extensive site support **🚀 Powerful Download Engine**: Built on yt-dlp with extensive site supportUniversal Media Downloader

A beautiful, production-ready web interface for the powerful yt-dlp media downloader with anonymous user tracking, asynchronous download processing, and HTTPS support.

## 🌟 Features

- **🔍 URL Analysis**: Analyze any media URL to see available formats and quality options
- **⚡ Asynchronous Downloads**: Download tasks are queued and processed in the background  
- **📊 Real-time Progress**: See download progress and status updates
- **📱 Download Dashboard**: View download history and manage downloads (no login required)
- **👤 Anonymous User Tracking**: Uses client fingerprinting for user identification without registration
- **🌐 1000+ Supported Sites**: Works with YouTube, Twitter, Instagram, TikTok, Bilibili, and many more
- **�️ Dual Download Engines**: Supports both you-get and yt-dlp download tools
- **�💾 Database Persistence**: All user data and download tasks are stored in SQLite database
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **🔒 HTTPS Support**: Production-ready with SSL certificates and security headers
- **🌍 Multi-language Support**: Available in 10+ languages
- **🎵 Playlist Support**: Download entire playlists from supported platforms

## 🏗️ Architecture

The application uses an asynchronous architecture:

1. **Frontend**: React application with real-time task status polling
2. **API Server**: Express.js server that handles requests and manages tasks
3. **Database**: SQLite database for persistent storage
4. **Worker Process**: Background worker that processes download tasks
5. **Nginx**: Reverse proxy with SSL termination and rate limiting

## 📋 Prerequisites

### System Requirements

- **Node.js** 18+ 
- **Python** 3.6+
- **Download Tool**: yt-dlp (recommended, extensive site support)
- **FFmpeg** (recommended for video processing)
- **Docker & Docker Compose** (for production deployment)

### Install Download Tools

#### yt-dlp Installation
```bash
# Using pip (recommended)
pip install yt-dlp

# Or using pipx (isolated installation)
pipx install yt-dlp

# Or download standalone binary (Linux/macOS)
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
chmod a+rx /usr/local/bin/yt-dlp

# Verify installation
yt-dlp --version
```

### Additional Dependencies (Optional but Recommended)

```bash
# FFmpeg for video processing and merging
# On macOS with Homebrew:
brew install ffmpeg

# On Ubuntu/Debian:
sudo apt update
sudo apt install ffmpeg

# On Windows: Download from https://ffmpeg.org/download.html
```

## 🚀 Quick Start

### Option 1: Easy Start (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd media-get
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Test your setup** (optional but recommended)
   ```bash
   npm run test:tools
   ```

4. **Start with your preferred download tool**
   ```bash
   # Start with default yt-dlp (recommended)
   npm start

   # OR start with explicit yt-dlp
   npm start

   # OR start with custom configuration
   ./start.sh --env=development
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

### Option 2: Manual Setup

1. **Install dependencies and start manually**
   ```bash
   npm install
   
   # Terminal 1: API Server
   npm run server

   # Terminal 2: Frontend (development)
   npm run dev
   ```

2. **Configure download tool** (optional)
   ```bash
   export DOWNLOAD_TOOL=yt-dlp
   ```

### Option 3: Docker Deployment

1. **Using Docker Compose**
   ```bash
   # Start with yt-dlp (includes FFmpeg for video/audio merging)
   docker-compose up -d
   ```

### Production Deployment with HTTPS

For production deployment on your domain `media-get.site`:

1. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Deploy with Docker Compose**
   ```bash
   # Production deployment
   docker-compose up -d
   ```

3. **Access your site**
   - https://media-get.site
   - https://www.media-get.site

## 🐳 Docker Deployment

### Quick Docker Setup

```bash
# Development mode
docker-compose up -d

# Production mode with SSL
docker-compose --profile production up -d
```

### Docker Features

✅ **Pre-installed Tools**: 
- yt-dlp (latest version)
- FFmpeg (for video/audio processing and merging)
- All necessary dependencies

✅ **Automatic Format Conversion**: 
- Converts MPEG transport streams to browser-compatible MP4
- Merges separate video/audio streams automatically
- Optimizes files for web playback

✅ **No Additional Setup Required**: 
- Works out of the box with all supported sites
- Handles complex video formats automatically

### Services

- **Backend Service**: Node.js with yt-dlp installed (Port 3001)
- **Frontend Service**: React application with Vite (Port 5173/80)
- **Nginx Service**: Reverse proxy with SSL (Port 80/443)
- **Certbot Service**: Automatic SSL certificate management

## 💾 Data Storage

By default, all data is stored in `~/data/media-get/`:
- **Database**: `~/data/media-get/mediaget.db`
- **Downloads**: `~/data/media-get/downloads/`

Customize the data directory:
```bash
export DATA_DIR=/custom/path/to/data
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# Required
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# API Configuration
VITE_API_BASE_URL=https://media-get.site/api

# Contact Information
VITE_CONTACT_EMAIL=support@media-get.site
VITE_GITHUB_URL=https://github.com/yourusername/mediaget
VITE_TWITTER_URL=https://twitter.com/yourusername

# SSL Configuration (Production)
SSL_EMAIL=admin@media-get.site

# Data Directory Configuration
DATA_DIR=/custom/path/to/data              # Default: ~/data/media-get
DOWNLOADS_DIR=/custom/path/to/downloads    # Default: ~/data/media-get/downloads

# Download Tool Configuration
DOWNLOAD_TOOL=yt-dlp                       # Fixed: yt-dlp only

# Worker Configuration
WORKER_INTERVAL=5000                       # Worker polling interval (ms)
MAX_CONCURRENT_DOWNLOADS=3                 # Max simultaneous downloads
CLEANUP_INTERVAL_HOURS=24                  # How often to cleanup old files
MAX_DOWNLOAD_AGE_HOURS=24                  # Max age before files are deleted
```

### Download Tool Selection

MediaGet uses yt-dlp as the download engine, providing:

- **Extensive Site Support**: 1800+ supported sites and growing
- **Active Development**: Regular updates and new features
- **Advanced Options**: Custom format selection, subtitle downloads, metadata extraction
- **FFmpeg Integration**: Automatic video/audio merging and format conversion

## 🔒 HTTPS and SSL Setup

### Prerequisites for HTTPS

- Domain `media-get.site` pointing to your server's IP address
- Ports 80 and 443 open on your server
- Docker and Docker Compose installed

### Automatic SSL Setup

The deployment script automatically:
- Obtains SSL certificates from Let's Encrypt
- Configures HTTPS redirects
- Sets up security headers
- Enables automatic certificate renewal

### Manual SSL Setup

```bash
# Set up SSL certificates
chmod +x scripts/ssl-setup.sh
./scripts/ssl-setup.sh

# Set up automatic renewal (add to crontab)
0 12 * * * /path/to/your/project/certbot-renew.sh
```

### Security Features

- **HTTPS Enforcement**: All HTTP traffic redirects to HTTPS
- **HSTS Headers**: HTTP Strict Transport Security
- **Security Headers**: XSS protection, content type sniffing protection
- **Rate Limiting**: API (10 req/s) and Download (2 req/s) endpoints
- **Modern TLS**: TLS 1.2+ with secure cipher suites

## 📊 API Documentation

### Core Endpoints

#### Analyze Media URL
```http
POST /api/analyze
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

#### Create Download Task
```http
POST /api/download
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "userId": "user_123",
  "itag": "22",
  "downloadPlaylist": false
}
```

#### Get Task Status
```http
GET /api/task/{taskId}
```

#### User Downloads
```http
GET /api/downloads/{userId}
DELETE /api/downloads/{userId}/{taskId}
```

#### System Health
```http
GET /api/health
GET /api/check-yt-dlp
GET /api/supported-sites
```

### Response Examples

**Analysis Response**:
```json
{
  "site": "YouTube",
  "title": "Rick Astley - Never Gonna Give You Up",
  "formats": [
    {
      "itag": "22",
      "container": "mp4",
      "quality": "hd720",
      "size": "45.2 MiB",
      "type": "video"
    }
  ]
}
```

**Download Response**:
```json
{
  "success": true,
  "taskId": "abc123-def456",
  "message": "Download started successfully"
}
```

## 🗄️ Database Schema

### download_tasks Table

```sql
CREATE TABLE download_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  task_id TEXT UNIQUE NOT NULL,
  media_type TEXT NOT NULL,
  platform_name TEXT NOT NULL,
  url TEXT NOT NULL,
  media_info TEXT,
  status TEXT DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  result TEXT,
  error TEXT,
  cookies TEXT,
  is_playlist BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Task Status Flow

1. **pending**: Task created, waiting to be processed
2. **processing**: Worker is downloading the media
3. **completed**: Download finished successfully
4. **failed**: Download failed with error
5. **invalid**: Files cleaned up due to age

## 🌐 Supported Platforms

### Popular International Sites
- YouTube, Twitter/X, Instagram, TikTok
- Vimeo, Facebook, Tumblr, SoundCloud
- Dailymotion, Pinterest, Flickr, VK

### Chinese Platforms
- Bilibili 哔哩哔哩, iQIYI 爱奇艺, Youku 优酷
- QQ 腾讯视频, Weibo 微博, Douyin 抖音
- NetEase 网易, Baidu 百度, Kuaishou 快手

### Japanese Platforms
- Niconico ニコニコ動画, 755 ナナゴーゴー

### Korean Platforms
- Naver 네이버

**Total: 500+ supported platforms**

## 🛠️ yt-dlp Integration

### How It Works

The backend integrates with yt-dlp as a command-line utility:

1. **Analysis**: `yt-dlp --dump-json <url>` to extract comprehensive media information
2. **Download**: `yt-dlp -f <format_id> -o /downloads <url>` to download files
3. **Format Conversion**: FFmpeg automatically merges video/audio streams
4. **File Serving**: Express serves downloaded files via static middleware

### Command Examples

```bash
# Get video info (JSON format)
yt-dlp --dump-json https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Download specific format
yt-dlp -f 22 -o /downloads https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Download playlist
yt-dlp -o /downloads https://www.youtube.com/playlist?list=...
```

## 🔧 Development

### Project Structure

```
mediaget/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── services/          # API service layer
│   ├── i18n/              # Internationalization
│   └── utils/             # Utility functions
├── server/                # Backend Node.js application
│   ├── index.js           # Main API server
│   ├── worker.js          # Download worker process
│   ├── database.js        # Database operations
│   └── workerSystem.js    # Worker system management
├── scripts/               # Deployment scripts
├── docker-compose.yml     # Docker configuration
└── nginx.conf            # Nginx configuration
```

### Available Scripts

```bash
# Development
npm run dev          # Start frontend development server
npm run server       # Start backend API server
npm run worker       # Start download worker

# Production
npm run build        # Build frontend for production
npm run preview      # Preview production build

# Deployment
./scripts/deploy.sh  # Full production deployment
./scripts/ssl-setup.sh # SSL certificate setup
```

### Adding New Features

1. **Frontend**: Built with React, TypeScript, Tailwind CSS
2. **Backend**: Node.js with Express, SQLite database
3. **Authentication**: Clerk for secure user management
4. **Internationalization**: React-i18next with 10+ languages

## 🚨 Troubleshooting

### Common Issues

#### "yt-dlp is not installed" Error
```bash
# Test yt-dlp installation
yt-dlp --version

# If not found, install it:
pip install yt-dlp
```

#### Database Issues
```bash
# Reset database
rm ~/data/media-get/mediaget.db
npm run server  # Recreates database
```

#### Worker Not Processing Tasks
```bash
# Check worker status
npm run worker

# Check database for pending tasks
sqlite3 ~/data/media-get/mediaget.db "SELECT * FROM download_tasks WHERE status='pending';"
```

#### SSL Certificate Issues
```bash
# Check certificate status
docker-compose run --rm certbot certificates

# Force renewal
docker-compose run --rm certbot renew --force-renewal
```

#### Authentication Issues
1. Verify Clerk publishable key in `.env.local`
2. Check domain configuration in Clerk dashboard
3. Clear browser cache and cookies

### Health Checks

```bash
# Backend health
curl https://media-get.site/api/health

# yt-dlp status
curl https://media-get.site/api/check-yt-dlp

# Frontend accessibility
curl -I https://media-get.site
```

### Log Monitoring

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f worker
docker-compose logs -f nginx
```

## 📈 Performance & Monitoring

### Performance Features
- Asynchronous download processing
- Real-time progress updates
- Automatic file cleanup
- Rate limiting protection
- Gzip compression
- HTTP/2 support

### Monitoring
- Health check endpoints
- Download statistics
- User activity tracking
- Error logging and reporting

## 🔐 Security

### Authentication & Authorization
- Clerk-based user authentication
- User-specific download isolation
- Secure session management

### Data Protection
- HTTPS enforcement
- Security headers (HSTS, CSP, XSS protection)
- Rate limiting
- Input validation and sanitization

### File Security
- Sandboxed download directories
- Automatic file cleanup
- Path traversal protection

## 🌍 Internationalization

Supported languages:
- English, 中文 (Chinese), Español (Spanish)
- Français (French), Deutsch (German), 日本語 (Japanese)
- 한국어 (Korean), Português (Portuguese)
- Русский (Russian), العربية (Arabic)

## 📄 License

This project is open source. The yt-dlp utility is licensed under the Unlicense.

## 🙏 Credits

- **yt-dlp**: The powerful command-line media downloader by [yt-dlp project](https://github.com/yt-dlp/yt-dlp)
- **React**: Frontend framework
- **Tailwind CSS**: Utility-first CSS framework
- **Express.js**: Backend web framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines

- Follow existing code style
- Add comprehensive error handling
- Update documentation
- Test with various media sources
- Maintain backward compatibility

## 📞 Support

- **Email**: denghuichao90@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/denghuichao/media-get/issues)
- **Documentation**: This README and inline code comments

---

**MediaGet** - Download media from anywhere, beautifully and securely.

*Built with ❤️ using yt-dlp, React, and modern web technologies.*

# MediaGet - Universal Media Downloader

A beautiful, production-ready web interface for the powerful you-get media downloader utility with user authentication, asynchronous download processing, and HTTPS support.

## 🌟 Features

- **🔐 User Authentication**: Secure sign-in/sign-up with Clerk
- **🔍 URL Analysis**: Analyze any media URL to see available formats and quality options
- **⚡ Asynchronous Downloads**: Download tasks are queued and processed in the background
- **📊 Real-time Progress**: See download progress and status updates
- **📱 Download Dashboard**: View download history and manage downloads (authenticated users only)
- **🌐 100+ Supported Sites**: Works with YouTube, Twitter, Instagram, TikTok, Bilibili, and many more
- **💾 Database Persistence**: All user data and download tasks are stored in SQLite database
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
- **you-get** installed (`pip install you-get`)
- **FFmpeg** (recommended for video processing)
- **Docker & Docker Compose** (for production deployment)

### Install you-get

```bash
# Using pip (recommended)
pip install you-get

# Or using pip3
pip3 install you-get

# Verify installation
you-get --version
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

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mediaget
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up authentication**
   - Create a free account at [Clerk.com](https://clerk.com)
   - Create a new application in your Clerk dashboard
   - Copy your publishable key
   - Create a `.env.local` file:
     ```env
     VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
     ```

4. **Start the services**
   ```bash
   # Terminal 1: API Server
   npm run server

   # Terminal 2: Download Worker
   npm run worker

   # Terminal 3: Frontend
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

### Production Deployment with HTTPS

For production deployment on your domain `media-get.site`:

1. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

2. **Deploy with HTTPS**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
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

### Services

- **Backend Service**: Node.js with you-get installed (Port 3001)
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

# Worker Configuration
WORKER_INTERVAL=5000                       # Worker polling interval (ms)
MAX_CONCURRENT_DOWNLOADS=3                 # Max simultaneous downloads
CLEANUP_INTERVAL_HOURS=24                  # How often to cleanup old files
MAX_DOWNLOAD_AGE_HOURS=24                  # Max age before files are deleted
```

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
GET /api/check-youget
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

**Total: 100+ supported platforms**

## 🛠️ you-get Integration

### How It Works

The backend integrates with you-get as a command-line utility:

1. **Analysis**: `you-get -i <url>` to extract media information
2. **Download**: `you-get -o /downloads --itag=<format> <url>` to download files
3. **File Serving**: Express serves downloaded files via static middleware

### Command Examples

```bash
# Get video info
you-get -i https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Download specific format
you-get --itag=22 -o /downloads https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Download playlist
you-get -l -o /downloads https://www.youtube.com/playlist?list=...
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

#### "you-get is not installed" Error
```bash
# Test you-get installation
you-get --version

# If not found, install it:
pip install you-get
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

# you-get status
curl https://media-get.site/api/check-youget

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

This project is open source. The you-get utility is licensed under the MIT License.

## 🙏 Credits

- **you-get**: The powerful command-line media downloader by [@soimort](https://github.com/soimort)
- **Clerk**: Modern authentication and user management
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

- **Email**: denghuichao0@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/denghuichao/media-get/issues)
- **Documentation**: This README and inline code comments

---

**MediaGet** - Download media from anywhere, beautifully and securely.

*Built with ❤️ using you-get, React, and modern web technologies.*

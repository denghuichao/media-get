# MediaGet - You-Get Web Interface

A beautiful web interface for the powerful you-get media downloader utility with user authentication and asynchronous download processing.

## Features

- **User Authentication**: Secure sign-in/sign-up with Clerk
- **URL Analysis**: Analyze any media URL to see available formats and quality options
- **Asynchronous Downloads**: Download tasks are queued and processed in the background
- **Real-time Progress**: See download progress and status updates
- **Download Dashboard**: View download history and manage downloads (authenticated users only)
- **100+ Supported Sites**: Works with YouTube, Twitter, Instagram, TikTok, and many more
- **Database Persistence**: All user data and download tasks are stored in SQLite database
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## Architecture

The application now uses an asynchronous architecture:

1. **Frontend**: React application with real-time task status polling
2. **API Server**: Express.js server that handles requests and manages tasks
3. **Database**: SQLite database for persistent storage
4. **Worker Process**: Background worker that processes download tasks

## Prerequisites

Before running this application, you need to have you-get installed on your system:

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

## Installation & Setup

1. **Clone or download this project**

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Set up Clerk Authentication**:
   - Create a free account at [Clerk.com](https://clerk.com)
   - Create a new application in your Clerk dashboard
   - Copy your publishable key
   - Create a `.env.local` file in the project root:
     ```
     VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
     ```

4. **Start the API server**:
   ```bash
   npm run server
   ```
   This starts the Express server on port 3001 that interfaces with you-get.

5. **Start the download worker** (in a new terminal):
   ```bash
   npm run worker
   ```
   This starts the background worker that processes download tasks.

6. **Start the frontend development server** (in a new terminal):
   ```bash
   npm run dev
   ```
   This starts the Vite development server on port 5173.

7. **Open your browser** and navigate to `http://localhost:5173`

## Database Schema

The application uses SQLite with the following main table:

### download_tasks

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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Task Status Flow

1. **pending**: Task created, waiting to be processed
2. **processing**: Worker is downloading the media
3. **completed**: Download finished successfully
4. **failed**: Download failed with error

## Usage

1. **Sign up or sign in** to create your account
2. **Paste a URL** from any supported site (YouTube, Twitter, Instagram, etc.)
3. **Click "Analyze"** to see available formats and quality options
4. **Select your preferred format** from the available options
5. **Click "Download Now"** to create a download task
6. **Monitor progress** in real-time as the task is processed
7. **View your downloads** in the Dashboard page
8. **The file will be downloaded** to your browser when ready

## API Endpoints

The backend provides several REST API endpoints:

- `POST /api/analyze` - Analyze a URL and get media information
- `POST /api/download` - Create a download task
- `GET /api/task/:taskId` - Get task status and progress
- `GET /api/downloads/:userId` - Get user's download history
- `DELETE /api/downloads/:userId/:taskId` - Delete a download task
- `GET /api/stats/:userId` - Get user download statistics
- `GET /api/supported-sites` - Get list of supported sites
- `GET /api/check-youget` - Check you-get installation status
- `GET /api/health` - Health check endpoint

## Configuration

### Environment Variables

Create a `.env.local` file with:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Optional worker configuration
WORKER_INTERVAL=5000                    # Worker polling interval (ms)
MAX_CONCURRENT_DOWNLOADS=3              # Max simultaneous downloads
CLEANUP_INTERVAL_HOURS=24               # How often to cleanup old files
MAX_DOWNLOAD_AGE_HOURS=24               # Max age before files are deleted
DOWNLOADS_DIR=./server/downloads        # Download directory
```

## Development

To contribute or modify the application:

1. **Frontend**: Built with React, TypeScript, Tailwind CSS, and Clerk
2. **Backend**: Node.js with Express, SQLite database
3. **Worker**: Background process for handling downloads
4. **Authentication**: Clerk for secure user management
5. **API**: RESTful API design with proper error handling

## Production Deployment

### Running All Services

```bash
# Terminal 1: API Server
npm run server

# Terminal 2: Download Worker
npm run worker

# Terminal 3: Frontend (development)
npm run dev

# Or build for production
npm run build
npm run preview
```

### Docker Deployment

The project includes Docker configuration for production deployment. See `README-Docker.md` for details.

## Troubleshooting

### "you-get is not installed" Error

Make sure you-get is properly installed and accessible from the command line:

```bash
# Test you-get installation
you-get --version

# If not found, install it:
pip install you-get
```

### Database Issues

The SQLite database is automatically created in `server/mediaget.db`. If you encounter issues:

```bash
# Delete the database to reset
rm server/mediaget.db

# Restart the server to recreate
npm run server
```

### Worker Not Processing Tasks

1. **Check worker status**: Make sure the worker process is running
2. **Check logs**: Look for error messages in the worker terminal
3. **Check database**: Verify tasks are being created with `pending` status
4. **Restart worker**: Stop and restart the worker process

### Authentication Issues

1. **Check Clerk setup**: Ensure your publishable key is correctly set in `.env.local`
2. **Domain configuration**: Make sure your development domain is configured in Clerk dashboard
3. **Browser issues**: Clear browser cache and cookies if experiencing login issues

## License

This project is open source. The you-get utility is licensed under the MIT License.

## Credits

- **you-get**: The powerful command-line media downloader by [@soimort](https://github.com/soimort)
- **Clerk**: Modern authentication and user management
- **UI Design**: Modern, responsive interface built with React and Tailwind CSS
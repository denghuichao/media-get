# MediaGet - You-Get Web Interface

A beautiful web interface for the powerful you-get media downloader utility with user authentication.

## Features

- **User Authentication**: Secure sign-in/sign-up with Clerk
- **URL Analysis**: Analyze any media URL to see available formats and quality options
- **Format Selection**: Choose from multiple video/audio formats and quality levels
- **Direct Downloads**: Download media files directly through the web interface (requires authentication)
- **Download Dashboard**: View download history and manage downloads (authenticated users only)
- **100+ Supported Sites**: Works with YouTube, Twitter, Instagram, TikTok, and many more
- **Real-time Progress**: See download progress and status updates
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

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

4. **Start the backend server**:
   ```bash
   npm run server
   ```
   This starts the Express server on port 3001 that interfaces with you-get.

5. **Start the frontend development server** (in a new terminal):
   ```bash
   npm run dev
   ```
   This starts the Vite development server on port 5173.

6. **Open your browser** and navigate to `http://localhost:5173`

## Usage

1. **Sign up or sign in** to create your account
2. **Paste a URL** from any supported site (YouTube, Twitter, Instagram, etc.)
3. **Click "Analyze"** to see available formats and quality options
4. **Select your preferred format** from the available options
5. **Click "Download Now"** to start the download (requires authentication)
6. **View your downloads** in the Dashboard page
7. **The file will be downloaded** to your browser's default download folder

## Authentication Features

- **Secure Authentication**: Powered by Clerk with industry-standard security
- **Social Sign-in**: Support for Google, GitHub, and other providers (configurable)
- **User Profiles**: Manage your account and preferences
- **Download History**: Track all your downloads in a personal dashboard
- **Protected Downloads**: Only authenticated users can download files

## Supported Sites

MediaGet supports 100+ websites including:

- **Video**: YouTube, Vimeo, Dailymotion, TikTok, Twitter, Instagram, Facebook
- **Audio**: SoundCloud, Bandcamp, various music platforms
- **Images**: Instagram, Twitter, Pinterest, Flickr, Tumblr
- **Chinese Sites**: Bilibili, Youku, iQIYI, and many more
- **And many others**: See the full list in the app

## API Endpoints

The backend provides several REST API endpoints:

- `POST /api/analyze` - Analyze a URL and get media information
- `POST /api/download` - Download media with specified format
- `GET /api/supported-sites` - Get list of supported sites
- `GET /api/check-youget` - Check you-get installation status
- `GET /api/health` - Health check endpoint

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx      # Navigation with auth buttons
│   │   ├── Hero.tsx        # Main download interface
│   │   ├── Dashboard.tsx   # User dashboard (protected)
│   │   └── ...
│   ├── services/           # API service layer
│   └── ...
├── server/
│   ├── index.js           # Express server
│   └── downloads/         # Downloaded files storage
└── ...
```

## Environment Variables

Create a `.env.local` file with:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

## Troubleshooting

### "you-get is not installed" Error

Make sure you-get is properly installed and accessible from the command line:

```bash
# Test you-get installation
you-get --version

# If not found, install it:
pip install you-get
```

### Authentication Issues

1. **Check Clerk setup**: Ensure your publishable key is correctly set in `.env.local`
2. **Domain configuration**: Make sure your development domain is configured in Clerk dashboard
3. **Browser issues**: Clear browser cache and cookies if experiencing login issues

### Download Fails

1. **Authentication required**: Make sure you're signed in
2. **Check URL validity**: Make sure the URL is accessible and contains media
3. **Site support**: Verify the site is supported by you-get
4. **Network issues**: Some sites may be blocked or require specific network configurations
5. **Format availability**: Try different format options if the selected one fails

### Backend Connection Issues

1. **Check server status**: Make sure the backend server is running on port 3001
2. **Port conflicts**: If port 3001 is in use, modify the port in `server/index.js`
3. **CORS issues**: The server includes CORS headers, but check browser console for any errors

## Development

To contribute or modify the application:

1. **Frontend**: Built with React, TypeScript, Tailwind CSS, and Clerk
2. **Backend**: Node.js with Express, interfacing with you-get via child processes
3. **Authentication**: Clerk for secure user management
4. **API**: RESTful API design with proper error handling

## License

This project is open source. The you-get utility is licensed under the MIT License.

## Credits

- **you-get**: The powerful command-line media downloader by [@soimort](https://github.com/soimort)
- **Clerk**: Modern authentication and user management
- **UI Design**: Modern, responsive interface built with React and Tailwind CSS
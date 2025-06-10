# MediaGet Backend API Documentation

## Overview

The MediaGet backend provides a RESTful API that serves as a web interface wrapper around the `you-get` command-line utility. It enables web applications to analyze and download media from 100+ supported platforms.

**Base URL**: `http://localhost:3001/api`

## Architecture

The backend integrates with `you-get` as a command-line utility through Node.js child processes:

- **Analysis**: Executes `you-get -i <url>` to extract media information
- **Download**: Executes `you-get -o /downloads --itag=<format> <url>` to download files
- **File Serving**: Serves downloaded files via Express static middleware

## API Endpoints

### 1. Analyze Media URL

Analyzes a URL to extract available media formats and information.

**Endpoint**: `POST /api/analyze`

**Request Body**:
```json
{
  "url": "https://www.bilibili.com/video/BV1QwT9zKE8gQ"
}
```

**Response** (Success - 200):
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
    },
    {
      "itag": "140",
      "container": "m4a",
      "quality": "128k",
      "size": "3.8 MiB",
      "type": "audio"
    }
  ]
}
```

**Response** (Error - 400/500):
```json
{
  "error": "Invalid URL format",
  "details": "URL validation failed"
}
```

**you-get Command**: `you-get -i <url>`

---

### 2. Download Media

Downloads media in the specified format.

**Endpoint**: `POST /api/download`

**Request Body**:
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "itag": "22",
  "outputName": "rick-astley-video"
}
```

**Parameters**:
- `url` (required): Media URL to download
- `itag` (optional): Format identifier from analyze response
- `outputName` (optional): Custom filename for the download

**Response** (Success - 200):
```json
{
  "success": true,
  "downloadUrl": "/downloads/rick-astley-never-gonna-give-you-up.mp4",
  "filename": "rick-astley-never-gonna-give-you-up.mp4",
  "message": "Download completed successfully"
}
```

**Response** (Error - 400/500):
```json
{
  "error": "Download failed. Please try again.",
  "details": "Network timeout occurred"
}
```

**you-get Command**: `you-get -o /downloads --itag=<format> <url>`

---

### 3. Get Supported Sites

Returns a list of supported platforms and their capabilities.

**Endpoint**: `GET /api/supported-sites`

**Response** (200):
```json
[
  {
    "name": "YouTube",
    "url": "youtube.com",
    "types": ["video", "audio"]
  },
  {
    "name": "Twitter/X",
    "url": "x.com",
    "types": ["video", "image"]
  },
  {
    "name": "Instagram",
    "url": "instagram.com",
    "types": ["video", "image"]
  }
]
```

---

### 4. Health Check

Verifies that the backend service is running.

**Endpoint**: `GET /api/health`

**Response** (200):
```json
{
  "status": "OK",
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

---

### 5. Check you-get Installation

Verifies that you-get is properly installed and accessible.

**Endpoint**: `GET /api/check-youget`

**Response** (Success - 200):
```json
{
  "installed": true,
  "version": "you-get 0.4.1650",
  "message": "you-get is properly installed"
}
```

**Response** (Error - 500):
```json
{
  "installed": false,
  "error": "you-get is not installed or not accessible",
  "details": "Command 'you-get' not found"
}
```

**you-get Command**: `you-get --version`

---

### 6. Download File Access

Serves downloaded files for client download.

**Endpoint**: `GET /downloads/<filename>`

**Example**: `GET /downloads/rick-astley-never-gonna-give-you-up.mp4`

**Response**: Binary file content with appropriate headers

**Headers**:
- `Content-Type`: Determined by file extension
- `Content-Disposition`: `attachment; filename="<filename>"`

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Human-readable error message",
  "details": "Technical details (optional)"
}
```

### Common HTTP Status Codes

- **200**: Success
- **400**: Bad Request (invalid URL, missing parameters)
- **404**: Not Found (media not found, file not found)
- **500**: Internal Server Error (you-get failure, system error)

### Common Error Scenarios

1. **Invalid URL**: Malformed or inaccessible URLs
2. **Unsupported Site**: Platform not supported by you-get
3. **Network Issues**: Connection timeouts or failures
4. **Format Unavailable**: Requested format not available for the media
5. **Download Failure**: File system or processing errors
6. **you-get Not Installed**: Missing system dependency

## you-get Integration Details

### Command Execution

The backend uses Node.js `child_process.spawn()` to execute you-get commands:

```javascript
function executeYouGet(args) {
  return new Promise((resolve, reject) => {
    const youget = spawn('you-get', args);
    // Handle stdout, stderr, and exit codes
  });
}
```

### Output Parsing

you-get output is parsed to extract structured information:

```
site: YouTube
title: Rick Astley - Never Gonna Give You Up
- itag: 22
  container: mp4
  quality: hd720
  size: 45.2 MiB
```

Becomes:
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

### File Management

- **Download Directory**: `/server/downloads/`
- **File Discovery**: Scans directory for newly created files
- **Static Serving**: Express serves files via `/downloads/` route
- **Cleanup**: Files persist until manually removed

## Security Considerations

### URL Validation

- URLs are validated using JavaScript `URL` constructor
- Only HTTP/HTTPS protocols are accepted
- Malformed URLs are rejected with 400 status

### Command Injection Prevention

- All you-get arguments are properly escaped
- User input is sanitized before command execution
- No shell interpretation of user-provided data

### File Access Restrictions

- Downloads are restricted to designated directory
- Path traversal attacks are prevented
- File serving is limited to downloaded content

### Rate Limiting

- Consider implementing rate limiting for production
- Monitor resource usage for download operations
- Implement request queuing for concurrent downloads

## Example Usage

### Frontend Integration

```javascript
// Analyze URL
const analyzeMedia = async (url) => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  return response.json();
};

// Download media
const downloadMedia = async (url, itag) => {
  const response = await fetch('/api/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, itag })
  });
  return response.json();
};

// Check system status
const checkStatus = async () => {
  const response = await fetch('/api/check-youget');
  return response.json();
};
```

### cURL Examples

```bash
# Analyze a YouTube video
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Download in specific format
curl -X POST http://localhost:3001/api/download \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "itag": "22"}'

# Check you-get installation
curl http://localhost:3001/api/check-youget

# Health check
curl http://localhost:3001/api/health

# Get supported sites
curl http://localhost:3001/api/supported-sites
```

## Development & Testing

### Starting the Backend

```bash
# Development mode
npm run server

# Production mode
NODE_ENV=production npm run server
```

### Environment Variables

```bash
NODE_ENV=production    # Environment mode
PORT=3001             # Server port (default: 3001)
```

### Logging

The backend logs important events:
- Incoming requests with URLs
- you-get command execution
- Download completion/failure
- Error conditions

### Testing you-get Integration

```bash
# Test you-get directly
you-get -i https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Test download
you-get -o ./downloads https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

## Production Deployment

### System Requirements

- Node.js 18+ 
- Python 3.6+
- you-get installed (`pip install you-get`)
- FFmpeg (recommended for video processing)

### Docker Deployment

The project includes Docker configuration:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Backend runs on port 3001
# Frontend runs on port 5173
```

### Performance Considerations

- **Concurrent Downloads**: Limit simultaneous downloads
- **Disk Space**: Monitor download directory size
- **Memory Usage**: you-get processes can be memory-intensive
- **Network Bandwidth**: Consider bandwidth limitations

### Monitoring

- Monitor `/api/health` endpoint
- Track download success/failure rates
- Monitor disk space in downloads directory
- Log analysis for error patterns

## Troubleshooting

### Common Issues

1. **"you-get is not installed"**
   - Install: `pip install you-get`
   - Verify: `you-get --version`

2. **"Download failed"**
   - Check network connectivity
   - Verify URL accessibility
   - Check disk space

3. **"No media found"**
   - URL may not contain downloadable media
   - Site may not be supported
   - Content may be private/restricted

4. **Backend not responding**
   - Check if server is running on port 3001
   - Verify no port conflicts
   - Check server logs for errors

### Debug Commands

```bash
# Test you-get directly
you-get --version
you-get -i <test-url>

# Check backend health
curl http://localhost:3001/api/health

# View server logs
npm run server
```

## API Versioning

Current API version: **v1** (implicit)

Future versions will be explicitly versioned:
- `/api/v2/analyze`
- `/api/v2/download`

## Contributing

When extending the API:

1. Maintain backward compatibility
2. Add comprehensive error handling
3. Update this documentation
4. Include example usage
5. Test with various media sources

---

**Last Updated**: January 2025  
**API Version**: 1.0  
**Backend Framework**: Express.js + you-get
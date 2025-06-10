# MediaGet Backend API Documentation

## Overview

The MediaGet backend provides a RESTful API that interfaces with the you-get command-line utility to analyze and download media from 100+ supported platforms. The backend is built with Express.js and communicates with you-get through shell commands.

**Base URL**: `http://localhost:3001`

## Authentication

Currently, the API does not require authentication at the backend level. Authentication is handled by Clerk on the frontend, and download restrictions are enforced in the UI.

## Endpoints

### 1. Analyze Media URL

Analyzes a given URL to extract media information and available formats.

**Endpoint**: `POST /api/analyze`

**Request Body**:
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
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
      "itag": "18",
      "container": "mp4", 
      "quality": "medium",
      "size": "28.1 MiB",
      "type": "video"
    }
  ]
}
```

**Response** (Error - 400/500):
```json
{
  "error": "Invalid URL format",
  "details": "Additional error information"
}
```

**you-get Command Used**:
```bash
you-get -i <url>
```

---

### 2. Download Media

Downloads media in the specified format to the server and returns a download URL.

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
- `url` (required): The media URL to download
- `itag` (optional): Specific format identifier from the analyze response
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
  "details": "Network timeout or invalid format"
}
```

**you-get Command Used**:
```bash
you-get -o /downloads --itag=<itag> -O <outputName> <url>
```

---

### 3. Get Supported Sites

Returns a list of all supported platforms and their capabilities.

**Endpoint**: `GET /api/supported-sites`

**Response** (Success - 200):
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

Checks if the backend server is running and responsive.

**Endpoint**: `GET /api/health`

**Response** (Success - 200):
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

**you-get Command Used**:
```bash
you-get --version
```

---

### 6. Static File Serving

Serves downloaded files for client download.

**Endpoint**: `GET /downloads/<filename>`

**Example**: `GET /downloads/video.mp4`

**Response**: Binary file content with appropriate headers for download

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Human-readable error message",
  "details": "Technical details (optional)"
}
```

**Common HTTP Status Codes**:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (media not found at URL)
- `500`: Internal Server Error (you-get failure, system error)

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

The backend parses you-get's text output to extract structured data:

- **Site detection**: Extracts from `site: <name>` lines
- **Title extraction**: Extracts from `title: <title>` lines  
- **Format parsing**: Parses format blocks with itag, container, quality, size
- **Type detection**: Determines media type based on container format

### File Management

- **Download Directory**: `/server/downloads/`
- **File Discovery**: Scans directory after download to find new files
- **URL Generation**: Creates `/downloads/<filename>` URLs for client access
- **Cleanup**: Files persist until manually removed (no automatic cleanup)

## Rate Limiting

Currently no rate limiting is implemented at the API level. Consider implementing rate limiting for production use:

- Analysis requests: 10 requests/minute per IP
- Download requests: 2 requests/minute per IP

## Security Considerations

1. **URL Validation**: All URLs are validated before processing
2. **Command Injection**: Arguments are properly escaped
3. **File Access**: Downloads are restricted to the designated directory
4. **Error Exposure**: Sensitive system information is not exposed in errors

## Example Usage

### Complete Download Flow

```javascript
// 1. Analyze URL
const analyzeResponse = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: 'https://example.com/video' })
});
const mediaInfo = await analyzeResponse.json();

// 2. Select format and download
const downloadResponse = await fetch('/api/download', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com/video',
    itag: mediaInfo.formats[0].itag
  })
});
const downloadResult = await downloadResponse.json();

// 3. Access downloaded file
window.open(`http://localhost:3001${downloadResult.downloadUrl}`);
```

### Error Handling Example

```javascript
try {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: invalidUrl })
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.error);
    console.error('Details:', error.details);
  }
} catch (networkError) {
  console.error('Network Error:', networkError.message);
}
```

## Development & Testing

### Starting the Server

```bash
npm run server
```

### Testing Endpoints

```bash
# Health check
curl http://localhost:3001/api/health

# Check you-get installation  
curl http://localhost:3001/api/check-youget

# Analyze a URL
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# Get supported sites
curl http://localhost:3001/api/supported-sites
```

### Logs

The server logs all requests and you-get command executions to the console for debugging.

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Configure ports, paths via environment
2. **Process Management**: Use PM2 or similar for process management  
3. **Reverse Proxy**: Use Nginx for SSL termination and load balancing
4. **File Cleanup**: Implement automatic cleanup of old downloads
5. **Rate Limiting**: Add rate limiting middleware
6. **Authentication**: Add API key or JWT authentication
7. **Monitoring**: Add health checks and monitoring
8. **Error Tracking**: Integrate error tracking service

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **child_process**: Node.js built-in for command execution
- **fs**: Node.js built-in for file system operations
- **path**: Node.js built-in for path manipulation

## you-get Requirements

- **you-get**: Must be installed and accessible in system PATH
- **Python**: Required by you-get (Python 3.6+)
- **FFmpeg**: Optional but recommended for video processing
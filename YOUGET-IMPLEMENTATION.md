# you-get Command Line Integration

## How the Backend Works

The MediaGet backend correctly integrates with you-get as a command-line utility, not as a web service. Here's how:

### 1. Command Execution Function

```javascript
function executeYouGet(args) {
  return new Promise((resolve, reject) => {
    const youget = spawn('you-get', args);  // Spawns you-get command
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
  });
}
```

### 2. URL Analysis (GET INFO)

When analyzing a URL, the backend runs:
```bash
you-get -i <url>
```

This command:
- `-i` flag: Shows information about the media without downloading
- Returns: Site name, title, available formats, quality options, file sizes

### 3. Media Download

When downloading media, the backend runs:
```bash
you-get -o /downloads --itag=<format> <url>
```

This command:
- `-o /downloads`: Sets output directory
- `--itag=<format>`: Specifies the desired format/quality
- Downloads the file to the server's downloads directory

### 4. Format Selection

The backend parses you-get's output to extract:
- Available formats (MP4, WebM, MP3, etc.)
- Quality levels (1080p, 720p, 480p, etc.)
- File sizes
- Media types (video, audio, image)

### 5. File Serving

After download:
1. you-get saves the file to `/downloads` directory
2. Backend finds the downloaded file
3. Returns a download URL: `/downloads/filename.ext`
4. Frontend triggers browser download via this URL

## you-get Command Examples

### Information Extraction
```bash
# Get video info
you-get -i https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Output includes:
# site: YouTube
# title: Rick Astley - Never Gonna Give You Up
# - itag: 22
#   container: mp4
#   quality: hd720
#   size: 45.2 MiB
```

### Download with Format
```bash
# Download specific format
you-get --itag=22 -o /downloads https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Download best quality
you-get -o /downloads https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

### Supported Sites Check
```bash
# Check you-get version and capabilities
you-get --version
you-get --help
```

## Architecture Flow

1. **Frontend** → Sends URL to `/api/analyze`
2. **Backend** → Runs `you-get -i <url>` command
3. **you-get** → Analyzes URL, returns format info
4. **Backend** → Parses output, sends to frontend
5. **Frontend** → User selects format, sends to `/api/download`
6. **Backend** → Runs `you-get --itag=<format> -o /downloads <url>`
7. **you-get** → Downloads file to server
8. **Backend** → Returns download URL
9. **Frontend** → Triggers browser download

## Error Handling

The backend handles various you-get errors:
- Invalid URLs
- Unsupported sites
- Network issues
- Format not available
- Download failures

## Docker Integration

In the Docker setup:
- `Dockerfile.backend` installs Python and you-get
- Container has you-get available in PATH
- Backend spawns you-get processes inside container
- Downloads are persisted via Docker volumes

This is the correct approach - you-get is a command-line tool, and our backend acts as a web API wrapper around it.
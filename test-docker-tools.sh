#!/bin/bash

echo "=== MediaGet Docker Environment Test ==="
echo

echo "Testing yt-dlp installation..."
if command -v yt-dlp &> /dev/null; then
    echo "✅ yt-dlp found: $(yt-dlp --version)"
else
    echo "❌ yt-dlp not found"
    exit 1
fi

echo

echo "Testing FFmpeg installation..."
if command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg found: $(ffmpeg -version | head -1)"
else
    echo "❌ FFmpeg not found"
    exit 1
fi

echo

echo "Testing yt-dlp functionality with FFmpeg..."
echo "Checking supported formats for a test video..."
yt-dlp --list-formats "https://www.youtube.com/watch?v=dQw4w9WgXcQ" | head -10

echo

echo "Testing yt-dlp merge capabilities..."
yt-dlp --help | grep -i merge

echo

echo "=== All tests completed successfully! ==="

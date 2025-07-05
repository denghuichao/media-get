#!/bin/bash

# MediaGet Download Tool Test Script
# This script tests yt-dlp installation and basic functionality

echo "🧪 MediaGet Download Tool Test Script"
echo "======================================"
echo

# Test URL for basic functionality
TEST_URL="https://www.youtube.com/watch?v=dQw4w9WgXcQ"

echo "📦 Testing yt-dlp installation..."
if command -v yt-dlp &> /dev/null; then
    echo "✅ yt-dlp is installed"
    yt-dlp --version
    
    echo "🔍 Testing yt-dlp analysis (dry run)..."
    if yt-dlp --simulate --quiet "$TEST_URL" &> /dev/null; then
        echo "✅ yt-dlp can analyze URLs"
    else
        echo "❌ yt-dlp failed to analyze test URL"
    fi
else
    echo "❌ yt-dlp is NOT installed"
    echo "   Install with: pip install yt-dlp"
fi

echo
echo "🛠️ Testing FFmpeg installation..."
if command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg is installed"
    ffmpeg -version | head -1
else
    echo "❌ FFmpeg is NOT installed"
    echo "   Install with: apt install ffmpeg (Ubuntu) or brew install ffmpeg (macOS)"
fi

echo
echo "🐍 Testing Python installation..."
if command -v python3 &> /dev/null; then
    echo "✅ Python3 is installed"
    python3 --version
else
    echo "❌ Python3 is NOT installed"
fi

echo
echo "📊 Environment Variable Configuration:"
echo "DOWNLOAD_TOOL=${DOWNLOAD_TOOL:-yt-dlp (default)}"
echo "DATA_DIR=${DATA_DIR:-~/data/media-get (default)}"
echo "DOWNLOADS_DIR=${DOWNLOADS_DIR:-~/data/media-get/downloads (default)}"
echo "MAX_CONCURRENT_DOWNLOADS=${MAX_CONCURRENT_DOWNLOADS:-3 (default)}"

echo
echo "🏁 Test Complete!"
echo
echo "💡 MediaGet uses yt-dlp as the download tool:"
echo "   ✅ yt-dlp: Extensive site support (1800+ sites)"
echo "   ✅ FFmpeg: Video/audio processing and merging"

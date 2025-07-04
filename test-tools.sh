#!/bin/bash

# MediaGet Download Tool Test Script
# This script tests both you-get and yt-dlp installations and basic functionality

echo "🧪 MediaGet Download Tool Test Script"
echo "======================================"
echo

# Test URL for basic functionality
TEST_URL="https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# Test you-get installation
echo "📦 Testing you-get installation..."
if command -v you-get &> /dev/null; then
    echo "✅ you-get is installed"
    you-get --version
    
    echo "🔍 Testing you-get analysis (dry run)..."
    if you-get --info "$TEST_URL" &> /dev/null; then
        echo "✅ you-get can analyze URLs"
    else
        echo "❌ you-get failed to analyze test URL"
    fi
else
    echo "❌ you-get is NOT installed"
    echo "   Install with: pip install you-get"
fi

echo
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
echo "💡 To change the download tool, set the environment variable:"
echo "   export DOWNLOAD_TOOL=yt-dlp     # Use yt-dlp"
echo "   export DOWNLOAD_TOOL=you-get    # Use you-get"

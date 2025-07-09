#!/bin/bash

# Test script to check the dependency checking part of start.sh

echo "🧪 Testing dependency check with different tools..."
echo

# Function to simulate the dependency checking part
check_tool() {
    local TOOL=$1
    echo "Testing with DOWNLOAD_TOOL=$TOOL"
    echo "📦 Current download tool: $TOOL"
    
    echo "🔍 Checking if $TOOL is installed..."
    if command -v "$TOOL" &> /dev/null; then
        echo "✅ $TOOL is installed"
        $TOOL --version | head -1
        echo "✅ System ready - $TOOL is installed and working"
    else
        echo "❌ $TOOL is NOT installed!"
    fi
    echo
}

# Test with yt-dlp  
check_tool "yt-dlp"

# Test with default (yt-dlp)
DEFAULT_TOOL="${DOWNLOAD_TOOL:-yt-dlp}"
echo "Testing with default tool:"
check_tool "$DEFAULT_TOOL"

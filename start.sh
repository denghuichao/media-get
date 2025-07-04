#!/bin/bash

# MediaGet Startup Script
# Provides easy startup options for different download tools

set -e

echo "🚀 MediaGet Universal Media Downloader"
echo "======================================"
echo

# Check if .env file exists, if not copy from example
if [ ! -f .env ]; then
    echo "📝 No .env file found, creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please edit it with your configuration."
fi

# Parse command line arguments
TOOL=""
ENVIRONMENT="development"

while [[ $# -gt 0 ]]; do
    case $1 in
        --tool=*)
            TOOL="${1#*=}"
            shift
            ;;
        --env=*)
            ENVIRONMENT="${1#*=}"
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [--tool=you-get|yt-dlp] [--env=development|production]"
            echo
            echo "Options:"
            echo "  --tool=TOOL        Set download tool (you-get or yt-dlp)"
            echo "  --env=ENV         Set environment (development or production)"
            echo "  --help, -h        Show this help message"
            echo
            echo "Examples:"
            echo "  $0                           # Start with default settings"
            echo "  $0 --tool=yt-dlp            # Start with yt-dlp"
            echo "  $0 --tool=you-get --env=prod # Start with you-get in production"
            exit 0
            ;;
        *)
            echo "❌ Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Set download tool if specified
if [ -n "$TOOL" ]; then
    export DOWNLOAD_TOOL="$TOOL"
    echo "🛠️ Using download tool: $TOOL"
fi

# Use the tool from environment variable or default
CURRENT_TOOL="${DOWNLOAD_TOOL:-yt-dlp}"
echo "📦 Current download tool: $CURRENT_TOOL"

# Check if the selected tool is installed
echo "🔍 Checking if $CURRENT_TOOL is installed..."
if command -v "$CURRENT_TOOL" &> /dev/null; then
    echo "✅ $CURRENT_TOOL is installed"
    $CURRENT_TOOL --version | head -1
else
    echo "❌ $CURRENT_TOOL is NOT installed!"
    echo
    if [ "$CURRENT_TOOL" = "yt-dlp" ]; then
        echo "Install yt-dlp with:"
        echo "  pip install yt-dlp"
        echo "  # or"
        echo "  pipx install yt-dlp"
    else
        echo "Install you-get with:"
        echo "  pip install you-get"
    fi
    echo
    echo "Or switch to the other tool:"
    if [ "$CURRENT_TOOL" = "yt-dlp" ]; then
        echo "  export DOWNLOAD_TOOL=you-get"
    else
        echo "  export DOWNLOAD_TOOL=yt-dlp"
    fi
    exit 1
fi

# Check for required dependencies
echo "🔍 Checking dependencies..."
missing_deps=()

if ! command -v node &> /dev/null; then
    missing_deps+=("node.js")
fi

if ! command -v python3 &> /dev/null; then
    missing_deps+=("python3")
fi

if [ ${#missing_deps[@]} -ne 0 ]; then
    echo "❌ Missing dependencies: ${missing_deps[*]}"
    echo "Please install them and try again."
    exit 1
fi

echo "✅ All dependencies are installed"
echo "✅ System ready - $CURRENT_TOOL is installed and working"

# Install npm dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
fi

# Start the application based on environment
echo
echo "🚀 Starting MediaGet in $ENVIRONMENT mode with $CURRENT_TOOL..."
echo "Press Ctrl+C to stop"
echo

if [ "$ENVIRONMENT" = "production" ]; then
    # Production mode - build and start
    echo "🏗️ Building frontend..."
    npm run build
    
    echo "🚀 Starting production server..."
    npm run preview &
    
    echo "🔧 Starting backend worker..."
    npm run server
else
    # Development mode - start dev servers
    echo "🔧 Starting backend server..."
    npm run server &
    BACKEND_PID=$!
    
    # Wait a moment for backend to start
    sleep 2
    
    echo "🎨 Starting frontend dev server..."
    npm run dev &
    FRONTEND_PID=$!
    
    # Cleanup function
    cleanup() {
        echo
        echo "🛑 Shutting down..."
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        wait
        echo "✅ Shutdown complete"
    }
    
    # Set trap for cleanup
    trap cleanup SIGINT SIGTERM
    
    # Wait for processes
    wait
fi

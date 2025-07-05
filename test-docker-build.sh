#!/bin/bash

echo "=== MediaGet Docker Build and Test ==="
echo

echo "Building backend Docker image..."
docker build -f Dockerfile.backend -t mediaget-backend-test .

if [ $? -eq 0 ]; then
    echo "✅ Backend image built successfully"
else
    echo "❌ Backend image build failed"
    exit 1
fi

echo

echo "Testing tools installation in container..."
docker run --rm mediaget-backend-test sh -c "
    echo 'Testing yt-dlp...'
    yt-dlp --version
    echo
    echo 'Testing FFmpeg...'
    ffmpeg -version | head -1
    echo
    echo 'Testing yt-dlp merge capabilities...'
    yt-dlp --help | grep -A 2 -B 2 'video.*audio'
"

if [ $? -eq 0 ]; then
    echo "✅ All tools are working correctly in Docker container"
else
    echo "❌ Tool testing failed"
    exit 1
fi

echo

echo "Cleaning up test image..."
docker rmi mediaget-backend-test

echo "=== Docker test completed successfully! ==="

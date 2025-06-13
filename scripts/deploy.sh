#!/bin/bash

# Production Deployment Script for media-get.site
# This script deploys the application with HTTPS support

set -e

echo "🚀 Deploying MediaGet to production..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found!"
    echo "📋 Please create .env.local with your configuration:"
    echo "   cp .env.example .env.local"
    echo "   # Edit .env.local with your actual values"
    exit 1
fi

# Load environment variables
source .env.local

# Validate required environment variables
if [ -z "$VITE_CLERK_PUBLISHABLE_KEY" ] || [ "$VITE_CLERK_PUBLISHABLE_KEY" = "pk_test_your_clerk_publishable_key_here" ]; then
    echo "❌ Error: VITE_CLERK_PUBLISHABLE_KEY not configured!"
    echo "📋 Please set your Clerk publishable key in .env.local"
    exit 1
fi

if [ -z "$SSL_EMAIL" ]; then
    echo "⚠️  Warning: SSL_EMAIL not set, using default admin@media-get.site"
    export SSL_EMAIL="admin@media-get.site"
fi

echo "📦 Building and starting services..."

# Build and start all services
docker-compose down
docker-compose build --no-cache
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are healthy
echo "🔍 Checking service health..."

# Check backend health
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend service is healthy"
else
    echo "❌ Backend service is not responding"
    docker-compose logs backend
    exit 1
fi

# Check frontend
if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend service is healthy"
else
    echo "❌ Frontend service is not responding"
    docker-compose logs frontend
    exit 1
fi

# Set up SSL certificates
echo "🔒 Setting up SSL certificates..."
chmod +x scripts/ssl-setup.sh
./scripts/ssl-setup.sh

echo "🎉 Deployment complete!"
echo ""
echo "🌐 Your MediaGet application is now running at:"
echo "   https://media-get.site"
echo "   https://www.media-get.site"
echo ""
echo "📊 Service URLs:"
echo "   Frontend: https://media-get.site"
echo "   API: https://media-get.site/api"
echo "   Health Check: https://media-get.site/api/health"
echo ""
echo "🔧 Management commands:"
echo "   View logs: docker-compose logs -f"
echo "   Restart: docker-compose restart"
echo "   Stop: docker-compose down"
echo "   Update: git pull && docker-compose build && docker-compose up -d"
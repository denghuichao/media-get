#!/bin/bash

# Production Deployment Script for media-get.site
# This script deploys the application with proper service startup

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

# Stop any existing services
docker-compose down --remove-orphans

# Clean up any orphaned containers
docker system prune -f

# Start with HTTP-only configuration first
echo "🌐 Starting with HTTP-only configuration..."
cp nginx-http-only.conf nginx.conf

# Build services with no cache to ensure fresh builds
echo "🔨 Building services..."
docker-compose build --no-cache

# Start services in order
echo "🚀 Starting backend service..."
docker-compose up -d backend

echo "⏳ Waiting for backend to be ready..."
timeout=60
counter=0
while ! docker-compose exec -T backend curl -f http://localhost:3001/api/health > /dev/null 2>&1; do
    if [ $counter -ge $timeout ]; then
        echo "❌ Backend service failed to start within $timeout seconds"
        echo "📋 Backend logs:"
        docker-compose logs backend
        exit 1
    fi
    echo "Waiting for backend... ($counter/$timeout)"
    sleep 2
    counter=$((counter + 2))
done
echo "✅ Backend service is ready"

echo "🚀 Starting frontend service..."
docker-compose up -d frontend

echo "⏳ Waiting for frontend to be ready..."
timeout=60
counter=0
while ! docker-compose exec -T frontend curl -f http://localhost:80/ > /dev/null 2>&1; do
    if [ $counter -ge $timeout ]; then
        echo "❌ Frontend service failed to start within $timeout seconds"
        echo "📋 Frontend logs:"
        docker-compose logs frontend
        exit 1
    fi
    echo "Waiting for frontend... ($counter/$timeout)"
    sleep 2
    counter=$((counter + 2))
done
echo "✅ Frontend service is ready"

echo "🚀 Starting nginx service..."
docker-compose up -d nginx

echo "⏳ Waiting for nginx to be ready..."
timeout=30
counter=0
while ! curl -f http://localhost:80/health > /dev/null 2>&1; do
    if [ $counter -ge $timeout ]; then
        echo "❌ Nginx service failed to start within $timeout seconds"
        echo "📋 Nginx logs:"
        docker-compose logs nginx
        exit 1
    fi
    echo "Waiting for nginx... ($counter/$timeout)"
    sleep 2
    counter=$((counter + 2))
done
echo "✅ Nginx service is ready"

# Test the application
echo "🧪 Testing application..."
if curl -f http://media-get.site/health > /dev/null 2>&1; then
    echo "✅ Application is accessible via domain"
elif curl -f http://localhost:80/health > /dev/null 2>&1; then
    echo "✅ Application is accessible via localhost"
    echo "⚠️  Note: Domain access may require DNS propagation"
else
    echo "❌ Application is not accessible"
    echo "📋 All service logs:"
    docker-compose logs
    exit 1
fi

# Test API specifically
echo "🧪 Testing API..."
if curl -f http://media-get.site/api/health > /dev/null 2>&1; then
    echo "✅ API is accessible via domain"
elif curl -f http://localhost:80/api/health > /dev/null 2>&1; then
    echo "✅ API is accessible via localhost"
else
    echo "❌ API is not accessible"
    echo "📋 Backend logs:"
    docker-compose logs backend
    exit 1
fi

# Test you-get installation
echo "🧪 Testing you-get installation..."
if curl -s http://media-get.site/api/check-youget | grep -q '"installed":true' 2>/dev/null; then
    echo "✅ you-get is properly installed"
elif curl -s http://localhost:80/api/check-youget | grep -q '"installed":true' 2>/dev/null; then
    echo "✅ you-get is properly installed"
else
    echo "⚠️  you-get installation check failed - this may be normal during startup"
    echo "📋 Backend logs:"
    docker-compose logs backend | tail -20
fi

echo "🎉 Basic deployment complete!"
echo ""
echo "🌐 Your MediaGet application is now running at:"
echo "   http://media-get.site (if DNS is configured)"
echo "   http://localhost (local access)"
echo ""
echo "📊 Service URLs:"
echo "   Frontend: http://media-get.site"
echo "   API: http://media-get.site/api"
echo "   Health Check: http://media-get.site/api/health"
echo ""
echo "🔧 Management commands:"
echo "   View logs: docker-compose logs -f"
echo "   Restart: docker-compose restart"
echo "   Stop: docker-compose down"
echo ""
echo "🔒 To set up HTTPS (after confirming HTTP works):"
echo "   ./scripts/ssl-setup.sh"
echo ""
echo "🐛 If you encounter issues:"
echo "   1. Check service logs: docker-compose logs [service-name]"
echo "   2. Check service status: docker-compose ps"
echo "   3. Test individual services:"
echo "      - Backend: curl http://localhost:3001/api/health"
echo "      - Frontend: curl http://localhost:5173/"
echo "      - Nginx: curl http://localhost:80/health"
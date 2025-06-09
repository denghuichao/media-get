# Docker Deployment Guide

This guide explains how to deploy MediaGet using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed
- `.env.local` file with your Clerk configuration

## Quick Start

1. **Clone the repository and navigate to the project directory**

2. **Create your environment file**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your actual values:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
   VITE_CONTACT_EMAIL=your-email@example.com
   VITE_GITHUB_URL=https://github.com/yourusername/mediaget
   VITE_TWITTER_URL=https://twitter.com/yourusername
   ```

3. **Start the application**:
   ```bash
   # Development mode
   docker-compose up -d
   
   # Production mode with Nginx
   docker-compose --profile production up -d
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173 (development) or http://localhost (production)
   - Backend API: http://localhost:3001
   - Health check: http://localhost:3001/api/health

## Services

### Backend Service
- **Image**: Custom Node.js with you-get installed
- **Port**: 3001
- **Features**: 
  - Python 3 and you-get pre-installed
  - FFmpeg for video processing
  - Health checks enabled
  - Persistent downloads volume

### Frontend Service
- **Image**: Custom Node.js/Nginx
- **Port**: 5173 (development) or 80 (production)
- **Features**:
  - React application with Vite
  - Environment variable injection
  - Production-optimized build

### Nginx Service (Production)
- **Image**: nginx:alpine
- **Port**: 80, 443
- **Features**:
  - Reverse proxy for frontend and backend
  - Rate limiting for API endpoints
  - Security headers
  - Gzip compression
  - Static file serving for downloads

## Development

For development with hot reloading:

```bash
# Start in development mode
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

# View logs
docker-compose logs -f

# Rebuild after changes
docker-compose build
```

## Production Deployment

For production deployment:

```bash
# Build and start with Nginx
docker-compose --profile production up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f nginx frontend backend
```

## Volumes

- `./downloads`: Persistent storage for downloaded files
- `./server`: Backend source code (development only)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk authentication key | Required |
| `VITE_CONTACT_EMAIL` | Contact email for footer | support@mediaget.com |
| `VITE_GITHUB_URL` | GitHub repository URL | https://github.com |
| `VITE_TWITTER_URL` | Twitter profile URL | https://twitter.com |
| `NODE_ENV` | Node environment | production |
| `PORT` | Backend port | 3001 |

## Health Checks

The backend service includes health checks:
- **Endpoint**: `/api/health`
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3

## Troubleshooting

### Check service status:
```bash
docker-compose ps
```

### View logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
```

### Restart services:
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Clean rebuild:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Check you-get installation:
```bash
docker-compose exec backend you-get --version
```

## Security Considerations

- Rate limiting is enabled for API endpoints
- Security headers are configured
- Downloads are served through the backend with proper authentication
- Environment variables are used for sensitive configuration

## Scaling

To scale the application:

```bash
# Scale backend service
docker-compose up -d --scale backend=3

# Scale with load balancer
docker-compose --profile production up -d --scale backend=3
```

## Backup

To backup downloaded files:

```bash
# Create backup
docker run --rm -v $(pwd)/downloads:/data -v $(pwd):/backup alpine tar czf /backup/downloads-backup.tar.gz -C /data .

# Restore backup
docker run --rm -v $(pwd)/downloads:/data -v $(pwd):/backup alpine tar xzf /backup/downloads-backup.tar.gz -C /data
```
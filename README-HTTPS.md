# HTTPS and Domain Setup Guide

This guide explains how to set up HTTPS and configure your custom domain `media-get.site` for the MediaGet application.

## Prerequisites

- Domain `media-get.site` pointing to your server's IP address
- Docker and Docker Compose installed
- Ports 80 and 443 open on your server

## Quick Setup

1. **Configure your environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

2. **Deploy with HTTPS**:
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

3. **Access your site**:
   - https://media-get.site
   - https://www.media-get.site

## Manual Setup

If you prefer to set up manually:

### 1. DNS Configuration

Ensure your domain points to your server:
```bash
# Check DNS resolution
dig media-get.site
dig www.media-get.site
```

Both should return your server's IP address.

### 2. Environment Configuration

Create `.env.local`:
```env
# Required
VITE_CLERK_PUBLISHABLE_KEY=your_actual_clerk_key
SSL_EMAIL=your-email@example.com

# Optional customization
VITE_CONTACT_EMAIL=support@media-get.site
VITE_API_BASE_URL=https://media-get.site/api
```

### 3. Start Services

```bash
# Build and start
docker-compose build
docker-compose up -d

# Check status
docker-compose ps
```

### 4. SSL Certificate Setup

```bash
# Run SSL setup script
chmod +x scripts/ssl-setup.sh
./scripts/ssl-setup.sh
```

## SSL Certificate Management

### Initial Certificate Acquisition

The setup automatically obtains SSL certificates from Let's Encrypt for:
- `media-get.site`
- `www.media-get.site`

### Certificate Renewal

Certificates are valid for 90 days. Set up automatic renewal:

```bash
# Add to crontab
crontab -e

# Add this line (adjust path):
0 12 * * * /path/to/your/project/certbot-renew.sh
```

### Manual Renewal

```bash
# Renew certificates manually
docker-compose run --rm certbot renew
docker-compose restart nginx
```

## Security Features

### HTTPS Enforcement
- All HTTP traffic redirects to HTTPS
- HSTS headers for enhanced security
- Modern TLS configuration (TLS 1.2+)

### Security Headers
- `Strict-Transport-Security`: Forces HTTPS
- `X-Frame-Options`: Prevents clickjacking
- `X-XSS-Protection`: XSS protection
- `X-Content-Type-Options`: MIME type sniffing protection
- `Content-Security-Policy`: Content security policy

### Rate Limiting
- API endpoints: 10 requests/second
- Download endpoints: 2 requests/second
- Burst protection included

## Nginx Configuration

The nginx configuration includes:

### HTTP to HTTPS Redirect
```nginx
server {
    listen 80;
    server_name media-get.site www.media-get.site;
    return 301 https://$server_name$request_uri;
}
```

### HTTPS Server Block
```nginx
server {
    listen 443 ssl http2;
    server_name media-get.site www.media-get.site;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/media-get.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/media-get.site/privkey.pem;
    
    # Modern SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    # ... additional security settings
}
```

## Troubleshooting

### Common Issues

1. **Certificate acquisition fails**:
   ```bash
   # Check DNS resolution
   dig media-get.site
   
   # Ensure ports 80/443 are open
   sudo ufw status
   
   # Check nginx logs
   docker-compose logs nginx
   ```

2. **Site not accessible**:
   ```bash
   # Check all services are running
   docker-compose ps
   
   # Test local connectivity
   curl -I http://localhost
   curl -I https://localhost
   ```

3. **SSL certificate errors**:
   ```bash
   # Check certificate status
   docker-compose run --rm certbot certificates
   
   # Force renewal
   docker-compose run --rm certbot renew --force-renewal
   ```

### Health Checks

```bash
# Backend health
curl https://media-get.site/api/health

# Frontend accessibility
curl -I https://media-get.site

# SSL certificate info
openssl s_client -connect media-get.site:443 -servername media-get.site
```

## Production Checklist

- [ ] Domain DNS configured correctly
- [ ] Environment variables set in `.env.local`
- [ ] SSL certificates obtained and valid
- [ ] All services running and healthy
- [ ] HTTPS redirect working
- [ ] Security headers present
- [ ] Rate limiting functional
- [ ] Automatic certificate renewal configured

## Monitoring

### Log Monitoring
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nginx
docker-compose logs -f backend
```

### SSL Certificate Monitoring
```bash
# Check certificate expiry
docker-compose run --rm certbot certificates

# Test renewal (dry run)
docker-compose run --rm certbot renew --dry-run
```

## Backup and Recovery

### Configuration Backup
```bash
# Backup SSL certificates
tar -czf ssl-backup.tar.gz certbot/

# Backup configuration
tar -czf config-backup.tar.gz .env.local nginx.conf docker-compose.yml
```

### Recovery
```bash
# Restore SSL certificates
tar -xzf ssl-backup.tar.gz

# Restart services
docker-compose restart nginx
```

## Performance Optimization

### Nginx Optimizations
- Gzip compression enabled
- HTTP/2 support
- SSL session caching
- Efficient proxy settings

### Security Optimizations
- Rate limiting by IP
- Security headers
- Modern SSL ciphers only
- HSTS preload ready

Your MediaGet application is now configured for production use with HTTPS support on your custom domain `media-get.site`!
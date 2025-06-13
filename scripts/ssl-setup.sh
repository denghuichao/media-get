#!/bin/bash

# SSL Setup Script for media-get.site
# This script sets up Let's Encrypt SSL certificates

set -e

echo "🔒 Setting up SSL certificates for media-get.site..."

# Create directories for certbot
mkdir -p certbot/conf
mkdir -p certbot/www

# Check if certificates already exist
if [ -d "certbot/conf/live/media-get.site" ]; then
    echo "✅ SSL certificates already exist for media-get.site"
    echo "🔄 Renewing certificates..."
    docker-compose run --rm certbot renew
else
    echo "📋 Obtaining new SSL certificates..."
    
    # Start nginx without SSL first
    echo "🚀 Starting nginx for ACME challenge..."
    docker-compose up -d nginx
    
    # Wait for nginx to be ready
    sleep 10
    
    # Get certificates
    echo "🔐 Requesting SSL certificates from Let's Encrypt..."
    docker-compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email ${SSL_EMAIL:-admin@media-get.site} \
        --agree-tos \
        --no-eff-email \
        -d media-get.site \
        -d www.media-get.site
    
    echo "✅ SSL certificates obtained successfully!"
fi

# Restart nginx with SSL configuration
echo "🔄 Restarting nginx with SSL configuration..."
docker-compose restart nginx

echo "🎉 SSL setup complete!"
echo "🌐 Your site should now be available at:"
echo "   https://media-get.site"
echo "   https://www.media-get.site"

# Set up automatic renewal
echo "⏰ Setting up automatic certificate renewal..."
cat > certbot-renew.sh << 'EOF'
#!/bin/bash
cd /path/to/your/project
docker-compose run --rm certbot renew
docker-compose restart nginx
EOF

chmod +x certbot-renew.sh

echo "📅 Add this to your crontab for automatic renewal:"
echo "0 12 * * * /path/to/your/project/certbot-renew.sh"
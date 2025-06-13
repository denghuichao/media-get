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
    docker-compose run --rm --profile ssl certbot renew
else
    echo "📋 Obtaining new SSL certificates..."
    
    # First, start with HTTP-only nginx configuration
    echo "🚀 Starting nginx with HTTP-only configuration for ACME challenge..."
    cp nginx-http-only.conf nginx.conf
    docker-compose up -d nginx
    
    # Wait for nginx to be ready
    echo "⏳ Waiting for nginx to be ready..."
    sleep 15
    
    # Test if nginx is responding
    if ! curl -f http://media-get.site/health > /dev/null 2>&1; then
        echo "❌ Nginx is not responding. Checking logs..."
        docker-compose logs nginx
        exit 1
    fi
    
    echo "✅ Nginx is ready for ACME challenge"
    
    # Get certificates
    echo "🔐 Requesting SSL certificates from Let's Encrypt..."
    docker-compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email ${SSL_EMAIL:-admin@media-get.site} \
        --agree-tos \
        --no-eff-email \
        --force-renewal \
        -d media-get.site \
        -d www.media-get.site
    
    if [ ! -d "certbot/conf/live/media-get.site" ]; then
        echo "❌ Failed to obtain SSL certificates!"
        docker-compose logs certbot
        exit 1
    fi
    
    echo "✅ SSL certificates obtained successfully!"
fi

# Now switch to HTTPS configuration
echo "🔄 Switching to HTTPS configuration..."
cp nginx-https.conf nginx.conf

# Restart nginx with SSL configuration
echo "🔄 Restarting nginx with SSL configuration..."
docker-compose restart nginx

# Wait for nginx to restart
sleep 10

# Test HTTPS
echo "🧪 Testing HTTPS configuration..."
if curl -f -k https://media-get.site/health > /dev/null 2>&1; then
    echo "✅ HTTPS is working correctly!"
else
    echo "❌ HTTPS test failed. Checking logs..."
    docker-compose logs nginx
    exit 1
fi

echo "🎉 SSL setup complete!"
echo "🌐 Your site should now be available at:"
echo "   https://media-get.site"
echo "   https://www.media-get.site"

# Set up automatic renewal
echo "⏰ Setting up automatic certificate renewal..."
cat > certbot-renew.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
docker-compose run --rm certbot renew
docker-compose restart nginx
EOF

chmod +x certbot-renew.sh

echo "📅 Add this to your crontab for automatic renewal:"
echo "0 12 * * * $(pwd)/certbot-renew.sh"

# Start the certbot renewal service
echo "🔄 Starting automatic renewal service..."
docker-compose --profile ssl up -d certbot

echo "✅ All done! Your site is now secured with HTTPS."
#!/bin/bash

# SSL Setup Script for media-get.site
# This script sets up Let's Encrypt SSL certificates

set -e

echo "🔒 Setting up SSL certificates for media-get.site..."

# Create directories for certbot
mkdir -p certbot/conf
mkdir -p certbot/www

# Check if certificates already exist and are valid
if [ -d "certbot/conf/live/media-get.site" ]; then
    echo "📋 SSL certificates directory exists, checking validity..."
    
    # Check if certificate files exist and are readable
    if [ -f "certbot/conf/live/media-get.site/fullchain.pem" ] && [ -f "certbot/conf/live/media-get.site/privkey.pem" ]; then
        echo "✅ SSL certificate files found"
        
        # Check if certificates are still valid (not expired)
        if openssl x509 -checkend 86400 -noout -in "certbot/conf/live/media-get.site/fullchain.pem" 2>/dev/null; then
            echo "✅ SSL certificates are valid and not expiring within 24 hours"
            echo "🔄 Proceeding with HTTPS configuration..."
        else
            echo "⚠️ SSL certificates are expired or expiring soon, will renew..."
            FORCE_RENEWAL=true
        fi
    else
        echo "❌ SSL certificate files are missing, will obtain new certificates..."
        FORCE_RENEWAL=true
    fi
else
    echo "📋 No existing SSL certificates found, obtaining new ones..."
    FORCE_RENEWAL=true
fi

# If we need to get/renew certificates
if [ "$FORCE_RENEWAL" = true ]; then
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
    
    # Clean up any existing certificates if they're invalid
    if [ -d "certbot/conf/live/media-get.site" ]; then
        echo "🧹 Cleaning up existing invalid certificates..."
        rm -rf certbot/conf/live/media-get.site
        rm -rf certbot/conf/archive/media-get.site
        rm -f certbot/conf/renewal/media-get.site.conf
    fi
    
    # Get certificates with force renewal
    echo "🔐 Requesting SSL certificates from Let's Encrypt..."
    docker-compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email ${SSL_EMAIL:-admin@media-get.site} \
        --agree-tos \
        --no-eff-email \
        --force-renewal \
        --cert-name media-get.site \
        -d media-get.site \
        -d www.media-get.site
    
    if [ ! -d "certbot/conf/live/media-get.site" ]; then
        echo "❌ Failed to obtain SSL certificates!"
        echo "🔍 Checking certbot logs..."
        docker-compose logs certbot
        echo "🔍 Checking nginx logs..."
        docker-compose logs nginx
        echo "🔍 Testing domain resolution..."
        nslookup media-get.site || echo "Domain resolution failed"
        echo "🔍 Testing HTTP connectivity..."
        curl -v http://media-get.site/.well-known/acme-challenge/ || echo "ACME challenge endpoint not accessible"
        exit 1
    fi
    
    echo "✅ SSL certificates obtained successfully!"
fi

# Verify certificate files exist and are readable
echo "🔍 Verifying SSL certificate files..."
if [ ! -f "certbot/conf/live/media-get.site/fullchain.pem" ]; then
    echo "❌ fullchain.pem not found!"
    ls -la certbot/conf/live/media-get.site/ || echo "Directory doesn't exist"
    exit 1
fi

if [ ! -f "certbot/conf/live/media-get.site/privkey.pem" ]; then
    echo "❌ privkey.pem not found!"
    ls -la certbot/conf/live/media-get.site/ || echo "Directory doesn't exist"
    exit 1
fi

echo "✅ SSL certificate files verified"

# Now switch to HTTPS configuration
echo "🔄 Switching to HTTPS configuration..."
cp nginx-https.conf nginx.conf

# Test nginx configuration before restarting
echo "🧪 Testing nginx HTTPS configuration..."
if ! docker-compose exec nginx nginx -t; then
    echo "❌ Nginx HTTPS configuration test failed!"
    echo "🔄 Reverting to HTTP-only configuration..."
    cp nginx-http-only.conf nginx.conf
    docker-compose restart nginx
    exit 1
fi

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
    echo "🔄 Trying HTTP fallback test..."
    if curl -f http://media-get.site/health > /dev/null 2>&1; then
        echo "⚠️ HTTP is working but HTTPS is not. Check SSL configuration."
    else
        echo "❌ Both HTTP and HTTPS are failing. Check nginx configuration."
    fi
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
echo "🔄 Renewing SSL certificates..."
docker-compose run --rm certbot renew
if [ $? -eq 0 ]; then
    echo "✅ Certificate renewal successful, restarting nginx..."
    docker-compose restart nginx
    echo "✅ Nginx restarted successfully"
else
    echo "❌ Certificate renewal failed"
    exit 1
fi
EOF

chmod +x certbot-renew.sh

echo "📅 Add this to your crontab for automatic renewal:"
echo "0 12 * * * $(pwd)/certbot-renew.sh"

# Start the certbot renewal service
echo "🔄 Starting automatic renewal service..."
docker-compose --profile ssl up -d certbot

echo "✅ All done! Your site is now secured with HTTPS."
echo ""
echo "🔍 Quick verification:"
echo "  HTTP redirect: curl -I http://media-get.site"
echo "  HTTPS access: curl -I https://media-get.site"
echo "  Certificate info: openssl s_client -connect media-get.site:443 -servername media-get.site < /dev/null"
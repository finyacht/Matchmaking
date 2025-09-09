#!/bin/bash

# AWS EC2 Deployment Script
# Run this on your EC2 instance

echo "🚀 Starting deployment to AWS EC2..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Create app directory
sudo mkdir -p /var/www/matchmaking
cd /var/www/matchmaking

# Clone your repository (replace with your repo)
git clone https://github.com/finyacht/Matchmaking.git .

# Install dependencies
npm install

# Create production environment file
cat << EOF > .env.production
NODE_ENV=production
PORT=3000
EOF

# Start application with PM2
pm2 start simple-server.js --name "matchmaking-api"
pm2 startup
pm2 save

# Install and configure Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/matchmaking << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/matchmaking /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL certificate with Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
# sudo certbot --nginx -d your-domain.com

echo "✅ Deployment complete!"
echo "🌐 Your API is running at: http://your-server-ip"
echo "📊 Monitor with: pm2 status"
echo "📝 View logs with: pm2 logs matchmaking-api"

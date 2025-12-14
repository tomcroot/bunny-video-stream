#!/bin/bash
set -e

APP_DIR="/var/www/acrazydayinaccra"
cd "$APP_DIR" || exit

echo "📥 Fetching latest code from GitHub..."
git fetch origin main
git reset --hard origin/main

echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

echo "📦 Installing Node dependencies and building assets..."
npm install
./node_modules/.bin/vite build

echo "🗃️ Running database migrations..."
php artisan migrate --force

echo "⚡ Optimizing Laravel..."
php artisan optimize:clear
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🔧 Applying PHP-FPM configuration..."
sudo chmod +x scripts/php-fpm.sh
sudo ./scripts/php-fpm.sh

echo "👷 Configuring queue workers..."
sudo chmod +x scripts/queue-workers.sh
sudo ./scripts/queue-workers.sh

echo "🔄 Restarting services..."
sudo systemctl reload php8.4-fpm
sudo systemctl reload nginx

echo "✅ Deployment complete!"

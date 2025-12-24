#!/bin/bash
set -e

APP_DIR="/var/www/acrazydayinaccra"
cd "$APP_DIR" || exit

echo "📥 Fetching latest code from GitHub..."
git fetch origin main
git reset --hard origin/main

echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

echo "📦 Installing Node dependencies and building assets (SPA + SSR)..."
npm ci
npm run build

# ============================================================================
# ENSURE REDIS IS CONFIGURED IN .ENV (Production)
# ============================================================================
echo "🔧 Ensuring Redis configuration in .env..."
if [ -f "$APP_DIR/.env" ]; then
  # Update to Redis if still using database
  sed -i 's/^QUEUE_CONNECTION=database/QUEUE_CONNECTION=redis/' "$APP_DIR/.env"
  sed -i 's/^CACHE_STORE=database/CACHE_STORE=redis/' "$APP_DIR/.env"
  sed -i 's/^SESSION_DRIVER=database/SESSION_DRIVER=redis/' "$APP_DIR/.env"

  # Verify Redis settings exist
  grep -q "^QUEUE_CONNECTION=redis" "$APP_DIR/.env" && echo "  ✓ Queue: Redis" || echo "  ⚠ Queue not set to Redis"
  grep -q "^CACHE_STORE=redis" "$APP_DIR/.env" && echo "  ✓ Cache: Redis" || echo "  ⚠ Cache not set to Redis"
  grep -q "^SESSION_DRIVER=redis" "$APP_DIR/.env" && echo "  ✓ Session: Redis" || echo "  ⚠ Session not set to Redis"
fi

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

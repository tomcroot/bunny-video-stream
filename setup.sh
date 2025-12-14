#!/bin/bash
set -e

# ==============================================================
# setup-final.sh
# Drift-aware, non-destructive server provisioning for production
# ==============================================================

APP_NAME="acrazydayinaccra"
APP_DIR="/var/www/$APP_NAME"
PHP_VERSION="8.4"
DOMAIN="acrazydayinaccra.com"
WWW_DOMAIN="www.acrazydayinaccra.com"
SETUP_FLAG="/var/www/.${APP_NAME}_setup_complete"

MODE="verify"
if [ ! -f "$SETUP_FLAG" ]; then
  MODE="provision"
  echo "🚀 First-time provisioning for $APP_NAME"
else
  echo "ℹ️ Provisioning already done — running drift verification"
fi

# ---------------- SYSTEM PACKAGES ----------------
if [ "$MODE" = "provision" ]; then
  sudo apt update -y
  sudo apt install -y \
    software-properties-common ca-certificates lsb-release apt-transport-https \
    curl unzip git supervisor nginx cron ufw redis-server logrotate mysql-server
fi

# ---------------- FIREWALL ----------------
if ! sudo ufw status | grep -q "Status: active"; then
  sudo ufw allow 80
  sudo ufw allow 443
  sudo ufw allow 22022
  sudo ufw --force enable
fi

# ---------------- PHP ----------------
if ! php -v | grep -q "$PHP_VERSION"; then
  sudo add-apt-repository ppa:ondrej/php -y
  sudo apt update -y
  sudo apt install -y \
    php$PHP_VERSION php$PHP_VERSION-cli php$PHP_VERSION-fpm php$PHP_VERSION-mysql \
    php$PHP_VERSION-xml php$PHP_VERSION-mbstring php$PHP_VERSION-curl \
    php$PHP_VERSION-zip php$PHP_VERSION-bcmath php$PHP_VERSION-redis php$PHP_VERSION-opcache
fi

# ---------------- NODE.JS ----------------
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

# ---------------- COMPOSER ----------------
if ! command -v composer &>/dev/null; then
  curl -sS https://getcomposer.org/installer | php
  sudo mv composer.phar /usr/local/bin/composer
fi

# ---------------- APP DIRECTORY ----------------
if [ ! -d "$APP_DIR" ]; then
  sudo mkdir -p "$APP_DIR"
fi
sudo chown -R $USER:www-data "$APP_DIR"
sudo chmod -R 775 "$APP_DIR"

# ---------------- MYSQL (VERIFY / CREATE ONCE) ----------------
if ! sudo mysql -e "USE $APP_NAME" &>/dev/null; then
  if [ "$MODE" = "verify" ]; then
    echo "❌ Database missing in verify mode — aborting"
    exit 1
  fi

  DB_PASS=$(openssl rand -base64 24)
  sudo mysql <<EOF
CREATE DATABASE IF NOT EXISTS `$APP_NAME` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$APP_NAME'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON `$APP_NAME`.* TO '$APP_NAME'@'localhost';
FLUSH PRIVILEGES;
EOF

  sudo mkdir -p /root/.credentials
  echo "DB_DATABASE=$APP_NAME" > /root/.credentials/db
  echo "DB_USERNAME=$APP_NAME" >> /root/.credentials/db
  echo "DB_PASSWORD=$DB_PASS" >> /root/.credentials/db
  sudo chmod 600 /root/.credentials/db
fi

# ---------------- REDIS ----------------
# Ensure Redis is enabled and running
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Verify Redis is responding
if ! redis-cli ping | grep -q PONG; then
  echo "❌ Redis not responding"
  exit 1
fi
echo "✅ Redis is running"

# ---------------- NGINX ----------------
NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"
if [ ! -f "$NGINX_CONF" ]; then
sudo tee "$NGINX_CONF" > /dev/null <<EOF
server {
  listen 80;
  server_name $DOMAIN $WWW_DOMAIN;
  root $APP_DIR/public;
  index index.php;

  location / {
    try_files \$uri \$uri/ /index.php?\$query_string;
  }

  location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php$PHP_VERSION-fpm.sock;
  }
}
EOF

  sudo rm -f /etc/nginx/sites-enabled/default
  sudo ln -s "$NGINX_CONF" /etc/nginx/sites-enabled/$APP_NAME
  sudo nginx -t
  sudo systemctl restart nginx
fi

# ---------------- SSL ----------------
if ! command -v certbot &>/dev/null; then
  sudo apt install -y certbot python3-certbot-nginx
fi

if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  sudo certbot --nginx -d $DOMAIN -d $WWW_DOMAIN \
    --non-interactive --agree-tos -m admin@$DOMAIN --redirect
fi

sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# ---------------- CRON JOBS ----------------
# Laravel scheduler (every minute)
LARAVEL_CRON="* * * * * cd $APP_DIR && php artisan schedule:run >> /dev/null 2>&1"
if ! crontab -l 2>/dev/null | grep -q "artisan schedule:run"; then
  (crontab -l 2>/dev/null; echo "$LARAVEL_CRON") | crontab -
  echo "✅ Laravel scheduler cron added"
fi

# Database backup (daily at 2 AM)
BACKUP_CRON="0 2 * * * $APP_DIR/scripts/db-backup.sh >> /var/log/db-backup.log 2>&1"
if ! crontab -l 2>/dev/null | grep -q "db-backup.sh"; then
  (crontab -l 2>/dev/null; echo "$BACKUP_CRON") | crontab -
  echo "✅ Database backup cron added"
fi

# ---------------- FINAL MARKER ----------------
if [ "$MODE" = "provision" ]; then
  sudo touch "$SETUP_FLAG"
  sudo chmod 600 "$SETUP_FLAG"
  echo "✅ Provisioning complete"
else
  echo "✅ Drift verification complete"
fi

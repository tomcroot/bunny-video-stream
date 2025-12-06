#!/bin/bash
set -e

APP_NAME=acrazydayinaccra
APP_DIR=/var/www/$APP_NAME
PHP_VERSION=8.4

echo "🚀 Running VPS setup..."

# --- SYSTEM ---
sudo apt update -y
sudo apt install -y software-properties-common ca-certificates lsb-release apt-transport-https curl unzip git supervisor nginx

# --- PHP 8.4 ---
if ! php -v | grep -q "8.4"; then
  echo "Installing PHP 8.4..."
  sudo add-apt-repository ppa:ondrej/php -y
  sudo apt update -y
  sudo apt install -y php8.4 php8.4-cli php8.4-fpm php8.4-mysql php8.4-xml php8.4-mbstring php8.4-curl php8.4-zip php8.4-bcmath
else
  echo "✅ PHP 8.4 already installed"
fi

# --- COMPOSER ---
if ! command -v composer &> /dev/null; then
  echo "Installing Composer..."
  curl -sS https://getcomposer.org/installer | php
  sudo mv composer.phar /usr/local/bin/composer
else
  echo "✅ Composer already installed"
fi

# --- APP DIRECTORY ---
sudo mkdir -p $APP_DIR
sudo chown -R $USER:www-data $APP_DIR
sudo chmod -R 775 $APP_DIR

# --- NGINX CONFIG ---
if [ ! -f /etc/nginx/sites-available/$APP_NAME ]; then
  echo "Setting up Nginx..."
  sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null <<EOF
server {
    listen 80;
    server_name YOUR_DOMAIN;

    root $APP_DIR/public;
    index index.php;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php\$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}
EOF

  sudo ln -s /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
else
  echo "✅ Nginx already configured"
fi

sudo nginx -t
sudo systemctl reload nginx
sudo systemctl enable nginx php8.4-fpm supervisor

# --- QUEUE WORKER ---
if [ ! -f /etc/supervisor/conf.d/laravel-worker.conf ]; then
  echo "Setting up Supervisor worker..."
  sudo tee /etc/supervisor/conf.d/laravel-worker.conf > /dev/null <<EOF
[program:laravel-worker]
process_name=%(program_name)s
command=php $APP_DIR/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
stderr_logfile=/var/log/laravel-worker.err.log
stdout_logfile=/var/log/laravel-worker.out.log
user=www-data
numprocs=1
EOF
fi

sudo supervisorctl reread
sudo supervisorctl update

echo "✅ VPS is READY for Laravel 12 + PHP 8.4"

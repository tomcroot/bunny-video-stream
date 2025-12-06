#!/bin/bash
set -e

APP_NAME=acrazydayinaccra
APP_DIR=/var/www/$APP_NAME
PHP_VERSION=8.4
DOMAIN=acrazydayinaccra.com
WWW_DOMAIN=www.acrazydayinaccra.com

echo "🚀 Running full VPS setup for $DOMAIN"

# ---------------- SYSTEM ----------------
sudo apt update -y
sudo apt install -y software-properties-common ca-certificates lsb-release apt-transport-https curl unzip git supervisor nginx cron redis-server

# ---------------- PHP 8.4 ----------------
if ! php -v | grep -q "8.4"; then
  sudo add-apt-repository ppa:ondrej/php -y
  sudo apt update -y
  sudo apt install -y php8.4 php8.4-cli php8.4-fpm php8.4-mysql php8.4-xml php8.4-mbstring php8.4-curl php8.4-zip php8.4-bcmath php8.4-redis
fi

# ---------------- COMPOSER ----------------
if ! command -v composer &> /dev/null; then
  curl -sS https://getcomposer.org/installer | php
  sudo mv composer.phar /usr/local/bin/composer
fi

# ---------------- APP DIRECTORY ----------------
sudo mkdir -p $APP_DIR
sudo chown -R $USER:www-data $APP_DIR
sudo chmod -R 775 $APP_DIR

# ---------------- NGINX ----------------
if [ ! -f /etc/nginx/sites-available/$APP_NAME ]; then
  sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN $WWW_DOMAIN;

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
fi

sudo nginx -t
sudo systemctl reload nginx
sudo systemctl enable nginx php8.4-fpm supervisor redis-server cron

# ---------------- MYSQL ----------------
if ! command -v mysql &> /dev/null; then
  sudo apt install -y mysql-server
  sudo systemctl enable mysql
  sudo systemctl start mysql
fi

sudo mysql -e "DELETE FROM mysql.user WHERE User='';" || true
sudo mysql -e "DROP DATABASE IF EXISTS test;" || true
sudo mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';" || true
sudo mysql -e "FLUSH PRIVILEGES;" || true

DB_NAME=acrazydayinaccra
DB_USER=acrazydayinaccra
DB_PASS=$(openssl rand -base64 16)

sudo mysql <<EOF
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\`;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

echo "✅ MySQL Ready"
echo "DB_DATABASE=$DB_NAME"
echo "DB_USERNAME=$DB_USER"
echo "DB_PASSWORD=$DB_PASS"

# ---------------- BACKUPS (3 DAY RETENTION) ----------------
sudo mkdir -p /var/backups/mysql

sudo tee /etc/cron.daily/mysql-backup > /dev/null <<'EOF'
#!/bin/bash
DB_NAME=acrazydayinaccra
BACKUP_DIR=/var/backups/mysql
RETENTION_DAYS=3
mkdir -p $BACKUP_DIR
mysqldump $DB_NAME > $BACKUP_DIR/$DB_NAME-$(date +%F).sql
find $BACKUP_DIR -type f -name "*.sql" -mtime +$RETENTION_DAYS -delete
EOF

sudo chmod +x /etc/cron.daily/mysql-backup

# ---------------- SUPERVISOR QUEUE ----------------
if [ ! -f /etc/supervisor/conf.d/laravel-worker.conf ]; then
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

# ---------------- SSL (LET'S ENCRYPT) ----------------
if ! command -v certbot &> /dev/null; then
  sudo apt install -y certbot python3-certbot-nginx
fi

if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  sudo certbot --nginx \
    -d $DOMAIN \
    -d $WWW_DOMAIN \
    --non-interactive \
    --agree-tos \
    -m admin@$DOMAIN \
    --redirect
fi

sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "✅ FULL SERVER SETUP COMPLETE WITH SSL"

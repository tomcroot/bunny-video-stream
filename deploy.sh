#!/bin/bash
set -e

cd /var/www/acrazydayinaccra || exit

git pull origin main
composer install --no-dev --optimize-autoloader

php artisan migrate --force
php artisan optimize:clear
php artisan optimize

sudo supervisorctl restart laravel-worker
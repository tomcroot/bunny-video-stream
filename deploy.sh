#!/bin/bash
set -e

cd /var/www/acrazydayinaccra || exit

# Force server to exactly match GitHub
git fetch origin main
git reset --hard origin/main

composer install --no-dev --optimize-autoloader

php artisan migrate --force
php artisan optimize:clear
php artisan optimize

sudo supervisorctl restart laravel-worker

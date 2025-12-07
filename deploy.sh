#!/bin/bash
set -e

cd /var/www/acrazydayinaccra || exit

# Force server to match GitHub
git fetch origin main
git reset --hard origin/main

# Backend
composer install --no-dev --optimize-autoloader

# Frontend (✅ GUARANTEED WORKING)
npm install
./node_modules/.bin/vite build

# Laravel
php artisan migrate --force
php artisan optimize:clear
php artisan optimize

# Restart worker
sudo supervisorctl restart laravel-worker

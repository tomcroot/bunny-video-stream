#!/bin/bash

# Development Queue Worker Script
# Run this in a separate terminal to process payment emails

echo "🚀 Starting Laravel Queue Worker for Development..."
echo "📧 Will process payment emails and other queued jobs"
echo "🛑 Press Ctrl+C to stop"
echo ""

# Start queue worker with development-friendly settings
php artisan queue:work --queue=payments,default --timeout=60 --tries=3 --verbose

echo ""
echo "✅ Queue worker stopped"

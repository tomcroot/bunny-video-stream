#!/bin/bash
set -e

APP_NAME=acrazydayinaccra
APP_DIR=/var/www/$APP_NAME
CONF_DIR=/etc/supervisor/conf.d

ensure_worker() {
  NAME=$1
  QUEUES=$2
  PROCS=$3

  FILE="$CONF_DIR/laravel-$NAME.conf"

  DESIRED_CONF="[program:laravel-$NAME]
process_name=%(program_name)s_%(process_num)02d
command=php $APP_DIR/artisan queue:work redis --queue=$QUEUES --sleep=2 --tries=3 --timeout=60
autostart=true
autorestart=true
user=www-data
numprocs=$PROCS
redirect_stderr=true
stdout_logfile=/var/log/laravel-$NAME.log
stopwaitsecs=3600"

  if [ -f "$FILE" ]; then
    CURRENT_HASH=$(sudo sha256sum "$FILE" | awk '{print $1}')
    DESIRED_HASH=$(echo "$DESIRED_CONF" | sha256sum | awk '{print $1}')

    if [ "$CURRENT_HASH" != "$DESIRED_HASH" ]; then
      echo "🔄 Updating worker config: $NAME"
      echo "$DESIRED_CONF" | sudo tee "$FILE" > /dev/null
    else
      echo "✅ Worker $NAME already correct"
    fi
  else
    echo "➕ Creating worker: $NAME"
    echo "$DESIRED_CONF" | sudo tee "$FILE" > /dev/null
  fi
}

# Priority queues for critical operations
# OTP workers DISABLED - kept for reference only
# ensure_worker otp "otp" 2
ensure_worker payments "payments" 1
ensure_worker emails "emails" 1
ensure_worker default "default" 1

sudo supervisorctl reread
sudo supervisorctl update
# OTP queue workers disabled
# sudo supervisorctl restart laravel-otp:* || true
sudo supervisorctl restart laravel-payments:* || true
sudo supervisorctl restart laravel-emails:* || true
sudo supervisorctl restart laravel-default:* || true

echo "✅ Named Redis queue workers verified and running"

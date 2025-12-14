#!/bin/bash
set -e

PHP_FPM_CONF="/etc/php/8.4/fpm/pool.d/www.conf"
PHP_INI="/etc/php/8.4/fpm/php.ini"
RESTART_REQUIRED=false

apply_if_diff() {
  KEY="$1"
  VALUE="$2"

  if grep -q "^$KEY" "$PHP_FPM_CONF"; then
    CURRENT=$(grep "^$KEY" "$PHP_FPM_CONF" | awk -F '=' '{print $2}' | xargs)
    if [ "$CURRENT" != "$VALUE" ]; then
      sed -i "s|^$KEY.*|$KEY = $VALUE|" "$PHP_FPM_CONF"
      RESTART_REQUIRED=true
    fi
  else
    echo "$KEY = $VALUE" >> "$PHP_FPM_CONF"
    RESTART_REQUIRED=true
  fi
}

apply_ini_if_diff() {
  KEY="$1"
  VALUE="$2"

  if grep -q "^$KEY" "$PHP_INI"; then
    CURRENT=$(grep "^$KEY" "$PHP_INI" | awk -F '=' '{print $2}' | xargs)
    if [ "$CURRENT" != "$VALUE" ]; then
      sed -i "s|^$KEY.*|$KEY = $VALUE|" "$PHP_INI"
      RESTART_REQUIRED=true
    fi
  else
    echo "$KEY = $VALUE" >> "$PHP_INI"
    RESTART_REQUIRED=true
  fi
}

# ---- PHP-FPM Pool Tuning (2GB RAM / 2vCPU safe defaults)
apply_if_diff "pm" "dynamic"
apply_if_diff "pm.max_children" "10"
apply_if_diff "pm.start_servers" "3"
apply_if_diff "pm.min_spare_servers" "2"
apply_if_diff "pm.max_spare_servers" "5"
apply_if_diff "pm.max_requests" "500"

# ---- PHP Runtime Limits
apply_ini_if_diff "memory_limit" "512M"
apply_ini_if_diff "max_execution_time" "60"
apply_ini_if_diff "opcache.enable" "1"

# ---- Restart only if drift detected
if [ "$RESTART_REQUIRED" = true ]; then
  sudo systemctl restart php8.4-fpm
  echo "✅ PHP-FPM tuned and restarted (drift corrected)"
else
  echo "ℹ️ PHP-FPM already tuned — no restart needed"
fi

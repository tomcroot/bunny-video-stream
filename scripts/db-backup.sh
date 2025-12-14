#!/bin/bash
set -e

# ==============================================================
# db-backup.sh
# Automated MySQL backup with rotation and optional S3 upload
# ==============================================================

APP_NAME="acrazydayinaccra"
BACKUP_DIR="/var/backups/mysql"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${APP_NAME}_${DATE}.sql.gz"

# Load database credentials
if [ -f /root/.credentials/db ]; then
  source /root/.credentials/db
else
  echo "❌ Database credentials not found at /root/.credentials/db"
  exit 1
fi

# Ensure backup directory exists
sudo mkdir -p "$BACKUP_DIR"
sudo chmod 700 "$BACKUP_DIR"

# Create backup
echo "📦 Creating backup: $BACKUP_FILE"
mysqldump -u"$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" \
  --single-transaction \
  --quick \
  --lock-tables=false \
  | gzip > "$BACKUP_FILE"

# Verify backup was created
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
  SIZE=$(du -h "$BACKUP_FILE" | awk '{print $1}')
  echo "✅ Backup created successfully: $SIZE"
else
  echo "❌ Backup failed or file is empty"
  exit 1
fi

# Clean old backups (keep last N days)
echo "🧹 Cleaning backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "${APP_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Count remaining backups
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/${APP_NAME}_*.sql.gz 2>/dev/null | wc -l)
echo "📊 Total backups retained: $BACKUP_COUNT"

# Optional: Upload to S3 (uncomment and configure if needed)
# if command -v aws &>/dev/null; then
#   S3_BUCKET="your-backup-bucket"
#   aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/mysql/$APP_NAME/"
#   echo "☁️ Uploaded to S3: s3://$S3_BUCKET/mysql/$APP_NAME/"
# fi

echo "✅ Backup complete: $BACKUP_FILE"

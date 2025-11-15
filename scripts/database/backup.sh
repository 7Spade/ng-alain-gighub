#!/bin/bash

# 資料庫備份腳本
# 用途：執行完整資料庫備份

set -e

# 載入環境變數
if [ -f ".env" ]; then
    source .env
fi

# 配置
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

# 建立備份目錄
mkdir -p "${BACKUP_DIR}"

echo "開始備份資料庫..."
echo "備份時間: ${TIMESTAMP}"
echo "備份檔案: ${BACKUP_FILE}"

# 執行備份
if [ -n "${SUPABASE_DB_URL}" ]; then
    # 使用 pg_dump 執行備份
    pg_dump "${SUPABASE_DB_URL}" \
        --format=custom \
        --file="${BACKUP_FILE}.dump" \
        --verbose \
        --no-owner \
        --no-acl

    # 同時產生 SQL 格式備份（方便檢視）
    pg_dump "${SUPABASE_DB_URL}" \
        --format=plain \
        --file="${BACKUP_FILE}" \
        --verbose \
        --no-owner \
        --no-acl

    echo "✅ 資料庫備份完成"
else
    echo "❌ 錯誤：未設置 SUPABASE_DB_URL 環境變數"
    exit 1
fi

# 壓縮備份檔案
echo "壓縮備份檔案..."
gzip "${BACKUP_FILE}"
echo "✅ 備份檔案已壓縮: ${BACKUP_FILE}.gz"

# 上傳到 S3（如果配置了）
if [ -n "${AWS_S3_BUCKET}" ]; then
    echo "上傳備份到 S3..."
    aws s3 cp "${BACKUP_FILE}.dump" "s3://${AWS_S3_BUCKET}/backups/$(basename ${BACKUP_FILE}.dump)"
    aws s3 cp "${BACKUP_FILE}.gz" "s3://${AWS_S3_BUCKET}/backups/$(basename ${BACKUP_FILE}.gz)"
    echo "✅ 備份已上傳到 S3"
fi

# 清理舊備份
echo "清理 ${RETENTION_DAYS} 天前的備份..."
find "${BACKUP_DIR}" -name "backup_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete
find "${BACKUP_DIR}" -name "backup_*.dump" -type f -mtime +${RETENTION_DAYS} -delete
echo "✅ 舊備份已清理"

# 備份元資訊
cat > "${BACKUP_DIR}/backup_${TIMESTAMP}.info" <<EOF
備份時間: ${TIMESTAMP}
備份檔案: ${BACKUP_FILE}
資料庫: ${SUPABASE_PROJECT_ID}
保留期限: ${RETENTION_DAYS} 天
備份類型: 完整備份 (Full Backup)
EOF

echo "✅ 所有備份操作完成"

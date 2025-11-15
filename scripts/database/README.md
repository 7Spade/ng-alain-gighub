# 資料庫管理腳本

這個目錄包含資料庫管理相關的自動化腳本。

## 腳本清單

### 備份腳本
- `backup.sh` - 完整備份腳本
- `backup-incremental.sh` - 增量備份腳本
- `schedule-backup.sh` - 定時備份設置

### 還原腳本
- `restore.sh` - 資料庫還原腳本
- `restore-point-in-time.sh` - 時間點還原（PITR）

### 遷移腳本
- `migrate.sh` - 執行資料庫遷移
- `rollback.sh` - 回滾遷移
- `migrate-status.sh` - 查看遷移狀態

### 種子資料腳本
- `seed.sh` - 執行種子資料
- `seed-dev.sh` - 開發環境種子資料
- `seed-test.sh` - 測試環境種子資料

### 維護腳本
- `vacuum.sh` - 資料庫清理
- `reindex.sh` - 重建索引
- `analyze.sh` - 更新統計資訊

## 使用方式

### 備份資料庫

完整備份：
```bash
./scripts/database/backup.sh
```

增量備份：
```bash
./scripts/database/backup-incremental.sh
```

### 還原資料庫

從備份還原：
```bash
./scripts/database/restore.sh <backup_file>
```

時間點還原：
```bash
./scripts/database/restore-point-in-time.sh <timestamp>
```

### 執行遷移

執行所有待執行的遷移：
```bash
./scripts/database/migrate.sh
```

回滾上一次遷移：
```bash
./scripts/database/rollback.sh
```

查看遷移狀態：
```bash
./scripts/database/migrate-status.sh
```

### 執行種子資料

開發環境：
```bash
./scripts/database/seed-dev.sh
```

測試環境：
```bash
./scripts/database/seed-test.sh
```

## 備份策略

根據文檔 `docs/20-部署基礎設施視圖.mermaid.md`，備份策略如下：

### 資料庫備份
- **每日完整備份** (Full Backup)
- **每小時增量備份** (Incremental)
- **保留 30 天**
- **Point-in-Time Recovery (PITR)**

### Storage 備份
- **異地複製** (Cross-Region Replication)
- **版本控制** (Versioning)
- **保留 90 天**

## 災難復原

### RTO (Recovery Time Objective)
目標恢復時間：1 小時

### RPO (Recovery Point Objective)
目標恢復點：15 分鐘

### 恢復流程
1. 啟動備用資料庫
2. 恢復最新備份
3. 重放 WAL 日誌
4. DNS 切換

## 環境變數

腳本需要以下環境變數：

```bash
# Supabase 配置
export SUPABASE_PROJECT_ID="your-project-id"
export SUPABASE_DB_URL="postgresql://..."
export SUPABASE_SERVICE_ROLE_KEY="..."

# 備份配置
export BACKUP_DIR="/path/to/backups"
export BACKUP_RETENTION_DAYS="30"

# AWS S3 配置（用於異地備份）
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_S3_BUCKET="..."
```

## 參考文檔

- [部署基礎設施視圖](../../docs/20-部署基礎設施視圖.mermaid.md)
- [備份與災難復原](../../docs/infrastructure/BACKUP_RECOVERY.md)（待建立）

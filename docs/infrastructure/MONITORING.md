# 監控設置指南

> 📊 **目的**：提供完整的監控系統設置和使用指南

**最後更新**：2025-11-15  
**維護者**：DevOps 團隊

---

## 📋 監控架構概覽

本系統使用現代化的可觀測性堆疊：

- **Prometheus** - 指標收集與查詢
- **Grafana** - 視覺化儀表板
- **Loki** - 日誌聚合
- **Alertmanager** - 告警管理
- **OpenTelemetry** - 分散式追蹤

參考：[docs/20-部署基礎設施視圖.mermaid.md](../20-部署基礎設施視圖.mermaid.md)

---

## 🚀 快速開始

### 1. 安裝必要工具

```bash
# Docker Compose (用於本地開發)
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Prometheus
# 參考: https://prometheus.io/docs/prometheus/latest/installation/

# Grafana
# 參考: https://grafana.com/docs/grafana/latest/setup-grafana/installation/
```

### 2. 啟動監控堆疊

使用 Docker Compose：

```bash
# 啟動所有監控服務
docker-compose -f monitoring/docker-compose.yml up -d

# 查看服務狀態
docker-compose -f monitoring/docker-compose.yml ps

# 查看日誌
docker-compose -f monitoring/docker-compose.yml logs -f
```

### 3. 訪問監控介面

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (預設帳號: admin/admin)
- **Alertmanager**: http://localhost:9093

---

## 📊 監控指標

### 系統指標

#### CPU 使用率
```promql
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

#### 記憶體使用率
```promql
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

#### 磁碟使用率
```promql
(1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100
```

### 資料庫指標

#### 連線數
```promql
pg_stat_database_numbackends
```

#### 查詢速度
```promql
rate(pg_stat_statements_mean_exec_time[5m])
```

#### 緩存命中率
```promql
pg_stat_database_blks_hit / (pg_stat_database_blks_hit + pg_stat_database_blks_read)
```

### 應用程式指標

#### 請求率
```promql
rate(http_requests_total[5m])
```

#### 錯誤率
```promql
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])
```

#### 回應時間 (P95)
```promql
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

### Core Web Vitals

#### LCP (Largest Contentful Paint)
```promql
web_vitals_lcp_p95
```
目標: < 2.5s

#### FID/INP (First Input Delay / Interaction to Next Paint)
```promql
web_vitals_fid_p95
```
目標: < 100ms

#### CLS (Cumulative Layout Shift)
```promql
web_vitals_cls_p95
```
目標: < 0.1

### 業務指標

#### 活躍用戶數
```promql
active_users_count
```

#### 任務完成率
```promql
rate(tasks_completed_total[1h]) / rate(tasks_total[1h])
```

#### 問題解決時間
```promql
histogram_quantile(0.95, rate(issue_resolution_time_seconds_bucket[1h]))
```

---

## 📈 Grafana 儀表板

### 預設儀表板

系統提供以下預設儀表板：

1. **系統總覽** (`monitoring/grafana/dashboards/system-overview.json`)
   - CPU、記憶體、磁碟使用率
   - 網路流量
   - 系統負載

2. **資料庫監控** (`monitoring/grafana/dashboards/database.json`)
   - 連線數
   - 查詢性能
   - 緩存效率
   - 慢查詢

3. **應用程式監控** (`monitoring/grafana/dashboards/application.json`)
   - 請求率
   - 錯誤率
   - 回應時間
   - API 性能

4. **Core Web Vitals** (`monitoring/grafana/dashboards/web-vitals.json`)
   - LCP、FID/INP、CLS
   - 頁面載入性能
   - 用戶體驗指標

5. **業務指標** (`monitoring/grafana/dashboards/business-metrics.json`)
   - 活躍用戶
   - 任務執行
   - 問題追蹤
   - 系統使用率

### 導入儀表板

```bash
# 透過 Grafana UI 導入
1. 登入 Grafana
2. 點擊 "+" → "Import"
3. 上傳 JSON 檔案或輸入儀表板 ID

# 透過 API 導入
curl -X POST \
  http://localhost:3000/api/dashboards/db \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <api_key>' \
  -d @monitoring/grafana/dashboards/system-overview.json
```

---

## 🔔 告警配置

### 告警規則

告警規則定義在 `monitoring/alerts/alert-rules.yml`

### 告警等級

- **Critical** - 嚴重問題，需要立即處理
- **Warning** - 警告，需要關注
- **Info** - 資訊，僅供參考

### 通知渠道

配置 Alertmanager 通知渠道：

```yaml
# monitoring/alertmanager/alertmanager.yml
receivers:
  - name: 'email'
    email_configs:
      - to: 'devops@example.com'
        from: 'alertmanager@example.com'
        smarthost: 'smtp.example.com:587'
        auth_username: 'alertmanager@example.com'
        auth_password: '<password>'

  - name: 'slack'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/...'
        channel: '#alerts'

  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: '<service_key>'
```

### 告警測試

```bash
# 觸發測試告警
curl -X POST http://localhost:9093/api/v1/alerts \
  -H 'Content-Type: application/json' \
  -d '[
    {
      "labels": {
        "alertname": "TestAlert",
        "severity": "info"
      },
      "annotations": {
        "summary": "This is a test alert"
      }
    }
  ]'
```

---

## 📝 日誌管理

### Loki 配置

Loki 配置在 `monitoring/loki/loki-config.yml`

### 查詢日誌

在 Grafana 中使用 LogQL 查詢：

```logql
# 查詢錯誤日誌
{job="angular-app"} |= "ERROR"

# 查詢特定時間範圍
{job="edge-functions"} | json | level="error" | __timestamp__ > <timestamp>

# 聚合查詢
sum(rate({job="angular-app"}[1m])) by (level)
```

### 日誌保留

- **預設保留期**: 30 天
- **壓縮**: 自動壓縮
- **索引**: 自動建立索引

---

## 🔍 分散式追蹤

### OpenTelemetry 配置

```typescript
// src/app/core/monitoring/opentelemetry.config.ts
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const provider = new WebTracerProvider({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'ng-alain-github',
  }),
});

provider.register();
```

### 追蹤視覺化

使用 Jaeger 或 Zipkin 視覺化追蹤資料。

---

## 🛠️ 維護與優化

### 定期維護

1. **每週**
   - 檢查告警狀態
   - 審查儀表板
   - 清理舊日誌

2. **每月**
   - 分析性能趨勢
   - 優化查詢規則
   - 更新告警閾值

3. **每季**
   - 審查監控架構
   - 評估工具升級
   - 容量規劃

### 性能優化

1. **Prometheus 優化**
   - 調整 scrape_interval
   - 優化查詢語句
   - 使用 recording rules

2. **Grafana 優化**
   - 限制時間範圍
   - 使用變數
   - 優化儀表板查詢

3. **Loki 優化**
   - 優化標籤使用
   - 調整保留策略
   - 使用查詢快取

---

## 📚 參考資料

### 官方文檔
- [Prometheus 文檔](https://prometheus.io/docs/)
- [Grafana 文檔](https://grafana.com/docs/)
- [Loki 文檔](https://grafana.com/docs/loki/)
- [OpenTelemetry 文檔](https://opentelemetry.io/docs/)

### 專案文檔
- [部署基礎設施視圖](../20-部署基礎設施視圖.mermaid.md)
- [可觀測性與 CI/CD 管道圖](../23-可觀測性與CI-CD管道圖.mermaid.md)
- [故障排除指南](./TROUBLESHOOTING.md)（待建立）

---

**維護者**：DevOps 團隊  
**聯絡方式**：devops@example.com

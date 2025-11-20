# Agent 自主性與防護規範

> **📋 目的**：定義 AI Agent 在本專案中的自主性等級、決策邊界、安全防護機制與分階段推出策略，確保 Agent 行為可控、可審計、可回溯

**版本**：v1.0  
**最後更新**：2025-11-20  
**維護者**：開發團隊  
**狀態**：草案（Draft）

---

## 📌 文件概述

### 目的

本規範定義：
1. **自主性等級**：Agent 可自主執行哪些操作，哪些需要人工確認
2. **決策流程**：Agent 如何接收輸入、處理決策、產生輸出
3. **安全防護**：防止 Agent 執行危險操作的機制
4. **審計日誌**：記錄 Agent 所有決策與操作
5. **分階段推出**：從手動監督到半自動到全自動的演進路徑
6. **整合機制**：與 GitHub Actions、CI/CD、文件預覽系統的整合點

### 適用範圍

- **適用對象**：所有 AI Agent（GitHub Copilot、Cursor AI、自定義 Agent）
- **適用場景**：
  - 程式碼生成與重構
  - 文件自動生成與更新
  - Pull Request 審查與建議
  - 測試案例生成
  - 架構決策建議
  - 資料庫 Migration 建議

---

## 🎯 自主性等級定義

### Level 0：唯讀模式（Read-Only）

**描述**：Agent 僅能查看專案內容，不能執行任何修改

| 項目 | 說明 |
|------|------|
| **允許操作** | - 讀取檔案內容<br>- 搜尋程式碼<br>- 分析架構<br>- 提供建議 |
| **禁止操作** | - 修改檔案<br>- 建立 PR<br>- 執行指令<br>- 修改設定 |
| **人工確認** | 不需要 |
| **適用場景** | - 程式碼審查<br>- 架構分析<br>- 文件查詢 |

### Level 1：建議模式（Suggestion）

**描述**：Agent 可以產生建議，但所有操作需人工確認

| 項目 | 說明 |
|------|------|
| **允許操作** | - Level 0 所有權限<br>- 產生程式碼建議<br>- 產生 commit message<br>- 產生 PR 描述 |
| **禁止操作** | - 自動 commit<br>- 自動建立 PR<br>- 自動合併<br>- 執行危險指令 |
| **人工確認** | **所有建議都需人工審查與確認** |
| **適用場景** | - 日常開發輔助<br>- 程式碼重構建議<br>- 測試生成建議 |

### Level 2：半自動模式（Semi-Auto）

**描述**：Agent 可執行低風險操作，中高風險操作需人工確認

| 項目 | 說明 |
|------|------|
| **允許操作** | - Level 1 所有權限<br>- 自動格式化程式碼<br>- 自動修正 lint 錯誤<br>- 自動更新依賴版本（patch）<br>- 自動生成測試骨架 |
| **需人工確認** | - commit 前確認<br>- PR 建立前確認<br>- 資料庫 Migration<br>- 安全相關變更 |
| **禁止操作** | - 自動合併 PR<br>- 刪除資料庫表<br>- 修改認證邏輯<br>- 變更核心 API |
| **適用場景** | - 自動化重複性工作<br>- 程式碼品質維護 |

### Level 3：全自動模式（Full-Auto）⚠️

**描述**：Agent 可完全自主執行，僅在關鍵操作時需確認

| 項目 | 說明 |
|------|------|
| **允許操作** | - Level 2 所有權限<br>- 自動建立 PR<br>- 自動合併低風險 PR<br>- 自動部署至測試環境 |
| **需人工確認** | - 生產環境部署<br>- 破壞性資料變更<br>- 安全政策變更<br>- 架構重大調整 |
| **禁止操作** | - 刪除生產資料<br>- 繞過安全檢查<br>- 修改 RLS 政策（未審查） |
| **適用場景** | - CI/CD 自動化<br>- 文件自動更新 |
| **風險等級** | ⚠️ **高風險** - 需完整審計與監控 |

---

## 🔄 決策輸入與輸出

### 輸入格式（Input Schema）

Agent 接收標準化的輸入訊息：

```json
{
  "request_id": "req_20251120_001",
  "timestamp": "2025-11-20T14:31:00Z",
  "agent": {
    "name": "github-copilot",
    "version": "1.0.0",
    "autonomy_level": 1
  },
  "context": {
    "repository": "7Spade/ng-alain-gighub",
    "branch": "feature/new-component",
    "files_in_scope": [
      "src/app/routes/dashboard/dashboard.component.ts",
      "src/app/routes/dashboard/dashboard.component.spec.ts"
    ],
    "user": {
      "id": "user_123",
      "role": "developer"
    }
  },
  "request": {
    "type": "code_generation",
    "action": "refactor_to_signals",
    "parameters": {
      "component": "DashboardComponent",
      "use_signals": true,
      "use_onpush": true
    }
  },
  "constraints": {
    "max_files_modified": 5,
    "require_tests": true,
    "security_check": true
  }
}
```

### 輸出格式（Output Schema）

Agent 產生標準化的輸出結果：

```json
{
  "response_id": "resp_20251120_001",
  "request_id": "req_20251120_001",
  "timestamp": "2025-11-20T14:32:30Z",
  "status": "success",
  "autonomy_level_used": 1,
  "decision": {
    "action_taken": "generate_refactored_code",
    "confidence": 0.95,
    "risk_level": "low",
    "requires_approval": true
  },
  "changes": {
    "files_modified": [
      {
        "path": "src/app/routes/dashboard/dashboard.component.ts",
        "change_type": "modify",
        "diff_preview": "...",
        "risk_assessment": "low"
      }
    ],
    "files_created": [
      {
        "path": "src/app/routes/dashboard/dashboard.component.spec.ts",
        "change_type": "create",
        "content_preview": "...",
        "risk_assessment": "low"
      }
    ],
    "total_lines_changed": 150
  },
  "validation": {
    "lint_passed": true,
    "type_check_passed": true,
    "security_scan_passed": true,
    "test_coverage": 85
  },
  "recommendations": [
    {
      "type": "info",
      "message": "建議手動測試 signal 變更偵測邏輯"
    },
    {
      "type": "warning",
      "message": "需確認與其他元件的相依性"
    }
  ],
  "next_steps": [
    "1. 審查產生的程式碼",
    "2. 執行本地測試",
    "3. 提交 commit",
    "4. 建立 PR"
  ],
  "audit_log": {
    "decision_time_ms": 1500,
    "tokens_used": 3500,
    "model": "gpt-4",
    "guardrails_triggered": []
  }
}
```

---

## 📝 Prompt 模板

### 模板 1：程式碼重構

```markdown
你是 7Spade/ng-alain-gighub 的 Agent，當前自主性等級：Level {autonomy_level}

**任務**：重構 {component_name} 為 Standalone Component，使用 Signals 與 OnPush

**上下文**：
- 專案：{repository}
- 分支：{branch}
- 檔案：{file_path}

**要求**：
1. 遵循 `docs/10-系統架構思維導圖.mermaid.md`
2. 使用 TypeScript strict 模式
3. 避免使用 `any` 型別
4. 產生對應的測試案例
5. 覆蓋率需 ≥ 80%

**輸出格式**：JSON（遵循 Output Schema）

**防護機制**：
- 檢查是否修改認證邏輯（禁止）
- 檢查是否刪除既有測試（禁止）
- 檢查是否影響超過 {max_files} 個檔案（需確認）

**審計要求**：
- 記錄所有檔案變更
- 記錄決策理由
- 記錄風險評估結果
```

### 模板 2：資料庫 Migration

```markdown
你是 7Spade/ng-alain-gighub 的 Agent，當前自主性等級：Level {autonomy_level}

**任務**：產生資料庫 Migration：{migration_description}

**上下文**：
- 目前 Schema 版本：{schema_version}
- 相關資料表：{affected_tables}
- 影響行數預估：{estimated_rows}

**要求**：
1. 必須提供 UP 和 DOWN Migration
2. 必須包含 Rollback 計畫
3. 必須評估資料遺失風險
4. 必須標註「需要人工審查」

**輸出格式**：JSON + SQL

**防護機制**：
⚠️ **強制人工確認** - 任何資料庫變更都需人工審查

**審計要求**：
- 記錄 Migration SQL
- 記錄 Rollback SQL
- 記錄風險評估
- 記錄預估影響範圍
```

### 模板 3：文件自動更新

```markdown
你是 7Spade/ng-alain-gighub 的 Agent，當前自主性等級：Level {autonomy_level}

**任務**：更新專案文件：{document_path}

**上下文**：
- 變更類型：{change_type}  (新增/修改/刪除)
- 影響章節：{affected_sections}
- 相關 PR：{pr_number}

**要求**：
1. 使用正體中文
2. 遵循現有文件風格
3. 更新 `docs/README.md` 索引
4. 標註更新日期

**輸出格式**：JSON + Markdown

**防護機制**：
- 禁止刪除重要架構文件
- 禁止修改 changelog 歷史記錄
- 變更需符合既有模板

**審計要求**：
- 記錄文件變更 diff
- 記錄變更理由
- 記錄相關 issue/PR
```

---

## 🔗 整合點

### GitHub Actions 整合

#### 1. PR 自動審查

```yaml
name: Agent PR Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  agent-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Agent Code Review
        uses: ./github/actions/agent-review
        with:
          autonomy_level: 1  # 建議模式
          review_scope: 'all'
          output_format: 'json'
          
      - name: Post Review Comments
        uses: actions/github-script@v7
        with:
          script: |
            // 將 Agent 建議發布為 PR 評論
            const review = require('./agent-review-output.json');
            await github.rest.pulls.createReview({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: context.issue.number,
              body: review.summary,
              event: 'COMMENT',
              comments: review.inline_comments
            });
```

#### 2. 文件自動同步

```yaml
name: Agent Docs Sync

on:
  push:
    branches: [main]
    paths:
      - 'src/**/*.ts'
      - 'docs/**/*.md'

jobs:
  docs-sync:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      
    steps:
      - uses: actions/checkout@v4
      
      - name: Detect Changes
        id: changes
        run: |
          # 偵測哪些模組被修改
          echo "modules=$(git diff --name-only HEAD~1 | grep 'src/app/' | cut -d'/' -f3 | sort -u | tr '\n' ',')" >> $GITHUB_OUTPUT
          
      - name: Agent Update Docs
        uses: ./github/actions/agent-docs-update
        with:
          autonomy_level: 2  # 半自動模式
          modules: ${{ steps.changes.outputs.modules }}
          auto_commit: false  # 需人工確認
          
      - name: Create PR
        if: steps.agent-docs.outputs.changes_detected == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'docs: Agent 自動更新文件'
          title: '📝 Agent: 同步文件變更'
          body: |
            🤖 此 PR 由 Agent 自動產生
            
            **變更摘要**：
            ${{ steps.agent-docs.outputs.summary }}
            
            **影響模組**：
            ${{ steps.changes.outputs.modules }}
            
            **需要審查**：
            - [ ] 確認文件內容正確
            - [ ] 確認語意清晰
            - [ ] 確認範例程式碼可執行
            
            **審計資訊**：
            - Agent: ${{ steps.agent-docs.outputs.agent_name }}
            - 自主性等級: Level 2
            - 決策時間: ${{ steps.agent-docs.outputs.decision_time }}
          branch: agent/docs-sync-${{ github.run_number }}
          labels: |
            documentation
            agent-generated
```

### CI/CD 整合

#### 測試覆蓋率監控

```yaml
name: Agent Test Coverage Guard

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  coverage-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Tests
        run: yarn test --coverage
        
      - name: Agent Coverage Analysis
        uses: ./github/actions/agent-coverage-check
        with:
          autonomy_level: 1
          min_coverage: 80
          min_new_code_coverage: 90
          
      - name: Block Merge if Coverage Low
        if: steps.coverage-check.outputs.passed == 'false'
        run: |
          echo "::error::測試覆蓋率不足: ${{ steps.coverage-check.outputs.coverage }}%"
          exit 1
```

### 文件預覽整合

#### 即時文件預覽

```typescript
// .github/scripts/agent-docs-preview.ts

interface DocsPreviewRequest {
  request_id: string;
  files_changed: string[];
  preview_url?: string;
}

async function generateDocsPreview(request: DocsPreviewRequest): Promise<void> {
  const agent = new AgentDocsPreview({
    autonomyLevel: 1,  // 僅建議，不自動部署
    baseUrl: process.env.PREVIEW_BASE_URL
  });
  
  // 分析哪些文件需要重新生成
  const affectedDocs = await agent.analyzeImpact(request.files_changed);
  
  // 產生預覽
  const preview = await agent.generatePreview(affectedDocs);
  
  // 部署至預覽環境（需人工確認）
  if (preview.requires_approval) {
    await github.createIssueComment({
      body: `
        🔍 **Agent 文件預覽已就緒**
        
        **影響文件**：
        ${affectedDocs.map(d => `- ${d}`).join('\n')}
        
        **預覽連結**：${preview.url}
        
        **需要動作**：
        - [ ] 審查預覽內容
        - [ ] 確認後輸入 \`/agent approve\`
      `
    });
  }
}
```

---

## 🔒 安全防護機制

### 1. 操作白名單

**允許的操作**（依自主性等級）：

```typescript
const ALLOWED_OPERATIONS = {
  level0: ['read_file', 'search_code', 'analyze'],
  level1: ['generate_suggestion', 'format_code', 'generate_test_skeleton'],
  level2: ['auto_format', 'fix_lint', 'update_deps_patch', 'create_pr_draft'],
  level3: ['create_pr', 'merge_low_risk_pr', 'deploy_test_env']
};
```

### 2. 操作黑名單

**禁止的操作**（任何等級）：

```typescript
const FORBIDDEN_OPERATIONS = [
  'delete_production_data',
  'modify_auth_logic_without_review',
  'bypass_security_checks',
  'disable_rls_policies',
  'expose_secrets',
  'drop_database_tables',
  'modify_cicd_secrets',
  'delete_git_history',
  'force_push_to_main'
];
```

### 3. 風險評估矩陣

| 操作類型 | 風險等級 | 需要確認 | 審計要求 |
|---------|---------|---------|---------|
| 讀取檔案 | 低 | 否 | 基本日誌 |
| 格式化程式碼 | 低 | 否 | 基本日誌 |
| 修改程式邏輯 | 中 | 是 | 詳細日誌 + diff |
| 建立 PR | 中 | 是 | 詳細日誌 + 影響分析 |
| 資料庫 Migration | 高 | **必須** | 完整審計 + 回滾計畫 |
| 修改認證邏輯 | 極高 | **必須** | 完整審計 + 安全審查 |
| 變更 RLS 政策 | 極高 | **必須** | 完整審計 + 安全審查 |

### 4. 自動安全檢查

```typescript
interface SecurityGuardrail {
  name: string;
  check: (context: AgentContext) => Promise<SecurityCheckResult>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

const SECURITY_GUARDRAILS: SecurityGuardrail[] = [
  {
    name: 'secret_detection',
    check: async (context) => {
      // 檢查是否包含 API keys, tokens, passwords
      const secretPatterns = [/api[_-]?key/i, /password/i, /token/i];
      // ...
    },
    severity: 'critical'
  },
  {
    name: 'auth_logic_modification',
    check: async (context) => {
      // 檢查是否修改認證相關檔案
      const authFiles = context.files.filter(f => 
        f.includes('auth') || f.includes('login') || f.includes('session')
      );
      return authFiles.length > 0 ? {blocked: true} : {blocked: false};
    },
    severity: 'critical'
  },
  {
    name: 'database_destructive_ops',
    check: async (context) => {
      // 檢查是否包含 DROP, DELETE, TRUNCATE
      const destructiveKeywords = ['DROP TABLE', 'DELETE FROM', 'TRUNCATE'];
      // ...
    },
    severity: 'critical'
  },
  {
    name: 'file_count_limit',
    check: async (context) => {
      // 檢查是否修改過多檔案
      return context.files.length > 10 ? {warning: true} : {ok: true};
    },
    severity: 'warning'
  }
];
```

### 5. 人工介入觸發條件

Agent 必須在以下情況請求人工介入：

1. **風險等級 ≥ 高**
2. **觸發任何 Critical 等級的防護機制**
3. **修改檔案數 > 10**
4. **信心度 < 80%**
5. **測試覆蓋率 < 80%**
6. **涉及資料庫 Schema 變更**
7. **涉及認證/授權邏輯**
8. **需要外部服務整合（新增 API key）**

---

## 📊 審計與日誌

### 審計日誌格式

```json
{
  "audit_id": "audit_20251120_001",
  "timestamp": "2025-11-20T14:31:00Z",
  "agent": {
    "name": "github-copilot",
    "version": "1.0.0",
    "autonomy_level": 2
  },
  "user": {
    "id": "user_123",
    "username": "developer1",
    "email": "dev@example.com"
  },
  "request": {
    "type": "code_generation",
    "description": "重構 DashboardComponent 為 Signals"
  },
  "decision": {
    "action": "generate_code",
    "confidence": 0.92,
    "risk_level": "low",
    "approval_required": true,
    "approval_status": "pending"
  },
  "changes": {
    "files_modified": 2,
    "files_created": 1,
    "total_lines_changed": 150,
    "files": [
      {
        "path": "src/app/routes/dashboard/dashboard.component.ts",
        "action": "modify",
        "lines_changed": 120,
        "risk": "low"
      }
    ]
  },
  "validation": {
    "lint": "passed",
    "type_check": "passed",
    "security_scan": "passed",
    "test_coverage": 85
  },
  "guardrails": {
    "triggered": [],
    "all_passed": true
  },
  "performance": {
    "decision_time_ms": 1500,
    "tokens_used": 3500,
    "model": "gpt-4"
  },
  "outcome": {
    "status": "success",
    "approved_by": "user_123",
    "approved_at": "2025-11-20T14:35:00Z",
    "commit_sha": "abc123def456"
  }
}
```

### 審計儲存策略

1. **即時記錄**：所有 Agent 操作即時寫入審計日誌
2. **長期保存**：審計日誌保存 90 天
3. **查詢介面**：提供 Web UI 和 API 查詢
4. **匯出功能**：可匯出為 JSON / CSV 格式

### 審計查詢範例

```bash
# 查詢特定 Agent 的所有操作
GET /api/audit?agent=github-copilot&from=2025-11-01&to=2025-11-30

# 查詢高風險操作
GET /api/audit?risk_level=high&status=approved

# 查詢特定使用者的批准記錄
GET /api/audit?approved_by=user_123

# 查詢觸發防護機制的操作
GET /api/audit?guardrails_triggered=true
```

---

## 🚀 分階段推出計劃

### Phase 0：準備階段（4 週）

**目標**：建立基礎設施與監控機制

| 週次 | 任務 | 負責人 | 驗收標準 |
|-----|------|--------|---------|
| W1 | 建立審計日誌系統 | Backend Team | 可記錄並查詢日誌 |
| W2 | 實作安全防護機制 | Security Team | 所有防護機制可觸發 |
| W3 | 建立 Agent 整合框架 | DevOps Team | 可與 GitHub Actions 整合 |
| W4 | 建立監控儀表板 | Frontend Team | 可視化 Agent 操作統計 |

**交付物**：
- ✅ 審計日誌 API
- ✅ 安全防護框架
- ✅ GitHub Actions 整合範本
- ✅ 監控儀表板

### Phase 1：Level 0 + Level 1（2 週）

**目標**：啟用唯讀與建議模式

| 週次 | 任務 | 驗收標準 |
|-----|------|---------|
| W1 | 部署 Level 0 (唯讀) | Agent 可讀取專案內容 |
| W1 | 部署 Level 1 (建議) | Agent 可產生建議，需人工確認 |
| W2 | 內部測試與回饋收集 | 收集 10+ 個測試案例 |
| W2 | 調整與優化 | 根據回饋調整 prompt 模板 |

**驗收標準**：
- ✅ 10 個成功的程式碼建議案例
- ✅ 0 個安全事件
- ✅ 100% 審計覆蓋率
- ✅ 使用者滿意度 ≥ 4/5

### Phase 2：Level 2（4 週）

**目標**：啟用半自動模式

| 週次 | 任務 | 驗收標準 |
|-----|------|---------|
| W1 | 啟用自動格式化 | Agent 可自動格式化程式碼 |
| W2 | 啟用自動 Lint 修正 | Agent 可自動修正 Lint 錯誤 |
| W3 | 啟用依賴更新（patch） | Agent 可自動更新 patch 版本 |
| W4 | 全面測試與監控 | 監控 Agent 行為 |

**驗收標準**：
- ✅ 50+ 個自動操作案例
- ✅ 0 個安全事件
- ✅ 自動操作成功率 ≥ 95%
- ✅ 平均節省開發時間 30%

### Phase 3：Level 3（8 週）⚠️

**目標**：審慎評估全自動模式

| 週次 | 任務 | 驗收標準 |
|-----|------|---------|
| W1-2 | 風險評估 | 完成詳細風險評估報告 |
| W3-4 | 小範圍試點（文件更新） | 僅限文件自動更新 |
| W5-6 | 監控與調整 | 0 個安全事件，100% 審計覆蓋 |
| W7-8 | 評估是否擴大範圍 | 團隊投票決定 |

**⚠️ 重要限制**：
- **禁止自動合併至 main 分支**
- **禁止自動部署至生產環境**
- **禁止自動執行資料庫 Migration**

**驗收標準**：
- ✅ 100+ 個自動操作案例
- ✅ 0 個安全事件
- ✅ 自動操作成功率 ≥ 98%
- ✅ 團隊投票 ≥ 80% 支持繼續

### Phase 3+：持續優化

**目標**：根據回饋持續改進

- 每月審查 Agent 性能指標
- 每季更新 Prompt 模板
- 每半年評估自主性等級調整

---

## 📈 KPI 指標

### 效率指標

| 指標 | 目標值 | 測量方式 |
|-----|--------|---------|
| **平均決策時間** | < 2 秒 | audit_log.decision_time_ms |
| **程式碼建議接受率** | ≥ 70% | 被採用的建議 / 總建議數 |
| **開發時間節省** | ≥ 30% | 問卷調查 + 統計數據 |
| **自動化覆蓋率** | ≥ 50% | 自動化任務 / 總任務數 |

### 品質指標

| 指標 | 目標值 | 測量方式 |
|-----|--------|---------|
| **Agent 產生程式碼的測試覆蓋率** | ≥ 80% | coverage report |
| **Lint 通過率** | 100% | lint result |
| **Type 安全性** | 100% (無 `any`) | static analysis |
| **安全漏洞數** | 0 | security scan |

### 可靠性指標

| 指標 | 目標值 | 測量方式 |
|-----|--------|---------|
| **自動操作成功率** | ≥ 95% | 成功次數 / 總次數 |
| **防護機制誤報率** | < 5% | 誤報次數 / 總觸發次數 |
| **回滾次數** | < 1 次/月 | 統計回滾操作 |

### 安全指標

| 指標 | 目標值 | 測量方式 |
|-----|--------|---------|
| **安全事件數** | 0 | 安全事件報告 |
| **審計日誌完整性** | 100% | 審計系統檢查 |
| **人工審查覆蓋率（高風險操作）** | 100% | audit_log 統計 |

### 使用者體驗指標

| 指標 | 目標值 | 測量方式 |
|-----|--------|---------|
| **使用者滿意度** | ≥ 4/5 | 月度問卷 |
| **Agent 建議品質評分** | ≥ 4/5 | 每次建議後評分 |
| **錯誤建議率** | < 10% | 被拒絕且標記為錯誤的建議 |

---

## 💡 工作流程範例

### 範例 1：拆分大型 Mermaid 思維導圖

**背景**：`docs/10-系統架構思維導圖.mermaid.md` 過大，需拆分為多個子頁面

#### Step 1：Agent 分析（Level 0）

```json
{
  "request": {
    "type": "document_analysis",
    "action": "analyze_structure",
    "file": "docs/10-系統架構思維導圖.mermaid.md"
  },
  "output": {
    "total_lines": 1500,
    "sections_detected": [
      "帳戶層架構",
      "藍圖層架構",
      "任務執行系統",
      "異常處理系統",
      "協作溝通系統",
      "資料分析系統"
    ],
    "recommendation": "建議拆分為 6 個獨立檔案"
  }
}
```

#### Step 2：Agent 產生拆分建議（Level 1）

```json
{
  "request": {
    "type": "document_refactoring",
    "action": "split_document",
    "file": "docs/10-系統架構思維導圖.mermaid.md"
  },
  "output": {
    "proposed_structure": [
      {
        "file": "docs/arch/01-account-layer.mermaid.md",
        "title": "帳戶層架構",
        "lines": [1, 250]
      },
      {
        "file": "docs/arch/02-blueprint-layer.mermaid.md",
        "title": "藍圖層架構",
        "lines": [251, 500]
      },
      {
        "file": "docs/arch/03-task-execution.mermaid.md",
        "title": "任務執行系統",
        "lines": [501, 750]
      }
      // ... 其他章節
    ],
    "index_file": {
      "file": "docs/arch/README.md",
      "content": "# 系統架構文件\n\n..."
    },
    "requires_approval": true
  }
}
```

#### Step 3：人工審查與確認

開發者審查建議：
- ✅ 拆分邏輯合理
- ✅ 檔案命名符合慣例
- ✅ 索引檔案結構清晰

輸入確認：`/agent approve split-mindmap`

#### Step 4：Agent 執行拆分（Level 2）

```json
{
  "request": {
    "type": "document_refactoring",
    "action": "execute_split",
    "approval_token": "split-mindmap-approved-by-user123"
  },
  "output": {
    "files_created": 7,
    "files_modified": 2,
    "changes": [
      {
        "action": "create",
        "file": "docs/arch/01-account-layer.mermaid.md",
        "status": "success"
      },
      // ...
      {
        "action": "modify",
        "file": "docs/README.md",
        "change": "新增架構文件索引連結",
        "status": "success"
      }
    ],
    "commit_message": "docs(arch): 拆分系統架構思維導圖為子頁面",
    "pr_number": 123
  }
}
```

#### Step 5：自動驗證

```json
{
  "validation": {
    "broken_links": 0,
    "markdown_lint": "passed",
    "all_files_created": true,
    "index_updated": true,
    "status": "success"
  }
}
```

### 範例 2：自動更新 API 文件

**背景**：`src/app/core/services/user.service.ts` 新增方法，需自動更新 API 文件

#### Step 1：偵測變更（CI Trigger）

```yaml
# .github/workflows/docs-sync.yml
on:
  push:
    paths:
      - 'src/app/core/services/**/*.ts'
```

#### Step 2：Agent 分析變更（Level 1）

```json
{
  "request": {
    "type": "api_documentation",
    "action": "detect_changes",
    "files": ["src/app/core/services/user.service.ts"]
  },
  "output": {
    "new_methods": [
      {
        "name": "getUserProfile",
        "signature": "getUserProfile(userId: string): Observable<UserProfile>",
        "description": "取得使用者完整個人檔案",
        "added_in_commit": "abc123"
      }
    ],
    "affected_docs": ["docs/26-API-接口詳細文檔.md"],
    "requires_approval": true
  }
}
```

#### Step 3：Agent 產生文件更新（Level 2）

```json
{
  "request": {
    "type": "api_documentation",
    "action": "generate_doc_update",
    "method": "getUserProfile"
  },
  "output": {
    "doc_update": {
      "file": "docs/26-API-接口詳細文檔.md",
      "section": "UserService",
      "content": "### getUserProfile\n\n取得使用者完整個人檔案...",
      "pr_created": true,
      "pr_number": 124
    }
  }
}
```

---

## ⚙️ 操作注意事項

### Feature Flag 控制

所有 Agent 功能透過 Feature Flag 控制：

```typescript
// config/agent-features.ts
export const AGENT_FEATURES = {
  enabled: process.env.AGENT_ENABLED === 'true',
  autonomy_level: parseInt(process.env.AGENT_AUTONOMY_LEVEL || '1'),
  features: {
    code_generation: process.env.AGENT_CODE_GEN === 'true',
    auto_commit: process.env.AGENT_AUTO_COMMIT === 'true',
    auto_pr: process.env.AGENT_AUTO_PR === 'true',
    auto_merge: process.env.AGENT_AUTO_MERGE === 'true',  // 預設關閉
    docs_sync: process.env.AGENT_DOCS_SYNC === 'true'
  },
  guardrails: {
    max_files_per_operation: 10,
    max_lines_per_file: 1000,
    require_approval_for_high_risk: true
  }
};
```

### 回滾政策

#### 自動回滾觸發條件

1. **CI 失敗**：Agent 產生的 PR 若 CI 失敗，自動關閉 PR
2. **安全掃描失敗**：觸發 Critical 安全問題，立即回滾
3. **測試覆蓋率下降**：覆蓋率低於閾值（80%），阻擋合併

#### 手動回滾流程

```bash
# 1. 識別問題 commit
git log --oneline --grep="agent-generated"

# 2. 執行回滾
git revert <commit-sha>

# 3. 記錄回滾原因
# 在 audit log 中標記回滾事件
curl -X POST /api/audit/rollback \
  -d '{"commit": "<sha>", "reason": "..."}'

# 4. 暫停 Agent 功能（若需要）
export AGENT_ENABLED=false
```

### 維護者職責

#### 日常維護

- **每日**：檢查 Agent 審計日誌，確認無異常
- **每週**：審查 Agent 產生的 PR 品質
- **每月**：分析 KPI 指標，調整參數

#### 定期審查

- **每季**：
  - 審查 Prompt 模板效果
  - 更新安全防護規則
  - 評估自主性等級調整
  
- **每半年**：
  - 完整架構審查
  - 使用者訪談與回饋收集
  - 決定下一階段路線圖

#### 事件回應

- **安全事件**：立即暫停 Agent，分析根因，修復後恢復
- **大量錯誤建議**：降低自主性等級，調整 Prompt
- **效能問題**：優化決策流程，減少 token 使用

### 團隊溝通

#### 週報格式

```markdown
## Agent 週報 (2025-11-18 ~ 2025-11-24)

### 統計數據
- 總操作次數：250
- 成功率：97%
- 平均決策時間：1.2 秒
- 節省開發時間：估計 15 小時

### 亮點
- ✅ 成功自動更新 10 份 API 文件
- ✅ 產生 50+ 測試案例，覆蓋率 85%

### 問題
- ⚠️ 5 次誤報防護機制（已調整）
- ⚠️ 2 個 PR 需要額外人工修正

### 下週計劃
- 優化 Prompt 模板（減少誤報）
- 啟用自動依賴更新功能
```

---

## 📚 相關文檔

### 核心文檔
- [43-Agent開發指南與限制說明.md](../43-Agent開發指南與限制說明.md) - Agent 開發最佳實踐
- [41-AI助手角色配置.md](../41-AI助手角色配置.md) - AI 助手角色定義
- [AGENTS.md](../../AGENTS.md) - Agent 指引總覽

### 架構文檔
- [27-完整架構流程圖.mermaid.md](../27-完整架構流程圖.mermaid.md) - 系統架構
- [21-架構審查報告.md](../21-架構審查報告.md) - 架構審查
- [00-開發作業指引.md](../00-開發作業指引.md) - 開發規範

### 安全文檔
- [34-安全檢查清單.md](../34-安全檢查清單.md) - 安全標準
- [21-安全與-RLS-權限矩陣.md](../21-安全與-RLS-權限矩陣.md) - 權限控制

---

## 🔄 版本歷史

### v1.0 (2025-11-20)

- ✅ 初始版本
- ✅ 定義四個自主性等級
- ✅ 建立輸入/輸出 JSON Schema
- ✅ 提供 3 個 Prompt 模板
- ✅ 定義安全防護機制
- ✅ 規劃分階段推出計劃（Phase 0-3+）
- ✅ 建立 KPI 指標體系
- ✅ 提供 2 個完整工作流程範例

---

## 📧 意見回饋

如對此規範有任何建議，請：

1. 在 GitHub 開 issue 並標籤 `agent-autonomy`
2. 或直接提交 PR 修改此文檔
3. 在團隊會議中提出討論

**維護者**：開發團隊  
**最後更新**：2025-11-20

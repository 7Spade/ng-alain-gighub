# Documentation Inventory (00–47)

> **目的**：提供 00–47 號核心文檔的現況總覽，包含檔案類型、最後更新時間、主要用途及主要依賴／受眾，方便後續決定保留、更新或歸檔。

**最後更新**：2025-11-15  
**最近更新**：
- ✅ 完成文檔歸檔整理，移除重複檔案和已完成的工作總結
- ✅ 完成文檔格式標準化，所有核心文檔（00-51）已統一格式和元數據

## 📋 標準化摘要 (2025-11-15)

所有核心文檔現在遵循統一格式：
```markdown
# Document Title

> 📋 **目的**：Brief purpose statement

**最後更新**：2025-11-15  
**維護者**：開發團隊

---

[Content]
```

**標準化完成**：
- ✅ 所有編號文檔（00-51）：42 個文件
- ✅ 所有 Mermaid 圖表文件
- ✅ 支援文檔（CHANGELOG, URL, architecture-current-notes, fyi.md）

---

| #  | File | Type | Last Updated (UTC+8) | Status | Action Notes |
|----|------|------|----------------------|--------|--------------|
| 00 | `docs/00-開發作業指引.md` | Guide | 2025-11-14 12:32 | ✅ Active | 每次流程調整後同步 Git/CI 章節 |
| 01 | `docs/01-專案結構說明.md` | Guide | 2025-11-14 12:32 | ✅ Active | 與 02、04 交叉檢查 |
| 02a | `docs/02-專案結構樹.md` | Guide | 2025-11-14 09:01 | ✅ Active | 持續同步實際目錄（參考 02b） |
| 02b | `docs/Archive/02-專案結構樹-差異報告.md` | Audit | 2025-11-14 10:49 | ✅ Archived | 已歸檔歷史差異報告 |
| 02c | `docs/Archive/02-專案結構樹-路徑對應檢查.md` | Audit | 2025-11-14 09:04 | ✅ Archived | 已歸檔 CI 檢查報告 |
| 12b | `docs/Archive/12-實體關係圖.mermaid-自適應.md` | Diagram | 2025-11-14 15:45 | ✅ Archived | 已歸檔自適應佈局變體 |
| 13b | `docs/Archive/13-帳戶層流程圖.mermaid-1.md` | Diagram | 2025-11-14 15:47 | ✅ Archived | 已歸檔變體版本 |
| 14b | `docs/Archive/14-業務流程圖.mermaid-自適應.md` | Diagram | 2025-11-14 15:48 | ✅ Archived | 已歸檔自適應佈局變體 |
| 14c | `docs/Archive/14-業務流程圖-落地計畫.md` | Planning | 2025-11-15 | ✅ Archived | 已歸檔實施計畫文檔 |
| 03 | `docs/03-專案結構流程圖.mermaid.md` | Diagram | 2025-11-14 15:35 | ✅ Active | 已補 core/infra、permissions、shared/services |
| 04 | `docs/04-重構後結構樹.md` | Guide | 2025-11-14 01:36 | ✅ Active | 與 19 模組視圖對齊 |
| 10 | `docs/10-系統架構思維導圖.mermaid.md` | Diagram | 2025-11-14 11:34 | ✅ Active | 下次版本審查前再更新 |
| 11 | `docs/11-Supabase架構流程圖.mermaid.md` | Diagram | 2025-11-14 15:40 | ✅ Active | 新增 Git-like branch tables、branch-merge Edge Function |
| 12 | `docs/12-實體關係圖.mermaid.md` | Diagram | 2025-11-14 15:45 | ✅ Active | 新增 branch_forks / staging_submissions 等資料表 |
| 13 | `docs/13-帳戶層流程圖.mermaid.md` | Diagram | 2025-11-14 15:47 | ✅ Active | 加入 BranchPolicy + RLS 權限層 |
| 14 | `docs/14-業務流程圖.mermaid.md` | Diagram | 2025-11-14 15:48 | ✅ Active | 補 Git-like 分支與暫存撤回流程 |
| 15 | `docs/15-序列圖.mermaid.md` | Diagram | 2025-11-14 15:49 | ✅ Active | 新增 fork/PR、暫存提交流程 |
| 16 | `docs/16-狀態圖.mermaid.md` | Diagram | 2025-11-14 12:32 | ✅ Active | 與 43 狀態值同步 |
| 17 | `docs/17-系統上下文圖.mermaid.md` | Diagram | 2025-11-14 12:09 | ✅ Active | 保留 |
| 18 | `docs/18-容器圖.mermaid.md` | Diagram | 2025-11-14 12:09 | ✅ Active | 保留 |
| 19 | `docs/19-元件模組視圖.mermaid.md` | Diagram | 2025-11-14 12:09 | ✅ Active | 保留 |
| 20 | `docs/20-部署基礎設施視圖.mermaid.md` | Diagram | 2025-11-14 12:09 | ✅ Active | 與 39 互相參照 |
| 21 | `docs/21-安全與-RLS-權限矩陣.md` | Guide | 2025-11-14 12:09 | ✅ Active | 補充最新 policy 變更 |
| 22 | `docs/22-資料生命週期-ETL-流程圖.mermaid.md` | Diagram | 2025-11-14 15:52 | ✅ Active | 加入 branch events 與暫存隊列 |
| 23 | `docs/23-可觀測性與CI-CD管道圖.mermaid.md` | Diagram | 2025-11-14 15:53 | ✅ Active | 增 Supabase migration / Edge deploy 節點 |
| 24 | `docs/24-領域事件時間軸圖.mermaid.md` | Diagram | 2025-11-14 15:54 | ✅ Active | 新增 fork/PR/暫存等領域事件 |
| 25 | `docs/25-API-介面映射圖.mermaid.md` | Diagram | 2025-11-14 15:55 | ✅ Active | 補分支治理 / 暫存 API |
| 26 | `docs/26-Storage-Bucket結構視圖.mermaid.md` | Diagram | 2025-11-14 15:56 | ✅ Active | 新增 blueprint-assets / task-attachments 等 bucket |
| 27 | `docs/27-完整架構流程圖.mermaid.md` | Diagram | 2025-11-14 11:04 | ✅ Active | 下一版審查同步 |
| 28 | `docs/28-架構審查報告.md` | Report | 2025-11-14 11:04 | ✅ Active | 最新審查基準 |
| 30-0 | `docs/30-0-完整SQL表結構定義.md` | Reference | 2025-11-14 11:04 | ✅ Active | 建 migration 時引用 |
| 30 | `docs/30-資料表清單總覽.md` | Guide | 2025-11-14 10:49 | ✅ Active | 與 30-0、34 交叉 |
| 31 | `docs/31-開發前檢查清單.md` | Checklist | 2025-11-14 11:14 | ✅ Active | 連結 Archive，續維 |
| 32 | `docs/32-快速開始指南.md` | Guide | 2025-11-14 12:32 | ✅ Active | 保留 |
| 33 | `docs/33-API-接口詳細文檔.md` | Reference | 2025-11-14 15:58 | ✅ Active | 補 Git-like / 暫存 REST 端點與範例 |
| 34 | `docs/34-資料模型對照表.md` | Reference | 2025-11-14 12:32 | ✅ Active | 與 30-0、Shared models 同步 |
| 35 | `docs/35-開發工作流程.md` | Guide | 2025-11-14 12:32 | ✅ Active | 定期 review |
| 36 | `docs/36-常見問題-FAQ.md` | Guide | 2025-11-14 16:00 | ✅ Active | 新增 Git-like / 暫存使用者 FAQ |
| 37 | `docs/37-錯誤處理指南.md` | Guide | 2025-11-14 16:00 | ✅ Active | 補 branch/staging 錯誤碼與 Edge Function 流程 |
| 38 | `docs/38-測試指南.md` | Guide | 2025-11-14 16:00 | ✅ Active | 新增 Git-like / 暫存測試場景＋Playwright 範例 |
| 39 | `docs/39-部署指南.md` | Guide | 2025-11-14 16:00 | ✅ Active | 部署清單含 Supabase migration/Edge deploy |
| 40 | `docs/40-效能優化指南.md` | Guide | 2025-11-14 16:00 | ✅ Active | 新增 branch/staging 索引與監控重點 |
| 41 | `docs/41-安全檢查清單.md` | Checklist | 2025-11-14 16:00 | ✅ Active | 加入 branch_roles / staging / bucket 安全檢查 |
| 42 | `docs/42-詞彙表.md` | Reference | 2025-11-14 10:49 | ✅ Active | 定期新增術語 |
| 43 | `docs/43-狀態枚舉值定義.md` | Reference | 2025-11-14 10:49 | ✅ Active | 與狀態圖、Shared enums 對齊 |
| 44 | `docs/44-專案路線圖.md` | Guide | 2025-11-14 11:18 | ✅ Active | 保持最新里程碑 |
| 45 | `docs/45-SHARED_IMPORTS-使用指南.md` | Guide | 2025-11-13 10:55 | ✅ Active | 需於 SHARED_IMPORTS 調整時更新 |
| 46 | `docs/46-ng-zorro-antd-組件清單與CLI指令.md` | Reference | 2025-11-14 02:30 | ✅ Active | 定期同步 ng-zorro release |
| 47 | `docs/47-DELON-Index-索引.md` | Reference | 2025-11-14 10:49 | ✅ Active | 保留 |

> 📦 標記的文檔已移至 `docs/Archive/`（例如 `docs/Archive/02-專案結構樹-差異報告.md`）。  
> 下一步：依此表進行內容更新與剩餘檔案的歸檔動作。

## Summary & Next Steps

### 2025-11-15 更新：文檔歸檔整理完成 ✅

1. **Archive complete**：
   - ✅ 已將重複的架構圖變體移至 Archive（12b, 13b, 14b, 14c）
   - ✅ 已將 10 個工作總結和策略文檔移至 Archive
   - ✅ 創建 Archive/README.md 說明歸檔文檔的分類和使用方式
   - ✅ 移除 2 個重複文檔（工作總結-v2、狀態檢查報告）
   
2. **Current state**：
   - 核心文檔（00-47）：✅ 全部整理完成，狀態良好
   - 根目錄僅保留：核心編號文檔、README、CHANGELOG、PRD、FYI系列、URL、architecture-current-notes、documentation-inventory
   - Archive 文檔：61 個歷史文檔，已分類整理

3. **Update backlog**（後續待辦）：
   - **架構／流程圖**（03、11–15、22–26）：依最新 Git-like 架構、Supabase RLS、CI/CD pipeline 重新輸出 mermaid 圖。
   - **技術指南**（33、36–41）：同步 Angular 20 + Signals + Supabase 目前實作，補充 Playwright、perf、安全清單等章節。
   
4. **Review cadence**：將每月架構審查與版本規劃加入 `docs/35-開發工作流程.md`，以持續驅動上述更新。

---

## 📦 歸檔文檔說明

已歸檔的文檔包括：
- **架構圖變體**（4 個）：自適應佈局版本和變體版本
- **工作總結**（30+ 個）：2025-01-15 和 2025-11-14 的開發工作記錄
- **策略文檔**（8 個）：模塊推進策略和問題分析
- **FYI 歷史版本**（10 個）：早期版本，已被最新版取代
- **其他**（8 個）：結構檢查報告、RLS 問題處理等

詳細說明請參考：[Archive/README.md](./Archive/README.md)


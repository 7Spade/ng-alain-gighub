# Epic：培訓與合規證書管理

> 對應 `docs/PRD.md`（文件管理 / 品質驗收章節）與 `docs/44-專案路線圖.md` 中「正式版：完整文檔、用戶培訓」里程碑。

## 🎯 目標
- 提供統一的培訓/證書寄存流程，確保承攬商提交的安全、品管、合規證書都有可追溯紀錄。
- 讓業主/品管可以在 PR 或驗收節點立即檢查證書狀態，並追蹤到期提醒。
- 與待辦中心與通知系統整合，確保責任人即時收到補件/退回資訊。

## 📦 範圍
1. 證書上傳（含版本控制、縮圖、Metadata）。
2. 證書列表 / 篩選 UI，以任務、分支、期限、狀態為維度。
3. 審核流程：核准、退回、備註、通知與活動記錄。
4. 到期提醒與個人待辦、自動通知。
5. 與 PR 審核/待辦中心/品質驗收的整合勾稽。

## 🧩 相關用戶故事
- [story-cert-upload.md](../../user-stories/story-cert-upload.md)
- [story-cert-list.md](../../user-stories/story-cert-list.md)

## ✅ 驗收標準
1. 承攬商可於任務、QC、驗收介面上傳證書檔案並綁定對應流程。
2. 品管/業主持有搜尋、排序、過濾功能的全域證書列表，並可審核或退回。
3. PR 審核檢查表內會列出本次變更涉及的證書差異，缺件時阻擋合併並自動建立待辦。
4. 到期提醒（<=30 天）自動推送通知並寫入 `personal_todos`，支援批次確認。
5. 所有操作寫入 `activity_logs`，並可在主分支歷史中追溯責任人和時間。

## 🔗 依賴
- Supabase Storage Bucket + `documents` / `document_versions` / `document_thumbnails` 結構。
- 通知/待辦系統（`notifications`, `personal_todos`, `task_lists`）。
- PR 審核流程（`pull_requests`）及 Git-like 權限；需要確保 RLS 覆蓋附件。

## 📈 KPI
- PR 審核前缺件率 < 2%。
- 退回證書重新提交平均時間 < 24h。
- 到期證書自動提醒成功率 100%。
- 品管理由上傳證書到核准的平均時間 < 48h。

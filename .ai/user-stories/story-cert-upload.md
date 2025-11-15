# User Story：證書上傳

## Story
As a **承攬商專案工程師**
I want **在任務或驗收節點上傳施工合規/安全證書附件**
So that **品管與業主可於 PR 審核前即時驗證資質並留下審計線索**

## 驗收標準
1. 使用者可於任務明細、品質檢查或驗收表單中選擇「上傳證書」，支援 PDF/JPEG/PNG，單檔上限 20MB。
2. 上傳後建立 `documents` 與 `document_versions` 記錄，並標記事件類型（certificate）、所屬任務/檢查 ID、分支 ID。
3. 系統自動產生縮圖（若為圖片）並儲存至 `document_thumbnails`，供待辦中心/審核對話框預覽。
4. 所有證書遵循分支權限：承攬商僅能存取自己分支，擁有者可於主分支查閱且具審計記錄（`activity_logs`）。
5. 上傳完成後將事件推送到通知系統（task/inspection subscription）並寫入待辦中心「品管中」或「驗收中」條目附註。
6. 若上傳失敗（網路中斷或格式錯誤）需給出可讀錯誤訊息並允許重試；已部分成功的檔案需支援中斷續傳或重新上傳覆蓋版本。

## 技術要求
- 前端使用 Angular `NzUpload` + Supabase Storage Signed URL，並在 `documents` 表儲存 metadata（MIME、hash、來源分支）。
- 檔案上傳完成後觸發 Edge Function 產生縮圖與病毒掃描結果（若安全規範要求），狀態回寫至 `document_versions.status`。
- 任務/驗收 Signal 狀態需同步更新，以便 UI 即時顯示附件清單（利用 `@for` + `track`）。
- 按照 `docs/37-錯誤處理指南.md` 進行錯誤分類與 retries，並在 `activity_logs` 記錄操作者、IP、User Agent。

## 相關文檔
- `docs/PRD.md`（文件管理 / 品質驗收章節）
- `docs/30-資料表清單總覽.md`（documents、document_versions、document_thumbnails）
- `docs/33-API-接口詳細文檔.md`（Storage/Document API 區段）
- `docs/37-錯誤處理指南.md`

# 建議插入：README / ARCHITECTURE 的段落（可直接貼入現有文件）

說明
- 以下為建議的文件段落與說明，方便你直接將它們貼到 repo 的 README.md 或 docs/ARCHITECTURE.md 中的「Access Control / Identity」或「概念定義」區塊。請根據既有文件風格調整語氣與標題層級。

建議段落：在 README 的「Entities / Access Control」下加入
---
## Organization vs Team（企業層級說明）
在本系統中我們明確區分兩種協作單位：

- Organization（租戶/公司）
  - 代表企業層級資源與設定（例如：計費、租戶設定）。
  - 成員記錄於 organization_members，擁有 org-level roles（owner / admin / member / billing）。
- Team（團隊）
  - Team 屬於某 Organization，方便將工作、專案與資料細分給特定成員。
  - 成員記錄於 team_members，擁有 team-level roles（team_admin / team_member / observer）。

重要：Organization member 不等於 Team member。若要進一步控制存取，請參考 docs/ORG-TEAM-GLOSSARY.md。

建議段落：在 ARCHITECTURE.md 的「Security / RBAC」下加入
---
### RBAC 範例與實作要點（高階）
- 保持最小權限原則，將 org-scoped 與 team-scoped 權限分層處理。
- 使用結構化型別（參見 docs/ORG-TEAM-GLOSSARY.md），避免混淆 role 字串。
- 所有 RLS / 授權策略在上線前必須通過安全審查與測試環境驗證。

插入位置建議
- README：靠近「Quick Start」或「概念定義(Concepts)」區塊。
- ARCHITECTURE：靠近「Domain Model」或「Security」章節。

Commit 範例（建議）
- commit message: docs: add org vs team glossary and README/ARCHITECTURE snippets

PR Checklist（請在 PR description 中附上）
- [ ] linted / 格式化 (prettier/eslint)
- [ ] 文件已加入 docs/ 並包含版本與作者資訊
- [ ] Security review: RLS snippets 為示意，實際 policy 需經過 DB 管理員驗證
- [ ] QA: 前端 UI 文案修改與後端 API/Type contract 一致
# 組織 (Organization) 與 團隊 (Team) — 定義、差異與實作建議

目的
- 在企業化產品中，"組織"（Organization）與"團隊"（Team）常被混用，導致保安、介面、API 與 AI 文件化時產生歧義。此文件為開發、產品與文件團隊提供清晰定義、範例型別、UI 文案建議、RBAC / RLS 思路與常見誤區，以維持企業等級的一致性與安全性。

重要原則（企業化標準）
- 清楚分層（Scope）：Organization 為租戶/公司層級；Team 為 Organization 內的次級協作單位。
- 最小權限原則：權限應盡量授予最小必要範圍（org vs team）。
- 型安全與契約：後端 API / 前端 model 使用明確 interface，避免 any。
- 文件要可供 AI 與人類同時理解：UI Label、API 名稱與文件術語應一致。

1. 定義（簡潔）
- Organization（組織）
  - 代表一個企業或租戶（例如：Acme Corp.）。
  - 擁有全域資源、計費資訊、管理員（org owners / admins）與 RLS 隔離範圍。
  - Organization 成員（Organization Members）是指被加到該組織的使用者（視為租戶級別的用戶集合），可有不同 org 角色（owner, admin, member, billing）。
- Team（團隊）
  - 屬於某一個 Organization 的子集合（例如：Acme Corp. → Platform Team）。
  - Team 用於協作細分、資料/專案權限細粒度控制（例如：只看某 product 的資料）。
  - Team 成員（Team Members）是被加入到 Team 的使用者（可同時為 Organization 成員），有 team 角色（team_admin, team_member）。

2. 資料模型建議（TypeScript 範例）
- 使用型別契約以利前後端一致、也方便文件與 AI 理解。

```ts
// 請以 strict mode 使用
export type ID = string;

export interface Organization {
  id: ID;
  name: string;
  slug?: string; // 可選，方便 URL
  created_at: string; // ISO timestamp
  // 其他 metadata（address, billing info）應以物件封裝，避免平坦欄位過多
}

export type OrgRole = 'owner' | 'admin' | 'member' | 'billing';

export interface OrganizationMember {
  id: ID;
  org_id: ID;
  user_id: ID;
  role: OrgRole;
  joined_at: string;
  // extra: JSON meta for invite state, accepted_at etc.
}

export type TeamRole = 'team_admin' | 'team_member' | 'observer';

export interface Team {
  id: ID;
  org_id: ID;
  name: string;
  slug?: string;
  created_at: string;
}

export interface TeamMember {
  id: ID;
  team_id: ID;
  user_id: ID;
  role: TeamRole;
  joined_at: string;
}
```

3. 權限與行為差異（簡表）
- Organization Member
  - 可登入並在該租戶範圍內建立資源（視 role 而定）。
  - 擁有租戶級別的可見性（若被授權）。
  - 不能自動擁有所有 Team 的權限，除非同時被加入 Team 或擁有 Org owner/admin 權限。
- Team Member
  - 主要權限限於 Team 所屬的資源（projects, repos, tickets 等）。
  - Team member 的範圍較小；多個 Team 的成員可能重疊。
- 範例：Org owner 可以建立 Team、邀請 org 成員、變更帳單；Team admin 只能管理 Team 內成員與專案。

4. UI / 文案建議（避免 AI 混淆）
- 清楚區別顯示：
  - 組織頁面標題：Organization members — Members in <Organization Name>
  - 團隊頁面標題：Team members — Members in <Team Name> (Org: <Organization Name>)
- 在邀請流程中分兩步提示（避免誤邀）：
  - Step 1：選擇加入範圍： [ ] Organization-wide (Org role)  [ ] Specific team(s)
  - Step 2：設定角色（Role 下拉）
- 使用工具提示（tooltip）文字：
  - Organization member tooltip: "Organization-level access. Does not by default grant access to Team-specific resources unless added to the Team."
  - Team member tooltip: "Team-level access scoped to <Team Name>. User must also be Organization member."

5. API 與 DB 設計注意（高階建議）
- Tables: organizations, organization_members, teams, team_members
- Constraint：team.org_id -> organizations.id（team 必須屬於 org）
- Enforce invite-accept flow: organization_members should have state enum (invited, active, suspended)
- Do not treat team_members as a replacement for organization membership: keep both tables,並在新增 team_member 時檢查 user 是否為該 org 的 active member（或在 invite 時一併 invite org）。

6. Supabase / RLS 建議（示意）
- 目標：同時支持 org-scoped 與 team-scoped 權限。
- 假設有 jwt.claims.org (從登入 token 帶入，或後端檢查)。

示意 RLS 範例（請先在測試環境驗證）：
- 限制 team 資料只能被同 org 的成員讀取：
```sql
-- 只示意，請勿直接把 service_role key 寫入程式碼
create policy "team_select_by_org_member" on teams
for select using (
  exists (
    select 1 from organization_members om
    where om.org_id = teams.org_id
      and om.user_id = auth.uid()
      and om.role in ('owner','admin','member')
  )
);
```
- 限制 team_resources 只能給 team_members：
```sql
create policy "team_resource_select" on team_resources
for select using (
  exists (
    select 1 from team_members tm
    where tm.team_id = team_resources.team_id
      and tm.user_id = auth.uid()
  )
);
```
- 注意事項：
  - 上述 policy 為示範邏輯；實際 application 需考慮 guest / external user、invited but not accepted 的情況。
  - 不要把 sysadmin 或 service_role 權限放到前端 token。

7. 常見誤區（與修正建議）
- 誤區：把 team_members 取代 org_members。
  - 修正：保留 org_members 作為租戶成員清單；team_members 只能表示所屬 team 的成員關係。
- 誤區：以為 Org admin 自動為所有 team admin。
  - 修正：定義清楚 inheritance 規則（若要讓 Org admin 自動成為 team admin，文件與 UI 需明確描述，並在 DB 或 service 層強制同步）。
- 誤區：API 回傳模糊結構（e.g., user.roles = ['org:admin','team:admin']）。
  - 修正：使用結構化回傳： { org_roles: [...], team_roles: [{ team_id, role }] }

8. 小結（Checklist）
- [ ] 清楚區分「Organization Members」與「Team Members」在 UI 與 API 中的用語。
- [ ] 保持兩張表（organization_members, team_members），加入約束與狀態欄位。
- [ ] 文件、API 與前端 model 使用相同 TypeScript interface。
- [ ] RLS policy 在測試環境驗證，確保沒有不可預期的權限放大。

附錄：示例 use-case
- 使用者 Alice 被邀請為 Org member (member)，沒被加入任何 team → Alice 可以看租戶級概覽，但無法看到 team-specific 資源。
- Bob 為 Org member (member) 並加入 Platform Team (team_member) → Bob 可存取 Platform Team 的專案。

版權與審核
- 此文件為企業化建議，任何 DB schema 或 policy 變更必須伴隨 migration SQL 與回滾策略，經 Architect / Security 審核後方可上線。
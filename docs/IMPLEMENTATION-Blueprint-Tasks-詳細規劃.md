# Blueprint → Tasks 詳細實施規劃與任務表

> **目的**：根據 Blueprint 與 Tasks 架構，結合 Sequential Thinking 與 Software Planning Tool 方法論，建立完整的實施計畫與任務清單

**建立日期**：2025-11-17  
**版本**：v1.0  
**狀態**：規劃階段  
**負責團隊**：開發團隊

---

## 📋 執行摘要

### 核心架構理解

**Blueprint（藍圖）= 專案級主容器**

```
Account (User/Organization/Bot)
 └─ Blueprint（n個）◄─────┐
     ├─ 擁有權（owner_id）  │ 所有業務資料
     ├─ 權限邊界（RLS）     │ 都綁定在這裡
     ├─ 資料容器           │
     │   ├─ tasks         │
     │   ├─ daily_reports │
     │   ├─ quality_checks│
     │   ├─ issues       │
     │   ├─ documents    │
     │   ├─ activity_logs│
     │   └─ progress_tracking
     └─ Git-like 分支模型
         ├─ Main Branch（主分支）
         │   └─ 完全控制權
         └─ Blueprint Branches（組織分支）
             └─ 僅操作承攬欄位
```

**Tasks（任務）= Blueprint 下的核心執行單元**

```
Blueprint
 └─ Tasks（樹狀結構，無層級限制）
     ├─ 父任務（Phase/Milestone）
     │   ├─ 子任務 1
     │   └─ 子任務 2
     │       └─ 子子任務
     ├─ 任務指派（個人/團隊/組織/承攬）
     ├─ 任務狀態機
     │   ├─ 🟦 待執行 → pending
     │   ├─ 🔵 進行中 → in_progress
     │   ├─ 🟨 暫存中 → staging
     │   ├─ 🟧 品管中 → quality_check
     │   ├─ 🟥 驗收中 → inspection
     │   ├─ ✅ 已完成 → completed
     │   └─ ❌ 已取消 → cancelled
     ├─ 48小時暫存機制（task_staging）
     ├─ 每日報表（daily_reports）
     │   ├─ 工作摘要
     │   ├─ 工作時數
     │   ├─ 施工照片（Storage）
     │   └─ 天氣記錄（weather_cache）
     ├─ 品質驗收（quality_checks）
     │   ├─ Checklist
     │   ├─ 評分標準
     │   └─ 驗收照片
     └─ 最終驗收（inspections）
         └─ 責任切割
```

---

## 🎯 實施策略

### 階段劃分

#### 🔴 **階段一：Blueprint 基礎建設**（2-3週）

**目標**：建立 Blueprint 核心功能與 Git-like 分支模型

- Blueprint CRUD（建立、列表、詳情、更新、刪除）
- 擁有權管理（owner: User/Organization/Bot）
- 權限邊界（RLS 策略）
- 分支系統基礎（Main Branch + Organization Branches）
- Blueprint 設定（工作日曆、通知規則、自訂欄位）

#### 🟡 **階段二：Tasks 核心功能**（3-4週）

**目標**：實作 Tasks 樹狀結構與狀態機

- Tasks CRUD（建立、列表、詳情、更新、刪除）
- 樹狀結構（父子關係、無層級限制）
- 任務指派（個人/團隊/組織/承攬）
- 任務狀態機（7種狀態流轉）
- 48小時暫存機制（task_staging）

#### 🟢 **階段三：執行與驗收**（2-3週）

**目標**：完成任務執行流程

- 每日報表（daily_reports）
- 照片上傳（Storage 整合）
- 天氣記錄（weather_cache + CWA API）
- 品質驗收（quality_checks）
- 最終驗收（inspections）
- 進度追蹤（progress_tracking）

#### ⚪ **階段四：協作與分析**（2週）

**目標**：完善協作功能與數據分析

- 問題追蹤（issues）
- 討論區（comments）
- 通知中心（notifications）
- 待辦中心（personal_todos）
- 數據分析（analytics_cache）
- 活動記錄（activity_logs）

---

## 📊 詳細任務清單

### 階段一：Blueprint 基礎建設

#### Task 1.1: Blueprint 資料模型設計
**複雜度**: 5/10  
**預估時間**: 2 天  
**優先級**: 🔴 最高

**實施內容**：

1. **TypeScript 模型定義**
   ```typescript
   // src/app/shared/models/blueprint.model.ts
   export interface Blueprint {
     id: string;
     name: string;
     description?: string;
     owner_id: string; // Account ID (User/Organization/Bot)
     owner_type: 'User' | 'Organization' | 'Bot';
     status: 'draft' | 'active' | 'completed' | 'archived';
     start_date?: string;
     end_date?: string;
     site_location?: string;
     
     // 設定
     config: {
       work_calendar?: WorkCalendar;
       notification_rules?: NotificationRule[];
       custom_fields?: CustomField[];
     };
     
     // Git-like 元資料
     is_main_branch: boolean;
     forked_from?: string; // 如果是分支，指向主分支 ID
     
     // 時間戳
     created_at: string;
     updated_at: string;
     created_by: string;
   }
   
   export interface WorkCalendar {
     working_days: number[]; // 0-6 (Sunday-Saturday)
     holidays: string[]; // ISO date strings
     start_time: string; // HH:mm
     end_time: string; // HH:mm
   }
   
   export interface NotificationRule {
     event_type: string;
     channels: ('in_app' | 'email' | 'push')[];
     recipients: string[]; // Account IDs
   }
   
   export interface CustomField {
     id: string;
     name: string;
     type: 'text' | 'number' | 'date' | 'select';
     options?: string[]; // for select type
     required: boolean;
   }
   ```

2. **資料庫 Schema 驗證**
   - 使用 Supabase MCP 檢查 `blueprints` 表結構
   - 確認外鍵關聯（owner_id → accounts）
   - 驗證 RLS 政策

3. **Repository Pattern 實作**
   ```typescript
   // src/app/core/repositories/blueprint.repository.ts
   @Injectable({ providedIn: 'root' })
   export class BlueprintRepository {
     private readonly supabase = inject(SupabaseService);
     
     async create(blueprint: Partial<Blueprint>): Promise<Blueprint> {
       const { data, error } = await this.supabase
         .from('blueprints')
         .insert(blueprint)
         .select()
         .single();
       
       if (error) throw new Error(`建立藍圖失敗: ${error.message}`);
       return data;
     }
     
     async getByOwner(ownerId: string): Promise<Blueprint[]> {
       const { data, error } = await this.supabase
         .from('blueprints')
         .select('*')
         .eq('owner_id', ownerId)
         .order('created_at', { ascending: false });
       
       if (error) throw new Error(`查詢藍圖失敗: ${error.message}`);
       return data;
     }
     
     // ... 其他 CRUD 方法
   }
   ```

**驗證標準**：
- ✅ TypeScript 模型編譯無誤
- ✅ Repository 方法單元測試通過
- ✅ Supabase MCP 驗證 Schema 正確

**使用工具**：
- Context7: "typescript interface best practices"
- Supabase MCP: `list_tables`, `execute_sql`

---

#### Task 1.2: Blueprint CRUD UI 實作
**複雜度**: 6/10  
**預估時間**: 3 天  
**優先級**: 🔴 最高

**實施內容**：

1. **建立藍圖頁面**
   ```typescript
   // src/app/routes/blueprint/create/create.component.ts
   @Component({
     selector: 'app-blueprint-create',
     standalone: true,
     imports: [SHARED_IMPORTS],
     changeDetection: ChangeDetectionStrategy.OnPush,
     templateUrl: './create.component.html'
   })
   export class BlueprintCreateComponent {
     private fb = inject(NonNullableFormBuilder);
     private router = inject(Router);
     private blueprintRepo = inject(BlueprintRepository);
     private authState = inject(AuthStateService);
     
     readonly form = this.fb.group({
       name: ['', [Validators.required, Validators.maxLength(100)]],
       description: [''],
       site_location: [''],
       start_date: [null as Date | null],
       end_date: [null as Date | null],
       // 工作日曆
       working_days: [this.fb.array([1, 2, 3, 4, 5])], // Mon-Fri
       start_time: ['08:00'],
       end_time: ['17:00']
     });
     
     async onSubmit(): Promise<void> {
       if (this.form.invalid) return;
       
       const formValue = this.form.getRawValue();
       const currentUser = this.authState.account();
       
       const blueprint: Partial<Blueprint> = {
         name: formValue.name,
         description: formValue.description,
         owner_id: currentUser!.id,
         owner_type: currentUser!.type,
         site_location: formValue.site_location,
         start_date: formValue.start_date?.toISOString(),
         end_date: formValue.end_date?.toISOString(),
         status: 'draft',
         is_main_branch: true, // 新建的都是主分支
         config: {
           work_calendar: {
             working_days: formValue.working_days,
             holidays: [],
             start_time: formValue.start_time,
             end_time: formValue.end_time
           }
         }
       };
       
       const created = await this.blueprintRepo.create(blueprint);
       await this.router.navigate(['/blueprint', created.id]);
     }
   }
   ```

2. **列表頁面**
   ```typescript
   // src/app/routes/blueprint/list/list.component.ts
   @Component({
     selector: 'app-blueprint-list',
     standalone: true,
     imports: [SHARED_IMPORTS],
     changeDetection: ChangeDetectionStrategy.OnPush,
     templateUrl: './list.component.html'
   })
   export class BlueprintListComponent {
     private blueprintRepo = inject(BlueprintRepository);
     private authState = inject(AuthStateService);
     
     // Signal-based 狀態
     readonly loading = signal(false);
     readonly blueprints = signal<Blueprint[]>([]);
     readonly currentUser = this.authState.account;
     
     constructor() {
       effect(() => {
         const user = this.currentUser();
         if (user) void this.load(user.id);
       });
     }
     
     private async load(ownerId: string): Promise<void> {
       this.loading.set(true);
       try {
         const data = await this.blueprintRepo.getByOwner(ownerId);
         this.blueprints.set(data);
       } finally {
         this.loading.set(false);
       }
     }
   }
   ```

3. **詳情頁面（使用 Facade Pattern）**
   ```typescript
   // src/app/routes/blueprint/detail/blueprint-detail.facade.ts
   @Injectable({ providedIn: 'any' })
   export class BlueprintDetailFacade {
     private route = inject(ActivatedRoute);
     private blueprintRepo = inject(BlueprintRepository);
     
     // 內部狀態
     private readonly loadingSignal = signal(false);
     private readonly blueprintSignal = signal<Blueprint | null>(null);
     private readonly errorSignal = signal<string | null>(null);
     
     // 公開計算屬性
     readonly loading = computed(() => this.loadingSignal());
     readonly blueprint = computed(() => this.blueprintSignal());
     readonly error = computed(() => this.errorSignal());
     readonly isMainBranch = computed(() => this.blueprint()?.is_main_branch ?? false);
     readonly canEdit = computed(() => {
       const bp = this.blueprint();
       const user = this.authState.account();
       return bp?.owner_id === user?.id;
     });
     
     // Route 參數自動載入
     private readonly blueprintId = toSignal(
       this.route.paramMap.pipe(map(params => params.get('id')))
     );
     
     constructor() {
       effect(() => {
         const id = this.blueprintId();
         if (id) void this.load(id);
       });
     }
     
     async load(id: string): Promise<void> {
       this.loadingSignal.set(true);
       this.errorSignal.set(null);
       try {
         const data = await this.blueprintRepo.getById(id);
         this.blueprintSignal.set(data);
       } catch (error) {
         this.errorSignal.set('載入藍圖失敗');
       } finally {
         this.loadingSignal.set(false);
       }
     }
     
     async refresh(): Promise<void> {
       const id = this.blueprintId();
       if (id) await this.load(id);
     }
   }
   ```

**驗證標準**：
- ✅ 表單驗證正確
- ✅ CRUD 操作正常
- ✅ Facade 狀態管理正確
- ✅ RLS 權限生效

**使用工具**：
- Context7: "angular 20 reactive forms signals"
- Context7: "ng-zorro-antd form validation"

---

#### Task 1.3: Git-like 分支系統基礎
**複雜度**: 8/10  
**預估時間**: 4 天  
**優先級**: 🔴 最高

**實施內容**：

1. **分支資料模型**
   ```typescript
   // src/app/shared/models/branch.model.ts
   export interface BlueprintBranch {
     id: string;
     blueprint_id: string; // 指向主分支
     name: string;
     description?: string;
     organization_id: string; // 協作組織 ID
     status: 'active' | 'inactive' | 'merged';
     
     // Fork 資訊
     forked_at: string;
     forked_by: string;
     
     // 時間戳
     created_at: string;
     updated_at: string;
   }
   
   export interface BranchPermission {
     id: string;
     branch_id: string;
     account_id: string;
     role: 'owner' | 'collaborator' | 'viewer';
     can_read: boolean;
     can_write: boolean; // 協作組織僅能寫承攬欄位
     can_delete: boolean;
     created_at: string;
   }
   
   export interface PullRequest {
     id: string;
     source_branch_id: string;
     target_branch_id: string; // 通常是主分支
     title: string;
     description?: string;
     status: 'open' | 'closed' | 'merged';
     
     // 變更內容
     changes: {
       task_id: string;
       field: string;
       old_value: any;
       new_value: any;
     }[];
     
     // 審查資訊
     reviewed_by?: string;
     reviewed_at?: string;
     review_comments?: string;
     merged_by?: string;
     merged_at?: string;
     
     created_at: string;
     created_by: string;
   }
   ```

2. **Fork 功能實作**
   ```typescript
   // src/app/shared/services/branch.service.ts
   @Injectable({ providedIn: 'root' })
   export class BranchService {
     private supabase = inject(SupabaseService);
     
     /**
      * Fork 藍圖，建立組織分支
      * 僅複製任務結構，不複製執行數據
      */
     async forkBlueprint(
       blueprintId: string,
       organizationId: string,
       branchName: string
     ): Promise<BlueprintBranch> {
       // 1. 建立分支記錄
       const { data: branch, error: branchError } = await this.supabase
         .from('blueprint_branches')
         .insert({
           blueprint_id: blueprintId,
           name: branchName,
           organization_id: organizationId,
           status: 'active'
         })
         .select()
         .single();
       
       if (branchError) throw new Error(`Fork 失敗: ${branchError.message}`);
       
       // 2. 建立 Fork 記錄
       const { error: forkError } = await this.supabase
         .from('branch_forks')
         .insert({
           source_blueprint_id: blueprintId,
           target_branch_id: branch.id,
           fork_type: 'subcontract' // 1:1 承攬關係
         });
       
       if (forkError) throw new Error(`記錄 Fork 失敗: ${forkError.message}`);
       
       // 3. 複製任務結構（僅結構，不含執行數據）
       await this.copyTaskStructure(blueprintId, branch.id);
       
       // 4. 設定分支權限
       await this.setupBranchPermissions(branch.id, organizationId);
       
       return branch;
     }
     
     private async copyTaskStructure(
       sourceBlueprintId: string,
       targetBranchId: string
     ): Promise<void> {
       // 查詢主分支的任務結構
       const { data: tasks, error } = await this.supabase
         .from('tasks')
         .select('*')
         .eq('blueprint_id', sourceBlueprintId);
       
       if (error) throw new Error(`查詢任務失敗: ${error.message}`);
       
       // 複製任務結構（僅基本資訊）
       const copiedTasks = tasks.map(task => ({
         blueprint_id: targetBranchId,
         name: task.name,
         description: task.description,
         parent_id: task.parent_id,
         // 不複製 assigned_to, status, 等執行數據
         status: 'pending'
       }));
       
       const { error: insertError } = await this.supabase
         .from('tasks')
         .insert(copiedTasks);
       
       if (insertError) throw new Error(`複製任務失敗: ${insertError.message}`);
     }
     
     private async setupBranchPermissions(
       branchId: string,
       organizationId: string
     ): Promise<void> {
       // 協作組織僅能寫承攬欄位
       const { error } = await this.supabase
         .from('branch_permissions')
         .insert({
           branch_id: branchId,
           account_id: organizationId,
           role: 'collaborator',
           can_read: true,
           can_write: true, // 僅承攬欄位
           can_delete: false
         });
       
       if (error) throw new Error(`設定權限失敗: ${error.message}`);
     }
   }
   ```

3. **Pull Request 功能**
   ```typescript
   async createPullRequest(
     sourceBranchId: string,
     targetBranchId: string,
     title: string,
     changes: any[]
   ): Promise<PullRequest> {
     const { data, error } = await this.supabase
       .from('pull_requests')
       .insert({
         source_branch_id: sourceBranchId,
         target_branch_id: targetBranchId,
         title,
         description: '提交執行數據',
         status: 'open',
         changes
       })
       .select()
       .single();
     
     if (error) throw new Error(`建立 PR 失敗: ${error.message}`);
     
     // 觸發通知
     await this.notifyPRCreated(data.id, targetBranchId);
     
     return data;
   }
   
   async mergePullRequest(
     prId: string,
     reviewerId: string,
     comments?: string
   ): Promise<void> {
     // 1. 取得 PR
     const { data: pr, error: prError } = await this.supabase
       .from('pull_requests')
       .select('*')
       .eq('id', prId)
       .single();
     
     if (prError) throw error;
     
     // 2. 應用變更（僅更新承攬欄位）
     for (const change of pr.changes) {
       await this.applyChange(change);
     }
     
     // 3. 更新 PR 狀態
     const { error: updateError } = await this.supabase
       .from('pull_requests')
       .update({
         status: 'merged',
         reviewed_by: reviewerId,
         reviewed_at: new Date().toISOString(),
         review_comments: comments,
         merged_by: reviewerId,
         merged_at: new Date().toISOString()
       })
       .eq('id', prId);
     
     if (updateError) throw updateError;
     
     // 4. 記錄活動日誌
     await this.logActivity('pull_request_merged', prId, reviewerId);
   }
   ```

**驗證標準**：
- ✅ Fork 功能正常
- ✅ 任務結構正確複製
- ✅ 分支權限生效（僅能操作承攬欄位）
- ✅ PR 審查與合併正常

**使用工具**：
- Sequential Thinking: 分析 Fork 與 PR 流程
- Supabase MCP: 驗證 `blueprint_branches`, `branch_forks`, `pull_requests` 表

---

#### Task 1.4: RLS 政策設計與實作
**複雜度**: 7/10  
**預估時間**: 3 天  
**優先級**: 🔴 最高

**實施內容**：

1. **Blueprint RLS 政策**
   ```sql
   -- 查看政策：可以查看自己擁有的藍圖 + 有權限的分支
   CREATE POLICY "View own blueprints or permitted branches"
   ON blueprints FOR SELECT
   USING (
     owner_id = auth.uid() OR
     id IN (
       SELECT branch_id FROM branch_permissions
       WHERE account_id = auth.uid() AND can_read = true
     )
   );
   
   -- 建立政策：僅能建立自己擁有的藍圖
   CREATE POLICY "Create own blueprints"
   ON blueprints FOR INSERT
   WITH CHECK (owner_id = auth.uid());
   
   -- 更新政策：僅能更新自己擁有的藍圖
   CREATE POLICY "Update own blueprints"
   ON blueprints FOR UPDATE
   USING (owner_id = auth.uid());
   
   -- 刪除政策：僅能刪除自己擁有的藍圖
   CREATE POLICY "Delete own blueprints"
   ON blueprints FOR DELETE
   USING (owner_id = auth.uid());
   ```

2. **Branch RLS 政策**
   ```sql
   -- 查看分支：主分支擁有者 + 協作組織成員
   CREATE POLICY "View branches"
   ON blueprint_branches FOR SELECT
   USING (
     blueprint_id IN (
       SELECT id FROM blueprints WHERE owner_id = auth.uid()
     ) OR
     organization_id = auth.uid() OR
     id IN (
       SELECT branch_id FROM branch_permissions
       WHERE account_id = auth.uid() AND can_read = true
     )
   );
   
   -- 建立分支：僅主分支擁有者可以 Fork
   CREATE POLICY "Fork blueprints"
   ON blueprint_branches FOR INSERT
   WITH CHECK (
     blueprint_id IN (
       SELECT id FROM blueprints WHERE owner_id = auth.uid()
     )
   );
   ```

3. **Task RLS 政策（分支權限）**
   ```sql
   -- 查看任務：根據藍圖權限
   CREATE POLICY "View tasks by blueprint permission"
   ON tasks FOR SELECT
   USING (
     blueprint_id IN (
       SELECT id FROM blueprints WHERE owner_id = auth.uid()
     ) OR
     blueprint_id IN (
       SELECT branch_id FROM branch_permissions
       WHERE account_id = auth.uid() AND can_read = true
     )
   );
   
   -- 建立任務：僅主分支擁有者
   CREATE POLICY "Create tasks in own blueprints"
   ON tasks FOR INSERT
   WITH CHECK (
     blueprint_id IN (
       SELECT id FROM blueprints 
       WHERE owner_id = auth.uid() AND is_main_branch = true
     )
   );
   
   -- 更新任務：主分支擁有者 + 協作組織（僅承攬欄位）
   CREATE POLICY "Update tasks"
   ON tasks FOR UPDATE
   USING (
     -- 主分支擁有者：全權
     blueprint_id IN (
       SELECT id FROM blueprints WHERE owner_id = auth.uid()
     ) OR
     -- 協作組織：僅承攬欄位（需在應用層控制）
     blueprint_id IN (
       SELECT branch_id FROM branch_permissions
       WHERE account_id = auth.uid() AND can_write = true
     )
   );
   ```

**驗證標準**：
- ✅ RLS 政策正確部署
- ✅ 主分支擁有者有全權
- ✅ 協作組織僅能操作承攬欄位
- ✅ 查看者只能唯讀

**使用工具**：
- Supabase MCP: `apply_migration` 執行 DDL
- Supabase MCP: `execute_sql` 測試政策

---

### 階段二：Tasks 核心功能

#### Task 2.1: Task 資料模型與 Repository
**複雜度**: 6/10  
**預估時間**: 3 天  
**優先級**: 🔴 最高

**實施內容**：

1. **Task 模型定義**
   ```typescript
   // src/app/shared/models/task.model.ts
   export interface Task {
     id: string;
     blueprint_id: string;
     name: string;
     description?: string;
     
     // 樹狀結構
     parent_id?: string;
     order: number; // 排序
     depth: number; // 層級深度（便於查詢）
     path: string; // 路徑，如 "1/2/3"（便於查詢子樹）
     
     // 指派
     assigned_to?: string; // Account ID
     assigned_type?: 'user' | 'team' | 'organization' | 'subcontract';
     assigned_at?: string;
     
     // 狀態
     status: TaskStatus;
     priority: 'low' | 'medium' | 'high' | 'urgent';
     
     // 時程
     planned_start_date?: string;
     planned_end_date?: string;
     actual_start_date?: string;
     actual_end_date?: string;
     estimated_hours?: number;
     
     // 執行數據（協作組織填寫）
     subcontract_data?: {
       assigned_workers?: number;
       work_hours?: number;
       materials_used?: any[];
       notes?: string;
     };
     
     // 時間戳
     created_at: string;
     updated_at: string;
     created_by: string;
   }
   
   export type TaskStatus = 
     | 'pending'        // 🟦 待執行
     | 'in_progress'    // 🔵 進行中
     | 'staging'        // 🟨 暫存中
     | 'quality_check'  // 🟧 品管中
     | 'inspection'     // 🟥 驗收中
     | 'completed'      // ✅ 已完成
     | 'cancelled';     // ❌ 已取消
   ```

2. **Task Repository**
   ```typescript
   // src/app/core/repositories/task.repository.ts
   @Injectable({ providedIn: 'root' })
   export class TaskRepository {
     private supabase = inject(SupabaseService);
     
     /**
      * 建立任務（僅主分支擁有者）
      */
     async create(task: Partial<Task>): Promise<Task> {
       // 計算 depth 和 path
       let depth = 0;
       let path = '';
       
       if (task.parent_id) {
         const parent = await this.getById(task.parent_id);
         depth = parent.depth + 1;
         path = `${parent.path}/${parent.id}`;
       }
       
       const { data, error } = await this.supabase
         .from('tasks')
         .insert({
           ...task,
           depth,
           path,
           status: 'pending'
         })
         .select()
         .single();
       
       if (error) throw new Error(`建立任務失敗: ${error.message}`);
       return data;
     }
     
     /**
      * 取得任務樹（含子任務）
      */
     async getTree(blueprintId: string): Promise<Task[]> {
       const { data, error } = await this.supabase
         .from('tasks')
         .select('*')
         .eq('blueprint_id', blueprintId)
         .order('path', { ascending: true })
         .order('order', { ascending: true });
       
       if (error) throw new Error(`查詢任務失敗: ${error.message}`);
       return data;
     }
     
     /**
      * 取得子任務
      */
     async getChildren(taskId: string): Promise<Task[]> {
       const parent = await this.getById(taskId);
       
       const { data, error } = await this.supabase
         .from('tasks')
         .select('*')
         .eq('parent_id', taskId)
         .order('order', { ascending: true });
       
       if (error) throw new Error(`查詢子任務失敗: ${error.message}`);
       return data;
     }
     
     /**
      * 更新任務狀態
      */
     async updateStatus(
       taskId: string,
       status: TaskStatus,
       userId: string
     ): Promise<void> {
       const { error } = await this.supabase
         .from('tasks')
         .update({
           status,
           updated_at: new Date().toISOString()
         })
         .eq('id', taskId);
       
       if (error) throw new Error(`更新狀態失敗: ${error.message}`);
       
       // 記錄活動日誌
       await this.logStatusChange(taskId, status, userId);
     }
     
     /**
      * 更新承攬欄位（協作組織專用）
      */
     async updateSubcontractData(
       taskId: string,
       data: Task['subcontract_data'],
       userId: string
     ): Promise<void> {
       const { error } = await this.supabase
         .from('tasks')
         .update({
           subcontract_data: data,
           updated_at: new Date().toISOString()
         })
         .eq('id', taskId);
       
       if (error) throw new Error(`更新承攬資料失敗: ${error.message}`);
       
       // 記錄活動日誌
       await this.logSubcontractUpdate(taskId, data, userId);
     }
   }
   ```

**驗證標準**：
- ✅ 樹狀結構正確
- ✅ CRUD 操作正常
- ✅ RLS 權限生效

---

#### Task 2.2: Task 狀態機實作
**複雜度**: 7/10  
**預估時間**: 3 天  
**優先級**: 🔴 最高

**實施內容**：

1. **狀態機邏輯**
   ```typescript
   // src/app/shared/services/task-state-machine.service.ts
   @Injectable({ providedIn: 'root' })
   export class TaskStateMachineService {
     /**
      * 狀態轉換規則
      */
     private readonly transitions: Record<TaskStatus, TaskStatus[]> = {
       pending: ['in_progress', 'cancelled'],
       in_progress: ['staging', 'cancelled'],
       staging: ['pending', 'quality_check'], // 可撤回或確認
       quality_check: ['staging', 'inspection', 'in_progress'], // 不合格回到進行中
       inspection: ['quality_check', 'completed', 'in_progress'], // 驗收不通過
       completed: [], // 已完成，無法轉換
       cancelled: [] // 已取消，無法轉換
     };
     
     /**
      * 驗證狀態轉換
      */
     canTransition(from: TaskStatus, to: TaskStatus): boolean {
       const allowed = this.transitions[from];
       return allowed?.includes(to) ?? false;
     }
     
     /**
      * 取得下一個可能的狀態
      */
     getNextStates(current: TaskStatus): TaskStatus[] {
       return this.transitions[current] || [];
     }
     
     /**
      * 執行狀態轉換
      */
     async transition(
       taskId: string,
       from: TaskStatus,
       to: TaskStatus,
       userId: string
     ): Promise<void> {
       if (!this.canTransition(from, to)) {
         throw new Error(`無法從 ${from} 轉換到 ${to}`);
       }
       
       const taskRepo = inject(TaskRepository);
       await taskRepo.updateStatus(taskId, to, userId);
       
       // 觸發狀態變更事件
       await this.handleStateChange(taskId, from, to, userId);
     }
     
     /**
      * 狀態變更處理
      */
     private async handleStateChange(
       taskId: string,
       from: TaskStatus,
       to: TaskStatus,
       userId: string
     ): Promise<void> {
       switch (to) {
         case 'staging':
           // 進入暫存區，48小時計時開始
           await this.createStagingRecord(taskId, userId);
           break;
         
         case 'quality_check':
           // 進入品管，通知品管人員
           await this.notifyQualityCheckers(taskId);
           break;
         
         case 'inspection':
           // 進入驗收，通知驗收人員
           await this.notifyInspectors(taskId);
           break;
         
         case 'completed':
           // 任務完成，更新進度
           await this.updateProgress(taskId);
           break;
       }
     }
     
     private async createStagingRecord(
       taskId: string,
       userId: string
     ): Promise<void> {
       const supabase = inject(SupabaseService);
       
       const expiresAt = new Date();
       expiresAt.setHours(expiresAt.getHours() + 48); // 48小時後
       
       await supabase.from('task_staging').insert({
         task_id: taskId,
         submitted_by: userId,
         submitted_at: new Date().toISOString(),
         expires_at: expiresAt.toISOString(),
         status: 'pending_confirmation'
       });
     }
   }
   ```

2. **48小時暫存機制**
   ```typescript
   // src/app/shared/services/task-staging.service.ts
   @Injectable({ providedIn: 'root' })
   export class TaskStagingService {
     private supabase = inject(SupabaseService);
     
     /**
      * 撤回暫存
      */
     async recall(taskId: string, userId: string): Promise<void> {
       // 檢查是否在48小時內
       const { data: staging, error } = await this.supabase
         .from('task_staging')
         .select('*')
         .eq('task_id', taskId)
         .eq('status', 'pending_confirmation')
         .single();
       
       if (error) throw new Error('查詢暫存記錄失敗');
       
       const now = new Date();
       const expiresAt = new Date(staging.expires_at);
       
       if (now > expiresAt) {
         throw new Error('已超過48小時撤回期限');
       }
       
       // 撤回：更新任務狀態回到 pending
       const taskRepo = inject(TaskRepository);
       await taskRepo.updateStatus(taskId, 'pending', userId);
       
       // 更新暫存記錄
       await this.supabase
         .from('task_staging')
         .update({
           status: 'recalled',
           recalled_by: userId,
           recalled_at: new Date().toISOString()
         })
         .eq('task_id', taskId);
     }
     
     /**
      * 確認提交
      */
     async confirm(taskId: string, userId: string): Promise<void> {
       // 更新暫存記錄
       await this.supabase
         .from('task_staging')
         .update({
           status: 'confirmed',
           confirmed_by: userId,
           confirmed_at: new Date().toISOString()
         })
         .eq('task_id', taskId);
       
       // 轉換到下一個狀態（quality_check）
       const stateMachine = inject(TaskStateMachineService);
       await stateMachine.transition(taskId, 'staging', 'quality_check', userId);
     }
   }
   ```

**驗證標準**：
- ✅ 狀態轉換規則正確
- ✅ 48小時撤回機制正常
- ✅ 狀態變更觸發對應邏輯

---

#### Task 2.3: Task UI 組件實作
**複雜度**: 8/10  
**預估時間**: 5 天  
**優先級**: 🟡 高

**實施內容**：

1. **任務樹組件**
   - 使用 NG-ZORRO Tree 組件
   - 拖放排序功能
   - 摺疊/展開功能
   - 右鍵選單（編輯/刪除/建立子任務）

2. **任務卡片組件**
   - 顯示任務基本資訊
   - 狀態標籤
   - 指派人員頭像
   - 進度條

3. **任務詳情頁**
   - 使用 Facade Pattern
   - Tab 分頁（基本資訊/執行記錄/討論/附件）
   - 狀態轉換按鈕
   - Realtime 更新

**使用工具**：
- Context7: "ng-zorro-antd tree component drag drop"
- Context7: "angular 20 signals component communication"

---

### 階段三：執行與驗收

#### Task 3.1: 每日報表與照片上傳
**複雜度**: 7/10  
**預估時間**: 4 天  
**優先級**: 🔴 最高

**實施內容**：

1. **DailyReport 模型**
   ```typescript
   export interface DailyReport {
     id: string;
     task_id: string;
     blueprint_id: string;
     report_date: string;
     
     // 工作內容
     work_summary: string;
     work_hours: number;
     worker_count: number;
     
     // 天氣
     weather_condition?: string;
     temperature?: number;
     
     // 照片
     photo_urls: string[]; // Storage URLs
     
     created_at: string;
     created_by: string;
   }
   ```

2. **照片上傳組件**（參考 Task 1.6 照片上傳功能）
   - 整合 Supabase Storage
   - 多檔案上傳
   - 進度顯示
   - 預覽功能

3. **天氣記錄整合**（參考階段一的天氣預報遷移）
   - 自動查詢當天天氣
   - 快取至 weather_cache
   - 顯示於報表中

**驗證標準**：
- ✅ 照片上傳正常
- ✅ 天氣自動記錄
- ✅ 報表數據完整

---

#### Task 3.2: 品質驗收與最終驗收
**複雜度**: 6/10  
**預估時間**: 3 天  
**優先級**: 🟡 高

**實施內容**：

1. **QualityCheck 模型**
   ```typescript
   export interface QualityCheck {
     id: string;
     task_id: string;
     blueprint_id: string;
     
     // Checklist
     checklist: {
       item: string;
       passed: boolean;
       notes?: string;
     }[];
     
     // 評分
     overall_score?: number;
     
     // 照片
     photo_urls: string[];
     
     // 結果
     result: 'passed' | 'failed';
     failure_reason?: string;
     
     // 檢查人員
     checked_by: string;
     checked_at: string;
   }
   ```

2. **Inspection 模型**
   ```typescript
   export interface Inspection {
     id: string;
     task_id: string;
     blueprint_id: string;
     
     // 驗收類型
     inspection_type: 'preliminary' | 'final' | 'warranty' | 'handover';
     
     // 結果
     result: 'passed' | 'failed';
     
     // 責任切割
     responsibility_transferred: boolean;
     transfer_date?: string;
     
     // 驗收人員
     inspector_id: string;
     inspected_at: string;
   }
   ```

**驗證標準**：
- ✅ Checklist 功能正常
- ✅ 驗收流程完整
- ✅ 責任轉移記錄正確

---

### 階段四：協作與分析

#### Task 4.1: 問題追蹤系統
**複雜度**: 6/10  
**預估時間**: 3 天  
**優先級**: 🟡 高

**實施內容**：

1. **Issue 模型**
   ```typescript
   export interface Issue {
     id: string;
     task_id?: string;
     blueprint_id: string;
     
     // 問題資訊
     title: string;
     description: string;
     severity: 'low' | 'medium' | 'high' | 'critical';
     
     // 指派
     assigned_to?: string;
     assigned_at?: string;
     
     // 狀態
     status: 'new' | 'assigned' | 'in_progress' | 'resolved' | 'closed' | 'reopened';
     
     // 照片
     photo_urls: string[];
     
     // 同步
     synced_to_main: boolean;
     sync_timestamp?: string;
     
     created_at: string;
     created_by: string;
   }
   ```

2. **跨分支同步機制**
   ```typescript
   // 問題自動同步至主分支
   async syncIssueToMain(issueId: string): Promise<void> {
     const { data: issue } = await this.supabase
       .from('issues')
       .select('*')
       .eq('id', issueId)
       .single();
     
     // 記錄同步日誌
     await this.supabase.from('issue_sync_logs').insert({
       issue_id: issueId,
       source_branch_id: issue.blueprint_id,
       target_branch_id: issue.main_blueprint_id,
       sync_timestamp: new Date().toISOString()
     });
     
     // 觸發 Realtime 通知
     await this.notifyMainBranchOwner(issue);
   }
   ```

---

#### Task 4.2: 待辦中心
**複雜度**: 5/10  
**預估時間**: 2 天  
**優先級**: 🟡 高

**實施內容**：

1. **PersonalTodo 模型**
   ```typescript
   export interface PersonalTodo {
     id: string;
     account_id: string;
     task_id?: string;
     issue_id?: string;
     
     // 分類
     category: 'pending' | 'staging' | 'quality_check' | 'inspection' | 'issue';
     
     // 優先級
     priority: 'low' | 'medium' | 'high' | 'urgent';
     
     // 時程
     due_date?: string;
     
     created_at: string;
   }
   ```

2. **待辦中心 UI**
   - 5 種狀態分類標籤頁
   - 過濾與排序
   - 快速操作按鈕
   - Realtime 更新

---

#### Task 4.3: 數據分析與進度追蹤
**複雜度**: 7/10  
**預估時間**: 4 天  
**優先級**: 🟢 中

**實施內容**：

1. **ProgressTracking 模型**
   ```typescript
   export interface ProgressTracking {
     id: string;
     blueprint_id: string;
     
     // 統計數據
     total_tasks: number;
     completed_tasks: number;
     in_progress_tasks: number;
     pending_tasks: number;
     
     // 進度百分比
     overall_progress: number;
     
     // 時程
     planned_completion_date?: string;
     estimated_completion_date?: string;
     
     // 快取時間
     calculated_at: string;
   }
   ```

2. **儀表板組件**
   - 進度圖表（NG-ZORRO Charts）
   - 任務統計卡片
   - 即將到期任務列表
   - 問題統計

---

## 📊 實施時程表

### Gantt Chart 概覽

```
階段一：Blueprint 基礎建設 (2-3週)
├─ Week 1: Task 1.1-1.2 (模型 + CRUD UI)
├─ Week 2: Task 1.3 (Git-like 分支系統)
└─ Week 3: Task 1.4 (RLS 政策)

階段二：Tasks 核心功能 (3-4週)
├─ Week 4: Task 2.1 (Task 模型 + Repository)
├─ Week 5: Task 2.2 (狀態機)
└─ Week 6-7: Task 2.3 (UI 組件)

階段三：執行與驗收 (2-3週)
├─ Week 8: Task 3.1 (每日報表 + 照片上傳)
└─ Week 9: Task 3.2 (品質驗收)

階段四：協作與分析 (2週)
├─ Week 10: Task 4.1-4.2 (問題追蹤 + 待辦中心)
└─ Week 11: Task 4.3 (數據分析)
```

### 里程碑

- **M1** (Week 3): Blueprint 基礎功能完成
- **M2** (Week 7): Tasks 核心功能完成
- **M3** (Week 9): 執行與驗收流程完成
- **M4** (Week 11): 系統整體功能完成

---

## 🔧 開發工具與方法論

### Sequential Thinking 應用

每個 Task 開始前：
1. 使用 Sequential Thinking 分析需求
2. 識別依賴與風險
3. 評估架構影響
4. 產出分析文檔

### Software Planning Tool 追蹤

- 所有 Task 在 Planning Tool 中追蹤
- 複雜度評分（0-10）
- 狀態更新（待辦/進行中/已完成）
- 時程追蹤

### Context7 使用

每個技術決策前查詢：
- Angular 20 API 文檔
- NG-ZORRO 組件文檔
- Supabase 客戶端文檔
- TypeScript 最佳實踐

### Supabase MCP 驗證

每個資料庫變更前：
- Schema 檢查
- RLS 政策驗證
- Migration 測試
- 資料查詢驗證

---

## 🎯 成功指標

### 技術指標

- ✅ TypeScript strict 模式無錯誤
- ✅ 所有 Repository 有單元測試
- ✅ 測試覆蓋率 ≥ 80%
- ✅ RLS 政策 100% 覆蓋
- ✅ Lint 通過率 100%

### 功能指標

- ✅ Blueprint CRUD 正常運作
- ✅ Git-like 分支模型完整實現
- ✅ Task 狀態機正確流轉
- ✅ 48小時暫存機制生效
- ✅ 照片上傳功能正常
- ✅ 品質驗收流程完整
- ✅ 問題跨分支同步正常
- ✅ 待辦中心準確聚合
- ✅ 進度追蹤即時更新

### 用戶體驗指標

- ✅ 頁面載入時間 < 2秒
- ✅ 操作響應時間 < 500ms
- ✅ Realtime 更新延遲 < 1秒
- ✅ 移動端適配良好

---

## 📚 參考文檔

### 核心架構文檔

- [01-系統架構思維導圖](./01-系統架構思維導圖.mermaid.md)
- [02-專案結構流程圖](./02-專案結構流程圖.mermaid.md)
- [04-業務流程圖](./04-業務流程圖.mermaid.md)
- [20-完整架構流程圖](./20-完整架構流程圖.mermaid.md)

### 開發指南

- [00-開發作業指引](./00-開發作業指引.md)
- [SHARED_IMPORTS 使用指南](./45-SHARED_IMPORTS-使用指南.md)
- [測試指南](./38-測試指南.md)

### 方法論文檔

- [Sequential Thinking 與 Software Planning Tool 方法論](./DISCUSSION-Sequential-Thinking-Planning-Tool-方法論.md)
- [ng-alain-src-Read-Only 功能分析報告](../ng-alain-src-Read-Only功能分析報告.md)

---

## 🔄 後續規劃

### Phase 2 功能（未來規劃）

- 組織協作管理
- 組織排班系統
- Pull Request 審查 UI
- 更多數據分析圖表
- 移動端 App

### 持續優化

- 效能優化（Materialized Views）
- 測試覆蓋率提升至 90%+
- 文檔持續更新
- 用戶反饋收集與改進

---

**文檔版本**：v1.0  
**最後更新**：2025-11-17  
**負責團隊**：開發團隊  
**下次審查**：階段一完成後

---

> 💡 **重要提示**：本實施計畫是基於 Blueprint → Tasks 核心架構建立的完整開發路線圖。所有 Task 都應遵循 Sequential Thinking 分析 → Software Planning Tool 追蹤 → Context7 查詢 → Supabase MCP 驗證的標準流程。

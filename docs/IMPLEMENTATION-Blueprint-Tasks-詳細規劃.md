# Blueprint → Tasks 詳細實施規劃與任務表

> **目的**：根據 Blueprint 與 Tasks 架構，結合 Sequential Thinking 與 Software Planning Tool 方法論，建立完整的實施計畫與任務清單

**建立日期**：2025-11-17  
**最後更新**：2025-11-17  
**版本**：v2.0（優先順序調整版）  
**狀態**：規劃階段 - 已調整實施優先順序  
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

### ⚠️ 優先順序調整說明（v2.0）

**基於團隊討論**，為避免顛倒開發增加未來難度，已調整實施優先順序：

#### 🔴 **必須先完成的基礎設施層**

1. **Branch Permission Control（分支權限控制）**
   - 所有操作的權限基礎
   - 防止協作組織修改主分支任務結構

2. **PR Merge Logic 完整實現（PR 合併邏輯）**
   - Git-like 模型的核心機制
   - 實際更新 `tasks.contractor_fields` 欄位
   - **缺失補完**：`TaskService.updateTaskContractorFields()` 方法

3. **Activity Service (BlueprintActivityService)**
   - 審計追蹤的基礎
   - 所有操作記錄至 `activity_logs`
   - 支援變更歷史追溯與除錯

#### 🟡 **可以並行/稍後的功能**

4. **Realtime 整合** - 基礎功能完成後逐步加入
5. **聚合刷新機制** - 先用即時計算，後續優化為快取

---

### 階段劃分

#### 🔴 **階段一：Blueprint 基礎建設**（3-4週，已調整）

**目標**：建立 Blueprint 核心功能與 Git-like 分支模型，**強化基礎設施層**

- Blueprint CRUD（建立、列表、詳情、更新、刪除）
- 擁有權管理（owner: User/Organization/Bot）
- 權限邊界（RLS 策略）+ **細粒度控制強化**
- 分支系統基礎（Main Branch + Organization Branches）+ **完整 PR 合併邏輯**
- Blueprint 設定（工作日曆、通知規則、自訂欄位）
- **新增**：BlueprintActivityService 實作（審計追蹤）

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

#### Task 1.3: Git-like 分支系統基礎 + PR 合併邏輯完整實現
**複雜度**: 9/10（已提升）  
**預估時間**: 6 天（原 4 天，已擴充）  
**優先級**: 🔴 最高

**⚠️ 重要變更**：本 Task 已擴充，新增 **PR 合併邏輯完整實現**，確保實際更新 `tasks.contractor_fields` 欄位。

**Sequential Thinking 分析要點**：
1. Fork 機制的資料完整性（僅複製結構，不含執行數據）
2. PR 變更的原子性（交易處理）
3. contractor_fields 的合併策略（欄位級別 diff）
4. 並發衝突處理（樂觀鎖定）
5. 審計日誌完整性

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
     
     if (prError) throw new Error(`查詢 PR 失敗: ${prError.message}`);
     
     // 2. **【新增】實際應用變更到主分支任務**
     await this.applyChangesToMainBranch(pr);
     
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
     
     if (updateError) throw new Error(`更新 PR 狀態失敗: ${updateError.message}`);
     
     // 4. 記錄活動日誌
     await this.logActivity('pull_request_merged', prId, reviewerId);
   }
   
   /**
    * 【新增】實際應用 PR 變更到主分支
    * 核心邏輯：更新 tasks.contractor_fields 欄位
    */
   private async applyChangesToMainBranch(pr: PullRequest): Promise<void> {
     const taskService = inject(TaskService);
     
     // 使用交易確保原子性
     const { error: txError } = await this.supabase.rpc('merge_pr_changes', {
       p_pr_id: pr.id,
       p_changes: pr.changes
     });
     
     if (txError) throw new Error(`應用變更失敗: ${txError.message}`);
     
     // 如果不使用 RPC，則逐項更新
     for (const change of pr.changes) {
       if (change.field.startsWith('contractor_fields.')) {
         await taskService.updateTaskContractorFields(
           change.task_id,
           change.field,
           change.new_value
         );
       }
     }
   }
   ```

4. **【新增】TaskService.updateTaskContractorFields() 實作**
   ```typescript
   // src/app/shared/services/task.service.ts
   @Injectable({ providedIn: 'root' })
   export class TaskService {
     private supabase = inject(SupabaseService);
     
     /**
      * 更新任務的承攬欄位
      * 僅允許更新 contractor_fields 內的欄位
      */
     async updateTaskContractorFields(
       taskId: string,
       field: string,
       value: any
     ): Promise<void> {
       // 驗證欄位路徑
       if (!field.startsWith('contractor_fields.')) {
         throw new Error('僅允許更新 contractor_fields 欄位');
       }
       
       // 取得當前任務
       const { data: task, error: fetchError } = await this.supabase
         .from('tasks')
         .select('contractor_fields')
         .eq('id', taskId)
         .single();
       
       if (fetchError) throw new Error(`查詢任務失敗: ${fetchError.message}`);
       
       // 更新指定欄位
       const fieldPath = field.replace('contractor_fields.', '');
       const updatedFields = {
         ...task.contractor_fields,
         [fieldPath]: value
       };
       
       // 寫回資料庫
       const { error: updateError } = await this.supabase
         .from('tasks')
         .update({
           contractor_fields: updatedFields,
           updated_at: new Date().toISOString()
         })
         .eq('id', taskId);
       
       if (updateError) throw new Error(`更新承攬欄位失敗: ${updateError.message}`);
     }
   }
   ```

5. **【新增】Database RPC Function for Transaction**
   ```sql
   -- 使用 Supabase MCP 執行此 Migration
   CREATE OR REPLACE FUNCTION merge_pr_changes(
     p_pr_id UUID,
     p_changes JSONB
   )
   RETURNS VOID
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   DECLARE
     v_change JSONB;
     v_task_id UUID;
     v_field TEXT;
     v_value JSONB;
   BEGIN
     -- 遍歷所有變更
     FOR v_change IN SELECT * FROM jsonb_array_elements(p_changes)
     LOOP
       v_task_id := (v_change->>'task_id')::UUID;
       v_field := v_change->>'field';
       v_value := v_change->'new_value';
       
       -- 僅允許更新 contractor_fields
       IF v_field LIKE 'contractor_fields.%' THEN
         UPDATE tasks
         SET contractor_fields = jsonb_set(
           COALESCE(contractor_fields, '{}'::JSONB),
           string_to_array(substring(v_field from 19), '.'),
           v_value
         ),
         updated_at = NOW()
         WHERE id = v_task_id;
       END IF;
     END LOOP;
   END;
   $$;
   ```

**驗證標準**：
- ✅ Fork 功能正常
- ✅ 任務結構正確複製
- ✅ 分支權限生效（僅能操作承攬欄位）
- ✅ PR 審查與合併正常
- ✅ **【新增】PR 合併實際更新 tasks.contractor_fields**
- ✅ **【新增】交易處理確保資料一致性**
- ✅ **【新增】Activity logs 正確記錄變更**

**使用工具（企業標準）**：

**Sequential Thinking 分析**：
1. Fork 資料完整性驗證策略
2. PR 變更的原子性保證機制
3. contractor_fields 合併策略設計
4. 並發衝突處理方案
5. 回滾機制設計

**Supabase MCP 驗證**：
```bash
# 1. 檢查表結構
supabase-mcp list_tables

# 2. 驗證 blueprint_branches 表
supabase-mcp execute_sql "
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name = 'blueprint_branches'
"

# 3. 驗證 branch_forks 表
supabase-mcp execute_sql "
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name = 'branch_forks'
"

# 4. 驗證 pull_requests 表
supabase-mcp execute_sql "
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name = 'pull_requests'
"

# 5. 測試 contractor_fields JSONB 欄位
supabase-mcp execute_sql "
  SELECT id, contractor_fields
  FROM tasks
  WHERE contractor_fields IS NOT NULL
  LIMIT 1
"

# 6. 執行 RPC Function Migration
supabase-mcp apply_migration "create_merge_pr_changes_function" "
  CREATE OR REPLACE FUNCTION merge_pr_changes(...)
  RETURNS VOID
  ...
"

# 7. 測試 RPC Function
supabase-mcp execute_sql "
  SELECT merge_pr_changes(
    'test-pr-id'::UUID,
    '[{\"task_id\": \"test-task-id\", \"field\": \"contractor_fields.work_hours\", \"new_value\": 8}]'::JSONB
  )
"
```

**Context7 查詢**：
- "supabase rpc function transaction"
- "postgresql jsonb_set function"
- "typescript deep merge objects"
- "angular 20 service dependency injection"

---

#### Task 1.4: RLS 政策設計與實作 + 細粒度權限控制強化
**複雜度**: 8/10（已提升）  
**預估時間**: 4 天（原 3 天，已擴充）  
**優先級**: 🔴 最高

**⚠️ 重要變更**：本 Task 已擴充，新增 **細粒度權限控制**，特別是協作組織僅能寫 contractor_fields 的應用層驗證。

**Sequential Thinking 分析要點**：
1. RLS 政策的層級設計（Table Level vs Row Level）
2. 協作組織權限邊界（只能寫承攬欄位）
3. 應用層驗證 + DB 層 RLS 雙重防護
4. JWT Claims 與 RLS 的整合
5. 效能考量（避免過度複雜的查詢）

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

4. **【新增】應用層細粒度權限驗證**
   ```typescript
   // src/app/shared/services/permission-guard.service.ts
   @Injectable({ providedIn: 'root' })
   export class PermissionGuardService {
     private supabase = inject(SupabaseService);
     private authState = inject(AuthStateService);
     
     /**
      * 驗證是否有權限更新特定欄位
      * 協作組織僅能更新 contractor_fields
      */
     async canUpdateTaskField(
       taskId: string,
       fieldPath: string
     ): Promise<boolean> {
       const currentUser = this.authState.account();
       if (!currentUser) return false;
       
       // 取得任務所屬藍圖
       const { data: task, error } = await this.supabase
         .from('tasks')
         .select('blueprint_id')
         .eq('id', taskId)
         .single();
       
       if (error || !task) return false;
       
       // 檢查是否為主分支擁有者
       const { data: blueprint } = await this.supabase
         .from('blueprints')
         .select('owner_id')
         .eq('id', task.blueprint_id)
         .single();
       
       if (blueprint?.owner_id === currentUser.id) {
         // 主分支擁有者：全權
         return true;
       }
       
       // 檢查分支權限
       const { data: permission } = await this.supabase
         .from('branch_permissions')
         .select('can_write')
         .eq('branch_id', task.blueprint_id)
         .eq('account_id', currentUser.id)
         .single();
       
       if (!permission?.can_write) return false;
       
       // 協作組織：僅能更新 contractor_fields
       return fieldPath.startsWith('contractor_fields.');
     }
     
     /**
      * 驗證並執行更新
      * 包含權限檢查的更新操作
      */
     async updateTaskWithPermissionCheck(
       taskId: string,
       updates: Record<string, any>
     ): Promise<void> {
       // 檢查所有欄位權限
       for (const field of Object.keys(updates)) {
         const hasPermission = await this.canUpdateTaskField(taskId, field);
         if (!hasPermission) {
           throw new Error(`無權限更新欄位: ${field}`);
         }
       }
       
       // 執行更新
       const { error } = await this.supabase
         .from('tasks')
         .update(updates)
         .eq('id', taskId);
       
       if (error) throw new Error(`更新失敗: ${error.message}`);
     }
   }
   ```

5. **【新增】前端表單權限控制**
   ```typescript
   // 在 Task 表單組件中使用
   @Component({...})
   export class TaskFormComponent {
     private permissionGuard = inject(PermissionGuardService);
     
     // 根據權限動態禁用欄位
     readonly canEditStructure = signal(false);
     readonly canEditContractorFields = signal(false);
     
     async ngOnInit(): Promise<void> {
       const taskId = this.taskId();
       
       // 檢查結構欄位權限
       this.canEditStructure.set(
         await this.permissionGuard.canUpdateTaskField(taskId, 'name')
       );
       
       // 檢查承攬欄位權限
       this.canEditContractorFields.set(
         await this.permissionGuard.canUpdateTaskField(taskId, 'contractor_fields.work_hours')
       );
     }
   }
   ```

**驗證標準**：
- ✅ RLS 政策正確部署
- ✅ 主分支擁有者有全權
- ✅ 協作組織僅能操作承攬欄位
- ✅ 查看者只能唯讀
- ✅ **【新增】應用層權限驗證生效**
- ✅ **【新增】前端表單依權限動態啟用/禁用**
- ✅ **【新增】越權操作被阻擋**

**使用工具（企業標準）**：

**Sequential Thinking 分析**：
1. RLS vs 應用層驗證的權衡
2. 效能影響評估（權限查詢次數）
3. 快取策略（避免重複查詢）
4. 錯誤處理與用戶提示
5. 測試策略（正常/邊界/越權情況）

**Supabase MCP 驗證**：
```bash
# 1. 執行 RLS Migration
supabase-mcp apply_migration "blueprint_rls_policies" "
  CREATE POLICY \"View own blueprints or permitted branches\"
  ON blueprints FOR SELECT
  USING (...);
  ...
"

# 2. 驗證 RLS 政策已部署
supabase-mcp execute_sql "
  SELECT schemaname, tablename, policyname, qual
  FROM pg_policies
  WHERE tablename IN ('blueprints', 'blueprint_branches', 'tasks')
"

# 3. 測試主分支擁有者權限
supabase-mcp execute_sql "
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claims TO '{\"sub\": \"owner-user-id\"}';
  SELECT * FROM tasks WHERE blueprint_id = 'main-blueprint-id';
"

# 4. 測試協作組織權限（應該只能查看，不能寫非承攬欄位）
supabase-mcp execute_sql "
  SET LOCAL ROLE authenticated;
  SET LOCAL request.jwt.claims TO '{\"sub\": \"collaborator-org-id\"}';
  
  -- 應該成功
  UPDATE tasks 
  SET contractor_fields = '{\"work_hours\": 8}'
  WHERE id = 'test-task-id';
  
  -- 應該失敗（RLS 阻擋）
  UPDATE tasks 
  SET name = 'Unauthorized Change'
  WHERE id = 'test-task-id';
"

# 5. 檢查 branch_permissions 表
supabase-mcp execute_sql "
  SELECT * FROM branch_permissions
  WHERE account_id = 'collaborator-org-id'
"
```

**Context7 查詢**：
- "supabase rls row level security best practices"
- "postgresql auth.uid() function"
- "angular 20 signal computed permissions"
- "typescript type guard permission check"

---

#### Task 1.5: BlueprintActivityService 實作（審計追蹤基礎）
**複雜度**: 6/10  
**預估時間**: 3 天  
**優先級**: 🔴 最高

**⚠️ 新增任務**：本 Task 為新增，確保所有操作都有完整的審計日誌記錄，便於追溯與除錯。

**Sequential Thinking 分析要點**：
1. Activity Log 資料結構設計（entity_type, changes diff）
2. 記錄時機選擇（同步 vs 非同步）
3. 效能考量（批次寫入 vs 即時寫入）
4. 敏感資料過濾（密碼、Token 等不記錄）
5. 查詢效能優化（索引設計）

**實施內容**：

1. **ActivityLog 模型定義**
   ```typescript
   // src/app/shared/models/activity-log.model.ts
   export interface ActivityLog {
     id: string;
     blueprint_id: string; // 所屬藍圖
     entity_type: 'blueprint' | 'task' | 'pull_request' | 'issue' | 'document';
     entity_id: string; // 操作對象 ID
     action: 'created' | 'updated' | 'deleted' | 'merged' | 'forked' | 'assigned';
     
     // 變更內容
     changes: {
       field: string;
       old_value: any;
       new_value: any;
     }[];
     
     // 操作者
     actor_id: string; // Account ID
     actor_type: 'User' | 'Organization' | 'Bot';
     
     // 時間戳
     created_at: string;
     
     // 附加資訊
     metadata?: {
       ip_address?: string;
       user_agent?: string;
       context?: string; // 操作情境描述
     };
   }
   ```

2. **BlueprintActivityService 實作**
   ```typescript
   // src/app/shared/services/blueprint-activity.service.ts
   @Injectable({ providedIn: 'root' })
   export class BlueprintActivityService {
     private supabase = inject(SupabaseService);
     private authState = inject(AuthStateService);
     
     /**
      * 記錄活動日誌
      * 所有操作都應透過此方法記錄
      */
     async logActivity(
       blueprintId: string,
       entityType: ActivityLog['entity_type'],
       entityId: string,
       action: ActivityLog['action'],
       changes: ActivityLog['changes'],
       context?: string
     ): Promise<void> {
       const currentUser = this.authState.account();
       if (!currentUser) {
         console.warn('Cannot log activity: No authenticated user');
         return;
       }
       
       // 過濾敏感資料
       const sanitizedChanges = this.sanitizeChanges(changes);
       
       const log: Partial<ActivityLog> = {
         blueprint_id: blueprintId,
         entity_type: entityType,
         entity_id: entityId,
         action,
         changes: sanitizedChanges,
         actor_id: currentUser.id,
         actor_type: currentUser.type,
         metadata: {
           context,
           // 可選：記錄 IP 和 User Agent
         }
       };
       
       const { error } = await this.supabase
         .from('activity_logs')
         .insert(log);
       
       if (error) {
         console.error('Failed to log activity:', error);
         // 不拋出錯誤，避免影響主流程
       }
     }
     
     /**
      * 記錄任務變更
      */
     async logTaskChange(
       task: Task,
       action: 'created' | 'updated' | 'deleted',
       oldTask?: Task
     ): Promise<void> {
       const changes = this.computeChanges(oldTask, task);
       
       await this.logActivity(
         task.blueprint_id,
         'task',
         task.id,
         action,
         changes,
         `Task ${action}: ${task.name}`
       );
     }
     
     /**
      * 記錄 PR 合併
      */
     async logPRMerge(
       pr: PullRequest,
       mergedBy: string
     ): Promise<void> {
       await this.logActivity(
         pr.target_branch_id,
         'pull_request',
         pr.id,
         'merged',
         pr.changes,
         `PR merged: ${pr.title}`
       );
     }
     
     /**
      * 查詢活動日誌
      */
     async getActivityLogs(
       blueprintId: string,
       filters?: {
         entityType?: ActivityLog['entity_type'];
         entityId?: string;
         actorId?: string;
         startDate?: string;
         endDate?: string;
       }
     ): Promise<ActivityLog[]> {
       let query = this.supabase
         .from('activity_logs')
         .select('*, accounts(name, email)')
         .eq('blueprint_id', blueprintId)
         .order('created_at', { ascending: false });
       
       if (filters?.entityType) {
         query = query.eq('entity_type', filters.entityType);
       }
       
       if (filters?.entityId) {
         query = query.eq('entity_id', filters.entityId);
       }
       
       if (filters?.actorId) {
         query = query.eq('actor_id', filters.actorId);
       }
       
       if (filters?.startDate) {
         query = query.gte('created_at', filters.startDate);
       }
       
       if (filters?.endDate) {
         query = query.lte('created_at', filters.endDate);
       }
       
       const { data, error } = await query;
       
       if (error) throw new Error(`查詢活動日誌失敗: ${error.message}`);
       return data;
     }
     
     /**
      * 計算變更差異
      */
     private computeChanges(oldObj: any, newObj: any): ActivityLog['changes'] {
       if (!oldObj) return [];
       
       const changes: ActivityLog['changes'] = [];
       const keys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
       
       for (const key of keys) {
         if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
           changes.push({
             field: key,
             old_value: oldObj[key],
             new_value: newObj[key]
           });
         }
       }
       
       return changes;
     }
     
     /**
      * 過濾敏感資料
      */
     private sanitizeChanges(changes: ActivityLog['changes']): ActivityLog['changes'] {
       const sensitiveFields = ['password', 'token', 'api_key', 'secret'];
       
       return changes.map(change => {
         if (sensitiveFields.some(field => change.field.toLowerCase().includes(field))) {
           return {
             ...change,
             old_value: '***REDACTED***',
             new_value: '***REDACTED***'
           };
         }
         return change;
       });
     }
   }
   ```

3. **整合到現有 Service**
   ```typescript
   // 在 TaskService 中整合
   @Injectable({ providedIn: 'root' })
   export class TaskService {
     private activityService = inject(BlueprintActivityService);
     
     async create(task: Partial<Task>): Promise<Task> {
       const { data, error } = await this.supabase
         .from('tasks')
         .insert(task)
         .select()
         .single();
       
       if (error) throw error;
       
       // 記錄活動日誌
       await this.activityService.logTaskChange(data, 'created');
       
       return data;
     }
     
     async update(taskId: string, updates: Partial<Task>): Promise<void> {
       // 取得舊資料
       const { data: oldTask } = await this.supabase
         .from('tasks')
         .select('*')
         .eq('id', taskId)
         .single();
       
       // 執行更新
       const { error } = await this.supabase
         .from('tasks')
         .update(updates)
         .eq('id', taskId);
       
       if (error) throw error;
       
       // 記錄活動日誌
       const { data: newTask } = await this.supabase
         .from('tasks')
         .select('*')
         .eq('id', taskId)
         .single();
       
       await this.activityService.logTaskChange(newTask!, 'updated', oldTask!);
     }
   }
   ```

4. **Activity Timeline UI 組件**
   ```typescript
   // src/app/shared/components/activity-timeline/activity-timeline.component.ts
   @Component({
     selector: 'app-activity-timeline',
     standalone: true,
     imports: [SHARED_IMPORTS],
     changeDetection: ChangeDetectionStrategy.OnPush,
     template: `
       <nz-timeline>
         @for (log of logs(); track log.id) {
           <nz-timeline-item>
             <p>{{ formatActivity(log) }}</p>
             <p class="text-gray-500">{{ log.created_at | date:'short' }}</p>
             @if (log.changes.length > 0) {
               <nz-collapse>
                 <nz-collapse-panel nzHeader="查看變更">
                   <ul>
                     @for (change of log.changes; track change.field) {
                       <li>
                         <strong>{{ change.field }}</strong>: 
                         {{ change.old_value }} → {{ change.new_value }}
                       </li>
                     }
                   </ul>
                 </nz-collapse-panel>
               </nz-collapse>
             }
           </nz-timeline-item>
         }
       </nz-timeline>
     `
   })
   export class ActivityTimelineComponent {
     blueprintId = input.required<string>();
     entityType = input<ActivityLog['entity_type']>();
     entityId = input<string>();
     
     private activityService = inject(BlueprintActivityService);
     
     readonly logs = signal<ActivityLog[]>([]);
     
     constructor() {
       effect(() => {
         const blueprintId = this.blueprintId();
         void this.loadLogs(blueprintId);
       });
     }
     
     private async loadLogs(blueprintId: string): Promise<void> {
       const logs = await this.activityService.getActivityLogs(blueprintId, {
         entityType: this.entityType(),
         entityId: this.entityId()
       });
       this.logs.set(logs);
     }
     
     formatActivity(log: ActivityLog): string {
       return `${log.actor_id} ${log.action} ${log.entity_type} ${log.entity_id}`;
     }
   }
   ```

**驗證標準**：
- ✅ 所有操作都有日誌記錄
- ✅ changes diff 正確計算
- ✅ 敏感資料已過濾
- ✅ 查詢效能可接受（< 500ms）
- ✅ Activity Timeline UI 正常顯示
- ✅ 日誌不影響主流程（錯誤不拋出）

**使用工具（企業標準）**：

**Sequential Thinking 分析**：
1. 同步 vs 非同步記錄的權衡
2. 批次寫入 vs 即時寫入的效能影響
3. 敏感資料識別與過濾策略
4. 索引設計優化查詢效能
5. 日誌保留策略（何時清理舊日誌）

**Supabase MCP 驗證**：
```bash
# 1. 檢查 activity_logs 表結構
supabase-mcp execute_sql "
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_name = 'activity_logs'
"

# 2. 建立索引優化查詢
supabase-mcp apply_migration "activity_logs_indexes" "
  CREATE INDEX IF NOT EXISTS idx_activity_logs_blueprint_id 
  ON activity_logs(blueprint_id);
  
  CREATE INDEX IF NOT EXISTS idx_activity_logs_entity 
  ON activity_logs(entity_type, entity_id);
  
  CREATE INDEX IF NOT EXISTS idx_activity_logs_actor 
  ON activity_logs(actor_id);
  
  CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at 
  ON activity_logs(created_at DESC);
"

# 3. 測試查詢效能
supabase-mcp execute_sql "
  EXPLAIN ANALYZE
  SELECT * FROM activity_logs
  WHERE blueprint_id = 'test-blueprint-id'
  AND entity_type = 'task'
  ORDER BY created_at DESC
  LIMIT 50
"

# 4. 測試日誌寫入
supabase-mcp execute_sql "
  INSERT INTO activity_logs (
    blueprint_id, entity_type, entity_id, action, changes, actor_id, actor_type
  ) VALUES (
    'test-blueprint-id', 'task', 'test-task-id', 'created', 
    '[{\"field\": \"name\", \"old_value\": null, \"new_value\": \"Test Task\"}]'::JSONB,
    'test-user-id', 'User'
  )
"

# 5. 查詢最近活動
supabase-mcp execute_sql "
  SELECT 
    al.*,
    a.name as actor_name,
    a.email as actor_email
  FROM activity_logs al
  LEFT JOIN accounts a ON al.actor_id = a.id
  WHERE al.blueprint_id = 'test-blueprint-id'
  ORDER BY al.created_at DESC
  LIMIT 20
"
```

**Context7 查詢**：
- "postgresql jsonb array operations"
- "angular 20 timeline component"
- "typescript object diff algorithm"
- "audit log best practices"

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

### Gantt Chart 概覽（v2.0 已調整）

```
階段一：Blueprint 基礎建設 (3-4週，已調整)
├─ Week 1: Task 1.1-1.2 (模型 + CRUD UI)
├─ Week 2-3: Task 1.3 (Git-like 分支系統 + PR 合併邏輯) [已擴充 4→6天]
├─ Week 3-4: Task 1.4 (RLS 政策 + 細粒度權限控制) [已擴充 3→4天]
└─ Week 4: Task 1.5 (BlueprintActivityService) [新增 3天]

階段二：Tasks 核心功能 (3-4週)
├─ Week 5: Task 2.1 (Task 模型 + Repository)
├─ Week 6: Task 2.2 (狀態機)
└─ Week 7-8: Task 2.3 (UI 組件)

階段三：執行與驗收 (2-3週)
├─ Week 9: Task 3.1 (每日報表 + 照片上傳)
└─ Week 10: Task 3.2 (品質驗收)

階段四：協作與分析 (2週)
├─ Week 11: Task 4.1-4.2 (問題追蹤 + 待辦中心)
└─ Week 12: Task 4.3 (數據分析)
```

### 里程碑（v2.0 已調整）

- **M1** (Week 4): Blueprint 基礎功能完成（含基礎設施層）
- **M2** (Week 8): Tasks 核心功能完成
- **M3** (Week 10): 執行與驗收流程完成
- **M4** (Week 12): 系統整體功能完成

**⚠️ 時程調整說明**：
- 總時程從 11 週調整為 12 週
- 階段一增加 1 週（基礎設施層強化）
- 確保 PR 合併邏輯、細粒度權限、審計日誌完整實現

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

## 📝 v2.0 版本變更摘要

### 優先順序調整

基於團隊討論，本版本進行了重大優先順序調整，確保達到企業標準：

#### 🔴 **已擴充的任務**

1. **Task 1.3** (4天 → 6天)
   - ✅ 原有：Fork 機制、PR 審查流程
   - ➕ 新增：**PR 合併邏輯完整實現**
   - ➕ 新增：`TaskService.updateTaskContractorFields()` 方法
   - ➕ 新增：Database RPC Function for Transaction
   - ➕ 新增：實際更新 `tasks.contractor_fields` 欄位

2. **Task 1.4** (3天 → 4天)
   - ✅ 原有：RLS 政策基礎
   - ➕ 新增：**細粒度權限控制強化**
   - ➕ 新增：應用層權限驗證 (PermissionGuardService)
   - ➕ 新增：前端表單權限控制
   - ➕ 新增：越權操作阻擋機制

3. **Task 1.5** (新增，3天)
   - 🆕 **BlueprintActivityService 實作**
   - 🆕 完整的審計追蹤系統
   - 🆕 Activity Timeline UI 組件
   - 🆕 敏感資料過濾機制
   - 🆕 查詢效能優化（索引設計）

### 實施方法論強化

#### Sequential Thinking 整合

每個 Task 現在都包含：
- ✅ Sequential Thinking 分析要點（5個關鍵思考點）
- ✅ 風險識別與緩解策略
- ✅ 架構影響評估
- ✅ 決策追溯記錄

#### Supabase MCP 使用範例

所有涉及資料庫的 Task 都包含：
- ✅ `list_tables` - 表結構檢查
- ✅ `execute_sql` - SQL 測試與驗證
- ✅ `apply_migration` - DDL 執行
- ✅ RLS 政策測試指令
- ✅ 效能分析（EXPLAIN ANALYZE）

#### Context7 查詢指引

每個 Task 都列出相關查詢：
- ✅ Angular 20 Signals API
- ✅ NG-ZORRO 組件文檔
- ✅ Supabase 客戶端文檔
- ✅ PostgreSQL 特定功能
- ✅ TypeScript 最佳實踐

### 時程調整

- **原時程**：11 週
- **新時程**：12 週
- **調整原因**：基礎設施層強化（PR 合併邏輯、細粒度權限、審計追蹤）
- **里程碑**：
  - M1: Week 4（原 Week 3）
  - M2: Week 8（原 Week 7）
  - M3: Week 10（原 Week 9）
  - M4: Week 12（原 Week 11）

### 企業標準達成

- ✅ **PR 合併邏輯完整**：實際更新欄位，非僅狀態變更
- ✅ **權限控制雙重防護**：DB 層 RLS + 應用層驗證
- ✅ **審計追蹤完整**：所有操作可追溯
- ✅ **方法論整合**：Sequential Thinking + Planning Tool + Context7 + Supabase MCP
- ✅ **代碼範例完整**：每個 Task 都有可執行的代碼範例

---

**文檔版本**：v2.0（優先順序調整版）  
**最後更新**：2025-11-17  
**負責團隊**：開發團隊  
**下次審查**：階段一完成後

---

> 💡 **重要提示**：本實施計畫是基於 Blueprint → Tasks 核心架構建立的完整開發路線圖。所有 Task 都應遵循 Sequential Thinking 分析 → Software Planning Tool 追蹤 → Context7 查詢 → Supabase MCP 驗證的標準流程。
> 
> **v2.0 變更重點**：優先實現基礎設施層（PR 合併邏輯、細粒度權限、審計追蹤），避免顛倒開發增加未來難度。

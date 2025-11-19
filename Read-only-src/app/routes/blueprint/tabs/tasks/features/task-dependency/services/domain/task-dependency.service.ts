/**
 * Task Dependency Service
 *
 * 任務關聯維度管理服務
 * 對應 @ETMS_DESIGN_SPEC.md 文件：C. 關聯維度
 *
 * 職責：
 * - 管理前置任務（FS, SS, FF, SF 四種依賴類型）
 * - 管理後續任務與影響鏈分析
 * - 處理關聯任務（相似、替代、參考等關係）
 * - 管理里程碑與任務的關聯關係
 *
 * @see @ETMS_DESIGN_SPEC.md C. 關聯維度
 */

import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '@core/supabase/supabase.service';
import type {
  Predecessor,
  TaskPredecessors,
  Successor,
  TaskSuccessors,
  RelatedTask,
  RelatedTasks,
  ImpactChainItem,
  TaskDependency
} from '@models';
import { DependencyType } from '@models';
import { TaskIdentityService } from '@tasks/features/task-identity/services/domain/task-identity.service';
import { TaskTimeService } from '@tasks/features/task-time/services/domain/task-time.service';

/**
 * 數據庫依賴關係格式（snake_case）
 */
interface DbDependency {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  dependency_type: string;
  lag_days: number;
  lag_unit: string;
  strength: string;
  is_violated: boolean;
  violation_reason?: string | null;
  created_at: string;
  created_by?: string | null;
}

/**
 * 數據庫關聯關係格式（snake_case）
 */
interface DbRelation {
  id: string;
  task_id: string;
  related_task_id: string;
  relation_type: string;
  description?: string | null;
  strength: number;
  is_symmetric: boolean;
  created_at: string;
  created_by?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskDependencyService {
  private readonly supabase = inject(SupabaseService);
  private readonly identityService = inject(TaskIdentityService);
  private readonly timeService = inject(TaskTimeService);

  // 緩存循環依賴檢測結果
  private readonly cycleCheckCache = new Map<string, { hasCycle: boolean; cyclePath: string[]; timestamp: number }>();
  private readonly CACHE_TTL = 30000; // 30 秒

  /**
   * 添加前置任務依賴關係
   *
   * @param taskId 當前任務 ID
   * @param dependsOnTaskId 前置任務 ID
   * @param type 依賴類型
   * @param lag 延遲天數（可為負數表示重疊）
   * @param lagUnit 延遲單位（days 或 hours）
   * @param strength 依賴強度（mandatory, discretionary, external）
   * @returns 創建的依賴關係
   */
  async addPredecessor(
    taskId: string,
    dependsOnTaskId: string,
    type: DependencyType,
    lag = 0,
    lagUnit: 'days' | 'hours' = 'days',
    strength: 'mandatory' | 'discretionary' | 'external' = 'mandatory'
  ): Promise<Predecessor> {
    // 檢查任務是否存在
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    const predecessorTask = await this.identityService.getTaskById(dependsOnTaskId);
    if (!predecessorTask) {
      throw new Error(`Predecessor task ${dependsOnTaskId} not found`);
    }

    // 檢查是否為自依賴
    if (taskId === dependsOnTaskId) {
      throw new Error('Task cannot depend on itself');
    }

    // 檢查是否已存在相同依賴關係
    const existing = await this.getPredecessor(taskId, dependsOnTaskId);
    if (existing) {
      throw new Error(`Dependency already exists between task ${taskId} and ${dependsOnTaskId}`);
    }

    // 檢查是否會造成循環依賴
    const cycleCheck = await this.checkCircularDependency(taskId, dependsOnTaskId);
    if (cycleCheck.hasCycle) {
      throw new Error(`Circular dependency detected: ${cycleCheck.cyclePath.join(' -> ')}`);
    }

    // 插入依賴關係到數據庫
    const { data, error } = await this.supabase.client
      .from('blueprint_task_dependencies')
      .insert({
        task_id: taskId,
        depends_on_task_id: dependsOnTaskId,
        dependency_type: type,
        lag_days: lag,
        lag_unit: lagUnit,
        strength,
        is_violated: false,
        violation_reason: null
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add predecessor: ${error.message}`);
    }

    // 檢查違反狀態
    const violation = await this.checkViolation(taskId, dependsOnTaskId, type, lag);
    if (violation.isViolated) {
      await this.supabase.client
        .from('blueprint_task_dependencies')
        .update({
          is_violated: true,
          violation_reason: violation.reason
        })
        .eq('id', data.id);
    }

    // 清除緩存
    this.cycleCheckCache.clear();

    return this.convertPredecessorFromDb(data as DbDependency, predecessorTask);
  }

  /**
   * 移除前置任務依賴關係
   *
   * @param taskId 當前任務 ID
   * @param dependsOnTaskId 前置任務 ID
   */
  async removePredecessor(taskId: string, dependsOnTaskId: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('blueprint_task_dependencies')
      .delete()
      .eq('task_id', taskId)
      .eq('depends_on_task_id', dependsOnTaskId);

    if (error) {
      throw new Error(`Failed to remove predecessor: ${error.message}`);
    }

    // 清除緩存
    this.cycleCheckCache.clear();
  }

  /**
   * 獲取單個前置任務依賴關係
   */
  private async getPredecessor(taskId: string, dependsOnTaskId: string): Promise<DbDependency | null> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_dependencies')
      .select('*')
      .eq('task_id', taskId)
      .eq('depends_on_task_id', dependsOnTaskId)
      .maybeSingle();

    if (error) {
      return null;
    }

    return data as DbDependency | null;
  }

  /**
   * 獲取任務的所有前置任務
   *
   * @param taskId 任務 ID
   * @returns 前置任務列表
   */
  async getPredecessors(taskId: string): Promise<TaskPredecessors | null> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_dependencies')
      .select(
        `
        *,
        depends_on_task:blueprint_tasks!blueprint_task_dependencies_depends_on_task_id_fkey(
          id,
          code,
          title
        )
      `
      )
      .eq('task_id', taskId);

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to get predecessors: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return { predecessors: [] };
    }

    const predecessors: Predecessor[] = [];

    for (const dep of data as any[]) {
      const predTask = dep.depends_on_task;
      if (!predTask) continue;

      const violation = await this.checkViolation(taskId, dep.depends_on_task_id, dep.dependency_type as DependencyType, dep.lag_days || 0);

      predecessors.push({
        taskId: dep.depends_on_task_id,
        taskCode: predTask.code || '',
        taskName: predTask.title || '',
        type: dep.dependency_type as DependencyType,
        lag: dep.lag_days || 0,
        lagUnit: (dep.lag_unit as 'days' | 'hours') || 'days',
        strength: dep.strength as 'mandatory' | 'discretionary' | 'external',
        isViolated: violation.isViolated,
        violationReason: violation.reason || undefined,
        createdAt: new Date(dep.created_at),
        createdBy: dep.created_by || ''
      });
    }

    return { predecessors };
  }

  /**
   * 獲取任務的所有後續任務
   *
   * @param taskId 任務 ID
   * @returns 後續任務列表
   */
  async getSuccessors(taskId: string): Promise<TaskSuccessors | null> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_dependencies')
      .select(
        `
        *,
        task:blueprint_tasks!blueprint_task_dependencies_task_id_fkey(
          id,
          code,
          title
        )
      `
      )
      .eq('depends_on_task_id', taskId);

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to get successors: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        successors: [],
        blockedTasks: [],
        blockingTasks: [],
        impactChain: []
      };
    }

    const successors: Successor[] = [];
    const blockedTasks: string[] = [];

    for (const dep of data as any[]) {
      const succTask = dep.task;
      if (!succTask) continue;

      successors.push({
        taskId: dep.task_id,
        type: dep.dependency_type as DependencyType,
        lag: dep.lag_days || 0
      });

      blockedTasks.push(dep.task_id);
    }

    // 計算影響鏈
    const impactChain = await this.calculateImpactChain(taskId);

    // 計算 blockingTasks（此任務被哪些任務阻塞）
    const blockingTasks: string[] = [];
    const predecessors = await this.getPredecessors(taskId);
    if (predecessors) {
      blockingTasks.push(...predecessors.predecessors.map(p => p.taskId));
    }

    return {
      successors,
      blockedTasks,
      blockingTasks,
      impactChain
    };
  }

  /**
   * 添加關聯任務關係
   *
   * @param taskId 當前任務 ID
   * @param relatedTaskId 關聯任務 ID
   * @param relationType 關聯類型
   * @param description 關聯描述
   * @param strength 關聯強度（0-1）
   * @param isSymmetric 是否為雙向關聯
   * @returns 創建的關聯關係
   */
  async addRelatedTask(
    taskId: string,
    relatedTaskId: string,
    relationType: string,
    description?: string,
    strength = 0.5,
    isSymmetric = false
  ): Promise<RelatedTask> {
    // 檢查任務是否存在
    const task = await this.identityService.getTaskById(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    const relatedTask = await this.identityService.getTaskById(relatedTaskId);
    if (!relatedTask) {
      throw new Error(`Related task ${relatedTaskId} not found`);
    }

    // 檢查是否已存在相同關聯關係
    const existing = await this.getRelation(taskId, relatedTaskId);
    if (existing) {
      throw new Error(`Relation already exists between task ${taskId} and ${relatedTaskId}`);
    }

    // 插入關聯關係到數據庫
    const { data, error } = await this.supabase.client
      .from('blueprint_task_relations')
      .insert({
        task_id: taskId,
        related_task_id: relatedTaskId,
        relation_type: relationType,
        description: description || null,
        strength,
        is_symmetric: isSymmetric
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add related task: ${error.message}`);
    }

    // 如果 isSymmetric 為 true，同時創建反向關聯
    if (isSymmetric) {
      await this.supabase.client.from('blueprint_task_relations').insert({
        task_id: relatedTaskId,
        related_task_id: taskId,
        relation_type: relationType,
        description: description || null,
        strength,
        is_symmetric: true
      });
    }

    return this.convertRelatedTaskFromDb(data as DbRelation);
  }

  /**
   * 獲取單個關聯關係
   */
  private async getRelation(taskId: string, relatedTaskId: string): Promise<DbRelation | null> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_relations')
      .select('*')
      .eq('task_id', taskId)
      .eq('related_task_id', relatedTaskId)
      .maybeSingle();

    if (error) {
      return null;
    }

    return data as DbRelation | null;
  }

  /**
   * 獲取任務的所有關聯任務
   *
   * @param taskId 任務 ID
   * @returns 關聯任務列表
   */
  async getRelatedTasks(taskId: string): Promise<RelatedTasks | null> {
    const { data, error } = await this.supabase.client
      .from('blueprint_task_relations')
      .select(
        `
        *,
        related_task:blueprint_tasks!blueprint_task_relations_related_task_id_fkey(
          id,
          code,
          title
        )
      `
      )
      .eq('task_id', taskId);

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to get related tasks: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return { relatedTasks: [] };
    }

    const relatedTasks: RelatedTask[] = [];

    for (const rel of data as any[]) {
      const relatedTask = rel.related_task;
      if (!relatedTask) continue;

      relatedTasks.push({
        taskId: rel.related_task_id,
        relationType: rel.relation_type as any,
        description: rel.description || '',
        strength: Number(rel.strength) || 0.5,
        isSymmetric: rel.is_symmetric || false,
        createdAt: new Date(rel.created_at),
        createdBy: rel.created_by || ''
      });
    }

    return { relatedTasks };
  }

  /**
   * 檢測循環依賴（使用深度優先搜尋 DFS）
   *
   * @param taskId 當前任務 ID
   * @param dependsOnTaskId 前置任務 ID
   * @returns 是否存在循環依賴及循環路徑
   */
  async checkCircularDependency(taskId: string, dependsOnTaskId: string): Promise<{ hasCycle: boolean; cyclePath: string[] }> {
    const cacheKey = `${taskId}-${dependsOnTaskId}`;
    const cached = this.cycleCheckCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return { hasCycle: cached.hasCycle, cyclePath: cached.cyclePath };
    }

    const visited = new Set<string>();
    const path: string[] = [];
    const result = await this.dfs(dependsOnTaskId, taskId, visited, path);

    // 更新緩存
    this.cycleCheckCache.set(cacheKey, {
      hasCycle: result.hasCycle,
      cyclePath: result.cyclePath,
      timestamp: Date.now()
    });

    return result;
  }

  /**
   * 深度優先搜尋（DFS）用於檢測循環依賴
   */
  private async dfs(
    currentNode: string,
    targetNode: string,
    visited: Set<string>,
    path: string[]
  ): Promise<{ hasCycle: boolean; cyclePath: string[] }> {
    // 如果找到目標節點，說明存在循環
    if (currentNode === targetNode) {
      return {
        hasCycle: true,
        cyclePath: [...path, currentNode]
      };
    }

    // 如果已經訪問過此節點，跳過（避免重複計算）
    if (visited.has(currentNode)) {
      return { hasCycle: false, cyclePath: [] };
    }

    visited.add(currentNode);
    path.push(currentNode);

    // 獲取當前節點的所有前置任務
    const predecessors = await this.getPredecessors(currentNode);
    if (predecessors && predecessors.predecessors.length > 0) {
      for (const pred of predecessors.predecessors) {
        const result = await this.dfs(pred.taskId, targetNode, visited, path);
        if (result.hasCycle) {
          return result;
        }
      }
    }

    // 回溯
    path.pop();

    return { hasCycle: false, cyclePath: [] };
  }

  /**
   * 檢查依賴關係是否違反邏輯
   *
   * @param taskId 當前任務 ID
   * @param dependsOnTaskId 前置任務 ID
   * @param type 依賴類型
   * @param lag 延遲天數
   * @returns 是否違反及違反原因
   */
  async checkViolation(
    taskId: string,
    dependsOnTaskId: string,
    type: DependencyType,
    lag: number
  ): Promise<{ isViolated: boolean; reason?: string }> {
    const predActual = await this.timeService.getActualTime(dependsOnTaskId);
    const taskActual = await this.timeService.getActualTime(taskId);

    // 如果前置任務或當前任務沒有實際時間，則不違反
    if (!predActual || !taskActual) {
      return { isViolated: false };
    }

    if (!predActual.actualEndDate || !predActual.actualStartDate) {
      return { isViolated: false };
    }

    if (!taskActual.actualStartDate || !taskActual.actualEndDate) {
      return { isViolated: false };
    }

    const predStart = predActual.actualStartDate;
    const predEnd = predActual.actualEndDate;
    const taskStart = taskActual.actualStartDate;
    const taskEnd = taskActual.actualEndDate;

    // 計算延遲天數（轉換為毫秒）
    const lagMs = lag * 24 * 60 * 60 * 1000;

    let isViolated = false;
    let reason: string | undefined;

    switch (type) {
      case DependencyType.FS: // Finish-to-Start: 前置任務完成後，當前任務才能開始
        // 違反條件：predEnd + lag > taskStart
        if (predEnd.getTime() + lagMs > taskStart.getTime()) {
          isViolated = true;
          reason = `FS dependency violated: Predecessor finished at ${predEnd.toISOString()}, but task started at ${taskStart.toISOString()} (lag: ${lag} days)`;
        }
        break;

      case DependencyType.SS: // Start-to-Start: 前置任務開始後，當前任務才能開始
        // 違反條件：predStart + lag > taskStart
        if (predStart.getTime() + lagMs > taskStart.getTime()) {
          isViolated = true;
          reason = `SS dependency violated: Predecessor started at ${predStart.toISOString()}, but task started at ${taskStart.toISOString()} (lag: ${lag} days)`;
        }
        break;

      case DependencyType.FF: // Finish-to-Finish: 前置任務完成後，當前任務才能完成
        // 違反條件：predEnd + lag > taskEnd
        if (predEnd.getTime() + lagMs > taskEnd.getTime()) {
          isViolated = true;
          reason = `FF dependency violated: Predecessor finished at ${predEnd.toISOString()}, but task finished at ${taskEnd.toISOString()} (lag: ${lag} days)`;
        }
        break;

      case DependencyType.SF: // Start-to-Finish: 前置任務開始後，當前任務才能完成
        // 違反條件：predStart + lag > taskEnd
        if (predStart.getTime() + lagMs > taskEnd.getTime()) {
          isViolated = true;
          reason = `SF dependency violated: Predecessor started at ${predStart.toISOString()}, but task finished at ${taskEnd.toISOString()} (lag: ${lag} days)`;
        }
        break;
    }

    return { isViolated, reason };
  }

  /**
   * 批量更新所有依賴關係的違反狀態
   *
   * @param taskId 任務 ID
   */
  async updateViolationStatus(taskId: string): Promise<void> {
    const predecessors = await this.getPredecessors(taskId);
    if (!predecessors || predecessors.predecessors.length === 0) {
      return;
    }

    for (const pred of predecessors.predecessors) {
      const violation = await this.checkViolation(taskId, pred.taskId, pred.type, pred.lag);

      await this.supabase.client
        .from('blueprint_task_dependencies')
        .update({
          is_violated: violation.isViolated,
          violation_reason: violation.reason || null
        })
        .eq('task_id', taskId)
        .eq('depends_on_task_id', pred.taskId);
    }
  }

  /**
   * 計算影響鏈（如果此任務延遲，會影響哪些任務）
   *
   * @param taskId 任務 ID
   * @returns 影響鏈項目列表
   */
  private async calculateImpactChain(taskId: string): Promise<ImpactChainItem[]> {
    const successors = await this.getSuccessors(taskId);
    if (!successors || successors.successors.length === 0) {
      return [];
    }

    const impactChain: ImpactChainItem[] = [];

    for (const succ of successors.successors) {
      // 計算此任務延遲對後續任務的影響
      const delayDays = await this.calculateDelayImpact(taskId, succ.taskId, succ.type);
      const isCritical = await this.isTaskCritical(succ.taskId);

      impactChain.push({
        taskId: succ.taskId,
        delayDays,
        isCritical
      });
    }

    return impactChain;
  }

  /**
   * 計算延遲影響天數
   */
  private async calculateDelayImpact(taskId: string, successorId: string, type: DependencyType): Promise<number> {
    const taskActual = await this.timeService.getActualTime(taskId);
    const succActual = await this.timeService.getActualTime(successorId);

    if (!taskActual || !succActual) {
      return 0;
    }

    if (!taskActual.actualEndDate || !taskActual.actualStartDate) {
      return 0;
    }

    if (!succActual.actualStartDate || !succActual.actualEndDate) {
      return 0;
    }

    // 根據依賴類型計算延遲影響
    switch (type) {
      case DependencyType.FS: {
        // 如果任務延遲完成，後續任務會延遲開始
        const plannedEnd = taskActual.actualEndDate;
        const succStartFS = succActual.actualStartDate;
        return Math.max(0, Math.ceil((plannedEnd.getTime() - succStartFS.getTime()) / (1000 * 60 * 60 * 24)));
      }

      case DependencyType.SS: {
        // 如果任務延遲開始，後續任務會延遲開始
        const plannedStart = taskActual.actualStartDate;
        const succStartSS = succActual.actualStartDate;
        return Math.max(0, Math.ceil((plannedStart.getTime() - succStartSS.getTime()) / (1000 * 60 * 60 * 24)));
      }

      default:
        return 0;
    }
  }

  /**
   * 檢查任務是否在關鍵路徑上
   */
  private async isTaskCritical(taskId: string): Promise<boolean> {
    const { data, error } = await this.supabase.client.from('blueprint_tasks').select('is_critical_path').eq('id', taskId).single();

    if (error || !data) {
      return false;
    }

    return data.is_critical_path || false;
  }

  /**
   * 獲取完整的任務依賴資訊
   *
   * @param taskId 任務 ID
   * @returns 完整的依賴資訊
   */
  async getTaskDependency(taskId: string): Promise<TaskDependency | null> {
    const [predecessors, successors, relatedTasks] = await Promise.all([
      this.getPredecessors(taskId),
      this.getSuccessors(taskId),
      this.getRelatedTasks(taskId)
    ]);

    if (!predecessors && !successors && !relatedTasks) {
      return null;
    }

    return {
      predecessors: predecessors || undefined,
      successors: successors || undefined,
      relatedTasks: relatedTasks || undefined
    };
  }

  /**
   * 從數據庫格式轉換為 Predecessor
   */
  private convertPredecessorFromDb(db: DbDependency, task: any): Predecessor {
    return {
      taskId: db.depends_on_task_id,
      taskCode: task.code || '',
      taskName: task.title || '',
      type: db.dependency_type as DependencyType,
      lag: db.lag_days || 0,
      lagUnit: (db.lag_unit as 'days' | 'hours') || 'days',
      strength: db.strength as 'mandatory' | 'discretionary' | 'external',
      isViolated: db.is_violated || false,
      violationReason: db.violation_reason || undefined,
      createdAt: new Date(db.created_at),
      createdBy: db.created_by || ''
    };
  }

  /**
   * 從數據庫格式轉換為 RelatedTask
   */
  private convertRelatedTaskFromDb(db: DbRelation): RelatedTask {
    return {
      taskId: db.related_task_id,
      relationType: db.relation_type as any,
      description: db.description || '',
      strength: Number(db.strength) || 0.5,
      isSymmetric: db.is_symmetric || false,
      createdAt: new Date(db.created_at),
      createdBy: db.created_by || ''
    };
  }
}

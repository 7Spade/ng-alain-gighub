import { Injectable, computed, inject, signal } from '@angular/core';
import { IssueAssignmentRepository, IssuePhotoRepository, IssueRepository, IssueSyncLogRepository } from '@core';
import {
  Issue,
  IssueAssignment,
  IssueAssignmentInsert,
  IssueInsert,
  IssuePhoto,
  IssuePhotoInsert,
  IssueSyncLog,
  IssueSyncLogInsert,
  IssueUpdate
} from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Issue Detail
 *
 * 聚合 issues 相關子資料（指派、照片、同步紀錄）
 */
export interface IssueDetail extends Issue {
  assignments: IssueAssignment[];
  photos: IssuePhoto[];
  syncLogs: IssueSyncLog[];
}

/**
 * Issue Service
 *
 * 提供問題追蹤的核心業務邏輯與狀態管理（Signals）
 *
 * - 配合 01 系統架構思維導圖與 04 業務流程圖：任務→品管→問題→同步
 * - 透過 Repository 模式統一存取 Supabase（issues / issue_assignments / issue_photos / issue_sync_logs）
 */
@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private readonly issueRepository = inject(IssueRepository);
  private readonly issueAssignmentRepository = inject(IssueAssignmentRepository);
  private readonly issuePhotoRepository = inject(IssuePhotoRepository);
  private readonly issueSyncLogRepository = inject(IssueSyncLogRepository);

  private readonly issuesState = signal<Issue[]>([]);
  private readonly selectedIssueState = signal<IssueDetail | null>(null);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  readonly issues = this.issuesState.asReadonly();
  readonly selectedIssue = this.selectedIssueState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly openIssues = computed(() =>
    this.issues().filter(issue => {
      const status = (issue.status || '').toLowerCase();
      return status !== 'resolved' && status !== 'closed';
    })
  );

  readonly criticalIssues = computed(() => this.issues().filter(issue => (issue.severity || '').toLowerCase() === 'critical'));

  /**
   * 依藍圖載入問題列表
   */
  async loadIssuesByBlueprint(blueprintId: string): Promise<void> {
    await this.loadIssueCollection(() => this.issueRepository.findByBlueprintId(blueprintId));
  }

  /**
   * 依分支載入問題列表
   */
  async loadIssuesByBranch(branchId: string): Promise<void> {
    await this.loadIssueCollection(() => this.issueRepository.findByBranchId(branchId));
  }

  /**
   * 依任務載入問題列表
   */
  async loadIssuesByTask(taskId: string): Promise<void> {
    await this.loadIssueCollection(() => this.issueRepository.findByTaskId(taskId));
  }

  /**
   * 載入單一問題詳情
   */
  async loadIssueById(issueId: string): Promise<IssueDetail | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const issue = await firstValueFrom(this.issueRepository.findById(issueId));
      if (!issue) {
        this.selectedIssueState.set(null);
        return null;
      }

      const [assignments, photos, syncLogs] = await Promise.all([
        firstValueFrom(this.issueAssignmentRepository.findByIssueId(issueId)),
        firstValueFrom(this.issuePhotoRepository.findByIssueId(issueId)),
        firstValueFrom(this.issueSyncLogRepository.findByIssueId(issueId))
      ]);

      const detail: IssueDetail = {
        ...issue,
        assignments,
        photos,
        syncLogs
      };

      this.selectedIssueState.set(detail);
      return detail;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入問題詳情失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 建立問題
   */
  async createIssue(payload: IssueInsert): Promise<Issue> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const issue = await firstValueFrom(this.issueRepository.create(payload));
      this.issuesState.update(items => [...items, issue]);
      return issue;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '建立問題失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新問題
   */
  async updateIssue(issueId: string, payload: IssueUpdate): Promise<Issue> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const issue = await firstValueFrom(this.issueRepository.update(issueId, payload));
      this.issuesState.update(items => items.map(item => (item.id === issueId ? issue : item)));

      if (this.selectedIssueState()?.id === issueId) {
        const current = this.selectedIssueState();
        if (current) {
          this.selectedIssueState.set({
            ...current,
            ...issue
          });
        }
      }

      return issue;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新問題失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新問題狀態（簡化幫助前端）
   */
  async updateIssueStatus(issueId: string, status: string): Promise<Issue> {
    return this.updateIssue(issueId, { status });
  }

  /**
   * 刪除問題
   */
  async deleteIssue(issueId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.issueRepository.delete(issueId));
      this.issuesState.update(items => items.filter(item => item.id !== issueId));

      if (this.selectedIssueState()?.id === issueId) {
        this.selectedIssueState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '刪除問題失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 取得所有問題
   */
  async getAllIssues(): Promise<Issue[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const issues = await firstValueFrom(this.issueRepository.findAll());
      this.issuesState.set(issues);
      return issues;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入問題列表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 依 ID 取得單一問題
   */
  async getIssueById(issueId: string): Promise<Issue> {
    const detail = await this.loadIssueById(issueId);
    if (!detail) {
      throw new Error(`Issue not found: ${issueId}`);
    }
    return detail;
  }

  /**
   * 同步問題到主分支
   */
  async syncIssueToMain(issueId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 取得問題詳情
      const issue = await this.getIssueById(issueId);

      // 建立同步紀錄
      await this.createSyncLog({
        issue_id: issueId,
        target_blueprint_id: issue.blueprint_id,
        sync_type: 'update',
        synced_at: new Date().toISOString()
      });

      // 更新問題狀態標記為已同步
      await this.updateIssue(issueId, {
        // Add any sync-related fields if needed
      });
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '同步問題到主分支失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 指派問題 (Facade 層使用的簽名)
   */
  async assignIssueToUser(issueId: string, assigneeId: string, assigneeType: 'user' | 'team' | 'organization'): Promise<IssueAssignment> {
    return this.assignIssue({
      issue_id: issueId,
      assignee_id: assigneeId,
      assigned_by: 'current-user' // This should be replaced with actual current user ID
    });
  }

  /**
   * 指派問題
   */
  async assignIssue(payload: IssueAssignmentInsert): Promise<IssueAssignment> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const assignment = await firstValueFrom(this.issueAssignmentRepository.create(payload));
      const issueId = this.resolveIssueId(payload);
      if (this.selectedIssueState()?.id === issueId) {
        const current = this.selectedIssueState();
        if (current) {
          this.selectedIssueState.set({
            ...current,
            assignments: [...current.assignments, assignment]
          });
        }
      }
      return assignment;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '指派問題失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 新增問題照片
   */
  async addIssuePhoto(payload: IssuePhotoInsert): Promise<IssuePhoto> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const photo = await firstValueFrom(this.issuePhotoRepository.create(payload));
      const issueId = this.resolveIssueId(payload);
      if (this.selectedIssueState()?.id === issueId) {
        const current = this.selectedIssueState();
        if (current) {
          this.selectedIssueState.set({
            ...current,
            photos: [...current.photos, photo]
          });
        }
      }
      return photo;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '新增問題照片失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 建立同步紀錄
   */
  async createSyncLog(payload: IssueSyncLogInsert): Promise<IssueSyncLog> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const log = await firstValueFrom(this.issueSyncLogRepository.create(payload));
      const issueId = this.resolveIssueId(payload);
      if (this.selectedIssueState()?.id === issueId) {
        const current = this.selectedIssueState();
        if (current) {
          this.selectedIssueState.set({
            ...current,
            syncLogs: [log, ...current.syncLogs]
          });
        }
      }
      return log;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '建立同步紀錄失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 重設狀態
   */
  reset(): void {
    this.issuesState.set([]);
    this.selectedIssueState.set(null);
    this.clearError();
  }

  /**
   * 清除錯誤
   */
  clearError(): void {
    this.errorState.set(null);
  }

  private async loadIssueCollection(fetcher: () => ReturnType<IssueRepository['findAll']>): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const issues = await firstValueFrom(fetcher());
      this.issuesState.set(issues);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入問題列表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  private resolveIssueId<T extends { issue_id: string } & { issueId?: string }>(payload: T): string {
    return payload.issueId ?? payload.issue_id;
  }

  /**
   * 搜索問題
   *
   * @param query 搜索查詢字串
   * @param options 搜索選項
   * @returns Promise<Issue[]>
   */
  async searchIssues(
    query: string,
    options?: {
      status?: string;
      priority?: string;
      severity?: string;
      blueprintId?: string;
      assigneeId?: string;
      page?: number;
      pageSize?: number;
    }
  ): Promise<Issue[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const issues = await firstValueFrom(this.issueRepository.search(query, options));
      this.issuesState.set(issues);
      return issues;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '搜索問題失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根據狀態查詢問題
   *
   * @param status 問題狀態
   * @returns Promise<Issue[]>
   */
  async getIssuesByStatus(status: string): Promise<Issue[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const issues = await firstValueFrom(this.issueRepository.findByStatus(status));
      this.issuesState.set(issues);
      return issues;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '查詢問題失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根據優先級查詢問題
   *
   * @param priority 問題優先級
   * @returns Promise<Issue[]>
   */
  async getIssuesByPriority(priority: string): Promise<Issue[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const issues = await firstValueFrom(
        this.issueRepository.findAll({
          filters: {
            priority
          }
        })
      );
      this.issuesState.set(issues);
      return issues;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '查詢問題失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根據嚴重程度查詢問題
   *
   * @param severity 問題嚴重程度
   * @returns Promise<Issue[]>
   */
  async getIssuesBySeverity(severity: string): Promise<Issue[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const issues = await firstValueFrom(this.issueRepository.findBySeverity(severity));
      this.issuesState.set(issues);
      return issues;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '查詢問題失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根據分配人查詢問題
   *
   * @param assigneeId 分配人 ID
   * @returns Promise<Issue[]>
   */
  async getIssuesByAssignee(assigneeId: string): Promise<Issue[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const issues = await firstValueFrom(
        this.issueRepository.findAll({
          filters: {
            assigneeId
          }
        })
      );
      this.issuesState.set(issues);
      return issues;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '查詢問題失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }
}

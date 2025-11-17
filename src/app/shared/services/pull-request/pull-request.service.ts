import { Injectable, inject, signal, computed } from '@angular/core';
import { PullRequestRepository, SupabaseService } from '@core';
import { PRStatus } from '@core/infra/types/blueprint.types';
import { BlueprintActivityService } from '../blueprint/blueprint-activity.service';
import { firstValueFrom } from 'rxjs';

/**
 * Pull Request Service
 *
 * 提供 Pull Request 相關的業務邏輯
 * 包含 PR 的建立、審核、合併等操作
 *
 * @example
 * ```typescript
 * const prService = inject(PullRequestService);
 *
 * // 合併 PR
 * await prService.mergePullRequest('pr-id');
 *
 * // 審核 PR
 * await prService.approvePullRequest('pr-id', 'Looks good!');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class PullRequestService {
  private supabase = inject(SupabaseService);
  private prRepo = inject(PullRequestRepository);
  private activityService = inject(BlueprintActivityService);

  // 使用 Signals 管理狀態
  private pullRequestsState = signal<any[]>([]);
  private selectedPRState = signal<any | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給元件
  readonly pullRequests = this.pullRequestsState.asReadonly();
  readonly selectedPR = this.selectedPRState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly openPRs = computed(() => this.pullRequests().filter(pr => pr.status === PRStatus.OPEN));

  readonly reviewingPRs = computed(() => this.pullRequests().filter(pr => pr.status === PRStatus.REVIEWING));

  readonly mergedPRs = computed(() => this.pullRequests().filter(pr => pr.status === PRStatus.MERGED));

  /**
   * 載入指定藍圖的 Pull Requests
   *
   * @param blueprintId 藍圖 ID
   */
  async loadPullRequestsByBlueprint(blueprintId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const prs = await firstValueFrom(this.prRepo.findByBlueprintId(blueprintId));
      this.pullRequestsState.set(prs);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入 Pull Requests 失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 合併 Pull Request
   *
   * 此方法執行完整的 PR 合併流程：
   * 1. 驗證 PR 狀態
   * 2. 呼叫資料庫 RPC 函數執行合併
   * 3. 更新 PR 狀態為 MERGED
   * 4. 記錄活動日誌
   *
   * @param prId Pull Request ID
   * @throws Error 如果 PR 不在可合併狀態
   */
  async mergePullRequest(prId: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 1. 取得 PR 與變更資料
      const pr = await firstValueFrom(this.prRepo.findById(prId));
      if (!pr) {
        throw new Error('Pull Request 不存在');
      }

      // 2. 驗證 PR 狀態
      if (pr.status !== PRStatus.APPROVED) {
        throw new Error(`Pull Request 狀態必須為 APPROVED 才能合併（目前狀態：${pr.status}）`);
      }

      // 3. 呼叫 RPC 函數執行合併
      // merge_pr_changes 函數會在交易中更新所有相關的 task.contractor_fields
      const { error: rpcError } = await this.supabase.rpc('merge_pr_changes', {
        p_pr_id: prId,
        p_changes: pr.changes || []
      });

      if (rpcError) {
        throw new Error(`合併失敗: ${rpcError.message}`);
      }

      // 4. 更新 PR 狀態為 MERGED
      await firstValueFrom(
        this.prRepo.update(prId, {
          status: PRStatus.MERGED,
          merged_at: new Date().toISOString()
        } as any)
      );

      // 5. 記錄活動日誌
      await this.activityService.logPRMerge(pr);

      // 6. 更新本地狀態
      this.pullRequestsState.update(prs => prs.map(p => (p.id === prId ? { ...p, status: PRStatus.MERGED } : p)));

      if (this.selectedPRState()?.id === prId) {
        this.selectedPRState.update(pr => pr ? { ...pr, status: PRStatus.MERGED } : null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '合併 Pull Request 失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 審核並批准 Pull Request
   *
   * @param prId Pull Request ID
   * @param comment 審核意見
   */
  async approvePullRequest(prId: string, comment?: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const pr = await firstValueFrom(this.prRepo.findById(prId));
      if (!pr) {
        throw new Error('Pull Request 不存在');
      }

      if (pr.status !== PRStatus.REVIEWING) {
        throw new Error(`Pull Request 必須在審核中狀態才能批准（目前狀態：${pr.status}）`);
      }

      await firstValueFrom(
        this.prRepo.update(prId, {
          status: PRStatus.APPROVED,
          reviewed_at: new Date().toISOString(),
          review_comment: comment
        } as any)
      );

      // 記錄活動
      await this.activityService.logActivity({
        blueprintId: pr.blueprintId || (pr as any).blueprint_id,
        entityType: 'pull_request',
        entityId: prId,
        action: 'approved',
        metadata: { comment }
      });

      // 更新本地狀態
      this.pullRequestsState.update(prs =>
        prs.map(p => (p.id === prId ? { ...p, status: PRStatus.APPROVED } : p))
      );
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '批准 Pull Request 失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 拒絕 Pull Request
   *
   * @param prId Pull Request ID
   * @param comment 拒絕原因
   */
  async rejectPullRequest(prId: string, comment: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const pr = await firstValueFrom(this.prRepo.findById(prId));
      if (!pr) {
        throw new Error('Pull Request 不存在');
      }

      if (pr.status !== PRStatus.REVIEWING) {
        throw new Error(`Pull Request 必須在審核中狀態才能拒絕（目前狀態：${pr.status}）`);
      }

      await firstValueFrom(
        this.prRepo.update(prId, {
          status: PRStatus.REJECTED,
          reviewed_at: new Date().toISOString(),
          review_comment: comment
        } as any)
      );

      // 記錄活動
      await this.activityService.logActivity({
        blueprintId: pr.blueprintId || (pr as any).blueprint_id,
        entityType: 'pull_request',
        entityId: prId,
        action: 'rejected',
        metadata: { comment }
      });

      // 更新本地狀態
      this.pullRequestsState.update(prs => prs.map(p => (p.id === prId ? { ...p, status: PRStatus.REJECTED } : p)));
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '拒絕 Pull Request 失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 選擇 PR
   */
  selectPR(pr: any | null): void {
    this.selectedPRState.set(pr);
  }

  /**
   * 清除錯誤狀態
   */
  clearError(): void {
    this.errorState.set(null);
  }
}

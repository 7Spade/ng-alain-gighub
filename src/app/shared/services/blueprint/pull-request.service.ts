import { Injectable, inject, signal, computed } from '@angular/core';
import { PullRequestRepository, PullRequestInsert, PullRequestUpdate, PRStatus } from '@core';
import { PullRequest } from '@shared';
import { Observable, firstValueFrom } from 'rxjs';

/**
 * PullRequest Service
 *
 * 提供 Pull Request 相关的业务逻辑和状态管理
 * 实现 Git-like PR 机制：创建、审核、合并（更新承揽字段）
 *
 * @example
 * ```typescript
 * const prService = inject(PullRequestService);
 *
 * // 订阅 PR 列表
 * effect(() => {
 *   console.log('Pull Requests:', prService.pullRequests());
 * });
 *
 * // 创建 PR
 * await prService.createPullRequest({
 *   blueprintId: 'blueprint-id',
 *   branchId: 'branch-id',
 *   title: '提交执行数据',
 *   submittedBy: 'user-id'
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class PullRequestService {
  private pullRequestRepository = inject(PullRequestRepository);

  // 使用 Signals 管理状态
  private pullRequestsState = signal<PullRequest[]>([]);
  private selectedPullRequestState = signal<PullRequest | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly pullRequests = this.pullRequestsState.asReadonly();
  readonly selectedPullRequest = this.selectedPullRequestState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly openPullRequests = computed(() => this.pullRequests().filter(pr => pr.status === PRStatus.OPEN));

  readonly reviewingPullRequests = computed(() => this.pullRequests().filter(pr => pr.status === PRStatus.REVIEWING));

  readonly approvedPullRequests = computed(() => this.pullRequests().filter(pr => pr.status === PRStatus.APPROVED));

  readonly mergedPullRequests = computed(() => this.pullRequests().filter(pr => pr.status === PRStatus.MERGED));

  /**
   * 加载所有 Pull Request
   */
  async loadPullRequests(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const pullRequests = await firstValueFrom(this.pullRequestRepository.findAll());
      this.pullRequestsState.set(pullRequests);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载 Pull Request 列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据 ID 加载 Pull Request
   */
  async loadPullRequestById(id: string): Promise<PullRequest | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const pullRequest = await firstValueFrom(this.pullRequestRepository.findById(id));
      if (pullRequest) {
        this.selectedPullRequestState.set(pullRequest);
      }
      return pullRequest;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载 Pull Request 失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据蓝图 ID 加载 Pull Request 列表
   */
  async loadPullRequestsByBlueprintId(blueprintId: string): Promise<PullRequest[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const pullRequests = await firstValueFrom(this.pullRequestRepository.findByBlueprintId(blueprintId));
      this.pullRequestsState.set(pullRequests);
      return pullRequests;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载 Pull Request 列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据分支 ID 加载 Pull Request 列表
   */
  async loadPullRequestsByBranchId(branchId: string): Promise<PullRequest[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const pullRequests = await firstValueFrom(this.pullRequestRepository.findByBranchId(branchId));
      this.pullRequestsState.set(pullRequests);
      return pullRequests;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载 Pull Request 列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 创建 Pull Request
   *
   * @param data PR 数据
   * @returns 创建的 PR
   */
  async createPullRequest(data: PullRequestInsert): Promise<PullRequest> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const pullRequest = await firstValueFrom(
        this.pullRequestRepository.create({
          ...data,
          status: PRStatus.OPEN
        } as any)
      );
      // 更新本地状态
      this.pullRequestsState.update(prs => [...prs, pullRequest]);
      return pullRequest;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '创建 Pull Request 失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新 Pull Request
   */
  async updatePullRequest(id: string, data: PullRequestUpdate): Promise<PullRequest> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const pullRequest = await firstValueFrom(this.pullRequestRepository.update(id, data));
      // 更新本地状态
      this.pullRequestsState.update(prs => prs.map(pr => (pr.id === id ? pullRequest : pr)));
      // 如果更新的是当前选中的 PR，也更新选中状态
      if (this.selectedPullRequest()?.id === id) {
        this.selectedPullRequestState.set(pullRequest);
      }
      return pullRequest;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新 Pull Request 失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 删除 Pull Request
   */
  async deletePullRequest(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.pullRequestRepository.delete(id));
      // 更新本地状态
      this.pullRequestsState.update(prs => prs.filter(pr => pr.id !== id));
      // 如果删除的是当前选中的 PR，清空选中状态
      if (this.selectedPullRequest()?.id === id) {
        this.selectedPullRequestState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '删除 Pull Request 失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 选择 Pull Request
   */
  selectPullRequest(pullRequest: PullRequest | null): void {
    this.selectedPullRequestState.set(pullRequest);
  }

  /**
   * 开始审核 PR（状态变为 reviewing）
   *
   * @param prId PR ID
   * @param reviewedBy 审核者 ID
   */
  async startReview(prId: string, reviewedBy: string): Promise<PullRequest> {
    return await this.updatePullRequest(prId, {
      status: PRStatus.REVIEWING,
      reviewedBy
    } as any);
  }

  /**
   * 批准 PR（状态变为 approved）
   *
   * @param prId PR ID
   * @param reviewedBy 审核者 ID
   */
  async approvePullRequest(prId: string, reviewedBy: string): Promise<PullRequest> {
    return await this.updatePullRequest(prId, {
      status: PRStatus.APPROVED,
      reviewedBy,
      reviewedAt: new Date().toISOString()
    } as any);
  }

  /**
   * 拒绝 PR（状态变为 rejected）
   *
   * @param prId PR ID
   * @param reviewedBy 审核者 ID
   */
  async rejectPullRequest(prId: string, reviewedBy: string): Promise<PullRequest> {
    return await this.updatePullRequest(prId, {
      status: PRStatus.REJECTED,
      reviewedBy,
      reviewedAt: new Date().toISOString()
    } as any);
  }

  /**
   * 合并 PR（状态变为 merged，更新承揽字段）
   *
   * 注意：实际的合并逻辑（更新任务承揽字段）应该在 Service 层或更高层实现
   * 这里只更新 PR 状态
   *
   * @param prId PR ID
   * @param mergedBy 合并者 ID
   * @param changesSummary 变更摘要（用于记录合并的内容）
   */
  async mergePullRequest(prId: string, mergedBy: string, changesSummary?: any): Promise<PullRequest> {
    return await this.updatePullRequest(prId, {
      status: PRStatus.MERGED,
      mergedBy,
      mergedAt: new Date().toISOString(),
      changesSummary: changesSummary || {}
    } as any);
  }

  /**
   * 关闭 PR（状态变为 closed）
   *
   * @param prId PR ID
   */
  async closePullRequest(prId: string): Promise<PullRequest> {
    return await this.updatePullRequest(prId, {
      status: PRStatus.CLOSED
    } as any);
  }

  /**
   * 重置状态
   */
  reset(): void {
    this.pullRequestsState.set([]);
    this.selectedPullRequestState.set(null);
    this.errorState.set(null);
  }
}

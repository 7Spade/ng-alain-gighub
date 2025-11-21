import { inject, Injectable, signal } from '@angular/core';
import { type PullRequest, type PullRequestInsert, type PullRequestUpdate, type QueryOptions } from '@core';
import { BlueprintActivityService, PullRequestService } from '@shared';

/**
 * Blueprint Pull Request Facade
 *
 * 负责 Pull Request 工作流管理
 * 包括 PR 创建、审核、合并、关闭等操作
 *
 * @module core/facades/blueprint
 */
@Injectable({
  providedIn: 'root'
})
export class BlueprintPrFacade {
  private readonly pullRequestService = inject(PullRequestService);
  private readonly activityService = inject(BlueprintActivityService);

  // Signal state
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);

  // Expose service signals
  readonly pullRequests = this.pullRequestService.pullRequests;
  readonly selectedPullRequest = this.pullRequestService.selectedPullRequest;
  readonly openPullRequests = this.pullRequestService.openPullRequests;
  readonly reviewingPullRequests = this.pullRequestService.reviewingPullRequests;
  readonly approvedPullRequests = this.pullRequestService.approvedPullRequests;
  readonly mergedPullRequests = this.pullRequestService.mergedPullRequests;
  readonly loading = this.pullRequestService.loading;
  readonly error = this.pullRequestService.error;

  // Facade-specific signals
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();

  /**
   * Create Pull Request
   *
   * @param data Pull Request insert data
   * @returns Promise<PullRequest>
   */
  async createPullRequest(data: PullRequestInsert): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_pull_request');

    try {
      const pr = await this.pullRequestService.createPullRequest(data);

      // Log activity
      try {
        await this.activityService.logActivity(pr.blueprint_id, 'pull_request', pr.id, 'created', [], {
          prTitle: pr.title,
          branchId: pr.branch_id
        });
      } catch (error) {
        console.error('[BlueprintPrFacade] Failed to log PR creation:', error);
      }

      return pr;
    } catch (error) {
      console.error('[BlueprintPrFacade] Failed to create pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load Pull Requests for a blueprint
   *
   * @param blueprintId Blueprint ID
   * @param options Query options
   * @returns Promise<PullRequest[]>
   */
  async loadPullRequests(blueprintId: string, options?: QueryOptions): Promise<PullRequest[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_pull_requests');

    try {
      return await this.pullRequestService.loadPullRequestsByBlueprintId(blueprintId);
    } catch (error) {
      console.error('[BlueprintPrFacade] Failed to load pull requests:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load Pull Request by ID
   *
   * @param prId Pull Request ID
   * @returns Promise<PullRequest | null>
   */
  async loadPullRequestById(prId: string): Promise<PullRequest | null> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_pull_request_by_id');

    try {
      return await this.pullRequestService.loadPullRequestById(prId);
    } catch (error) {
      console.error('[BlueprintPrFacade] Failed to load pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load Pull Requests by branch ID
   *
   * @param branchId Branch ID
   * @returns Promise<PullRequest[]>
   */
  async loadPullRequestsByBranchId(branchId: string): Promise<PullRequest[]> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_pull_requests_by_branch');

    try {
      return await this.pullRequestService.loadPullRequestsByBranchId(branchId);
    } catch (error) {
      console.error('[BlueprintPrFacade] Failed to load pull requests by branch:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update Pull Request
   *
   * @param prId Pull Request ID
   * @param data Pull Request update data
   * @returns Promise<PullRequest>
   */
  async updatePullRequest(prId: string, data: PullRequestUpdate): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_pull_request');

    try {
      return await this.pullRequestService.updatePullRequest(prId, data);
    } catch (error) {
      console.error('[BlueprintPrFacade] Failed to update pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Start review of Pull Request
   *
   * @param prId Pull Request ID
   * @param reviewedBy Reviewer ID
   * @returns Promise<PullRequest>
   */
  async startReview(prId: string, reviewedBy: string): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('start_review');

    try {
      return await this.pullRequestService.startReview(prId, reviewedBy);
    } catch (error) {
      console.error('[BlueprintPrFacade] Failed to start review:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Approve Pull Request
   *
   * @param prId Pull Request ID
   * @param reviewedBy Reviewer ID
   * @returns Promise<PullRequest>
   */
  async approvePullRequest(prId: string, reviewedBy: string): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('approve_pull_request');

    try {
      return await this.pullRequestService.approvePullRequest(prId, reviewedBy);
    } catch (error) {
      console.error('[BlueprintPrFacade] Failed to approve pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Reject Pull Request
   *
   * @param prId Pull Request ID
   * @param reviewedBy Reviewer ID
   * @param reason Rejection reason (optional)
   * @returns Promise<PullRequest>
   */
  async rejectPullRequest(prId: string, reviewedBy: string, reason?: string): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('reject_pull_request');

    try {
      const pr = await this.pullRequestService.rejectPullRequest(prId, reviewedBy);
      // Note: reason can be added to PR description or comments if needed
      return pr;
    } catch (error) {
      console.error('[BlueprintPrFacade] Failed to reject pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Merge Pull Request
   *
   * @param prId Pull Request ID
   * @param mergedBy User ID who performs the merge
   * @param changesSummary Changes summary (optional)
   * @returns Promise<PullRequest>
   */
  async mergePullRequest(prId: string, mergedBy: string, changesSummary?: any): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('merge_pull_request');

    try {
      return await this.pullRequestService.mergePullRequest(prId, mergedBy, changesSummary);
    } catch (error) {
      console.error('[BlueprintPrFacade] Failed to merge pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Close Pull Request
   *
   * @param prId Pull Request ID
   * @returns Promise<PullRequest>
   */
  async closePullRequest(prId: string): Promise<PullRequest> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('close_pull_request');

    try {
      return await this.pullRequestService.closePullRequest(prId);
    } catch (error) {
      console.error('[BlueprintPrFacade] Failed to close pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Delete Pull Request
   *
   * @param prId Pull Request ID
   * @returns Promise<void>
   */
  async deletePullRequest(prId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('delete_pull_request');

    try {
      await this.pullRequestService.deletePullRequest(prId);
    } catch (error) {
      console.error('[BlueprintPrFacade] Failed to delete pull request:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Select Pull Request
   *
   * @param pr Pull Request or null to deselect
   */
  selectPullRequest(pr: PullRequest | null): void {
    this.pullRequestService.selectPullRequest(pr);
  }
}

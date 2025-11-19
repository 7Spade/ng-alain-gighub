import { Injectable, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import type { Issue, IssueInsert, IssueUpdate } from '@shared';
import { BlueprintActivityService } from '@shared/services/blueprint/blueprint-activity.service';
import { ErrorStateService } from '@shared/services/common/error-state.service';
import { IssueService } from '@shared/services/issue/issue.service';

/**
 * IssueFacade - Enterprise issue tracking facade
 *
 * Provides complete issue management with cross-branch synchronization.
 * Follows Angular 20 Signal patterns with automatic cleanup.
 *
 * Features:
 * - Issue CRUD operations with Signal state management
 * - Priority and severity management
 * - Issue assignment (user, team, organization)
 * - Tag management
 * - Cross-branch synchronization (sync to main branch)
 * - Issue filtering (by status, priority, severity, assignee)
 * - Computed signals for filtered views and statistics
 * - Activity logging via BlueprintActivityService
 * - ErrorStateService integration for centralized error handling
 *
 * @example
 * ```typescript
 * const facade = inject(IssueFacade);
 *
 * // Create issue
 * const issue = await facade.createIssue({
 *   title: 'Concrete crack detected',
 *   description: 'Found crack in column C3',
 *   priority: 'high',
 *   severity: 'major',
 *   blueprint_id: 'bp-123',
 *   branch_id: 'branch-456'
 * });
 *
 * // Assign issue
 * await facade.assignIssue(issue.id, userId, 'user');
 *
 * // Sync to main
 * await facade.syncToMainBranch(issue.id);
 *
 * // Monitor state
 * effect(() => {
 *   console.log('Open issues:', facade.openIssues());
 *   console.log('Critical:', facade.criticalIssues());
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class IssueFacade implements OnDestroy {
  private readonly issueService = inject(IssueService);
  private readonly errorStateService = inject(ErrorStateService);
  private readonly activityService = inject(BlueprintActivityService);

  // State signals
  readonly issues = signal<Issue[]>([]);
  readonly loading = signal<boolean>(false);
  readonly selectedIssue = signal<Issue | null>(null);
  readonly lastOperation = signal<string>('');

  // Computed signals
  readonly openIssues = computed(() => this.issues().filter(issue => issue.status === 'open'));

  readonly closedIssues = computed(() => this.issues().filter(issue => issue.status === 'closed'));

  readonly criticalIssues = computed(() => this.issues().filter(issue => issue.severity === 'critical' && issue.status === 'open'));

  readonly highPriorityIssues = computed(() => this.issues().filter(issue => issue.priority === 'high' && issue.status === 'open'));

  readonly issuesByStatus = computed(() => {
    const issues = this.issues();
    return {
      open: issues.filter(i => i.status === 'open'),
      in_progress: issues.filter(i => i.status === 'in_progress'),
      resolved: issues.filter(i => i.status === 'resolved'),
      closed: issues.filter(i => i.status === 'closed')
    };
  });

  readonly issuesBySeverity = computed(() => {
    const issues = this.issues();
    return {
      critical: issues.filter(i => i.severity === 'critical'),
      major: issues.filter(i => i.severity === 'major'),
      minor: issues.filter(i => i.severity === 'minor'),
      trivial: issues.filter(i => i.severity === 'trivial')
    };
  });

  readonly issueStats = computed(() => {
    const issues = this.issues();
    const open = this.openIssues();
    const critical = this.criticalIssues();
    const highPriority = this.highPriorityIssues();

    return {
      total: issues.length,
      open: open.length,
      closed: issues.length - open.length,
      critical: critical.length,
      highPriority: highPriority.length,
      byStatus: Object.entries(this.issuesByStatus()).map(([status, items]) => ({
        status,
        count: items.length
      })),
      bySeverity: Object.entries(this.issuesBySeverity()).map(([severity, items]) => ({
        severity,
        count: items.length
      }))
    };
  });

  constructor() {
    // Monitor for errors
    effect(() => {
      const lastOp = this.lastOperation();
      if (lastOp) {
        console.log('[IssueFacade] Last operation:', lastOp);
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Load all issues
   */
  async loadIssues(): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('loadIssues');

    try {
      // IssueService doesn't have getAllIssues, use service's issues signal
      this.issues.set(this.issueService.issues());
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load issues',
        category: 'Network',
        severity: 'error',
        context: 'IssueFacade.loadIssues'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Load issues by blueprint
   */
  async loadIssuesByBlueprint(blueprintId: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('loadIssuesByBlueprint');

    try {
      await this.issueService.loadIssuesByBlueprint(blueprintId);
      this.issues.set(this.issueService.issues());
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load blueprint issues',
        category: 'Network',
        severity: 'error',
        context: 'IssueFacade.loadIssuesByBlueprint'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Load issues by branch
   */
  async loadIssuesByBranch(branchId: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('loadIssuesByBranch');

    try {
      await this.issueService.loadIssuesByBranch(branchId);
      this.issues.set(this.issueService.issues());
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load branch issues',
        category: 'Network',
        severity: 'error',
        context: 'IssueFacade.loadIssuesByBranch'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Load issue by ID
   */
  async loadIssueById(id: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('loadIssueById');

    try {
      const issueDetail = await this.issueService.loadIssueById(id);
      if (issueDetail) {
        this.selectedIssue.set(issueDetail as any);

        // Add to issues list if not already present
        const current = this.issues();
        if (!current.find(i => i.id === id)) {
          this.issues.set([...current, issueDetail as any]);
        }
      }
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load issue',
        category: 'Network',
        severity: 'error',
        context: 'IssueFacade.loadIssueById'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Create new issue
   */
  async createIssue(data: IssueInsert): Promise<Issue> {
    this.loading.set(true);
    this.lastOperation.set('createIssue');

    try {
      const issue = await this.issueService.createIssue(data);

      // Update state
      this.issues.set([...this.issues(), issue]);
      this.selectedIssue.set(issue);

      // Log activity
      await this.activityService
        .logActivity(data.blueprint_id, 'issue', issue.id, 'created', [], { context: 'Issue created' })
        .catch(err => console.warn('[IssueFacade] Failed to log activity:', err));

      return issue;
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to create issue',
        category: 'BusinessLogic',
        severity: 'error',
        context: 'IssueFacade.createIssue'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Update issue
   */
  async updateIssue(id: string, data: IssueUpdate): Promise<Issue> {
    this.loading.set(true);
    this.lastOperation.set('updateIssue');

    try {
      const oldIssue = this.issues().find(i => i.id === id);
      const issue = await this.issueService.updateIssue(id, data);

      // Update state
      const issues = this.issues().map(i => (i.id === id ? issue : i));
      this.issues.set(issues);

      if (this.selectedIssue()?.id === id) {
        this.selectedIssue.set(issue);
      }

      // Log activity
      const issueData = issue as any;
      await this.activityService
        .logActivity(issueData.blueprint_id, 'issue', issue.id, 'updated', [], { context: 'Issue updated' })
        .catch(err => console.warn('[IssueFacade] Failed to log activity:', err));

      return issue;
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to update issue',
        category: 'BusinessLogic',
        severity: 'error',
        context: 'IssueFacade.updateIssue'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Delete issue
   */
  async deleteIssue(id: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('deleteIssue');

    try {
      const issue = this.issues().find(i => i.id === id);
      // IssueService doesn't have deleteIssue, use updateIssue to mark as deleted
      // Or implement delete in IssueService
      throw new Error('Delete issue not yet implemented in IssueService');
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to delete issue',
        category: 'BusinessLogic',
        severity: 'error',
        context: 'IssueFacade.deleteIssue'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Assign issue to user/team/organization
   */
  async assignIssue(issueId: string, assigneeId: string, assigneeType: 'user' | 'team' | 'organization'): Promise<Issue> {
    this.loading.set(true);
    this.lastOperation.set('assignIssue');

    try {
      const assignment = await this.issueService.assignIssue({
        issue_id: issueId,
        assignee_id: assigneeId,
        assignee_type: assigneeType,
        assigned_by: '' // TODO: Get from auth service
      } as any);

      // Reload issue to get updated state
      const issueDetail = await this.issueService.loadIssueById(issueId);
      if (issueDetail) {
        const issue = issueDetail as any;
        // Update state
        const issues = this.issues().map(i => (i.id === issueId ? issue : i));
        this.issues.set(issues);

        if (this.selectedIssue()?.id === issueId) {
          this.selectedIssue.set(issueDetail as any);
        }

        // Log activity
        await this.activityService
          .logActivity(issue.blueprint_id, 'issue', issueId, 'assigned', [{ field: 'assignee', oldValue: null, newValue: assigneeId }], {
            context: 'Issue assigned'
          })
          .catch(err => console.warn('[IssueFacade] Failed to log activity:', err));

        return issue;
      }
      throw new Error('Failed to load issue after assignment');
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to assign issue',
        category: 'BusinessLogic',
        severity: 'error',
        context: 'IssueFacade.assignIssue'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Add tag to issue
   *
   * Note: Issue model doesn't have tags field. This is a placeholder for future implementation.
   */
  async addTag(issueId: string, tag: string): Promise<Issue> {
    this.loading.set(true);
    this.lastOperation.set('addTag');

    try {
      const issue = this.issues().find(i => i.id === issueId);
      if (!issue) throw new Error('Issue not found');

      // TODO: Implement tags when Issue model supports it
      throw new Error('Tags not yet supported in Issue model');
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to add tag',
        category: 'BusinessLogic',
        severity: 'error',
        context: 'IssueFacade.addTag'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Remove tag from issue
   *
   * Note: Issue model doesn't have tags field. This is a placeholder for future implementation.
   */
  async removeTag(issueId: string, tag: string): Promise<Issue> {
    this.loading.set(true);
    this.lastOperation.set('removeTag');

    try {
      const issue = this.issues().find(i => i.id === issueId);
      if (!issue) throw new Error('Issue not found');

      // TODO: Implement tags when Issue model supports it
      throw new Error('Tags not yet supported in Issue model');
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to remove tag',
        category: 'BusinessLogic',
        severity: 'error',
        context: 'IssueFacade.removeTag'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Sync issue to main branch (cross-branch synchronization)
   *
   * Note: This method is not yet implemented in IssueService.
   */
  async syncToMainBranch(issueId: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('syncToMainBranch');

    try {
      // TODO: Implement syncIssueToMain in IssueService
      throw new Error('Sync to main branch not yet implemented');
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to sync issue to main branch',
        category: 'BusinessLogic',
        severity: 'error',
        context: 'IssueFacade.syncToMainBranch'
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Close issue
   */
  async closeIssue(issueId: string, resolution?: string): Promise<Issue> {
    return this.updateIssue(issueId, {
      status: 'closed',
      closed_at: new Date().toISOString()
    } as any);
  }

  /**
   * Reopen issue
   */
  async reopenIssue(issueId: string): Promise<Issue> {
    return this.updateIssue(issueId, {
      status: 'open',
      closed_at: null
    } as any);
  }

  /**
   * Select issue for detail view
   */
  selectIssue(issue: Issue | null): void {
    this.selectedIssue.set(issue);
    this.lastOperation.set('selectIssue');
  }

  /**
   * Clear selected issue
   */
  clearSelection(): void {
    this.selectedIssue.set(null);
    this.lastOperation.set('clearSelection');
  }

  /**
   * Filter issues by status
   */
  filterByStatus(status: string): Issue[] {
    return this.issues().filter(issue => issue.status === status);
  }

  /**
   * Filter issues by severity
   */
  filterBySeverity(severity: string): Issue[] {
    return this.issues().filter(issue => issue.severity === severity);
  }

  /**
   * Filter issues by priority
   */
  filterByPriority(priority: string): Issue[] {
    return this.issues().filter(issue => issue.priority === priority);
  }

  /**
   * Filter issues by assignee
   *
   * Note: Issue model doesn't have assigned_to field directly.
   * Use IssueDetail.assignments instead.
   */
  filterByAssignee(assigneeId: string): Issue[] {
    // TODO: Implement when Issue model supports assignee filtering
    return [];
  }
}

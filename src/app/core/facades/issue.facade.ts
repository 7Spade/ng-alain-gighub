import { Injectable, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import type { Issue, IssueInsert, IssueUpdate } from '@shared/models/issue.model';
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
      const issues = await this.issueService.getAllIssues();
      this.issues.set(issues);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load issues',
        category: 'Network',
        severity: 'error',
        context: { operation: 'loadIssues', error }
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
      const issues = await this.issueService.getIssuesByBlueprint(blueprintId);
      this.issues.set(issues);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load blueprint issues',
        category: 'Network',
        severity: 'error',
        context: { operation: 'loadIssuesByBlueprint', blueprintId, error }
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
      const issues = await this.issueService.getIssuesByBranch(branchId);
      this.issues.set(issues);
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load branch issues',
        category: 'Network',
        severity: 'error',
        context: { operation: 'loadIssuesByBranch', branchId, error }
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
      const issue = await this.issueService.getIssueById(id);
      this.selectedIssue.set(issue);

      // Add to issues list if not already present
      const current = this.issues();
      if (!current.find(i => i.id === id)) {
        this.issues.set([...current, issue]);
      }
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to load issue',
        category: 'Network',
        severity: 'error',
        context: { operation: 'loadIssueById', id, error }
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
      await this.activityService.logActivity({
        blueprintId: data.blueprint_id,
        resourceType: 'issue',
        resourceId: issue.id,
        action: 'created',
        changes: []
      });

      return issue;
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to create issue',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'createIssue', data, error }
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
      await this.activityService.logActivity({
        blueprintId: issue.blueprint_id,
        resourceType: 'issue',
        resourceId: issue.id,
        action: 'updated',
        changes: []
      });

      return issue;
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to update issue',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'updateIssue', id, data, error }
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
      await this.issueService.deleteIssue(id);

      // Update state
      this.issues.set(this.issues().filter(i => i.id !== id));

      if (this.selectedIssue()?.id === id) {
        this.selectedIssue.set(null);
      }

      // Log activity
      if (issue) {
        await this.activityService.logActivity({
          blueprintId: issue.blueprint_id,
          resourceType: 'issue',
          resourceId: id,
          action: 'deleted',
          changes: []
        });
      }
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to delete issue',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'deleteIssue', id, error }
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
      const issue = await this.issueService.assignIssue(issueId, assigneeId, assigneeType);

      // Update state
      const issues = this.issues().map(i => (i.id === issueId ? issue : i));
      this.issues.set(issues);

      if (this.selectedIssue()?.id === issueId) {
        this.selectedIssue.set(issue);
      }

      // Log activity
      await this.activityService.logActivity({
        blueprintId: issue.blueprint_id,
        resourceType: 'issue',
        resourceId: issueId,
        action: 'assigned',
        changes: [{ field: 'assignee', oldValue: null, newValue: assigneeId }]
      });

      return issue;
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to assign issue',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'assignIssue', issueId, assigneeId, assigneeType, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Add tag to issue
   */
  async addTag(issueId: string, tag: string): Promise<Issue> {
    this.loading.set(true);
    this.lastOperation.set('addTag');

    try {
      const issue = this.issues().find(i => i.id === issueId);
      if (!issue) throw new Error('Issue not found');

      const currentTags = issue.tags || [];
      if (currentTags.includes(tag)) {
        return issue; // Tag already exists
      }

      const updatedIssue = await this.updateIssue(issueId, {
        tags: [...currentTags, tag]
      });

      return updatedIssue;
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to add tag',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'addTag', issueId, tag, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Remove tag from issue
   */
  async removeTag(issueId: string, tag: string): Promise<Issue> {
    this.loading.set(true);
    this.lastOperation.set('removeTag');

    try {
      const issue = this.issues().find(i => i.id === issueId);
      if (!issue) throw new Error('Issue not found');

      const currentTags = issue.tags || [];
      const updatedIssue = await this.updateIssue(issueId, {
        tags: currentTags.filter(t => t !== tag)
      });

      return updatedIssue;
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to remove tag',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'removeTag', issueId, tag, error }
      });
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Sync issue to main branch (cross-branch synchronization)
   */
  async syncToMainBranch(issueId: string): Promise<void> {
    this.loading.set(true);
    this.lastOperation.set('syncToMainBranch');

    try {
      await this.issueService.syncIssueToMain(issueId);

      // Reload issue to get updated sync status
      await this.loadIssueById(issueId);

      const issue = this.selectedIssue();
      if (issue) {
        await this.activityService.logActivity({
          blueprintId: issue.blueprint_id,
          resourceType: 'issue',
          resourceId: issueId,
          action: 'synced_to_main',
          changes: []
        });
      }
    } catch (error) {
      this.errorStateService.addError({
        message: 'Failed to sync issue to main branch',
        category: 'BusinessLogic',
        severity: 'error',
        context: { operation: 'syncToMainBranch', issueId, error }
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
      resolution,
      resolved_at: new Date()
    });
  }

  /**
   * Reopen issue
   */
  async reopenIssue(issueId: string): Promise<Issue> {
    return this.updateIssue(issueId, {
      status: 'open',
      resolution: null,
      resolved_at: null
    });
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
   */
  filterByAssignee(assigneeId: string): Issue[] {
    return this.issues().filter(issue => issue.assigned_to === assigneeId);
  }
}

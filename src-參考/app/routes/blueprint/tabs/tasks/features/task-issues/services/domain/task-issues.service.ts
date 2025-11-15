import { Injectable, inject } from '@angular/core';
import { BlueprintIssueService, BlueprintService } from '@core';
import type { BlueprintMemberWithUser } from '@shared';
import { mapIssuesWithMembers, type IssueViewModel } from '@tasks/shared/domain/issues.domain';

export interface TaskIssuesLoadSuccess {
  success: true;
  issues: IssueViewModel[];
  members: BlueprintMemberWithUser[];
}

export interface TaskIssuesLoadFailure {
  success: false;
  error: string;
  cause?: Error;
}

export type TaskIssuesLoadResult = TaskIssuesLoadSuccess | TaskIssuesLoadFailure;

@Injectable({
  providedIn: 'root'
})
export class TaskIssuesService {
  private readonly blueprintIssueService = inject(BlueprintIssueService);
  private readonly blueprintService = inject(BlueprintService);

  async loadByBlueprintId(blueprintId: string): Promise<TaskIssuesLoadResult> {
    if (!blueprintId) {
      return { success: false, error: '缺少藍圖識別碼' };
    }

    try {
      const [issuesResult, membersResult] = await Promise.all([
        this.blueprintIssueService.getIssues(blueprintId),
        this.blueprintService.getBlueprintMembers(blueprintId)
      ]);

      if (membersResult.error) {
        return {
          success: false,
          error: membersResult.error.message ?? '載入成員列表失敗',
          cause: membersResult.error
        };
      }

      if (issuesResult.error) {
        return {
          success: false,
          error: issuesResult.error.message ?? '載入議題列表失敗',
          cause: issuesResult.error
        };
      }

      const members = membersResult.data ?? [];
      const issues = mapIssuesWithMembers(issuesResult.data ?? [], members);

      return {
        success: true,
        issues,
        members
      };
    } catch (error) {
      const unknownError = error instanceof Error ? error : new Error('LOAD_TASK_ISSUES_FAILED');
      return {
        success: false,
        error: unknownError.message || '載入議題資料失敗',
        cause: unknownError
      };
    }
  }
}

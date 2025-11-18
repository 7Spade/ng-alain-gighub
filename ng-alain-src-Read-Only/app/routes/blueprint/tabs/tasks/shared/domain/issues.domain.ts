import type { BlueprintIssue, BlueprintMemberWithUser, User } from '@shared';

export interface IssueViewModel extends BlueprintIssue {
  assigned_user: User | null;
  reporter: User | null;
}

export type MemberMap = Map<string, BlueprintMemberWithUser>;

export function createMemberMap(members: BlueprintMemberWithUser[]): MemberMap {
  return new Map(members.map(member => [member.user_id, member]));
}

export function mapIssuesWithMembers(issues: BlueprintIssue[], members: BlueprintMemberWithUser[]): IssueViewModel[] {
  const memberMap = createMemberMap(members);

  return issues.map(issue => {
    const assignedMember = issue.assigned_to ? (memberMap.get(issue.assigned_to) ?? null) : null;
    const reporterMember = memberMap.get(issue.reporter_id) ?? null;

    return {
      ...issue,
      labels: issue.labels ?? [],
      assigned_to: issue.assigned_to ?? null,
      assigned_user: assignedMember?.user ?? null,
      reporter: reporterMember?.user ?? null
    };
  });
}

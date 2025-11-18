/**
 * Task Assignment Type Definitions
 *
 * Defines types for task assignment system:
 * - Assignee types (user, team, organization, subcontractor)
 * - Assignee interfaces
 * - Assignment metadata
 *
 * Implements Phase 3 (Task 3.2.1) from EXECUTION-PLAN-TaskTreeUI-Phases-2-8.md
 */

/**
 * Assignee type enumeration
 * Represents the different types of entities that can be assigned tasks
 */
export type AssigneeType = 'user' | 'team' | 'organization' | 'subcontractor';

/**
 * Base assignee interface
 * Contains common properties for all assignee types
 */
export interface Assignee {
  id: string;
  name: string;
  type: AssigneeType;
  avatar?: string;
  email?: string;
  description?: string;
}

/**
 * User assignee (individual person)
 */
export interface UserAssignee extends Assignee {
  type: 'user';
  email: string;
  role?: string;
  department?: string;
}

/**
 * Team assignee (group of users)
 */
export interface TeamAssignee extends Assignee {
  type: 'team';
  memberCount?: number;
  leaderId?: string;
}

/**
 * Organization assignee (external company)
 */
export interface OrganizationAssignee extends Assignee {
  type: 'organization';
  contactPerson?: string;
  contactEmail?: string;
  contractId?: string;
}

/**
 * Subcontractor assignee (external individual contractor)
 */
export interface SubcontractorAssignee extends Assignee {
  type: 'subcontractor';
  specialization?: string;
  contractId?: string;
  contactEmail?: string;
}

/**
 * Assignment change event
 * Emitted when task assignment changes
 */
export interface AssignmentChangeEvent {
  taskId: string;
  assigneeId: string | null;
  assigneeType?: AssigneeType;
}

/**
 * Assignment filter options
 */
export interface AssigneeFilter {
  search?: string;
  types?: AssigneeType[];
  blueprintId?: string;
}

/**
 * Type guard to check if assignee is a user
 */
export function isUserAssignee(assignee: Assignee): assignee is UserAssignee {
  return assignee.type === 'user';
}

/**
 * Type guard to check if assignee is a team
 */
export function isTeamAssignee(assignee: Assignee): assignee is TeamAssignee {
  return assignee.type === 'team';
}

/**
 * Type guard to check if assignee is an organization
 */
export function isOrganizationAssignee(assignee: Assignee): assignee is OrganizationAssignee {
  return assignee.type === 'organization';
}

/**
 * Type guard to check if assignee is a subcontractor
 */
export function isSubcontractorAssignee(assignee: Assignee): assignee is SubcontractorAssignee {
  return assignee.type === 'subcontractor';
}

/**
 * Get icon type for assignee type
 */
export function getAssigneeIcon(type: AssigneeType): string {
  const iconMap: Record<AssigneeType, string> = {
    user: 'user',
    team: 'team',
    organization: 'bank',
    subcontractor: 'user-switch'
  };
  return iconMap[type];
}

/**
 * Get display label for assignee type (Traditional Chinese)
 */
export function getAssigneeTypeLabel(type: AssigneeType): string {
  const labelMap: Record<AssigneeType, string> = {
    user: '使用者',
    team: '團隊',
    organization: '組織',
    subcontractor: '承攬商'
  };
  return labelMap[type];
}

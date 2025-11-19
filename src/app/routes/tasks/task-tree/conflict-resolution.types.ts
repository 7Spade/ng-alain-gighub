/**
 * Conflict Resolution Types
 *
 * Phase 5, Task 5.1: Conflict Resolution Strategy
 *
 * Defines types and interfaces for handling concurrent update conflicts
 * in the Task Tree UI with Realtime collaboration.
 *
 * Strategy: Last-Write-Wins with version tracking and user notification
 */

/**
 * Conflict resolution strategy options
 */
export type ConflictResolutionStrategy =
  | 'last-write-wins' // Latest update overwrites (default)
  | 'manual-resolve' // Show UI for user to choose
  | 'merge' // Auto-merge non-conflicting fields
  | 'reject'; // Reject concurrent update

/**
 * Conflict detection result
 */
export interface ConflictDetectionResult {
  hasConflict: boolean;
  conflictedFields: string[];
  localVersion: number;
  remoteVersion: number;
  strategy: ConflictResolutionStrategy;
}

/**
 * Conflict resolution result
 */
export interface ConflictResolutionResult {
  resolved: boolean;
  finalValue: any;
  strategy: ConflictResolutionStrategy;
  message?: string;
}

/**
 * Task with version tracking for conflict detection
 */
export interface VersionedTask {
  id: string;
  version: number;
  updated_at: string;
  data: Record<string, any>;
}

/**
 * Conflict notification payload for UI display
 */
export interface ConflictNotification {
  taskId: string;
  taskTitle: string;
  conflictedFields: string[];
  localValue: any;
  remoteValue: any;
  timestamp: Date;
  resolved: boolean;
}

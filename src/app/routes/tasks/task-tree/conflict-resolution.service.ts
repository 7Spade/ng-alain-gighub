import { Injectable, signal } from '@angular/core';
import type {
  ConflictResolutionStrategy,
  ConflictDetectionResult,
  ConflictResolutionResult,
  VersionedTask,
  ConflictNotification
} from './conflict-resolution.types';

/**
 * Conflict Resolution Service
 * 
 * Phase 5, Task 5.1: Conflict Resolution Strategy
 * 
 * Handles concurrent update conflicts in collaborative task editing:
 * - Detects version conflicts
 * - Applies resolution strategy (Last-Write-Wins by default)
 * - Notifies users of conflicts
 * - Maintains conflict history
 * 
 * Design:
 * - Signal-based reactive conflict notifications
 * - Pluggable resolution strategies
 * - Non-invasive error handling
 * - Automatic conflict logging
 * 
 * @example
 * ```typescript
 * const service = inject(ConflictResolutionService);
 * 
 * // Check for conflicts
 * const conflict = service.detectConflict(localTask, remoteTask);
 * 
 * // Resolve if needed
 * if (conflict.hasConflict) {
 *   const result = service.resolveConflict(localTask, remoteTask, conflict);
 *   console.log('Resolved:', result.finalValue);
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ConflictResolutionService {
  // Signal: Active conflicts requiring user attention
  private readonly conflictsState = signal<ConflictNotification[]>([]);
  
  // Signal: Default resolution strategy
  private readonly strategyState = signal<ConflictResolutionStrategy>('last-write-wins');
  
  // Readonly signals
  readonly conflicts = this.conflictsState.asReadonly();
  readonly strategy = this.strategyState.asReadonly();
  
  /**
   * Detect conflict between local and remote task versions
   * 
   * @param local Local task version
   * @param remote Remote task version
   * @returns Conflict detection result
   */
  detectConflict(local: VersionedTask, remote: VersionedTask): ConflictDetectionResult {
    // Same ID required
    if (local.id !== remote.id) {
      throw new Error('Cannot compare tasks with different IDs');
    }
    
    // No conflict if versions match
    if (local.version === remote.version) {
      return {
        hasConflict: false,
        conflictedFields: [],
        localVersion: local.version,
        remoteVersion: remote.version,
        strategy: this.strategy()
      };
    }
    
    // Detect which fields differ
    const conflictedFields = this.findConflictedFields(local.data, remote.data);
    
    return {
      hasConflict: conflictedFields.length > 0,
      conflictedFields,
      localVersion: local.version,
      remoteVersion: remote.version,
      strategy: this.strategy()
    };
  }
  
  /**
   * Resolve conflict using configured strategy
   * 
   * @param local Local task version
   * @param remote Remote task version
   * @param conflict Conflict detection result
   * @returns Resolution result with final value
   */
  resolveConflict(
    local: VersionedTask,
    remote: VersionedTask,
    conflict: ConflictDetectionResult
  ): ConflictResolutionResult {
    const strategy = conflict.strategy || this.strategy();
    
    switch (strategy) {
      case 'last-write-wins':
        return this.resolveLastWriteWins(local, remote);
      
      case 'merge':
        return this.resolveMerge(local, remote, conflict);
      
      case 'reject':
        return this.resolveReject(local, remote);
      
      case 'manual-resolve':
        return this.resolveManual(local, remote, conflict);
      
      default:
        console.warn(`[ConflictResolution] Unknown strategy: ${strategy}, using last-write-wins`);
        return this.resolveLastWriteWins(local, remote);
    }
  }
  
  /**
   * Add conflict notification for UI display
   * 
   * @param notification Conflict notification
   */
  notifyConflict(notification: ConflictNotification): void {
    const currentConflicts = this.conflicts();
    
    // Check if conflict already exists
    const exists = currentConflicts.some(c => 
      c.taskId === notification.taskId && 
      c.timestamp.getTime() === notification.timestamp.getTime()
    );
    
    if (!exists) {
      this.conflictsState.set([...currentConflicts, notification]);
      console.log('[ConflictResolution] Conflict notified:', notification);
    }
  }
  
  /**
   * Mark conflict as resolved
   * 
   * @param taskId Task ID
   * @param timestamp Conflict timestamp
   */
  resolveNotification(taskId: string, timestamp: Date): void {
    const updated = this.conflicts().map(c =>
      c.taskId === taskId && c.timestamp.getTime() === timestamp.getTime()
        ? { ...c, resolved: true }
        : c
    );
    this.conflictsState.set(updated);
  }
  
  /**
   * Clear all resolved conflict notifications
   */
  clearResolvedNotifications(): void {
    const unresolved = this.conflicts().filter(c => !c.resolved);
    this.conflictsState.set(unresolved);
  }
  
  /**
   * Clear all conflict notifications
   */
  clearAllNotifications(): void {
    this.conflictsState.set([]);
  }
  
  /**
   * Set conflict resolution strategy
   * 
   * @param strategy New strategy
   */
  setStrategy(strategy: ConflictResolutionStrategy): void {
    this.strategyState.set(strategy);
    console.log('[ConflictResolution] Strategy changed to:', strategy);
  }
  
  // Private resolution methods
  
  private resolveLastWriteWins(
    local: VersionedTask,
    remote: VersionedTask
  ): ConflictResolutionResult {
    // Compare timestamps - latest wins
    const localTime = new Date(local.updated_at).getTime();
    const remoteTime = new Date(remote.updated_at).getTime();
    
    const winner = remoteTime >= localTime ? remote : local;
    
    return {
      resolved: true,
      finalValue: winner.data,
      strategy: 'last-write-wins',
      message: `Used ${winner === remote ? 'remote' : 'local'} version (latest update)`
    };
  }
  
  private resolveMerge(
    local: VersionedTask,
    remote: VersionedTask,
    conflict: ConflictDetectionResult
  ): ConflictResolutionResult {
    // Merge: Use remote for conflicted fields, keep local for others
    const merged = { ...local.data };
    
    for (const field of conflict.conflictedFields) {
      // Remote takes precedence for conflicted fields
      if (field in remote.data) {
        merged[field] = remote.data[field];
      }
    }
    
    return {
      resolved: true,
      finalValue: merged,
      strategy: 'merge',
      message: `Merged: ${conflict.conflictedFields.length} fields from remote`
    };
  }
  
  private resolveReject(
    local: VersionedTask,
    remote: VersionedTask
  ): ConflictResolutionResult {
    return {
      resolved: false,
      finalValue: local.data,
      strategy: 'reject',
      message: 'Concurrent update rejected, keeping local version'
    };
  }
  
  private resolveManual(
    local: VersionedTask,
    remote: VersionedTask,
    conflict: ConflictDetectionResult
  ): ConflictResolutionResult {
    // Manual resolution requires user interaction
    // For now, create notification and fallback to last-write-wins
    this.notifyConflict({
      taskId: local.id,
      taskTitle: (local.data['title'] as string) || 'Unknown Task',
      conflictedFields: conflict.conflictedFields,
      localValue: local.data,
      remoteValue: remote.data,
      timestamp: new Date(),
      resolved: false
    });
    
    // Fallback to last-write-wins
    return this.resolveLastWriteWins(local, remote);
  }
  
  private findConflictedFields(local: Record<string, any>, remote: Record<string, any>): string[] {
    const conflicted: string[] = [];
    
    // Check all fields in local
    for (const key of Object.keys(local)) {
      if (key in remote && local[key] !== remote[key]) {
        conflicted.push(key);
      }
    }
    
    // Check fields only in remote (newly added)
    for (const key of Object.keys(remote)) {
      if (!(key in local)) {
        conflicted.push(key);
      }
    }
    
    return conflicted;
  }
}

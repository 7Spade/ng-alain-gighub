import { Injectable, inject, signal, computed } from '@angular/core';
import { ErrorStateService } from '@core';
import { BotInsert, BotUpdate, BotTaskInsert, BotTaskUpdate, Bot, BotTask, BotExecutionLog, BlueprintActivityService } from '@shared';
import { BotService, type BotDetail } from '@shared/services/bot/bot.service';

/**
 * Bot Facade
 *
 * Enterprise-grade facade for Bot management.
 * Orchestrates BotService to provide a unified interface for all bot operations.
 *
 * Design Principles:
 * - Signal-based state management (Angular 20)
 * - Facade pattern: Component → Facade → Service → Repository → Supabase
 * - Non-invasive error handling via ErrorStateService
 * - Automatic audit logging via BlueprintActivityService (if applicable)
 * - Bot management, task management, execution control, and statistics
 *
 * Key Features:
 * - Bot CRUD operations (Create, Read, Update, Delete)
 * - Bot task management
 * - Bot execution control (start, stop, restart)
 * - Execution log management
 * - Statistics and analytics
 * - Computed state for filtered views
 *
 * @example
 * ```typescript
 * const facade = inject(BotFacade);
 *
 * // Load bots
 * await facade.loadBots();
 *
 * // Access reactive state
 * effect(() => {
 *   console.log('Bots:', facade.bots());
 *   console.log('Active bots:', facade.activeBots());
 *   console.log('Stats:', facade.botStats());
 * });
 *
 * // Create bot
 * const bot = await facade.createBot({
 *   account_id: 'account-id',
 *   bot_type: 'report',
 *   config: {}
 * });
 *
 * // Start bot
 * await facade.startBot('bot-id');
 * ```
 *
 * @see docs/27-完整架構流程圖.mermaid.md
 */
@Injectable({
  providedIn: 'root'
})
export class BotFacade {
  // Inject dependencies
  private readonly botService = inject(BotService);
  private readonly activityService = inject(BlueprintActivityService);
  private readonly errorStateService = inject(ErrorStateService);

  // Signal state - Facade-specific state
  private readonly currentBotIdState = signal<string | null>(null);
  private readonly operationInProgressState = signal<boolean>(false);
  private readonly lastOperationState = signal<string | null>(null);

  // Readonly signals exposed to components
  readonly currentBotId = this.currentBotIdState.asReadonly();
  readonly operationInProgress = this.operationInProgressState.asReadonly();
  readonly lastOperation = this.lastOperationState.asReadonly();

  // Expose service signals through facade
  readonly bots = this.botService.bots;
  readonly tasks = this.botService.tasks;
  readonly executionLogs = this.botService.executionLogs;
  readonly selectedBot = this.botService.selectedBot;
  readonly loading = this.botService.loading;
  readonly error = this.botService.error;

  // Computed signals from service
  readonly activeBots = this.botService.activeBots;
  readonly pendingTasks = this.botService.pendingTasks;
  readonly runningTasks = this.botService.runningTasks;
  readonly failedTasks = this.botService.failedTasks;
  readonly recentExecutions = this.botService.recentExecutions;

  // Computed: Current bot (based on currentBotId)
  readonly currentBot = computed(() => {
    const botId = this.currentBotId();
    if (!botId) return null;
    return this.bots().find(b => b.id === botId) || null;
  });

  // Computed: Bot statistics
  readonly botStats = computed(() => {
    const allBots = this.bots();
    const allTasks = this.tasks();
    const allLogs = this.executionLogs();

    return {
      totalBots: allBots.length,
      activeBots: this.activeBots().length,
      totalTasks: allTasks.length,
      pendingTasks: this.pendingTasks().length,
      runningTasks: this.runningTasks().length,
      failedTasks: this.failedTasks().length,
      totalExecutions: allLogs.length,
      recentExecutions: this.recentExecutions().length
    };
  });

  // ============================================================================
  // Bot CRUD Operations
  // ============================================================================

  /**
   * Load all bots
   *
   * @returns Promise<void>
   */
  async loadBots(): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_bots');

    try {
      await this.botService.loadBots();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载机器人列表失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'BotFacade.loadBots'
      });
      console.error('[BotFacade] Failed to load bots:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Load bot by ID
   *
   * @param botId Bot ID
   * @returns Promise<BotDetail | null>
   */
  async loadBotById(botId: string): Promise<BotDetail | null> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_bot_by_id');
    this.currentBotIdState.set(botId);

    try {
      return await this.botService.loadBotById(botId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载机器人详情失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'BotFacade.loadBotById'
      });
      console.error('[BotFacade] Failed to load bot:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Create new bot
   *
   * @param data Bot insert data
   * @returns Promise<Bot>
   */
  async createBot(data: BotInsert): Promise<Bot> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_bot');

    try {
      const bot = await this.botService.createBot(data);

      // Log activity (if bot is associated with a blueprint)
      // Note: Bot may not always be associated with a blueprint, so this is optional
      try {
        // Only log if there's a blueprint context
        // This would need to be passed in or determined from bot config
      } catch (activityError) {
        // Non-invasive: log activity failure doesn't affect main flow
        console.warn('[BotFacade] Failed to log activity:', activityError);
      }

      return bot;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建机器人失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'BotFacade.createBot'
      });
      console.error('[BotFacade] Failed to create bot:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update bot
   *
   * @param botId Bot ID
   * @param updates Bot update data
   * @returns Promise<Bot>
   */
  async updateBot(botId: string, updates: BotUpdate): Promise<Bot> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_bot');

    try {
      const oldBot = this.bots().find(b => b.id === botId);
      const updated = await this.botService.updateBot(botId, updates);

      // Log activity
      try {
        if (oldBot) {
          const changes = this.computeChanges(oldBot, updated);
          // Only log if there's a blueprint context
        }
      } catch (activityError) {
        console.warn('[BotFacade] Failed to log activity:', activityError);
      }

      return updated;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新机器人失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'BotFacade.updateBot'
      });
      console.error('[BotFacade] Failed to update bot:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Delete bot
   *
   * @param botId Bot ID
   * @returns Promise<void>
   */
  async deleteBot(botId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('delete_bot');

    try {
      await this.botService.deleteBot(botId);

      // Clear current bot if deleted
      if (this.currentBotId() === botId) {
        this.currentBotIdState.set(null);
      }

      // Log activity
      try {
        // Only log if there's a blueprint context
      } catch (activityError) {
        console.warn('[BotFacade] Failed to log activity:', activityError);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除机器人失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'BotFacade.deleteBot'
      });
      console.error('[BotFacade] Failed to delete bot:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Bot Task Management
  // ============================================================================

  /**
   * Load tasks by bot
   *
   * @param botId Bot ID (optional, loads all if not provided)
   * @returns Promise<void>
   */
  async loadTasksByBot(botId?: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_tasks_by_bot');

    try {
      await this.botService.loadTasks(botId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载机器人任务失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'BotFacade.loadTasksByBot'
      });
      console.error('[BotFacade] Failed to load tasks:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Create bot task
   *
   * @param data Bot task insert data
   * @returns Promise<BotTask>
   */
  async createBotTask(data: BotTaskInsert): Promise<BotTask> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('create_bot_task');

    try {
      return await this.botService.createTask(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建机器人任务失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'BotFacade.createBotTask'
      });
      console.error('[BotFacade] Failed to create task:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Update bot task
   *
   * @param taskId Task ID
   * @param updates Task update data
   * @returns Promise<BotTask>
   */
  async updateBotTask(taskId: string, updates: BotTaskUpdate): Promise<BotTask> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('update_bot_task');

    try {
      return await this.botService.updateTask(taskId, updates);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新机器人任务失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'BotFacade.updateBotTask'
      });
      console.error('[BotFacade] Failed to update task:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Execute bot task
   *
   * @param taskId Task ID
   * @returns Promise<BotExecutionLog>
   */
  async executeBotTask(taskId: string): Promise<BotExecutionLog> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('execute_bot_task');

    try {
      return await this.botService.executeTask(taskId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '执行机器人任务失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'BotFacade.executeBotTask'
      });
      console.error('[BotFacade] Failed to execute task:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Bot Execution Control
  // ============================================================================

  /**
   * Start bot
   *
   * @param botId Bot ID
   * @returns Promise<void>
   */
  async startBot(botId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('start_bot');

    try {
      await this.botService.updateBot(botId, { is_enabled: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '启动机器人失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'BotFacade.startBot'
      });
      console.error('[BotFacade] Failed to start bot:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Stop bot
   *
   * @param botId Bot ID
   * @returns Promise<void>
   */
  async stopBot(botId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('stop_bot');

    try {
      await this.botService.updateBot(botId, { is_enabled: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '停止机器人失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'BotFacade.stopBot'
      });
      console.error('[BotFacade] Failed to stop bot:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Restart bot
   *
   * @param botId Bot ID
   * @returns Promise<void>
   */
  async restartBot(botId: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('restart_bot');

    try {
      await this.stopBot(botId);
      await this.startBot(botId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '重启机器人失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'BotFacade.restartBot'
      });
      console.error('[BotFacade] Failed to restart bot:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  // ============================================================================
  // Execution Log Management
  // ============================================================================

  /**
   * Load execution logs
   *
   * @param botId Bot ID (optional, loads all if not provided)
   * @returns Promise<void>
   */
  async loadExecutionLogs(botId?: string): Promise<void> {
    this.operationInProgressState.set(true);
    this.lastOperationState.set('load_execution_logs');

    try {
      await this.botService.loadExecutionLogs(botId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载执行日志失败';
      this.errorStateService.addError({
        category: 'System',
        severity: 'error',
        message: errorMessage,
        details: error,
        context: 'BotFacade.loadExecutionLogs'
      });
      console.error('[BotFacade] Failed to load execution logs:', error);
      throw error;
    } finally {
      this.operationInProgressState.set(false);
    }
  }

  /**
   * Get execution log by ID
   *
   * @param logId Log ID
   * @returns Execution log or null
   */
  getExecutionLogById(logId: string): BotExecutionLog | null {
    return this.executionLogs().find(log => log.id === logId) || null;
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Compute changes between old and new bot
   */
  private computeChanges(oldBot: Bot, newBot: Bot): Array<{ field: string; oldValue: unknown; newValue: unknown }> {
    const changes: Array<{ field: string; oldValue: unknown; newValue: unknown }> = [];

    const fieldsToCheck: Array<keyof Bot> = ['bot_type', 'is_enabled', 'config'];
    for (const field of fieldsToCheck) {
      if (oldBot[field] !== newBot[field]) {
        changes.push({
          field,
          oldValue: oldBot[field],
          newValue: newBot[field]
        });
      }
    }

    return changes;
  }
}

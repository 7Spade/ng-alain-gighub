import { Injectable, inject, signal, computed } from '@angular/core';
import { BotRepository, BotTaskRepository, BotExecutionLogRepository } from '@core';
import { Bot, BotInsert, BotUpdate, BotTask, BotTaskInsert, BotTaskUpdate, BotExecutionLog } from '@shared';
import { firstValueFrom } from 'rxjs';

/**
 * Bot Detail
 *
 * 聚合機器人相關資訊（任務、執行日誌）
 */
export interface BotDetail extends Bot {
  tasks: BotTask[];
  executionLogs: BotExecutionLog[];
  lastExecution?: BotExecutionLog;
}

/**
 * Bot Service
 *
 * 提供機器人系統相關的業務邏輯和狀態管理
 * 使用 Signals 管理狀態，暴露 ReadonlySignal 給組件
 *
 * 支援功能：
 * - 定期報表機器人
 * - 通知機器人
 * - 備份機器人
 * - 任務佇列管理
 * - 執行日誌記錄
 *
 * @example
 * ```typescript
 * const botService = inject(BotService);
 *
 * // 載入所有機器人
 * await botService.loadBots();
 *
 * // 訂閱機器人狀態
 * effect(() => {
 *   console.log('Bots:', botService.bots());
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BotService {
  private botRepository = inject(BotRepository);
  private botTaskRepository = inject(BotTaskRepository);
  private botExecutionLogRepository = inject(BotExecutionLogRepository);

  // 使用 Signals 管理狀態
  private botsState = signal<Bot[]>([]);
  private tasksState = signal<BotTask[]>([]);
  private executionLogsState = signal<BotExecutionLog[]>([]);
  private selectedBotState = signal<BotDetail | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 給組件
  readonly bots = this.botsState.asReadonly();
  readonly tasks = this.tasksState.asReadonly();
  readonly executionLogs = this.executionLogsState.asReadonly();
  readonly selectedBot = this.selectedBotState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly activeBots = computed(() => this.bots().filter(b => b.status === 'active'));

  readonly pendingTasks = computed(() => this.tasks().filter(t => t.status === 'pending'));

  readonly runningTasks = computed(() => this.tasks().filter(t => t.status === 'running'));

  readonly failedTasks = computed(() => this.tasks().filter(t => t.status === 'failed'));

  readonly recentExecutions = computed(() =>
    [...this.executionLogs()].sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()).slice(0, 20)
  );

  /**
   * 載入所有機器人
   */
  async loadBots(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = await firstValueFrom(this.botRepository.findAll());
      this.botsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入機器人失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入指定機器人的詳情
   */
  async loadBotById(botId: string): Promise<BotDetail | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const bot = await firstValueFrom(this.botRepository.findById(botId));
      if (!bot) {
        this.selectedBotState.set(null);
        return null;
      }

      // 載入關聯資料
      const [tasks, executionLogs] = await Promise.all([
        firstValueFrom(this.botTaskRepository.findByBotId(botId)),
        firstValueFrom(this.botExecutionLogRepository.findByBotId(botId))
      ]);

      // 找出最後一次執行
      const lastExecution = executionLogs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0];

      const botDetail: BotDetail = {
        ...bot,
        tasks,
        executionLogs,
        lastExecution
      };

      this.selectedBotState.set(botDetail);
      return botDetail;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入機器人詳情失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建新機器人
   */
  async createBot(data: BotInsert): Promise<Bot> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const bot = await firstValueFrom(this.botRepository.create(data));

      // 更新本地狀態
      this.botsState.update(current => [...current, bot]);

      return bot;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '創建機器人失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新機器人
   */
  async updateBot(id: string, data: BotUpdate): Promise<Bot> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updated = await firstValueFrom(this.botRepository.update(id, data));

      // 更新本地狀態
      this.botsState.update(current => current.map(b => (b.id === id ? updated : b)));

      // 如果當前選中的機器人就是這個，更新它
      if (this.selectedBotState()?.id === id) {
        this.selectedBotState.update(current => (current ? { ...current, ...updated } : null));
      }

      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新機器人失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 刪除機器人
   */
  async deleteBot(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.botRepository.delete(id));

      // 更新本地狀態
      this.botsState.update(current => current.filter(b => b.id !== id));

      // 如果刪除的是當前選中的，清空選中狀態
      if (this.selectedBotState()?.id === id) {
        this.selectedBotState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '刪除機器人失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入機器人任務列表
   */
  async loadTasks(botId?: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = botId ? await firstValueFrom(this.botTaskRepository.findByBotId(botId)) : await firstValueFrom(this.botTaskRepository.findAll());
      this.tasksState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入任務列表失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 創建機器人任務
   */
  async createTask(data: BotTaskInsert): Promise<BotTask> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const task = await firstValueFrom(this.botTaskRepository.create(data));

      // 更新本地狀態
      this.tasksState.update(current => [...current, task]);

      return task;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '創建任務失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新機器人任務
   */
  async updateTask(id: string, data: BotTaskUpdate): Promise<BotTask> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const updated = await firstValueFrom(this.botTaskRepository.update(id, data));

      // 更新本地狀態
      this.tasksState.update(current => current.map(t => (t.id === id ? updated : t)));

      return updated;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新任務失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 執行機器人任務
   */
  async executeTask(taskId: string): Promise<BotExecutionLog> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      // 更新任務狀態為 running
      await this.updateTask(taskId, { status: 'running' });

      // 創建執行日誌
      const task = this.tasks().find(t => t.id === taskId);
      if (!task) {
        throw new Error('任務不存在');
      }

      const executionLog = await firstValueFrom(
        this.botExecutionLogRepository.create({
          botId: task.botId,
          taskId: taskId,
          status: 'running',
          startedAt: new Date().toISOString()
        })
      );

      // 更新本地狀態
      this.executionLogsState.update(current => [executionLog, ...current]);

      return executionLog;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '執行任務失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 載入執行日誌
   */
  async loadExecutionLogs(botId?: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const data = botId ? await firstValueFrom(this.botExecutionLogRepository.findByBotId(botId)) : await firstValueFrom(this.botExecutionLogRepository.findAll());
      this.executionLogsState.set(data);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '載入執行日誌失敗');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 清空本地狀態
   */
  clear(): void {
    this.botsState.set([]);
    this.tasksState.set([]);
    this.executionLogsState.set([]);
    this.selectedBotState.set(null);
    this.errorState.set(null);
  }
}

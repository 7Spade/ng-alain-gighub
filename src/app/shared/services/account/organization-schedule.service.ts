import { Injectable, inject, signal, computed } from '@angular/core';
import { OrganizationScheduleRepository, OrganizationSchedule, OrganizationScheduleInsert, OrganizationScheduleUpdate } from '@core';
import { Observable, firstValueFrom } from 'rxjs';

/**
 * OrganizationSchedule Service
 *
 * 提供组织排班相关的业务逻辑和状态管理
 * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
 *
 * @example
 * ```typescript
 * const scheduleService = inject(OrganizationScheduleService);
 *
 * // 订阅排班列表
 * effect(() => {
 *   console.log('Schedules:', scheduleService.schedules());
 * });
 *
 * // 加载组织下的排班列表
 * await scheduleService.loadSchedulesByOrganizationId('org-id');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class OrganizationScheduleService {
  private scheduleRepository = inject(OrganizationScheduleRepository);

  // 使用 Signals 管理状态
  private schedulesState = signal<OrganizationSchedule[]>([]);
  private selectedScheduleState = signal<OrganizationSchedule | null>(null);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // 暴露 ReadonlySignal 给组件
  readonly schedules = this.schedulesState.asReadonly();
  readonly selectedSchedule = this.selectedScheduleState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  /**
   * 加载所有排班
   */
  async loadSchedules(): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const schedules = (await firstValueFrom(this.scheduleRepository.findAll())) as OrganizationSchedule[];
      this.schedulesState.set(schedules);
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据组织 ID 加载排班列表
   */
  async loadSchedulesByOrganizationId(organizationId: string): Promise<OrganizationSchedule[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const schedules = (await firstValueFrom(this.scheduleRepository.findByOrganizationId(organizationId))) as OrganizationSchedule[];
      this.schedulesState.set(schedules);
      return schedules;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据蓝图 ID 加载排班列表
   */
  async loadSchedulesByBlueprintId(blueprintId: string): Promise<OrganizationSchedule[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const schedules = (await firstValueFrom(this.scheduleRepository.findByBlueprintId(blueprintId))) as OrganizationSchedule[];
      return schedules;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据分支 ID 加载排班列表
   */
  async loadSchedulesByBranchId(branchId: string): Promise<OrganizationSchedule[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const schedules = (await firstValueFrom(this.scheduleRepository.findByBranchId(branchId))) as OrganizationSchedule[];
      return schedules;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据账户 ID 加载排班列表
   */
  async loadSchedulesByAccountId(accountId: string): Promise<OrganizationSchedule[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const schedules = (await firstValueFrom(this.scheduleRepository.findByAccountId(accountId))) as OrganizationSchedule[];
      return schedules;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据团队 ID 加载排班列表
   */
  async loadSchedulesByTeamId(teamId: string): Promise<OrganizationSchedule[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const schedules = (await firstValueFrom(this.scheduleRepository.findByTeamId(teamId))) as OrganizationSchedule[];
      return schedules;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据日期范围加载排班列表
   */
  async loadSchedulesByDateRange(startDate: string, endDate: string): Promise<OrganizationSchedule[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const schedules = (await firstValueFrom(this.scheduleRepository.findByDateRange(startDate, endDate))) as OrganizationSchedule[];
      return schedules;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 根据 ID 加载排班
   */
  async loadScheduleById(id: string): Promise<OrganizationSchedule | null> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const schedule = (await firstValueFrom(this.scheduleRepository.findById(id))) as OrganizationSchedule | null;
      if (schedule) {
        this.selectedScheduleState.set(schedule);
      }
      return schedule;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '加载排班失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 创建排班
   */
  async createSchedule(data: OrganizationScheduleInsert): Promise<OrganizationSchedule> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const schedule = (await firstValueFrom(this.scheduleRepository.create(data))) as OrganizationSchedule;
      // 更新本地状态
      this.schedulesState.update(schedules => [...schedules, schedule]);
      return schedule;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '创建排班失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 更新排班
   */
  async updateSchedule(id: string, data: OrganizationScheduleUpdate): Promise<OrganizationSchedule> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const schedule = (await firstValueFrom(this.scheduleRepository.update(id, data))) as OrganizationSchedule;
      // 更新本地状态
      this.schedulesState.update(schedules => schedules.map(s => (s.id === id ? schedule : s)));
      // 如果更新的是当前选中的排班，也更新选中状态
      if (this.selectedSchedule()?.id === id) {
        this.selectedScheduleState.set(schedule);
      }
      return schedule;
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '更新排班失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 删除排班
   */
  async deleteSchedule(id: string): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      await firstValueFrom(this.scheduleRepository.delete(id));
      // 更新本地状态
      this.schedulesState.update(schedules => schedules.filter(s => s.id !== id));
      // 如果删除的是当前选中的排班，清空选中状态
      if (this.selectedSchedule()?.id === id) {
        this.selectedScheduleState.set(null);
      }
    } catch (error) {
      this.errorState.set(error instanceof Error ? error.message : '删除排班失败');
      throw error;
    } finally {
      this.loadingState.set(false);
    }
  }

  /**
   * 选择排班
   */
  selectSchedule(schedule: OrganizationSchedule | null): void {
    this.selectedScheduleState.set(schedule);
  }

  /**
   * 重置状态
   */
  reset(): void {
    this.schedulesState.set([]);
    this.selectedScheduleState.set(null);
    this.errorState.set(null);
  }
}

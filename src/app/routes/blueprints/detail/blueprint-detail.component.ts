import { Component, OnInit, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlueprintStatus } from '@core';
import { SHARED_IMPORTS, BlueprintService, Blueprint } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-blueprint-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'蓝图详情'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
        @if (blueprint()) {
          <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
            <span nz-icon nzType="edit"></span>
            编辑
          </button>
          <button nz-button (click)="manageBranches()" style="margin-right: 8px;">
            <span nz-icon nzType="git-branch"></span>
            分支管理
          </button>
          <button nz-button nzDanger (click)="delete()">
            <span nz-icon nzType="delete"></span>
            删除
          </button>
        }
      </ng-template>
    </page-header>

    @if (blueprintService.loading()) {
      <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
        <ng-template #indicator>
          <span nz-icon nzType="loading" style="font-size: 24px;"></span>
        </ng-template>
      </nz-spin>
    } @else if (blueprintService.error()) {
      <nz-alert
        nzType="error"
        [nzMessage]="'加载失败'"
        [nzDescription]="blueprintService.error()"
        nzShowIcon
        style="margin: 16px;"
      ></nz-alert>
    } @else if (blueprint()) {
      <div style="padding: 16px;">
        <!-- 蓝图基本信息 -->
        <nz-card nzTitle="基本信息" style="margin-bottom: 16px;">
          <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
            <nz-descriptions-item nzTitle="ID">{{ blueprint()!.id }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="项目名称">{{ blueprint()!.name }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="项目代码">{{ blueprint()!.project_code || '-' }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="拥有者">{{ blueprint()!.owner_id }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="状态">
              @switch (blueprint()!.status) {
                @case ('planning') {
                  <nz-tag nzColor="default">规划中</nz-tag>
                }
                @case ('active') {
                  <nz-tag nzColor="success">进行中</nz-tag>
                }
                @case ('on_hold') {
                  <nz-tag nzColor="warning">暂停</nz-tag>
                }
                @case ('completed') {
                  <nz-tag nzColor="blue">已完成</nz-tag>
                }
                @case ('archived') {
                  <nz-tag nzColor="default">已归档</nz-tag>
                }
                @default {
                  <nz-tag>未知</nz-tag>
                }
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="开始日期">
              {{ blueprint()!.start_date ? (blueprint()!.start_date | date: 'yyyy-MM-dd') : '-' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="结束日期">
              {{ blueprint()!.end_date ? (blueprint()!.end_date | date: 'yyyy-MM-dd') : '-' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="创建时间">
              {{ blueprint()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="更新时间">
              {{ blueprint()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
          </nz-descriptions>
        </nz-card>

        <!-- 蓝图配置 -->
        @if (blueprintService.configs().length > 0) {
          <nz-card nzTitle="配置信息" style="margin-bottom: 16px;">
            <nz-descriptions nzBordered [nzColumn]="{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }">
              @for (config of blueprintService.configs(); track config.id) {
                <nz-descriptions-item [nzTitle]="config.config_key">
                  {{ config.config_value | json }}
                </nz-descriptions-item>
              }
            </nz-descriptions>
          </nz-card>
        }
      </div>
    } @else {
      <nz-empty nzNotFoundContent="蓝图不存在"></nz-empty>
    }
  `
})
export class BlueprintDetailComponent implements OnInit {
  blueprintService = inject(BlueprintService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  // 使用 computed 从 Service 获取蓝图信息
  blueprint = computed(() => this.blueprintService.selectedBlueprint());

  // 导出枚举供模板使用
  BlueprintStatus = BlueprintStatus;

  ngOnInit(): void {
    const blueprintId = this.route.snapshot.paramMap.get('id');
    if (blueprintId) {
      this.loadBlueprint(blueprintId);
    }
  }

  async loadBlueprint(id: string): Promise<void> {
    try {
      const blueprint = await this.blueprintService.loadBlueprintById(id);
      if (!blueprint) {
        this.message.warning('蓝图不存在');
        this.goBack();
      }
    } catch (error) {
      this.message.error('加载蓝图详情失败');
    }
  }

  goBack(): void {
    this.router.navigate(['/blueprints/list']);
  }

  edit(): void {
    if (this.blueprint()) {
      this.router.navigate(['/blueprints', this.blueprint()!.id, 'edit']);
    }
  }

  manageBranches(): void {
    if (this.blueprint()) {
      this.router.navigate(['/blueprints', this.blueprint()!.id, 'branches']);
    }
  }

  async delete(): Promise<void> {
    if (!this.blueprint()) {
      return;
    }

    if (confirm('确定要删除此蓝图吗？此操作不可恢复。')) {
      try {
        await this.blueprintService.deleteBlueprint(this.blueprint()!.id);
        this.message.success('删除成功');
        this.goBack();
      } catch (error) {
        this.message.error('删除失败');
      }
    }
  }
}

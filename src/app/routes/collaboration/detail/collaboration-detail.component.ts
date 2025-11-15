import { Component, OnInit, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaborationType, CollaborationStatus } from '@core';
import { SHARED_IMPORTS, CollaborationService, OrganizationCollaboration } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-collaboration-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'协作关系详情'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
        @if (collaboration()) {
          <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
            <span nz-icon nzType="edit"></span>
            编辑
          </button>
          <button nz-button nzDanger (click)="delete()">
            <span nz-icon nzType="delete"></span>
            删除
          </button>
        }
      </ng-template>
    </page-header>

    @if (collaborationService.loading()) {
      <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
        <ng-template #indicator>
          <span nz-icon nzType="loading" style="font-size: 24px;"></span>
        </ng-template>
      </nz-spin>
    } @else if (collaborationService.error()) {
      <nz-alert
        nzType="error"
        [nzMessage]="'加载失败'"
        [nzDescription]="collaborationService.error()"
        nzShowIcon
        style="margin: 16px;"
      ></nz-alert>
    } @else if (collaboration()) {
      <div style="padding: 16px;">
        <!-- 协作关系基本信息 -->
        <nz-card nzTitle="基本信息" style="margin-bottom: 16px;">
          <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
            <nz-descriptions-item nzTitle="ID">{{ collaboration()!.id }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="蓝图ID">{{ collaboration()!.blueprint_id }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="拥有者组织">{{ collaboration()!.owner_org_id }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="协作组织">{{ collaboration()!.collaborator_org_id }}</nz-descriptions-item>
            <nz-descriptions-item nzTitle="协作类型">
              @switch (collaboration()!.collaboration_type) {
                @case ('contractor') {
                  <nz-tag nzColor="blue">承揽商</nz-tag>
                }
                @case ('subcontractor') {
                  <nz-tag nzColor="cyan">次承揽商</nz-tag>
                }
                @case ('consultant') {
                  <nz-tag nzColor="purple">顾问</nz-tag>
                }
                @case ('partner') {
                  <nz-tag nzColor="green">合作伙伴</nz-tag>
                }
                @default {
                  <nz-tag>未知</nz-tag>
                }
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="状态">
              @switch (collaboration()!.status) {
                @case ('pending') {
                  <nz-tag nzColor="orange">待处理</nz-tag>
                }
                @case ('active') {
                  <nz-tag nzColor="success">活跃</nz-tag>
                }
                @case ('suspended') {
                  <nz-tag nzColor="warning">已暂停</nz-tag>
                }
                @case ('ended') {
                  <nz-tag nzColor="default">已结束</nz-tag>
                }
                @default {
                  <nz-tag>未知</nz-tag>
                }
              }
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="合同开始日期">
              {{ collaboration()!.contract_start_date ? (collaboration()!.contract_start_date | date: 'yyyy-MM-dd') : '-' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="合同结束日期">
              {{ collaboration()!.contract_end_date ? (collaboration()!.contract_end_date | date: 'yyyy-MM-dd') : '-' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="创建时间">
              {{ collaboration()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
            <nz-descriptions-item nzTitle="更新时间">
              {{ collaboration()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
            </nz-descriptions-item>
          </nz-descriptions>
        </nz-card>
      </div>
    } @else {
      <nz-empty nzNotFoundContent="协作关系不存在"></nz-empty>
    }
  `
})
export class CollaborationDetailComponent implements OnInit {
  collaborationService = inject(CollaborationService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  // 使用 computed 从 Service 获取协作关系信息
  collaboration = computed(() => this.collaborationService.selectedCollaboration());

  // 导出枚举供模板使用
  CollaborationType = CollaborationType;
  CollaborationStatus = CollaborationStatus;

  ngOnInit(): void {
    const collaborationId = this.route.snapshot.paramMap.get('id');
    if (collaborationId) {
      this.loadCollaboration(collaborationId);
    }
  }

  async loadCollaboration(id: string): Promise<void> {
    try {
      const collaboration = await this.collaborationService.loadCollaborationById(id);
      if (!collaboration) {
        this.message.warning('协作关系不存在');
        this.goBack();
      }
    } catch (error) {
      this.message.error('加载协作关系详情失败');
    }
  }

  goBack(): void {
    this.router.navigate(['/collaboration/list']);
  }

  edit(): void {
    if (this.collaboration()) {
      this.router.navigate(['/collaboration', this.collaboration()!.id, 'edit']);
    }
  }

  async delete(): Promise<void> {
    if (!this.collaboration()) {
      return;
    }

    if (confirm('确定要删除此协作关系吗？此操作不可恢复。')) {
      try {
        await this.collaborationService.deleteCollaboration(this.collaboration()!.id);
        this.message.success('删除成功');
        this.goBack();
      } catch (error) {
        this.message.error('删除失败');
      }
    }
  }
}

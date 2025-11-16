import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { InspectionRepository, Inspection } from '@core';
import { SHARED_IMPORTS } from '@shared';
import { firstValueFrom } from 'rxjs';

export interface InspectionDetailData {
  inspectionId: string;
}

@Component({
  selector: 'app-inspection-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    @if (loading()) {
      <div style="text-align: center; padding: 40px;">
        <nz-spin nzSize="large"></nz-spin>
      </div>
    } @else if (inspection()) {
      <nz-descriptions nzBordered [nzColumn]="2">
        <nz-descriptions-item nzTitle="验收ID" [nzSpan]="2">{{ inspection()!.id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="任务ID" [nzSpan]="2">{{ inspection()!.task_id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="验收类型" [nzSpan]="1">
          @switch (inspection()!.inspection_type) {
            @case ('preliminary') {
              <nz-tag nzColor="blue">初步验收</nz-tag>
            }
            @case ('final') {
              <nz-tag nzColor="purple">最终验收</nz-tag>
            }
            @case ('warranty') {
              <nz-tag nzColor="orange">保修验收</nz-tag>
            }
            @case ('handover') {
              <nz-tag nzColor="cyan">移交验收</nz-tag>
            }
            @default {
              <nz-tag>{{ inspection()!.inspection_type }}</nz-tag>
            }
          }
        </nz-descriptions-item>
        <nz-descriptions-item nzTitle="状态" [nzSpan]="1">
          @switch (inspection()!.status) {
            @case ('pending') {
              <nz-tag nzColor="default">待验收</nz-tag>
            }
            @case ('in_progress') {
              <nz-tag nzColor="blue">验收中</nz-tag>
            }
            @case ('accepted') {
              <nz-tag nzColor="green">已接受</nz-tag>
            }
            @case ('rejected') {
              <nz-tag nzColor="red">已拒绝</nz-tag>
            }
            @case ('conditional_accept') {
              <nz-tag nzColor="orange">有条件接受</nz-tag>
            }
            @default {
              <nz-tag>{{ inspection()!.status }}</nz-tag>
            }
          }
        </nz-descriptions-item>
        <nz-descriptions-item nzTitle="验收项目" [nzSpan]="2">
          @if (inspectionItemsArray().length > 0) {
            <ul style="margin: 0; padding-left: 20px;">
              @for (item of inspectionItemsArray(); track $index) {
                <li>{{ item }}</li>
              }
            </ul>
          } @else {
            <span>无</span>
          }
        </nz-descriptions-item>
        @if (defectsArray().length > 0) {
          <nz-descriptions-item nzTitle="发现缺陷" [nzSpan]="2">
            <ul style="margin: 0; padding-left: 20px;">
              @for (defect of defectsArray(); track $index) {
                <li style="color: #ff4d4f;">{{ defect }}</li>
              }
            </ul>
          </nz-descriptions-item>
        }
        @if (inspection()!.acceptance_criteria) {
          <nz-descriptions-item nzTitle="验收标准" [nzSpan]="2">
            <pre style="white-space: pre-wrap; margin: 0;">{{ inspection()!.acceptance_criteria }}</pre>
          </nz-descriptions-item>
        }
        @if (inspection()!.findings) {
          <nz-descriptions-item nzTitle="验收发现" [nzSpan]="2">
            <pre style="white-space: pre-wrap; margin: 0;">{{ inspection()!.findings }}</pre>
          </nz-descriptions-item>
        }
        @if (inspection()!.corrective_actions) {
          <nz-descriptions-item nzTitle="纠正措施" [nzSpan]="2">
            <pre style="white-space: pre-wrap; margin: 0;">{{ inspection()!.corrective_actions }}</pre>
          </nz-descriptions-item>
        }
        <nz-descriptions-item nzTitle="责任转移" [nzSpan]="1">
          @if (inspection()!.responsibility_transferred) {
            <nz-tag nzColor="green">已转移</nz-tag>
          } @else {
            <nz-tag nzColor="default">未转移</nz-tag>
          }
        </nz-descriptions-item>
        @if (inspection()!.transfer_date) {
          <nz-descriptions-item nzTitle="转移日期" [nzSpan]="1">
            {{ inspection()!.transfer_date }}
          </nz-descriptions-item>
        }
        <nz-descriptions-item nzTitle="验收人ID" [nzSpan]="1">{{ inspection()!.inspector_id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="验收时间" [nzSpan]="1">
          {{ inspection()!.inspected_at | date:'yyyy-MM-dd HH:mm:ss' }}
        </nz-descriptions-item>
        @if (inspection()!.completed_at) {
          <nz-descriptions-item nzTitle="完成时间" [nzSpan]="2">
            {{ inspection()!.completed_at | date:'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
        }
      </nz-descriptions>
      
      <div style="margin-top: 16px; text-align: right;">
        <button nz-button nzType="default" (click)="close()">关闭</button>
      </div>
    } @else {
      <nz-empty nzNotFoundContent="验收记录不存在"></nz-empty>
    }
  `
})
export class InspectionDetailComponent implements OnInit {
  private modalRef = inject(NzModalRef);
  private inspectionRepo = inject(InspectionRepository);
  
  readonly data: InspectionDetailData = inject(NZ_MODAL_DATA);
  readonly loading = signal(false);
  readonly inspection = signal<Inspection | null>(null);
  
  readonly inspectionItemsArray = computed(() => {
    const insp = this.inspection();
    if (!insp || !insp.inspection_items) return [];
    
    if (Array.isArray(insp.inspection_items)) {
      return insp.inspection_items as string[];
    } else if (typeof insp.inspection_items === 'object') {
      return Object.values(insp.inspection_items).filter((v): v is string => typeof v === 'string');
    }
    return [];
  });

  readonly defectsArray = computed(() => {
    const insp = this.inspection();
    if (!insp || !insp.defects_found) return [];
    
    if (Array.isArray(insp.defects_found)) {
      return insp.defects_found as string[];
    } else if (typeof insp.defects_found === 'object') {
      return Object.values(insp.defects_found).filter((v): v is string => typeof v === 'string');
    }
    return [];
  });

  async ngOnInit(): Promise<void> {
    await this.loadInspection();
  }

  async loadInspection(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.inspectionRepo.findById(this.data.inspectionId));
      this.inspection.set(result);
    } catch (error) {
      console.error('加载验收记录详情失败:', error);
      this.inspection.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  close(): void {
    this.modalRef.close();
  }
}

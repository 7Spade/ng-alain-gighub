import { Component, inject, signal, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { QualityCheckRepository, QualityCheck } from '@core';
import { SHARED_IMPORTS } from '@shared';
import { firstValueFrom } from 'rxjs';

export interface QualityCheckDetailData {
  checkId: string;
}

@Component({
  selector: 'app-quality-check-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    @if (loading()) {
      <div style="text-align: center; padding: 40px;">
        <nz-spin nzSize="large"></nz-spin>
      </div>
    } @else if (check()) {
      <nz-descriptions nzBordered [nzColumn]="2">
        <nz-descriptions-item nzTitle="检查ID" [nzSpan]="2">{{ check()!.id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="任务ID" [nzSpan]="2">{{ check()!.task_id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="检查类型" [nzSpan]="1">
          @switch (check()!.check_type) {
            @case ('routine') {
              <nz-tag nzColor="blue">常规检查</nz-tag>
            }
            @case ('milestone') {
              <nz-tag nzColor="orange">里程碑检查</nz-tag>
            }
            @case ('final') {
              <nz-tag nzColor="purple">最终检查</nz-tag>
            }
            @case ('spot_check') {
              <nz-tag nzColor="cyan">抽查</nz-tag>
            }
            @default {
              <nz-tag>{{ check()!.check_type }}</nz-tag>
            }
          }
        </nz-descriptions-item>
        <nz-descriptions-item nzTitle="状态" [nzSpan]="1">
          @switch (check()!.status) {
            @case ('pending') {
              <nz-tag nzColor="default">待检查</nz-tag>
            }
            @case ('in_progress') {
              <nz-tag nzColor="blue">检查中</nz-tag>
            }
            @case ('passed') {
              <nz-tag nzColor="green">通过</nz-tag>
            }
            @case ('failed') {
              <nz-tag nzColor="red">不通过</nz-tag>
            }
            @case ('conditional_pass') {
              <nz-tag nzColor="orange">有条件通过</nz-tag>
            }
            @default {
              <nz-tag>{{ check()!.status }}</nz-tag>
            }
          }
        </nz-descriptions-item>
        <nz-descriptions-item nzTitle="检查项目" [nzSpan]="2">
          @if (checkItemsArray().length > 0) {
            <ul style="margin: 0; padding-left: 20px;">
              @for (item of checkItemsArray(); track $index) {
                <li>{{ item }}</li>
              }
            </ul>
          } @else {
            <span>无</span>
          }
        </nz-descriptions-item>
        @if (check()!.findings) {
          <nz-descriptions-item nzTitle="检查发现" [nzSpan]="2">
            <pre style="white-space: pre-wrap; margin: 0;">{{ check()!.findings }}</pre>
          </nz-descriptions-item>
        }
        @if (check()!.recommendations) {
          <nz-descriptions-item nzTitle="建议" [nzSpan]="2">
            <pre style="white-space: pre-wrap; margin: 0;">{{ check()!.recommendations }}</pre>
          </nz-descriptions-item>
        }
        <nz-descriptions-item nzTitle="检查员ID" [nzSpan]="1">{{ check()!.inspector_id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="检查时间" [nzSpan]="1">
          {{ check()!.checked_at | date:'yyyy-MM-dd HH:mm:ss' }}
        </nz-descriptions-item>
        @if (check()!.completed_at) {
          <nz-descriptions-item nzTitle="完成时间" [nzSpan]="2">
            {{ check()!.completed_at | date:'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
        }
      </nz-descriptions>
      
      <div style="margin-top: 16px; text-align: right;">
        <button nz-button nzType="default" (click)="close()">关闭</button>
      </div>
    } @else {
      <nz-empty nzNotFoundContent="品质检查不存在"></nz-empty>
    }
  `
})
export class QualityCheckDetailComponent implements OnInit {
  private modalRef = inject(NzModalRef);
  private qualityCheckRepo = inject(QualityCheckRepository);
  
  readonly data: QualityCheckDetailData = inject(NZ_MODAL_DATA);
  readonly loading = signal(false);
  readonly check = signal<QualityCheck | null>(null);
  
  readonly checkItemsArray = signal<string[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadCheck();
  }

  async loadCheck(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await firstValueFrom(this.qualityCheckRepo.findById(this.data.checkId));
      this.check.set(result);
      
      // Parse check_items
      if (result && result.check_items) {
        if (Array.isArray(result.check_items)) {
          this.checkItemsArray.set(result.check_items as string[]);
        } else if (typeof result.check_items === 'object') {
          // If it's an object, try to extract items
          this.checkItemsArray.set(Object.values(result.check_items).filter((v): v is string => typeof v === 'string'));
        }
      }
    } catch (error) {
      console.error('加载品质检查详情失败:', error);
      this.check.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  close(): void {
    this.modalRef.close();
  }
}

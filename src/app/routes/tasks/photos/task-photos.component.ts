import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ReportPhotoRepository, DailyReportRepository, WorkspaceContextFacade } from '@core';
import { SHARED_IMPORTS, TaskService, Task, ReportPhoto, BlueprintService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { firstValueFrom } from 'rxjs';

import { PhotoUploadComponent } from './photo-upload.component';
import { PhotoViewerComponent } from './photo-viewer.component';

@Component({
  selector: 'app-task-photos',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header [title]="'施工照片'">
      <ng-template #extra>
        <nz-select
          [ngModel]="selectedBlueprintId()"
          (ngModelChange)="selectedBlueprintId.set($event); onBlueprintChange()"
          nzPlaceHolder="请选择蓝图"
          style="width: 300px; margin-right: 8px;"
        >
          @for (blueprint of blueprintService.blueprints(); track blueprint.id) {
            <nz-option [nzValue]="blueprint.id" [nzLabel]="blueprint.name"></nz-option>
          }
        </nz-select>
        <button nz-button nzType="primary" (click)="uploadPhoto()">
          <span nz-icon nzType="upload"></span>
          上传照片
        </button>
      </ng-template>
    </page-header>

    <nz-card style="margin-top: 16px;">
      @if (!selectedBlueprintId()) {
        <nz-empty nzNotFoundContent="请先选择蓝图"></nz-empty>
      } @else if (loading()) {
        <div style="text-align: center; padding: 40px;">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else if (photos().length === 0) {
        <nz-empty nzNotFoundContent="暂无照片"></nz-empty>
      } @else {
        <nz-spin [nzSpinning]="loading()">
          <div nz-row [nzGutter]="[16, 16]">
            @for (photo of photos(); track photo.id) {
              <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6" [nzXl]="4">
                <nz-card [nzHoverable]="true" [nzCover]="cover" style="cursor: pointer;" (click)="viewPhoto(photo)">
                  <ng-template #cover>
                    @if (photo.document_id) {
                      <img
                        [src]="getPhotoUrl(photo.document_id)"
                        [alt]="photo.caption || '施工照片'"
                        style="width: 100%; height: 200px; object-fit: cover;"
                      />
                    } @else {
                      <div
                        style="width: 100%; height: 200px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;"
                      >
                        <span nz-icon nzType="picture" nzTheme="outline" style="font-size: 48px; color: #ccc;"></span>
                      </div>
                    }
                  </ng-template>
                  <nz-card-meta [nzTitle]="photo.caption || '无标题'" [nzDescription]="photo.photo_type"></nz-card-meta>
                  <div style="margin-top: 8px; font-size: 12px; color: #999;">
                    {{ photo.uploaded_at | date: 'yyyy-MM-dd HH:mm' }}
                  </div>
                </nz-card>
              </div>
            }
          </div>
        </nz-spin>
      }
    </nz-card>
  `
})
export class TaskPhotosComponent implements OnInit {
  readonly taskService = inject(TaskService);
  readonly blueprintService = inject(BlueprintService);
  private readonly reportPhotoRepository = inject(ReportPhotoRepository);
  private readonly dailyReportRepository = inject(DailyReportRepository);
  private readonly contextFacade = inject(WorkspaceContextFacade);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);

  readonly selectedBlueprintId = signal<string | null>(null);
  readonly loading = signal<boolean>(false);
  readonly photos = signal<ReportPhoto[]>([]);
  readonly isUserContext = computed(() => this.contextFacade.contextType() === 'user');

  ngOnInit(): void {
    this.loadBlueprints();
  }

  async loadBlueprints(): Promise<void> {
    try {
      await this.blueprintService.loadBlueprints();
    } catch (error) {
      this.message.error('加载蓝图列表失败');
    }
  }

  async onBlueprintChange(): Promise<void> {
    const blueprintId = this.selectedBlueprintId();
    if (!blueprintId) return;

    this.loading.set(true);
    try {
      // 先加载任务列表
      await this.taskService.loadTasksByBlueprint(blueprintId);

      // 然后加载所有任务的施工日志
      const tasks = this.taskService.tasks();
      const reportPromises = tasks.map(task => firstValueFrom(this.dailyReportRepository.findByTaskId(task.id)));
      const reportArrays = await Promise.all(reportPromises);
      const allReports = reportArrays.flat();

      // 加载所有报告的照片
      const photoPromises = allReports.map(report => firstValueFrom(this.reportPhotoRepository.findByReportId(report.id)));
      const photoArrays = await Promise.all(photoPromises);
      const allPhotos = photoArrays.flat();

      this.photos.set(allPhotos);
    } catch (error) {
      this.message.error('加载施工照片失败');
    } finally {
      this.loading.set(false);
    }
  }

  async uploadPhoto(): Promise<void> {
    const blueprintId = this.selectedBlueprintId();
    if (!blueprintId) {
      this.message.warning('请先选择蓝图');
      return;
    }

    const tasks = this.taskService.tasks();
    if (tasks.length === 0) {
      this.message.warning('当前蓝图没有任务，请先创建任务');
      return;
    }

    // 简化处理：需要先有日志才能上传照片
    const reports = await firstValueFrom(this.dailyReportRepository.findByBlueprintId(blueprintId));
    if (reports.length === 0) {
      this.message.warning('请先创建施工日志，然后才能上传照片');
      return;
    }

    const modalRef = this.modal.create({
      nzTitle: '上传施工照片',
      nzContent: PhotoUploadComponent,
      nzData: {
        reportId: reports[0].id, // 使用第一个报告，实际应该让用户选择
        reportType: 'daily'
      },
      nzWidth: 600,
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result) {
        // 刷新列表
        this.onBlueprintChange();
      }
    });
  }

  getPhotoUrl(documentId: string): string {
    // TODO: 从文档服务获取图片URL
    return `/api/documents/${documentId}/download`;
  }

  viewPhoto(photo: ReportPhoto): void {
    this.modal.create({
      nzTitle: '查看照片',
      nzContent: PhotoViewerComponent,
      nzData: {
        photo,
        photoUrl: this.getPhotoUrl(photo.document_id)
      },
      nzWidth: 900,
      nzFooter: null
    });
  }
}

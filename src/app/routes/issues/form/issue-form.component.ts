import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <page-header [title]="isEdit ? '编辑问题' : '新建问题'">
      <ng-template #extra>
        <button nz-button nzType="default" (click)="cancel()" style="margin-right: 8px;">
          <span nz-icon nzType="close"></span>
          取消
        </button>
        <button nz-button nzType="primary" (click)="save()" [nzLoading]="saving()">
          <span nz-icon nzType="save"></span>
          保存
        </button>
      </ng-template>
    </page-header>

    <nz-card nzTitle="问题表单" style="margin-top: 16px;">
      <form nz-form [formGroup]="issueForm" nzLayout="vertical">
        <nz-form-item>
          <nz-form-label nzRequired>标题</nz-form-label>
          <nz-form-control [nzErrorTip]="'请输入问题标题'">
            <input nz-input formControlName="title" placeholder="请输入问题标题" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>描述</nz-form-label>
          <nz-form-control [nzErrorTip]="'请输入问题描述'">
            <textarea nz-input formControlName="description" rows="4" placeholder="请输入问题详细描述"></textarea>
          </nz-form-control>
        </nz-form-item>

        <nz-row [nzGutter]="16">
          <nz-col [nzXs]="24" [nzSm]="12">
            <nz-form-item>
              <nz-form-label nzRequired>优先级</nz-form-label>
              <nz-form-control [nzErrorTip]="'请选择优先级'">
                <nz-select formControlName="priority" nzPlaceHolder="请选择优先级">
                  <nz-option nzValue="low" nzLabel="低"></nz-option>
                  <nz-option nzValue="medium" nzLabel="中"></nz-option>
                  <nz-option nzValue="high" nzLabel="高"></nz-option>
                  <nz-option nzValue="critical" nzLabel="紧急"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </nz-col>

          <nz-col [nzXs]="24" [nzSm]="12">
            <nz-form-item>
              <nz-form-label nzRequired>严重程度</nz-form-label>
              <nz-form-control [nzErrorTip]="'请选择严重程度'">
                <nz-select formControlName="severity" nzPlaceHolder="请选择严重程度">
                  <nz-option nzValue="minor" nzLabel="轻微"></nz-option>
                  <nz-option nzValue="moderate" nzLabel="中等"></nz-option>
                  <nz-option nzValue="major" nzLabel="严重"></nz-option>
                  <nz-option nzValue="critical" nzLabel="紧急"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </nz-col>
        </nz-row>

        <nz-row [nzGutter]="16">
          <nz-col [nzXs]="24" [nzSm]="12">
            <nz-form-item>
              <nz-form-label>关联蓝图</nz-form-label>
              <nz-form-control>
                <nz-select formControlName="blueprintId" nzPlaceHolder="请选择蓝图" nzAllowClear>
                  <!-- TODO: 加载蓝图列表 -->
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </nz-col>

          <nz-col [nzXs]="24" [nzSm]="12">
            <nz-form-item>
              <nz-form-label>关联任务</nz-form-label>
              <nz-form-control>
                <nz-select formControlName="taskId" nzPlaceHolder="请选择任务" nzAllowClear>
                  <!-- TODO: 加载任务列表 -->
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </nz-col>
        </nz-row>

        <nz-form-item>
          <nz-form-label>问题类型</nz-form-label>
          <nz-form-control>
            <nz-select formControlName="issueType" nzPlaceHolder="请选择问题类型" nzAllowClear>
              <nz-option nzValue="bug" nzLabel="Bug"></nz-option>
              <nz-option nzValue="feature" nzLabel="功能需求"></nz-option>
              <nz-option nzValue="improvement" nzLabel="改进建议"></nz-option>
              <nz-option nzValue="question" nzLabel="问题咨询"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>
  `
})
export class IssueFormComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);
  fb = inject(FormBuilder);

  isEdit = false;
  issueId = '';
  saving = signal(false);

  issueForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    priority: ['medium', [Validators.required]],
    severity: ['moderate', [Validators.required]],
    blueprintId: [null],
    taskId: [null],
    issueType: [null]
  });

  ngOnInit(): void {
    this.issueId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.issueId;
    if (this.isEdit) {
      this.loadIssue();
    }
  }

  loadIssue(): void {
    // TODO: 加载问题数据
    // 暂时使用空表单，实际开发时连接真实数据
  }

  save(): void {
    if (this.issueForm.invalid) {
      Object.values(this.issueForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.error('请填写完整的表单信息');
      return;
    }

    this.saving.set(true);
    // TODO: 实现保存逻辑
    setTimeout(() => {
      this.saving.set(false);
      this.message.success(this.isEdit ? '问题更新成功' : '问题创建成功');
      this.router.navigate(['/issues']);
    }, 1000);
  }

  cancel(): void {
    this.router.navigate(['/issues']);
  }
}

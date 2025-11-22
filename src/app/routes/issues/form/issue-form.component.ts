import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueFacade } from '@core';
import { SHARED_IMPORTS, BlueprintService, TaskService } from '@shared';
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
                  @for (blueprint of blueprints(); track blueprint.id) {
                    <nz-option [nzValue]="blueprint.id" [nzLabel]="blueprint.name"></nz-option>
                  }
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </nz-col>

          <nz-col [nzXs]="24" [nzSm]="12">
            <nz-form-item>
              <nz-form-label>关联任务</nz-form-label>
              <nz-form-control>
                <nz-select formControlName="taskId" nzPlaceHolder="请选择任务" nzAllowClear>
                  @for (task of tasks(); track task.id) {
                    <nz-option [nzValue]="task.id" [nzLabel]="task.title"></nz-option>
                  }
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
  issueFacade = inject(IssueFacade);
  blueprintService = inject(BlueprintService);
  taskService = inject(TaskService);

  isEdit = false;
  issueId = '';
  saving = signal(false);
  loading = signal(false);

  // Options for dropdowns
  blueprints = signal<any[]>([]);
  tasks = signal<any[]>([]);

  issueForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    priority: ['medium', [Validators.required]],
    severity: ['moderate', [Validators.required]],
    blueprintId: [null],
    taskId: [null],
    issueType: [null]
  });

  async ngOnInit(): Promise<void> {
    this.issueId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.issueId;

    // Load dropdown options
    await this.loadBlueprintList();
    await this.loadTaskList();

    if (this.isEdit) {
      await this.loadIssue();
    }
  }

  async loadIssue(): Promise<void> {
    this.loading.set(true);
    try {
      const issue = await this.issueFacade.loadIssueById(this.issueId);
      if (issue) {
        this.issueForm.patchValue({
          title: issue.title,
          description: issue.description,
          priority: issue.priority,
          severity: issue.severity,
          blueprintId: issue.blueprint_id,
          taskId: issue.task_id,
          issueType: issue.issue_type
        });
      }
    } catch (error) {
      this.message.error('加載問題數據失敗');
      console.error('Failed to load issue:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async loadBlueprintList(): Promise<void> {
    try {
      // Load all blueprints for the dropdown
      await this.blueprintService.loadAllBlueprints();
      this.blueprints.set(this.blueprintService.blueprints());
    } catch (error) {
      console.error('Failed to load blueprints:', error);
    }
  }

  async loadTaskList(): Promise<void> {
    try {
      // Load all tasks for the dropdown
      await this.taskService.loadAllTasks();
      this.tasks.set(this.taskService.tasks());
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  }

  async save(): Promise<void> {
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
    try {
      const formValue = this.issueForm.value;

      if (this.isEdit) {
        // Update existing issue
        await this.issueFacade.updateIssue(this.issueId, {
          title: formValue.title,
          description: formValue.description,
          priority: formValue.priority,
          severity: formValue.severity,
          blueprint_id: formValue.blueprintId,
          task_id: formValue.taskId,
          issue_type: formValue.issueType
        });
        this.message.success('问题更新成功');
      } else {
        // Create new issue
        await this.issueFacade.createIssue({
          title: formValue.title,
          description: formValue.description,
          priority: formValue.priority,
          severity: formValue.severity,
          blueprint_id: formValue.blueprintId,
          task_id: formValue.taskId,
          issue_type: formValue.issueType,
          status: 'open',
          reported_at: new Date().toISOString()
        });
        this.message.success('问题创建成功');
      }

      this.router.navigate(['/issues']);
    } catch (error) {
      this.message.error(this.isEdit ? '问题更新失败' : '问题创建失败');
      console.error('Failed to save issue:', error);
    } finally {
      this.saving.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['/issues']);
  }
}

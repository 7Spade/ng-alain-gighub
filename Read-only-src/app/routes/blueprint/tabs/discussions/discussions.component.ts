import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

import type { BlueprintDiscussion } from '../shared/state/blueprint-discussion.facade';
import { BlueprintDiscussionFacade } from '../shared/state/blueprint-discussion.facade';

@Component({
  selector: 'app-blueprint-discussions',
  standalone: true,
  templateUrl: './discussions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class BlueprintDiscussionsComponent {
  private readonly msg = inject(NzMessageService);
  private readonly fb = inject(FormBuilder);
  private readonly discussionsFacade = inject(BlueprintDiscussionFacade);

  readonly loading = this.discussionsFacade.loading;
  readonly blueprint = this.discussionsFacade.blueprint;
  readonly blueprintId = this.discussionsFacade.blueprintId;
  readonly discussions = this.discussionsFacade.discussions;
  readonly filteredDiscussions = this.discussionsFacade.filteredDiscussions;
  readonly searchText = this.discussionsFacade.searchText;

  discussionForm!: FormGroup;
  readonly showDiscussionModal = signal(false);
  readonly editingDiscussion = signal<BlueprintDiscussion | null>(null);

  constructor() {
    this.initForm();
  }

  // ========== 私有方法 ==========
  private initForm(): void {
    this.discussionForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', [Validators.required]],
      tags: [[]]
    });
  }

  // ========== 公開方法 ==========
  openCreateDiscussionModal(): void {
    this.editingDiscussion.set(null);
    this.discussionForm.reset({
      title: '',
      content: '',
      tags: []
    });
    this.showDiscussionModal.set(true);
  }

  onSearch(): void {
    // filteredDiscussions computed 會自動響應 searchText 變化
  }

  onSearchChange(value: string): void {
    this.discussionsFacade.setSearch(value);
  }

  async onCreateSubmit(): Promise<void> {
    if (this.discussionForm.invalid) {
      Object.values(this.discussionForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const blueprint = this.blueprint();
    if (!blueprint) {
      this.msg.error('無法獲取藍圖資訊');
      return;
    }

    const userId = await this.discussionsFacade.getCurrentUserId();
    if (!userId) {
      this.msg.error('請先登入');
      return;
    }

    try {
      const formValue = this.discussionForm.value;
      const editing = this.editingDiscussion();

      if (editing) {
        const success = await this.discussionsFacade.updateDiscussion(editing.id, {
          blueprintId: blueprint.id,
          title: formValue.title,
          content: formValue.content,
          tags: formValue.tags || []
        });

        if (!success) {
          return;
        }

        this.msg.success('討論已更新');
      } else {
        const success = await this.discussionsFacade.createDiscussion({
          blueprintId: blueprint.id,
          authorId: userId,
          title: formValue.title,
          content: formValue.content,
          tags: formValue.tags || []
        });

        if (!success) {
          return;
        }

        this.msg.success('討論已創建');
      }

      this.showDiscussionModal.set(false);
      this.discussionForm.reset();
      this.editingDiscussion.set(null);
    } catch (error) {
      this.msg.error('處理討論時發生錯誤');
      console.error('Failed to save discussion:', error);
    }
  }

  onCancel(): void {
    this.showDiscussionModal.set(false);
    this.discussionForm.reset();
  }
}

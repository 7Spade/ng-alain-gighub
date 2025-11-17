import { Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzModalService } from 'ng-zorro-antd/modal';

export interface ConfirmationConfig {
  title?: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'default' | 'dashed';
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

/**
 * 確認對話框服務
 *
 * 用途：統一的確認對話框服務
 *
 * @example
 * ```typescript
 * constructor(private confirmService: ConfirmationDialogService) {}
 *
 * handleDelete() {
 *   this.confirmService.confirm({
 *     title: '確認刪除',
 *     content: '確定要刪除此項目嗎？',
 *     okType: 'danger',
 *     onOk: () => this.deleteItem()
 *   });
 * }
 * ```
 */
@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: ''
})
export class ConfirmationDialogService {
  private modal = inject(NzModalService);

  /**
   * 顯示確認對話框
   */
  confirm(config: ConfirmationConfig): void {
    this.modal.confirm({
      nzTitle: config.title || '確認操作',
      nzContent: config.content || '確定要執行此操作嗎？',
      nzOkText: config.okText || '確定',
      nzCancelText: config.cancelText || '取消',
      nzOkType: config.okType || 'primary',
      nzOnOk: config.onOk,
      nzOnCancel: config.onCancel
    });
  }

  /**
   * 顯示刪除確認對話框
   */
  confirmDelete(config: Omit<ConfirmationConfig, 'okType'> & { itemName?: string }): void {
    this.modal.confirm({
      nzTitle: config.title || '確認刪除',
      nzContent: config.content || `確定要刪除${config.itemName || '此項目'}嗎？此操作無法復原。`,
      nzOkText: config.okText || '刪除',
      nzCancelText: config.cancelText || '取消',
      nzOkDanger: true,
      nzOnOk: config.onOk,
      nzOnCancel: config.onCancel
    });
  }

  /**
   * 顯示警告對話框
   */
  warning(config: ConfirmationConfig): void {
    this.modal.warning({
      nzTitle: config.title || '警告',
      nzContent: config.content || '',
      nzOkText: config.okText || '確定',
      nzOnOk: config.onOk
    });
  }

  /**
   * 顯示成功對話框
   */
  success(config: Omit<ConfirmationConfig, 'cancelText' | 'onCancel'>): void {
    this.modal.success({
      nzTitle: config.title || '成功',
      nzContent: config.content || '操作已成功完成',
      nzOkText: config.okText || '確定',
      nzOnOk: config.onOk
    });
  }

  /**
   * 顯示錯誤對話框
   */
  error(config: Omit<ConfirmationConfig, 'cancelText' | 'onCancel'>): void {
    this.modal.error({
      nzTitle: config.title || '錯誤',
      nzContent: config.content || '操作失敗',
      nzOkText: config.okText || '確定',
      nzOnOk: config.onOk
    });
  }

  /**
   * 顯示資訊對話框
   */
  info(config: Omit<ConfirmationConfig, 'cancelText' | 'onCancel'>): void {
    this.modal.info({
      nzTitle: config.title || '提示',
      nzContent: config.content || '',
      nzOkText: config.okText || '確定',
      nzOnOk: config.onOk
    });
  }
}

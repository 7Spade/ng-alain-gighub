import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { SHARED_IMPORTS } from '@shared';

/**
 * 表單錯誤顯示元件
 * 
 * 用途：統一顯示表單驗證錯誤訊息
 * 
 * @example
 * ```html
 * <app-form-error [errors]="control.errors" />
 * ```
 */
@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (errors()) {
      <div class="form-error">
        @for (error of errorMessages(); track error.key) {
          <small class="text-danger">{{ error.message }}</small>
        }
      </div>
    }
  `,
  styles: [`
    .form-error {
      margin-top: 4px;
      
      small {
        display: block;
        line-height: 1.5;
      }
    }
  `]
})
export class FormErrorComponent {
  /** 驗證錯誤物件 */
  errors = input<ValidationErrors | null>(null);

  /** 轉換錯誤為可顯示的訊息陣列 */
  errorMessages = () => {
    const errors = this.errors();
    if (!errors) return [];

    return Object.keys(errors).map(key => ({
      key,
      message: this.getErrorMessage(key, errors[key])
    }));
  };

  /**
   * 根據錯誤類型生成錯誤訊息
   */
  private getErrorMessage(errorKey: string, errorValue: any): string {
    const messages: Record<string, string> = {
      required: '此欄位為必填',
      email: '請輸入有效的電子郵件地址',
      minlength: `最少需要 ${errorValue.requiredLength} 個字元`,
      maxlength: `最多只能 ${errorValue.requiredLength} 個字元`,
      min: `最小值為 ${errorValue.min}`,
      max: `最大值為 ${errorValue.max}`,
      pattern: '格式不正確'
    };

    return messages[errorKey] || '輸入不正確';
  }
}

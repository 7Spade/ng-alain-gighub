/**
 * ngx-tinymce 富文本編輯器模組
 *
 * 注意：此模組為可選模組，僅在需要使用 TinyMCE 富文本編輯器時導入
 *
 * 使用方式：
 * ```typescript
 * import { SHARED_TINYMCE_MODULES } from '@shared/shared-tinymce.module';
 *
 * @Component({
 *   imports: [SHARED_IMPORTS, ...SHARED_TINYMCE_MODULES]
 * })
 * ```
 *
 * 或在需要時直接導入：
 * ```typescript
 * import { EditorModule } from 'ngx-tinymce';
 *
 * @Component({
 *   imports: [SHARED_IMPORTS, EditorModule]
 * })
 * ```
 *
 * @see https://github.com/ng-alain/ng-alain/tree/master/packages/tinymce
 * @see https://www.tiny.cloud/docs/tinymce/latest/
 */

// 注意：ngx-tinymce 在 package.json 中已安裝，但當前未使用
// 如需使用，請取消下面的註釋並安裝對應的類型定義（如果有的話）
// import { EditorModule } from 'ngx-tinymce';

/**
 * ngx-tinymce 模組集合
 *
 * 目前為空數組，因為項目中尚未使用 TinyMCE 編輯器
 * 如需使用，請取消上面的 import 並將 EditorModule 添加到數組中
 */
export const SHARED_TINYMCE_MODULES: any[] = [
  // EditorModule, // TinyMCE 富文本編輯器 — https://github.com/ng-alain/ng-alain/tree/master/packages/tinymce
];

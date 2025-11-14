# Form - 表單

> **組件分類**：數據錄入類組件 (Data Entry)  
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzFormModule` |
| **官方文檔** | [Form](https://ng.ant.design/components/form/en) |
| **Schematics 命令** | 詳見下方命令列表 |

## Schematics 命令

```bash
# 標準登入表單
ng g ng-zorro-antd:form-normal-login <name>

# 標準註冊表單
ng g ng-zorro-antd:form-normal-register <name>

# 標準表單驗證
ng g ng-zorro-antd:form-normal-validation <name>

# 高級搜索表單
ng g ng-zorro-antd:form-advanced-search <name>

# 動態表單
ng g ng-zorro-antd:form-dynamic-form <name>

# 動態表單項目
ng g ng-zorro-antd:form-dynamic-form-item <name>

# 動態表單規則
ng g ng-zorro-antd:form-dynamic-form-rule <name>
```

## 使用方式

### 導入模組

```typescript
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzFormModule],
  // ...
})
export class ExampleComponent {}
```

### 或使用 SHARED_IMPORTS

```typescript
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS], // 包含所有 ng-zorro-antd 組件
  // ...
})
export class ExampleComponent {}
```

## 基本用法

```html
<form nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
  <nz-form-item>
    <nz-form-label [nzSpan]="6" nzRequired>用戶名</nz-form-label>
    <nz-form-control [nzSpan]="14" nzErrorTip="請輸入用戶名">
      <input nz-input formControlName="userName" placeholder="用戶名" />
    </nz-form-control>
  </nz-form-item>
  <nz-form-item>
    <nz-form-control [nzOffset]="6" [nzSpan]="14">
      <button nz-button nzType="primary" [disabled]="!validateForm.valid">提交</button>
    </nz-form-control>
  </nz-form-item>
</form>
```

## 相關資源

- [官方文檔](https://ng.ant.design/components/form/en)
- [返回索引](../46-ng-zorro-antd-組件清單與CLI指令.md)


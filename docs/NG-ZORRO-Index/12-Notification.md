# Notification - 通知提醒框（服務）

> **組件分類**：反饋類組件 (Feedback)  
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **服務導入** | `NzNotificationService` |
| **官方文檔** | [Notification](https://ng.ant.design/components/notification/en) |
| **Schematics 命令** | 暫無專用 schematics |

> **注意**：`Notification` 在 ng-zorro-antd v20+ 中通過服務提供，不需要導入模組，可直接注入使用。

## 使用方式

### 使用服務

```typescript
import { inject } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-example',
  standalone: true,
  // ...
})
export class ExampleComponent {
  private notification = inject(NzNotificationService);

  showNotification() {
    this.notification.success('通知標題', '這是一條成功通知');
    this.notification.error('通知標題', '這是一條錯誤通知');
    this.notification.warning('通知標題', '這是一條警告通知');
    this.notification.info('通知標題', '這是一條信息通知');
  }
}
```

## 基本用法

```typescript
// 成功通知
this.notification.success('成功', '這是一條成功通知');

// 錯誤通知
this.notification.error('錯誤', '這是一條錯誤通知');

// 警告通知
this.notification.warning('警告', '這是一條警告通知');

// 信息通知
this.notification.info('信息', '這是一條信息通知');
```

## 相關資源

- [官方文檔](https://ng.ant.design/components/notification/en)
- [返回索引](../46-ng-zorro-antd-組件清單與CLI指令.md)


# Message - 全局提示（服務）

> **組件分類**：反饋類組件 (Feedback)  
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **服務導入** | `NzMessageService` |
| **官方文檔** | [Message](https://ng.ant.design/components/message/en) |
| **Schematics 命令** | 暫無專用 schematics |

> **注意**：`Message` 在 ng-zorro-antd v20+ 中通過服務提供，不需要導入模組，可直接注入使用。

## 使用方式

### 使用服務

```typescript
import { inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-example',
  standalone: true,
  // ...
})
export class ExampleComponent {
  private message = inject(NzMessageService);

  showMessage() {
    this.message.success('操作成功！');
    this.message.error('操作失敗！');
    this.message.warning('警告信息！');
    this.message.info('提示信息！');
  }
}
```

## 基本用法

```typescript
// 成功提示
this.message.success('這是一條成功提示');

// 錯誤提示
this.message.error('這是一條錯誤提示');

// 警告提示
this.message.warning('這是一條警告提示');

// 信息提示
this.message.info('這是一條信息提示');
```

## 相關資源

- [官方文檔](https://ng.ant.design/components/message/en)
- [返回索引](../46-ng-zorro-antd-組件清單與CLI指令.md)


# Tree - 樹形控件

> **組件分類**：數據展示類組件 (Data Display)  
> **最後更新**：2025-01-15

## 基本信息

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTreeModule` |
| **官方文檔** | [Tree](https://ng.ant.design/components/tree/en) |
| **Schematics 命令** | 詳見下方命令列表 |

## Schematics 命令

```bash
# 基本樹形控件
ng g ng-zorro-antd:tree-basic <name>

# 受控樹形控件
ng g ng-zorro-antd:tree-basic-controlled <name>

# 可拖拽樹形控件
ng g ng-zorro-antd:tree-draggable <name>

# 帶確認的可拖拽樹形控件
ng g ng-zorro-antd:tree-draggable-confirm <name>

# 動態加載數據的樹形控件
ng g ng-zorro-antd:tree-dynamic <name>

# 可搜索的樹形控件
ng g ng-zorro-antd:tree-search <name>

# 自定義圖標的樹形控件
ng g ng-zorro-antd:tree-customized-icon <name>

# 帶連接線的樹形控件
ng g ng-zorro-antd:tree-line <name>

# 目錄樹形控件
ng g ng-zorro-antd:tree-directory <name>

# 虛擬滾動樹形控件
ng g ng-zorro-antd:tree-virtual-scroll <name>
```

## 使用方式

### 導入模組

```typescript
import { NzTreeModule } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzTreeModule],
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
<nz-tree
  [nzData]="nodes"
  nzCheckable
  [nzCheckedKeys]="defaultCheckedKeys"
  [nzExpandedKeys]="defaultExpandedKeys"
  [nzSelectedKeys]="defaultSelectedKeys"
  (nzClick)="nzEvent($event)"
  (nzCheckBoxChange)="nzEvent($event)">
</nz-tree>
```

## 相關資源

- [官方文檔](https://ng.ant.design/components/tree/en)
- [返回索引](../46-ng-zorro-antd-組件清單與CLI指令.md)


# NG-ZORRO-ANTD 組件清單與 CLI 指令

> **最後更新**：2025-01-15  
> **版本**：基於 ng-zorro-antd 最新版本  
> **驗證來源**：Context7 官方文檔、專案 `shared-zorro.module.ts`

## 📋 目錄

- [組件清單](#組件清單)
- [CLI Schematics 指令](#cli-schematics-指令)
- [使用指南](#使用指南)
- [參考文檔](#參考文檔)

---

## 組件清單

### 反饋類組件 (Feedback)

| 組件名稱 | 模組導入 | 官方文檔 | 說明 |
|---------|---------|---------|------|
| **Alert** | `NzAlertModule` | [Alert](https://ng.ant.design/components/alert/en) | 警告提示 |
| **Result** | `NzResultModule` | [Result](https://ng.ant.design/components/result/en) | 結果頁面 |
| **Skeleton** | `NzSkeletonModule` | [Skeleton](https://ng.ant.design/components/skeleton/en) | 骨架屏 |
| **Spin** | `NzSpinModule` | [Spin](https://ng.ant.design/components/spin/en) | 加載中 |
| **Progress** | `NzProgressModule` | [Progress](https://ng.ant.design/components/progress/en) | 進度條 |
| **Drawer** | `NzDrawerModule` | [Drawer](https://ng.ant.design/components/drawer/en) | 抽屜 |
| **Modal** | `NzModalModule` | [Modal](https://ng.ant.design/components/modal/en) | 對話框 |
| **Popconfirm** | `NzPopconfirmModule` | [Popconfirm](https://ng.ant.design/components/popconfirm/en) | 氣泡確認框 |
| **Message** | `NzMessageService` | [Message](https://ng.ant.design/components/message/en) | 全局提示（服務） |
| **Notification** | `NzNotificationService` | [Notification](https://ng.ant.design/components/notification/en) | 通知提醒框（服務） |

> **注意**：`Message` 和 `Notification` 在 ng-zorro-antd v20+ 中通過服務提供，不需要導入模組，可直接注入使用。

### 數據展示類組件 (Data Display)

| 組件名稱 | 模組導入 | 官方文檔 | 說明 |
|---------|---------|---------|------|
| **Avatar** | `NzAvatarModule` | [Avatar](https://ng.ant.design/components/avatar/en) | 頭像 |
| **Badge** | `NzBadgeModule` | [Badge](https://ng.ant.design/components/badge/en) | 徽標數 |
| **Calendar** | `NzCalendarModule` | [Calendar](https://ng.ant.design/components/calendar/en) | 日曆 |
| **Card** | `NzCardModule` | [Card](https://ng.ant.design/components/card/en) | 卡片 |
| **Carousel** | `NzCarouselModule` | [Carousel](https://ng.ant.design/components/carousel/en) | 走馬燈 |
| **Collapse** | `NzCollapseModule` | [Collapse](https://ng.ant.design/components/collapse/en) | 折疊面板 |
| **Comment** | `NzCommentModule` | [Comment](https://ng.ant.design/components/comment/en) | 評論 |
| **Descriptions** | `NzDescriptionsModule` | [Descriptions](https://ng.ant.design/components/descriptions/en) | 描述列表 |
| **Empty** | `NzEmptyModule` | [Empty](https://ng.ant.design/components/empty/en) | 空狀態 |
| **Image** | `NzImageModule` | [Image](https://ng.ant.design/components/image/en) | 圖片 |
| **List** | `NzListModule` | [List](https://ng.ant.design/components/list/en) | 列表 |
| **Popover** | `NzPopoverModule` | [Popover](https://ng.ant.design/components/popover/en) | 氣泡卡片 |
| **QRCode** | `NzQRCodeModule` | [QRCode](https://ng.ant.design/components/qr-code/en) | 二維碼 |
| **Segmented** | `NzSegmentedModule` | [Segmented](https://ng.ant.design/components/segmented/en) | 分段控制器 |
| **Statistic** | `NzStatisticModule` | [Statistic](https://ng.ant.design/components/statistic/en) | 統計數值 |
| **Table** | `NzTableModule` | [Table](https://ng.ant.design/components/table/en) | 表格 |
| **Tag** | `NzTagModule` | [Tag](https://ng.ant.design/components/tag/en) | 標籤 |
| **Timeline** | `NzTimelineModule` | [Timeline](https://ng.ant.design/components/timeline/en) | 時間軸 |
| **Tooltip** | `NzTooltipModule` | [Tooltip](https://ng.ant.design/components/tooltip/en) | 文字提示 |
| **Tree** | `NzTreeModule` | [Tree](https://ng.ant.design/components/tree/en) | 樹形控件 |
| **TreeView** | `NzTreeViewModule` | [TreeView](https://ng.ant.design/components/tree-view/en) | 樹視圖 |

### 數據錄入類組件 (Data Entry)

| 組件名稱 | 模組導入 | 官方文檔 | 說明 |
|---------|---------|---------|------|
| **AutoComplete** | `NzAutocompleteModule` | [AutoComplete](https://ng.ant.design/components/auto-complete/en) | 自動完成 |
| **Cascader** | `NzCascaderModule` | [Cascader](https://ng.ant.design/components/cascader/en) | 級聯選擇 |
| **Checkbox** | `NzCheckboxModule` | [Checkbox](https://ng.ant.design/components/checkbox/en) | 多選框 |
| **ColorPicker** | `NzColorPickerModule` | [ColorPicker](https://ng.ant.design/components/color-picker/en) | 顏色選擇器 |
| **DatePicker** | `NzDatePickerModule` | [DatePicker](https://ng.ant.design/components/date-picker/en) | 日期選擇框 |
| **Form** | `NzFormModule` | [Form](https://ng.ant.design/components/form/en) | 表單 |
| **Input** | `NzInputModule` | [Input](https://ng.ant.design/components/input/en) | 輸入框 |
| **InputNumber** | `NzInputNumberModule` | [InputNumber](https://ng.ant.design/components/input-number/en) | 數字輸入框 |
| **Mention** | `NzMentionModule` | [Mention](https://ng.ant.design/components/mention/en) | 提及 |
| **Radio** | `NzRadioModule` | [Radio](https://ng.ant.design/components/radio/en) | 單選框 |
| **Rate** | `NzRateModule` | [Rate](https://ng.ant.design/components/rate/en) | 評分 |
| **Select** | `NzSelectModule` | [Select](https://ng.ant.design/components/select/en) | 選擇器 |
| **Slider** | `NzSliderModule` | [Slider](https://ng.ant.design/components/slider/en) | 滑動輸入條 |
| **Switch** | `NzSwitchModule` | [Switch](https://ng.ant.design/components/switch/en) | 開關 |
| **TimePicker** | `NzTimePickerModule` | [TimePicker](https://ng.ant.design/components/time-picker/en) | 時間選擇框 |
| **Transfer** | `NzTransferModule` | [Transfer](https://ng.ant.design/components/transfer/en) | 穿梭框 |
| **TreeSelect** | `NzTreeSelectModule` | [TreeSelect](https://ng.ant.design/components/tree-select/en) | 樹選擇 |
| **Upload** | `NzUploadModule` | [Upload](https://ng.ant.design/components/upload/en) | 上傳 |

### 佈局類組件 (Layout)

| 組件名稱 | 模組導入 | 官方文檔 | 說明 |
|---------|---------|---------|------|
| **Divider** | `NzDividerModule` | [Divider](https://ng.ant.design/components/divider/en) | 分割線 |
| **Flex** | `NzFlexModule` | [Flex](https://ng.ant.design/components/flex/en) | 彈性佈局 |
| **Grid** | `NzGridModule` | [Grid](https://ng.ant.design/components/grid/en) | 柵格 |
| **Layout** | `NzLayoutModule` | [Layout](https://ng.ant.design/components/layout/en) | 佈局 |
| **Space** | `NzSpaceModule` | [Space](https://ng.ant.design/components/space/en) | 間距 |
| **Splitter** | `NzSplitterModule` | [Splitter](https://ng.ant.design/components/splitter/en) | 分隔面板 |

### 通用類組件 (General)

| 組件名稱 | 模組導入 | 官方文檔 | 說明 |
|---------|---------|---------|------|
| **Button** | `NzButtonModule` | [Button](https://ng.ant.design/components/button/en) | 按鈕 |
| **FloatButton** | `NzFloatButtonModule` | [FloatButton](https://ng.ant.design/components/float-button/en) | 懸浮按鈕 |
| **Icon** | `NzIconModule` | [Icon](https://ng.ant.design/components/icon/en) | 圖標 |
| **Typography** | `NzTypographyModule` | [Typography](https://ng.ant.design/components/typography/en) | 排版 |

### 導航類組件 (Navigation)

| 組件名稱 | 模組導入 | 官方文檔 | 說明 |
|---------|---------|---------|------|
| **Anchor** | `NzAnchorModule` | [Anchor](https://ng.ant.design/components/anchor/en) | 錨點 |
| **Breadcrumb** | `NzBreadCrumbModule` | [Breadcrumb](https://ng.ant.design/components/breadcrumb/en) | 麵包屑 |
| **Dropdown** | `NzDropDownModule` | [Dropdown](https://ng.ant.design/components/dropdown/en) | 下拉菜單 |
| **Menu** | `NzMenuModule` | [Menu](https://ng.ant.design/components/menu/en) | 導航菜單 |
| **PageHeader** | `NzPageHeaderModule` | [PageHeader](https://ng.ant.design/components/page-header/en) | 頁頭 |
| **Pagination** | `NzPaginationModule` | [Pagination](https://ng.ant.design/components/pagination/en) | 分頁 |
| **Steps** | `NzStepsModule` | [Steps](https://ng.ant.design/components/steps/en) | 步驟條 |
| **Tabs** | `NzTabsModule` | [Tabs](https://ng.ant.design/components/tabs/en) | 標籤頁 |

### 其他類組件 (Other)

| 組件名稱 | 模組導入 | 官方文檔 | 說明 |
|---------|---------|---------|------|
| **Affix** | `NzAffixModule` | [Affix](https://ng.ant.design/components/affix/en) | 固釘 |
| **BackTop** | `NzBackTopModule` | [BackTop](https://ng.ant.design/components/back-top/en) | 返回頂部 |
| **WaterMark** | `NzWaterMarkModule` | [WaterMark](https://ng.ant.design/components/water-mark/en) | 水印 |

### 特色組件 (Special)

| 組件名稱 | 模組導入 | 官方文檔 | 說明 |
|---------|---------|---------|------|
| **CheckList** | `NzCheckListModule` | [CheckList](https://ng.ant.design/components/check-list/en) | 任務清單 |
| **HashCode** | `NzHashCodeModule` | [HashCode](https://ng.ant.design/components/hash-code/en) | 哈希碼 |

---

## CLI Schematics 指令

### 基本安裝指令

#### 1. 安裝 NG-ZORRO 到現有專案

```bash
# 使用 Angular CLI（推薦）
ng add ng-zorro-antd

# 指定版本安裝
ng add ng-zorro-antd@15.0.0

# 使用 npm 手動安裝
npm install ng-zorro-antd
```

#### 2. 安裝選項

```bash
# 啟用自定義主題
ng add ng-zorro-antd --theme=true

# 添加 HammerJS 手勢支持
ng add ng-zorro-antd --gestures=true

# 包含動畫
ng add ng-zorro-antd --animations=true

# 設置默認語言環境
ng add ng-zorro-antd --locale=en_US

# 使用側邊欄菜單模板
ng add ng-zorro-antd --template=sidemenu
```

### 應用模板生成指令

#### 1. 生成側邊欄菜單應用

```bash
ng generate ng-zorro-antd:side-menu --name=admin
# 或簡寫
ng g ng-zorro-antd:side-menu --name=admin
```

#### 2. 生成頂部導航應用

```bash
ng generate ng-zorro-antd:topnav --name=dashboard
# 或簡寫
ng g ng-zorro-antd:topnav --name=dashboard
```

#### 3. 生成空白應用模板

```bash
ng generate ng-zorro-antd:blank --name=simple-app
# 或簡寫
ng g ng-zorro-antd:blank --name=simple-app
```

#### 4. 生成組件（帶 NG-ZORRO 設置）

```bash
ng generate ng-zorro-antd:component user-profile
# 或簡寫
ng g ng-zorro-antd:component user-profile
```

### 組件模板生成指令

#### 基本語法

```bash
ng g ng-zorro-antd:[schematic] <name> [options]
```

#### 常用組件模板

```bash
# 生成表單登入組件
ng g ng-zorro-antd:form-normal-login login

# 生成表單註冊組件
ng g ng-zorro-antd:form-normal-register register

# 生成表單驗證組件
ng g ng-zorro-antd:form-normal-validation validation

# 生成表單高級搜索組件
ng g ng-zorro-antd:form-advanced-search search

# 生成表單動態表單組件
ng g ng-zorro-antd:form-dynamic-form dynamic-form

# 生成表單動態表單項目組件
ng g ng-zorro-antd:form-dynamic-form-item dynamic-form-item

# 生成表單動態表單規則組件
ng g ng-zorro-antd:form-dynamic-form-rule dynamic-form-rule
```

> **注意**：更多組件模板請參考 [NG-ZORRO Schematics 文檔](https://ng.ant.design/docs/schematics/en)

### 開發與調試指令

#### 1. 構建 Schematics

```bash
npm run build:schematic
```

#### 2. 鏈接 Schematics 用於調試

```bash
# 進入發布目錄並鏈接
cd publish && npm link

# 創建調試專案
ng new schematic-debug

# 在調試專案中鏈接
cd schematic-debug && npm link ng-zorro-antd
```

#### 3. 運行開發命令

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm start

# 運行代碼檢查
npm run lint

# 運行測試
npm test

# 監視模式運行測試
npm run test:watch [name]

# 構建庫
npm run build:lib
```

### 其他依賴安裝

#### Graph 組件依賴

```bash
npm install dagre-compound dagre d3-transition d3-zoom d3-selection d3-shape d3-drag @types/d3
```

#### 自定義 Webpack Builder

```bash
npm i -D @angular-builders/custom-webpack
```

---

## 使用指南

### 在專案中使用組件

#### 1. 使用 SHARED_IMPORTS（推薦）

本專案已配置 `SHARED_IMPORTS`，包含所有 ng-zorro-antd 組件模組，直接使用即可：

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

#### 2. 個別導入組件模組

如果只需要特定組件，可以個別導入：

```typescript
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [NzButtonModule, NzTableModule],
  // ...
})
export class ExampleComponent {}
```

#### 3. 使用服務（Message、Notification）

```typescript
import { inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-example',
  standalone: true,
  // ...
})
export class ExampleComponent {
  private message = inject(NzMessageService);
  private notification = inject(NzNotificationService);

  showMessage() {
    this.message.success('操作成功！');
  }

  showNotification() {
    this.notification.info('通知', '這是一條通知消息');
  }
}
```

### 組件分類統計

- **反饋類組件**：10 個（含 2 個服務）
- **數據展示類組件**：21 個
- **數據錄入類組件**：18 個
- **佈局類組件**：6 個
- **通用類組件**：4 個
- **導航類組件**：8 個
- **其他類組件**：3 個
- **特色組件**：2 個

**總計**：**72 個組件/模組**

---

## 參考文檔

### 官方文檔

- [NG-ZORRO 官方網站](https://ng.ant.design/)
- [NG-ZORRO 組件文檔](https://ng.ant.design/components/overview/en)
- [NG-ZORRO Schematics 文檔](https://ng.ant.design/docs/schematics/en)
- [NG-ZORRO 快速開始](https://ng.ant.design/docs/getting-started/en)
- [NG-ZORRO GitHub](https://github.com/ng-zorro/ng-zorro-antd)

### 專案相關文檔

- [SHARED_IMPORTS 使用指南](./45-SHARED_IMPORTS-使用指南.md)
- [專案結構說明](./01-專案結構說明.md)
- [開發作業指引](./00-開發作業指引.md)

### 驗證來源

- **Context7 官方文檔**：`/ng-zorro/ng-zorro-antd`
- **專案代碼**：`src/app/shared/shared-zorro.module.ts`
- **MCP 工具**：`mcp-server-ngzorro`

---

**最後更新**：2025-01-15  
**維護者**：開發團隊  
**版本**：v1.0


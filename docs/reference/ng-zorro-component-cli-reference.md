# NG-ZORRO-ANTD 組件清單與 CLI 指令

## 📑 目錄

- [📋 目錄](#-目錄)
- [組件清單](#組件清單)
  - [反饋類組件 (Feedback)](#反饋類組件-feedback)
    - [[Alert - 警告提示](./NG-ZORRO-Index/01-Alert.md)](#alert---警告提示ng-zorro-index01-alertmd)
    - [[Result - 結果頁面](./NG-ZORRO-Index/04-Result.md)](#result---結果頁面ng-zorro-index04-resultmd)
    - [[Skeleton - 骨架屏](./NG-ZORRO-Index/05-Skeleton.md)](#skeleton---骨架屏ng-zorro-index05-skeletonmd)
    - [[Spin - 加載中](./NG-ZORRO-Index/06-Spin.md)](#spin---加載中ng-zorro-index06-spinmd)
    - [[Progress - 進度條](./NG-ZORRO-Index/07-Progress.md)](#progress---進度條ng-zorro-index07-progressmd)
    - [[Drawer - 抽屜](./NG-ZORRO-Index/08-Drawer.md)](#drawer---抽屜ng-zorro-index08-drawermd)
    - [[Modal - 對話框](./NG-ZORRO-Index/09-Modal.md)](#modal---對話框ng-zorro-index09-modalmd)
    - [[Popconfirm - 氣泡確認框](./NG-ZORRO-Index/10-Popconfirm.md)](#popconfirm---氣泡確認框ng-zorro-index10-popconfirmmd)
    - [[Message - 全局提示（服務）](./NG-ZORRO-Index/11-Message.md)](#message---全局提示服務ng-zorro-index11-messagemd)
    - [[Notification - 通知提醒框（服務）](./NG-ZORRO-Index/12-Notification.md)](#notification---通知提醒框服務ng-zorro-index12-notificationmd)
  - [數據展示類組件 (Data Display)](#數據展示類組件-data-display)
    - [[Avatar - 頭像](./NG-ZORRO-Index/13-Avatar.md)](#avatar---頭像ng-zorro-index13-avatarmd)
    - [[Badge - 徽標數](./NG-ZORRO-Index/14-Badge.md)](#badge---徽標數ng-zorro-index14-badgemd)
    - [[Calendar - 日曆](./NG-ZORRO-Index/15-Calendar.md)](#calendar---日曆ng-zorro-index15-calendarmd)
    - [[Card - 卡片](./NG-ZORRO-Index/16-Card.md)](#card---卡片ng-zorro-index16-cardmd)
    - [[Carousel - 走馬燈](./NG-ZORRO-Index/17-Carousel.md)](#carousel---走馬燈ng-zorro-index17-carouselmd)
    - [[Collapse - 折疊面板](./NG-ZORRO-Index/18-Collapse.md)](#collapse---折疊面板ng-zorro-index18-collapsemd)
    - [[Comment - 評論](./NG-ZORRO-Index/19-Comment.md)](#comment---評論ng-zorro-index19-commentmd)
    - [[Descriptions - 描述列表](./NG-ZORRO-Index/20-Descriptions.md)](#descriptions---描述列表ng-zorro-index20-descriptionsmd)
    - [[Empty - 空狀態](./NG-ZORRO-Index/21-Empty.md)](#empty---空狀態ng-zorro-index21-emptymd)
    - [[Image - 圖片](./NG-ZORRO-Index/22-Image.md)](#image---圖片ng-zorro-index22-imagemd)
    - [[List - 列表](./NG-ZORRO-Index/23-List.md)](#list---列表ng-zorro-index23-listmd)
    - [[Popover - 氣泡卡片](./NG-ZORRO-Index/24-Popover.md)](#popover---氣泡卡片ng-zorro-index24-popovermd)
    - [[QRCode - 二維碼](./NG-ZORRO-Index/25-QRCode.md)](#qrcode---二維碼ng-zorro-index25-qrcodemd)
    - [[Segmented - 分段控制器](./NG-ZORRO-Index/26-Segmented.md)](#segmented---分段控制器ng-zorro-index26-segmentedmd)
    - [[Statistic - 統計數值](./NG-ZORRO-Index/27-Statistic.md)](#statistic---統計數值ng-zorro-index27-statisticmd)
    - [[Table - 表格](./NG-ZORRO-Index/28-Table.md)](#table---表格ng-zorro-index28-tablemd)
    - [[Tag - 標籤](./NG-ZORRO-Index/29-Tag.md)](#tag---標籤ng-zorro-index29-tagmd)
    - [[Timeline - 時間軸](./NG-ZORRO-Index/30-Timeline.md)](#timeline---時間軸ng-zorro-index30-timelinemd)
    - [[Tooltip - 文字提示](./NG-ZORRO-Index/31-Tooltip.md)](#tooltip---文字提示ng-zorro-index31-tooltipmd)
    - [[Tree - 樹形控件](./NG-ZORRO-Index/03-Tree.md)](#tree---樹形控件ng-zorro-index03-treemd)
    - [[TreeView - 樹視圖](./NG-ZORRO-Index/32-TreeView.md)](#treeview---樹視圖ng-zorro-index32-treeviewmd)
  - [數據錄入類組件 (Data Entry)](#數據錄入類組件-data-entry)
    - [[AutoComplete - 自動完成](./NG-ZORRO-Index/33-AutoComplete.md)](#autocomplete---自動完成ng-zorro-index33-autocompletemd)
    - [[Cascader - 級聯選擇](./NG-ZORRO-Index/34-Cascader.md)](#cascader---級聯選擇ng-zorro-index34-cascadermd)
    - [[Checkbox - 多選框](./NG-ZORRO-Index/35-Checkbox.md)](#checkbox---多選框ng-zorro-index35-checkboxmd)
    - [[ColorPicker - 顏色選擇器](./NG-ZORRO-Index/36-ColorPicker.md)](#colorpicker---顏色選擇器ng-zorro-index36-colorpickermd)
    - [[DatePicker - 日期選擇框](./NG-ZORRO-Index/37-DatePicker.md)](#datepicker---日期選擇框ng-zorro-index37-datepickermd)
    - [[Form - 表單](./NG-ZORRO-Index/02-Form.md)](#form---表單ng-zorro-index02-formmd)
    - [[Input - 輸入框](./NG-ZORRO-Index/38-Input.md)](#input---輸入框ng-zorro-index38-inputmd)
    - [[InputNumber - 數字輸入框](./NG-ZORRO-Index/39-InputNumber.md)](#inputnumber---數字輸入框ng-zorro-index39-inputnumbermd)
    - [[Mention - 提及](./NG-ZORRO-Index/40-Mention.md)](#mention---提及ng-zorro-index40-mentionmd)
    - [[Radio - 單選框](./NG-ZORRO-Index/41-Radio.md)](#radio---單選框ng-zorro-index41-radiomd)
    - [[Rate - 評分](./NG-ZORRO-Index/42-Rate.md)](#rate---評分ng-zorro-index42-ratemd)
    - [[Select - 選擇器](./NG-ZORRO-Index/43-Select.md)](#select---選擇器ng-zorro-index43-selectmd)
    - [[Slider - 滑動輸入條](./NG-ZORRO-Index/44-Slider.md)](#slider---滑動輸入條ng-zorro-index44-slidermd)
    - [[Switch - 開關](./NG-ZORRO-Index/45-Switch.md)](#switch---開關ng-zorro-index45-switchmd)
    - [[TimePicker - 時間選擇框](./NG-ZORRO-Index/46-TimePicker.md)](#timepicker---時間選擇框ng-zorro-index46-timepickermd)
    - [[Transfer - 穿梭框](./NG-ZORRO-Index/47-Transfer.md)](#transfer---穿梭框ng-zorro-index47-transfermd)
    - [[TreeSelect - 樹選擇](./NG-ZORRO-Index/48-TreeSelect.md)](#treeselect---樹選擇ng-zorro-index48-treeselectmd)
    - [[Upload - 上傳](./NG-ZORRO-Index/49-Upload.md)](#upload---上傳ng-zorro-index49-uploadmd)
  - [佈局類組件 (Layout)](#佈局類組件-layout)
    - [[Divider - 分割線](./NG-ZORRO-Index/50-Divider.md)](#divider---分割線ng-zorro-index50-dividermd)
    - [[Flex - 彈性佈局](./NG-ZORRO-Index/51-Flex.md)](#flex---彈性佈局ng-zorro-index51-flexmd)
    - [[Grid - 柵格](./NG-ZORRO-Index/52-Grid.md)](#grid---柵格ng-zorro-index52-gridmd)
    - [[Layout - 佈局](./NG-ZORRO-Index/53-Layout.md)](#layout---佈局ng-zorro-index53-layoutmd)
    - [[Space - 間距](./NG-ZORRO-Index/54-Space.md)](#space---間距ng-zorro-index54-spacemd)
    - [[Splitter - 分隔面板](./NG-ZORRO-Index/55-Splitter.md)](#splitter---分隔面板ng-zorro-index55-splittermd)
  - [通用類組件 (General)](#通用類組件-general)
    - [[Button - 按鈕](./NG-ZORRO-Index/56-Button.md)](#button---按鈕ng-zorro-index56-buttonmd)
    - [[FloatButton - 懸浮按鈕](./NG-ZORRO-Index/57-FloatButton.md)](#floatbutton---懸浮按鈕ng-zorro-index57-floatbuttonmd)
    - [[Icon - 圖標](./NG-ZORRO-Index/58-Icon.md)](#icon---圖標ng-zorro-index58-iconmd)
    - [[Typography - 排版](./NG-ZORRO-Index/59-Typography.md)](#typography---排版ng-zorro-index59-typographymd)
  - [導航類組件 (Navigation)](#導航類組件-navigation)
    - [[Anchor - 錨點](./NG-ZORRO-Index/60-Anchor.md)](#anchor---錨點ng-zorro-index60-anchormd)
    - [[Breadcrumb - 麵包屑](./NG-ZORRO-Index/61-Breadcrumb.md)](#breadcrumb---麵包屑ng-zorro-index61-breadcrumbmd)
    - [[Dropdown - 下拉菜單](./NG-ZORRO-Index/62-Dropdown.md)](#dropdown---下拉菜單ng-zorro-index62-dropdownmd)
    - [[Menu - 導航菜單](./NG-ZORRO-Index/63-Menu.md)](#menu---導航菜單ng-zorro-index63-menumd)
    - [[PageHeader - 頁頭](./NG-ZORRO-Index/64-PageHeader.md)](#pageheader---頁頭ng-zorro-index64-pageheadermd)
    - [[Pagination - 分頁](./NG-ZORRO-Index/65-Pagination.md)](#pagination---分頁ng-zorro-index65-paginationmd)
    - [[Steps - 步驟條](./NG-ZORRO-Index/66-Steps.md)](#steps---步驟條ng-zorro-index66-stepsmd)
    - [[Tabs - 標籤頁](./NG-ZORRO-Index/67-Tabs.md)](#tabs---標籤頁ng-zorro-index67-tabsmd)
  - [其他類組件 (Other)](#其他類組件-other)
    - [[Affix - 固釘](./NG-ZORRO-Index/68-Affix.md)](#affix---固釘ng-zorro-index68-affixmd)
    - [[BackTop - 返回頂部](./NG-ZORRO-Index/69-BackTop.md)](#backtop---返回頂部ng-zorro-index69-backtopmd)
    - [[WaterMark - 水印](./NG-ZORRO-Index/70-WaterMark.md)](#watermark---水印ng-zorro-index70-watermarkmd)
  - [特色組件 (Special)](#特色組件-special)
    - [[CheckList - 任務清單](./NG-ZORRO-Index/71-CheckList.md)](#checklist---任務清單ng-zorro-index71-checklistmd)
    - [[HashCode - 哈希碼](./NG-ZORRO-Index/72-HashCode.md)](#hashcode---哈希碼ng-zorro-index72-hashcodemd)
- [CLI Schematics 指令](#cli-schematics-指令)
  - [基本安裝指令](#基本安裝指令)
    - [1. 安裝 NG-ZORRO 到現有專案](#1-安裝-ng-zorro-到現有專案)
    - [2. 安裝選項](#2-安裝選項)
  - [應用模板生成指令](#應用模板生成指令)
    - [1. 生成側邊欄菜單應用](#1-生成側邊欄菜單應用)
    - [2. 生成頂部導航應用](#2-生成頂部導航應用)
    - [3. 生成空白應用模板](#3-生成空白應用模板)
    - [4. 生成組件（帶 NG-ZORRO 設置）](#4-生成組件帶-ng-zorro-設置)
  - [組件模板生成指令](#組件模板生成指令)
    - [基本語法](#基本語法)
    - [完整 Schematics 命令列表](#完整-schematics-命令列表)
  - [開發與調試指令](#開發與調試指令)
    - [1. 構建 Schematics](#1-構建-schematics)
    - [2. 鏈接 Schematics 用於調試](#2-鏈接-schematics-用於調試)
    - [3. 運行開發命令](#3-運行開發命令)
  - [其他依賴安裝](#其他依賴安裝)
    - [Graph 組件依賴](#graph-組件依賴)
    - [自定義 Webpack Builder](#自定義-webpack-builder)
- [使用指南](#使用指南)
  - [在專案中使用組件](#在專案中使用組件)
    - [1. 使用 SHARED_IMPORTS（推薦）](#1-使用-shared_imports推薦)
    - [2. 個別導入組件模組](#2-個別導入組件模組)
    - [3. 使用服務（Message、Notification）](#3-使用服務messagenotification)
  - [組件分類統計](#組件分類統計)
- [參考文檔](#參考文檔)
  - [官方文檔](#官方文檔)
  - [專案相關文檔](#專案相關文檔)
  - [驗證來源](#驗證來源)
- [更新日誌](#更新日誌)
  - [v1.2 (2025-01-15)](#v12-2025-01-15)
  - [v1.1 (2025-01-15)](#v11-2025-01-15)
  - [v1.0 (2025-01-15)](#v10-2025-01-15)

---


> 📋 **目的**：提供 ng-zorro-antd 組件清單和 CLI Schematics 指令參考

**最後更新**：2025-11-15
**維護者**：開發團隊
**版本**：基於 ng-zorro-antd 最新版本
**驗證來源**：Context7 官方文檔、專案 `shared-zorro.module.ts`

- --

## 📋 目錄

- [組件清單](#組件清單)
- [CLI Schematics 指令](#cli-schematics-指令)
- [使用指南](#使用指南)
- [參考文檔](#參考文檔)

- --

## 組件清單

> **說明**：每個組件都有獨立的詳細文檔，點擊組件名稱查看詳細信息。使用方式：`ng g ng-zorro-antd:[schematic] <name>`

> **📁 詳細文檔位置**：所有組件詳細文檔位於 [`NG-ZORRO-Index/`](./NG-ZORRO-Index/) 資料夾

### 反饋類組件 (Feedback)

#### [Alert - 警告提示](./NG-ZORRO-Index/01-Alert.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzAlertModule` |
| **官方文檔** | [Alert](https://ng.ant.design/components/alert/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/01-Alert.md) |

#### [Result - 結果頁面](./NG-ZORRO-Index/04-Result.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzResultModule` |
| **官方文檔** | [Result](https://ng.ant.design/components/result/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/04-Result.md) |

#### [Skeleton - 骨架屏](./NG-ZORRO-Index/05-Skeleton.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSkeletonModule` |
| **官方文檔** | [Skeleton](https://ng.ant.design/components/skeleton/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/05-Skeleton.md) |

#### [Spin - 加載中](./NG-ZORRO-Index/06-Spin.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSpinModule` |
| **官方文檔** | [Spin](https://ng.ant.design/components/spin/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/06-Spin.md) |

#### [Progress - 進度條](./NG-ZORRO-Index/07-Progress.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzProgressModule` |
| **官方文檔** | [Progress](https://ng.ant.design/components/progress/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/07-Progress.md) |

#### [Drawer - 抽屜](./NG-ZORRO-Index/08-Drawer.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzDrawerModule` |
| **官方文檔** | [Drawer](https://ng.ant.design/components/drawer/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/08-Drawer.md) |

#### [Modal - 對話框](./NG-ZORRO-Index/09-Modal.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzModalModule` |
| **官方文檔** | [Modal](https://ng.ant.design/components/modal/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/09-Modal.md) |

#### [Popconfirm - 氣泡確認框](./NG-ZORRO-Index/10-Popconfirm.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzPopconfirmModule` |
| **官方文檔** | [Popconfirm](https://ng.ant.design/components/popconfirm/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/10-Popconfirm.md) |

#### [Message - 全局提示（服務）](./NG-ZORRO-Index/11-Message.md)

| 項目 | 內容 |
|------|------|
| **服務導入** | `NzMessageService` |
| **官方文檔** | [Message](https://ng.ant.design/components/message/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/11-Message.md) |

#### [Notification - 通知提醒框（服務）](./NG-ZORRO-Index/12-Notification.md)

| 項目 | 內容 |
|------|------|
| **服務導入** | `NzNotificationService` |
| **官方文檔** | [Notification](https://ng.ant.design/components/notification/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/12-Notification.md) |

> **注意**：`Message` 和 `Notification` 在 ng-zorro-antd v20+ 中通過服務提供，不需要導入模組，可直接注入使用。

### 數據展示類組件 (Data Display)

#### [Avatar - 頭像](./NG-ZORRO-Index/13-Avatar.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzAvatarModule` |
| **官方文檔** | [Avatar](https://ng.ant.design/components/avatar/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/13-Avatar.md) |

#### [Badge - 徽標數](./NG-ZORRO-Index/14-Badge.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzBadgeModule` |
| **官方文檔** | [Badge](https://ng.ant.design/components/badge/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/14-Badge.md) |

#### [Calendar - 日曆](./NG-ZORRO-Index/15-Calendar.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCalendarModule` |
| **官方文檔** | [Calendar](https://ng.ant.design/components/calendar/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/15-Calendar.md) |

#### [Card - 卡片](./NG-ZORRO-Index/16-Card.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCardModule` |
| **官方文檔** | [Card](https://ng.ant.design/components/card/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/16-Card.md) |

#### [Carousel - 走馬燈](./NG-ZORRO-Index/17-Carousel.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCarouselModule` |
| **官方文檔** | [Carousel](https://ng.ant.design/components/carousel/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/17-Carousel.md) |

#### [Collapse - 折疊面板](./NG-ZORRO-Index/18-Collapse.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCollapseModule` |
| **官方文檔** | [Collapse](https://ng.ant.design/components/collapse/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/18-Collapse.md) |

#### [Comment - 評論](./NG-ZORRO-Index/19-Comment.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCommentModule` |
| **官方文檔** | [Comment](https://ng.ant.design/components/comment/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/19-Comment.md) |

#### [Descriptions - 描述列表](./NG-ZORRO-Index/20-Descriptions.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzDescriptionsModule` |
| **官方文檔** | [Descriptions](https://ng.ant.design/components/descriptions/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/20-Descriptions.md) |

#### [Empty - 空狀態](./NG-ZORRO-Index/21-Empty.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzEmptyModule` |
| **官方文檔** | [Empty](https://ng.ant.design/components/empty/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/21-Empty.md) |

#### [Image - 圖片](./NG-ZORRO-Index/22-Image.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzImageModule` |
| **官方文檔** | [Image](https://ng.ant.design/components/image/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/22-Image.md) |

#### [List - 列表](./NG-ZORRO-Index/23-List.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzListModule` |
| **官方文檔** | [List](https://ng.ant.design/components/list/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/23-List.md) |

#### [Popover - 氣泡卡片](./NG-ZORRO-Index/24-Popover.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzPopoverModule` |
| **官方文檔** | [Popover](https://ng.ant.design/components/popover/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/24-Popover.md) |

#### [QRCode - 二維碼](./NG-ZORRO-Index/25-QRCode.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzQRCodeModule` |
| **官方文檔** | [QRCode](https://ng.ant.design/components/qr-code/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/25-QRCode.md) |

#### [Segmented - 分段控制器](./NG-ZORRO-Index/26-Segmented.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSegmentedModule` |
| **官方文檔** | [Segmented](https://ng.ant.design/components/segmented/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/26-Segmented.md) |

#### [Statistic - 統計數值](./NG-ZORRO-Index/27-Statistic.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzStatisticModule` |
| **官方文檔** | [Statistic](https://ng.ant.design/components/statistic/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/27-Statistic.md) |

#### [Table - 表格](./NG-ZORRO-Index/28-Table.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTableModule` |
| **官方文檔** | [Table](https://ng.ant.design/components/table/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/28-Table.md) |

#### [Tag - 標籤](./NG-ZORRO-Index/29-Tag.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTagModule` |
| **官方文檔** | [Tag](https://ng.ant.design/components/tag/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/29-Tag.md) |

#### [Timeline - 時間軸](./NG-ZORRO-Index/30-Timeline.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTimelineModule` |
| **官方文檔** | [Timeline](https://ng.ant.design/components/timeline/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/30-Timeline.md) |

#### [Tooltip - 文字提示](./NG-ZORRO-Index/31-Tooltip.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTooltipModule` |
| **官方文檔** | [Tooltip](https://ng.ant.design/components/tooltip/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/31-Tooltip.md) |

#### [Tree - 樹形控件](./NG-ZORRO-Index/03-Tree.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTreeModule` |
| **官方文檔** | [Tree](https://ng.ant.design/components/tree/en) |
| **Schematics 命令** | 詳見下方命令列表 |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/03-Tree.md) |

**Tree 組件 Schematics 命令：**

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

#### [TreeView - 樹視圖](./NG-ZORRO-Index/32-TreeView.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTreeViewModule` |
| **官方文檔** | [TreeView](https://ng.ant.design/components/tree-view/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/32-TreeView.md) |

### 數據錄入類組件 (Data Entry)

#### [AutoComplete - 自動完成](./NG-ZORRO-Index/33-AutoComplete.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzAutocompleteModule` |
| **官方文檔** | [AutoComplete](https://ng.ant.design/components/auto-complete/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/33-AutoComplete.md) |

#### [Cascader - 級聯選擇](./NG-ZORRO-Index/34-Cascader.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCascaderModule` |
| **官方文檔** | [Cascader](https://ng.ant.design/components/cascader/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/34-Cascader.md) |

#### [Checkbox - 多選框](./NG-ZORRO-Index/35-Checkbox.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCheckboxModule` |
| **官方文檔** | [Checkbox](https://ng.ant.design/components/checkbox/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/35-Checkbox.md) |

#### [ColorPicker - 顏色選擇器](./NG-ZORRO-Index/36-ColorPicker.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzColorPickerModule` |
| **官方文檔** | [ColorPicker](https://ng.ant.design/components/color-picker/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/36-ColorPicker.md) |

#### [DatePicker - 日期選擇框](./NG-ZORRO-Index/37-DatePicker.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzDatePickerModule` |
| **官方文檔** | [DatePicker](https://ng.ant.design/components/date-picker/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/37-DatePicker.md) |

#### [Form - 表單](./NG-ZORRO-Index/02-Form.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzFormModule` |
| **官方文檔** | [Form](https://ng.ant.design/components/form/en) |
| **Schematics 命令** | 詳見下方命令列表 |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/02-Form.md) |

**Form 組件 Schematics 命令：**

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

#### [Input - 輸入框](./NG-ZORRO-Index/38-Input.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzInputModule` |
| **官方文檔** | [Input](https://ng.ant.design/components/input/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/38-Input.md) |

#### [InputNumber - 數字輸入框](./NG-ZORRO-Index/39-InputNumber.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzInputNumberModule` |
| **官方文檔** | [InputNumber](https://ng.ant.design/components/input-number/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/39-InputNumber.md) |

#### [Mention - 提及](./NG-ZORRO-Index/40-Mention.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzMentionModule` |
| **官方文檔** | [Mention](https://ng.ant.design/components/mention/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/40-Mention.md) |

#### [Radio - 單選框](./NG-ZORRO-Index/41-Radio.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzRadioModule` |
| **官方文檔** | [Radio](https://ng.ant.design/components/radio/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/41-Radio.md) |

#### [Rate - 評分](./NG-ZORRO-Index/42-Rate.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzRateModule` |
| **官方文檔** | [Rate](https://ng.ant.design/components/rate/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/42-Rate.md) |

#### [Select - 選擇器](./NG-ZORRO-Index/43-Select.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSelectModule` |
| **官方文檔** | [Select](https://ng.ant.design/components/select/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/43-Select.md) |

#### [Slider - 滑動輸入條](./NG-ZORRO-Index/44-Slider.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSliderModule` |
| **官方文檔** | [Slider](https://ng.ant.design/components/slider/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/44-Slider.md) |

#### [Switch - 開關](./NG-ZORRO-Index/45-Switch.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSwitchModule` |
| **官方文檔** | [Switch](https://ng.ant.design/components/switch/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/45-Switch.md) |

#### [TimePicker - 時間選擇框](./NG-ZORRO-Index/46-TimePicker.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTimePickerModule` |
| **官方文檔** | [TimePicker](https://ng.ant.design/components/time-picker/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/46-TimePicker.md) |

#### [Transfer - 穿梭框](./NG-ZORRO-Index/47-Transfer.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTransferModule` |
| **官方文檔** | [Transfer](https://ng.ant.design/components/transfer/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/47-Transfer.md) |

#### [TreeSelect - 樹選擇](./NG-ZORRO-Index/48-TreeSelect.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTreeSelectModule` |
| **官方文檔** | [TreeSelect](https://ng.ant.design/components/tree-select/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/48-TreeSelect.md) |

#### [Upload - 上傳](./NG-ZORRO-Index/49-Upload.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzUploadModule` |
| **官方文檔** | [Upload](https://ng.ant.design/components/upload/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/49-Upload.md) |

### 佈局類組件 (Layout)

#### [Divider - 分割線](./NG-ZORRO-Index/50-Divider.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzDividerModule` |
| **官方文檔** | [Divider](https://ng.ant.design/components/divider/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/50-Divider.md) |

#### [Flex - 彈性佈局](./NG-ZORRO-Index/51-Flex.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzFlexModule` |
| **官方文檔** | [Flex](https://ng.ant.design/components/flex/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/51-Flex.md) |

#### [Grid - 柵格](./NG-ZORRO-Index/52-Grid.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzGridModule` |
| **官方文檔** | [Grid](https://ng.ant.design/components/grid/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/52-Grid.md) |

#### [Layout - 佈局](./NG-ZORRO-Index/53-Layout.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzLayoutModule` |
| **官方文檔** | [Layout](https://ng.ant.design/components/layout/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/53-Layout.md) |

#### [Space - 間距](./NG-ZORRO-Index/54-Space.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSpaceModule` |
| **官方文檔** | [Space](https://ng.ant.design/components/space/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/54-Space.md) |

#### [Splitter - 分隔面板](./NG-ZORRO-Index/55-Splitter.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzSplitterModule` |
| **官方文檔** | [Splitter](https://ng.ant.design/components/splitter/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/55-Splitter.md) |

### 通用類組件 (General)

#### [Button - 按鈕](./NG-ZORRO-Index/56-Button.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzButtonModule` |
| **官方文檔** | [Button](https://ng.ant.design/components/button/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/56-Button.md) |

#### [FloatButton - 懸浮按鈕](./NG-ZORRO-Index/57-FloatButton.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzFloatButtonModule` |
| **官方文檔** | [FloatButton](https://ng.ant.design/components/float-button/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/57-FloatButton.md) |

#### [Icon - 圖標](./NG-ZORRO-Index/58-Icon.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzIconModule` |
| **官方文檔** | [Icon](https://ng.ant.design/components/icon/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/58-Icon.md) |

#### [Typography - 排版](./NG-ZORRO-Index/59-Typography.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTypographyModule` |
| **官方文檔** | [Typography](https://ng.ant.design/components/typography/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/59-Typography.md) |

### 導航類組件 (Navigation)

#### [Anchor - 錨點](./NG-ZORRO-Index/60-Anchor.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzAnchorModule` |
| **官方文檔** | [Anchor](https://ng.ant.design/components/anchor/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/60-Anchor.md) |

#### [Breadcrumb - 麵包屑](./NG-ZORRO-Index/61-Breadcrumb.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzBreadCrumbModule` |
| **官方文檔** | [Breadcrumb](https://ng.ant.design/components/breadcrumb/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/61-Breadcrumb.md) |

#### [Dropdown - 下拉菜單](./NG-ZORRO-Index/62-Dropdown.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzDropDownModule` |
| **官方文檔** | [Dropdown](https://ng.ant.design/components/dropdown/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/62-Dropdown.md) |

#### [Menu - 導航菜單](./NG-ZORRO-Index/63-Menu.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzMenuModule` |
| **官方文檔** | [Menu](https://ng.ant.design/components/menu/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/63-Menu.md) |

#### [PageHeader - 頁頭](./NG-ZORRO-Index/64-PageHeader.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzPageHeaderModule` |
| **官方文檔** | [PageHeader](https://ng.ant.design/components/page-header/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/64-PageHeader.md) |

#### [Pagination - 分頁](./NG-ZORRO-Index/65-Pagination.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzPaginationModule` |
| **官方文檔** | [Pagination](https://ng.ant.design/components/pagination/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/65-Pagination.md) |

#### [Steps - 步驟條](./NG-ZORRO-Index/66-Steps.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzStepsModule` |
| **官方文檔** | [Steps](https://ng.ant.design/components/steps/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/66-Steps.md) |

#### [Tabs - 標籤頁](./NG-ZORRO-Index/67-Tabs.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzTabsModule` |
| **官方文檔** | [Tabs](https://ng.ant.design/components/tabs/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/67-Tabs.md) |

### 其他類組件 (Other)

#### [Affix - 固釘](./NG-ZORRO-Index/68-Affix.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzAffixModule` |
| **官方文檔** | [Affix](https://ng.ant.design/components/affix/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/68-Affix.md) |

#### [BackTop - 返回頂部](./NG-ZORRO-Index/69-BackTop.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzBackTopModule` |
| **官方文檔** | [BackTop](https://ng.ant.design/components/back-top/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/69-BackTop.md) |

#### [WaterMark - 水印](./NG-ZORRO-Index/70-WaterMark.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzWaterMarkModule` |
| **官方文檔** | [WaterMark](https://ng.ant.design/components/water-mark/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/70-WaterMark.md) |

### 特色組件 (Special)

#### [CheckList - 任務清單](./NG-ZORRO-Index/71-CheckList.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzCheckListModule` |
| **官方文檔** | [CheckList](https://ng.ant.design/components/check-list/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/71-CheckList.md) |

#### [HashCode - 哈希碼](./NG-ZORRO-Index/72-HashCode.md)

| 項目 | 內容 |
|------|------|
| **模組導入** | `NzHashCodeModule` |
| **官方文檔** | [HashCode](https://ng.ant.design/components/hash-code/en) |
| **Schematics 命令** | 暫無專用 schematics |
| **詳細文檔** | [查看詳細文檔](./NG-ZORRO-Index/72-HashCode.md) |

- --

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

#### 完整 Schematics 命令列表

> **說明**：以下列出所有已知的組件 Schematics 命令。每個組件的詳細命令請參考上方「組件清單」章節。

**Form 組件 Schematics：**

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

**Tree 組件 Schematics：**

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

> **注意**：
> - 更多組件模板請參考 [NG-ZORRO Schematics 文檔](https://ng.ant.design/docs/schematics/en)
> - 每個組件的官方文檔頁面通常會列出該組件可用的 Schematics 命令
> - 並非所有組件都有 Schematics，大部分組件需要手動編寫代碼

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

- --

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

- --

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

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**版本**：v1.2

- --

## 更新日誌

### v1.2 (2025-01-15)
- ✅ 創建 `NG-ZORRO-Index/` 資料夾，為所有 72 個組件創建獨立文檔
- ✅ 更新主索引文檔，將所有組件標題改為連結形式
- ✅ 每個組件文檔包含基本信息、使用方式、基本用法和相關資源
- ✅ 完善 Tree 和 Form 組件的 Schematics 命令列表

### v1.1 (2025-01-15)
- ✅ 完善所有組件的 Schematics 命令列表
- ✅ 為 Tree 組件添加 10 個詳細的 Schematics 命令
- ✅ 為 Form 組件添加 7 個詳細的 Schematics 命令
- ✅ 優化文檔結構，每個組件獨立章節，更易查找
- ✅ 在 CLI Schematics 指令章節添加完整命令列表

### v1.0 (2025-01-15)
- ✅ 初始版本，包含 72 個組件清單
- ✅ 基本 CLI 指令說明


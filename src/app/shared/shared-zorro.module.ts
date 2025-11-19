import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzCheckListModule } from 'ng-zorro-antd/check-list';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzCronExpressionModule } from 'ng-zorro-antd/cron-expression';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGraphModule } from 'ng-zorro-antd/graph';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzHashCodeModule } from 'ng-zorro-antd/hash-code';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMentionModule } from 'ng-zorro-antd/mention';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzWaterMarkModule } from 'ng-zorro-antd/water-mark';
// 代碼編輯器組件 — https://ng.ant.design/components/code-editor/en
// Cron 表達式組件 — https://ng.ant.design/components/cron-expression/en
// 圖形組件 — https://ng.ant.design/components/graph/en
// 可調整大小指令 — https://ng.ant.design/components/resizable/en
// 管道模組 — https://ng.ant.design/components/pipes/en

export const SHARED_ZORRO_MODULES = [
  // 反饋類組件
  NzAlertModule, // Alert 警告提示 - https://ng.ant.design/components/alert/en
  NzResultModule, // Result 結果 - https://ng.ant.design/components/result/en
  NzSkeletonModule, // Skeleton 骨架屏 - https://ng.ant.design/components/skeleton/en
  NzSpinModule, // Spin 加載中 - https://ng.ant.design/components/spin/en
  NzProgressModule, // Progress 進度條 - https://ng.ant.design/components/progress/en
  NzDrawerModule, // Drawer 抽屜 - https://ng.ant.design/components/drawer/en
  NzModalModule, // Modal 對話框 - https://ng.ant.design/components/modal/en
  NzPopconfirmModule, // Popconfirm 氣泡確認框 - https://ng.ant.design/components/popconfirm/en
  // 注意：Message 和 Notification 在 ng-zorro-antd v20+ 中通過服務提供（NzMessageService, NzNotificationService）
  // 不需要導入模組，可直接注入使用
  // 數據展示類組件
  NzAvatarModule, // Avatar 頭像 - https://ng.ant.design/components/avatar/en
  NzBadgeModule, // Badge 徽標數 - https://ng.ant.design/components/badge/en
  NzCalendarModule, // Calendar 日曆 - https://ng.ant.design/components/calendar/en
  NzCardModule, // Card 卡片 - https://ng.ant.design/components/card/en
  NzCarouselModule, // Carousel 走馬燈 - https://ng.ant.design/components/carousel/en
  NzCollapseModule, // Collapse 折疊面板 - https://ng.ant.design/components/collapse/en
  NzCommentModule, // Comment 評論 - https://ng.ant.design/components/comment/en
  NzDescriptionsModule, // Descriptions 描述列表 - https://ng.ant.design/components/descriptions/en
  NzEmptyModule, // Empty 空狀態 - https://ng.ant.design/components/empty/en
  NzImageModule, // Image 圖片 - https://ng.ant.design/components/image/en
  NzListModule, // List 列表 - https://ng.ant.design/components/list/en
  NzPopoverModule, // Popover 氣泡卡片 - https://ng.ant.design/components/popover/en
  NzQRCodeModule, // QRCode 二維碼 - https://ng.ant.design/components/qr-code/en
  NzSegmentedModule, // Segmented 分段控制器 - https://ng.ant.design/components/segmented/en
  NzStatisticModule, // Statistic 統計 - https://ng.ant.design/components/statistic/en
  NzTableModule, // Table 表格 - https://ng.ant.design/components/table/en
  NzTagModule, // Tag 標籤 - https://ng.ant.design/components/tag/en
  NzTimelineModule, // Timeline 時間軸 - https://ng.ant.design/components/timeline/en
  NzTooltipModule, // Tooltip 文字提示 - https://ng.ant.design/components/tooltip/en
  NzTreeModule, // Tree 樹形控件 - https://ng.ant.design/components/tree/en
  NzTreeViewModule, // TreeView 樹視圖 - https://ng.ant.design/components/tree-view/en
  // 數據錄入類組件
  NzAutocompleteModule, // AutoComplete 自動完成 - https://ng.ant.design/components/auto-complete/en
  NzCascaderModule, // Cascader 級聯選擇 - https://ng.ant.design/components/cascader/en
  NzCheckboxModule, // Checkbox 多選框 - https://ng.ant.design/components/checkbox/en
  NzColorPickerModule, // ColorPicker 顏色選擇器 - https://ng.ant.design/components/color-picker/en
  NzDatePickerModule, // DatePicker 日期選擇框 - https://ng.ant.design/components/date-picker/en
  NzFormModule, // Form 表單 - https://ng.ant.design/components/form/en
  NzInputModule, // Input 輸入框 - https://ng.ant.design/components/input/en
  NzInputNumberModule, // InputNumber 數字輸入框 - https://ng.ant.design/components/input-number/en
  NzMentionModule, // Mention 提及 - https://ng.ant.design/components/mention/en
  NzRadioModule, // Radio 單選框 - https://ng.ant.design/components/radio/en
  NzRateModule, // Rate 評分 - https://ng.ant.design/components/rate/en
  NzSelectModule, // Select 選擇器 - https://ng.ant.design/components/select/en
  NzSliderModule, // Slider 滑動輸入條 - https://ng.ant.design/components/slider/en
  NzSwitchModule, // Switch 開關 - https://ng.ant.design/components/switch/en
  NzTimePickerModule, // TimePicker 時間選擇框 - https://ng.ant.design/components/time-picker/en
  NzTransferModule, // Transfer 穿梭框 - https://ng.ant.design/components/transfer/en
  NzTreeSelectModule, // TreeSelect 樹選擇 - https://ng.ant.design/components/tree-select/en
  NzUploadModule, // Upload 上傳 - https://ng.ant.design/components/upload/en
  // 佈局類組件
  NzDividerModule, // Divider 分割線 - https://ng.ant.design/components/divider/en
  NzFlexModule, // Flex 彈性佈局 - https://ng.ant.design/components/flex/en
  NzGridModule, // Grid 柵格 - https://ng.ant.design/components/grid/en
  NzLayoutModule, // Layout 佈局 - https://ng.ant.design/components/layout/en
  NzSpaceModule, // Space 間距 - https://ng.ant.design/components/space/en
  NzSplitterModule, // Splitter 分隔面板 - https://ng.ant.design/components/splitter/en
  // 通用類組件
  NzButtonModule, // Button 按鈕 - https://ng.ant.design/components/button/en
  NzFloatButtonModule, // FloatButton 懸浮按鈕 - https://ng.ant.design/components/float-button/en
  NzIconModule, // Icon 圖標 - https://ng.ant.design/components/icon/en
  NzTypographyModule, // Typography 排版 - https://ng.ant.design/components/typography/en
  // 導航類組件
  NzAnchorModule, // Anchor 錨點 - https://ng.ant.design/components/anchor/en
  NzBreadCrumbModule, // Breadcrumb 麵包屑 - https://ng.ant.design/components/breadcrumb/en
  NzDropDownModule, // Dropdown 下拉菜單 - https://ng.ant.design/components/dropdown/en
  NzMenuModule, // Menu 導航菜單 - https://ng.ant.design/components/menu/en
  NzPageHeaderModule, // PageHeader 頁頭 - https://ng.ant.design/components/page-header/en
  NzPaginationModule, // Pagination 分頁 - https://ng.ant.design/components/pagination/en
  NzStepsModule, // Steps 步驟條 - https://ng.ant.design/components/steps/en
  NzTabsModule, // Tabs 標籤頁 - https://ng.ant.design/components/tabs/en
  // 其他類組件
  NzAffixModule, // Affix 固釘 - https://ng.ant.design/components/affix/en
  NzBackTopModule, // BackTop 返回頂部 - https://ng.ant.design/components/back-top/en
  NzWaterMarkModule, // WaterMark 水印 - https://ng.ant.design/components/water-mark/en
  // 特色組件
  NzCheckListModule, // CheckList 任務清單 - https://ng.ant.design/components/check-list/en
  NzHashCodeModule, // HashCode 哈希碼 - https://ng.ant.design/components/hash-code/en
  NzCodeEditorModule, // CodeEditor 代碼編輯器 - https://ng.ant.design/components/code-editor/en
  NzCronExpressionModule, // CronExpression Cron 表達式 - https://ng.ant.design/components/cron-expression/en
  NzGraphModule, // Graph 圖形 - https://ng.ant.design/components/graph/en
  NzResizableModule, // Resizable 可調整大小 - https://ng.ant.design/components/resizable/en
  // 管道模組（包含：NzAggregatePipe, NzBytesPipe, NzEllipsisPipe, NzSanitizerPipe, NzToCssUnitPipe, NzTrimPipe）
  NzPipesModule // Pipes 管道集合 - https://ng.ant.design/components/pipes/en
];

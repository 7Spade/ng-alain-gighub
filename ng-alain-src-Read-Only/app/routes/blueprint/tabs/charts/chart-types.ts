/**
 * 圖表數據類型定義
 * 用於替代 any[] 類型，提供類型安全
 */

/**
 * 餅圖數據
 */
export interface PieChartData {
  x: string; // 分類名稱
  y: number; // 數值
}

/**
 * 柱狀圖數據
 */
export interface BarChartData {
  x: string; // X 軸標籤
  y: number; // Y 軸數值
}

/**
 * 折線圖/面積圖數據
 */
export interface LineChartData {
  x: string; // X 軸標籤（通常是時間）
  y: number; // Y 軸數值
}

/**
 * 雷達圖數據
 * 符合 G2RadarData 格式：{ name, label, value }
 */
export interface RadarChartData {
  name: string; // 系列名稱（如：個人、團隊）
  label: string; // 維度標籤（如：引用、口碑）
  value: number; // 數值
}

/**
 * 時間軸數據
 * 符合 G2TimelineData 格式：{ time, y1, y2 }
 */
export interface TimelineData {
  time: number; // 時間戳（毫秒）
  y1: number; // 第一個數值
  y2: number; // 第二個數值
}

/**
 * 標籤雲數據
 */
export interface TagCloudData {
  name: string; // 標籤名稱
  value: number; // 權重/數值
}

/**
 * ECharts 組合圖數據
 */
export interface EChartsCombinedData {
  date: string; // 日期
  tasks: number; // 任務數
  progress: number; // 進度百分比
}

/**
 * Task Model
 *
 * 完整任務模型（組合所有維度）
 * 對應 @ETMS_DESIGN_SPEC.md 文件：完整任務模型
 *
 * 此模型整合所有任務維度：
 * - 任務本體（Identity）
 * - 時間、關聯、空間、資源、進度、成本
 * - 品質、風險、安全、溝通、變更
 *
 * 提供完整的任務資料結構，供業務邏輯與 UI 層使用。
 *
 * @see @ETMS_DESIGN_SPEC.md 完整任務模型
 */

import type { TaskIdentityComplete } from './task-identity.model';
import type { TaskChange } from '../change/task-change.model';
import type { TaskCommunication } from '../communication/task-communication.model';
import type { TaskCost } from '../cost/task-cost.model';
import type { TaskDependency, TaskDependencyOverview } from '../dependency/task-dependency.model';
import type { TaskDocument } from '../document/task-document.model';
import type { TaskLocation, TaskLocationOverview } from '../location/task-location.model';
import type { TaskProgress } from '../progress/task-progress.model';
import type { TaskQuality } from '../quality/task-quality.model';
import type { TaskResource } from '../resource/task-resource.model';
import type { TaskRisk } from '../risk/task-risk.model';
import type { TaskSafety } from '../safety/task-safety.model';
import type { TaskScheduleSummary, TaskTime } from '../time/task-time.model';

/**
 * 完整任務介面，組合所有維度
 *
 * 繼承 TaskIdentityComplete 以包含任務本體的所有屬性（name, parentId 等）
 * 並添加其他 12 個維度的可選屬性
 */
export interface Task extends TaskIdentityComplete {
  time?: TaskTime;
  scheduleSummary?: TaskScheduleSummary;
  dependency?: TaskDependency;
  dependencyOverview?: TaskDependencyOverview;
  location?: TaskLocation;
  locationOverview?: TaskLocationOverview;
  resource?: TaskResource;
  progress?: TaskProgress;
  cost?: TaskCost;
  quality?: TaskQuality;
  risk?: TaskRisk;
  safety?: TaskSafety;
  document?: TaskDocument;
  communication?: TaskCommunication;
  change?: TaskChange;
}

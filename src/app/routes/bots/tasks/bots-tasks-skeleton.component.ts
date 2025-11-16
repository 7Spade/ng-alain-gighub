import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-bots-tasks-skeleton',
  imports: [SHARED_IMPORTS],
  templateUrl: './bots-tasks-skeleton.component.html',
  styleUrl: './bots-tasks-skeleton.component.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BotsTasksSkeletonComponent {
  /**
   * 建立範例機器人任務
   * 此功能目前未實作，僅作為 UI 骨架展示
   */
  createSampleBotTask(): void {
    console.log('建立範例機器人任務 (未實作)');
  }
}

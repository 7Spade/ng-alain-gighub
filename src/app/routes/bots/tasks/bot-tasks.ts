import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-bot-tasks',
  imports: [SHARED_IMPORTS],
  templateUrl: './bot-tasks.html',
  styleUrl: './bot-tasks.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BotTasksComponent {
  /**
   * 建立範例機器人任務
   * 此功能目前未實作，僅作為 UI 骨架展示
   */
  createSampleBotTask(): void {
    console.log('建立範例機器人任務 (未實作)');
  }
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import type { G2MiniBarData } from '@delon/chart/mini-bar';
import { _HttpClient } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

interface TodoItem {
  completed: boolean;
  avatar: string;
  name: string;
  content: string;
}

@Component({
  selector: 'app-widgets',
  standalone: true,
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class WidgetsComponent {
  readonly msg = inject(NzMessageService);
  private readonly http = inject(_HttpClient);

  readonly data = signal<G2MiniBarData[]>([]);
  readonly smallData = signal<G2MiniBarData[]>([]);
  readonly todoData = signal<TodoItem[]>([
    {
      completed: true,
      avatar: '1',
      name: '蘇先生',
      content: `請告訴我，我應該說點什麼好？`
    },
    {
      completed: false,
      avatar: '2',
      name: 'はなさき',
      content: `ハルカソラトキヘダツヒカリ`
    },
    {
      completed: false,
      avatar: '3',
      name: 'cipchk',
      content: `this world was never meant for one as beautiful as you.`
    },
    {
      completed: false,
      avatar: '4',
      name: 'Kent',
      content: `my heart is beating with hers`
    },
    {
      completed: false,
      avatar: '5',
      name: 'Are you',
      content: `They always said that I love beautiful girl than my friends`
    },
    {
      completed: false,
      avatar: '6',
      name: 'Forever',
      content: `Walking through green fields ，sunshine in my eyes.`
    }
  ]);
  readonly like = signal(false);
  readonly dislike = signal(false);

  constructor() {
    // 初始化時載入數據
    this.http.get('/chart/visit').subscribe((res: G2MiniBarData[]) => {
      this.data.set(res);
      this.smallData.set(res.slice(0, 6));
    });
  }

  // 輔助方法：切換 todo 項目的完成狀態
  toggleTodo(index: number): void {
    const items = this.todoData();
    items[index] = { ...items[index], completed: !items[index].completed };
    this.todoData.set([...items]);
  }

  // 輔助方法：刪除 todo 項目
  deleteTodo(index: number): void {
    const items = this.todoData();
    items.splice(index, 1);
    this.todoData.set([...items]);
  }
}

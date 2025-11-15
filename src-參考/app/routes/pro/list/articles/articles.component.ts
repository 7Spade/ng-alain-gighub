import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-list-articles',
  standalone: true,
  templateUrl: './articles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class ProListArticlesComponent implements OnInit {
  private readonly http = inject(_HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  q = {
    ps: 5,
    categories: [],
    owners: ['zxx'],
    user: '',
    rate: ''
  };

  list: any[] = [];
  loading = false;

  categories = [
    { id: 0, text: '全部', value: false },
    { id: 1, text: '類目一', value: false },
    { id: 2, text: '類目二', value: false },
    { id: 3, text: '類目三', value: false },
    { id: 4, text: '類目四', value: false },
    { id: 5, text: '類目五', value: false },
    { id: 6, text: '類目六', value: false },
    { id: 7, text: '類目七', value: false },
    { id: 8, text: '類目八', value: false },
    { id: 9, text: '類目九', value: false },
    { id: 10, text: '類目十', value: false },
    { id: 11, text: '類目十一', value: false },
    { id: 12, text: '類目十二', value: false }
  ];

  owners = [
    {
      id: 'wzj',
      name: '我自己'
    },
    {
      id: 'wjh',
      name: '吳家豪'
    },
    {
      id: 'zxx',
      name: '周星星'
    },
    {
      id: 'zly',
      name: '趙麗穎'
    },
    {
      id: 'ym',
      name: '姚明'
    }
  ];

  changeCategory(status: boolean, idx: number): void {
    if (idx === 0) {
      this.categories.map(i => (i.value = status));
    } else {
      this.categories[idx].value = status;
    }
  }

  setOwner(): void {
    this.q.owners = [`wzj`];
    // TODO: wait nz-dropdown OnPush mode
    setTimeout(() => this.cdr.detectChanges());
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(more = false): void {
    this.loading = true;
    this.http.get('/api/list', { count: this.q.ps }).subscribe(res => {
      this.list = more ? this.list.concat(res) : res;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }
}

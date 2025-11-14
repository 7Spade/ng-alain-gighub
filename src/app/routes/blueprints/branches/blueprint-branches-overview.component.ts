import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

type BranchNode = {
  readonly title: string;
  readonly key: string;
  readonly children?: BranchNode[];
};

type BranchRow = {
  readonly name: string;
  readonly owner: string;
  readonly changes: number;
  readonly updatedAt: string;
};

@Component({
  selector: 'app-blueprint-branches-overview',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-page-header [nzTitle]="'分支管理骨架'" [nzSubtitle]="'示意列表＋樹狀結構'">
      <nz-page-header-extra>
        <button nz-button nzType="default">
          <span nz-icon nzType="fork"></span>
          建立分支
        </button>
        <button nz-button nzType="primary">
          <span nz-icon nzType="api"></span>
          套用策略
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="page-section">
      <nz-row [nzGutter]="16">
        <nz-col nzXs="24" nzXl="8">
          <nz-card nzTitle="分支樹">
            <nz-tree nzBlockNode [nzData]="branchTree"></nz-tree>
          </nz-card>
        </nz-col>
        <nz-col nzXs="24" nzXl="16">
          <nz-card nzTitle="分支列表">
            <nz-table [nzData]="branchTable" nzSize="middle">
              <thead>
                <tr>
                  <th>名稱</th>
                  <th>負責人</th>
                  <th>變更數</th>
                  <th>最近更新</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                @for (row of branchTable; track row.name) {
                  <tr>
                    <td>{{ row.name }}</td>
                    <td>{{ row.owner }}</td>
                    <td>
                      <nz-badge nzStatus="processing" [nzText]="row.changes + ' commits'"></nz-badge>
                    </td>
                    <td>{{ row.updatedAt }}</td>
                    <td>
                      <button nz-button nzType="link">檢視</button>
                      <button nz-button nzType="link">比較</button>
                    </td>
                  </tr>
                }
              </tbody>
            </nz-table>
          </nz-card>
        </nz-col>
      </nz-row>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page-section {
        padding: 16px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlueprintBranchesOverviewComponent {
  protected readonly branchTree: BranchNode[] = [
    {
      title: 'main',
      key: 'main',
      children: [
        {
          title: 'release/2402',
          key: 'release/2402',
          children: [
            { title: 'hotfix/api', key: 'release/2402/hotfix' },
            { title: 'docs/review', key: 'release/2402/docs' }
          ]
        },
        {
          title: 'feature/blueprint-hub',
          key: 'feature/blueprint-hub',
          children: [{ title: 'experiment/tabs', key: 'experiment/tabs' }]
        }
      ]
    }
  ];

  protected readonly branchTable: BranchRow[] = [
    { name: 'main', owner: 'System', changes: 1, updatedAt: '11:20' },
    { name: 'release/2402', owner: 'Release Guild', changes: 7, updatedAt: '10:50' },
    { name: 'feature/blueprint-hub', owner: 'Blueprint Squad', changes: 3, updatedAt: '10:12' }
  ];
}


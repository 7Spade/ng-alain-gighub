import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import type { NzUploadFile } from 'ng-zorro-antd/upload';

type PhotoItem = {
  readonly name: string;
  readonly thumbUrl: string;
  readonly datetime: string;
};

@Component({
  selector: 'app-issue-photos-wall',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-page-header [nzTitle]="'照片牆骨架'" [nzSubtitle]="'示意圖片佔位'">
      <nz-page-header-extra>
        <button nz-button nzType="default">
          <span nz-icon nzType="cloud-upload"></span>
          上傳
        </button>
        <button nz-button nzType="primary">
          <span nz-icon nzType="picture"></span>
          開啟檢視器
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <div class="page-section">
      <nz-upload nzListType="picture-card" [nzFileList]="photoFileList">
        <button nz-button>
          <span nz-icon nzType="plus"></span>
          新增
        </button>
      </nz-upload>

      <nz-card nzTitle="拍攝紀錄">
        <nz-table [nzData]="photoFileList" nzSize="small">
          <thead>
            <tr>
              <th>檔名</th>
              <th>時間</th>
            </tr>
          </thead>
          <tbody>
            @for (item of photoFileList; track item.uid) {
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.datetime }}</td>
              </tr>
            }
          </tbody>
        </nz-table>
      </nz-card>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page-section {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssuePhotosWallComponent {
  protected readonly photoFileList: (PhotoItem & NzUploadFile)[] = [
    {
      uid: '1',
      name: 'evidence-1.png',
      thumbUrl: 'https://via.placeholder.com/200x120.png?text=Evidence+1',
      datetime: '2025-11-14 09:20'
    },
    {
      uid: '2',
      name: 'evidence-2.png',
      thumbUrl: 'https://via.placeholder.com/200x120.png?text=Evidence+2',
      datetime: '2025-11-14 09:40'
    }
  ];
}


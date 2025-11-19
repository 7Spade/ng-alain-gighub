import { Component } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-delon-form',
  standalone: true,
  templateUrl: './form.component.html',
  imports: SHARED_IMPORTS
})
export class DelonFormComponent {
  params: any = {};
  url = `/user`;
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '編號'
      }
    }
  };
  columns: STColumn[] = [
    { title: '編號', index: 'no' },
    { title: '調用次數', type: 'number', index: 'callNo' },
    { title: '頭像', type: 'img', width: '50px', index: 'avatar' },
    { title: '時間', type: 'date', index: 'updatedAt' }
  ];
}

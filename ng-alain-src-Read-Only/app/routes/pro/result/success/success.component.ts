import { Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-result-success',
  standalone: true,
  templateUrl: './success.component.html',
  imports: [SHARED_IMPORTS]
})
export class ProResultSuccessComponent {
  readonly msg = inject(NzMessageService);
}

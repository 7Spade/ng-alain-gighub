import { Component, inject, input } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'passport-register-result',
  standalone: true,
  templateUrl: './register-result.component.html',
  imports: [SHARED_IMPORTS]
})
export class UserRegisterResultComponent {
  readonly msg = inject(NzMessageService);
  readonly email = input('');
}

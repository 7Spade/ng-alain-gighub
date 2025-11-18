import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-account-settings-binding',
  standalone: true,
  templateUrl: './binding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class ProAccountSettingsBindingComponent {
  readonly msg = inject(NzMessageService);
}

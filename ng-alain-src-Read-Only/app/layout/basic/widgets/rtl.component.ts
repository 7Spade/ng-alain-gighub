import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RTLService } from '@delon/theme';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'header-rtl',
  template: `
    <i nz-icon [nzType]="rtl.nextDir === 'rtl' ? 'border-left' : 'border-right'"></i>
    {{ rtl.nextDir | uppercase }}
  `,
  host: {
    '[class.flex-1]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class HeaderRTLComponent {
  readonly rtl = inject(RTLService);

  @HostListener('click')
  toggleDirection(): void {
    this.rtl.toggle();
  }
}

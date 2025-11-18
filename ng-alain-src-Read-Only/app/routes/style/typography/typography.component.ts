import { Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

import { ColorService } from '../color.service';

@Component({
  selector: 'app-typography',
  standalone: true,
  templateUrl: './typography.component.html',
  imports: SHARED_IMPORTS
})
export class TypographyComponent {
  private readonly colorSrv = inject(ColorService);
  get names(): string[] {
    return this.colorSrv.names;
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

import { OverviewFacade } from '../../../state/overview.facade';

@Component({
  selector: 'app-blueprint-overview-page',
  standalone: true,
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS],
  providers: [OverviewFacade]
})
export class OverviewPageComponent {
  readonly vm = inject(OverviewFacade);
}

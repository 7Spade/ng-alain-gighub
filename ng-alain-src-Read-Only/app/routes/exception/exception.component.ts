import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExceptionType } from '@delon/abc/exception';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-exception',
  standalone: true,
  template: ` <exception [type]="type" style="min-height: 500px; height: 80%;" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class ExceptionComponent {
  private readonly route = inject(ActivatedRoute);
  get type(): ExceptionType {
    return this.route.snapshot.data['type'];
  }
}

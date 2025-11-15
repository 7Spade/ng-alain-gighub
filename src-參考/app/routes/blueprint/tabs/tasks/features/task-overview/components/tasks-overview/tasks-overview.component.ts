import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared-imports';

import { TaskOverviewPresenter } from '../../services/task-overview.presenter';

@Component({
  selector: 'app-blueprint-tasks-overview',
  standalone: true,
  templateUrl: './tasks-overview.component.html',
  styleUrls: ['./tasks-overview.component.less', '../../task-hierarchy-table/task-hierarchy-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class BlueprintTasksOverviewComponent extends TaskOverviewPresenter {
  constructor() {
    super();
  }
}

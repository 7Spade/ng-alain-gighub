import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import type {
  AggregationDistributionEntry,
  BlueprintDocumentDirectoryEntry,
  BlueprintDocumentListItem
} from '@shared/models/blueprint-aggregation.model';
import { TaskDocumentsPanelComponent } from '@tasks/features/task-document/components/task-documents-panel/task-documents-panel.component';

import { BlueprintDocumentsFacade } from './shared/state/blueprint-documents.facade';

@Component({
  selector: 'app-blueprint-documents',
  standalone: true,
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS, TaskDocumentsPanelComponent]
})
export class BlueprintDocumentsComponent {
  readonly vm = inject(BlueprintDocumentsFacade);

  formatBytes(bytes?: number | null): string {
    if (!bytes) {
      return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let index = 0;
    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }
    return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
  }

  trackByDistribution(_index: number, item: AggregationDistributionEntry): string {
    return item.key;
  }

  trackByDirectory(_index: number, item: BlueprintDocumentDirectoryEntry): string {
    return item.directoryId ?? item.directoryPath;
  }

  trackByRecent(_index: number, item: BlueprintDocumentListItem): string {
    return item.id;
  }
}

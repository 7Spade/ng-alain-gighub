import { ChangeDetectionStrategy, Component, Input, input, output } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';
import type { NzFormatEmitEvent } from 'ng-zorro-antd/tree';

import type { DocumentTreeNode } from '../document-tree-node.model';

@Component({
  selector: 'app-document-tree-panel',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card [nzBordered]="false" [nzTitle]="treeTitle" [nzExtra]="treeExtra">
      <ng-template #treeTitle>
        <span>文件結構</span>
      </ng-template>
      <ng-template #treeExtra>
        <button nz-button nzType="primary" nzSize="small" (click)="onCreateFolder()">
          <i nz-icon nzType="folder-add"></i>
          新建目錄
        </button>
      </ng-template>

      @if (!treeData().length) {
        <nz-empty nzNotFoundContent="尚無文件">
          <button *nzButton="null" nz-button nzType="primary" (click)="onCreateFolder()"> 創建第一個目錄 </button>
        </nz-empty>
      } @else {
        <nz-tree
          [nzData]="treeData()"
          [nzCheckable]="false"
          [nzShowLine]="true"
          [nzShowIcon]="true"
          [nzExpandedKeys]="expandedKeys()"
          [nzSelectedKeys]="selectedKey ? [selectedKey] : []"
          (nzClick)="onTreeSelect($event)"
          (nzExpandChange)="onTreeExpand($event)"
        >
          <ng-template #nzTreeTemplate let-node>
            <span class="tree-node" [class.is-selected]="selectedKey === node.key">
              @if (node.origin.document.type === 'directory') {
                <i nz-icon nzType="folder" class="mr-sm"></i>
              } @else {
                <i nz-icon nzType="file" class="mr-sm"></i>
              }
              {{ node.title }}
            </span>
          </ng-template>
        </nz-tree>
      }
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentTreePanelComponent {
  readonly treeData = input.required<DocumentTreeNode[]>();
  readonly expandedKeys = input.required<string[]>();
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input() selectedKey: string | null = null;

  readonly treeSelect = output<NzFormatEmitEvent>();
  readonly treeExpand = output<NzFormatEmitEvent>();
  readonly createFolder = output<void>();

  protected onTreeSelect(event: NzFormatEmitEvent): void {
    this.treeSelect.emit(event);
  }

  protected onTreeExpand(event: NzFormatEmitEvent): void {
    this.treeExpand.emit(event);
  }

  protected onCreateFolder(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.createFolder.emit();
  }
}

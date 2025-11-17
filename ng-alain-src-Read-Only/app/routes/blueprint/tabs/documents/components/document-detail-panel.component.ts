import { ChangeDetectionStrategy, Component, Input, input, output } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import type { BlueprintDocument, BlueprintDocumentVersion } from '@shared';
import { SHARED_IMPORTS } from '@shared';
import type { NzBeforeUploadFileType, NzUploadChangeParam, NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-detail-panel',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    @if (document(); as doc) {
      <nz-card [nzBordered]="false" [nzTitle]="docTitle" [nzExtra]="docExtra">
        <ng-template #docTitle>
          <span>
            @if (doc.type === 'directory') {
              <i nz-icon nzType="folder"></i>
            } @else {
              <i nz-icon nzType="file"></i>
            }
            {{ doc.name }}
          </span>
        </ng-template>
        <ng-template #docExtra>
          <button nz-button nzType="link" nzDanger (click)="onDelete(doc)">
            <i nz-icon nzType="delete"></i>
            刪除
          </button>
        </ng-template>

        <nz-tabs [nzSelectedIndex]="selectedTabIndex()" (nzSelectedIndexChange)="onTabChange($event)">
          <nz-tab nzTitle="基本資訊">
            <div class="mt-md">
              <div class="info-item mb-md"> <strong>名稱：</strong>{{ doc.name }} </div>
              <div class="info-item mb-md"> <strong>路徑：</strong>{{ doc.path }} </div>
              <div class="info-item mb-md">
                <strong>類型：</strong>
                <nz-tag>{{ doc.type === 'directory' ? '目錄' : '文件' }}</nz-tag>
              </div>
              @if (doc.type === 'file') {
                <div class="info-item mb-md"> <strong>MIME 類型：</strong>{{ doc.mime_type || '未知' }} </div>
                <div class="info-item mb-md"> <strong>文件大小：</strong>{{ formatFileSize()(doc.size) }} </div>
                <div class="info-item mb-md"> <strong>當前版本：</strong>v{{ doc.current_version }} </div>
              }
              <div class="info-item mb-md"> <strong>創建時間：</strong>{{ formatDate()(doc.created_at) }} </div>
              <div class="info-item mb-md"> <strong>更新時間：</strong>{{ formatDate()(doc.updated_at) }} </div>
            </div>
            @if (metadataForm) {
              <form
                nz-form
                [formGroup]="metadataForm"
                nzLayout="vertical"
                class="mt-lg document-metadata-form"
                (ngSubmit)="onSaveMetadata()"
              >
                @if (doc.type === 'directory') {
                  <nz-alert nzType="info" nzMessage="設定將套用於此目錄內新上傳的文件" nzShowIcon class="mb-md"></nz-alert>
                }
                <div nz-row [nzGutter]="16">
                  <div nz-col nzXs="24" nzSm="12">
                    <nz-form-item>
                      <nz-form-label>專業（Discipline）</nz-form-label>
                      <nz-form-control>
                        <input nz-input formControlName="discipline" placeholder="輸入專業（可留空）" />
                      </nz-form-control>
                    </nz-form-item>
                  </div>
                  <div nz-col nzXs="24" nzSm="12">
                    <nz-form-item>
                      <nz-form-label>施工階段（Phase）</nz-form-label>
                      <nz-form-control>
                        <input nz-input formControlName="phase" placeholder="輸入施工階段（可留空）" />
                      </nz-form-control>
                    </nz-form-item>
                  </div>
                  <div nz-col nzXs="24" nzSm="12">
                    <nz-form-item>
                      <nz-form-label>工作包（Package）</nz-form-label>
                      <nz-form-control>
                        <input nz-input formControlName="package" placeholder="輸入工作包（可留空）" />
                      </nz-form-control>
                    </nz-form-item>
                  </div>
                </div>
                <div class="metadata-actions">
                  <button nz-button nzType="default" type="button" (click)="onResetMetadata()" [disabled]="metadataSaving()">重設</button>
                  @if (doc.type === 'file') {
                    <button
                      nz-button
                      nzType="primary"
                      type="submit"
                      [disabled]="metadataSaving() || !metadataForm.dirty"
                      [nzLoading]="metadataSaving()"
                    >
                      儲存分類
                    </button>
                  } @else {
                    <span class="text-muted">套用於新檔案，選取文件後可儲存分類。</span>
                  }
                </div>
              </form>
            }
          </nz-tab>

          @if (doc.type === 'file') {
            <nz-tab nzTitle="版本歷史">
              @if (!documentVersions().length) {
                <nz-empty nzNotFoundContent="尚無版本歷史"></nz-empty>
              } @else {
                <nz-list nzBordered [nzDataSource]="documentVersions()" [nzRenderItem]="versionItem">
                  <ng-template #versionItem let-item>
                    <nz-list-item>
                      <nz-list-item-meta>
                        <nz-list-item-meta-title>
                          <div class="flex justify-between align-center">
                            <span>
                              <strong>v{{ item.version }}</strong>
                              @if (item.version === doc.current_version) {
                                <nz-tag nzColor="green" class="ml-sm">當前版本</nz-tag>
                              }
                            </span>
                            <span class="text-muted">{{ formatDate()(item.created_at) }}</span>
                          </div>
                        </nz-list-item-meta-title>
                        <nz-list-item-meta-description>
                          @if (item.change_description) {
                            <p class="mb-0">{{ item.change_description }}</p>
                          } @else {
                            <p class="mb-0 text-muted">無變更說明</p>
                          }
                        </nz-list-item-meta-description>
                      </nz-list-item-meta>
                    </nz-list-item>
                  </ng-template>
                </nz-list>
              }
            </nz-tab>

            <nz-tab nzTitle="上傳新版本">
              <ng-template
                [ngTemplateOutlet]="uploadSection"
                [ngTemplateOutletContext]="{ multiple: false, descriptionTpl: versionDescription, doc: doc }"
              ></ng-template>
            </nz-tab>
          } @else if (doc.type === 'directory') {
            <nz-tab nzTitle="上傳文件">
              <ng-template
                [ngTemplateOutlet]="uploadSection"
                [ngTemplateOutletContext]="{ multiple: true, descriptionTpl: directoryDescription, doc: doc }"
              ></ng-template>
            </nz-tab>
          }
        </nz-tabs>
      </nz-card>
    } @else {
      <nz-card [nzBordered]="false">
        <nz-empty nzNotFoundContent="請選擇一個文件或目錄查看詳情"></nz-empty>
      </nz-card>
    }

    <ng-template #uploadSection let-multiple="multiple" let-descriptionTpl="descriptionTpl" let-doc="doc">
      <div class="mt-md">
        <nz-upload
          [nzFileList]="fileList()"
          (nzFileListChange)="onFileListChange($event)"
          [nzBeforeUpload]="beforeUpload()"
          [nzCustomRequest]="uploadRequest()"
          (nzChange)="onUploadChange($event)"
          [nzMultiple]="multiple"
          [nzDisabled]="uploading()"
        >
          <button nz-button [disabled]="uploading()">
            <i nz-icon nzType="upload"></i>
            選擇檔案
          </button>
        </nz-upload>
        <div class="mt-md text-muted">
          <ng-container *ngTemplateOutlet="descriptionTpl; context: { $implicit: doc }"></ng-container>
        </div>
      </div>
    </ng-template>

    <ng-template #versionDescription>
      <p>上傳後將建立新的版本記錄，並更新目前文件內容。</p>
    </ng-template>

    <ng-template #directoryDescription let-doc="doc">
      <p>檔案會新增至目前目錄：{{ doc.path || '/' }}。</p>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentDetailPanelComponent {
  readonly document = input<BlueprintDocument | null>(null);
  readonly documentVersions = input<BlueprintDocumentVersion[]>([]);
  readonly selectedTabIndex = input(0);
  readonly fileList = input<NzUploadFile[]>([]);
  readonly uploading = input(false);
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input() metadataForm: FormGroup | null = null;
  readonly metadataSaving = input(false);

  readonly beforeUpload = input.required<(file: NzUploadFile, fileList: NzUploadFile[]) => NzBeforeUploadFileType>();
  readonly uploadRequest = input.required<(item: NzUploadXHRArgs) => Subscription>();
  readonly handleUploadChange = input.required<(info: NzUploadChangeParam) => void | Promise<void>>();
  readonly formatFileSize = input.required<(bytes: number | null | undefined) => string>();
  readonly formatDate = input.required<(value: string | null | undefined) => string>();

  readonly selectedTabIndexChange = output<number>();
  readonly deleteDocument = output<BlueprintDocument>();
  readonly fileListChange = output<NzUploadFile[]>();
  readonly saveMetadata = output<void>();
  readonly resetMetadata = output<void>();

  protected onTabChange(index: number): void {
    this.selectedTabIndexChange.emit(index);
  }

  protected onDelete(document: BlueprintDocument): void {
    this.deleteDocument.emit(document);
  }

  protected onFileListChange(fileList: NzUploadFile[]): void {
    this.fileListChange.emit(fileList);
  }

  protected onUploadChange(event: NzUploadChangeParam): void {
    void this.handleUploadChange()(event);
  }

  protected onSaveMetadata(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.saveMetadata.emit();
  }

  protected onResetMetadata(): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.resetMetadata.emit();
  }
}

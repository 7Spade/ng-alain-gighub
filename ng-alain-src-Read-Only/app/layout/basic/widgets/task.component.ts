import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'header-task',
  template: `
    <div
      class="alain-default__nav-item"
      nz-dropdown
      [nzDropdownMenu]="taskMenu"
      nzTrigger="click"
      nzPlacement="bottomRight"
      (nzVisibleChange)="change()"
    >
      <nz-badge [nzDot]="true">
        <i nz-icon nzType="bell" class="alain-default__nav-item-icon"></i>
      </nz-badge>
    </div>
    <nz-dropdown-menu #taskMenu="nzDropdownMenu">
      <div nz-menu class="wd-lg">
        @if (loading()) {
          <div class="mx-lg p-lg"><nz-spin /></div>
        } @else {
          <nz-card nzTitle="Notifications" nzBordered="false" class="ant-card__body-nopadding">
            <ng-template #extra><i nz-icon nzType="plus"></i></ng-template>
            <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
              <div nz-col [nzSpan]="4" class="text-center">
                <nz-avatar [nzSrc]="'./assets/tmp/img/1.png'" />
              </div>
              <div nz-col [nzSpan]="20">
                <strong>cipchk</strong>
                <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
              </div>
            </div>
            <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
              <div nz-col [nzSpan]="4" class="text-center">
                <nz-avatar [nzSrc]="'./assets/tmp/img/2.png'" />
              </div>
              <div nz-col [nzSpan]="20">
                <strong>はなさき</strong>
                <p class="mb0">ハルカソラトキヘダツヒカリ</p>
              </div>
            </div>
            <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
              <div nz-col [nzSpan]="4" class="text-center">
                <nz-avatar [nzSrc]="'./assets/tmp/img/3.png'" />
              </div>
              <div nz-col [nzSpan]="20">
                <strong>蘇先生</strong>
                <p class="mb0">請告訴我，我應該說點什麼好？</p>
              </div>
            </div>
            <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
              <div nz-col [nzSpan]="4" class="text-center">
                <nz-avatar [nzSrc]="'./assets/tmp/img/4.png'" />
              </div>
              <div nz-col [nzSpan]="20">
                <strong>Kent</strong>
                <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
              </div>
            </div>
            <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
              <div nz-col [nzSpan]="4" class="text-center">
                <nz-avatar [nzSrc]="'./assets/tmp/img/5.png'" />
              </div>
              <div nz-col [nzSpan]="20">
                <strong>Jefferson</strong>
                <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
              </div>
            </div>
            <div nz-row>
              <div nz-col [nzSpan]="24" class="pt-md border-top-1 text-center text-grey point">See All</div>
            </div>
          </nz-card>
        }
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS]
})
export class HeaderTaskComponent {
  readonly loading = signal(true);

  change(): void {
    setTimeout(() => {
      this.loading.set(false);
    }, 500);
  }
}

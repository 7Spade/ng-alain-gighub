import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BlueprintService, OrganizationContextService } from '@core';
import type { BlueprintMemberWithUser } from '@shared';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { combineLatest, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { TaskReportPanelComponent } from '../tasks/features/task-report/components/task-report-panel/task-report-panel.component';

/**
 * Blueprint Report Component
 *
 * 以任務層日誌面板呈現藍圖每日施工日誌，僅負責載入上下文資料。
 */
@Component({
  selector: 'app-blueprint-report',
  standalone: true,
  templateUrl: './report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS, TaskReportPanelComponent]
})
export class BlueprintReportComponent {
  private readonly blueprintService = inject(BlueprintService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly msg = inject(NzMessageService);

  private readonly parentRouteParams = toSignal(this.route.parent?.params ?? of({ org: '', slug: '' }), {
    initialValue: { org: '', slug: '' }
  });

  private readonly blueprintSlug = computed(() => this.parentRouteParams()?.['slug'] || null);

  private readonly blueprintId = toSignal(
    combineLatest([toObservable(this.orgContext.currentOrganizationId), toObservable(this.blueprintSlug)]).pipe(
      switchMap(([, slug]) => {
        if (!slug) {
          return of(null);
        }
        return from(this.getBlueprintIdBySlug()).pipe(
          catchError(error => {
            console.error('計算 Blueprint ID 失敗:', error);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  readonly blueprint = toSignal(
    toObservable(this.blueprintId).pipe(
      switchMap(blueprintId => {
        if (!blueprintId) {
          return of(null);
        }
        return from(this.blueprintService.getBlueprintById(blueprintId)).pipe(
          switchMap(({ data, error }) => {
            if (error || !data) {
              this.msg.error(error?.message || '獲取藍圖資料失敗');
              return of(null);
            }
            return of(data);
          }),
          catchError(error => {
            this.msg.error(error?.message || '載入藍圖資料失敗');
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  private readonly membersSignal = signal<BlueprintMemberWithUser[]>([]);
  private readonly membersLoadingSignal = signal(false);

  readonly members = this.membersSignal.asReadonly();
  readonly loading = computed(() => {
    const blueprintId = this.blueprintId();
    const blueprint = this.blueprint();
    return (blueprintId !== null && blueprint === null) || this.membersLoadingSignal();
  });

  constructor() {
    effect(() => {
      const blueprint = this.blueprint();
      if (blueprint?.id) {
        void this.loadMembers(blueprint.id);
      } else {
        this.membersSignal.set([]);
      }
    });
  }

  private async getBlueprintIdBySlug(): Promise<string | null> {
    const params = this.parentRouteParams() ?? { org: '', slug: '' };
    const orgSlug = params['org'];
    const slug = params['slug'];

    if (!slug) {
      return null;
    }

    const isUserView = !orgSlug;

    try {
      if (isUserView) {
        const { data } = await this.blueprintService.getBlueprintBySlug(null, slug);
        return data?.id || null;
      }

      const org = this.orgContext.currentOrganization();
      if (!org) {
        return null;
      }
      const { data } = await this.blueprintService.getBlueprintBySlug(org.id, slug);
      return data?.id || null;
    } catch (error) {
      console.error('獲取 Blueprint ID 失敗:', error);
      return null;
    }
  }

  private async loadMembers(blueprintId: string): Promise<void> {
    this.membersLoadingSignal.set(true);
    try {
      const { data, error } = await this.blueprintService.getBlueprintMembers(blueprintId);
      if (error) {
        this.msg.warning(error.message || '獲取成員列表失敗');
        this.membersSignal.set([]);
        return;
      }
      this.membersSignal.set(data ?? []);
    } finally {
      this.membersLoadingSignal.set(false);
    }
  }

  protected blueprintIdValue(): string | null {
    return this.blueprintId();
  }
}

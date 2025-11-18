import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BlueprintService, OrganizationContextService } from '@core';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';
import { combineLatest, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { TaskProgressPanelComponent } from '../tasks/features/task-progress/components/task-progress-panel/task-progress-panel.component';

@Component({
  selector: 'app-blueprint-progress',
  standalone: true,
  templateUrl: './progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SHARED_IMPORTS, TaskProgressPanelComponent]
})
export class BlueprintProgressComponent {
  private readonly blueprintService = inject(BlueprintService);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly msg = inject(NzMessageService);

  private readonly parentRouteParams = toSignal(this.route.parent?.params ?? of({ org: '', slug: '' }), {
    initialValue: { org: '', slug: '' }
  });

  private readonly blueprintSlug = computed(() => this.parentRouteParams()?.['slug'] || null);

  private readonly blueprintIdSignal = toSignal(
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
    toObservable(this.blueprintIdSignal).pipe(
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

  readonly loading = computed(() => {
    const blueprintId = this.blueprintIdSignal();
    const blueprint = this.blueprint();
    return blueprintId !== null && blueprint === null;
  });

  readonly blueprintHealth = computed(() => {
    const bp = this.blueprint();
    if (!bp) {
      return { status: 'default', label: '未知' };
    }

    if (bp.status === 'completed') {
      return { status: 'success', label: '專案已完成' };
    }

    if (bp.status === 'on-hold') {
      return { status: 'warning', label: '專案暫停' };
    }

    if (bp.status === 'archived') {
      return { status: 'default', label: '專案封存' };
    }

    return { status: 'processing', label: '穩定進行中' };
  });

  constructor() {
    effect(() => {
      const blueprint = this.blueprint();
      if (blueprint) {
        document.title = `${blueprint.name} - 進度管理`;
      }
    });
  }

  protected blueprintId(): string | null {
    return this.blueprintIdSignal();
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
}

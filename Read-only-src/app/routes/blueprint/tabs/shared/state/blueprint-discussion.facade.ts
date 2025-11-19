import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { OrganizationContextService, SupabaseService } from '@core';
import type { Blueprint } from '@shared/models/blueprint.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { combineLatest, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { BlueprintAggregationRefreshService } from './blueprint-aggregation-refresh.service';
import { BlueprintTabRepository } from '../data-access/blueprint-tab.repository';

export interface BlueprintDiscussion {
  readonly id: string;
  readonly blueprintId: string;
  readonly title: string;
  readonly content: string;
  readonly authorId: string;
  readonly authorName: string;
  readonly authorAvatar: string | null;
  readonly commentCount: number;
  readonly isPinned: boolean;
  readonly tags: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface CreateDiscussionInput {
  readonly blueprintId: string;
  readonly authorId: string;
  readonly title: string;
  readonly content: string;
  readonly tags: readonly string[];
}

interface UpdateDiscussionInput {
  readonly blueprintId: string;
  readonly title: string;
  readonly content: string;
  readonly tags: readonly string[];
}

@Injectable({ providedIn: 'any' })
export class BlueprintDiscussionFacade {
  private readonly repository = inject(BlueprintTabRepository);
  private readonly orgContext = inject(OrganizationContextService);
  private readonly route = inject(ActivatedRoute);
  private readonly supabase = inject(SupabaseService);
  private readonly msg = inject(NzMessageService);
  private readonly refreshService = inject(BlueprintAggregationRefreshService);

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

  private readonly loadingSignal = signal(false);
  private readonly blueprintSignal = signal<Blueprint | null>(null);
  private readonly discussionsSignal = signal<BlueprintDiscussion[]>([]);
  private readonly searchSignal = signal('');
  private readonly errorSignal = signal<string | null>(null);

  constructor() {
    effect(() => {
      const blueprintId = this.blueprintId();
      if (!blueprintId) {
        this.resetState();
        return;
      }
      void this.load(blueprintId);
    });

    effect(() => {
      const blueprintId = this.blueprintId();
      if (!blueprintId) {
        return;
      }
      const subscription = this.refreshService.listen(blueprintId, ['discussions']).subscribe(() => {
        void this.load(blueprintId);
      });
      return () => subscription.unsubscribe();
    });
  }

  readonly loading = computed(() => this.loadingSignal());
  readonly blueprint = computed(() => this.blueprintSignal());
  readonly blueprintId = computed(() => this.blueprintIdSignal());
  readonly discussions = computed(() => this.discussionsSignal());
  readonly searchText = computed(() => this.searchSignal());
  readonly error = computed(() => this.errorSignal());

  readonly filteredDiscussions = computed(() => {
    const list = this.discussionsSignal();
    const search = this.searchSignal().trim().toLowerCase();
    if (!search) {
      return list;
    }
    return list.filter(item => {
      const target = `${item.title} ${item.content} ${item.tags.join(' ')}`.toLowerCase();
      return target.includes(search);
    });
  });

  setSearch(value: string): void {
    this.searchSignal.set((value ?? '').trim());
  }

  async getCurrentUserId(): Promise<string | null> {
    const {
      data: { user },
      error
    } = await this.supabase.client.auth.getUser();
    if (error) {
      this.msg.error(error.message || '取得使用者資訊失敗');
      return null;
    }
    return user?.id ?? null;
  }

  async refresh(): Promise<void> {
    const blueprintId = this.blueprintIdSignal();
    if (!blueprintId) {
      return;
    }
    await this.load(blueprintId);
  }

  async createDiscussion(input: CreateDiscussionInput): Promise<boolean> {
    try {
      const { error } = await this.supabase.client.from('blueprint_discussions').insert({
        blueprint_id: input.blueprintId,
        title: input.title,
        content: input.content,
        author_id: input.authorId,
        tags: input.tags,
        comment_count: 0,
        is_pinned: false
      });

      if (error) {
        this.msg.error(`創建討論失敗：${error.message}`);
        return false;
      }

      this.refreshService.emit(input.blueprintId, ['discussions']);
      await this.load(input.blueprintId);
      return true;
    } catch (error) {
      console.error('創建討論失敗', error);
      this.msg.error(error instanceof Error ? error.message : '創建討論失敗');
      return false;
    }
  }

  async updateDiscussion(id: string, input: UpdateDiscussionInput): Promise<boolean> {
    try {
      const { error } = await this.supabase.client
        .from('blueprint_discussions')
        .update({
          title: input.title,
          content: input.content,
          tags: input.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        this.msg.error(`更新討論失敗：${error.message}`);
        return false;
      }

      this.refreshService.emit(input.blueprintId, ['discussions']);
      await this.load(input.blueprintId);
      return true;
    } catch (error) {
      console.error('更新討論失敗', error);
      this.msg.error(error instanceof Error ? error.message : '更新討論失敗');
      return false;
    }
  }

  private async load(blueprintId: string): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const [discussionResult, blueprintResult] = await Promise.all([
        this.fetchDiscussions(blueprintId),
        this.repository.getBlueprintInfo(blueprintId)
      ]);

      if (discussionResult.error) {
        this.errorSignal.set(discussionResult.error.message || '載入討論列表失敗');
        this.discussionsSignal.set([]);
      } else {
        this.discussionsSignal.set(discussionResult.data ?? []);
      }

      if (blueprintResult.error) {
        this.msg.error(blueprintResult.error.message || '載入藍圖資訊失敗');
        this.blueprintSignal.set(null);
      } else {
        this.blueprintSignal.set(blueprintResult.data?.blueprint ?? null);
      }
    } catch (error) {
      console.error('載入討論資料失敗', error);
      this.errorSignal.set(error instanceof Error ? error.message : 'UNKNOWN_ERROR');
      this.discussionsSignal.set([]);
      this.blueprintSignal.set(null);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private async fetchDiscussions(blueprintId: string): Promise<{ data: BlueprintDiscussion[] | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.client
        .from('blueprint_discussions')
        .select(
          `
          id,
          blueprint_id,
          title,
          content,
          author_id,
          comment_count,
          is_pinned,
          tags,
          created_at,
          updated_at,
          author:users!blueprint_discussions_author_id_fkey (
            id,
            display_name,
            email,
            avatar_url
          )
        `
        )
        .eq('blueprint_id', blueprintId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        this.msg.error(`載入討論列表失敗：${error.message}`);
        return { data: null, error };
      }

      const discussions: BlueprintDiscussion[] = (data ?? []).map(item => {
        const author = item.author as {
          display_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
        } | null;

        return {
          id: item.id,
          blueprintId: item.blueprint_id,
          title: item.title,
          content: item.content,
          authorId: item.author_id,
          authorName: author?.display_name ?? author?.email ?? '未知用戶',
          authorAvatar: author?.avatar_url ?? null,
          commentCount: item.comment_count ?? 0,
          isPinned: item.is_pinned ?? false,
          tags: item.tags ?? [],
          createdAt: item.created_at,
          updatedAt: item.updated_at ?? item.created_at
        };
      });

      return { data: discussions, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  private async getBlueprintIdBySlug(): Promise<string | null> {
    const params = this.parentRouteParams() ?? { org: '', slug: '' };
    const slug = params['slug'];
    const org = this.orgContext.currentOrganization();
    return this.repository.getBlueprintId(org?.id ?? null, slug);
  }

  private resetState(): void {
    this.loadingSignal.set(false);
    this.discussionsSignal.set([]);
    this.searchSignal.set('');
    this.errorSignal.set(null);
    this.blueprintSignal.set(null);
  }
}

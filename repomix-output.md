This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where line numbers have been added.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: src/**/*.ts
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Line numbers have been added to the beginning of each line
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/app/app.component.ts
src/app/app.config.ts
src/app/core/i18n/i18n.service.spec.ts
src/app/core/i18n/i18n.service.ts
src/app/core/index.ts
src/app/core/net/default.interceptor.ts
src/app/core/net/helper.ts
src/app/core/net/index.ts
src/app/core/net/refresh-token.ts
src/app/core/permissions/index.ts
src/app/core/permissions/permission.service.ts
src/app/core/permissions/role.service.ts
src/app/core/permissions/types.ts
src/app/core/start-page.guard.ts
src/app/core/startup/startup.service.ts
src/app/core/supabase/index.ts
src/app/core/supabase/supabase-auth-adapter.service.ts
src/app/core/supabase/supabase.service.ts
src/app/layout/basic/basic.component.ts
src/app/layout/basic/widgets/clear-storage.component.ts
src/app/layout/basic/widgets/fullscreen.component.ts
src/app/layout/basic/widgets/i18n.component.ts
src/app/layout/basic/widgets/icon.component.ts
src/app/layout/basic/widgets/notify.component.ts
src/app/layout/basic/widgets/rtl.component.ts
src/app/layout/basic/widgets/search.component.ts
src/app/layout/basic/widgets/task.component.ts
src/app/layout/basic/widgets/user.component.ts
src/app/layout/blank/blank.component.ts
src/app/layout/index.ts
src/app/layout/passport/passport.component.ts
src/app/routes/dashboard/analysis/analysis.component.ts
src/app/routes/dashboard/monitor/monitor.component.ts
src/app/routes/dashboard/routes.ts
src/app/routes/dashboard/v1/v1.component.ts
src/app/routes/dashboard/workplace/workplace.component.ts
src/app/routes/data-v/relation/relation.component.ts
src/app/routes/data-v/routes.ts
src/app/routes/delon/acl/acl.component.ts
src/app/routes/delon/cache/cache.component.ts
src/app/routes/delon/downfile/downfile.component.ts
src/app/routes/delon/form/form.component.ts
src/app/routes/delon/guard/admin.component.ts
src/app/routes/delon/guard/auth.component.ts
src/app/routes/delon/guard/can-leave.ts
src/app/routes/delon/guard/guard.component.ts
src/app/routes/delon/guard/leave.component.ts
src/app/routes/delon/print/print.component.ts
src/app/routes/delon/qr/qr.component.ts
src/app/routes/delon/routes.ts
src/app/routes/delon/st/st.component.ts
src/app/routes/delon/util/util.component.ts
src/app/routes/delon/xlsx/xlsx.component.ts
src/app/routes/delon/zip/zip.component.ts
src/app/routes/exception/exception.component.ts
src/app/routes/exception/routes.ts
src/app/routes/exception/trigger.component.ts
src/app/routes/extras/helpcenter/helpcenter.component.ts
src/app/routes/extras/poi/edit/edit.component.ts
src/app/routes/extras/poi/poi.component.ts
src/app/routes/extras/routes.ts
src/app/routes/extras/settings/settings.component.ts
src/app/routes/passport/callback.component.ts
src/app/routes/passport/lock/lock.component.ts
src/app/routes/passport/login/login.component.ts
src/app/routes/passport/register-result/register-result.component.ts
src/app/routes/passport/register/register.component.ts
src/app/routes/passport/routes.ts
src/app/routes/pro/account/center/applications/applications.component.ts
src/app/routes/pro/account/center/articles/articles.component.ts
src/app/routes/pro/account/center/center.component.ts
src/app/routes/pro/account/center/projects/projects.component.ts
src/app/routes/pro/account/settings/base/base.component.ts
src/app/routes/pro/account/settings/binding/binding.component.ts
src/app/routes/pro/account/settings/notification/notification.component.ts
src/app/routes/pro/account/settings/security/security.component.ts
src/app/routes/pro/account/settings/settings.component.ts
src/app/routes/pro/form/advanced-form/advanced-form.component.ts
src/app/routes/pro/form/basic-form/basic-form.component.ts
src/app/routes/pro/form/step-form/step-form.component.ts
src/app/routes/pro/form/step-form/step1.component.ts
src/app/routes/pro/form/step-form/step2.component.ts
src/app/routes/pro/form/step-form/step3.component.ts
src/app/routes/pro/form/step-form/transfer.service.ts
src/app/routes/pro/list/applications/applications.component.ts
src/app/routes/pro/list/articles/articles.component.ts
src/app/routes/pro/list/basic-list/basic-list.component.ts
src/app/routes/pro/list/basic-list/edit/edit.component.ts
src/app/routes/pro/list/card-list/card-list.component.ts
src/app/routes/pro/list/list/list.component.ts
src/app/routes/pro/list/projects/projects.component.ts
src/app/routes/pro/list/table-list/table-list.component.ts
src/app/routes/pro/profile/advanced/advanced.component.ts
src/app/routes/pro/profile/basic/basic.component.ts
src/app/routes/pro/result/fail/fail.component.ts
src/app/routes/pro/result/success/success.component.ts
src/app/routes/pro/routes.ts
src/app/routes/routes.ts
src/app/routes/style/color.service.ts
src/app/routes/style/colors/colors.component.ts
src/app/routes/style/gridmasonry/gridmasonry.component.ts
src/app/routes/style/routes.ts
src/app/routes/style/typography/typography.component.ts
src/app/routes/widgets/routes.ts
src/app/routes/widgets/widgets/widgets.component.ts
src/app/shared/cell-widget/index.ts
src/app/shared/index.ts
src/app/shared/json-schema/index.ts
src/app/shared/json-schema/test/test.widget.ts
src/app/shared/shared-delon.module.ts
src/app/shared/shared-imports.ts
src/app/shared/shared-tinymce.module.ts
src/app/shared/shared-zorro.module.ts
src/app/shared/st-widget/index.ts
src/app/shared/utils/yuan.ts
src/environments/environment.prod.ts
src/environments/environment.ts
src/main.ts
src/style-icons-auto.ts
src/style-icons.ts
src/typings.d.ts
```

# Files

## File: src/app/core/permissions/index.ts
````typescript
1: export * from './types';
2: export * from './permission.service';
3: export * from './role.service';
````

## File: src/app/core/permissions/permission.service.ts
````typescript
  1: import { Injectable, inject } from '@angular/core';
  2: import { ACLService } from '@delon/acl';
  3: import { DA_SERVICE_TOKEN } from '@delon/auth';
  4: import { Observable, from, of, throwError, forkJoin } from 'rxjs';
  5: import { map, switchMap, catchError, tap, shareReplay } from 'rxjs/operators';
  6: 
  7: import { SupabaseService } from '../supabase/supabase.service';
  8: import { Permission, PermissionCacheItem } from './types';
  9: 
 10: /**
 11:  * 权限检查服务
 12:  * 
 13:  * 整合 @delon/acl 和 Supabase 数据库，实现 RBAC 权限控制
 14:  * 
 15:  * 功能：
 16:  * 1. 权限检查（can, canAny, canAll）
 17:  * 2. Git-like 分支权限检查
 18:  * 3. 权限缓存（内存缓存）
 19:  * 4. 权限同步到 @delon/acl
 20:  * 5. 权限检查日志记录（后续实现）
 21:  * 
 22:  * @example
 23:  * ```typescript
 24:  * const permissionService = inject(PermissionService);
 25:  * permissionService.can('blueprint.read').subscribe(hasPermission => {
 26:  *   if (!hasPermission) {
 27:  *     throw new Error('Permission denied');
 28:  *   }
 29:  * });
 30:  * ```
 31:  */
 32: @Injectable({
 33:   providedIn: 'root'
 34: })
 35: export class PermissionService {
 36:   private readonly aclService = inject(ACLService);
 37:   private readonly supabaseService = inject(SupabaseService);
 38:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
 39: 
 40:   /**
 41:    * 权限缓存（内存缓存）
 42:    * key: permission string, value: PermissionCacheItem
 43:    */
 44:   private readonly permissionCache = new Map<string, PermissionCacheItem>();
 45: 
 46:   /**
 47:    * 缓存过期时间（毫秒），默认 5 分钟
 48:    */
 49:   private readonly CACHE_TTL = 5 * 60 * 1000;
 50: 
 51:   /**
 52:    * 当前用户权限缓存（Observable）
 53:    */
 54:   private userPermissions$?: Observable<Permission[]>;
 55: 
 56:   /**
 57:    * 获取当前用户 ID
 58:    */
 59:   private getCurrentUserId(): string | null {
 60:     const token = this.tokenService.get();
 61:     return token?.user?.id || null;
 62:   }
 63: 
 64:   /**
 65:    * 检查单个权限
 66:    * 
 67:    * @param permission 权限名称（如 'blueprint.read'）
 68:    * @returns Observable<boolean> 是否有权限
 69:    * @throws Error 如果权限检查失败（根据配置）
 70:    */
 71:   can(permission: string): Observable<boolean> {
 72:     // 1. 检查本地 ACLService 缓存
 73:     if (this.aclService.can(permission)) {
 74:       return of(true);
 75:     }
 76: 
 77:     // 2. 检查内存缓存
 78:     const cached = this.permissionCache.get(permission);
 79:     if (cached && cached.expiresAt > Date.now()) {
 80:       return of(cached.hasPermission);
 81:     }
 82: 
 83:     // 3. 查询数据库
 84:     return this.checkDatabasePermission(permission).pipe(
 85:       tap(hasPermission => {
 86:         // 更新内存缓存
 87:         this.permissionCache.set(permission, {
 88:           permission,
 89:           hasPermission,
 90:           expiresAt: Date.now() + this.CACHE_TTL
 91:         });
 92:       }),
 93:       catchError(error => {
 94:         // 权限检查失败时抛出异常
 95:         return throwError(() => new Error(`Permission check failed: ${permission} - ${error.message}`));
 96:       })
 97:     );
 98:   }
 99: 
100:   /**
101:    * 检查任一权限（OR 逻辑）
102:    * 
103:    * @param permissions 权限数组
104:    * @returns Observable<boolean> 是否有任一权限
105:    */
106:   canAny(permissions: string[]): Observable<boolean> {
107:     if (permissions.length === 0) {
108:       return of(false);
109:     }
110: 
111:     // 并行检查所有权限，任一为 true 即返回 true
112:     const checks = permissions.map(p => 
113:       this.can(p).pipe(
114:         catchError(() => of(false))
115:       )
116:     );
117: 
118:     return forkJoin(checks).pipe(
119:       map(results => results.some(r => r === true))
120:     );
121:   }
122: 
123:   /**
124:    * 检查所有权限（AND 逻辑）
125:    * 
126:    * @param permissions 权限数组
127:    * @returns Observable<boolean> 是否有所有权限
128:    */
129:   canAll(permissions: string[]): Observable<boolean> {
130:     if (permissions.length === 0) {
131:       return of(true);
132:     }
133: 
134:     // 并行检查所有权限，全部为 true 才返回 true
135:     const checks = permissions.map(p => 
136:       this.can(p).pipe(
137:         catchError(() => of(false))
138:       )
139:     );
140: 
141:     return forkJoin(checks).pipe(
142:       map(results => results.every(r => r === true))
143:     );
144:   }
145: 
146:   /**
147:    * 从数据库查询权限
148:    * 
149:    * @param permission 权限名称
150:    * @returns Observable<boolean>
151:    */
152:   private checkDatabasePermission(permission: string): Observable<boolean> {
153:     const userId = this.getCurrentUserId();
154:     if (!userId) {
155:       return of(false);
156:     }
157: 
158:     // 查询用户角色 -> 角色权限 -> 权限详情
159:     return from(
160:       this.supabaseService.client
161:         .from('user_roles')
162:         .select(`
163:           roles!inner(
164:             role_permissions!inner(
165:               permissions!inner(
166:                 name,
167:                 resource,
168:                 action
169:               )
170:             )
171:           )
172:         `)
173:         .eq('account_id', userId)
174:     ).pipe(
175:       map(({ data, error }) => {
176:         if (error) {
177:           throw new Error(`Database query failed: ${error.message}`);
178:         }
179: 
180:         if (!data || data.length === 0) {
181:           return false;
182:         }
183: 
184:         // 检查是否有匹配的权限
185:         for (const userRole of data) {
186:           const role = userRole.roles as any;
187:           if (role?.role_permissions) {
188:             for (const rolePerm of role.role_permissions) {
189:               const perm = rolePerm.permissions as Permission;
190:               if (perm.name === permission || `${perm.resource}.${perm.action}` === permission) {
191:                 return true;
192:               }
193:             }
194:           }
195:         }
196: 
197:         return false;
198:       }),
199:       tap(hasPermission => {
200:         // 如果权限存在，同步到 ACLService
201:         if (hasPermission) {
202:           this.syncPermissionToACL(permission);
203:         }
204:       })
205:     );
206:   }
207: 
208:   /**
209:    * 同步权限到 @delon/acl ACLService
210:    * 
211:    * @param permission 权限名称
212:    */
213:   private syncPermissionToACL(permission: string): void {
214:     // 解析权限格式：resource.action
215:     const parts = permission.split('.');
216:     if (parts.length === 2) {
217:       const [resource, action] = parts;
218:       // 使用 ACLService.setAbility() 设置权限
219:       const currentData = this.aclService.data;
220:       const abilities = currentData.abilities || [];
221:       if (!abilities.includes(permission)) {
222:         this.aclService.set({
223:           ...currentData,
224:           abilities: [...abilities, permission]
225:         });
226:       }
227:     }
228:   }
229: 
230:   /**
231:    * 检查蓝图访问权限
232:    * 
233:    * @param blueprintId 蓝图 ID
234:    * @param action 操作类型
235:    * @returns Observable<boolean>
236:    */
237:   canAccessBlueprint(blueprintId: string, action: 'read' | 'write' | 'admin'): Observable<boolean> {
238:     const userId = this.getCurrentUserId();
239:     if (!userId) {
240:       return of(false);
241:     }
242: 
243:     // 查询蓝图拥有者或用户角色
244:     return from(
245:       this.supabaseService.client
246:         .from('blueprints')
247:         .select('owner_id')
248:         .eq('id', blueprintId)
249:         .single()
250:     ).pipe(
251:       switchMap(({ data: blueprint, error: blueprintError }) => {
252:         if (blueprintError || !blueprint) {
253:           return of(false);
254:         }
255: 
256:         // 如果是拥有者，拥有所有权限
257:         if (blueprint.owner_id === userId) {
258:           return of(true);
259:         }
260: 
261:         // 检查用户角色权限
262:         return from(
263:           this.supabaseService.client
264:             .from('user_roles')
265:             .select('roles(code)')
266:             .eq('account_id', userId)
267:             .eq('blueprint_id', blueprintId)
268:         ).pipe(
269:           map(({ data: userRoles }) => {
270:             if (!userRoles || userRoles.length === 0) {
271:               return false;
272:             }
273: 
274:             // 根据角色代码判断权限
275:             const roleCodes = userRoles.map(ur => (ur.roles as any).code);
276:             
277:             switch (action) {
278:               case 'read':
279:                 return roleCodes.some(code => ['blueprint_owner', 'blueprint_admin', 'project_manager', 'viewer'].includes(code));
280:               case 'write':
281:                 return roleCodes.some(code => ['blueprint_owner', 'blueprint_admin', 'project_manager'].includes(code));
282:               case 'admin':
283:                 return roleCodes.some(code => ['blueprint_owner', 'blueprint_admin'].includes(code));
284:               default:
285:                 return false;
286:             }
287:           })
288:         );
289:       })
290:     );
291:   }
292: 
293:   /**
294:    * 检查分支访问权限
295:    * 
296:    * @param branchId 分支 ID
297:    * @param action 操作类型
298:    * @returns Observable<boolean>
299:    */
300:   canAccessBranch(branchId: string, action: 'read' | 'write' | 'admin'): Observable<boolean> {
301:     const userId = this.getCurrentUserId();
302:     if (!userId) {
303:       return of(false);
304:     }
305: 
306:     // 查询分支权限
307:     return from(
308:       this.supabaseService.client
309:         .from('branch_permissions')
310:         .select('permission_level, blueprint_branches(blueprint_id, blueprints(owner_id))')
311:         .eq('branch_id', branchId)
312:         .eq('account_id', userId)
313:         .single()
314:     ).pipe(
315:       switchMap(({ data: branchPerm, error }) => {
316:         // 如果没有分支权限，检查是否是蓝图拥有者
317:         if (error || !branchPerm) {
318:           return from(
319:             this.supabaseService.client
320:               .from('blueprint_branches')
321:               .select('blueprint_id, blueprints(owner_id)')
322:               .eq('id', branchId)
323:               .single()
324:           ).pipe(
325:             map(({ data: branch }) => {
326:               const blueprint = (branch as any)?.blueprints;
327:               return blueprint?.owner_id === userId;
328:             })
329:           );
330:         }
331: 
332:         const level = branchPerm.permission_level as 'owner' | 'admin' | 'write' | 'read';
333:         
334:         switch (action) {
335:           case 'read':
336:             return of(true); // 所有级别都可以读取
337:           case 'write':
338:             return of(['owner', 'admin', 'write'].includes(level));
339:           case 'admin':
340:             return of(['owner', 'admin'].includes(level));
341:           default:
342:             return of(false);
343:         }
344:       })
345:     );
346:   }
347: 
348:   /**
349:    * 检查是否可以修改任务结构（只有拥有者可以）
350:    * 
351:    * @param blueprintId 蓝图 ID
352:    * @returns Observable<boolean>
353:    */
354:   canModifyTaskStructure(blueprintId: string): Observable<boolean> {
355:     const userId = this.getCurrentUserId();
356:     if (!userId) {
357:       return of(false);
358:     }
359: 
360:     return from(
361:       this.supabaseService.client
362:         .from('blueprints')
363:         .select('owner_id')
364:         .eq('id', blueprintId)
365:         .single()
366:     ).pipe(
367:       map(({ data, error }) => {
368:         if (error || !data) {
369:           return false;
370:         }
371:         return data.owner_id === userId;
372:       })
373:     );
374:   }
375: 
376:   /**
377:    * 检查是否可以填写承攬欄位（协作组织可以）
378:    * 
379:    * @param branchId 分支 ID
380:    * @returns Observable<boolean>
381:    */
382:   canFillContractorFields(branchId: string): Observable<boolean> {
383:     const userId = this.getCurrentUserId();
384:     if (!userId) {
385:       return of(false);
386:     }
387: 
388:     // 检查是否是分支所属组织
389:     return from(
390:       this.supabaseService.client
391:         .from('blueprint_branches')
392:         .select('organization_id')
393:         .eq('id', branchId)
394:         .single()
395:     ).pipe(
396:       map(({ data, error }) => {
397:         if (error || !data) {
398:           return false;
399:         }
400:         return data.organization_id === userId;
401:       })
402:     );
403:   }
404: 
405:   /**
406:    * 检查是否可以审核 PR（只有拥有者可以）
407:    * 
408:    * @param blueprintId 蓝图 ID
409:    * @returns Observable<boolean>
410:    */
411:   canReviewPR(blueprintId: string): Observable<boolean> {
412:     return this.canModifyTaskStructure(blueprintId);
413:   }
414: 
415:   /**
416:    * 检查是否可以创建 PR（分支所属组织可以）
417:    * 
418:    * @param branchId 分支 ID
419:    * @returns Observable<boolean>
420:    */
421:   canCreatePR(branchId: string): Observable<boolean> {
422:     return this.canFillContractorFields(branchId);
423:   }
424: 
425:   /**
426:    * 从数据库同步用户角色到 ACLService
427:    * 
428:    * @param userId 用户 ID
429:    * @returns Promise<void>
430:    */
431:   async syncRolesFromDatabase(userId: string): Promise<void> {
432:     const { data: userRoles, error } = await this.supabaseService.client
433:       .from('user_roles')
434:       .select('roles(code, name)')
435:       .eq('account_id', userId);
436: 
437:     if (error) {
438:       throw new Error(`Failed to sync roles: ${error.message}`);
439:     }
440: 
441:     if (userRoles && userRoles.length > 0) {
442:       const roles = userRoles.map(ur => (ur.roles as any).code);
443:       this.aclService.set({ role: roles });
444:     }
445:   }
446: 
447:   /**
448:    * 加载用户所有权限
449:    * 
450:    * @param userId 用户 ID
451:    * @returns Observable<Permission[]>
452:    */
453:   loadUserPermissions(userId: string): Observable<Permission[]> {
454:     if (this.userPermissions$) {
455:       return this.userPermissions$;
456:     }
457: 
458:     this.userPermissions$ = from(
459:       this.supabaseService.client
460:         .from('user_roles')
461:         .select(`
462:           roles!inner(
463:             role_permissions!inner(
464:               permissions!inner(*)
465:             )
466:           )
467:         `)
468:         .eq('account_id', userId)
469:     ).pipe(
470:       map(({ data, error }) => {
471:         if (error) {
472:           throw new Error(`Failed to load permissions: ${error.message}`);
473:         }
474: 
475:         const permissions: Permission[] = [];
476:         if (data) {
477:           for (const userRole of data) {
478:             const role = userRole.roles as any;
479:             if (role?.role_permissions) {
480:               for (const rolePerm of role.role_permissions) {
481:                 const perm = rolePerm.permissions as Permission;
482:                 if (!permissions.find(p => p.id === perm.id)) {
483:                   permissions.push(perm);
484:                 }
485:               }
486:             }
487:           }
488:         }
489: 
490:         return permissions;
491:       }),
492:       tap(permissions => {
493:         // 同步权限到 ACLService
494:         const abilities = permissions.map(p => `${p.resource}.${p.action}`);
495:         this.aclService.set({ ability: abilities });
496:       }),
497:       shareReplay(1)
498:     );
499: 
500:     return this.userPermissions$;
501:   }
502: 
503:   /**
504:    * 刷新当前用户权限
505:    * 
506:    * @returns Observable<void>
507:    */
508:   refreshPermissions(): Observable<void> {
509:     const userId = this.getCurrentUserId();
510:     if (!userId) {
511:       return of(undefined);
512:     }
513: 
514:     // 清除缓存
515:     this.permissionCache.clear();
516:     this.userPermissions$ = undefined;
517: 
518:     // 重新加载权限
519:     return this.loadUserPermissions(userId).pipe(
520:       switchMap(() => this.syncRolesFromDatabase(userId)),
521:       map(() => undefined),
522:       catchError(error => {
523:         return throwError(() => new Error(`Failed to refresh permissions: ${error.message}`));
524:       })
525:     );
526:   }
527: 
528:   /**
529:    * 清除权限缓存
530:    */
531:   clearCache(): void {
532:     this.permissionCache.clear();
533:     this.userPermissions$ = undefined;
534:   }
535: }
````

## File: src/app/core/permissions/role.service.ts
````typescript
  1: import { Injectable, inject } from '@angular/core';
  2: import { DA_SERVICE_TOKEN } from '@delon/auth';
  3: import { Observable, from, throwError } from 'rxjs';
  4: import { map, switchMap, catchError } from 'rxjs/operators';
  5: 
  6: import { SupabaseService } from '../supabase/supabase.service';
  7: import { PermissionService } from './permission.service';
  8: import { Role, Permission, UserRole } from './types';
  9: 
 10: /**
 11:  * 角色管理服务
 12:  * 
 13:  * 提供角色查询和管理功能
 14:  * 
 15:  * @example
 16:  * ```typescript
 17:  * const roleService = inject(RoleService);
 18:  * roleService.getRoles().subscribe(roles => {
 19:  *   console.log('All roles:', roles);
 20:  * });
 21:  * ```
 22:  */
 23: @Injectable({
 24:   providedIn: 'root'
 25: })
 26: export class RoleService {
 27:   private readonly supabaseService = inject(SupabaseService);
 28:   private readonly permissionService = inject(PermissionService);
 29:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
 30: 
 31:   /**
 32:    * 获取当前用户 ID
 33:    */
 34:   private getCurrentUserId(): string | null {
 35:     const token = this.tokenService.get();
 36:     return token?.user?.id || null;
 37:   }
 38: 
 39:   /**
 40:    * 获取所有角色
 41:    * 
 42:    * @returns Observable<Role[]>
 43:    */
 44:   getRoles(): Observable<Role[]> {
 45:     return from(
 46:       this.supabaseService.client
 47:         .from('roles')
 48:         .select('*')
 49:         .order('priority', { ascending: false })
 50:     ).pipe(
 51:       map(({ data, error }) => {
 52:         if (error) {
 53:           throw new Error(`Failed to get roles: ${error.message}`);
 54:         }
 55:         return (data || []) as Role[];
 56:       })
 57:     );
 58:   }
 59: 
 60:   /**
 61:    * 获取用户角色
 62:    * 
 63:    * @param userId 用户 ID
 64:    * @returns Observable<Role[]>
 65:    */
 66:   getUserRoles(userId: string): Observable<Role[]> {
 67:     return from(
 68:       this.supabaseService.client
 69:         .from('user_roles')
 70:         .select('roles(*)')
 71:         .eq('account_id', userId)
 72:     ).pipe(
 73:       map(({ data, error }) => {
 74:         if (error) {
 75:           throw new Error(`Failed to get user roles: ${error.message}`);
 76:         }
 77:         return (data || []).map((ur: any) => ur.roles as Role);
 78:       })
 79:     );
 80:   }
 81: 
 82:   /**
 83:    * 获取角色权限
 84:    * 
 85:    * @param roleId 角色 ID
 86:    * @returns Observable<Permission[]>
 87:    */
 88:   getRolePermissions(roleId: string): Observable<Permission[]> {
 89:     return from(
 90:       this.supabaseService.client
 91:         .from('role_permissions')
 92:         .select('permissions(*)')
 93:         .eq('role_id', roleId)
 94:     ).pipe(
 95:       map(({ data, error }) => {
 96:         if (error) {
 97:           throw new Error(`Failed to get role permissions: ${error.message}`);
 98:         }
 99:         return (data || []).map((rp: any) => rp.permissions as Permission);
100:       })
101:     );
102:   }
103: 
104:   /**
105:    * 根据 ID 获取角色
106:    * 
107:    * @param roleId 角色 ID
108:    * @returns Observable<Role | null>
109:    */
110:   getRoleById(roleId: string): Observable<Role | null> {
111:     return from(
112:       this.supabaseService.client
113:         .from('roles')
114:         .select('*')
115:         .eq('id', roleId)
116:         .single()
117:     ).pipe(
118:       map(({ data, error }) => {
119:         if (error) {
120:           if (error.code === 'PGRST116') {
121:             return null; // 未找到
122:           }
123:           throw new Error(`Failed to get role: ${error.message}`);
124:         }
125:         return data as Role;
126:       })
127:     );
128:   }
129: 
130:   /**
131:    * 分配角色给用户
132:    * 
133:    * 需要权限：role.assign
134:    * 
135:    * @param userId 用户 ID
136:    * @param roleId 角色 ID
137:    * @param scope 作用域（可选）
138:    * @returns Observable<void>
139:    * @throws Error 如果权限不足
140:    */
141:   assignRole(
142:     userId: string,
143:     roleId: string,
144:     scope?: { blueprintId?: string; branchId?: string }
145:   ): Observable<void> {
146:     const currentUserId = this.getCurrentUserId();
147:     if (!currentUserId) {
148:       return throwError(() => new Error('User not authenticated'));
149:     }
150: 
151:     // 先验证权限
152:     return this.permissionService.can('role.assign').pipe(
153:       switchMap(hasPermission => {
154:         if (!hasPermission) {
155:           return throwError(() => new Error('Permission denied: role.assign'));
156:         }
157: 
158:         return from(
159:           this.supabaseService.client
160:             .from('user_roles')
161:             .insert({
162:               account_id: userId,
163:               role_id: roleId,
164:               blueprint_id: scope?.blueprintId || null,
165:               branch_id: scope?.branchId || null,
166:               granted_by: currentUserId
167:             })
168:         ).pipe(
169:           map(({ error }) => {
170:             if (error) {
171:               throw new Error(`Failed to assign role: ${error.message}`);
172:             }
173:           })
174:         );
175:       })
176:     );
177:   }
178: 
179:   /**
180:    * 移除用户角色
181:    * 
182:    * 需要权限：role.remove
183:    * 
184:    * @param userId 用户 ID
185:    * @param roleId 角色 ID
186:    * @param scope 作用域（可选）
187:    * @returns Observable<void>
188:    * @throws Error 如果权限不足
189:    */
190:   removeRole(
191:     userId: string,
192:     roleId: string,
193:     scope?: { blueprintId?: string; branchId?: string }
194:   ): Observable<void> {
195:     const currentUserId = this.getCurrentUserId();
196:     if (!currentUserId) {
197:       return throwError(() => new Error('User not authenticated'));
198:     }
199: 
200:     // 先验证权限
201:     return this.permissionService.can('role.remove').pipe(
202:       switchMap(hasPermission => {
203:         if (!hasPermission) {
204:           return throwError(() => new Error('Permission denied: role.remove'));
205:         }
206: 
207:         let query = this.supabaseService.client
208:           .from('user_roles')
209:           .delete()
210:           .eq('account_id', userId)
211:           .eq('role_id', roleId);
212: 
213:         if (scope?.blueprintId) {
214:           query = query.eq('blueprint_id', scope.blueprintId);
215:         }
216:         if (scope?.branchId) {
217:           query = query.eq('branch_id', scope.branchId);
218:         }
219: 
220:         return from(query).pipe(
221:           map(({ error }) => {
222:             if (error) {
223:               throw new Error(`Failed to remove role: ${error.message}`);
224:             }
225:           })
226:         );
227:       })
228:     );
229:   }
230: 
231:   /**
232:    * 更新角色
233:    * 
234:    * 需要权限：role.update
235:    * 
236:    * @param roleId 角色 ID
237:    * @param data 更新数据
238:    * @returns Observable<void>
239:    * @throws Error 如果权限不足
240:    */
241:   updateRole(roleId: string, data: Partial<Role>): Observable<void> {
242:     const currentUserId = this.getCurrentUserId();
243:     if (!currentUserId) {
244:       return throwError(() => new Error('User not authenticated'));
245:     }
246: 
247:     // 先验证权限
248:     return this.permissionService.can('role.update').pipe(
249:       switchMap(hasPermission => {
250:         if (!hasPermission) {
251:           return throwError(() => new Error('Permission denied: role.update'));
252:         }
253: 
254:         return from(
255:           this.supabaseService.client
256:             .from('roles')
257:             .update(data)
258:             .eq('id', roleId)
259:         ).pipe(
260:           map(({ error }) => {
261:             if (error) {
262:               throw new Error(`Failed to update role: ${error.message}`);
263:             }
264:           })
265:         );
266:       })
267:     );
268:   }
269: 
270:   /**
271:    * 分配权限给角色
272:    * 
273:    * 需要权限：role.permission.assign
274:    * 
275:    * @param roleId 角色 ID
276:    * @param permissionId 权限 ID
277:    * @returns Observable<void>
278:    * @throws Error 如果权限不足
279:    */
280:   assignPermissionToRole(roleId: string, permissionId: string): Observable<void> {
281:     const currentUserId = this.getCurrentUserId();
282:     if (!currentUserId) {
283:       return throwError(() => new Error('User not authenticated'));
284:     }
285: 
286:     // 先验证权限
287:     return this.permissionService.can('role.permission.assign').pipe(
288:       switchMap(hasPermission => {
289:         if (!hasPermission) {
290:           return throwError(() => new Error('Permission denied: role.permission.assign'));
291:         }
292: 
293:         return from(
294:           this.supabaseService.client
295:             .from('role_permissions')
296:             .insert({
297:               role_id: roleId,
298:               permission_id: permissionId
299:             })
300:         ).pipe(
301:           map(({ error }) => {
302:             if (error) {
303:               throw new Error(`Failed to assign permission: ${error.message}`);
304:             }
305:           })
306:         );
307:       })
308:     );
309:   }
310: 
311:   /**
312:    * 移除角色权限
313:    * 
314:    * 需要权限：role.permission.remove
315:    * 
316:    * @param roleId 角色 ID
317:    * @param permissionId 权限 ID
318:    * @returns Observable<void>
319:    * @throws Error 如果权限不足
320:    */
321:   removePermissionFromRole(roleId: string, permissionId: string): Observable<void> {
322:     const currentUserId = this.getCurrentUserId();
323:     if (!currentUserId) {
324:       return throwError(() => new Error('User not authenticated'));
325:     }
326: 
327:     // 先验证权限
328:     return this.permissionService.can('role.permission.remove').pipe(
329:       switchMap(hasPermission => {
330:         if (!hasPermission) {
331:           return throwError(() => new Error('Permission denied: role.permission.remove'));
332:         }
333: 
334:         return from(
335:           this.supabaseService.client
336:             .from('role_permissions')
337:             .delete()
338:             .eq('role_id', roleId)
339:             .eq('permission_id', permissionId)
340:         ).pipe(
341:           map(({ error }) => {
342:             if (error) {
343:               throw new Error(`Failed to remove permission: ${error.message}`);
344:             }
345:           })
346:         );
347:       })
348:     );
349:   }
350: }
````

## File: src/app/core/permissions/types.ts
````typescript
 1: /**
 2:  * 权限服务类型定义
 3:  * 
 4:  * 参考 docs/30-0-完整SQL表結構定義.md 中的权限表结构
 5:  */
 6: 
 7: /**
 8:  * 角色定义
 9:  * 对应 roles 表
10:  */
11: export interface Role {
12:   id: string;
13:   name: string;
14:   code: string;
15:   description?: string;
16:   is_system_role: boolean;
17:   priority: number;
18:   created_at?: string;
19:   updated_at?: string;
20: }
21: 
22: /**
23:  * 权限定义
24:  * 对应 permissions 表
25:  */
26: export interface Permission {
27:   id: string;
28:   name: string;
29:   resource: string;
30:   action: string;
31:   description?: string;
32:   is_system_permission?: boolean;
33:   created_at?: string;
34: }
35: 
36: /**
37:  * 用户角色关联
38:  * 对应 user_roles 表
39:  */
40: export interface UserRole {
41:   id: string;
42:   account_id: string;
43:   role_id: string;
44:   blueprint_id?: string | null;
45:   branch_id?: string | null;
46:   granted_by?: string | null;
47:   granted_at?: string;
48:   // 关联查询时包含的角色信息
49:   roles?: Role;
50: }
51: 
52: /**
53:  * 分支权限
54:  * 对应 branch_permissions 表
55:  */
56: export interface BranchPermission {
57:   id: string;
58:   branch_id: string;
59:   account_id: string;
60:   permission_level: 'owner' | 'admin' | 'write' | 'read';
61:   granted_by: string;
62:   granted_at?: string;
63: }
64: 
65: /**
66:  * 权限检查结果
67:  */
68: export interface PermissionCheckResult {
69:   hasPermission: boolean;
70:   reason?: string;
71: }
72: 
73: /**
74:  * 权限缓存项
75:  */
76: export interface PermissionCacheItem {
77:   permission: string;
78:   hasPermission: boolean;
79:   expiresAt: number;
80:   roles?: string[];
81:   abilities?: string[];
82: }
````

## File: src/app/shared/shared-tinymce.module.ts
````typescript
 1: /**
 2:  * ngx-tinymce 富文本編輯器模組
 3:  * 
 4:  * 注意：此模組為可選模組，僅在需要使用 TinyMCE 富文本編輯器時導入
 5:  * 
 6:  * 使用方式：
 7:  * ```typescript
 8:  * import { SHARED_TINYMCE_MODULES } from '@shared/shared-tinymce.module';
 9:  * 
10:  * @Component({
11:  *   imports: [SHARED_IMPORTS, ...SHARED_TINYMCE_MODULES]
12:  * })
13:  * ```
14:  * 
15:  * 或在需要時直接導入：
16:  * ```typescript
17:  * import { EditorModule } from 'ngx-tinymce';
18:  * 
19:  * @Component({
20:  *   imports: [SHARED_IMPORTS, EditorModule]
21:  * })
22:  * ```
23:  * 
24:  * @see https://github.com/ng-alain/ng-alain/tree/master/packages/tinymce
25:  * @see https://www.tiny.cloud/docs/tinymce/latest/
26:  */
27: 
28: // 注意：ngx-tinymce 在 package.json 中已安裝，但當前未使用
29: // 如需使用，請取消下面的註釋並安裝對應的類型定義（如果有的話）
30: // import { EditorModule } from 'ngx-tinymce';
31: 
32: /**
33:  * ngx-tinymce 模組集合
34:  * 
35:  * 目前為空數組，因為項目中尚未使用 TinyMCE 編輯器
36:  * 如需使用，請取消上面的 import 並將 EditorModule 添加到數組中
37:  */
38: export const SHARED_TINYMCE_MODULES: any[] = [
39:   // EditorModule, // TinyMCE 富文本編輯器 — https://github.com/ng-alain/ng-alain/tree/master/packages/tinymce
40: ];
````

## File: src/app/app.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { NavigationEnd, NavigationError, RouteConfigLoadStart, Router, RouterOutlet } from '@angular/router';
 3: import { TitleService, VERSION as VERSION_ALAIN, stepPreloader } from '@delon/theme';
 4: import { environment } from '@env/environment';
 5: import { NzModalService } from 'ng-zorro-antd/modal';
 6: import { VERSION as VERSION_ZORRO } from 'ng-zorro-antd/version';
 7: 
 8: @Component({
 9:   selector: 'app-root',
10:   template: `<router-outlet />`,
11:   imports: [RouterOutlet],
12:   host: {
13:     '[attr.ng-alain-version]': 'ngAlainVersion',
14:     '[attr.ng-zorro-version]': 'ngZorroVersion'
15:   }
16: })
17: export class AppComponent implements OnInit {
18:   private readonly router = inject(Router);
19:   private readonly titleSrv = inject(TitleService);
20:   private readonly modalSrv = inject(NzModalService);
21:   ngAlainVersion = VERSION_ALAIN.full;
22:   ngZorroVersion = VERSION_ZORRO.full;
23: 
24:   private donePreloader = stepPreloader();
25: 
26:   ngOnInit(): void {
27:     let configLoad = false;
28:     this.router.events.subscribe(ev => {
29:       if (ev instanceof RouteConfigLoadStart) {
30:         configLoad = true;
31:       }
32:       if (configLoad && ev instanceof NavigationError) {
33:         this.modalSrv.confirm({
34:           nzTitle: `提醒`,
35:           nzContent: environment.production ? `应用可能已发布新版本，请点击刷新才能生效。` : `无法加载路由：${ev.url}`,
36:           nzCancelDisabled: false,
37:           nzOkText: '刷新',
38:           nzCancelText: '忽略',
39:           nzOnOk: () => location.reload()
40:         });
41:       }
42:       if (ev instanceof NavigationEnd) {
43:         this.donePreloader();
44:         this.titleSrv.setTitle();
45:         this.modalSrv.closeAll();
46:       }
47:     });
48:   }
49: }
````

## File: src/app/app.config.ts
````typescript
 1: import { provideHttpClient, withInterceptors } from '@angular/common/http';
 2: import { default as ngLang } from '@angular/common/locales/zh';
 3: import { ApplicationConfig, EnvironmentProviders, Provider } from '@angular/core';
 4: import { provideAnimations } from '@angular/platform-browser/animations';
 5: import {
 6:   provideRouter,
 7:   withComponentInputBinding,
 8:   withInMemoryScrolling,
 9:   withHashLocation,
10:   RouterFeatures,
11:   withViewTransitions
12: } from '@angular/router';
13: import { I18NService, defaultInterceptor, provideBindAuthRefresh, provideStartup } from '@core';
14: import { provideCellWidgets } from '@delon/abc/cell';
15: import { provideSTWidgets } from '@delon/abc/st';
16: import { authSimpleInterceptor, provideAuth } from '@delon/auth';
17: import { provideSFConfig } from '@delon/form';
18: import { AlainProvideLang, provideAlain, zh_CN as delonLang } from '@delon/theme';
19: import { AlainConfig } from '@delon/util/config';
20: import { environment } from '@env/environment';
21: import { CELL_WIDGETS, SF_WIDGETS, ST_WIDGETS } from '@shared';
22: import { zhCN as dateLang } from 'date-fns/locale';
23: import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
24: import { zh_CN as zorroLang } from 'ng-zorro-antd/i18n';
25: 
26: import { ICONS } from '../style-icons';
27: import { ICONS_AUTO } from '../style-icons-auto';
28: import { routes } from './routes/routes';
29: 
30: const defaultLang: AlainProvideLang = {
31:   abbr: 'zh-CN',
32:   ng: ngLang,
33:   zorro: zorroLang,
34:   date: dateLang,
35:   delon: delonLang
36: };
37: 
38: const alainConfig: AlainConfig = {
39:   st: { modal: { size: 'lg' } },
40:   pageHeader: { homeI18n: 'home' },
41:   lodop: {
42:     license: `A59B099A586B3851E0F0D7FDBF37B603`,
43:     licenseA: `C94CEE276DB2187AE6B65D56B3FC2848`
44:   },
45:   auth: { login_url: '/passport/login' }
46: };
47: 
48: const ngZorroConfig: NzConfig = {};
49: 
50: const routerFeatures: RouterFeatures[] = [
51:   withComponentInputBinding(),
52:   withViewTransitions(),
53:   withInMemoryScrolling({ scrollPositionRestoration: 'top' })
54: ];
55: if (environment.useHash) routerFeatures.push(withHashLocation());
56: 
57: const providers: Array<Provider | EnvironmentProviders> = [
58:   provideHttpClient(withInterceptors([...(environment.interceptorFns ?? []), authSimpleInterceptor, defaultInterceptor])),
59:   provideAnimations(),
60:   provideRouter(routes, ...routerFeatures),
61:   provideAlain({ config: alainConfig, defaultLang, i18nClass: I18NService, icons: [...ICONS_AUTO, ...ICONS] }),
62:   provideNzConfig(ngZorroConfig),
63:   provideAuth(),
64:   provideCellWidgets(...CELL_WIDGETS),
65:   provideSTWidgets(...ST_WIDGETS),
66:   provideSFConfig({ widgets: SF_WIDGETS }),
67:   provideStartup(),
68:   ...(environment.providers || [])
69: ];
70: 
71: // If you use `@delon/auth` to refresh the token, additional registration `provideBindAuthRefresh` is required
72: if (environment.api?.refreshTokenEnabled && environment.api.refreshTokenType === 'auth-refresh') {
73:   providers.push(provideBindAuthRefresh());
74: }
75: 
76: export const appConfig: ApplicationConfig = {
77:   providers: providers
78: };
````

## File: src/app/core/i18n/i18n.service.spec.ts
````typescript
 1: import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
 2: import { provideHttpClientTesting } from '@angular/common/http/testing';
 3: import { TestBed } from '@angular/core/testing';
 4: import { DelonLocaleService, SettingsService } from '@delon/theme';
 5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 6: import { NzI18nService } from 'ng-zorro-antd/i18n';
 7: 
 8: import { I18NService } from './i18n.service';
 9: 
10: describe('Service: I18n', () => {
11:   let srv: I18NService;
12:   const MockSettingsService: NzSafeAny = {
13:     layout: {
14:       lang: null
15:     }
16:   };
17:   const MockNzI18nService = {
18:     setLocale: () => {},
19:     setDateLocale: () => {}
20:   };
21:   const MockDelonLocaleService = {
22:     setLocale: () => {}
23:   };
24: 
25:   function genModule(): void {
26:     TestBed.configureTestingModule({
27:       imports: [],
28:       providers: [
29:         I18NService,
30:         { provide: SettingsService, useValue: MockSettingsService },
31:         { provide: NzI18nService, useValue: MockNzI18nService },
32:         { provide: DelonLocaleService, useValue: MockDelonLocaleService },
33:         provideHttpClient(withInterceptorsFromDi()),
34:         provideHttpClientTesting()
35:       ]
36:     });
37:     srv = TestBed.inject(I18NService);
38:   }
39: 
40:   it('should working', () => {
41:     spyOnProperty(navigator, 'languages').and.returnValue(['zh-CN']);
42:     genModule();
43:     expect(srv).toBeTruthy();
44:     expect(srv.defaultLang).toBe('zh-CN');
45:     srv.fanyi('a');
46:     srv.fanyi('a', {});
47:   });
48: 
49:   it('should be used layout as default language', () => {
50:     MockSettingsService.layout.lang = 'en-US';
51:     const navSpy = spyOnProperty(navigator, 'languages');
52:     genModule();
53:     expect(navSpy).not.toHaveBeenCalled();
54:     expect(srv.defaultLang).toBe('en-US');
55:     MockSettingsService.layout.lang = null;
56:   });
57: 
58:   it('should be used browser as default language', () => {
59:     spyOnProperty(navigator, 'languages').and.returnValue(['zh-TW']);
60:     genModule();
61:     expect(srv.defaultLang).toBe('zh-TW');
62:   });
63: 
64:   it('should be use default language when the browser language is not in the list', () => {
65:     spyOnProperty(navigator, 'languages').and.returnValue(['es-419']);
66:     genModule();
67:     expect(srv.defaultLang).toBe('zh-CN');
68:   });
69: 
70:   it('should be trigger notify when changed language', () => {
71:     genModule();
72:     srv.use('en-US', {});
73:     srv.change.subscribe(lang => {
74:       expect(lang).toBe('en-US');
75:     });
76:   });
77: });
````

## File: src/app/core/i18n/i18n.service.ts
````typescript
  1: // 请参考：https://ng-alain.com/docs/i18n
  2: import { Platform } from '@angular/cdk/platform';
  3: import { registerLocaleData } from '@angular/common';
  4: import ngEn from '@angular/common/locales/en';
  5: import ngZh from '@angular/common/locales/zh';
  6: import ngZhTw from '@angular/common/locales/zh-Hant';
  7: import { Injectable, inject } from '@angular/core';
  8: import {
  9:   DelonLocaleService,
 10:   en_US as delonEnUS,
 11:   SettingsService,
 12:   zh_CN as delonZhCn,
 13:   zh_TW as delonZhTw,
 14:   _HttpClient,
 15:   AlainI18nBaseService
 16: } from '@delon/theme';
 17: import { enUS as dfEn, zhCN as dfZhCn, zhTW as dfZhTw } from 'date-fns/locale';
 18: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 19: import { en_US as zorroEnUS, NzI18nService, zh_CN as zorroZhCN, zh_TW as zorroZhTW } from 'ng-zorro-antd/i18n';
 20: import { Observable } from 'rxjs';
 21: 
 22: interface LangConfigData {
 23:   abbr: string;
 24:   text: string;
 25:   ng: NzSafeAny;
 26:   zorro: NzSafeAny;
 27:   date: NzSafeAny;
 28:   delon: NzSafeAny;
 29: }
 30: 
 31: const DEFAULT = 'zh-CN';
 32: const LANGS: Record<string, LangConfigData> = {
 33:   'zh-CN': {
 34:     text: '简体中文',
 35:     ng: ngZh,
 36:     zorro: zorroZhCN,
 37:     date: dfZhCn,
 38:     delon: delonZhCn,
 39:     abbr: '🇨🇳'
 40:   },
 41:   'zh-TW': {
 42:     text: '繁体中文',
 43:     ng: ngZhTw,
 44:     zorro: zorroZhTW,
 45:     date: dfZhTw,
 46:     delon: delonZhTw,
 47:     abbr: '🇭🇰'
 48:   },
 49:   'en-US': {
 50:     text: 'English',
 51:     ng: ngEn,
 52:     zorro: zorroEnUS,
 53:     date: dfEn,
 54:     delon: delonEnUS,
 55:     abbr: '🇬🇧'
 56:   }
 57: };
 58: 
 59: @Injectable({ providedIn: 'root' })
 60: export class I18NService extends AlainI18nBaseService {
 61:   private readonly http = inject(_HttpClient);
 62:   private readonly settings = inject(SettingsService);
 63:   private readonly nzI18nService = inject(NzI18nService);
 64:   private readonly delonLocaleService = inject(DelonLocaleService);
 65:   private readonly platform = inject(Platform);
 66: 
 67:   protected override _defaultLang = DEFAULT;
 68:   private _langs = Object.keys(LANGS).map(code => {
 69:     const item = LANGS[code];
 70:     return { code, text: item.text, abbr: item.abbr };
 71:   });
 72: 
 73:   constructor() {
 74:     super();
 75: 
 76:     const defaultLang = this.getDefaultLang();
 77:     this._defaultLang = this._langs.findIndex(w => w.code === defaultLang) === -1 ? DEFAULT : defaultLang;
 78:   }
 79: 
 80:   private getDefaultLang(): string {
 81:     if (!this.platform.isBrowser) {
 82:       return DEFAULT;
 83:     }
 84:     if (this.settings.layout.lang) {
 85:       return this.settings.layout.lang;
 86:     }
 87:     let res = (navigator.languages ? navigator.languages[0] : null) || navigator.language;
 88:     const arr = res.split('-');
 89:     return arr.length <= 1 ? res : `${arr[0]}-${arr[1].toUpperCase()}`;
 90:   }
 91: 
 92:   loadLangData(lang: string): Observable<NzSafeAny> {
 93:     return this.http.get(`./assets/tmp/i18n/${lang}.json`);
 94:   }
 95: 
 96:   use(lang: string, data: Record<string, unknown>): void {
 97:     if (this._currentLang === lang) return;
 98: 
 99:     this._data = this.flatData(data, []);
100: 
101:     const item = LANGS[lang];
102:     registerLocaleData(item.ng);
103:     this.nzI18nService.setLocale(item.zorro);
104:     this.nzI18nService.setDateLocale(item.date);
105:     this.delonLocaleService.setLocale(item.delon);
106:     this._currentLang = lang;
107: 
108:     this._change$.next(lang);
109:   }
110: 
111:   getLangs(): Array<{ code: string; text: string; abbr: string }> {
112:     return this._langs;
113:   }
114: }
````

## File: src/app/core/index.ts
````typescript
1: export * from './i18n/i18n.service';
2: export * from './net/index';
3: export * from './startup/startup.service';
4: export * from './start-page.guard';
5: export * from './supabase';
6: export * from './permissions';
````

## File: src/app/core/net/default.interceptor.ts
````typescript
 1: import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponseBase } from '@angular/common/http';
 2: import { Injector, inject } from '@angular/core';
 3: import { IGNORE_BASE_URL } from '@delon/theme';
 4: import { environment } from '@env/environment';
 5: import { Observable, of, throwError, mergeMap } from 'rxjs';
 6: 
 7: import { ReThrowHttpError, checkStatus, getAdditionalHeaders, toLogin } from './helper';
 8: import { tryRefreshToken } from './refresh-token';
 9: 
10: function handleData(injector: Injector, ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
11:   checkStatus(injector, ev);
12:   // 业务处理：一些通用操作
13:   switch (ev.status) {
14:     case 200:
15:       // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
16:       // 例如响应内容：
17:       //  错误内容：{ status: 1, msg: '非法参数' }
18:       //  正确内容：{ status: 0, response: {  } }
19:       // 则以下代码片断可直接适用
20:       // if (ev instanceof HttpResponse) {
21:       //   const body = ev.body;
22:       //   if (body && body.status !== 0) {
23:       //     const customError = req.context.get(CUSTOM_ERROR);
24:       //     if (customError) injector.get(NzMessageService).error(body.msg);
25:       //     return customError ? throwError(() => ({ body, _throw: true }) as ReThrowHttpError) : of({});
26:       //   } else {
27:       //     // 返回原始返回体
28:       //     if (req.context.get(RAW_BODY) || ev.body instanceof Blob) {
29:       //       return of(ev);
30:       //     }
31:       //     // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
32:       //     return of(new HttpResponse({ ...ev, body: body.response } as any));
33:       //     // 或者依然保持完整的格式
34:       //     return of(ev);
35:       //   }
36:       // }
37:       break;
38:     case 401:
39:       if (environment.api.refreshTokenEnabled && environment.api.refreshTokenType === 're-request') {
40:         return tryRefreshToken(injector, ev, req, next);
41:       }
42:       toLogin(injector);
43:       break;
44:     case 403:
45:     case 404:
46:     case 500:
47:       // goTo(injector, `/exception/${ev.status}?url=${req.urlWithParams}`);
48:       break;
49:     default:
50:       if (ev instanceof HttpErrorResponse) {
51:         console.warn('未可知错误，大部分是由于后端不支持跨域CORS或无效配置引起，请参考 https://ng-alain.com/docs/server 解决跨域问题', ev);
52:       }
53:       break;
54:   }
55:   if (ev instanceof HttpErrorResponse) {
56:     return throwError(() => ev);
57:   } else if ((ev as unknown as ReThrowHttpError)._throw === true) {
58:     return throwError(() => (ev as unknown as ReThrowHttpError).body);
59:   } else {
60:     return of(ev);
61:   }
62: }
63: 
64: export const defaultInterceptor: HttpInterceptorFn = (req, next) => {
65:   // 统一加上服务端前缀
66:   let url = req.url;
67:   if (!req.context.get(IGNORE_BASE_URL) && !url.startsWith('https://') && !url.startsWith('http://')) {
68:     const { baseUrl } = environment.api;
69:     url = baseUrl + (baseUrl.endsWith('/') && url.startsWith('/') ? url.substring(1) : url);
70:   }
71:   const newReq = req.clone({ url, setHeaders: getAdditionalHeaders(req.headers) });
72:   const injector = inject(Injector);
73: 
74:   return next(newReq).pipe(
75:     mergeMap(ev => {
76:       // 允许统一对请求错误处理
77:       if (ev instanceof HttpResponseBase) {
78:         return handleData(injector, ev, newReq, next);
79:       }
80:       // 若一切都正常，则后续操作
81:       return of(ev);
82:     })
83:     // catchError((err: HttpErrorResponse) => handleData(injector, err, newReq, next))
84:   );
85: };
````

## File: src/app/core/net/helper.ts
````typescript
 1: import { HttpHeaders, HttpResponseBase } from '@angular/common/http';
 2: import { Injector, inject } from '@angular/core';
 3: import { Router } from '@angular/router';
 4: import { DA_SERVICE_TOKEN } from '@delon/auth';
 5: import { ALAIN_I18N_TOKEN } from '@delon/theme';
 6: import { NzNotificationService } from 'ng-zorro-antd/notification';
 7: 
 8: export interface ReThrowHttpError {
 9:   body: any;
10:   _throw: true;
11: }
12: 
13: export const CODEMESSAGE: Record<number, string> = {
14:   200: '服务器成功返回请求的数据。',
15:   201: '新建或修改数据成功。',
16:   202: '一个请求已经进入后台排队（异步任务）。',
17:   204: '删除数据成功。',
18:   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
19:   401: '用户没有权限（令牌、用户名、密码错误）。',
20:   403: '用户得到授权，但是访问是被禁止的。',
21:   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
22:   406: '请求的格式不可得。',
23:   410: '请求的资源被永久删除，且不会再得到的。',
24:   422: '当创建一个对象时，发生一个验证错误。',
25:   500: '服务器发生错误，请检查服务器。',
26:   502: '网关错误。',
27:   503: '服务不可用，服务器暂时过载或维护。',
28:   504: '网关超时。'
29: };
30: 
31: export function goTo(injector: Injector, url: string): void {
32:   setTimeout(() => injector.get(Router).navigateByUrl(url));
33: }
34: 
35: export function toLogin(injector: Injector): void {
36:   injector.get(NzNotificationService).error(`未登录或登录已过期，请重新登录。`, ``);
37:   goTo(injector, injector.get(DA_SERVICE_TOKEN).login_url!);
38: }
39: 
40: export function getAdditionalHeaders(headers?: HttpHeaders): Record<string, string> {
41:   const res: Record<string, string> = {};
42:   const lang = inject(ALAIN_I18N_TOKEN).currentLang;
43:   if (!headers?.has('Accept-Language') && lang) {
44:     res['Accept-Language'] = lang;
45:   }
46: 
47:   return res;
48: }
49: 
50: export function checkStatus(injector: Injector, ev: HttpResponseBase): void {
51:   if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
52:     return;
53:   }
54: 
55:   const errortext = CODEMESSAGE[ev.status] || ev.statusText;
56:   injector.get(NzNotificationService).error(`请求错误 ${ev.status}: ${ev.url}`, errortext);
57: }
````

## File: src/app/core/net/index.ts
````typescript
1: export { provideBindAuthRefresh } from './refresh-token';
2: export * from './default.interceptor';
````

## File: src/app/core/net/refresh-token.ts
````typescript
  1: import { HttpClient, HttpHandlerFn, HttpRequest, HttpResponseBase } from '@angular/common/http';
  2: import { EnvironmentProviders, Injector, inject, provideAppInitializer } from '@angular/core';
  3: import { DA_SERVICE_TOKEN } from '@delon/auth';
  4: import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError, map } from 'rxjs';
  5: 
  6: import { toLogin } from './helper';
  7: import { SupabaseAuthAdapterService } from '../supabase';
  8: 
  9: let refreshToking = false;
 10: let refreshToken$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
 11: 
 12: /**
 13:  * 重新附加新 Token 信息
 14:  *
 15:  * > 由于已经发起的请求，不会再走一遍 `@delon/auth` 因此需要结合业务情况重新附加新的 Token
 16:  */
 17: function reAttachToken(injector: Injector, req: HttpRequest<any>): HttpRequest<any> {
 18:   const token = injector.get(DA_SERVICE_TOKEN).get()?.token;
 19:   return req.clone({
 20:     setHeaders: {
 21:       token: `Bearer ${token}`
 22:     }
 23:   });
 24: }
 25: 
 26: function refreshTokenRequest(injector: Injector): Observable<any> {
 27:   const adapter = injector.get(SupabaseAuthAdapterService);
 28:   return adapter.refreshSession().pipe(
 29:     map(session => adapter.convertSessionToTokenFormat(session))
 30:   );
 31: }
 32: 
 33: /**
 34:  * 刷新Token方式一：使用 401 重新刷新 Token
 35:  */
 36: export function tryRefreshToken(injector: Injector, ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
 37:   // 1、若请求为刷新Token请求，表示来自刷新Token可以直接跳转登录页
 38:   if ([`/api/auth/refresh`].some(url => req.url.includes(url))) {
 39:     toLogin(injector);
 40:     return throwError(() => ev);
 41:   }
 42:   // 2、如果 `refreshToking` 为 `true` 表示已经在请求刷新 Token 中，后续所有请求转入等待状态，直至结果返回后再重新发起请求
 43:   if (refreshToking) {
 44:     return refreshToken$.pipe(
 45:       filter(v => !!v),
 46:       take(1),
 47:       switchMap(() => next(reAttachToken(injector, req)))
 48:     );
 49:   }
 50:   // 3、尝试调用刷新 Token
 51:   refreshToking = true;
 52:   refreshToken$.next(null);
 53: 
 54:   return refreshTokenRequest(injector).pipe(
 55:     switchMap(res => {
 56:       // 通知后续请求继续执行
 57:       refreshToking = false;
 58:       refreshToken$.next(res);
 59:       // 重新保存新 token
 60:       injector.get(DA_SERVICE_TOKEN).set(res);
 61:       // 重新发起请求
 62:       return next(reAttachToken(injector, req));
 63:     }),
 64:     catchError(err => {
 65:       refreshToking = false;
 66:       toLogin(injector);
 67:       return throwError(() => err);
 68:     })
 69:   );
 70: }
 71: 
 72: function buildAuthRefresh(injector: Injector): void {
 73:   const tokenSrv = injector.get(DA_SERVICE_TOKEN);
 74:   tokenSrv.refresh
 75:     .pipe(
 76:       filter(() => !refreshToking),
 77:       switchMap(res => {
 78:         console.log(res);
 79:         refreshToking = true;
 80:         return refreshTokenRequest(injector);
 81:       })
 82:     )
 83:     .subscribe({
 84:       next: res => {
 85:         // TODO: Mock expired value
 86:         res.expired = +new Date() + 1000 * 60 * 5;
 87:         refreshToking = false;
 88:         tokenSrv.set(res);
 89:       },
 90:       error: () => toLogin(injector)
 91:     });
 92: }
 93: 
 94: /**
 95:  * 刷新Token方式二：使用 `@delon/auth` 的 `refresh` 接口，需要在 `app.config.ts` 中注册 `provideBindAuthRefresh`
 96:  */
 97: export function provideBindAuthRefresh(): EnvironmentProviders[] {
 98:   return [
 99:     provideAppInitializer(() => {
100:       const initializerFn = (
101:         (injector: Injector) => () =>
102:           buildAuthRefresh(injector)
103:       )(inject(Injector));
104:       return initializerFn();
105:     })
106:   ];
107: }
````

## File: src/app/core/start-page.guard.ts
````typescript
 1: import { CanActivateFn } from '@angular/router';
 2: import { Observable } from 'rxjs';
 3: 
 4: /**
 5:  * Dynamically load the start page
 6:  *
 7:  * 动态加载启动页
 8:  */
 9: export const startPageGuard: CanActivateFn = (): boolean | Observable<boolean> => {
10:   // Re-jump according to the first item of the menu, you can re-customize the logic
11:   // 以下代码是根据菜单的第一项进行重新跳转，你可以重新定制逻辑
12:   // const menuSrv = inject(MenuService);
13:   // if (menuSrv.find({ url: state.url }) == null) {
14:   //   inject(Router).navigateByUrl(menuSrv.menus[0].link!);
15:   //   return false;
16:   // }
17:   return true;
18: };
````

## File: src/app/core/startup/startup.service.ts
````typescript
 1: import { HttpClient } from '@angular/common/http';
 2: import { EnvironmentProviders, Injectable, Provider, inject, provideAppInitializer } from '@angular/core';
 3: import { Router } from '@angular/router';
 4: import { ACLService } from '@delon/acl';
 5: import { DA_SERVICE_TOKEN } from '@delon/auth';
 6: import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
 7: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 8: import { Observable, zip, catchError, map, switchMap, of } from 'rxjs';
 9: 
10: import { I18NService } from '../i18n/i18n.service';
11: import { PermissionService } from '../permissions/permission.service';
12: import { SupabaseAuthAdapterService } from '../supabase';
13: 
14: /**
15:  * Used for application startup
16:  * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
17:  */
18: export function provideStartup(): Array<Provider | EnvironmentProviders> {
19:   return [
20:     StartupService,
21:     provideAppInitializer(() => {
22:       const initializerFn = (
23:         (startupService: StartupService) => () =>
24:           startupService.load()
25:       )(inject(StartupService));
26:       return initializerFn();
27:     })
28:   ];
29: }
30: 
31: @Injectable()
32: export class StartupService {
33:   private menuService = inject(MenuService);
34:   private settingService = inject(SettingsService);
35:   private aclService = inject(ACLService);
36:   private titleService = inject(TitleService);
37:   private httpClient = inject(HttpClient);
38:   private router = inject(Router);
39:   private i18n = inject<I18NService>(ALAIN_I18N_TOKEN);
40:   private supabaseAuthAdapter = inject(SupabaseAuthAdapterService);
41:   private permissionService = inject(PermissionService);
42:   private tokenService = inject(DA_SERVICE_TOKEN);
43: 
44:   load(): Observable<void> {
45:     const defaultLang = this.i18n.defaultLang;
46:     
47:     // 先恢復 Supabase Session（如果存在），然後執行原有的啟動邏輯
48:     return this.supabaseAuthAdapter.restoreSession().pipe(
49:       switchMap(() => {
50:         // 同步用户权限（如果已登录）
51:         const currentUser = this.tokenService.get()?.user;
52:         const syncPermissions$ = currentUser?.id
53:           ? from(this.permissionService.syncRolesFromDatabase(currentUser.id)).pipe(
54:               catchError(error => {
55:                 console.warn('Failed to sync permissions:', error);
56:                 return of(undefined);
57:               })
58:             )
59:           : of(undefined);
60: 
61:         return syncPermissions$.pipe(
62:           switchMap(() => {
63:             // If http request allows anonymous access, you need to add `ALLOW_ANONYMOUS`:
64:             // this.httpClient.get('/app', { context: new HttpContext().set(ALLOW_ANONYMOUS, this.tokenService.get()?.token ? false : true) })
65:             return zip(this.i18n.loadLangData(defaultLang), this.httpClient.get('./assets/tmp/app-data.json')).pipe(
66:               // 接收其他拦截器后产生的异常消息
67:               catchError(res => {
68:                 console.warn(`StartupService.load: Network request failed`, res);
69:                 setTimeout(() => this.router.navigateByUrl(`/exception/500`));
70:                 return [];
71:               }),
72:               map(([langData, appData]: [Record<string, string>, NzSafeAny]) => {
73:                 // setting language data
74:                 this.i18n.use(defaultLang, langData);
75: 
76:                 // 应用信息：包括站点名、描述、年份
77:                 this.settingService.setApp(appData.app);
78:                 // 用户信息：包括姓名、头像、邮箱地址
79:                 this.settingService.setUser(appData.user);
80:                 // ACL：如果用户已登录，权限已通过 PermissionService 同步
81:                 // 如果未登录，设置为全量（开发模式）
82:                 if (!currentUser?.id) {
83:                   this.aclService.setFull(true);
84:                 }
85:                 // 初始化菜单
86:                 this.menuService.add(appData.menu);
87:                 // 设置页面标题的后缀
88:                 this.titleService.default = '';
89:                 this.titleService.suffix = appData.app.name;
90:               })
91:             );
92:           })
93:         );
94:       })
95:     );
96:   }
97: }
````

## File: src/app/core/supabase/index.ts
````typescript
1: export * from './supabase.service';
2: export * from './supabase-auth-adapter.service';
````

## File: src/app/core/supabase/supabase-auth-adapter.service.ts
````typescript
  1: import { Injectable, inject, PLATFORM_ID } from '@angular/core';
  2: import { isPlatformBrowser } from '@angular/common';
  3: import { DA_SERVICE_TOKEN } from '@delon/auth';
  4: import { Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
  5: import { Observable, from, of, throwError, EMPTY } from 'rxjs';
  6: import { map, catchError, switchMap, tap } from 'rxjs/operators';
  7: 
  8: import { SupabaseService } from './supabase.service';
  9: 
 10: /**
 11:  * Supabase Auth 與 @delon/auth 適配器服務
 12:  * 
 13:  * 作為 Supabase Auth 與 @delon/auth 之間的橋樑，實現：
 14:  * 1. Session 格式轉換（Supabase Session → @delon/auth Token 格式）
 15:  * 2. 自動同步 Session 到 TokenService
 16:  * 3. 監聽 Auth 狀態變化
 17:  * 4. Token 刷新處理
 18:  * 
 19:  * @example
 20:  * ```typescript
 21:  * const adapter = inject(SupabaseAuthAdapterService);
 22:  * adapter.signIn('user@example.com', 'password').subscribe();
 23:  * ```
 24:  */
 25: @Injectable({
 26:   providedIn: 'root'
 27: })
 28: export class SupabaseAuthAdapterService {
 29:   private readonly supabaseService = inject(SupabaseService);
 30:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
 31:   private readonly platformId = inject(PLATFORM_ID);
 32:   private authListenerInitialized = false;
 33: 
 34:   constructor() {
 35:     // 在瀏覽器環境中初始化 Auth 監聽器
 36:     if (isPlatformBrowser(this.platformId)) {
 37:       this.initializeAuthListener();
 38:     }
 39:   }
 40: 
 41:   /**
 42:    * 登入
 43:    * 
 44:    * @param email 用戶郵箱
 45:    * @param password 密碼
 46:    * @returns Observable<{ error: AuthError | null }>
 47:    */
 48:   signIn(email: string, password: string): Observable<{ error: AuthError | null }> {
 49:     return from(
 50:       this.supabaseService.client.auth.signInWithPassword({
 51:         email,
 52:         password
 53:       })
 54:     ).pipe(
 55:       tap(({ data, error }) => {
 56:         if (!error && data.session) {
 57:           this.syncSessionToTokenService(data.session);
 58:         }
 59:       }),
 60:       map(({ error }) => ({ error }))
 61:     );
 62:   }
 63: 
 64:   /**
 65:    * 註冊
 66:    * 
 67:    * @param email 用戶郵箱
 68:    * @param password 密碼
 69:    * @param metadata 用戶元數據（可選）
 70:    * @returns Observable<{ error: AuthError | null }>
 71:    */
 72:   signUp(
 73:     email: string,
 74:     password: string,
 75:     metadata?: Record<string, any>
 76:   ): Observable<{ error: AuthError | null }> {
 77:     return from(
 78:       this.supabaseService.client.auth.signUp({
 79:         email,
 80:         password,
 81:         options: {
 82:           data: metadata
 83:         }
 84:       })
 85:     ).pipe(
 86:       tap(({ data, error }) => {
 87:         if (!error && data.session) {
 88:           this.syncSessionToTokenService(data.session);
 89:         }
 90:       }),
 91:       map(({ error }) => ({ error }))
 92:     );
 93:   }
 94: 
 95:   /**
 96:    * 登出
 97:    * 
 98:    * @returns Observable<{ error: AuthError | null }>
 99:    */
100:   signOut(): Observable<{ error: AuthError | null }> {
101:     return from(this.supabaseService.client.auth.signOut()).pipe(
102:       tap(() => {
103:         // 清除 TokenService
104:         this.tokenService.clear();
105:       }),
106:       map(({ error }) => ({ error }))
107:     );
108:   }
109: 
110:   /**
111:    * 刷新 Session
112:    * 
113:    * @returns Observable<Session>
114:    */
115:   refreshSession(): Observable<Session> {
116:     return from(this.supabaseService.client.auth.refreshSession()).pipe(
117:       switchMap(({ data, error }) => {
118:         if (error) {
119:           return throwError(() => error);
120:         }
121:         if (!data.session) {
122:           return throwError(() => new Error('No session available'));
123:         }
124:         this.syncSessionToTokenService(data.session);
125:         return of(data.session);
126:       })
127:     );
128:   }
129: 
130:   /**
131:    * 恢復 Session（應用啟動時調用）
132:    * 
133:    * @returns Observable<void>
134:    */
135:   restoreSession(): Observable<void> {
136:     if (!isPlatformBrowser(this.platformId)) {
137:       return of(undefined);
138:     }
139: 
140:     return from(this.supabaseService.client.auth.getSession()).pipe(
141:       tap(({ data }) => {
142:         if (data.session) {
143:           this.syncSessionToTokenService(data.session);
144:         }
145:       }),
146:       map(() => undefined),
147:       catchError(() => of(undefined))
148:     );
149:   }
150: 
151:   /**
152:    * 初始化 Auth 狀態監聽器
153:    * 監聽 Supabase Auth 狀態變化，自動同步到 TokenService
154:    */
155:   initializeAuthListener(): void {
156:     if (this.authListenerInitialized || !isPlatformBrowser(this.platformId)) {
157:       return;
158:     }
159: 
160:     this.supabaseService.client.auth.onAuthStateChange(
161:       (event: AuthChangeEvent, session: Session | null) => {
162:         if (session) {
163:           this.syncSessionToTokenService(session);
164:         } else if (event === 'SIGNED_OUT') {
165:           this.tokenService.clear();
166:         }
167:       }
168:     );
169: 
170:     this.authListenerInitialized = true;
171:   }
172: 
173:   /**
174:    * 將 Supabase Session 轉換為 @delon/auth Token 格式
175:    * 
176:    * @param session Supabase Session
177:    * @returns @delon/auth Token 格式對象
178:    */
179:   convertSessionToTokenFormat(session: Session): {
180:     token: string;
181:     refresh_token: string;
182:     expired: number;
183:     user: {
184:       id: string;
185:       email?: string;
186:       [key: string]: any;
187:     };
188:   } {
189:     const expiresIn = session.expires_in || 3600; // 預設 1 小時
190:     const expired = Date.now() + expiresIn * 1000;
191: 
192:     return {
193:       token: session.access_token,
194:       refresh_token: session.refresh_token,
195:       expired,
196:       user: {
197:         id: session.user.id,
198:         email: session.user.email,
199:         ...session.user.user_metadata,
200:         ...session.user.app_metadata
201:       }
202:     };
203:   }
204: 
205:   /**
206:    * 同步 Supabase Session 到 @delon/auth TokenService
207:    * 
208:    * @param session Supabase Session
209:    */
210:   private syncSessionToTokenService(session: Session): void {
211:     const tokenData = this.convertSessionToTokenFormat(session);
212:     this.tokenService.set(tokenData);
213:   }
214: 
215:   /**
216:    * 獲取當前 Session
217:    * 
218:    * @returns Observable<Session | null>
219:    */
220:   getCurrentSession(): Observable<Session | null> {
221:     return from(this.supabaseService.client.auth.getSession()).pipe(
222:       map(({ data }) => data.session)
223:     );
224:   }
225: }
````

## File: src/app/core/supabase/supabase.service.ts
````typescript
 1: import { Injectable, inject } from '@angular/core';
 2: import { createClient, SupabaseClient } from '@supabase/supabase-js';
 3: import { environment } from '@env/environment';
 4: 
 5: /**
 6:  * Supabase 客戶端服務
 7:  * 
 8:  * 提供 Supabase 客戶端單例，用於訪問 Supabase 的所有功能：
 9:  * - Database (PostgreSQL)
10:  * - Authentication
11:  * - Storage
12:  * - Realtime
13:  * 
14:  * @example
15:  * ```typescript
16:  * const supabase = inject(SupabaseService);
17:  * const client = supabase.client;
18:  * ```
19:  */
20: @Injectable({
21:   providedIn: 'root'
22: })
23: export class SupabaseService {
24:   private readonly supabase: SupabaseClient;
25: 
26:   constructor() {
27:     const supabaseConfig = (environment as any)['supabase'];
28:     if (!supabaseConfig?.url || !supabaseConfig?.anonKey) {
29:       throw new Error('Supabase configuration is missing. Please check environment variables.');
30:     }
31: 
32:     this.supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
33:       auth: {
34:         persistSession: true,
35:         autoRefreshToken: true,
36:         detectSessionInUrl: true
37:       }
38:     });
39:   }
40: 
41:   /**
42:    * 獲取 Supabase 客戶端實例
43:    */
44:   get client(): SupabaseClient {
45:     return this.supabase;
46:   }
47: }
````

## File: src/app/layout/basic/basic.component.ts
````typescript
  1: import { Component, inject } from '@angular/core';
  2: import { RouterLink, RouterOutlet } from '@angular/router';
  3: import { I18nPipe, SettingsService, User } from '@delon/theme';
  4: import { LayoutDefaultModule, LayoutDefaultOptions } from '@delon/theme/layout-default';
  5: import { SettingDrawerModule } from '@delon/theme/setting-drawer';
  6: import { ThemeBtnComponent } from '@delon/theme/theme-btn';
  7: import { environment } from '@env/environment';
  8: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
  9: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 10: import { NzIconModule } from 'ng-zorro-antd/icon';
 11: import { NzMenuModule } from 'ng-zorro-antd/menu';
 12: 
 13: import { HeaderClearStorageComponent } from './widgets/clear-storage.component';
 14: import { HeaderFullScreenComponent } from './widgets/fullscreen.component';
 15: import { HeaderI18nComponent } from './widgets/i18n.component';
 16: import { HeaderIconComponent } from './widgets/icon.component';
 17: import { HeaderNotifyComponent } from './widgets/notify.component';
 18: import { HeaderRTLComponent } from './widgets/rtl.component';
 19: import { HeaderSearchComponent } from './widgets/search.component';
 20: import { HeaderTaskComponent } from './widgets/task.component';
 21: import { HeaderUserComponent } from './widgets/user.component';
 22: 
 23: @Component({
 24:   selector: 'layout-basic',
 25:   template: `
 26:     <layout-default [options]="options" [asideUser]="asideUserTpl" [content]="contentTpl" [customError]="null">
 27:       <layout-default-header-item direction="left">
 28:         <a layout-default-header-item-trigger href="//github.com/ng-alain/ng-alain" target="_blank">
 29:           <i nz-icon nzType="github"></i>
 30:         </a>
 31:       </layout-default-header-item>
 32:       <layout-default-header-item direction="left" hidden="mobile">
 33:         <a layout-default-header-item-trigger routerLink="/passport/lock">
 34:           <i nz-icon nzType="lock"></i>
 35:         </a>
 36:       </layout-default-header-item>
 37:       <layout-default-header-item direction="left" hidden="pc">
 38:         <div layout-default-header-item-trigger (click)="searchToggleStatus = !searchToggleStatus">
 39:           <i nz-icon nzType="search"></i>
 40:         </div>
 41:       </layout-default-header-item>
 42:       <layout-default-header-item direction="middle">
 43:         <header-search class="alain-default__search" [(toggleChange)]="searchToggleStatus" />
 44:       </layout-default-header-item>
 45:       <layout-default-header-item direction="right">
 46:         <header-notify />
 47:       </layout-default-header-item>
 48:       <layout-default-header-item direction="right" hidden="mobile">
 49:         <header-task />
 50:       </layout-default-header-item>
 51:       <layout-default-header-item direction="right" hidden="mobile">
 52:         <header-icon />
 53:       </layout-default-header-item>
 54:       <layout-default-header-item direction="right" hidden="mobile">
 55:         <div layout-default-header-item-trigger nz-dropdown [nzDropdownMenu]="settingsMenu" nzTrigger="click" nzPlacement="bottomRight">
 56:           <i nz-icon nzType="setting"></i>
 57:         </div>
 58:         <nz-dropdown-menu #settingsMenu="nzDropdownMenu">
 59:           <div nz-menu style="width: 200px;">
 60:             <div nz-menu-item>
 61:               <header-rtl />
 62:             </div>
 63:             <div nz-menu-item>
 64:               <header-fullscreen />
 65:             </div>
 66:             <div nz-menu-item>
 67:               <header-clear-storage />
 68:             </div>
 69:             <div nz-menu-item>
 70:               <header-i18n />
 71:             </div>
 72:           </div>
 73:         </nz-dropdown-menu>
 74:       </layout-default-header-item>
 75:       <layout-default-header-item direction="right">
 76:         <header-user />
 77:       </layout-default-header-item>
 78:       <ng-template #asideUserTpl>
 79:         <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="userMenu" class="alain-default__aside-user">
 80:           <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="user.avatar" />
 81:           <div class="alain-default__aside-user-info">
 82:             <strong>{{ user.name }}</strong>
 83:             <p class="mb0">{{ user.email }}</p>
 84:           </div>
 85:         </div>
 86:         <nz-dropdown-menu #userMenu="nzDropdownMenu">
 87:           <ul nz-menu>
 88:             <li nz-menu-item routerLink="/pro/account/center">{{ 'menu.account.center' | i18n }}</li>
 89:             <li nz-menu-item routerLink="/pro/account/settings">{{ 'menu.account.settings' | i18n }}</li>
 90:           </ul>
 91:         </nz-dropdown-menu>
 92:       </ng-template>
 93:       <ng-template #contentTpl>
 94:         <router-outlet />
 95:       </ng-template>
 96:     </layout-default>
 97:     @if (showSettingDrawer) {
 98:       <setting-drawer />
 99:     }
100:     <theme-btn />
101:   `,
102:   imports: [
103:     RouterOutlet,
104:     RouterLink,
105:     I18nPipe,
106:     LayoutDefaultModule,
107:     NzIconModule,
108:     NzMenuModule,
109:     NzDropDownModule,
110:     NzAvatarModule,
111:     SettingDrawerModule,
112:     ThemeBtnComponent,
113:     HeaderSearchComponent,
114:     HeaderNotifyComponent,
115:     HeaderTaskComponent,
116:     HeaderIconComponent,
117:     HeaderRTLComponent,
118:     HeaderI18nComponent,
119:     HeaderClearStorageComponent,
120:     HeaderFullScreenComponent,
121:     HeaderUserComponent
122:   ]
123: })
124: export class LayoutBasicComponent {
125:   private readonly settings = inject(SettingsService);
126:   options: LayoutDefaultOptions = {
127:     logoExpanded: `./assets/logo-full.svg`,
128:     logoCollapsed: `./assets/logo.svg`
129:   };
130:   searchToggleStatus = false;
131:   showSettingDrawer = !environment.production;
132:   get user(): User {
133:     return this.settings.user;
134:   }
135: }
````

## File: src/app/layout/basic/widgets/clear-storage.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
 2: import { I18nPipe } from '@delon/theme';
 3: import { NzIconModule } from 'ng-zorro-antd/icon';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: import { NzModalService } from 'ng-zorro-antd/modal';
 6: 
 7: @Component({
 8:   selector: 'header-clear-storage',
 9:   template: `
10:     <i nz-icon nzType="tool"></i>
11:     {{ 'menu.clear.local.storage' | i18n }}
12:   `,
13:   host: {
14:     '[class.flex-1]': 'true'
15:   },
16:   changeDetection: ChangeDetectionStrategy.OnPush,
17:   imports: [NzIconModule, I18nPipe]
18: })
19: export class HeaderClearStorageComponent {
20:   private readonly modalSrv = inject(NzModalService);
21:   private readonly messageSrv = inject(NzMessageService);
22: 
23:   @HostListener('click')
24:   _click(): void {
25:     this.modalSrv.confirm({
26:       nzTitle: 'Make sure clear all local storage?',
27:       nzOnOk: () => {
28:         localStorage.clear();
29:         this.messageSrv.success('Clear Finished!');
30:       }
31:     });
32:   }
33: }
````

## File: src/app/layout/basic/widgets/fullscreen.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
 2: import { I18nPipe } from '@delon/theme';
 3: import { NzIconModule } from 'ng-zorro-antd/icon';
 4: import screenfull from 'screenfull';
 5: 
 6: @Component({
 7:   selector: 'header-fullscreen',
 8:   template: `
 9:     <i nz-icon [nzType]="status ? 'fullscreen-exit' : 'fullscreen'"></i>
10:     {{ (status ? 'menu.fullscreen.exit' : 'menu.fullscreen') | i18n }}
11:   `,
12:   host: {
13:     '[class.flex-1]': 'true'
14:   },
15:   changeDetection: ChangeDetectionStrategy.OnPush,
16:   imports: [NzIconModule, I18nPipe]
17: })
18: export class HeaderFullScreenComponent {
19:   status = false;
20: 
21:   @HostListener('window:resize')
22:   _resize(): void {
23:     this.status = screenfull.isFullscreen;
24:   }
25: 
26:   @HostListener('click')
27:   _click(): void {
28:     if (screenfull.isEnabled) {
29:       screenfull.toggle();
30:     }
31:   }
32: }
````

## File: src/app/layout/basic/widgets/i18n.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, Input, booleanAttribute, inject, DOCUMENT } from '@angular/core';
 2: import { I18NService } from '@core';
 3: import { ALAIN_I18N_TOKEN, I18nPipe, SettingsService } from '@delon/theme';
 4: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 5: import { NzIconModule } from 'ng-zorro-antd/icon';
 6: import { NzMenuModule } from 'ng-zorro-antd/menu';
 7: 
 8: @Component({
 9:   selector: 'header-i18n',
10:   template: `
11:     @if (showLangText) {
12:       <div nz-dropdown [nzDropdownMenu]="langMenu" nzPlacement="bottomRight">
13:         <i nz-icon nzType="global"></i>
14:         {{ 'menu.lang' | i18n }}
15:         <i nz-icon nzType="down"></i>
16:       </div>
17:     } @else {
18:       <i nz-dropdown [nzDropdownMenu]="langMenu" nzPlacement="bottomRight" nz-icon nzType="global"></i>
19:     }
20:     <nz-dropdown-menu #langMenu="nzDropdownMenu">
21:       <ul nz-menu>
22:         @for (item of langs; track $index) {
23:           <li nz-menu-item [nzSelected]="item.code === curLangCode" (click)="change(item.code)">
24:             <span role="img" [attr.aria-label]="item.text" class="pr-xs">{{ item.abbr }}</span>
25:             {{ item.text }}
26:           </li>
27:         }
28:       </ul>
29:     </nz-dropdown-menu>
30:   `,
31:   host: {
32:     '[class.flex-1]': 'true'
33:   },
34:   changeDetection: ChangeDetectionStrategy.OnPush,
35:   imports: [I18nPipe, NzDropDownModule, NzIconModule, NzMenuModule]
36: })
37: export class HeaderI18nComponent {
38:   private readonly settings = inject(SettingsService);
39:   private readonly i18n = inject<I18NService>(ALAIN_I18N_TOKEN);
40:   private readonly doc = inject(DOCUMENT);
41:   /** Whether to display language text */
42:   @Input({ transform: booleanAttribute }) showLangText = true;
43: 
44:   get langs(): Array<{ code: string; text: string; abbr: string }> {
45:     return this.i18n.getLangs();
46:   }
47: 
48:   get curLangCode(): string {
49:     return this.settings.layout.lang;
50:   }
51: 
52:   change(lang: string): void {
53:     const spinEl = this.doc.createElement('div');
54:     spinEl.setAttribute('class', `page-loading ant-spin ant-spin-lg ant-spin-spinning`);
55:     spinEl.innerHTML = `<span class="ant-spin-dot ant-spin-dot-spin"><i></i><i></i><i></i><i></i></span>`;
56:     this.doc.body.appendChild(spinEl);
57: 
58:     this.i18n.loadLangData(lang).subscribe(res => {
59:       this.i18n.use(lang, res);
60:       this.settings.setLayout('lang', lang);
61:       setTimeout(() => this.doc.location.reload());
62:     });
63:   }
64: }
````

## File: src/app/layout/basic/widgets/icon.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
 2: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 3: import { NzGridModule } from 'ng-zorro-antd/grid';
 4: import { NzIconModule } from 'ng-zorro-antd/icon';
 5: import { NzMenuModule } from 'ng-zorro-antd/menu';
 6: import { NzSpinModule } from 'ng-zorro-antd/spin';
 7: 
 8: @Component({
 9:   selector: 'header-icon',
10:   template: `
11:     <div
12:       class="alain-default__nav-item"
13:       nz-dropdown
14:       [nzDropdownMenu]="iconMenu"
15:       nzTrigger="click"
16:       nzPlacement="bottomRight"
17:       (nzVisibleChange)="change()"
18:     >
19:       <i nz-icon nzType="appstore"></i>
20:     </div>
21:     <nz-dropdown-menu #iconMenu="nzDropdownMenu">
22:       <div nz-menu class="wd-xl animated jello">
23:         <nz-spin [nzSpinning]="loading" [nzTip]="'正在读取数据...'">
24:           <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="app-icons">
25:             <div nz-col [nzSpan]="6">
26:               <i nz-icon nzType="calendar" class="bg-error text-white"></i>
27:               <small>Calendar</small>
28:             </div>
29:             <div nz-col [nzSpan]="6">
30:               <i nz-icon nzType="file" class="bg-geekblue text-white"></i>
31:               <small>Files</small>
32:             </div>
33:             <div nz-col [nzSpan]="6">
34:               <i nz-icon nzType="cloud" class="bg-success text-white"></i>
35:               <small>Cloud</small>
36:             </div>
37:             <div nz-col [nzSpan]="6">
38:               <i nz-icon nzType="star" class="bg-magenta text-white"></i>
39:               <small>Star</small>
40:             </div>
41:             <div nz-col [nzSpan]="6">
42:               <i nz-icon nzType="team" class="bg-purple text-white"></i>
43:               <small>Team</small>
44:             </div>
45:             <div nz-col [nzSpan]="6">
46:               <i nz-icon nzType="scan" class="bg-warning text-white"></i>
47:               <small>QR</small>
48:             </div>
49:             <div nz-col [nzSpan]="6">
50:               <i nz-icon nzType="pay-circle" class="bg-cyan text-white"></i>
51:               <small>Pay</small>
52:             </div>
53:             <div nz-col [nzSpan]="6">
54:               <i nz-icon nzType="printer" class="bg-grey text-white"></i>
55:               <small>Print</small>
56:             </div>
57:           </div>
58:         </nz-spin>
59:       </div>
60:     </nz-dropdown-menu>
61:   `,
62:   changeDetection: ChangeDetectionStrategy.OnPush,
63:   imports: [NzDropDownModule, NzIconModule, NzMenuModule, NzGridModule, NzSpinModule]
64: })
65: export class HeaderIconComponent {
66:   private readonly cdr = inject(ChangeDetectorRef);
67:   loading = true;
68: 
69:   change(): void {
70:     setTimeout(() => {
71:       this.loading = false;
72:       this.cdr.detectChanges();
73:     }, 500);
74:   }
75: }
````

## File: src/app/layout/basic/widgets/notify.component.ts
````typescript
  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
  2: import { NoticeIconList, NoticeIconModule, NoticeIconSelect, NoticeItem } from '@delon/abc/notice-icon';
  3: import { add, formatDistanceToNow, parse } from 'date-fns';
  4: import { NzI18nService } from 'ng-zorro-antd/i18n';
  5: import { NzMessageService } from 'ng-zorro-antd/message';
  6: 
  7: @Component({
  8:   selector: 'header-notify',
  9:   template: `
 10:     <notice-icon
 11:       [data]="data"
 12:       [count]="count"
 13:       [loading]="loading"
 14:       btnClass="alain-default__nav-item"
 15:       btnIconClass="alain-default__nav-item-icon"
 16:       (select)="select($event)"
 17:       (clear)="clear($event)"
 18:       (popoverVisibleChange)="loadData()"
 19:     />
 20:   `,
 21:   changeDetection: ChangeDetectionStrategy.OnPush,
 22:   imports: [NoticeIconModule]
 23: })
 24: export class HeaderNotifyComponent {
 25:   private readonly msg = inject(NzMessageService);
 26:   private readonly nzI18n = inject(NzI18nService);
 27:   private readonly cdr = inject(ChangeDetectorRef);
 28:   data: NoticeItem[] = [
 29:     {
 30:       title: '通知',
 31:       list: [],
 32:       emptyText: '你已查看所有通知',
 33:       emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
 34:       clearText: '清空通知'
 35:     },
 36:     {
 37:       title: '消息',
 38:       list: [],
 39:       emptyText: '您已读完所有消息',
 40:       emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
 41:       clearText: '清空消息'
 42:     },
 43:     {
 44:       title: '待办',
 45:       list: [],
 46:       emptyText: '你已完成所有待办',
 47:       emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
 48:       clearText: '清空待办'
 49:     }
 50:   ];
 51:   count = 5;
 52:   loading = false;
 53: 
 54:   private updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
 55:     const data = this.data.slice();
 56:     data.forEach(i => (i.list = []));
 57: 
 58:     notices.forEach(item => {
 59:       const newItem = { ...item } as NoticeIconList;
 60:       if (typeof newItem.datetime === 'string') {
 61:         newItem.datetime = parse(newItem.datetime, 'yyyy-MM-dd', new Date());
 62:       }
 63:       if (newItem.datetime) {
 64:         newItem.datetime = formatDistanceToNow(newItem.datetime as Date, { locale: this.nzI18n.getDateLocale() });
 65:       }
 66:       if (newItem.extra && newItem['status']) {
 67:         newItem['color'] = (
 68:           {
 69:             todo: undefined,
 70:             processing: 'blue',
 71:             urgent: 'red',
 72:             doing: 'gold'
 73:           } as Record<string, string | undefined>
 74:         )[newItem['status']];
 75:       }
 76:       data.find(w => w.title === newItem['type'])!.list.push(newItem);
 77:     });
 78:     return data;
 79:   }
 80: 
 81:   loadData(): void {
 82:     if (this.loading) {
 83:       return;
 84:     }
 85:     this.loading = true;
 86:     setTimeout(() => {
 87:       const now = new Date();
 88:       this.data = this.updateNoticeData([
 89:         {
 90:           id: '000000001',
 91:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
 92:           title: '你收到了 14 份新周报',
 93:           datetime: add(now, { days: 10 }),
 94:           type: '通知'
 95:         },
 96:         {
 97:           id: '000000002',
 98:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
 99:           title: '你推荐的 曲妮妮 已通过第三轮面试',
100:           datetime: add(now, { days: -3 }),
101:           type: '通知'
102:         },
103:         {
104:           id: '000000003',
105:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
106:           title: '这种模板可以区分多种通知类型',
107:           datetime: add(now, { months: -3 }),
108:           read: true,
109:           type: '通知'
110:         },
111:         {
112:           id: '000000004',
113:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
114:           title: '左侧图标用于区分不同的类型',
115:           datetime: add(now, { years: -1 }),
116:           type: '通知'
117:         },
118:         {
119:           id: '000000005',
120:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
121:           title: '内容不要超过两行字，超出时自动截断',
122:           datetime: '2017-08-07',
123:           type: '通知'
124:         },
125:         {
126:           id: '000000006',
127:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
128:           title: '曲丽丽 评论了你',
129:           description: '描述信息描述信息描述信息',
130:           datetime: '2017-08-07',
131:           type: '消息'
132:         },
133:         {
134:           id: '000000007',
135:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
136:           title: '朱偏右 回复了你',
137:           description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
138:           datetime: '2017-08-07',
139:           type: '消息'
140:         },
141:         {
142:           id: '000000008',
143:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
144:           title: '标题',
145:           description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
146:           datetime: '2017-08-07',
147:           type: '消息'
148:         },
149:         {
150:           id: '000000009',
151:           title: '任务名称',
152:           description: '任务需要在 2017-01-12 20:00 前启动',
153:           extra: '未开始',
154:           status: 'todo',
155:           type: '待办'
156:         },
157:         {
158:           id: '000000010',
159:           title: '第三方紧急代码变更',
160:           description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
161:           extra: '马上到期',
162:           status: 'urgent',
163:           type: '待办'
164:         },
165:         {
166:           id: '000000011',
167:           title: '信息安全考试',
168:           description: '指派竹尔于 2017-01-09 前完成更新并发布',
169:           extra: '已耗时 8 天',
170:           status: 'doing',
171:           type: '待办'
172:         },
173:         {
174:           id: '000000012',
175:           title: 'ABCD 版本发布',
176:           description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
177:           extra: '进行中',
178:           status: 'processing',
179:           type: '待办'
180:         }
181:       ]);
182: 
183:       this.loading = false;
184:       this.cdr.detectChanges();
185:     }, 500);
186:   }
187: 
188:   clear(type: string): void {
189:     this.msg.success(`清空了 ${type}`);
190:   }
191: 
192:   select(res: NoticeIconSelect): void {
193:     this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
194:   }
195: }
````

## File: src/app/layout/basic/widgets/rtl.component.ts
````typescript
 1: import { UpperCasePipe } from '@angular/common';
 2: import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
 3: import { RTLService } from '@delon/theme';
 4: import { NzIconModule } from 'ng-zorro-antd/icon';
 5: 
 6: @Component({
 7:   selector: 'header-rtl',
 8:   template: `
 9:     <i nz-icon [nzType]="rtl.nextDir === 'rtl' ? 'border-left' : 'border-right'"></i>
10:     {{ rtl.nextDir | uppercase }}
11:   `,
12:   host: {
13:     '[class.flex-1]': 'true'
14:   },
15:   changeDetection: ChangeDetectionStrategy.OnPush,
16:   imports: [NzIconModule, UpperCasePipe]
17: })
18: export class HeaderRTLComponent {
19:   readonly rtl = inject(RTLService);
20: 
21:   @HostListener('click')
22:   toggleDirection(): void {
23:     this.rtl.toggle();
24:   }
25: }
````

## File: src/app/layout/basic/widgets/search.component.ts
````typescript
  1: import {
  2:   AfterViewInit,
  3:   ChangeDetectionStrategy,
  4:   ChangeDetectorRef,
  5:   Component,
  6:   ElementRef,
  7:   EventEmitter,
  8:   HostBinding,
  9:   Input,
 10:   OnDestroy,
 11:   Output,
 12:   inject
 13: } from '@angular/core';
 14: import { FormsModule } from '@angular/forms';
 15: import { I18nPipe } from '@delon/theme';
 16: import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
 17: import { NzIconModule } from 'ng-zorro-antd/icon';
 18: import { NzInputModule } from 'ng-zorro-antd/input';
 19: import { BehaviorSubject, debounceTime, distinctUntilChanged, tap } from 'rxjs';
 20: 
 21: @Component({
 22:   selector: 'header-search',
 23:   template: `
 24:     <nz-input-group [nzPrefix]="iconTpl" [nzSuffix]="loadingTpl">
 25:       <ng-template #iconTpl>
 26:         <i nz-icon [nzType]="focus ? 'arrow-down' : 'search'"></i>
 27:       </ng-template>
 28:       <ng-template #loadingTpl>
 29:         @if (loading) {
 30:           <i nz-icon nzType="loading"></i>
 31:         }
 32:       </ng-template>
 33:       <input
 34:         type="text"
 35:         nz-input
 36:         [(ngModel)]="q"
 37:         [nzAutocomplete]="auto"
 38:         (input)="search($event)"
 39:         (focus)="qFocus()"
 40:         (blur)="qBlur()"
 41:         hotkey="F1"
 42:         [attr.placeholder]="'menu.search.placeholder' | i18n"
 43:       />
 44:     </nz-input-group>
 45:     <nz-autocomplete nzBackfill #auto>
 46:       @for (i of options; track $index) {
 47:         <nz-auto-option [nzValue]="i">{{ i }}</nz-auto-option>
 48:       }
 49:     </nz-autocomplete>
 50:   `,
 51:   changeDetection: ChangeDetectionStrategy.OnPush,
 52:   imports: [FormsModule, I18nPipe, NzInputModule, NzIconModule, NzAutocompleteModule]
 53: })
 54: export class HeaderSearchComponent implements AfterViewInit, OnDestroy {
 55:   private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
 56:   private readonly cdr = inject(ChangeDetectorRef);
 57:   q = '';
 58:   qIpt: HTMLInputElement | null = null;
 59:   options: string[] = [];
 60:   search$ = new BehaviorSubject('');
 61:   loading = false;
 62: 
 63:   @HostBinding('class.alain-default__search-focus')
 64:   focus = false;
 65:   @HostBinding('class.alain-default__search-toggled')
 66:   searchToggled = false;
 67: 
 68:   @Input()
 69:   set toggleChange(value: boolean) {
 70:     if (typeof value === 'undefined') {
 71:       return;
 72:     }
 73:     this.searchToggled = value;
 74:     this.focus = value;
 75:     if (value) {
 76:       setTimeout(() => this.qIpt!.focus());
 77:     }
 78:   }
 79:   @Output() readonly toggleChangeChange = new EventEmitter<boolean>();
 80: 
 81:   ngAfterViewInit(): void {
 82:     this.qIpt = this.el.querySelector('.ant-input') as HTMLInputElement;
 83:     this.search$
 84:       .pipe(
 85:         debounceTime(500),
 86:         distinctUntilChanged(),
 87:         tap({
 88:           complete: () => {
 89:             this.loading = true;
 90:           }
 91:         })
 92:       )
 93:       .subscribe(value => {
 94:         this.options = value ? [value, value + value, value + value + value] : [];
 95:         this.loading = false;
 96:         this.cdr.detectChanges();
 97:       });
 98:   }
 99: 
100:   qFocus(): void {
101:     this.focus = true;
102:   }
103: 
104:   qBlur(): void {
105:     this.focus = false;
106:     this.searchToggled = false;
107:     this.options.length = 0;
108:     this.toggleChangeChange.emit(false);
109:   }
110: 
111:   search(ev: Event): void {
112:     this.search$.next((ev.target as HTMLInputElement).value);
113:   }
114: 
115:   ngOnDestroy(): void {
116:     this.search$.complete();
117:     this.search$.unsubscribe();
118:   }
119: }
````

## File: src/app/layout/basic/widgets/task.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
 2: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
 3: import { NzBadgeModule } from 'ng-zorro-antd/badge';
 4: import { NzCardModule } from 'ng-zorro-antd/card';
 5: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 6: import { NzGridModule } from 'ng-zorro-antd/grid';
 7: import { NzIconModule } from 'ng-zorro-antd/icon';
 8: import { NzSpinModule } from 'ng-zorro-antd/spin';
 9: 
10: @Component({
11:   selector: 'header-task',
12:   template: `
13:     <div
14:       class="alain-default__nav-item"
15:       nz-dropdown
16:       [nzDropdownMenu]="taskMenu"
17:       nzTrigger="click"
18:       nzPlacement="bottomRight"
19:       (nzVisibleChange)="change()"
20:     >
21:       <nz-badge [nzDot]="true">
22:         <i nz-icon nzType="bell" class="alain-default__nav-item-icon"></i>
23:       </nz-badge>
24:     </div>
25:     <nz-dropdown-menu #taskMenu="nzDropdownMenu">
26:       <div nz-menu class="wd-lg">
27:         @if (loading) {
28:           <div class="mx-lg p-lg"><nz-spin /></div>
29:         } @else {
30:           <nz-card nzTitle="Notifications" nzBordered="false" class="ant-card__body-nopadding">
31:             <ng-template #extra><i nz-icon nzType="plus"></i></ng-template>
32:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
33:               <div nz-col [nzSpan]="4" class="text-center">
34:                 <nz-avatar [nzSrc]="'./assets/tmp/img/1.png'" />
35:               </div>
36:               <div nz-col [nzSpan]="20">
37:                 <strong>cipchk</strong>
38:                 <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
39:               </div>
40:             </div>
41:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
42:               <div nz-col [nzSpan]="4" class="text-center">
43:                 <nz-avatar [nzSrc]="'./assets/tmp/img/2.png'" />
44:               </div>
45:               <div nz-col [nzSpan]="20">
46:                 <strong>はなさき</strong>
47:                 <p class="mb0">ハルカソラトキヘダツヒカリ</p>
48:               </div>
49:             </div>
50:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
51:               <div nz-col [nzSpan]="4" class="text-center">
52:                 <nz-avatar [nzSrc]="'./assets/tmp/img/3.png'" />
53:               </div>
54:               <div nz-col [nzSpan]="20">
55:                 <strong>苏先生</strong>
56:                 <p class="mb0">请告诉我，我应该说点什么好？</p>
57:               </div>
58:             </div>
59:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
60:               <div nz-col [nzSpan]="4" class="text-center">
61:                 <nz-avatar [nzSrc]="'./assets/tmp/img/4.png'" />
62:               </div>
63:               <div nz-col [nzSpan]="20">
64:                 <strong>Kent</strong>
65:                 <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
66:               </div>
67:             </div>
68:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
69:               <div nz-col [nzSpan]="4" class="text-center">
70:                 <nz-avatar [nzSrc]="'./assets/tmp/img/5.png'" />
71:               </div>
72:               <div nz-col [nzSpan]="20">
73:                 <strong>Jefferson</strong>
74:                 <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
75:               </div>
76:             </div>
77:             <div nz-row>
78:               <div nz-col [nzSpan]="24" class="pt-md border-top-1 text-center text-grey point">See All</div>
79:             </div>
80:           </nz-card>
81:         }
82:       </div>
83:     </nz-dropdown-menu>
84:   `,
85:   changeDetection: ChangeDetectionStrategy.OnPush,
86:   imports: [NzDropDownModule, NzBadgeModule, NzIconModule, NzSpinModule, NzGridModule, NzAvatarModule, NzCardModule]
87: })
88: export class HeaderTaskComponent {
89:   private readonly cdr = inject(ChangeDetectorRef);
90:   loading = true;
91: 
92:   change(): void {
93:     setTimeout(() => {
94:       this.loading = false;
95:       this.cdr.detectChanges();
96:     }, 500);
97:   }
98: }
````

## File: src/app/layout/basic/widgets/user.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { Router, RouterLink } from '@angular/router';
 3: import { DA_SERVICE_TOKEN } from '@delon/auth';
 4: import { I18nPipe, SettingsService, User } from '@delon/theme';
 5: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
 6: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 7: import { NzIconModule } from 'ng-zorro-antd/icon';
 8: import { NzMenuModule } from 'ng-zorro-antd/menu';
 9: 
10: @Component({
11:   selector: 'header-user',
12:   template: `
13:     <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown nzPlacement="bottomRight" [nzDropdownMenu]="userMenu">
14:       <nz-avatar [nzSrc]="user.avatar" nzSize="small" class="mr-sm" />
15:       {{ user.name }}
16:     </div>
17:     <nz-dropdown-menu #userMenu="nzDropdownMenu">
18:       <div nz-menu class="width-sm">
19:         <div nz-menu-item routerLink="/pro/account/center">
20:           <i nz-icon nzType="user" class="mr-sm"></i>
21:           {{ 'menu.account.center' | i18n }}
22:         </div>
23:         <div nz-menu-item routerLink="/pro/account/settings">
24:           <i nz-icon nzType="setting" class="mr-sm"></i>
25:           {{ 'menu.account.settings' | i18n }}
26:         </div>
27:         <div nz-menu-item routerLink="/exception/trigger">
28:           <i nz-icon nzType="close-circle" class="mr-sm"></i>
29:           {{ 'menu.account.trigger' | i18n }}
30:         </div>
31:         <li nz-menu-divider></li>
32:         <div nz-menu-item (click)="logout()">
33:           <i nz-icon nzType="logout" class="mr-sm"></i>
34:           {{ 'menu.account.logout' | i18n }}
35:         </div>
36:       </div>
37:     </nz-dropdown-menu>
38:   `,
39:   changeDetection: ChangeDetectionStrategy.OnPush,
40:   imports: [RouterLink, NzDropDownModule, NzMenuModule, NzIconModule, I18nPipe, NzAvatarModule]
41: })
42: export class HeaderUserComponent {
43:   private readonly settings = inject(SettingsService);
44:   private readonly router = inject(Router);
45:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
46:   get user(): User {
47:     return this.settings.user;
48:   }
49: 
50:   logout(): void {
51:     this.tokenService.clear();
52:     this.router.navigateByUrl(this.tokenService.login_url!);
53:   }
54: }
````

## File: src/app/layout/blank/blank.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { RouterOutlet } from '@angular/router';
 3: 
 4: @Component({
 5:   selector: 'layout-blank',
 6:   template: `<router-outlet />`,
 7:   host: {
 8:     '[class.alain-blank]': 'true'
 9:   },
10:   imports: [RouterOutlet]
11: })
12: export class LayoutBlankComponent {}
````

## File: src/app/layout/index.ts
````typescript
1: export * from './basic/basic.component';
2: export * from './blank/blank.component';
3: export * from './passport/passport.component';
````

## File: src/app/layout/passport/passport.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { RouterOutlet } from '@angular/router';
 3: import { GlobalFooterModule } from '@delon/abc/global-footer';
 4: import { DA_SERVICE_TOKEN } from '@delon/auth';
 5: import { ThemeBtnComponent } from '@delon/theme/theme-btn';
 6: import { NzIconModule } from 'ng-zorro-antd/icon';
 7: 
 8: import { HeaderI18nComponent } from '../basic/widgets/i18n.component';
 9: 
10: @Component({
11:   selector: 'layout-passport',
12:   template: `
13:     <div class="container">
14:       <header-i18n showLangText="false" class="langs" />
15:       <div class="wrap">
16:         <div class="top">
17:           <div class="head">
18:             <img class="logo" src="./assets/logo-color.svg" />
19:             <span class="title">NG-ALAIN</span>
20:           </div>
21:           <div class="desc">武林中最有影响力的《葵花宝典》；欲练神功，挥刀自宫</div>
22:         </div>
23:         <router-outlet />
24:         <global-footer [links]="links">
25:           Copyright
26:           <i nz-icon nzType="copyright"></i> 2023 <a href="//github.com/cipchk" target="_blank">卡色</a>出品
27:         </global-footer>
28:       </div>
29:     </div>
30:     <theme-btn />
31:   `,
32:   styleUrls: ['./passport.component.less'],
33:   imports: [RouterOutlet, HeaderI18nComponent, GlobalFooterModule, NzIconModule, ThemeBtnComponent]
34: })
35: export class LayoutPassportComponent implements OnInit {
36:   private tokenService = inject(DA_SERVICE_TOKEN);
37: 
38:   links = [
39:     {
40:       title: '帮助',
41:       href: ''
42:     },
43:     {
44:       title: '隐私',
45:       href: ''
46:     },
47:     {
48:       title: '条款',
49:       href: ''
50:     }
51:   ];
52: 
53:   ngOnInit(): void {
54:     this.tokenService.clear();
55:   }
56: }
````

## File: src/app/routes/dashboard/analysis/analysis.component.ts
````typescript
  1: import { DecimalPipe } from '@angular/common';
  2: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
  3: import { STColumn } from '@delon/abc/st';
  4: import { G2BarModule } from '@delon/chart/bar';
  5: import { G2CardModule } from '@delon/chart/card';
  6: import { G2MiniAreaModule } from '@delon/chart/mini-area';
  7: import { G2MiniBarModule } from '@delon/chart/mini-bar';
  8: import { G2MiniProgressModule } from '@delon/chart/mini-progress';
  9: import { NumberInfoModule } from '@delon/chart/number-info';
 10: import { G2PieModule } from '@delon/chart/pie';
 11: import { G2TimelineModule } from '@delon/chart/timeline';
 12: import { TrendModule } from '@delon/chart/trend';
 13: import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
 14: import { getTimeDistance } from '@delon/util/date-time';
 15: import { deepCopy } from '@delon/util/other';
 16: import { SHARED_IMPORTS, yuan } from '@shared';
 17: import type { NzSafeAny } from 'ng-zorro-antd/core/types';
 18: import { NzMessageService } from 'ng-zorro-antd/message';
 19: 
 20: @Component({
 21:   selector: 'app-dashboard-analysis',
 22:   templateUrl: './analysis.component.html',
 23:   styleUrls: ['./analysis.component.less'],
 24:   changeDetection: ChangeDetectionStrategy.OnPush,
 25:   imports: [
 26:     ...SHARED_IMPORTS,
 27:     G2TimelineModule,
 28:     G2PieModule,
 29:     NumberInfoModule,
 30:     TrendModule,
 31:     G2MiniAreaModule,
 32:     DecimalPipe,
 33:     G2BarModule,
 34:     G2MiniProgressModule,
 35:     G2CardModule,
 36:     G2MiniBarModule
 37:   ]
 38: })
 39: export class DashboardAnalysisComponent implements OnInit {
 40:   private readonly http = inject(_HttpClient);
 41:   readonly msg = inject(NzMessageService);
 42:   private readonly i18n = inject(ALAIN_I18N_TOKEN);
 43:   private readonly cdr = inject(ChangeDetectorRef);
 44: 
 45:   data: any = {};
 46:   loading = true;
 47:   dateRange: Date[] = [];
 48:   dateRangeTypes = ['today', 'week', 'month', 'year'];
 49:   dateRangeType = this.dateRangeTypes[0];
 50:   rankingListData: Array<{ title: string; total: number }> = Array(7)
 51:     .fill({})
 52:     .map((_, i) => {
 53:       return {
 54:         title: this.i18n.fanyi('app.analysis.test', { no: i }),
 55:         total: 323234
 56:       };
 57:     });
 58:   titleMap = {
 59:     y1: this.i18n.fanyi('app.analysis.traffic'),
 60:     y2: this.i18n.fanyi('app.analysis.payments')
 61:   };
 62:   searchColumn: STColumn[] = [
 63:     { title: { text: '排名', i18n: 'app.analysis.table.rank' }, index: 'index' },
 64:     {
 65:       title: { text: '搜索关键词', i18n: 'app.analysis.table.search-keyword' },
 66:       index: 'keyword',
 67:       click: item => this.msg.success(item.keyword)
 68:     },
 69:     {
 70:       type: 'number',
 71:       title: { text: '用户数', i18n: 'app.analysis.table.users' },
 72:       index: 'count',
 73:       sort: {
 74:         compare: (a, b) => a.count - b.count
 75:       }
 76:     },
 77:     {
 78:       type: 'number',
 79:       title: { text: '周涨幅', i18n: 'app.analysis.table.weekly-range' },
 80:       index: 'range',
 81:       render: 'range',
 82:       sort: {
 83:         compare: (a, b) => a.range - b.range
 84:       }
 85:     }
 86:   ];
 87: 
 88:   salesType = 'all';
 89:   salesPieData: any;
 90:   salesTotal = 0;
 91: 
 92:   saleTabs: string[] = ['sales', 'visits'];
 93: 
 94:   offlineIdx = 0;
 95: 
 96:   ngOnInit(): void {
 97:     this.http.get('/chart').subscribe(res => {
 98:       res.offlineData.forEach((item: any) => {
 99:         item.chart = deepCopy(res.offlineChartData);
100:       });
101:       this.data = res;
102:       this.loading = false;
103:       this.changeSaleType();
104:     });
105:   }
106: 
107:   setDate(type: string): void {
108:     this.dateRange = getTimeDistance(type as NzSafeAny);
109:     this.dateRangeType = type;
110:     setTimeout(() => this.cdr.detectChanges());
111:   }
112:   changeSaleType(): void {
113:     this.salesPieData =
114:       this.salesType === 'all'
115:         ? this.data.salesTypeData
116:         : this.salesType === 'online'
117:           ? this.data.salesTypeDataOnline
118:           : this.data.salesTypeDataOffline;
119:     if (this.salesPieData) {
120:       this.salesTotal = this.salesPieData.reduce((pre: number, now: { y: number }) => now.y + pre, 0);
121:     }
122:     this.cdr.detectChanges();
123:   }
124: 
125:   handlePieValueFormat(value: string | number): string {
126:     return yuan(value);
127:   }
128:   offlineChange(idx: number): void {
129:     if (this.data.offlineData[idx].show !== true) {
130:       this.data.offlineData[idx].show = true;
131:       this.cdr.detectChanges();
132:     }
133:   }
134: }
````

## File: src/app/routes/dashboard/monitor/monitor.component.ts
````typescript
  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
  2: import { CountDownModule } from '@delon/abc/count-down';
  3: import { G2GaugeModule } from '@delon/chart/gauge';
  4: import { G2MiniAreaModule } from '@delon/chart/mini-area';
  5: import { NumberInfoModule } from '@delon/chart/number-info';
  6: import { G2PieModule } from '@delon/chart/pie';
  7: import { G2TagCloudModule } from '@delon/chart/tag-cloud';
  8: import { G2WaterWaveModule } from '@delon/chart/water-wave';
  9: import { _HttpClient } from '@delon/theme';
 10: import { SHARED_IMPORTS } from '@shared';
 11: import type { CountdownConfig } from 'ngx-countdown';
 12: import { zip } from 'rxjs';
 13: 
 14: @Component({
 15:   selector: 'app-dashboard-monitor',
 16:   templateUrl: './monitor.component.html',
 17:   styleUrls: ['./monitor.component.less'],
 18:   changeDetection: ChangeDetectionStrategy.OnPush,
 19:   imports: [
 20:     ...SHARED_IMPORTS,
 21:     G2WaterWaveModule,
 22:     G2TagCloudModule,
 23:     G2PieModule,
 24:     G2GaugeModule,
 25:     G2MiniAreaModule,
 26:     NumberInfoModule,
 27:     CountDownModule
 28:   ]
 29: })
 30: export class DashboardMonitorComponent implements OnInit, OnDestroy {
 31:   private readonly http = inject(_HttpClient);
 32:   private readonly cdr = inject(ChangeDetectorRef);
 33: 
 34:   data: any = {};
 35:   tags = [];
 36:   loading = true;
 37:   q = {
 38:     start: null,
 39:     end: null
 40:   };
 41:   percent: number | null = null;
 42:   cd: CountdownConfig = {
 43:     format: `HH:mm:ss.S`,
 44:     leftTime: 10000
 45:   };
 46: 
 47:   // region: active chart
 48: 
 49:   activeTime$: any;
 50: 
 51:   activeData!: any[];
 52: 
 53:   activeStat = {
 54:     max: 0,
 55:     min: 0,
 56:     t1: '',
 57:     t2: ''
 58:   };
 59: 
 60:   ngOnInit(): void {
 61:     zip(this.http.get('/chart'), this.http.get('/chart/tags')).subscribe(([res, tags]: [any, any]) => {
 62:       this.data = res;
 63:       tags.list[Math.floor(Math.random() * tags.list.length) + 1].value = 1000;
 64:       this.tags = tags.list;
 65:       this.loading = false;
 66:       this.cdr.detectChanges();
 67:     });
 68: 
 69:     // active chart
 70:     this.refData();
 71:     this.activeTime$ = setInterval(() => this.refData(), 1000 * 2);
 72:   }
 73: 
 74:   refData(): void {
 75:     const activeData: any[] = [];
 76:     for (let i = 0; i < 24; i += 1) {
 77:       activeData.push({
 78:         x: `${i.toString().padStart(2, '0')}:00`,
 79:         y: i * 50 + Math.floor(Math.random() * 200)
 80:       });
 81:     }
 82:     this.activeData = activeData;
 83:     // stat
 84:     this.activeStat.max = [...activeData].sort()[activeData.length - 1].y + 200;
 85:     this.activeStat.min = [...activeData].sort()[Math.floor(activeData.length / 2)].y;
 86:     this.activeStat.t1 = activeData[Math.floor(activeData.length / 2)].x;
 87:     this.activeStat.t2 = activeData[activeData.length - 1].x;
 88:     // percent
 89:     this.percent = Math.floor(Math.random() * 100);
 90:     this.cdr.detectChanges();
 91:   }
 92: 
 93:   // endregion
 94: 
 95:   couponFormat(val: any): string {
 96:     switch (parseInt(val, 10)) {
 97:       case 20:
 98:         return '差';
 99:       case 40:
100:         return '中';
101:       case 60:
102:         return '良';
103:       case 80:
104:         return '优';
105:       default:
106:         return '';
107:     }
108:   }
109: 
110:   ngOnDestroy(): void {
111:     if (this.activeTime$) {
112:       clearInterval(this.activeTime$);
113:     }
114:   }
115: }
````

## File: src/app/routes/dashboard/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: import { DashboardAnalysisComponent } from './analysis/analysis.component';
 4: import { DashboardMonitorComponent } from './monitor/monitor.component';
 5: import { DashboardV1Component } from './v1/v1.component';
 6: import { DashboardWorkplaceComponent } from './workplace/workplace.component';
 7: 
 8: export const routes: Routes = [
 9:   { path: '', redirectTo: 'v1', pathMatch: 'full' },
10:   { path: 'v1', component: DashboardV1Component },
11:   { path: 'analysis', component: DashboardAnalysisComponent },
12:   { path: 'monitor', component: DashboardMonitorComponent },
13:   { path: 'workplace', component: DashboardWorkplaceComponent }
14: ];
````

## File: src/app/routes/dashboard/v1/v1.component.ts
````typescript
  1: import { Platform } from '@angular/cdk/platform';
  2: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, DOCUMENT } from '@angular/core';
  3: import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
  4: import type { Chart } from '@antv/g2';
  5: import { OnboardingModule, OnboardingService } from '@delon/abc/onboarding';
  6: import { QuickMenuModule } from '@delon/abc/quick-menu';
  7: import { G2BarModule } from '@delon/chart/bar';
  8: import { G2MiniBarModule } from '@delon/chart/mini-bar';
  9: import { G2TimelineModule } from '@delon/chart/timeline';
 10: import { _HttpClient } from '@delon/theme';
 11: import { SHARED_IMPORTS } from '@shared';
 12: import { timer } from 'rxjs';
 13: 
 14: @Component({
 15:   selector: 'app-dashboard-v1',
 16:   templateUrl: './v1.component.html',
 17:   changeDetection: ChangeDetectionStrategy.OnPush,
 18:   imports: [...SHARED_IMPORTS, G2TimelineModule, G2BarModule, G2MiniBarModule, QuickMenuModule, OnboardingModule]
 19: })
 20: export class DashboardV1Component implements OnInit {
 21:   private readonly http = inject(_HttpClient);
 22:   private readonly cdr = inject(ChangeDetectorRef);
 23:   private readonly obSrv = inject(OnboardingService);
 24:   private readonly platform = inject(Platform);
 25:   private readonly doc = inject(DOCUMENT);
 26:   todoData = [
 27:     {
 28:       completed: true,
 29:       avatar: '1',
 30:       name: '苏先生',
 31:       content: `请告诉我，我应该说点什么好？`
 32:     },
 33:     {
 34:       completed: false,
 35:       avatar: '2',
 36:       name: 'はなさき',
 37:       content: `ハルカソラトキヘダツヒカリ`
 38:     },
 39:     {
 40:       completed: false,
 41:       avatar: '3',
 42:       name: 'cipchk',
 43:       content: `this world was never meant for one as beautiful as you.`
 44:     },
 45:     {
 46:       completed: false,
 47:       avatar: '4',
 48:       name: 'Kent',
 49:       content: `my heart is beating with hers`
 50:     },
 51:     {
 52:       completed: false,
 53:       avatar: '5',
 54:       name: 'Are you',
 55:       content: `They always said that I love beautiful girl than my friends`
 56:     },
 57:     {
 58:       completed: false,
 59:       avatar: '6',
 60:       name: 'Forever',
 61:       content: `Walking through green fields ，sunshine in my eyes.`
 62:     }
 63:   ];
 64: 
 65:   webSite!: any[];
 66:   salesData!: any[];
 67:   offlineChartData!: any[];
 68: 
 69:   constructor() {
 70:     timer(1000)
 71:       .pipe(takeUntilDestroyed())
 72:       .subscribe(() => this.genOnboarding());
 73:   }
 74: 
 75:   fixDark(chart: Chart): void {
 76:     if (!this.platform.isBrowser || (this.doc.body as HTMLBodyElement).getAttribute('data-theme') !== 'dark') return;
 77: 
 78:     chart.theme({
 79:       styleSheet: {
 80:         backgroundColor: 'transparent'
 81:       }
 82:     });
 83:   }
 84: 
 85:   ngOnInit(): void {
 86:     this.http.get('/chart').subscribe(res => {
 87:       this.webSite = res.visitData.slice(0, 10);
 88:       this.salesData = res.salesData;
 89:       this.offlineChartData = res.offlineChartData;
 90:       this.cdr.detectChanges();
 91:     });
 92:   }
 93: 
 94:   private genOnboarding(): void {
 95:     const KEY = 'on-boarding';
 96:     if (!this.platform.isBrowser || localStorage.getItem(KEY) === '1') {
 97:       return;
 98:     }
 99:     this.http.get(`./assets/tmp/on-boarding.json`).subscribe(res => {
100:       this.obSrv.start(res);
101:       localStorage.setItem(KEY, '1');
102:     });
103:   }
104: }
````

## File: src/app/routes/dashboard/workplace/workplace.component.ts
````typescript
  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
  2: import { G2RadarModule } from '@delon/chart/radar';
  3: import { _HttpClient } from '@delon/theme';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
  6: import { NzMessageService } from 'ng-zorro-antd/message';
  7: import { zip } from 'rxjs';
  8: 
  9: @Component({
 10:   selector: 'app-dashboard-workplace',
 11:   templateUrl: './workplace.component.html',
 12:   styleUrls: ['./workplace.component.less'],
 13:   changeDetection: ChangeDetectionStrategy.OnPush,
 14:   imports: [...SHARED_IMPORTS, NzAvatarModule, G2RadarModule]
 15: })
 16: export class DashboardWorkplaceComponent implements OnInit {
 17:   private readonly http = inject(_HttpClient);
 18:   readonly msg = inject(NzMessageService);
 19:   private readonly cdr = inject(ChangeDetectorRef);
 20: 
 21:   notice: any[] = [];
 22:   activities: any[] = [];
 23:   radarData!: any[];
 24:   loading = true;
 25: 
 26:   links = [
 27:     {
 28:       title: '操作一',
 29:       href: ''
 30:     },
 31:     {
 32:       title: '操作二',
 33:       href: ''
 34:     },
 35:     {
 36:       title: '操作三',
 37:       href: ''
 38:     },
 39:     {
 40:       title: '操作四',
 41:       href: ''
 42:     },
 43:     {
 44:       title: '操作五',
 45:       href: ''
 46:     },
 47:     {
 48:       title: '操作六',
 49:       href: ''
 50:     }
 51:   ];
 52:   members = [
 53:     {
 54:       id: 'members-1',
 55:       title: '科学搬砖组',
 56:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
 57:       link: ''
 58:     },
 59:     {
 60:       id: 'members-2',
 61:       title: '程序员日常',
 62:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
 63:       link: ''
 64:     },
 65:     {
 66:       id: 'members-3',
 67:       title: '设计天团',
 68:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
 69:       link: ''
 70:     },
 71:     {
 72:       id: 'members-4',
 73:       title: '中二少女团',
 74:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
 75:       link: ''
 76:     },
 77:     {
 78:       id: 'members-5',
 79:       title: '骗你学计算机',
 80:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
 81:       link: ''
 82:     }
 83:   ];
 84: 
 85:   ngOnInit(): void {
 86:     zip(this.http.get('/chart'), this.http.get('/api/notice'), this.http.get('/api/activities')).subscribe(
 87:       ([chart, notice, activities]: [any, any, any]) => {
 88:         this.radarData = chart.radarData;
 89:         this.notice = notice;
 90:         this.activities = activities.map((item: any) => {
 91:           item.template = item.template.split(/@\{([^{}]*)\}/gi).map((key: string) => {
 92:             if (item[key]) {
 93:               return `<a>${item[key].name}</a>`;
 94:             }
 95:             return key;
 96:           });
 97:           return item;
 98:         });
 99:         this.loading = false;
100:         this.cdr.detectChanges();
101:       }
102:     );
103:   }
104: }
````

## File: src/app/routes/data-v/relation/relation.component.ts
````typescript
1: import { Component } from '@angular/core';
2: import { SHARED_IMPORTS } from '@shared';
3: 
4: @Component({
5:   selector: 'app-data-v-relation',
6:   templateUrl: './relation.component.html',
7:   imports: SHARED_IMPORTS
8: })
9: export class RelationComponent {}
````

## File: src/app/routes/data-v/routes.ts
````typescript
1: import { Routes } from '@angular/router';
2: 
3: import { RelationComponent } from './relation/relation.component';
4: 
5: export const routes: Routes = [{ path: 'relation', component: RelationComponent }];
````

## File: src/app/routes/delon/acl/acl.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { ACLService } from '@delon/acl';
 3: import { MenuService } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: 
 6: @Component({
 7:   selector: 'app-acl',
 8:   templateUrl: './acl.component.html',
 9:   imports: SHARED_IMPORTS
10: })
11: export class ACLComponent {
12:   private readonly aclSrv = inject(ACLService);
13:   private readonly menuSrv = inject(MenuService);
14: 
15:   full = true;
16:   roleA = '';
17:   roleB = '';
18: 
19:   get data(): {
20:     full: boolean;
21:     roles: string[];
22:     abilities: Array<string | number>;
23:   } {
24:     return this.aclSrv.data;
25:   }
26: 
27:   private reMenu(): void {
28:     this.menuSrv.resume();
29:   }
30: 
31:   toggleFull(): void {
32:     this.full = !this.full;
33:     this.aclSrv.setFull(this.full);
34:     this.reMenu();
35:   }
36: 
37:   toggleRoleA(): void {
38:     this.full = false;
39:     this.roleA = this.roleA === 'role-a' ? '' : 'role-a';
40:     this.aclSrv.setFull(this.full);
41:     this.aclSrv.setRole([this.roleA]);
42:     this.reMenu();
43:   }
44: 
45:   toggleRoleB(): void {
46:     this.full = false;
47:     this.roleB = this.roleB === 'role-b' ? '' : 'role-b';
48:     this.aclSrv.setFull(this.full);
49:     this.aclSrv.setRole([this.roleB]);
50:     this.reMenu();
51:   }
52: }
````

## File: src/app/routes/delon/cache/cache.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { CacheService } from '@delon/cache';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-cache',
 8:   templateUrl: './cache.component.html',
 9:   imports: SHARED_IMPORTS
10: })
11: export class CacheComponent {
12:   private readonly cache = inject(CacheService);
13:   private readonly msg = inject(NzMessageService);
14: 
15:   KEY = 'user';
16: 
17:   set(): void {
18:     this.cache.set(this.KEY, +new Date());
19:   }
20: 
21:   get(): void {
22:     this.msg.success(this.cache.getNone(this.KEY));
23:   }
24: }
````

## File: src/app/routes/delon/downfile/downfile.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { DownFileDirective } from '@delon/abc/down-file';
 3: import { SHARED_IMPORTS } from '@shared';
 4: 
 5: @Component({
 6:   selector: 'app-down-file',
 7:   templateUrl: './downfile.component.html',
 8:   imports: [...SHARED_IMPORTS, DownFileDirective]
 9: })
10: export class DownFileComponent {
11:   fileTypes = ['.xlsx', '.docx', '.pptx', '.pdf'];
12: 
13:   data = {
14:     otherdata: 1,
15:     time: new Date()
16:   };
17: }
````

## File: src/app/routes/delon/form/form.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { STColumn } from '@delon/abc/st';
 3: import { SFSchema } from '@delon/form';
 4: import { SHARED_IMPORTS } from '@shared';
 5: 
 6: @Component({
 7:   selector: 'app-delon-form',
 8:   templateUrl: './form.component.html',
 9:   imports: SHARED_IMPORTS
10: })
11: export class DelonFormComponent {
12:   params: any = {};
13:   url = `/user`;
14:   searchSchema: SFSchema = {
15:     properties: {
16:       no: {
17:         type: 'string',
18:         title: '编号'
19:       }
20:     }
21:   };
22:   columns: STColumn[] = [
23:     { title: '编号', index: 'no' },
24:     { title: '调用次数', type: 'number', index: 'callNo' },
25:     { title: '头像', type: 'img', width: '50px', index: 'avatar' },
26:     { title: '时间', type: 'date', index: 'updatedAt' }
27:   ];
28: }
````

## File: src/app/routes/delon/guard/admin.component.ts
````typescript
1: import { Component } from '@angular/core';
2: 
3: @Component({
4:   selector: 'app-guard-admin',
5:   template: ` <p>这是一个admin页面</p> `
6: })
7: export class GuardAdminComponent {}
````

## File: src/app/routes/delon/guard/auth.component.ts
````typescript
1: import { Component } from '@angular/core';
2: 
3: @Component({
4:   selector: 'app-guard-auth',
5:   template: ` <p>这是一个user1页面</p> `
6: })
7: export class GuardAuthComponent {}
````

## File: src/app/routes/delon/guard/can-leave.ts
````typescript
 1: import { inject } from '@angular/core';
 2: import { CanDeactivateFn } from '@angular/router';
 3: import { NzModalService } from 'ng-zorro-antd/modal';
 4: import { Observable } from 'rxjs';
 5: 
 6: import { GuardComponent } from './guard.component';
 7: 
 8: export const canLeave: CanDeactivateFn<GuardComponent> = (): Observable<boolean> => {
 9:   const srv = inject(NzModalService);
10:   return new Observable(observer => {
11:     srv.confirm({
12:       nzTitle: '确认要离开吗？',
13:       nzContent: '你已经填写了部分表单离开会放弃已经填写的内容。',
14:       nzOkText: '离开',
15:       nzCancelText: '取消',
16:       nzOnOk: () => {
17:         observer.next(true);
18:         observer.complete();
19:       },
20:       nzOnCancel: () => {
21:         observer.next(false);
22:         observer.complete();
23:       }
24:     });
25:   });
26: };
````

## File: src/app/routes/delon/guard/guard.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { Router } from '@angular/router';
 3: import { ACLService } from '@delon/acl';
 4: import { MenuService } from '@delon/theme';
 5: import { SHARED_IMPORTS } from '@shared';
 6: 
 7: @Component({
 8:   selector: 'app-guard',
 9:   templateUrl: './guard.component.html',
10:   imports: SHARED_IMPORTS
11: })
12: export class GuardComponent {
13:   private readonly aclSrv = inject(ACLService);
14:   private readonly menuSrv = inject(MenuService);
15:   private readonly router = inject(Router);
16: 
17:   get data(): any {
18:     return this.aclSrv.data;
19:   }
20: 
21:   setRole(value: string | boolean): void {
22:     this.aclSrv.setFull(false);
23:     if (typeof value === 'boolean') {
24:       this.aclSrv.setFull(value);
25:     } else {
26:       this.aclSrv.set({ role: [value as string] });
27:     }
28:     this.menuSrv.resume();
29:     this.router.navigate(['/delon/guard']);
30:   }
31: }
````

## File: src/app/routes/delon/guard/leave.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-guard-leave',
 6:   template: `
 7:     <p>离开时需要确认</p>
 8:     <button nz-button [nzType]="'primary'" [routerLink]="['/delon/guard']">
 9:       <span>我要离开</span>
10:     </button>
11:   `,
12:   imports: SHARED_IMPORTS
13: })
14: export class GuardLeaveComponent {}
````

## File: src/app/routes/delon/print/print.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { Lodop, LodopService } from '@delon/abc/lodop';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-print',
 8:   templateUrl: './print.component.html',
 9:   imports: SHARED_IMPORTS
10: })
11: export class PrintComponent {
12:   private readonly lodopSrv = inject(LodopService);
13:   private readonly msg = inject(NzMessageService);
14: 
15:   constructor() {
16:     this.lodopSrv.lodop.subscribe(({ lodop, ok }) => {
17:       if (!ok) {
18:         this.error = true;
19:         return;
20:       }
21:       this.error = false;
22:       this.msg.success(`打印机加载成功`);
23:       this.lodop = lodop as Lodop;
24:       this.pinters = this.lodopSrv.printer;
25:     });
26:   }
27: 
28:   cog: any = {
29:     url: 'https://localhost:8443/CLodopfuncs.js',
30:     printer: '',
31:     paper: '',
32:     html: `
33:       <h1>Title</h1>
34:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
35:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
36:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
37:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
38:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
39:     `
40:   };
41:   error = false;
42:   lodop: Lodop | null = null;
43:   pinters: any[] = [];
44:   papers: string[] = [];
45: 
46:   printing = false;
47: 
48:   reload(options: { url: string } | null = { url: 'https://localhost:8443/CLodopfuncs.js' }): void {
49:     this.pinters = [];
50:     this.papers = [];
51:     this.cog.printer = '';
52:     this.cog.paper = '';
53: 
54:     this.lodopSrv.cog = { ...this.cog, ...options };
55:     this.error = false;
56:     if (options === null) {
57:       this.lodopSrv.reset();
58:     }
59:   }
60: 
61:   changePinter(name: string): void {
62:     if (this.lodop == null) {
63:       return;
64:     }
65:     this.papers = this.lodop.GET_PAGESIZES_LIST(name, '\n').split('\n');
66:   }
67:   print(isPrivew = false): void {
68:     const LODOP = this.lodop as Lodop;
69:     LODOP.PRINT_INITA(10, 20, 810, 610, '测试C-Lodop远程打印四步骤');
70:     LODOP.SET_PRINTER_INDEXA(this.cog.printer);
71:     LODOP.SET_PRINT_PAGESIZE(0, 0, 0, this.cog.paper);
72:     LODOP.ADD_PRINT_TEXT(1, 1, 300, 200, '下面输出的是本页源代码及其展现效果：');
73:     LODOP.ADD_PRINT_TEXT(20, 10, '90%', '95%', this.cog.html);
74:     LODOP.SET_PRINT_STYLEA(0, 'ItemType', 4);
75:     LODOP.NEWPAGEA();
76:     LODOP.ADD_PRINT_HTM(20, 10, '90%', '95%', this.cog.html);
77:     if (isPrivew) {
78:       LODOP.PREVIEW();
79:     } else {
80:       LODOP.PRINT();
81:     }
82:   }
83: }
````

## File: src/app/routes/delon/qr/qr.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzQRCodeComponent } from 'ng-zorro-antd/qr-code';
 4: 
 5: @Component({
 6:   selector: 'app-qr',
 7:   templateUrl: './qr.component.html',
 8:   imports: [...SHARED_IMPORTS, NzQRCodeComponent]
 9: })
10: export class QRComponent {
11:   value = 'https://ng-alain.com/';
12:   background = '#ffffff';
13:   foreground = '#000000';
14:   level: 'L' | 'M' | 'Q' | 'H' = 'L';
15:   mime = 'image/png';
16:   padding = 10;
17:   size = 220;
18: }
````

## File: src/app/routes/delon/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: import { aclCanActivate } from '@delon/acl';
 3: 
 4: import { ACLComponent } from './acl/acl.component';
 5: import { CacheComponent } from './cache/cache.component';
 6: import { DownFileComponent } from './downfile/downfile.component';
 7: import { DelonFormComponent } from './form/form.component';
 8: import { GuardAdminComponent } from './guard/admin.component';
 9: import { GuardAuthComponent } from './guard/auth.component';
10: import { canLeave } from './guard/can-leave';
11: import { GuardComponent } from './guard/guard.component';
12: import { GuardLeaveComponent } from './guard/leave.component';
13: import { PrintComponent } from './print/print.component';
14: import { QRComponent } from './qr/qr.component';
15: import { STDemoComponent } from './st/st.component';
16: import { UtilComponent } from './util/util.component';
17: import { XlsxComponent } from './xlsx/xlsx.component';
18: import { ZipComponent } from './zip/zip.component';
19: 
20: export const routes: Routes = [
21:   { path: 'st', component: STDemoComponent },
22:   { path: 'util', component: UtilComponent },
23:   { path: 'print', component: PrintComponent },
24:   { path: 'acl', component: ACLComponent },
25:   {
26:     path: 'guard',
27:     component: GuardComponent,
28:     children: [
29:       {
30:         path: 'leave',
31:         component: GuardLeaveComponent,
32:         canDeactivate: [canLeave]
33:       },
34:       {
35:         path: 'auth',
36:         component: GuardAuthComponent,
37:         canActivate: [aclCanActivate],
38:         data: { guard: 'user1' }
39:       },
40:       {
41:         path: 'admin',
42:         component: GuardAdminComponent,
43:         canActivate: [aclCanActivate],
44:         data: { guard: 'admin' }
45:       }
46:     ]
47:   },
48:   { path: 'cache', component: CacheComponent },
49:   { path: 'qr', component: QRComponent },
50:   { path: 'downfile', component: DownFileComponent },
51:   { path: 'xlsx', component: XlsxComponent },
52:   { path: 'zip', component: ZipComponent },
53:   { path: 'form', component: DelonFormComponent }
54: ];
````

## File: src/app/routes/delon/st/st.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { FullContentModule } from '@delon/abc/full-content';
 3: import { STColumn } from '@delon/abc/st';
 4: import { G2MiniBarComponent, G2MiniBarData } from '@delon/chart/mini-bar';
 5: import { _HttpClient } from '@delon/theme';
 6: import { SHARED_IMPORTS } from '@shared';
 7: import { NzMessageService } from 'ng-zorro-antd/message';
 8: 
 9: @Component({
10:   selector: 'app-st',
11:   templateUrl: './st.component.html',
12:   imports: [...SHARED_IMPORTS, FullContentModule, G2MiniBarComponent]
13: })
14: export class STDemoComponent implements OnInit {
15:   readonly http = inject(_HttpClient);
16:   private readonly message = inject(NzMessageService);
17: 
18:   ps = 20;
19:   total = 200; // mock total
20:   args = { _allow_anonymous: true, userid: null };
21:   url = `https://api.randomuser.me/?results=20`;
22:   events: G2MiniBarData[] = [];
23:   scroll = { y: '230px' };
24:   columns: STColumn[] = [
25:     { title: 'id', index: 'id.value', type: 'checkbox' },
26:     { title: 'Avatar', index: 'picture.thumbnail', type: 'img', width: 80 },
27:     {
28:       title: 'Name',
29:       index: 'name.first',
30:       width: 150,
31:       format: item => `${item.name.first} ${item.name.last}`,
32:       type: 'link',
33:       click: item => this.message.info(`${item.name.first}`)
34:     },
35:     { title: 'Email', index: 'email' },
36:     {
37:       title: 'Gender',
38:       index: 'gender',
39:       type: 'yn',
40:       yn: {
41:         truth: 'female',
42:         yes: '男',
43:         no: '女',
44:         mode: 'text'
45:       },
46:       width: 120
47:     },
48:     { title: 'Events', render: 'events', width: 90 },
49:     { title: 'Registered', index: 'registered.date', type: 'date', width: 170 },
50:     {
51:       title: 'Actions',
52:       width: 120,
53:       buttons: [
54:         {
55:           text: 'Edit',
56:           click: item => this.message.info(`edit [${item.id.value}]`),
57:           iif: item => item.gender === 'female'
58:         },
59:         {
60:           text: 'Delete',
61:           type: 'del',
62:           click: item => this.message.info(`deleted [${item.id.value}]`)
63:         }
64:       ]
65:     }
66:   ];
67: 
68:   ngOnInit(): void {
69:     this.http.get('/chart/visit').subscribe((res: G2MiniBarData[]) => (this.events = res.slice(0, 8)));
70:   }
71: 
72:   fullChange(val?: boolean): void {
73:     this.scroll = val ? { y: '350px' } : { y: '230px' };
74:   }
75: }
````

## File: src/app/routes/delon/util/util.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { copy } from '@delon/util/browser';
 3: import { format } from '@delon/util/format';
 4: import { SHARED_IMPORTS, yuan } from '@shared';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: @Component({
 8:   selector: 'app-util',
 9:   templateUrl: './util.component.html',
10:   imports: SHARED_IMPORTS
11: })
12: export class UtilComponent {
13:   readonly messageSrv = inject(NzMessageService);
14: 
15:   format_str = 'this is ${name}';
16:   format_res = '';
17:   format_obj = JSON.stringify({ name: 'asdf' });
18: 
19:   // yuan
20:   yuan_str: any;
21:   yuan_res!: string;
22: 
23:   content = `time ${+new Date()}
24: 
25:     中文！@#￥%……&*`;
26:   onFormat(): void {
27:     let obj = null;
28:     try {
29:       obj = JSON.parse(this.format_obj);
30:     } catch {
31:       this.messageSrv.error(`无法使用 JSON.parse 转换`);
32:       return;
33:     }
34:     this.format_res = format(this.format_str, obj, true);
35:   }
36:   onYuan(value: string): void {
37:     this.yuan_res = yuan(value);
38:   }
39:   onCopy(): void {
40:     copy(`time ${+new Date()}`).then(() => this.messageSrv.success(`success`));
41:   }
42: }
````

## File: src/app/routes/delon/xlsx/xlsx.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { STColumn } from '@delon/abc/st';
 3: import { XlsxService } from '@delon/abc/xlsx';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 6: 
 7: @Component({
 8:   selector: 'app-xlsx',
 9:   templateUrl: './xlsx.component.html',
10:   imports: SHARED_IMPORTS
11: })
12: export class XlsxComponent {
13:   private readonly xlsx = inject(XlsxService);
14: 
15:   data: any;
16:   users: Array<{ id: number; name: string; age: number }> = Array(100)
17:     .fill(0)
18:     .map((_item: number, idx: number) => {
19:       return {
20:         id: idx + 1,
21:         name: `name ${idx + 1}`,
22:         age: Math.ceil(Math.random() * 10) + 20
23:       };
24:     });
25: 
26:   columns: STColumn[] = [
27:     { title: '编号', index: 'id', type: 'checkbox' },
28:     { title: '姓名', index: 'name' },
29:     { title: '年龄', index: 'age' }
30:   ];
31: 
32:   url(): void {
33:     this.xlsx.import(`./assets/tmp/demo.xlsx`).then(res => (this.data = res));
34:   }
35: 
36:   change(e: Event): void {
37:     const file = (e.target as HTMLInputElement).files![0];
38:     this.xlsx.import(file).then(res => (this.data = res));
39:   }
40: 
41:   download(): void {
42:     const data = [this.columns.map(i => i.title)];
43:     this.users.forEach((i: Record<string, NzSafeAny>) => data.push(this.columns.map(c => i[c.index as string])));
44:     this.xlsx.export({
45:       sheets: [
46:         {
47:           data,
48:           name: 'sheet name'
49:         }
50:       ]
51:     });
52:   }
53: }
````

## File: src/app/routes/delon/zip/zip.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { ZipService } from '@delon/abc/zip';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import type jsZipType from 'jszip';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: @Component({
 8:   selector: 'app-zip',
 9:   templateUrl: './zip.component.html',
10:   changeDetection: ChangeDetectionStrategy.OnPush,
11:   imports: SHARED_IMPORTS
12: })
13: export class ZipComponent implements OnInit {
14:   private readonly zip = inject(ZipService);
15:   private readonly msg = inject(NzMessageService);
16:   private readonly cdr = inject(ChangeDetectorRef);
17: 
18:   list: any;
19:   instance: jsZipType | null = null;
20:   data: Array<{ path?: string; url?: string }> = [
21:     { path: 'demo.docx', url: 'https://ng-alain.com/assets/demo.docx' },
22:     {
23:       path: '小程序标志.zip',
24:       url: 'https://wximg.gtimg.com/shake_tv/mina/standard_logo.zip'
25:     }
26:   ];
27: 
28:   ngOnInit(): void {
29:     this.zip.create().then(ret => {
30:       this.instance = ret;
31:       this.cdr.detectChanges();
32:     });
33:   }
34: 
35:   private format(data: any): void {
36:     const files = data.files;
37:     this.list = Object.keys(files).map(key => {
38:       return {
39:         name: key,
40:         dir: files[key].dir,
41:         date: files[key].date
42:       };
43:     });
44:     this.cdr.detectChanges();
45:   }
46: 
47:   url(): void {
48:     this.zip.read(`./assets/tmp/demo.zip`).then(res => this.format(res));
49:   }
50: 
51:   change(e: Event): void {
52:     const file = (e.target as HTMLInputElement).files![0];
53:     this.zip.read(file).then(res => this.format(res));
54:   }
55: 
56:   download(): void {
57:     const promises: Array<Promise<void>> = [];
58:     this.data.forEach(item => {
59:       promises.push(this.zip.pushUrl(this.instance, item.path!, item.url!));
60:     });
61:     Promise.all(promises).then(
62:       () => {
63:         this.zip.save(this.instance).then(() => {
64:           this.msg.success('download success');
65:           this.data = [];
66:         });
67:       },
68:       (error: unknown) => {
69:         console.warn(error);
70:         this.msg.error(JSON.stringify(error));
71:       }
72:     );
73:   }
74: }
````

## File: src/app/routes/exception/exception.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { ActivatedRoute } from '@angular/router';
 3: import { ExceptionModule, ExceptionType } from '@delon/abc/exception';
 4: 
 5: @Component({
 6:   selector: 'app-exception',
 7:   template: ` <exception [type]="type" style="min-height: 500px; height: 80%;" />`,
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   imports: [ExceptionModule]
10: })
11: export class ExceptionComponent {
12:   private readonly route = inject(ActivatedRoute);
13:   get type(): ExceptionType {
14:     return this.route.snapshot.data['type'];
15:   }
16: }
````

## File: src/app/routes/exception/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: import { ExceptionComponent } from './exception.component';
 4: import { ExceptionTriggerComponent } from './trigger.component';
 5: 
 6: export const routes: Routes = [
 7:   { path: '403', component: ExceptionComponent, data: { type: 403 } },
 8:   { path: '404', component: ExceptionComponent, data: { type: 404 } },
 9:   { path: '500', component: ExceptionComponent, data: { type: 500 } },
10:   { path: 'trigger', component: ExceptionTriggerComponent }
11: ];
````

## File: src/app/routes/exception/trigger.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { DA_SERVICE_TOKEN } from '@delon/auth';
 3: import { _HttpClient } from '@delon/theme';
 4: import { NzButtonModule } from 'ng-zorro-antd/button';
 5: import { NzCardModule } from 'ng-zorro-antd/card';
 6: 
 7: @Component({
 8:   selector: 'exception-trigger',
 9:   template: `
10:     <div class="pt-lg">
11:       <nz-card>
12:         @for (t of types; track $index) {
13:           <button (click)="go(t)" nz-button nzDanger>触发{{ t }}</button>
14:         }
15:         <button nz-button nzType="link" (click)="refresh()">触发刷新Token</button>
16:       </nz-card>
17:     </div>
18:   `,
19:   imports: [NzCardModule, NzButtonModule]
20: })
21: export class ExceptionTriggerComponent {
22:   private readonly http = inject(_HttpClient);
23:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
24: 
25:   types = [401, 403, 404, 500];
26: 
27:   go(type: number): void {
28:     this.http.get(`/api/${type}`).subscribe();
29:   }
30: 
31:   refresh(): void {
32:     this.tokenService.set({ token: 'invalid-token' });
33:     // 必须提供一个后端地址，无法通过 Mock 来模拟
34:     this.http.post(`https://localhost:5001/auth`).subscribe({
35:       next: res => console.warn('成功', res),
36:       error: err => {
37:         console.log('最后结果失败', err);
38:       }
39:     });
40:   }
41: }
````

## File: src/app/routes/extras/helpcenter/helpcenter.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzMessageService } from 'ng-zorro-antd/message';
 4: 
 5: @Component({
 6:   selector: 'app-helpcenter',
 7:   templateUrl: './helpcenter.component.html',
 8:   imports: SHARED_IMPORTS
 9: })
10: export class HelpCenterComponent {
11:   readonly msg = inject(NzMessageService);
12:   type = '';
13:   q = '';
14: 
15:   quick(key: string): void {
16:     this.q = key;
17:     this.search();
18:   }
19: 
20:   search(): void {
21:     this.msg.success(`搜索：${this.q}`);
22:   }
23: }
````

## File: src/app/routes/extras/poi/edit/edit.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { _HttpClient } from '@delon/theme';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: import { NzModalRef } from 'ng-zorro-antd/modal';
 6: 
 7: @Component({
 8:   selector: 'app-extras-poi-edit',
 9:   templateUrl: './edit.component.html',
10:   imports: SHARED_IMPORTS
11: })
12: export class ExtrasPoiEditComponent implements OnInit {
13:   readonly msgSrv = inject(NzMessageService);
14:   private readonly modal = inject(NzModalRef);
15:   readonly http = inject(_HttpClient);
16: 
17:   i: any;
18:   cat: string[] = ['美食', '美食,粤菜', '美食,粤菜,湛江菜'];
19: 
20:   ngOnInit(): void {
21:     if (this.i.id > 0) {
22:       this.http.get('/pois').subscribe(res => (this.i = res.list[0]));
23:     }
24:   }
25: 
26:   save(): void {
27:     this.http.get('/pois').subscribe(() => {
28:       this.msgSrv.success('保存成功，只是模拟，实际未变更');
29:       this.modal.destroy(true);
30:     });
31:   }
32: 
33:   close(): void {
34:     this.modal.destroy();
35:   }
36: }
````

## File: src/app/routes/extras/poi/poi.component.ts
````typescript
 1: import { Component, ViewChild, inject } from '@angular/core';
 2: import { STColumn, STComponent } from '@delon/abc/st';
 3: import { ModalHelper } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: import { ExtrasPoiEditComponent } from './edit/edit.component';
 8: 
 9: @Component({
10:   selector: 'app-extras-poi',
11:   templateUrl: './poi.component.html',
12:   imports: SHARED_IMPORTS
13: })
14: export class ExtrasPoiComponent {
15:   private readonly msg = inject(NzMessageService);
16:   private readonly modal = inject(ModalHelper);
17: 
18:   @ViewChild('st', { static: true })
19:   st!: STComponent;
20:   s = {
21:     pi: 1,
22:     ps: 10,
23:     user_id: '',
24:     s: '',
25:     q: ''
26:   };
27:   url = '/pois';
28:   columns: STColumn[] = [
29:     { title: '编号', index: 'id', width: '100px' },
30:     { title: '门店名称', index: 'name' },
31:     { title: '分店名', index: 'branch_name' },
32:     { title: '状态', index: 'status_str', width: '100px' },
33:     {
34:       title: '操作',
35:       width: '180px',
36:       buttons: [
37:         {
38:           text: '编辑',
39:           type: 'modal',
40:           modal: {
41:             component: ExtrasPoiEditComponent,
42:             paramsName: 'i'
43:           },
44:           click: () => this.msg.info('回调，重新发起列表刷新')
45:         },
46:         { text: '图片', click: () => this.msg.info('click photo') },
47:         { text: '经营SKU', click: () => this.msg.info('click sku') }
48:       ]
49:     }
50:   ];
51: 
52:   add(): void {
53:     this.modal.createStatic(ExtrasPoiEditComponent, { i: { id: 0 } }).subscribe(() => {
54:       this.st.load();
55:       this.msg.info('回调，重新发起列表刷新');
56:     });
57:   }
58: }
````

## File: src/app/routes/extras/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: import { HelpCenterComponent } from './helpcenter/helpcenter.component';
 4: import { ExtrasPoiComponent } from './poi/poi.component';
 5: import { ExtrasSettingsComponent } from './settings/settings.component';
 6: 
 7: export const routes: Routes = [
 8:   { path: 'helpcenter', component: HelpCenterComponent },
 9:   { path: 'settings', component: ExtrasSettingsComponent },
10:   { path: 'poi', component: ExtrasPoiComponent }
11: ];
````

## File: src/app/routes/extras/settings/settings.component.ts
````typescript
 1: import { Component, OnInit, inject } from '@angular/core';
 2: import { FormBuilder, Validators } from '@angular/forms';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: import { NzUploadComponent } from 'ng-zorro-antd/upload';
 6: 
 7: @Component({
 8:   selector: 'app-extras-settings',
 9:   templateUrl: './settings.component.html',
10:   imports: [...SHARED_IMPORTS, NzUploadComponent]
11: })
12: export class ExtrasSettingsComponent implements OnInit {
13:   readonly msg = inject(NzMessageService);
14: 
15:   active = 1;
16:   profileForm = inject(FormBuilder).nonNullable.group({
17:     name: ['', Validators.compose([Validators.required, Validators.pattern(`^[-_a-zA-Z0-9]{4,20}$`)])],
18:     email: '',
19:     bio: ['', Validators.maxLength(160)],
20:     url: '',
21:     company: '',
22:     location: ''
23:   });
24:   pwd = {
25:     old_password: '',
26:     new_password: '',
27:     confirm_new_password: ''
28:   };
29:   // Email
30:   primary_email = 'cipchk@qq.com';
31: 
32:   profileSave(value: any): void {
33:     console.log('profile value', value);
34:   }
35: 
36:   pwdSave(): void {
37:     if (!this.pwd.old_password) {
38:       this.msg.error('invalid old password');
39:       return;
40:     }
41:     if (!this.pwd.new_password) {
42:       this.msg.error('invalid new password');
43:       return;
44:     }
45:     if (!this.pwd.confirm_new_password) {
46:       this.msg.error('invalid confirm new password');
47:       return;
48:     }
49:     console.log('pwd value', this.pwd);
50:   }
51: 
52:   ngOnInit(): void {
53:     this.profileForm.patchValue({
54:       name: 'cipchk',
55:       email: 'cipchk@qq.com'
56:     });
57:   }
58: }
````

## File: src/app/routes/passport/callback.component.ts
````typescript
 1: import { Component, Input, OnInit, inject } from '@angular/core';
 2: import { SocialService } from '@delon/auth';
 3: import { SettingsService } from '@delon/theme';
 4: 
 5: @Component({
 6:   selector: 'app-callback',
 7:   template: ``,
 8:   providers: [SocialService],
 9:   standalone: true
10: })
11: export class CallbackComponent implements OnInit {
12:   private readonly socialService = inject(SocialService);
13:   private readonly settingsSrv = inject(SettingsService);
14:   @Input() type = '';
15: 
16:   ngOnInit(): void {
17:     this.mockModel();
18:   }
19: 
20:   private mockModel(): void {
21:     const info = {
22:       token: '123456789',
23:       name: 'cipchk',
24:       email: `${this.type}@${this.type}.com`,
25:       id: 10000,
26:       time: +new Date()
27:     };
28:     this.settingsSrv.setUser({
29:       ...this.settingsSrv.user,
30:       ...info
31:     });
32:     this.socialService.callback(info);
33:   }
34: }
````

## File: src/app/routes/passport/lock/lock.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 3: import { Router } from '@angular/router';
 4: import { DA_SERVICE_TOKEN } from '@delon/auth';
 5: import { I18nPipe, SettingsService, User } from '@delon/theme';
 6: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
 7: import { NzButtonModule } from 'ng-zorro-antd/button';
 8: import { NzFormModule } from 'ng-zorro-antd/form';
 9: import { NzGridModule } from 'ng-zorro-antd/grid';
10: import { NzInputModule } from 'ng-zorro-antd/input';
11: 
12: @Component({
13:   selector: 'passport-lock',
14:   templateUrl: './lock.component.html',
15:   styleUrls: ['./lock.component.less'],
16:   imports: [ReactiveFormsModule, I18nPipe, NzAvatarModule, NzFormModule, NzGridModule, NzButtonModule, NzInputModule]
17: })
18: export class UserLockComponent {
19:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
20:   private readonly settings = inject(SettingsService);
21:   private readonly router = inject(Router);
22: 
23:   f = new FormGroup({
24:     password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
25:   });
26: 
27:   get user(): User {
28:     return this.settings.user;
29:   }
30: 
31:   submit(): void {
32:     this.f.controls.password.markAsDirty();
33:     this.f.controls.password.updateValueAndValidity();
34:     if (this.f.valid) {
35:       console.log('Valid!');
36:       console.log(this.f.value);
37:       this.tokenService.set({
38:         token: '123'
39:       });
40:       this.router.navigate(['dashboard']);
41:     }
42:   }
43: }
````

## File: src/app/routes/passport/login/login.component.ts
````typescript
  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
  2: import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
  3: import { Router, RouterLink } from '@angular/router';
  4: import { StartupService, SupabaseAuthAdapterService } from '@core';
  5: import { ReuseTabService } from '@delon/abc/reuse-tab';
  6: import { DA_SERVICE_TOKEN } from '@delon/auth';
  7: import { I18nPipe } from '@delon/theme';
  8: import { NzAlertModule } from 'ng-zorro-antd/alert';
  9: import { NzButtonModule } from 'ng-zorro-antd/button';
 10: import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
 11: import { NzFormModule } from 'ng-zorro-antd/form';
 12: import { NzInputModule } from 'ng-zorro-antd/input';
 13: import { finalize } from 'rxjs';
 14: 
 15: @Component({
 16:   selector: 'passport-login',
 17:   templateUrl: './login.component.html',
 18:   styleUrls: ['./login.component.less'],
 19:   changeDetection: ChangeDetectionStrategy.OnPush,
 20:   imports: [
 21:     RouterLink,
 22:     ReactiveFormsModule,
 23:     I18nPipe,
 24:     NzCheckboxModule,
 25:     NzAlertModule,
 26:     NzFormModule,
 27:     NzInputModule,
 28:     NzButtonModule
 29:   ]
 30: })
 31: export class UserLoginComponent implements OnDestroy {
 32:   private readonly router = inject(Router);
 33:   private readonly reuseTabService = inject(ReuseTabService, { optional: true });
 34:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
 35:   private readonly startupSrv = inject(StartupService);
 36:   private readonly cdr = inject(ChangeDetectorRef);
 37:   private readonly supabaseAuthAdapter = inject(SupabaseAuthAdapterService);
 38: 
 39:   form = inject(FormBuilder).nonNullable.group({
 40:     userName: ['', [Validators.required, Validators.email]],
 41:     password: ['', [Validators.required, Validators.minLength(6)]],
 42:     remember: [true]
 43:   });
 44:   error = '';
 45:   loading = false;
 46: 
 47:   submit(): void {
 48:     this.error = '';
 49:     const { userName, password } = this.form.controls;
 50:     userName.markAsDirty();
 51:     userName.updateValueAndValidity();
 52:     password.markAsDirty();
 53:     password.updateValueAndValidity();
 54:     if (userName.invalid || password.invalid) {
 55:       return;
 56:     }
 57: 
 58:     // 使用 Supabase Auth 進行登入
 59:     // 適配器會自動將 Session 同步到 @delon/auth TokenService
 60:     const email = String(this.form.value.userName || '');
 61:     const pwd = String(this.form.value.password || '');
 62: 
 63:     if (!email || !pwd) {
 64:       this.error = '請輸入帳號和密碼';
 65:       this.cdr.detectChanges();
 66:       return;
 67:     }
 68: 
 69:     this.loading = true;
 70:     this.cdr.detectChanges();
 71: 
 72:     this.supabaseAuthAdapter
 73:       .signIn(email, pwd)
 74:       .pipe(
 75:         finalize(() => {
 76:           this.loading = false;
 77:           this.cdr.detectChanges();
 78:         })
 79:       )
 80:       .subscribe({
 81:         next: result => {
 82:           if (result.error) {
 83:             this.error = result.error.message || '登入失敗';
 84:             this.cdr.detectChanges();
 85:             return;
 86:           }
 87:           // 清空路由复用信息
 88:           this.reuseTabService?.clear();
 89:           // 適配器已自動同步 Session 到 TokenService
 90:           // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
 91:           this.startupSrv.load().subscribe(() => {
 92:             let url = this.tokenService.referrer!.url || '/';
 93:             if (url.includes('/passport')) {
 94:               url = '/';
 95:             }
 96:             this.router.navigateByUrl(url);
 97:           });
 98:         },
 99:         error: err => {
100:           this.error = err.message || '登入失敗，請稍後再試';
101:           this.cdr.detectChanges();
102:         }
103:       });
104:   }
105: 
106:   ngOnDestroy(): void {
107:     // 不再需要清理 interval
108:   }
109: }
````

## File: src/app/routes/passport/register-result/register-result.component.ts
````typescript
 1: import { Component, Input, inject } from '@angular/core';
 2: import { RouterLink } from '@angular/router';
 3: import { I18nPipe } from '@delon/theme';
 4: import { NzButtonModule } from 'ng-zorro-antd/button';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: import { NzResultModule } from 'ng-zorro-antd/result';
 7: 
 8: @Component({
 9:   selector: 'passport-register-result',
10:   templateUrl: './register-result.component.html',
11:   imports: [RouterLink, I18nPipe, NzButtonModule, NzResultModule]
12: })
13: export class UserRegisterResultComponent {
14:   readonly msg = inject(NzMessageService);
15:   @Input() email = '';
16: }
````

## File: src/app/routes/passport/register/register.component.ts
````typescript
  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
  2: import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
  3: import { Router, RouterLink } from '@angular/router';
  4: import { SupabaseAuthAdapterService } from '@core';
  5: import { I18nPipe } from '@delon/theme';
  6: import { MatchControl } from '@delon/util/form';
  7: import { NzAlertModule } from 'ng-zorro-antd/alert';
  8: import { NzButtonModule } from 'ng-zorro-antd/button';
  9: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 10: import { NzFormModule } from 'ng-zorro-antd/form';
 11: import { NzInputModule } from 'ng-zorro-antd/input';
 12: import { NzPopoverModule } from 'ng-zorro-antd/popover';
 13: import { NzProgressModule } from 'ng-zorro-antd/progress';
 14: import { finalize } from 'rxjs';
 15: 
 16: @Component({
 17:   selector: 'passport-register',
 18:   templateUrl: './register.component.html',
 19:   styleUrls: ['./register.component.less'],
 20:   changeDetection: ChangeDetectionStrategy.OnPush,
 21:   imports: [
 22:     ReactiveFormsModule,
 23:     I18nPipe,
 24:     RouterLink,
 25:     NzAlertModule,
 26:     NzFormModule,
 27:     NzInputModule,
 28:     NzPopoverModule,
 29:     NzProgressModule,
 30:     NzButtonModule
 31:   ]
 32: })
 33: export class UserRegisterComponent implements OnDestroy {
 34:   private readonly router = inject(Router);
 35:   private readonly cdr = inject(ChangeDetectorRef);
 36:   private readonly supabaseAuthAdapter = inject(SupabaseAuthAdapterService);
 37: 
 38:   // #region fields
 39: 
 40:   form = inject(FormBuilder).nonNullable.group(
 41:     {
 42:       mail: ['', [Validators.required, Validators.email]],
 43:       password: ['', [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
 44:       confirm: ['', [Validators.required, Validators.minLength(6)]]
 45:     },
 46:     {
 47:       validators: MatchControl('password', 'confirm')
 48:     }
 49:   );
 50:   error = '';
 51:   loading = false;
 52:   visible = false;
 53:   status = 'pool';
 54:   progress = 0;
 55:   passwordProgressMap: Record<string, 'success' | 'normal' | 'exception'> = {
 56:     ok: 'success',
 57:     pass: 'normal',
 58:     pool: 'exception'
 59:   };
 60: 
 61:   static checkPassword(control: FormControl): NzSafeAny {
 62:     if (!control) {
 63:       return null;
 64:     }
 65:     // eslint-disable-next-line @typescript-eslint/no-this-alias
 66:     const self: NzSafeAny = this;
 67:     self.visible = !!control.value;
 68:     if (control.value && control.value.length > 9) {
 69:       self.status = 'ok';
 70:     } else if (control.value && control.value.length > 5) {
 71:       self.status = 'pass';
 72:     } else {
 73:       self.status = 'pool';
 74:     }
 75: 
 76:     if (self.visible) {
 77:       self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
 78:     }
 79:   }
 80: 
 81:   submit(): void {
 82:     this.error = '';
 83:     Object.keys(this.form.controls).forEach(key => {
 84:       const control = (this.form.controls as NzSafeAny)[key] as AbstractControl;
 85:       control.markAsDirty();
 86:       control.updateValueAndValidity();
 87:     });
 88:     if (this.form.invalid) {
 89:       return;
 90:     }
 91: 
 92:     const email = String(this.form.value.mail || '');
 93:     const password = String(this.form.value.password || '');
 94: 
 95:     if (!email || !password) {
 96:       this.error = '請填寫完整的註冊資訊';
 97:       this.cdr.detectChanges();
 98:       return;
 99:     }
100: 
101:     this.loading = true;
102:     this.cdr.detectChanges();
103: 
104:     this.supabaseAuthAdapter
105:       .signUp(email, password)
106:       .pipe(
107:         finalize(() => {
108:           this.loading = false;
109:           this.cdr.detectChanges();
110:         })
111:       )
112:       .subscribe({
113:         next: result => {
114:           if (result.error) {
115:             this.error = result.error.message || '註冊失敗';
116:             this.cdr.detectChanges();
117:             return;
118:           }
119:           // 註冊成功，導航到註冊結果頁面
120:           // Supabase 註冊可能返回 session（email 驗證關閉）或 null（email 驗證開啟）
121:           this.router.navigate(['passport', 'register-result'], { queryParams: { email } });
122:         },
123:         error: err => {
124:           this.error = err.message || '註冊失敗，請稍後再試';
125:           this.cdr.detectChanges();
126:         }
127:       });
128:   }
129: 
130:   ngOnDestroy(): void {
131:     // 不再需要清理 interval
132:   }
133: }
````

## File: src/app/routes/passport/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: import { CallbackComponent } from './callback.component';
 4: import { UserLockComponent } from './lock/lock.component';
 5: import { UserLoginComponent } from './login/login.component';
 6: import { UserRegisterComponent } from './register/register.component';
 7: import { UserRegisterResultComponent } from './register-result/register-result.component';
 8: import { LayoutPassportComponent } from '../../layout';
 9: 
10: export const routes: Routes = [
11:   // passport
12:   {
13:     path: 'passport',
14:     component: LayoutPassportComponent,
15:     children: [
16:       {
17:         path: 'login',
18:         component: UserLoginComponent,
19:         data: { title: '登录', titleI18n: 'app.login.login' }
20:       },
21:       {
22:         path: 'register',
23:         component: UserRegisterComponent,
24:         data: { title: '注册', titleI18n: 'app.register.register' }
25:       },
26:       {
27:         path: 'register-result',
28:         component: UserRegisterResultComponent,
29:         data: { title: '注册结果', titleI18n: 'app.register.register' }
30:       },
31:       {
32:         path: 'lock',
33:         component: UserLockComponent,
34:         data: { title: '锁屏', titleI18n: 'app.lock' }
35:       }
36:     ]
37:   },
38:   // 单页不包裹Layout
39:   { path: 'passport/callback/:type', component: CallbackComponent }
40: ];
````

## File: src/app/routes/pro/account/center/applications/applications.component.ts
````typescript
 1: import { DecimalPipe } from '@angular/common';
 2: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 6: 
 7: @Component({
 8:   selector: 'app-account-center-applications',
 9:   templateUrl: './applications.component.html',
10:   styleUrls: ['./applications.component.less'],
11:   changeDetection: ChangeDetectionStrategy.OnPush,
12:   imports: [...SHARED_IMPORTS, DecimalPipe]
13: })
14: export class ProAccountCenterApplicationsComponent {
15:   private readonly http = inject(_HttpClient);
16:   private readonly cdr = inject(ChangeDetectorRef);
17: 
18:   listLoading = true;
19:   list: any[] = [];
20:   constructor() {
21:     this.http.get('/api/list', { count: 8 }).subscribe((res: NzSafeAny[]) => {
22:       this.list = res.map(item => {
23:         item.activeUser = this.formatWan(item.activeUser);
24:         return item;
25:       });
26:       this.listLoading = false;
27:       this.cdr.detectChanges();
28:     });
29:   }
30: 
31:   private formatWan(val: number): string {
32:     const v = val * 1;
33:     if (!v || isNaN(v)) {
34:       return '';
35:     }
36: 
37:     let result: string | number = val;
38:     if (val > 10000) {
39:       result = Math.floor(val / 10000);
40:       result = `${result}`;
41:     }
42:     return result.toString();
43:   }
44: }
````

## File: src/app/routes/pro/account/center/articles/articles.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { _HttpClient } from '@delon/theme';
 3: import { SHARED_IMPORTS } from '@shared';
 4: 
 5: @Component({
 6:   selector: 'app-account-center-articles',
 7:   templateUrl: './articles.component.html',
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   imports: SHARED_IMPORTS
10: })
11: export class ProAccountCenterArticlesComponent {
12:   list$ = inject(_HttpClient).get('/api/list', { count: 8 });
13: }
````

## File: src/app/routes/pro/account/center/center.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
 2: import { ActivationEnd, Router } from '@angular/router';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { Subscription, zip, filter } from 'rxjs';
 6: 
 7: @Component({
 8:   selector: 'app-account-center',
 9:   templateUrl: './center.component.html',
10:   styleUrls: ['./center.component.less'],
11:   changeDetection: ChangeDetectionStrategy.OnPush,
12:   imports: SHARED_IMPORTS
13: })
14: export class ProAccountCenterComponent implements OnInit, OnDestroy {
15:   private readonly router = inject(Router);
16:   private readonly http = inject(_HttpClient);
17:   private readonly cdr = inject(ChangeDetectorRef);
18: 
19:   private router$!: Subscription;
20:   @ViewChild('tagInput', { static: false }) private tagInput!: ElementRef<HTMLInputElement>;
21:   user: any;
22:   notice: any;
23:   tabs = [
24:     {
25:       key: 'articles',
26:       tab: '文章 (8)'
27:     },
28:     {
29:       key: 'applications',
30:       tab: '应用 (8)'
31:     },
32:     {
33:       key: 'projects',
34:       tab: '项目 (8)'
35:     }
36:   ];
37:   pos = 0;
38:   taging = false;
39:   tagValue = '';
40: 
41:   private setActive(): void {
42:     const key = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
43:     const idx = this.tabs.findIndex(w => w.key === key);
44:     if (idx !== -1) {
45:       this.pos = idx;
46:     }
47:   }
48: 
49:   ngOnInit(): void {
50:     zip(this.http.get('/user/current'), this.http.get('/api/notice')).subscribe(([user, notice]) => {
51:       this.user = user;
52:       this.notice = notice;
53:       this.cdr.detectChanges();
54:     });
55:     this.router$ = this.router.events.pipe(filter(e => e instanceof ActivationEnd)).subscribe(() => this.setActive());
56:     this.setActive();
57:   }
58: 
59:   to(item: { key: string }): void {
60:     this.router.navigateByUrl(`/pro/account/center/${item.key}`);
61:   }
62:   tagShowIpt(): void {
63:     this.taging = true;
64:     this.cdr.detectChanges();
65:     this.tagInput.nativeElement.focus();
66:   }
67: 
68:   tagBlur(): void {
69:     const { user, cdr, tagValue } = this;
70:     if (tagValue && user.tags.filter((tag: { label: string }) => tag.label === tagValue).length === 0) {
71:       user.tags.push({ label: tagValue });
72:     }
73:     this.tagValue = '';
74:     this.taging = false;
75:     cdr.detectChanges();
76:   }
77: 
78:   tagEnter(e: KeyboardEvent): void {
79:     if (e.key === 'Enter') {
80:       this.tagBlur();
81:     }
82:   }
83: 
84:   ngOnDestroy(): void {
85:     this.router$.unsubscribe();
86:   }
87: }
````

## File: src/app/routes/pro/account/center/projects/projects.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
 2: import { _HttpClient } from '@delon/theme';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: @Component({
 8:   selector: 'app-account-center-projects',
 9:   templateUrl: './projects.component.html',
10:   styleUrls: ['./projects.component.less'],
11:   changeDetection: ChangeDetectionStrategy.OnPush,
12:   imports: [...SHARED_IMPORTS, NzAvatarModule]
13: })
14: export class ProAccountCenterProjectsComponent {
15:   private readonly http = inject(_HttpClient);
16:   private readonly msg = inject(NzMessageService);
17:   private readonly cdr = inject(ChangeDetectorRef);
18: 
19:   listLoading = true;
20:   list: any[] = [];
21: 
22:   constructor() {
23:     this.http.get('/api/list', { count: 8 }).subscribe(res => {
24:       this.list = res;
25:       this.listLoading = false;
26:       this.cdr.detectChanges();
27:     });
28:   }
29: 
30:   suc(id: number): void {
31:     this.msg.success(`标题：${id}`);
32:   }
33: }
````

## File: src/app/routes/pro/account/settings/base/base.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { _HttpClient } from '@delon/theme';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: import { NzUploadComponent } from 'ng-zorro-antd/upload';
 6: import { zip } from 'rxjs';
 7: 
 8: interface ProAccountSettingsUser {
 9:   email: string;
10:   name: string;
11:   profile: string;
12:   country: string;
13:   address: string;
14:   phone: string;
15:   avatar: string;
16:   geographic: {
17:     province: {
18:       key: string;
19:     };
20:     city: {
21:       key: string;
22:     };
23:   };
24: }
25: 
26: interface ProAccountSettingsCity {
27:   name: string;
28:   id: string;
29: }
30: 
31: @Component({
32:   selector: 'app-account-settings-base',
33:   templateUrl: './base.component.html',
34:   styleUrls: ['./base.component.less'],
35:   changeDetection: ChangeDetectionStrategy.OnPush,
36:   imports: [...SHARED_IMPORTS, NzUploadComponent]
37: })
38: export class ProAccountSettingsBaseComponent implements OnInit {
39:   private readonly http = inject(_HttpClient);
40:   private readonly cdr = inject(ChangeDetectorRef);
41:   private readonly msg = inject(NzMessageService);
42: 
43:   avatar = '';
44:   userLoading = true;
45:   user!: ProAccountSettingsUser;
46: 
47:   // #region geo
48: 
49:   provinces: ProAccountSettingsCity[] = [];
50:   cities: ProAccountSettingsCity[] = [];
51: 
52:   ngOnInit(): void {
53:     zip(this.http.get('/user/current'), this.http.get('/geo/province')).subscribe(
54:       ([user, province]: [ProAccountSettingsUser, ProAccountSettingsCity[]]) => {
55:         this.userLoading = false;
56:         this.user = user;
57:         this.provinces = province;
58:         this.choProvince(user.geographic.province.key, false);
59:         this.cdr.detectChanges();
60:       }
61:     );
62:   }
63: 
64:   choProvince(pid: string, cleanCity = true): void {
65:     this.http.get(`/geo/${pid}`).subscribe(res => {
66:       this.cities = res;
67:       if (cleanCity) {
68:         this.user.geographic.city.key = '';
69:       }
70:       this.cdr.detectChanges();
71:     });
72:   }
73: 
74:   // #endregion
75: 
76:   save(): boolean {
77:     this.msg.success(JSON.stringify(this.user));
78:     return false;
79:   }
80: }
````

## File: src/app/routes/pro/account/settings/binding/binding.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzMessageService } from 'ng-zorro-antd/message';
 4: 
 5: @Component({
 6:   selector: 'app-account-settings-binding',
 7:   templateUrl: './binding.component.html',
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   imports: SHARED_IMPORTS
10: })
11: export class ProAccountSettingsBindingComponent {
12:   readonly msg = inject(NzMessageService);
13: }
````

## File: src/app/routes/pro/account/settings/notification/notification.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-account-settings-notification',
 6:   templateUrl: './notification.component.html',
 7:   changeDetection: ChangeDetectionStrategy.OnPush,
 8:   imports: SHARED_IMPORTS
 9: })
10: export class ProAccountSettingsNotificationComponent {
11:   i: {
12:     password: boolean;
13:     messages: boolean;
14:     todo: boolean;
15:   } = {
16:     password: true,
17:     messages: true,
18:     todo: true
19:   };
20: }
````

## File: src/app/routes/pro/account/settings/security/security.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzMessageService } from 'ng-zorro-antd/message';
 4: 
 5: @Component({
 6:   selector: 'app-account-settings-security',
 7:   templateUrl: './security.component.html',
 8:   changeDetection: ChangeDetectionStrategy.OnPush,
 9:   imports: SHARED_IMPORTS
10: })
11: export class ProAccountSettingsSecurityComponent {
12:   readonly msg = inject(NzMessageService);
13: }
````

## File: src/app/routes/pro/account/settings/settings.component.ts
````typescript
 1: import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, inject } from '@angular/core';
 2: import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
 3: import { ActivationEnd, Router } from '@angular/router';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzMenuModeType } from 'ng-zorro-antd/menu';
 6: import { fromEvent, debounceTime, filter } from 'rxjs';
 7: 
 8: @Component({
 9:   selector: 'app-account-settings',
10:   templateUrl: './settings.component.html',
11:   styleUrls: ['./settings.component.less'],
12:   changeDetection: ChangeDetectionStrategy.OnPush,
13:   imports: SHARED_IMPORTS
14: })
15: export class ProAccountSettingsComponent implements AfterViewInit {
16:   private readonly router = inject(Router);
17:   private readonly cdr = inject(ChangeDetectorRef);
18:   private readonly el: HTMLElement = inject(ElementRef).nativeElement;
19:   private readonly d$ = inject(DestroyRef);
20:   mode: NzMenuModeType = 'inline';
21:   title!: string;
22:   menus: Array<{ key: string; title: string; selected?: boolean }> = [
23:     {
24:       key: 'base',
25:       title: '基本设置'
26:     },
27:     {
28:       key: 'security',
29:       title: '安全设置'
30:     },
31:     {
32:       key: 'binding',
33:       title: '账号绑定'
34:     },
35:     {
36:       key: 'notification',
37:       title: '新消息通知'
38:     }
39:   ];
40: 
41:   private setActive(): void {
42:     const key = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
43:     this.menus.forEach(i => {
44:       i.selected = i.key === key;
45:     });
46:     this.title = this.menus.find(w => w.selected)!.title;
47:     this.cdr.detectChanges();
48:   }
49: 
50:   to(item: { key: string }): void {
51:     this.router.navigateByUrl(`/pro/account/settings/${item.key}`);
52:   }
53: 
54:   private resize(): void {
55:     const el = this.el;
56:     let mode: NzMenuModeType = 'inline';
57:     const { offsetWidth } = el;
58:     if (offsetWidth < 641 && offsetWidth > 400) {
59:       mode = 'horizontal';
60:     }
61:     if (window.innerWidth < 768 && offsetWidth > 400) {
62:       mode = 'horizontal';
63:     }
64:     this.mode = mode;
65:     this.cdr.detectChanges();
66:   }
67: 
68:   ngAfterViewInit(): void {
69:     this.router.events
70:       .pipe(
71:         takeUntilDestroyed(this.d$),
72:         filter(e => e instanceof ActivationEnd)
73:       )
74:       .subscribe(() => this.setActive());
75: 
76:     fromEvent(window, 'resize')
77:       .pipe(takeUntilDestroyed(this.d$), debounceTime(200))
78:       .subscribe(() => this.resize());
79: 
80:     this.setActive();
81:   }
82: }
````

## File: src/app/routes/pro/form/advanced-form/advanced-form.component.ts
````typescript
  1: import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
  2: import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
  3: import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
  6: 
  7: interface UserForm {
  8:   key: FormControl<string>;
  9:   workId: FormControl<string>;
 10:   name: FormControl<string>;
 11:   department: FormControl<string>;
 12: }
 13: 
 14: @Component({
 15:   selector: 'app-advanced-form',
 16:   templateUrl: './advanced-form.component.html',
 17:   changeDetection: ChangeDetectionStrategy.OnPush,
 18:   imports: [...SHARED_IMPORTS, FooterToolbarModule]
 19: })
 20: export class AdvancedFormComponent implements OnInit {
 21:   editIndex = -1;
 22:   editObj = {};
 23:   form = new FormGroup({
 24:     name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
 25:     url: new FormControl('', { validators: [Validators.required] }),
 26:     owner: new FormControl(undefined, { validators: [Validators.required] }),
 27:     approver: new FormControl('', { validators: [Validators.required] }),
 28:     date_range: new FormControl('', { validators: [Validators.required] }),
 29:     type: new FormControl('', { validators: [Validators.required] }),
 30:     name2: new FormControl('', { validators: [Validators.required] }),
 31:     summary: new FormControl('', { validators: [Validators.required] }),
 32:     owner2: new FormControl('', { validators: [Validators.required] }),
 33:     approver2: new FormControl('', { validators: [Validators.required] }),
 34:     time: new FormControl('', { validators: [Validators.required] }),
 35:     type2: new FormControl('', { validators: [Validators.required] }),
 36:     items: new FormArray<FormGroup<UserForm>>([])
 37:   });
 38:   users: Array<{ value: string; label: string }> = [
 39:     { value: 'xiao', label: '付晓晓' },
 40:     { value: 'mao', label: '周毛毛' }
 41:   ];
 42: 
 43:   ngOnInit(): void {
 44:     const userList = [
 45:       {
 46:         key: '1',
 47:         workId: '00001',
 48:         name: 'John Brown',
 49:         department: 'New York No. 1 Lake Park'
 50:       },
 51:       {
 52:         key: '2',
 53:         workId: '00002',
 54:         name: 'Jim Green',
 55:         department: 'London No. 1 Lake Park'
 56:       },
 57:       {
 58:         key: '3',
 59:         workId: '00003',
 60:         name: 'Joe Black',
 61:         department: 'Sidney No. 1 Lake Park'
 62:       }
 63:     ];
 64:     userList.forEach(i => {
 65:       const field = this.createUser();
 66:       field.patchValue(i);
 67:       this.items.push(field);
 68:     });
 69:   }
 70: 
 71:   createUser(): FormGroup<UserForm> {
 72:     return new FormGroup({
 73:       key: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
 74:       name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
 75:       workId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
 76:       department: new FormControl('', { nonNullable: true, validators: [Validators.required] })
 77:     });
 78:   }
 79: 
 80:   get items(): FormArray<FormGroup<UserForm>> {
 81:     return this.form.controls.items;
 82:   }
 83: 
 84:   add(): void {
 85:     this.items.push(this.createUser());
 86:     this.edit(this.items.length - 1);
 87:   }
 88: 
 89:   del(index: number): void {
 90:     this.items.removeAt(index);
 91:   }
 92: 
 93:   edit(index: number): void {
 94:     if (this.editIndex !== -1 && this.editObj) {
 95:       this.items.at(this.editIndex).patchValue(this.editObj);
 96:     }
 97:     this.editObj = { ...this.items.at(index).value };
 98:     this.editIndex = index;
 99:   }
100: 
101:   save(index: number): void {
102:     const item = this.items.at(index);
103:     this.formValidity(item.controls);
104:     if (item.invalid) {
105:       return;
106:     }
107:     this.editIndex = -1;
108:   }
109: 
110:   cancel(index: number): void {
111:     const item = this.items.at(index);
112:     if (!item.value.key) {
113:       this.del(index);
114:     } else {
115:       item.patchValue(this.editObj);
116:     }
117:     this.editIndex = -1;
118:   }
119: 
120:   _submitForm(): void {
121:     this.formValidity(this.form.controls);
122:     if (this.form.invalid) {
123:       return;
124:     }
125:   }
126: 
127:   private formValidity(controls: NzSafeAny): void {
128:     Object.keys(controls).forEach(key => {
129:       const control = (controls as NzSafeAny)[key] as AbstractControl;
130:       control.markAsDirty();
131:       control.updateValueAndValidity();
132:     });
133:   }
134: }
````

## File: src/app/routes/pro/form/basic-form/basic-form.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
 2: import { FormControl, FormGroup, Validators } from '@angular/forms';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: @Component({
 7:   selector: 'app-basic-form',
 8:   templateUrl: './basic-form.component.html',
 9:   changeDetection: ChangeDetectionStrategy.OnPush,
10:   imports: SHARED_IMPORTS
11: })
12: export class BasicFormComponent {
13:   private readonly msg = inject(NzMessageService);
14:   private readonly cdr = inject(ChangeDetectorRef);
15: 
16:   form = new FormGroup({
17:     title: new FormControl('', Validators.required),
18:     date: new FormControl('', Validators.required),
19:     goal: new FormControl('', Validators.required),
20:     standard: new FormControl('', Validators.required),
21:     client: new FormControl(''),
22:     invites: new FormControl(''),
23:     weight: new FormControl(''),
24:     public: new FormControl(1, [Validators.min(1), Validators.max(3)]),
25:     publicUsers: new FormControl('')
26:   });
27:   submitting = false;
28: 
29:   submit(): void {
30:     this.submitting = true;
31:     setTimeout(() => {
32:       this.submitting = false;
33:       this.msg.success(`提交成功`);
34:       this.cdr.detectChanges();
35:     }, 1000);
36:   }
37: }
````

## File: src/app/routes/pro/form/step-form/step-form.component.ts
````typescript
 1: import { AfterViewInit, Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzStepsModule } from 'ng-zorro-antd/steps';
 4: 
 5: import { Step1Component } from './step1.component';
 6: import { Step2Component } from './step2.component';
 7: import { Step3Component } from './step3.component';
 8: import { TransferService } from './transfer.service';
 9: 
10: @Component({
11:   selector: 'app-step-form',
12:   templateUrl: './step-form.component.html',
13:   styleUrls: ['./step-form.component.less'],
14:   providers: [TransferService],
15:   imports: [...SHARED_IMPORTS, NzStepsModule, Step1Component, Step2Component, Step3Component]
16: })
17: export class StepFormComponent implements AfterViewInit {
18:   private readonly srv = inject(TransferService);
19:   get item(): TransferService {
20:     return this.srv;
21:   }
22: 
23:   ngAfterViewInit(): void {
24:     console.log('item', this.item);
25:   }
26: }
````

## File: src/app/routes/pro/form/step-form/step1.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
 2: import { FormControl, FormGroup, Validators } from '@angular/forms';
 3: import { SHARED_IMPORTS } from '@shared';
 4: 
 5: import { TransferService } from './transfer.service';
 6: 
 7: @Component({
 8:   selector: 'app-step1',
 9:   templateUrl: './step1.component.html',
10:   changeDetection: ChangeDetectionStrategy.OnPush,
11:   imports: SHARED_IMPORTS
12: })
13: export class Step1Component implements OnInit {
14:   private readonly srv = inject(TransferService);
15: 
16:   form = new FormGroup({
17:     pay_account: new FormControl('', Validators.compose([Validators.required, Validators.email])),
18:     receiver_type: new FormControl('', Validators.required),
19:     receiver_account: new FormControl('', Validators.required),
20:     receiver_name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
21:     amount: new FormControl(
22:       '',
23:       Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(1), Validators.max(10000 * 100)])
24:     )
25:   });
26: 
27:   get item(): TransferService {
28:     return this.srv;
29:   }
30: 
31:   ngOnInit(): void {
32:     this.form.patchValue(this.item as any);
33:   }
34: 
35:   _submitForm(): void {
36:     Object.assign(this.item, this.form.value);
37:     ++this.item.step;
38:   }
39: }
````

## File: src/app/routes/pro/form/step-form/step2.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
 2: import { FormControl, FormGroup, Validators } from '@angular/forms';
 3: import { SHARED_IMPORTS } from '@shared';
 4: 
 5: import { TransferService } from './transfer.service';
 6: 
 7: @Component({
 8:   selector: 'app-step2',
 9:   templateUrl: './step2.component.html',
10:   changeDetection: ChangeDetectionStrategy.OnPush,
11:   imports: SHARED_IMPORTS
12: })
13: export class Step2Component implements OnInit {
14:   private readonly srv = inject(TransferService);
15: 
16:   form = new FormGroup({
17:     password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
18:   });
19:   loading = false;
20:   get item(): TransferService {
21:     return this.srv;
22:   }
23: 
24:   ngOnInit(): void {
25:     this.form.patchValue(this.item);
26:   }
27: 
28:   _submitForm(): void {
29:     this.loading = true;
30:     setTimeout(() => {
31:       this.loading = false;
32:       ++this.item.step;
33:     }, 500);
34:   }
35: 
36:   prev(): void {
37:     --this.item.step;
38:   }
39: }
````

## File: src/app/routes/pro/form/step-form/step3.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzResultModule } from 'ng-zorro-antd/result';
 4: 
 5: import { TransferService } from './transfer.service';
 6: 
 7: @Component({
 8:   selector: 'app-step3',
 9:   templateUrl: './step3.component.html',
10:   changeDetection: ChangeDetectionStrategy.OnPush,
11:   imports: [...SHARED_IMPORTS, NzResultModule]
12: })
13: export class Step3Component {
14:   private readonly srv = inject(TransferService);
15: 
16:   get item(): TransferService {
17:     return this.srv;
18:   }
19: }
````

## File: src/app/routes/pro/form/step-form/transfer.service.ts
````typescript
 1: import { Injectable } from '@angular/core';
 2: 
 3: @Injectable()
 4: export class TransferService {
 5:   step = 1;
 6: 
 7:   /**
 8:    * 付款账户
 9:    */
10:   pay_account = '';
11: 
12:   /**
13:    * 收款账户类型
14:    */
15:   receiver_type: 'alipay' | 'bank' = 'alipay';
16: 
17:   get receiver_type_str(): string {
18:     return this.receiver_type === 'alipay' ? '支付宝' : '银行';
19:   }
20: 
21:   /**
22:    * 收款账户
23:    */
24:   receiver_account = '';
25: 
26:   /**
27:    * 收款姓名
28:    */
29:   receiver_name = '';
30: 
31:   /**
32:    * 金额
33:    */
34:   amount = 500;
35: 
36:   /**
37:    * 支付密码
38:    */
39:   password = '123456';
40: 
41:   again(): void {
42:     this.step = 0;
43:     this.pay_account = 'ant-design@alipay.com';
44:     this.receiver_type = 'alipay';
45:     this.receiver_account = 'test@example.com';
46:     this.receiver_name = 'asdf';
47:     this.amount = 500;
48:   }
49: 
50:   constructor() {
51:     this.again();
52:   }
53: }
````

## File: src/app/routes/pro/list/applications/applications.component.ts
````typescript
 1: import { DecimalPipe } from '@angular/common';
 2: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 3: import { TagSelectComponent } from '@delon/abc/tag-select';
 4: import { _HttpClient } from '@delon/theme';
 5: import { SHARED_IMPORTS } from '@shared';
 6: 
 7: interface ProListApplicationListItem {
 8:   title: string;
 9:   avatar: string;
10:   activeUser: string | number;
11:   newUser: number;
12: }
13: 
14: @Component({
15:   selector: 'app-list-applications',
16:   templateUrl: './applications.component.html',
17:   styleUrls: ['./applications.component.less'],
18:   changeDetection: ChangeDetectionStrategy.OnPush,
19:   imports: [...SHARED_IMPORTS, TagSelectComponent, DecimalPipe]
20: })
21: export class ProListApplicationsComponent implements OnInit {
22:   private readonly http = inject(_HttpClient);
23:   private readonly cdr = inject(ChangeDetectorRef);
24: 
25:   q = {
26:     ps: 8,
27:     user: null,
28:     rate: null,
29:     categories: [],
30:     owners: ['zxx']
31:   };
32: 
33:   list: ProListApplicationListItem[] = [];
34: 
35:   loading = true;
36: 
37:   // region: cateogry
38:   categories = [
39:     { id: 0, text: '全部', value: false },
40:     { id: 1, text: '类目一', value: false },
41:     { id: 2, text: '类目二', value: false },
42:     { id: 3, text: '类目三', value: false },
43:     { id: 4, text: '类目四', value: false },
44:     { id: 5, text: '类目五', value: false },
45:     { id: 6, text: '类目六', value: false },
46:     { id: 7, text: '类目七', value: false },
47:     { id: 8, text: '类目八', value: false },
48:     { id: 9, text: '类目九', value: false },
49:     { id: 10, text: '类目十', value: false },
50:     { id: 11, text: '类目十一', value: false },
51:     { id: 12, text: '类目十二', value: false }
52:   ];
53: 
54:   changeCategory(status: boolean, idx: number): void {
55:     if (idx === 0) {
56:       this.categories.map(i => (i.value = status));
57:     } else {
58:       this.categories[idx].value = status;
59:     }
60:     this.getData();
61:   }
62:   // endregion
63: 
64:   ngOnInit(): void {
65:     this.getData();
66:   }
67: 
68:   getData(): void {
69:     this.loading = true;
70:     this.http.get('/api/list', { count: this.q.ps }).subscribe(res => {
71:       this.list = res.map((item: ProListApplicationListItem) => {
72:         item.activeUser = this.formatWan(item.activeUser as number);
73:         return item;
74:       });
75:       this.loading = false;
76:       this.cdr.detectChanges();
77:     });
78:   }
79: 
80:   private formatWan(val: number): string | number {
81:     const v = val * 1;
82:     if (!v || isNaN(v)) {
83:       return '';
84:     }
85: 
86:     let result: number | string = val;
87:     if (val > 10000) {
88:       result = Math.floor(val / 10000);
89:       result = `${result}`;
90:     }
91:     return result;
92:   }
93: }
````

## File: src/app/routes/pro/list/articles/articles.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { TagSelectComponent } from '@delon/abc/tag-select';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: 
 6: @Component({
 7:   selector: 'app-list-articles',
 8:   templateUrl: './articles.component.html',
 9:   changeDetection: ChangeDetectionStrategy.OnPush,
10:   imports: [...SHARED_IMPORTS, TagSelectComponent]
11: })
12: export class ProListArticlesComponent implements OnInit {
13:   private readonly http = inject(_HttpClient);
14:   private readonly cdr = inject(ChangeDetectorRef);
15: 
16:   q = {
17:     ps: 5,
18:     categories: [],
19:     owners: ['zxx'],
20:     user: '',
21:     rate: ''
22:   };
23: 
24:   list: any[] = [];
25:   loading = false;
26: 
27:   categories = [
28:     { id: 0, text: '全部', value: false },
29:     { id: 1, text: '类目一', value: false },
30:     { id: 2, text: '类目二', value: false },
31:     { id: 3, text: '类目三', value: false },
32:     { id: 4, text: '类目四', value: false },
33:     { id: 5, text: '类目五', value: false },
34:     { id: 6, text: '类目六', value: false },
35:     { id: 7, text: '类目七', value: false },
36:     { id: 8, text: '类目八', value: false },
37:     { id: 9, text: '类目九', value: false },
38:     { id: 10, text: '类目十', value: false },
39:     { id: 11, text: '类目十一', value: false },
40:     { id: 12, text: '类目十二', value: false }
41:   ];
42: 
43:   owners = [
44:     {
45:       id: 'wzj',
46:       name: '我自己'
47:     },
48:     {
49:       id: 'wjh',
50:       name: '吴家豪'
51:     },
52:     {
53:       id: 'zxx',
54:       name: '周星星'
55:     },
56:     {
57:       id: 'zly',
58:       name: '赵丽颖'
59:     },
60:     {
61:       id: 'ym',
62:       name: '姚明'
63:     }
64:   ];
65: 
66:   changeCategory(status: boolean, idx: number): void {
67:     if (idx === 0) {
68:       this.categories.map(i => (i.value = status));
69:     } else {
70:       this.categories[idx].value = status;
71:     }
72:   }
73: 
74:   setOwner(): void {
75:     this.q.owners = [`wzj`];
76:     // TODO: wait nz-dropdown OnPush mode
77:     setTimeout(() => this.cdr.detectChanges());
78:   }
79: 
80:   ngOnInit(): void {
81:     this.getData();
82:   }
83: 
84:   getData(more = false): void {
85:     this.loading = true;
86:     this.http.get('/api/list', { count: this.q.ps }).subscribe(res => {
87:       this.list = more ? this.list.concat(res) : res;
88:       this.loading = false;
89:       this.cdr.detectChanges();
90:     });
91:   }
92: }
````

## File: src/app/routes/pro/list/basic-list/basic-list.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { ModalHelper, _HttpClient } from '@delon/theme';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
 6: 
 7: import { ProBasicListEditComponent } from './edit/edit.component';
 8: 
 9: @Component({
10:   selector: 'app-basic-list',
11:   templateUrl: './basic-list.component.html',
12:   styleUrls: ['./basic-list.component.less'],
13:   changeDetection: ChangeDetectionStrategy.OnPush,
14:   imports: [...SHARED_IMPORTS, NzPaginationComponent]
15: })
16: export class ProBasicListComponent implements OnInit {
17:   private readonly http = inject(_HttpClient);
18:   private readonly msg = inject(NzMessageService);
19:   private readonly modal = inject(ModalHelper);
20:   private readonly cdr = inject(ChangeDetectorRef);
21: 
22:   q = {
23:     q: '',
24:     status: 'all'
25:   };
26:   loading = false;
27:   data: Array<{
28:     id: number;
29:     title: string;
30:     subDescription: string;
31:     href: string;
32:     logo: string;
33:     owner: string;
34:     createdAt: Date;
35:     percent: number;
36:     status: string;
37:   }> = [];
38: 
39:   ngOnInit(): void {
40:     this.getData();
41:   }
42: 
43:   getData(): void {
44:     this.loading = true;
45:     this.http.get('/api/list', { count: 5 }).subscribe(res => {
46:       this.data = res;
47:       this.loading = false;
48:       this.cdr.detectChanges();
49:     });
50:   }
51: 
52:   openEdit(record: { id?: number } = {}): void {
53:     this.modal.create(ProBasicListEditComponent, { record }, { size: 'md' }).subscribe(res => {
54:       if (record.id) {
55:         record = { ...record, id: 'mock_id', percent: 0, ...res };
56:       } else {
57:         this.data.splice(0, 0, res);
58:         this.data = [...this.data];
59:       }
60:       this.cdr.detectChanges();
61:     });
62:   }
63: 
64:   remove(title: string): void {
65:     this.msg.success(`删除：${title}`);
66:   }
67: }
````

## File: src/app/routes/pro/list/basic-list/edit/edit.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { SFSchema } from '@delon/form';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: import { NzModalRef } from 'ng-zorro-antd/modal';
 6: 
 7: @Component({
 8:   selector: 'app-basic-list-edit',
 9:   templateUrl: './edit.component.html',
10:   imports: SHARED_IMPORTS
11: })
12: export class ProBasicListEditComponent {
13:   private readonly modal = inject(NzModalRef);
14:   private readonly msgSrv = inject(NzMessageService);
15: 
16:   record: any = {};
17:   schema: SFSchema = {
18:     properties: {
19:       title: { type: 'string', title: '任务名称', maxLength: 50 },
20:       createdAt: { type: 'string', title: '开始时间', format: 'date' },
21:       owner: {
22:         type: 'string',
23:         title: '任务负责人',
24:         enum: [
25:           { value: 'asdf', label: 'asdf' },
26:           { value: '卡色', label: '卡色' },
27:           { value: 'cipchk', label: 'cipchk' }
28:         ]
29:       },
30:       subDescription: {
31:         type: 'string',
32:         title: '产品描述',
33:         ui: {
34:           widget: 'textarea',
35:           autosize: { minRows: 2, maxRows: 6 }
36:         }
37:       }
38:     },
39:     required: ['title', 'createdAt', 'owner'],
40:     ui: {
41:       spanLabelFixed: 150,
42:       grid: { span: 24 }
43:     }
44:   };
45: 
46:   save(value: any): void {
47:     this.msgSrv.success('保存成功');
48:     this.modal.close(value);
49:   }
50: 
51:   close(): void {
52:     this.modal.destroy();
53:   }
54: }
````

## File: src/app/routes/pro/list/card-list/card-list.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
 2: import { EllipsisComponent } from '@delon/abc/ellipsis';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: @Component({
 8:   selector: 'app-list-card-list',
 9:   templateUrl: './card-list.component.html',
10:   styles: [
11:     `
12:       :host ::ng-deep .ant-card-meta-title {
13:         margin-bottom: 12px;
14:       }
15:     `
16:   ],
17:   encapsulation: ViewEncapsulation.Emulated,
18:   changeDetection: ChangeDetectionStrategy.OnPush,
19:   imports: [...SHARED_IMPORTS, EllipsisComponent]
20: })
21: export class ProCardListComponent implements OnInit {
22:   private readonly http = inject(_HttpClient);
23:   private readonly msg = inject(NzMessageService);
24:   private readonly cdr = inject(ChangeDetectorRef);
25: 
26:   list: Array<{ id: number; title: string; avatar: string; description: string } | null> = [null];
27: 
28:   loading = true;
29: 
30:   ngOnInit(): void {
31:     this.loading = true;
32:     this.http.get('/api/list', { count: 8 }).subscribe(res => {
33:       this.list = this.list.concat(res);
34:       this.loading = false;
35:       this.cdr.detectChanges();
36:     });
37:   }
38: 
39:   show(text: string): void {
40:     this.msg.success(text);
41:   }
42: }
````

## File: src/app/routes/pro/list/list/list.component.ts
````typescript
 1: import { Component, DestroyRef, OnInit, inject } from '@angular/core';
 2: import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
 3: import { ActivationEnd, Router } from '@angular/router';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { filter } from 'rxjs';
 6: 
 7: @Component({
 8:   selector: 'app-list-layout',
 9:   templateUrl: './list.component.html',
10:   imports: SHARED_IMPORTS
11: })
12: export class ProListLayoutComponent implements OnInit {
13:   private readonly router = inject(Router);
14:   private readonly d$ = inject(DestroyRef);
15: 
16:   tabs = [
17:     {
18:       key: 'articles',
19:       tab: '文章'
20:     },
21:     {
22:       key: 'applications',
23:       tab: '应用'
24:     },
25:     {
26:       key: 'projects',
27:       tab: '项目'
28:     }
29:   ];
30: 
31:   pos = 0;
32: 
33:   private setActive(): void {
34:     const key = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
35:     const idx = this.tabs.findIndex(w => w.key === key);
36:     if (idx !== -1) {
37:       this.pos = idx;
38:     }
39:   }
40: 
41:   ngOnInit(): void {
42:     this.router.events
43:       .pipe(
44:         takeUntilDestroyed(this.d$),
45:         filter(e => e instanceof ActivationEnd)
46:       )
47:       .subscribe(() => this.setActive());
48:     this.setActive();
49:   }
50: 
51:   to(item: { key: string }): void {
52:     this.router.navigateByUrl(`/pro/list/${item.key}`);
53:   }
54: }
````

## File: src/app/routes/pro/list/projects/projects.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { TagSelectComponent } from '@delon/abc/tag-select';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: 
 7: @Component({
 8:   selector: 'app-list-projects',
 9:   templateUrl: './projects.component.html',
10:   styleUrls: ['./projects.component.less'],
11:   changeDetection: ChangeDetectionStrategy.OnPush,
12:   imports: [...SHARED_IMPORTS, TagSelectComponent]
13: })
14: export class ProListProjectsComponent implements OnInit {
15:   private readonly http = inject(_HttpClient);
16:   readonly msg = inject(NzMessageService);
17:   private readonly cdr = inject(ChangeDetectorRef);
18: 
19:   q = {
20:     ps: 8,
21:     categories: [],
22:     owners: ['zxx'],
23:     user: null,
24:     rate: null
25:   };
26:   list: any[] = [];
27:   loading = true;
28: 
29:   categories = [
30:     { id: 0, text: '全部', value: false },
31:     { id: 1, text: '类目一', value: false },
32:     { id: 2, text: '类目二', value: false },
33:     { id: 3, text: '类目三', value: false },
34:     { id: 4, text: '类目四', value: false },
35:     { id: 5, text: '类目五', value: false },
36:     { id: 6, text: '类目六', value: false },
37:     { id: 7, text: '类目七', value: false },
38:     { id: 8, text: '类目八', value: false },
39:     { id: 9, text: '类目九', value: false },
40:     { id: 10, text: '类目十', value: false },
41:     { id: 11, text: '类目十一', value: false },
42:     { id: 12, text: '类目十二', value: false }
43:   ];
44: 
45:   changeCategory(status: boolean, idx: number): void {
46:     if (idx === 0) {
47:       this.categories.map(i => (i.value = status));
48:     } else {
49:       this.categories[idx].value = status;
50:     }
51:     this.getData();
52:   }
53: 
54:   ngOnInit(): void {
55:     this.getData();
56:   }
57: 
58:   getData(): void {
59:     this.loading = true;
60:     this.http.get('/api/list', { count: this.q.ps }).subscribe(res => {
61:       this.list = this.list.concat(res);
62:       this.loading = false;
63:       this.cdr.detectChanges();
64:     });
65:   }
66: }
````

## File: src/app/routes/pro/list/table-list/table-list.component.ts
````typescript
  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
  2: import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
  3: import { _HttpClient } from '@delon/theme';
  4: import { SHARED_IMPORTS } from '@shared';
  5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
  6: import { NzMessageService } from 'ng-zorro-antd/message';
  7: import { NzModalService } from 'ng-zorro-antd/modal';
  8: import { map, tap } from 'rxjs';
  9: 
 10: @Component({
 11:   selector: 'app-table-list',
 12:   templateUrl: './table-list.component.html',
 13:   changeDetection: ChangeDetectionStrategy.OnPush,
 14:   imports: SHARED_IMPORTS
 15: })
 16: export class ProTableListComponent implements OnInit {
 17:   private readonly http = inject(_HttpClient);
 18:   private readonly msg = inject(NzMessageService);
 19:   private readonly modalSrv = inject(NzModalService);
 20:   private readonly cdr = inject(ChangeDetectorRef);
 21: 
 22:   q: {
 23:     pi: number;
 24:     ps: number;
 25:     no: string;
 26:     sorter: string;
 27:     status: number | null;
 28:     statusList: NzSafeAny[];
 29:   } = {
 30:     pi: 1,
 31:     ps: 10,
 32:     no: '',
 33:     sorter: '',
 34:     status: null,
 35:     statusList: []
 36:   };
 37:   data: any[] = [];
 38:   loading = false;
 39:   status = [
 40:     { index: 0, text: '关闭', value: false, type: 'default', checked: false },
 41:     {
 42:       index: 1,
 43:       text: '运行中',
 44:       value: false,
 45:       type: 'processing',
 46:       checked: false
 47:     },
 48:     { index: 2, text: '已上线', value: false, type: 'success', checked: false },
 49:     { index: 3, text: '异常', value: false, type: 'error', checked: false }
 50:   ];
 51:   @ViewChild('st', { static: true })
 52:   st!: STComponent;
 53:   columns: STColumn[] = [
 54:     { title: '', index: 'key', type: 'checkbox' },
 55:     { title: '规则编号', index: 'no' },
 56:     { title: '描述', index: 'description' },
 57:     {
 58:       title: '服务调用次数',
 59:       index: 'callNo',
 60:       type: 'number',
 61:       format: item => `${item.callNo} 万`,
 62:       sort: {
 63:         compare: (a, b) => a.callNo - b.callNo
 64:       }
 65:     },
 66:     {
 67:       title: '状态',
 68:       index: 'status',
 69:       render: 'status',
 70:       filter: {
 71:         menus: this.status,
 72:         fn: (filter, record) => record.status === filter['index']
 73:       }
 74:     },
 75:     {
 76:       title: '更新时间',
 77:       index: 'updatedAt',
 78:       type: 'date',
 79:       sort: {
 80:         compare: (a, b) => a.updatedAt - b.updatedAt
 81:       }
 82:     },
 83:     {
 84:       title: '操作',
 85:       buttons: [
 86:         {
 87:           text: '配置',
 88:           click: item => this.msg.success(`配置${item.no}`)
 89:         },
 90:         {
 91:           text: '订阅警报',
 92:           click: item => this.msg.success(`订阅警报${item.no}`)
 93:         }
 94:       ]
 95:     }
 96:   ];
 97:   selectedRows: STData[] = [];
 98:   description = '';
 99:   totalCallNo = 0;
100:   expandForm = false;
101: 
102:   ngOnInit(): void {
103:     this.getData();
104:   }
105: 
106:   getData(): void {
107:     this.loading = true;
108:     this.q.statusList = this.status.filter(w => w.checked).map(item => item.index);
109:     if (this.q.status !== null && this.q.status > -1) {
110:       this.q.statusList.push(this.q.status);
111:     }
112:     this.http
113:       .get('/rule', this.q)
114:       .pipe(
115:         map((list: Array<{ status: number; statusText: string; statusType: string }>) =>
116:           list.map(i => {
117:             const statusItem = this.status[i.status];
118:             i.statusText = statusItem.text;
119:             i.statusType = statusItem.type;
120:             return i;
121:           })
122:         ),
123:         tap(() => (this.loading = false))
124:       )
125:       .subscribe(res => {
126:         this.data = res;
127:         this.cdr.detectChanges();
128:       });
129:   }
130: 
131:   stChange(e: STChange): void {
132:     switch (e.type) {
133:       case 'checkbox':
134:         this.selectedRows = e.checkbox!;
135:         this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv['callNo'], 0);
136:         this.cdr.detectChanges();
137:         break;
138:       case 'filter':
139:         this.getData();
140:         break;
141:     }
142:   }
143: 
144:   remove(): void {
145:     this.http.delete('/rule', { nos: this.selectedRows.map(i => i['no']).join(',') }).subscribe(() => {
146:       this.getData();
147:       this.st.clearCheck();
148:     });
149:   }
150: 
151:   approval(): void {
152:     this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
153:   }
154: 
155:   add(tpl: TemplateRef<unknown>): void {
156:     this.modalSrv.create({
157:       nzTitle: '新建规则',
158:       nzContent: tpl,
159:       nzOnOk: () => {
160:         this.loading = true;
161:         this.http.post('/rule', { description: this.description }).subscribe(() => this.getData());
162:       }
163:     });
164:   }
165: 
166:   reset(): void {
167:     // wait form reset updated finished
168:     setTimeout(() => this.getData());
169:   }
170: }
````

## File: src/app/routes/pro/profile/advanced/advanced.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { STColumn } from '@delon/abc/st';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
 6: import { NzMessageService } from 'ng-zorro-antd/message';
 7: import { NzStepsModule } from 'ng-zorro-antd/steps';
 8: import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
 9: 
10: @Component({
11:   selector: 'app-profile-advanced',
12:   templateUrl: './advanced.component.html',
13:   styleUrls: ['./advanced.component.less'],
14:   changeDetection: ChangeDetectionStrategy.OnPush,
15:   imports: [...SHARED_IMPORTS, NzStepsModule]
16: })
17: export class ProProfileAdvancedComponent implements OnInit {
18:   readonly msg = inject(NzMessageService);
19:   private readonly http = inject(_HttpClient);
20:   private readonly cdr = inject(ChangeDetectorRef);
21: 
22:   list: Array<Record<string, NzSafeAny>> = [];
23:   data = {
24:     advancedOperation1: [],
25:     advancedOperation2: [],
26:     advancedOperation3: []
27:   };
28:   opColumns: STColumn[] = [
29:     { title: '操作类型', index: 'type' },
30:     { title: '操作人', index: 'name' },
31:     { title: '执行结果', index: 'status', render: 'status' },
32:     { title: '操作时间', index: 'updatedAt', type: 'date' },
33:     { title: '备注', index: 'memo', default: '-' }
34:   ];
35: 
36:   ngOnInit(): void {
37:     this.http.get('/profile/advanced').subscribe(res => {
38:       this.data = res;
39:       this.change({ index: 0, tab: null });
40:       this.cdr.detectChanges();
41:     });
42:   }
43: 
44:   change(args: NzTabChangeEvent): void {
45:     this.list = (this.data as NzSafeAny)[`advancedOperation${args.index! + 1}`];
46:   }
47: }
````

## File: src/app/routes/pro/profile/basic/basic.component.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 2: import { STColumn } from '@delon/abc/st';
 3: import { _HttpClient } from '@delon/theme';
 4: import { SHARED_IMPORTS } from '@shared';
 5: import { NzMessageService } from 'ng-zorro-antd/message';
 6: import { tap } from 'rxjs';
 7: 
 8: @Component({
 9:   selector: 'app-profile-basic',
10:   templateUrl: './basic.component.html',
11:   changeDetection: ChangeDetectionStrategy.OnPush,
12:   imports: SHARED_IMPORTS
13: })
14: export class ProProfileBaseComponent {
15:   private readonly http = inject(_HttpClient);
16:   private readonly msg = inject(NzMessageService);
17: 
18:   basicNum = 0;
19:   amountNum = 0;
20:   goods = this.http.get('/profile/goods').pipe(
21:     tap((list: Array<{ num: number; amount: number }>) => {
22:       list.forEach(item => {
23:         this.basicNum += Number(item.num);
24:         this.amountNum += Number(item.amount);
25:       });
26:     })
27:   );
28:   goodsColumns: STColumn[] = [
29:     {
30:       title: '商品编号',
31:       index: 'id',
32:       type: 'link',
33:       click: item => this.msg.success(`show ${item.id}`)
34:     },
35:     { title: '商品名称', index: 'name' },
36:     { title: '商品条码', index: 'barcode' },
37:     { title: '单价', index: 'price', type: 'currency' },
38:     { title: '数量（件）', index: 'num', className: 'text-right' },
39:     { title: '金额', index: 'amount', type: 'currency' }
40:   ];
41:   progress = this.http.get('/profile/progress');
42:   progressColumns: STColumn[] = [
43:     { title: '时间', index: 'time' },
44:     { title: '当前进度', index: 'rate' },
45:     {
46:       title: '状态',
47:       index: 'status',
48:       type: 'badge',
49:       badge: {
50:         success: { text: '成功', color: 'success' },
51:         processing: { text: '进行中', color: 'processing' }
52:       }
53:     },
54:     { title: '操作员ID', index: 'operator' },
55:     { title: '耗时', index: 'cost' }
56:   ];
57: }
````

## File: src/app/routes/pro/result/fail/fail.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzResultModule } from 'ng-zorro-antd/result';
 4: 
 5: @Component({
 6:   selector: 'app-result-fail',
 7:   templateUrl: './fail.component.html',
 8:   imports: [...SHARED_IMPORTS, NzResultModule]
 9: })
10: export class ProResultFailComponent {}
````

## File: src/app/routes/pro/result/success/success.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: import { NzMessageService } from 'ng-zorro-antd/message';
 4: import { NzResultModule } from 'ng-zorro-antd/result';
 5: import { NzStepsModule } from 'ng-zorro-antd/steps';
 6: 
 7: @Component({
 8:   selector: 'app-result-success',
 9:   templateUrl: './success.component.html',
10:   imports: [...SHARED_IMPORTS, NzResultModule, NzStepsModule]
11: })
12: export class ProResultSuccessComponent {
13:   readonly msg = inject(NzMessageService);
14: }
````

## File: src/app/routes/pro/routes.ts
````typescript
  1: import { Routes } from '@angular/router';
  2: 
  3: import { ProAccountCenterApplicationsComponent } from './account/center/applications/applications.component';
  4: import { ProAccountCenterArticlesComponent } from './account/center/articles/articles.component';
  5: import { ProAccountCenterComponent } from './account/center/center.component';
  6: import { ProAccountCenterProjectsComponent } from './account/center/projects/projects.component';
  7: import { ProAccountSettingsBaseComponent } from './account/settings/base/base.component';
  8: import { ProAccountSettingsBindingComponent } from './account/settings/binding/binding.component';
  9: import { ProAccountSettingsNotificationComponent } from './account/settings/notification/notification.component';
 10: import { ProAccountSettingsSecurityComponent } from './account/settings/security/security.component';
 11: import { ProAccountSettingsComponent } from './account/settings/settings.component';
 12: import { AdvancedFormComponent } from './form/advanced-form/advanced-form.component';
 13: import { BasicFormComponent } from './form/basic-form/basic-form.component';
 14: import { StepFormComponent } from './form/step-form/step-form.component';
 15: import { ProListApplicationsComponent } from './list/applications/applications.component';
 16: import { ProListArticlesComponent } from './list/articles/articles.component';
 17: import { ProBasicListComponent } from './list/basic-list/basic-list.component';
 18: import { ProCardListComponent } from './list/card-list/card-list.component';
 19: import { ProListLayoutComponent } from './list/list/list.component';
 20: import { ProListProjectsComponent } from './list/projects/projects.component';
 21: import { ProTableListComponent } from './list/table-list/table-list.component';
 22: import { ProProfileAdvancedComponent } from './profile/advanced/advanced.component';
 23: import { ProProfileBaseComponent } from './profile/basic/basic.component';
 24: import { ProResultFailComponent } from './result/fail/fail.component';
 25: import { ProResultSuccessComponent } from './result/success/success.component';
 26: 
 27: export const routes: Routes = [
 28:   {
 29:     path: 'form',
 30:     children: [
 31:       { path: 'basic-form', component: BasicFormComponent },
 32:       { path: 'step-form', component: StepFormComponent },
 33:       { path: 'advanced-form', component: AdvancedFormComponent }
 34:     ]
 35:   },
 36:   {
 37:     path: 'list',
 38:     children: [
 39:       { path: 'table-list', component: ProTableListComponent },
 40:       { path: 'basic-list', component: ProBasicListComponent },
 41:       { path: 'card-list', component: ProCardListComponent },
 42:       {
 43:         path: '',
 44:         component: ProListLayoutComponent,
 45:         children: [
 46:           { path: 'articles', component: ProListArticlesComponent },
 47:           { path: 'projects', component: ProListProjectsComponent },
 48:           { path: 'applications', component: ProListApplicationsComponent }
 49:         ]
 50:       }
 51:     ]
 52:   },
 53:   {
 54:     path: 'profile',
 55:     children: [
 56:       { path: 'basic', component: ProProfileBaseComponent },
 57:       { path: 'advanced', component: ProProfileAdvancedComponent }
 58:     ]
 59:   },
 60:   {
 61:     path: 'result',
 62:     children: [
 63:       { path: 'success', component: ProResultSuccessComponent },
 64:       { path: 'fail', component: ProResultFailComponent }
 65:     ]
 66:   },
 67:   {
 68:     path: 'account',
 69:     children: [
 70:       {
 71:         path: 'center',
 72:         component: ProAccountCenterComponent,
 73:         children: [
 74:           { path: '', redirectTo: 'articles', pathMatch: 'full' },
 75:           {
 76:             path: 'articles',
 77:             component: ProAccountCenterArticlesComponent,
 78:             data: { titleI18n: 'pro-account-center' }
 79:           },
 80:           {
 81:             path: 'projects',
 82:             component: ProAccountCenterProjectsComponent,
 83:             data: { titleI18n: 'pro-account-center' }
 84:           },
 85:           {
 86:             path: 'applications',
 87:             component: ProAccountCenterApplicationsComponent,
 88:             data: { titleI18n: 'pro-account-center' }
 89:           }
 90:         ]
 91:       },
 92:       {
 93:         path: 'settings',
 94:         component: ProAccountSettingsComponent,
 95:         children: [
 96:           { path: '', redirectTo: 'base', pathMatch: 'full' },
 97:           {
 98:             path: 'base',
 99:             component: ProAccountSettingsBaseComponent,
100:             data: { titleI18n: 'pro-account-settings' }
101:           },
102:           {
103:             path: 'security',
104:             component: ProAccountSettingsSecurityComponent,
105:             data: { titleI18n: 'pro-account-settings' }
106:           },
107:           {
108:             path: 'binding',
109:             component: ProAccountSettingsBindingComponent,
110:             data: { titleI18n: 'pro-account-settings' }
111:           },
112:           {
113:             path: 'notification',
114:             component: ProAccountSettingsNotificationComponent,
115:             data: { titleI18n: 'pro-account-settings' }
116:           }
117:         ]
118:       }
119:     ]
120:   }
121: ];
````

## File: src/app/routes/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: import { startPageGuard } from '@core';
 3: import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';
 4: 
 5: import { LayoutBasicComponent, LayoutBlankComponent } from '../layout';
 6: 
 7: export const routes: Routes = [
 8:   {
 9:     path: '',
10:     component: LayoutBasicComponent,
11:     canActivate: [startPageGuard, authSimpleCanActivate],
12:     canActivateChild: [authSimpleCanActivateChild],
13:     data: {},
14:     children: [
15:       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
16:       {
17:         path: 'dashboard',
18:         loadChildren: () => import('./dashboard/routes').then(m => m.routes)
19:       },
20:       {
21:         path: 'widgets',
22:         loadChildren: () => import('./widgets/routes').then(m => m.routes)
23:       },
24:       { path: 'style', loadChildren: () => import('./style/routes').then(m => m.routes) },
25:       { path: 'delon', loadChildren: () => import('./delon/routes').then(m => m.routes) },
26:       { path: 'extras', loadChildren: () => import('./extras/routes').then(m => m.routes) },
27:       { path: 'pro', loadChildren: () => import('./pro/routes').then(m => m.routes) }
28:     ]
29:   },
30:   // Blak Layout 空白布局
31:   {
32:     path: 'data-v',
33:     component: LayoutBlankComponent,
34:     children: [{ path: '', loadChildren: () => import('./data-v/routes').then(m => m.routes) }]
35:   },
36:   // passport
37:   { path: '', loadChildren: () => import('./passport/routes').then(m => m.routes) },
38:   { path: 'exception', loadChildren: () => import('./exception/routes').then(m => m.routes) },
39:   { path: '**', redirectTo: 'exception/404' }
40: ];
````

## File: src/app/routes/style/color.service.ts
````typescript
 1: import { Injectable } from '@angular/core';
 2: 
 3: @Injectable()
 4: export class ColorService {
 5:   APP_COLORS = {
 6:     primary: '#1890ff',
 7:     success: '#52c41a',
 8:     error: '#f5222d',
 9:     warning: '#fadb14',
10:     red: '#f5222d',
11:     volcano: '#fa541c',
12:     orange: '#fa8c16',
13:     gold: '#faad14',
14:     yellow: '#fadb14',
15:     lime: '#a0d911',
16:     green: '#52c41a',
17:     cyan: '#13c2c2',
18:     blue: '#1890ff',
19:     geekblue: '#2f54eb',
20:     purple: '#722ed1',
21:     magenta: '#eb2f96'
22:   };
23: 
24:   get names(): string[] {
25:     return Object.keys(this.APP_COLORS).filter((_, index) => index > 3);
26:   }
27: 
28:   get brands(): string[] {
29:     return ['primary', 'success', 'error', 'warning'];
30:   }
31: }
````

## File: src/app/routes/style/colors/colors.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { copy } from '@delon/util/browser';
 3: import { SHARED_IMPORTS } from '@shared';
 4: import { NzMessageService } from 'ng-zorro-antd/message';
 5: 
 6: import { ColorService } from '../color.service';
 7: 
 8: @Component({
 9:   selector: 'app-colors',
10:   templateUrl: './colors.component.html',
11:   styleUrls: ['./colors.component.less'],
12:   imports: SHARED_IMPORTS
13: })
14: export class ColorsComponent {
15:   private readonly colorSrv = inject(ColorService);
16:   private readonly msg = inject(NzMessageService);
17: 
18:   nums = Array(10)
19:     .fill(1)
20:     .map((v, i) => v + i);
21: 
22:   get names(): string[] {
23:     return this.colorSrv.names;
24:   }
25: 
26:   get brands(): string[] {
27:     return this.colorSrv.brands;
28:   }
29: 
30:   onCopy(str: string): void {
31:     copy(str).then(() => this.msg.success(`Copied Success!`));
32:   }
33: }
````

## File: src/app/routes/style/gridmasonry/gridmasonry.component.ts
````typescript
 1: import { Component } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: @Component({
 5:   selector: 'app-gridmasonry',
 6:   templateUrl: './gridmasonry.component.html',
 7:   styleUrls: ['./gridmasonry.component.less'],
 8:   imports: SHARED_IMPORTS
 9: })
10: export class GridMasonryComponent {}
````

## File: src/app/routes/style/routes.ts
````typescript
 1: import { Routes } from '@angular/router';
 2: 
 3: import { ColorService } from './color.service';
 4: import { ColorsComponent } from './colors/colors.component';
 5: import { GridMasonryComponent } from './gridmasonry/gridmasonry.component';
 6: import { TypographyComponent } from './typography/typography.component';
 7: 
 8: export const routes: Routes = [
 9:   {
10:     path: '',
11:     providers: [ColorService],
12:     children: [
13:       { path: 'gridmasonry', component: GridMasonryComponent },
14:       { path: 'typography', component: TypographyComponent },
15:       { path: 'colors', component: ColorsComponent }
16:     ]
17:   }
18: ];
````

## File: src/app/routes/style/typography/typography.component.ts
````typescript
 1: import { Component, inject } from '@angular/core';
 2: import { SHARED_IMPORTS } from '@shared';
 3: 
 4: import { ColorService } from '../color.service';
 5: 
 6: @Component({
 7:   selector: 'app-typography',
 8:   templateUrl: './typography.component.html',
 9:   imports: SHARED_IMPORTS
10: })
11: export class TypographyComponent {
12:   private readonly colorSrv = inject(ColorService);
13:   get names(): string[] {
14:     return this.colorSrv.names;
15:   }
16: }
````

## File: src/app/routes/widgets/routes.ts
````typescript
1: import { Routes } from '@angular/router';
2: 
3: import { WidgetsComponent } from './widgets/widgets.component';
4: 
5: export const routes: Routes = [{ path: '', component: WidgetsComponent }];
````

## File: src/app/routes/widgets/widgets/widgets.component.ts
````typescript
 1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
 2: import { G2MiniAreaModule } from '@delon/chart/mini-area';
 3: import { G2MiniBarData, G2MiniBarModule } from '@delon/chart/mini-bar';
 4: import { _HttpClient } from '@delon/theme';
 5: import { SHARED_IMPORTS } from '@shared';
 6: import { NzCarouselModule } from 'ng-zorro-antd/carousel';
 7: import { NzMessageService } from 'ng-zorro-antd/message';
 8: 
 9: @Component({
10:   selector: 'app-widgets',
11:   templateUrl: './widgets.component.html',
12:   styleUrls: ['./widgets.component.less'],
13:   changeDetection: ChangeDetectionStrategy.OnPush,
14:   imports: [...SHARED_IMPORTS, NzCarouselModule, G2MiniBarModule, G2MiniAreaModule]
15: })
16: export class WidgetsComponent implements OnInit {
17:   readonly msg = inject(NzMessageService);
18:   private readonly http = inject(_HttpClient);
19:   private readonly cdr = inject(ChangeDetectorRef);
20: 
21:   data: G2MiniBarData[] = [];
22:   smallData: G2MiniBarData[] = [];
23:   todoData: Array<{ completed: boolean; avatar: string; name: string; content: string }> = [
24:     {
25:       completed: true,
26:       avatar: '1',
27:       name: '苏先生',
28:       content: `请告诉我，我应该说点什么好？`
29:     },
30:     {
31:       completed: false,
32:       avatar: '2',
33:       name: 'はなさき',
34:       content: `ハルカソラトキヘダツヒカリ`
35:     },
36:     {
37:       completed: false,
38:       avatar: '3',
39:       name: 'cipchk',
40:       content: `this world was never meant for one as beautiful as you.`
41:     },
42:     {
43:       completed: false,
44:       avatar: '4',
45:       name: 'Kent',
46:       content: `my heart is beating with hers`
47:     },
48:     {
49:       completed: false,
50:       avatar: '5',
51:       name: 'Are you',
52:       content: `They always said that I love beautiful girl than my friends`
53:     },
54:     {
55:       completed: false,
56:       avatar: '6',
57:       name: 'Forever',
58:       content: `Walking through green fields ，sunshine in my eyes.`
59:     }
60:   ];
61:   like = false;
62:   dislike = false;
63: 
64:   ngOnInit(): void {
65:     this.http.get('/chart/visit').subscribe((res: G2MiniBarData[]) => {
66:       this.data = res;
67:       this.smallData = res.slice(0, 6);
68:       this.cdr.detectChanges();
69:     });
70:   }
71: }
````

## File: src/app/shared/cell-widget/index.ts
````typescript
1: import type { CellWidgetProvideConfig } from '@delon/abc/cell';
2: 
3: export const CELL_WIDGETS: CellWidgetProvideConfig[] = [];
````

## File: src/app/shared/index.ts
````typescript
 1: // Components
 2: 
 3: // Utils
 4: export * from './utils/yuan';
 5: 
 6: // Module
 7: export * from './shared-imports';
 8: export * from './json-schema/index';
 9: export * from './st-widget/index';
10: export * from './cell-widget/index';
````

## File: src/app/shared/json-schema/index.ts
````typescript
 1: import type { SFWidgetProvideConfig } from '@delon/form';
 2: // import { withCascaderWidget } from '@delon/form/widgets/cascader';
 3: 
 4: import { TestWidget } from './test/test.widget';
 5: 
 6: export const SF_WIDGETS: SFWidgetProvideConfig[] = [
 7:   { KEY: TestWidget.KEY, type: TestWidget }
 8:   // Non-built-in widget registration method
 9:   // withCascaderWidget()
10: ];
````

## File: src/app/shared/json-schema/test/test.widget.ts
````typescript
 1: import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
 2: import { ControlWidget, DelonFormModule } from '@delon/form';
 3: 
 4: @Component({
 5:   selector: 'test',
 6:   template: `
 7:     <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
 8:       test widget
 9:     </sf-item-wrap>
10:   `,
11:   preserveWhitespaces: false,
12:   changeDetection: ChangeDetectionStrategy.OnPush,
13:   imports: [DelonFormModule]
14: })
15: export class TestWidget extends ControlWidget implements OnInit {
16:   static readonly KEY = 'test';
17: 
18:   ngOnInit(): void {
19:     console.warn('init test widget');
20:   }
21: }
````

## File: src/app/shared/shared-delon.module.ts
````typescript
  1: // ========== @delon/abc 組件模組 ==========
  2: // 文本超出省略顯示 — https://ng-alain.com/components/ellipsis
  3: import { CellModule } from '@delon/abc/cell';
  4: import { CountDownModule } from '@delon/abc/count-down';
  5: import { DownFileDirective } from '@delon/abc/down-file';
  6: import { EllipsisComponent } from '@delon/abc/ellipsis';
  7: // 頁面底部操作工具欄 — https://ng-alain.com/components/footer-toolbar
  8: import { ExceptionModule } from '@delon/abc/exception';
  9: import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
 10: // 內容區全屏/填充切換 — https://ng-alain.com/components/full-content
 11: import { FullContentModule } from '@delon/abc/full-content';
 12: // 頁面標題區（麵包屑、操作區） — https://ng-alain.com/components/page-header
 13: import { GlobalFooterModule } from '@delon/abc/global-footer';
 14: import { NoticeIconModule } from '@delon/abc/notice-icon';
 15: import { OnboardingModule } from '@delon/abc/onboarding';
 16: import { PageHeaderModule } from '@delon/abc/page-header';
 17: // SE：簡潔表單佈局（快速排版表單項） — https://ng-alain.com/components/se
 18: import { QuickMenuModule } from '@delon/abc/quick-menu';
 19: import { ReuseTabModule } from '@delon/abc/reuse-tab';
 20: import { SEModule } from '@delon/abc/se';
 21: // ST：Smart Table 智能表格 — https://ng-alain.com/components/st
 22: import { STModule } from '@delon/abc/st';
 23: // SV：簡單視圖，用於鍵值描述展示 — https://ng-alain.com/components/sv
 24: import { SVModule } from '@delon/abc/sv';
 25: // Tag 多選與展開/收起選擇器 — https://ng-alain.com/components/tag-select
 26: import { TagSelectComponent } from '@delon/abc/tag-select';
 27: // ReuseTab 標籤頁（路由快取） — https://ng-alain.com/components/reuse-tab
 28: // 引導式操作 — https://ng-alain.com/components/onboarding
 29: // 快捷菜單 — https://ng-alain.com/components/quick-menu
 30: // 倒計時 — https://ng-alain.com/components/count-down
 31: // 全局頁腳 — https://ng-alain.com/components/global-footer
 32: // 異常頁面 — https://ng-alain.com/components/exception
 33: // 通知圖標 — https://ng-alain.com/components/notice-icon
 34: // 下載文件指令 — https://ng-alain.com/components/down-file
 35: // ACL 訪問控制指令（顯示/隱藏/條件） — https://ng-alain.com/acl
 36: import { ACLDirective, ACLIfDirective } from '@delon/acl';
 37: // 動態表單（基於 JSON Schema 的表單生成與驗證） — https://ng-alain.com/form
 38: // 金額/貨幣格式化管道 — https://ng-alain.com/util
 39: // 圖表組件 — https://ng-alain.com/docs/chart
 40: // 注意：@delon/chart 必須從子模組導入，而非從 @delon/chart 直接導入
 41: // 柱狀圖 — https://ng-alain.com/chart/bar
 42: import { G2BarModule } from '@delon/chart/bar';
 43: // 圖表卡片 — https://ng-alain.com/chart/card
 44: import { G2CardModule } from '@delon/chart/card';
 45: // ECharts 圖表 — https://ng-alain.com/chart/chart-echarts
 46: import { ChartEChartsModule } from '@delon/chart/chart-echarts';
 47: // 儀表盤 — https://ng-alain.com/chart/gauge
 48: import { G2GaugeModule } from '@delon/chart/gauge';
 49: // 迷你面積圖 — https://ng-alain.com/chart/mini-area
 50: import { G2MiniAreaModule } from '@delon/chart/mini-area';
 51: // 迷你柱狀圖 — https://ng-alain.com/chart/mini-bar
 52: import { G2MiniBarModule } from '@delon/chart/mini-bar';
 53: // 迷你進度條 — https://ng-alain.com/chart/mini-progress
 54: import { G2MiniProgressModule } from '@delon/chart/mini-progress';
 55: // 數據文本 — https://ng-alain.com/chart/number-info
 56: import { NumberInfoModule } from '@delon/chart/number-info';
 57: // 餅圖 — https://ng-alain.com/chart/pie
 58: import { G2PieModule } from '@delon/chart/pie';
 59: // 雷達圖 — https://ng-alain.com/chart/radar
 60: import { G2RadarModule } from '@delon/chart/radar';
 61: // 單一柱狀圖 — https://ng-alain.com/chart/single-bar
 62: import { G2SingleBarModule } from '@delon/chart/single-bar';
 63: // 標籤雲 — https://ng-alain.com/chart/tag-cloud
 64: import { G2TagCloudModule } from '@delon/chart/tag-cloud';
 65: // 時間軸 — https://ng-alain.com/chart/timeline
 66: import { G2TimelineModule } from '@delon/chart/timeline';
 67: // 趨勢標記 — https://ng-alain.com/chart/trend
 68: import { TrendModule } from '@delon/chart/trend';
 69: // 水波圖 — https://ng-alain.com/chart/water-wave
 70: import { G2WaterWaveModule } from '@delon/chart/water-wave';
 71: import { DelonFormModule } from '@delon/form';
 72: import { LayoutDefaultModule } from '@delon/theme/layout-default';
 73: import { SettingDrawerModule } from '@delon/theme/setting-drawer';
 74: import { ThemeBtnComponent } from '@delon/theme/theme-btn';
 75: import { CurrencyPricePipe } from '@delon/util';
 76: // ========== @delon/theme 組件模組 ==========
 77: // 默認佈局 — https://ng-alain.com/theme/layout-default
 78: // 設置抽屜 — https://ng-alain.com/theme/setting-drawer
 79: // 主題切換按鈕 — https://ng-alain.com/theme/theme-btn
 80: 
 81: export const SHARED_DELON_MODULES = [
 82:   CellModule, // 單元格渲染 — https://ng-alain.com/components/cell/zh
 83:   DelonFormModule, // 動態表單 — https://ng-alain.com/form
 84:   STModule, // 智能表格 — https://ng-alain.com/components/st
 85:   SVModule, // 鍵值描述視圖 — https://ng-alain.com/components/sv
 86:   SEModule, // 表單佈局 — https://ng-alain.com/components/se
 87:   PageHeaderModule, // 頁面標題/操作 — https://ng-alain.com/components/page-header
 88:   EllipsisComponent, // 文本省略 — https://ng-alain.com/components/ellipsis
 89:   FooterToolbarModule, // 底部工具欄 — https://ng-alain.com/components/footer-toolbar
 90:   FullContentModule, // 全屏內容 — https://ng-alain.com/components/full-content
 91:   ReuseTabModule, // 標籤頁（路由快取） — https://ng-alain.com/components/reuse-tab
 92:   TagSelectComponent, // 標籤選擇 — https://ng-alain.com/components/tag-select
 93:   OnboardingModule, // 引導式操作 — https://ng-alain.com/components/onboarding
 94:   QuickMenuModule, // 快捷菜單 — https://ng-alain.com/components/quick-menu
 95:   CountDownModule, // 倒計時 — https://ng-alain.com/components/count-down
 96:   GlobalFooterModule, // 全局頁腳 — https://ng-alain.com/components/global-footer
 97:   ExceptionModule, // 異常頁面 — https://ng-alain.com/components/exception
 98:   NoticeIconModule, // 通知圖標 — https://ng-alain.com/components/notice-icon
 99:   DownFileDirective, // 下載文件指令 — https://ng-alain.com/components/down-file
100:   ACLDirective, // ACL 指令 — https://ng-alain.com/acl
101:   ACLIfDirective, // 條件 ACL 指令 — https://ng-alain.com/acl
102:   CurrencyPricePipe, // 金額格式化 — https://ng-alain.com/util
103:   // ========== @delon/theme 組件模組 ==========
104:   LayoutDefaultModule, // 默認佈局 — https://ng-alain.com/theme/layout-default
105:   SettingDrawerModule, // 設置抽屜 — https://ng-alain.com/theme/setting-drawer
106:   ThemeBtnComponent, // 主題切換按鈕 — https://ng-alain.com/theme/theme-btn
107:   // @delon/chart 完整圖表模組套件
108:   G2BarModule, // 柱狀圖 — https://ng-alain.com/chart/bar
109:   G2CardModule, // 圖表卡片 — https://ng-alain.com/chart/card
110:   ChartEChartsModule, // ECharts 圖表 — https://ng-alain.com/chart/chart-echarts
111:   G2GaugeModule, // 儀表盤 — https://ng-alain.com/chart/gauge
112:   G2MiniAreaModule, // 迷你面積圖 — https://ng-alain.com/chart/mini-area
113:   G2MiniBarModule, // 迷你柱狀圖 — https://ng-alain.com/chart/mini-bar
114:   G2MiniProgressModule, // 迷你進度條 — https://ng-alain.com/chart/mini-progress
115:   NumberInfoModule, // 數據文本 — https://ng-alain.com/chart/number-info
116:   G2PieModule, // 餅圖 — https://ng-alain.com/chart/pie
117:   G2RadarModule, // 雷達圖 — https://ng-alain.com/chart/radar
118:   G2SingleBarModule, // 單一柱狀圖 — https://ng-alain.com/chart/single-bar
119:   G2TagCloudModule, // 標籤雲 — https://ng-alain.com/chart/tag-cloud
120:   G2TimelineModule, // 時間軸 — https://ng-alain.com/chart/timeline
121:   TrendModule, // 趨勢標記 — https://ng-alain.com/chart/trend
122:   G2WaterWaveModule // 水波圖 — https://ng-alain.com/chart/water-wave
123: ];
````

## File: src/app/shared/shared-imports.ts
````typescript
 1: // Angular Common 管道與指令 — https://angular.dev/guide/pipes
 2: import {
 3:   AsyncPipe,
 4:   CurrencyPipe,
 5:   DatePipe,
 6:   DecimalPipe,
 7:   I18nPluralPipe,
 8:   I18nSelectPipe,
 9:   JsonPipe,
10:   KeyValuePipe,
11:   LowerCasePipe,
12:   NgClass,
13:   NgComponentOutlet,
14:   NgStyle,
15:   NgTemplateOutlet,
16:   PercentPipe,
17:   SlicePipe,
18:   TitleCasePipe,
19:   UpperCasePipe
20: } from '@angular/common';
21: // 表單模組（模板式 / 響應式） — https://angular.dev/guide/forms
22: import { FormsModule, ReactiveFormsModule } from '@angular/forms';
23: // 路由（RouterLink/RouterOutlet） — https://angular.dev/guide/routing
24: import { RouterOutlet, RouterLink } from '@angular/router';
25: // @delon/theme 管道（I18n/Date） — https://ng-alain.com/theme
26: // 注意：@delon/theme 的 DatePipe 在模板中使用 `_date` pipe，Angular Common 的 DatePipe 使用 `date` pipe
27: import { DatePipe as DelonDatePipe, I18nPipe } from '@delon/theme';
28: 
29: import { SHARED_DELON_MODULES } from './shared-delon.module';
30: import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
31: 
32: export const SHARED_IMPORTS = [
33:   // ========== Angular 表單模組 ==========
34:   FormsModule, // 模板式表單 — https://angular.dev/guide/forms#template-driven-forms
35:   ReactiveFormsModule, // 響應式表單 — https://angular.dev/guide/forms#reactive-forms
36: 
37:   // ========== Angular 路由 ==========
38:   RouterLink, // 路由連結指令 — https://angular.dev/guide/routing#routerlink
39:   RouterOutlet, // 路由插座 — https://angular.dev/guide/routing#routeroutlet
40:   NgTemplateOutlet, // 動態嵌入模板 — https://angular.dev/api/common/NgTemplateOutlet
41:   NgComponentOutlet, // 動態組件嵌入 — https://angular.dev/api/common/NgComponentOutlet
42: 
43:   // ========== Angular Common 標準管道 ==========
44:   DatePipe, // 日期格式化（模板使用: `{{ value | date }}`） — https://angular.dev/api/common/DatePipe
45:   CurrencyPipe, // 貨幣格式化（模板使用: `{{ value | currency }}`） — https://angular.dev/api/common/CurrencyPipe
46:   DecimalPipe, // 數字格式化（模板使用: `{{ value | number }}`） — https://angular.dev/api/common/DecimalPipe
47:   PercentPipe, // 百分比格式化（模板使用: `{{ value | percent }}`） — https://angular.dev/api/common/PercentPipe
48:   LowerCasePipe, // 轉小寫（模板使用: `{{ value | lowercase }}`） — https://angular.dev/api/common/LowerCasePipe
49:   UpperCasePipe, // 轉大寫（模板使用: `{{ value | uppercase }}`） — https://angular.dev/api/common/UpperCasePipe
50:   TitleCasePipe, // 標題大小寫（模板使用: `{{ value | titlecase }}`） — https://angular.dev/api/common/TitleCasePipe
51:   SlicePipe, // 陣列/字串切片（模板使用: `{{ value | slice:start:end }}`） — https://angular.dev/api/common/SlicePipe
52:   KeyValuePipe, // 鍵值對遍歷（模板使用: `@for (item of obj | keyvalue)`） — https://angular.dev/api/common/KeyValuePipe
53:   JsonPipe, // 物件轉 JSON 字串（模板使用: `{{ value | json }}`） — https://angular.dev/api/common/JsonPipe
54:   AsyncPipe, // 觀察值/Promise 非同步解包（模板使用: `{{ value$ | async }}`） — https://angular.dev/api/common/AsyncPipe
55:   I18nPluralPipe, // 複數形式映射（模板使用: `{{ count | i18nPlural:mapping }}`） — https://angular.dev/api/common/I18nPluralPipe
56:   I18nSelectPipe, // 鍵值映射選擇（模板使用: `{{ value | i18nSelect:mapping }}`） — https://angular.dev/api/common/I18nSelectPipe
57:   NgClass, // 動態 CSS 類（模板使用: `[ngClass]="..."`） — https://angular.dev/api/common/NgClass
58:   NgStyle, // 動態內聯樣式（模板使用: `[ngStyle]="..."`） — https://angular.dev/api/common/NgStyle
59: 
60:   // ========== @delon/theme 管道 ==========
61:   I18nPipe, // 國際化翻譯管道（模板使用: `{{ key | i18n }}`） — https://ng-alain.com/theme
62:   DelonDatePipe, // @delon/theme 日期管道（模板使用: `{{ value | _date }}`） — https://ng-alain.com/theme
63: 
64:   // ========== @delon 組件/指令集合 ==========
65:   // https://ng-alain.com/components
66:   ...SHARED_DELON_MODULES,
67: 
68:   // ========== ng-zorro-antd 組件集合 ==========
69:   // https://ng.ant.design/components/overview/zh
70:   ...SHARED_ZORRO_MODULES
71: ];
````

## File: src/app/shared/shared-zorro.module.ts
````typescript
  1: import { NzAffixModule } from 'ng-zorro-antd/affix';
  2: import { NzAlertModule } from 'ng-zorro-antd/alert';
  3: import { NzAnchorModule } from 'ng-zorro-antd/anchor';
  4: import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
  5: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
  6: import { NzBackTopModule } from 'ng-zorro-antd/back-top';
  7: import { NzBadgeModule } from 'ng-zorro-antd/badge';
  8: import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
  9: import { NzButtonModule } from 'ng-zorro-antd/button';
 10: import { NzCalendarModule } from 'ng-zorro-antd/calendar';
 11: import { NzCardModule } from 'ng-zorro-antd/card';
 12: import { NzCarouselModule } from 'ng-zorro-antd/carousel';
 13: import { NzCascaderModule } from 'ng-zorro-antd/cascader';
 14: import { NzCheckListModule } from 'ng-zorro-antd/check-list';
 15: import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
 16: import { NzCollapseModule } from 'ng-zorro-antd/collapse';
 17: import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
 18: import { NzCommentModule } from 'ng-zorro-antd/comment';
 19: import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
 20: import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
 21: import { NzDividerModule } from 'ng-zorro-antd/divider';
 22: import { NzDrawerModule } from 'ng-zorro-antd/drawer';
 23: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 24: import { NzEmptyModule } from 'ng-zorro-antd/empty';
 25: import { NzFlexModule } from 'ng-zorro-antd/flex';
 26: import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
 27: import { NzFormModule } from 'ng-zorro-antd/form';
 28: import { NzGridModule } from 'ng-zorro-antd/grid';
 29: import { NzHashCodeModule } from 'ng-zorro-antd/hash-code';
 30: import { NzIconModule } from 'ng-zorro-antd/icon';
 31: import { NzImageModule } from 'ng-zorro-antd/image';
 32: import { NzInputModule } from 'ng-zorro-antd/input';
 33: import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
 34: import { NzLayoutModule } from 'ng-zorro-antd/layout';
 35: import { NzListModule } from 'ng-zorro-antd/list';
 36: import { NzMentionModule } from 'ng-zorro-antd/mention';
 37: import { NzMenuModule } from 'ng-zorro-antd/menu';
 38: import { NzModalModule } from 'ng-zorro-antd/modal';
 39: import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
 40: import { NzPaginationModule } from 'ng-zorro-antd/pagination';
 41: import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
 42: import { NzPopoverModule } from 'ng-zorro-antd/popover';
 43: import { NzProgressModule } from 'ng-zorro-antd/progress';
 44: import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
 45: import { NzRadioModule } from 'ng-zorro-antd/radio';
 46: import { NzRateModule } from 'ng-zorro-antd/rate';
 47: import { NzResultModule } from 'ng-zorro-antd/result';
 48: import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
 49: import { NzSelectModule } from 'ng-zorro-antd/select';
 50: import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
 51: import { NzSliderModule } from 'ng-zorro-antd/slider';
 52: import { NzSpaceModule } from 'ng-zorro-antd/space';
 53: import { NzSpinModule } from 'ng-zorro-antd/spin';
 54: import { NzSplitterModule } from 'ng-zorro-antd/splitter';
 55: import { NzStatisticModule } from 'ng-zorro-antd/statistic';
 56: import { NzStepsModule } from 'ng-zorro-antd/steps';
 57: import { NzSwitchModule } from 'ng-zorro-antd/switch';
 58: import { NzTableModule } from 'ng-zorro-antd/table';
 59: import { NzTabsModule } from 'ng-zorro-antd/tabs';
 60: import { NzTagModule } from 'ng-zorro-antd/tag';
 61: import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
 62: import { NzTimelineModule } from 'ng-zorro-antd/timeline';
 63: import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
 64: import { NzTransferModule } from 'ng-zorro-antd/transfer';
 65: import { NzTreeModule } from 'ng-zorro-antd/tree';
 66: import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
 67: import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
 68: import { NzTypographyModule } from 'ng-zorro-antd/typography';
 69: import { NzUploadModule } from 'ng-zorro-antd/upload';
 70: import { NzWaterMarkModule } from 'ng-zorro-antd/water-mark';
 71: 
 72: export const SHARED_ZORRO_MODULES = [
 73:   // 反饋類組件
 74:   NzAlertModule, // Alert 警告提示 - https://ng.ant.design/components/alert/en
 75:   NzResultModule, // Result 結果 - https://ng.ant.design/components/result/en
 76:   NzSkeletonModule, // Skeleton 骨架屏 - https://ng.ant.design/components/skeleton/en
 77:   NzSpinModule, // Spin 加載中 - https://ng.ant.design/components/spin/en
 78:   NzProgressModule, // Progress 進度條 - https://ng.ant.design/components/progress/en
 79:   NzDrawerModule, // Drawer 抽屜 - https://ng.ant.design/components/drawer/en
 80:   NzModalModule, // Modal 對話框 - https://ng.ant.design/components/modal/en
 81:   NzPopconfirmModule, // Popconfirm 氣泡確認框 - https://ng.ant.design/components/popconfirm/en
 82:   // 注意：Message 和 Notification 在 ng-zorro-antd v20+ 中通過服務提供（NzMessageService, NzNotificationService）
 83:   // 不需要導入模組，可直接注入使用
 84:   // 數據展示類組件
 85:   NzAvatarModule, // Avatar 頭像 - https://ng.ant.design/components/avatar/en
 86:   NzBadgeModule, // Badge 徽標數 - https://ng.ant.design/components/badge/en
 87:   NzCalendarModule, // Calendar 日曆 - https://ng.ant.design/components/calendar/en
 88:   NzCardModule, // Card 卡片 - https://ng.ant.design/components/card/en
 89:   NzCarouselModule, // Carousel 走馬燈 - https://ng.ant.design/components/carousel/en
 90:   NzCollapseModule, // Collapse 折疊面板 - https://ng.ant.design/components/collapse/en
 91:   NzCommentModule, // Comment 評論 - https://ng.ant.design/components/comment/en
 92:   NzDescriptionsModule, // Descriptions 描述列表 - https://ng.ant.design/components/descriptions/en
 93:   NzEmptyModule, // Empty 空狀態 - https://ng.ant.design/components/empty/en
 94:   NzImageModule, // Image 圖片 - https://ng.ant.design/components/image/en
 95:   NzListModule, // List 列表 - https://ng.ant.design/components/list/en
 96:   NzPopoverModule, // Popover 氣泡卡片 - https://ng.ant.design/components/popover/en
 97:   NzQRCodeModule, // QRCode 二維碼 - https://ng.ant.design/components/qr-code/en
 98:   NzSegmentedModule, // Segmented 分段控制器 - https://ng.ant.design/components/segmented/en
 99:   NzStatisticModule, // Statistic 統計 - https://ng.ant.design/components/statistic/en
100:   NzTableModule, // Table 表格 - https://ng.ant.design/components/table/en
101:   NzTagModule, // Tag 標籤 - https://ng.ant.design/components/tag/en
102:   NzTimelineModule, // Timeline 時間軸 - https://ng.ant.design/components/timeline/en
103:   NzTooltipModule, // Tooltip 文字提示 - https://ng.ant.design/components/tooltip/en
104:   NzTreeModule, // Tree 樹形控件 - https://ng.ant.design/components/tree/en
105:   NzTreeViewModule, // TreeView 樹視圖 - https://ng.ant.design/components/tree-view/en
106:   // 數據錄入類組件
107:   NzAutocompleteModule, // AutoComplete 自動完成 - https://ng.ant.design/components/auto-complete/en
108:   NzCascaderModule, // Cascader 級聯選擇 - https://ng.ant.design/components/cascader/en
109:   NzCheckboxModule, // Checkbox 多選框 - https://ng.ant.design/components/checkbox/en
110:   NzColorPickerModule, // ColorPicker 顏色選擇器 - https://ng.ant.design/components/color-picker/en
111:   NzDatePickerModule, // DatePicker 日期選擇框 - https://ng.ant.design/components/date-picker/en
112:   NzFormModule, // Form 表單 - https://ng.ant.design/components/form/en
113:   NzInputModule, // Input 輸入框 - https://ng.ant.design/components/input/en
114:   NzInputNumberModule, // InputNumber 數字輸入框 - https://ng.ant.design/components/input-number/en
115:   NzMentionModule, // Mention 提及 - https://ng.ant.design/components/mention/en
116:   NzRadioModule, // Radio 單選框 - https://ng.ant.design/components/radio/en
117:   NzRateModule, // Rate 評分 - https://ng.ant.design/components/rate/en
118:   NzSelectModule, // Select 選擇器 - https://ng.ant.design/components/select/en
119:   NzSliderModule, // Slider 滑動輸入條 - https://ng.ant.design/components/slider/en
120:   NzSwitchModule, // Switch 開關 - https://ng.ant.design/components/switch/en
121:   NzTimePickerModule, // TimePicker 時間選擇框 - https://ng.ant.design/components/time-picker/en
122:   NzTransferModule, // Transfer 穿梭框 - https://ng.ant.design/components/transfer/en
123:   NzTreeSelectModule, // TreeSelect 樹選擇 - https://ng.ant.design/components/tree-select/en
124:   NzUploadModule, // Upload 上傳 - https://ng.ant.design/components/upload/en
125:   // 佈局類組件
126:   NzDividerModule, // Divider 分割線 - https://ng.ant.design/components/divider/en
127:   NzFlexModule, // Flex 彈性佈局 - https://ng.ant.design/components/flex/en
128:   NzGridModule, // Grid 柵格 - https://ng.ant.design/components/grid/en
129:   NzLayoutModule, // Layout 佈局 - https://ng.ant.design/components/layout/en
130:   NzSpaceModule, // Space 間距 - https://ng.ant.design/components/space/en
131:   NzSplitterModule, // Splitter 分隔面板 - https://ng.ant.design/components/splitter/en
132:   // 通用類組件
133:   NzButtonModule, // Button 按鈕 - https://ng.ant.design/components/button/en
134:   NzFloatButtonModule, // FloatButton 懸浮按鈕 - https://ng.ant.design/components/float-button/en
135:   NzIconModule, // Icon 圖標 - https://ng.ant.design/components/icon/en
136:   NzTypographyModule, // Typography 排版 - https://ng.ant.design/components/typography/en
137:   // 導航類組件
138:   NzAnchorModule, // Anchor 錨點 - https://ng.ant.design/components/anchor/en
139:   NzBreadCrumbModule, // Breadcrumb 麵包屑 - https://ng.ant.design/components/breadcrumb/en
140:   NzDropDownModule, // Dropdown 下拉菜單 - https://ng.ant.design/components/dropdown/en
141:   NzMenuModule, // Menu 導航菜單 - https://ng.ant.design/components/menu/en
142:   NzPageHeaderModule, // PageHeader 頁頭 - https://ng.ant.design/components/page-header/en
143:   NzPaginationModule, // Pagination 分頁 - https://ng.ant.design/components/pagination/en
144:   NzStepsModule, // Steps 步驟條 - https://ng.ant.design/components/steps/en
145:   NzTabsModule, // Tabs 標籤頁 - https://ng.ant.design/components/tabs/en
146:   // 其他類組件
147:   NzAffixModule, // Affix 固釘 - https://ng.ant.design/components/affix/en
148:   NzBackTopModule, // BackTop 返回頂部 - https://ng.ant.design/components/back-top/en
149:   NzWaterMarkModule, // WaterMark 水印 - https://ng.ant.design/components/water-mark/en
150:   // 特色組件
151:   NzCheckListModule, // CheckList 任務清單 - https://ng.ant.design/components/check-list/en
152:   NzHashCodeModule // HashCode 哈希碼 - https://ng.ant.design/components/hash-code/en
153: ];
````

## File: src/app/shared/st-widget/index.ts
````typescript
1: import type { STWidgetProvideConfig } from '@delon/abc/st';
2: 
3: export const ST_WIDGETS: STWidgetProvideConfig[] = [];
````

## File: src/app/shared/utils/yuan.ts
````typescript
 1: /**
 2:  * 转化成RMB元字符串
 3:  *
 4:  * @param digits 当数字类型时，允许指定小数点后数字的个数，默认2位小数
 5:  */
 6: export function yuan(value: number | string, digits = 2): string {
 7:   if (typeof value === 'number') {
 8:     value = value.toFixed(digits);
 9:   }
10:   return `&yen ${value}`;
11: }
````

## File: src/environments/environment.prod.ts
````typescript
 1: import { Environment } from '@delon/theme';
 2: 
 3: export const environment = {
 4:   production: true,
 5:   useHash: true,
 6:   api: {
 7:     baseUrl: './',
 8:     refreshTokenEnabled: true,
 9:     refreshTokenType: 'auth-refresh'
10:   },
11:   supabase: {
12:     url: 'https://pfxxjtvnqptdvjfakotc.supabase.co',
13:     anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmeHhqdHZucXB0ZHZqZmFrb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzgwNjMsImV4cCI6MjA3ODY1NDA2M30.xADVH2fTd4059lZSZWpIM6CSeiixm0VCgN0SC5bKGxo',
14:     storage: {
15:       documentBucket: 'blueprint-documents'
16:     }
17:   }
18: } as Environment;
````

## File: src/environments/environment.ts
````typescript
 1: // This file can be replaced during build by using the `fileReplacements` array.
 2: // `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
 3: // The list of file replacements can be found in `angular.json`.
 4: 
 5: import * as MOCKDATA from '@_mock';
 6: import { mockInterceptor, provideMockConfig } from '@delon/mock';
 7: import { Environment } from '@delon/theme';
 8: 
 9: export const environment = {
10:   production: false,
11:   useHash: true,
12:   api: {
13:     baseUrl: './',
14:     refreshTokenEnabled: true,
15:     refreshTokenType: 'auth-refresh'
16:   },
17:   supabase: {
18:     url: 'https://pfxxjtvnqptdvjfakotc.supabase.co',
19:     anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmeHhqdHZucXB0ZHZqZmFrb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzgwNjMsImV4cCI6MjA3ODY1NDA2M30.xADVH2fTd4059lZSZWpIM6CSeiixm0VCgN0SC5bKGxo',
20:     storage: {
21:       documentBucket: 'blueprint-documents'
22:     }
23:   },
24:   providers: [provideMockConfig({ data: MOCKDATA })],
25:   interceptorFns: [mockInterceptor]
26: } as Environment;
````

## File: src/main.ts
````typescript
1: import { bootstrapApplication } from '@angular/platform-browser';
2: 
3: import { AppComponent } from './app/app.component';
4: import { appConfig } from './app/app.config';
5: 
6: bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
````

## File: src/style-icons-auto.ts
````typescript
  1: /*
  2:  * Automatically generated by 'ng g ng-alain:plugin icon'
  3:  * @see https://ng-alain.com/cli/plugin#icon
  4:  */
  5: 
  6: import {
  7:   AlipayCircleOutline,
  8:   ApiOutline,
  9:   AppstoreOutline,
 10:   ArrowDownOutline,
 11:   BookOutline,
 12:   BorderLeftOutline,
 13:   BorderRightOutline,
 14:   CloudOutline,
 15:   CopyrightOutline,
 16:   CustomerServiceOutline,
 17:   DashboardOutline,
 18:   DatabaseOutline,
 19:   DingdingOutline,
 20:   DislikeOutline,
 21:   DownloadOutline,
 22:   ForkOutline,
 23:   FrownOutline,
 24:   FullscreenExitOutline,
 25:   FullscreenOutline,
 26:   GithubOutline,
 27:   GlobalOutline,
 28:   HddOutline,
 29:   LaptopOutline,
 30:   LikeOutline,
 31:   LockOutline,
 32:   LogoutOutline,
 33:   MailOutline,
 34:   MenuFoldOutline,
 35:   MenuUnfoldOutline,
 36:   MessageOutline,
 37:   PayCircleOutline,
 38:   PieChartOutline,
 39:   PrinterOutline,
 40:   RocketOutline,
 41:   ScanOutline,
 42:   SettingOutline,
 43:   ShareAltOutline,
 44:   ShoppingCartOutline,
 45:   SoundOutline,
 46:   StarOutline,
 47:   TaobaoCircleOutline,
 48:   TaobaoOutline,
 49:   TeamOutline,
 50:   ToolOutline,
 51:   TrophyOutline,
 52:   UsbOutline,
 53:   UserOutline,
 54:   WeiboCircleOutline,
 55:   ApartmentOutline,
 56:   SwapOutline,
 57:   PlusOutline,
 58:   ArrowLeftOutline,
 59:   LinkOutline,
 60:   SearchOutline,
 61:   CheckOutline,
 62:   CloseCircleOutline,
 63:   UploadOutline,
 64:   CheckCircleOutline,
 65:   EllipsisOutline,
 66:   ArrowRightOutline,
 67:   InfoCircleOutline,
 68:   CheckSquareOutline,
 69:   EditOutline,
 70:   DeleteOutline,
 71:   SaveOutline,
 72:   FileOutline,
 73:   FileAddOutline,
 74:   FileTextOutline,
 75:   FolderOutline,
 76:   FolderOpenOutline,
 77:   FolderAddOutline,
 78:   UnorderedListOutline,
 79:   OrderedListOutline,
 80:   TableOutline,
 81:   ClockCircleOutline,
 82:   CalendarOutline,
 83:   ScheduleOutline,
 84:   SafetyOutline,
 85:   BellOutline,
 86:   ExclamationCircleOutline,
 87:   WarningOutline,
 88:   MinusCircleOutline,
 89:   ReloadOutline,
 90:   SyncOutline,
 91:   RedoOutline,
 92:   UndoOutline,
 93:   RotateLeftOutline,
 94:   HomeOutline,
 95:   MenuOutline,
 96:   HistoryOutline,
 97:   EyeOutline,
 98:   EyeInvisibleOutline,
 99:   AppstoreOutline as MenuAppOutline,
100:   UserAddOutline,
101:   UserDeleteOutline,
102:   ContactsOutline,
103:   FileExcelOutline,
104:   FilePdfOutline,
105:   FileImageOutline,
106:   SendOutline,
107:   CommentOutline,
108:   FilterOutline,
109:   SortAscendingOutline,
110:   SortDescendingOutline,
111:   ClearOutline,
112:   BarChartOutline,
113:   LineChartOutline,
114:   AreaChartOutline,
115:   WifiOutline,
116:   DisconnectOutline,
117:   UnlockOutline,
118:   GroupOutline,
119:   HeartOutline,
120:   ThunderboltOutline,
121:   BugOutline,
122:   BulbOutline
123: } from '@ant-design/icons-angular/icons';
124: 
125: export const ICONS_AUTO = [
126:   AlipayCircleOutline,
127:   ApiOutline,
128:   AppstoreOutline,
129:   ArrowDownOutline,
130:   BookOutline,
131:   BorderLeftOutline,
132:   BorderRightOutline,
133:   CloudOutline,
134:   CopyrightOutline,
135:   CustomerServiceOutline,
136:   DashboardOutline,
137:   DatabaseOutline,
138:   DingdingOutline,
139:   DislikeOutline,
140:   DownloadOutline,
141:   ForkOutline,
142:   FrownOutline,
143:   FullscreenExitOutline,
144:   FullscreenOutline,
145:   GithubOutline,
146:   GlobalOutline,
147:   HddOutline,
148:   LaptopOutline,
149:   LikeOutline,
150:   LockOutline,
151:   LogoutOutline,
152:   MailOutline,
153:   MenuFoldOutline,
154:   MenuUnfoldOutline,
155:   MessageOutline,
156:   PayCircleOutline,
157:   PieChartOutline,
158:   PrinterOutline,
159:   RocketOutline,
160:   ScanOutline,
161:   SettingOutline,
162:   ShareAltOutline,
163:   ShoppingCartOutline,
164:   SoundOutline,
165:   StarOutline,
166:   TaobaoCircleOutline,
167:   TaobaoOutline,
168:   TeamOutline,
169:   ToolOutline,
170:   TrophyOutline,
171:   UsbOutline,
172:   UserOutline,
173:   WeiboCircleOutline,
174:   ApartmentOutline,
175:   SwapOutline,
176:   PlusOutline,
177:   ArrowLeftOutline,
178:   LinkOutline,
179:   SearchOutline,
180:   CheckOutline,
181:   CloseCircleOutline,
182:   UploadOutline,
183:   CheckCircleOutline,
184:   EllipsisOutline,
185:   ArrowRightOutline,
186:   InfoCircleOutline,
187:   CheckSquareOutline,
188:   EditOutline,
189:   DeleteOutline,
190:   SaveOutline,
191:   FileOutline,
192:   FileAddOutline,
193:   FileTextOutline,
194:   FolderOutline,
195:   FolderOpenOutline,
196:   FolderAddOutline,
197:   UnorderedListOutline,
198:   OrderedListOutline,
199:   TableOutline,
200:   ClockCircleOutline,
201:   CalendarOutline,
202:   ScheduleOutline,
203:   SafetyOutline,
204:   BellOutline,
205:   ExclamationCircleOutline,
206:   WarningOutline,
207:   MinusCircleOutline,
208:   ReloadOutline,
209:   SyncOutline,
210:   RedoOutline,
211:   UndoOutline,
212:   RotateLeftOutline,
213:   HomeOutline,
214:   MenuOutline,
215:   HistoryOutline,
216:   EyeOutline,
217:   EyeInvisibleOutline,
218:   MenuAppOutline,
219:   UserAddOutline,
220:   UserDeleteOutline,
221:   ContactsOutline,
222:   FileExcelOutline,
223:   FilePdfOutline,
224:   FileImageOutline,
225:   SendOutline,
226:   CommentOutline,
227:   FilterOutline,
228:   SortAscendingOutline,
229:   SortDescendingOutline,
230:   ClearOutline,
231:   BarChartOutline,
232:   LineChartOutline,
233:   AreaChartOutline,
234:   WifiOutline,
235:   DisconnectOutline,
236:   UnlockOutline,
237:   GroupOutline,
238:   HeartOutline,
239:   ThunderboltOutline,
240:   BugOutline,
241:   BulbOutline
242: ];
````

## File: src/style-icons.ts
````typescript
 1: // Custom icon static resources
 2: 
 3: import {
 4:   BulbOutline,
 5:   ExceptionOutline,
 6:   InfoOutline,
 7:   LinkOutline,
 8:   MinusSquareOutline,
 9:   PlusSquareOutline,
10:   ProfileOutline
11: } from '@ant-design/icons-angular/icons';
12: 
13: export const ICONS = [InfoOutline, BulbOutline, ProfileOutline, ExceptionOutline, LinkOutline, PlusSquareOutline, MinusSquareOutline];
````

## File: src/typings.d.ts
````typescript
1: // # 3rd Party Library
2: // If the library doesn't have typings available at `@types/`,
3: // you can still use it by manually adding typings for it
````

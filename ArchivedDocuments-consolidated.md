176: ### 2. 測試驗證 ⚠️ 未執行
 2081:  42:    * @param organizationId 组织 ID
 2082:  43:    * @param options 查询选项
 2083:  44:    * @returns Observable<OrganizationSchedule[]>
 2084:  45:    */
 2085:  46:   findByOrganizationId(organizationId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
 2086:  47:     return this.findAll({
 2087:  48:       ...options,
 2088:  49:       filters: {
 2089:  50:         ...options?.filters,
 2090:  51:         organizationId, // 会自动转换为 organization_id
 2091:  52:       },
 2092:  53:     });
 2093:  54:   }
 2094:  55: 
 2095:  56:   /**
 2096:  57:    * 根据蓝图 ID 查询排班列表
 2097:  58:    * 
 2098:  59:    * @param blueprintId 蓝图 ID
 2099:  60:    * @param options 查询选项
 2100:  61:    * @returns Observable<OrganizationSchedule[]>
 2101:  62:    */
 2102:  63:   findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
 2103:  64:     return this.findAll({
 2104:  65:       ...options,
 2105:  66:       filters: {
 2106:  67:         ...options?.filters,
 2107:  68:         blueprintId, // 会自动转换为 blueprint_id
 2108:  69:       },
 2109:  70:     });
 2110:  71:   }
 2111:  72: 
 2112:  73:   /**
 2113:  74:    * 根据分支 ID 查询排班列表
 2114:  75:    * 
 2115:  76:    * @param branchId 分支 ID
 2116:  77:    * @param options 查询选项
 2117:  78:    * @returns Observable<OrganizationSchedule[]>
 2118:  79:    */
 2119:  80:   findByBranchId(branchId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
 2120:  81:     return this.findAll({
 2121:  82:       ...options,
 2122:  83:       filters: {
 2123:  84:         ...options?.filters,
 2124:  85:         branchId, // 会自动转换为 branch_id
 2125:  86:       },
 2126:  87:     });
 2127:  88:   }
 2128:  89: 
 2129:  90:   /**
 2130:  91:    * 根据账户 ID 查询排班列表
 2131:  92:    * 
 2132:  93:    * @param accountId 账户 ID
 2133:  94:    * @param options 查询选项
 2134:  95:    * @returns Observable<OrganizationSchedule[]>
 2135:  96:    */
 2136:  97:   findByAccountId(accountId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
 2137:  98:     return this.findAll({
 2138:  99:       ...options,
 2139: 100:       filters: {
 2140: 101:         ...options?.filters,
 2141: 102:         accountId, // 会自动转换为 account_id
 2142: 103:       },
 2143: 104:     });
 2144: 105:   }
 2145: 106: 
 2146: 107:   /**
 2147: 108:    * 根据团队 ID 查询排班列表
 2148: 109:    * 
 2149: 110:    * @param teamId 团队 ID
 2150: 111:    * @param options 查询选项
 2151: 112:    * @returns Observable<OrganizationSchedule[]>
 2152: 113:    */
 2153: 114:   findByTeamId(teamId: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
 2154: 115:     return this.findAll({
 2155: 116:       ...options,
 2156: 117:       filters: {
 2157: 118:         ...options?.filters,
 2158: 119:         teamId, // 会自动转换为 team_id
 2159: 120:       },
 2160: 121:     });
 2161: 122:   }
 2162: 123: 
 2163: 124:   /**
 2164: 125:    * 根据日期范围查询排班列表
 2165: 126:    * 
 2166: 127:    * @param startDate 开始日期
 2167: 128:    * @param endDate 结束日期
 2168: 129:    * @param options 查询选项
 2169: 130:    * @returns Observable<OrganizationSchedule[]>
 2170: 131:    */
 2171: 132:   findByDateRange(startDate: string, endDate: string, options?: QueryOptions): Observable<OrganizationSchedule[]> {
 2172: 133:     // 注意：这里需要根据实际的 BaseRepository 实现来调整
 2173: 134:     // 如果 BaseRepository 支持范围查询，可以使用 filters
 2174: 135:     // 否则可能需要使用自定义查询
 2175: 136:     return this.findAll({
 2176: 137:       ...options,
 2177: 138:       filters: {
 2178: 139:         ...options?.filters,
 2179: 140:         // 日期范围查询可能需要特殊处理
 2180: 141:         // 这里假设 BaseRepository 支持 gte/lte 操作符
 2181: 142:       },
 2182: 143:     });
 2183: 144:   }
 2184: 145: }
 2185: ````
 2186: 
 2187: ## File: src/app/core/infra/repositories/pull-request.repository.ts
 2188: ````typescript
 2189:   1: import { Injectable } from '@angular/core';
 2190:   2: import { Observable } from 'rxjs';
 2191:   3: import { BaseRepository, QueryOptions } from './base.repository';
 2192:   4: import { Database } from '../types/database.types';
 2193:   5: import { PRStatus } from '../types/blueprint.types';
 2194:   6: 
 2195:   7: /**
 2196:   8:  * 从数据库类型中提取原始类型（snake_case）
 2197:   9:  */
 2198:  10: type PullRequestRow = Database['public']['Tables']['pull_requests']['Row'];
 2199:  11: type PullRequestInsert = Database['public']['Tables']['pull_requests']['Insert'];
 2200:  12: type PullRequestUpdate = Database['public']['Tables']['pull_requests']['Update'];
 2201:  13: 
 2202:  14: /**
 2203:  15:  * PullRequest 实体类型（camelCase）
 2204:  16:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 2205:  17:  */
 2206:  18: export type PullRequest = PullRequestRow;
 2207:  19: export type { PullRequestInsert, PullRequestUpdate };
 2208:  20: 
 2209:  21: /**
 2210:  22:  * PullRequest Repository
 2211:  23:  * 
 2212:  24:  * 提供 Pull Request 相关的数据访问方法
 2213:  25:  * 
 2214:  26:  * @example
 2215:  27:  * ```typescript
 2216:  28:  * const prRepo = inject(PullRequestRepository);
 2217:  29:  * prRepo.findByBlueprintId('blueprint-id').subscribe(prs => {
 2218:  30:  *   console.log('Pull Requests:', prs);
 2219:  31:  * });
 2220:  32:  * ```
 2221:  33:  */
 2222:  34: @Injectable({
 2223:  35:   providedIn: 'root'
 2224:  36: })
 2225:  37: export class PullRequestRepository extends BaseRepository<PullRequest, PullRequestInsert, PullRequestUpdate> {
 2226:  38:   protected tableName = 'pull_requests';
 2227:  39: 
 2228:  40:   /**
 2229:  41:    * 根据蓝图 ID 查询 Pull Request 列表
 2230:  42:    * 
 2231:  43:    * @param blueprintId 蓝图 ID
 2232:  44:    * @param options 查询选项
 2233:  45:    * @returns Observable<PullRequest[]>
 2234:  46:    */
 2235:  47:   findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<PullRequest[]> {
 2236:  48:     return this.findAll({
 2237:  49:       ...options,
 2238:  50:       filters: {
 2239:  51:         ...options?.filters,
 2240:  52:         blueprintId, // 会自动转换为 blueprint_id
 2241:  53:       },
 2242:  54:     });
 2243:  55:   }
 2244:  56: 
 2245:  57:   /**
 2246:  58:    * 根据分支 ID 查询 Pull Request 列表
 2247:  59:    * 
 2248:  60:    * @param branchId 分支 ID
 2249:  61:    * @param options 查询选项
 2250:  62:    * @returns Observable<PullRequest[]>
 2251:  63:    */
 2252:  64:   findByBranchId(branchId: string, options?: QueryOptions): Observable<PullRequest[]> {
 2253:  65:     return this.findAll({
 2254:  66:       ...options,
 2255:  67:       filters: {
 2256:  68:         ...options?.filters,
 2257:  69:         branchId, // 会自动转换为 branch_id
 2258:  70:       },
 2259:  71:     });
 2260:  72:   }
 2261:  73: 
 2262:  74:   /**
 2263:  75:    * 根据状态查询 Pull Request 列表
 2264:  76:    * 
 2265:  77:    * @param status PR 状态
 2266:  78:    * @param options 查询选项
 2267:  79:    * @returns Observable<PullRequest[]>
 2268:  80:    */
 2269:  81:   findByStatus(status: PRStatus, options?: QueryOptions): Observable<PullRequest[]> {
 2270:  82:     return this.findAll({
 2271:  83:       ...options,
 2272:  84:       filters: {
 2273:  85:         ...options?.filters,
 2274:  86:         status,
 2275:  87:       },
 2276:  88:     });
 2277:  89:   }
 2278:  90: 
 2279:  91:   /**
 2280:  92:    * 查询打开的 Pull Request 列表
 2281:  93:    * 
 2282:  94:    * @param options 查询选项
 2283:  95:    * @returns Observable<PullRequest[]>
 2284:  96:    */
 2285:  97:   findOpen(options?: QueryOptions): Observable<PullRequest[]> {
 2286:  98:     return this.findByStatus(PRStatus.OPEN, options);
 2287:  99:   }
 2288: 100: 
 2289: 101:   /**
 2290: 102:    * 查询审核中的 Pull Request 列表
 2291: 103:    * 
 2292: 104:    * @param options 查询选项
 2293: 105:    * @returns Observable<PullRequest[]>
 2294: 106:    */
 2295: 107:   findReviewing(options?: QueryOptions): Observable<PullRequest[]> {
 2296: 108:     return this.findByStatus(PRStatus.REVIEWING, options);
 2297: 109:   }
 2298: 110: 
 2299: 111:   /**
 2300: 112:    * 查询已合并的 Pull Request 列表
 2301: 113:    * 
 2302: 114:    * @param options 查询选项
 2303: 115:    * @returns Observable<PullRequest[]>
 2304: 116:    */
 2305: 117:   findMerged(options?: QueryOptions): Observable<PullRequest[]> {
 2306: 118:     return this.findByStatus(PRStatus.MERGED, options);
 2307: 119:   }
 2308: 120: 
 2309: 121:   /**
 2310: 122:    * 根据提交者 ID 查询 Pull Request 列表
 2311: 123:    * 
 2312: 124:    * @param submittedBy 提交者 ID
 2313: 125:    * @param options 查询选项
 2314: 126:    * @returns Observable<PullRequest[]>
 2315: 127:    */
 2316: 128:   findBySubmittedBy(submittedBy: string, options?: QueryOptions): Observable<PullRequest[]> {
 2317: 129:     return this.findAll({
 2318: 130:       ...options,
 2319: 131:       filters: {
 2320: 132:         ...options?.filters,
 2321: 133:         submittedBy, // 会自动转换为 submitted_by
 2322: 134:       },
 2323: 135:     });
 2324: 136:   }
 2325: 137: 
 2326: 138:   /**
 2327: 139:    * 根据审核者 ID 查询 Pull Request 列表
 2328: 140:    * 
 2329: 141:    * @param reviewedBy 审核者 ID
 2330: 142:    * @param options 查询选项
 2331: 143:    * @returns Observable<PullRequest[]>
 2332: 144:    */
 2333: 145:   findByReviewedBy(reviewedBy: string, options?: QueryOptions): Observable<PullRequest[]> {
 2334: 146:     return this.findAll({
 2335: 147:       ...options,
 2336: 148:       filters: {
 2337: 149:         ...options?.filters,
 2338: 150:         reviewedBy, // 会自动转换为 reviewed_by
 2339: 151:       },
 2340: 152:     });
 2341: 153:   }
 2342: 154: }
 2343: ````
 2344: 
 2345: ## File: src/app/core/infra/repositories/team-member.repository.ts
 2346: ````typescript
 2347:   1: import { Injectable } from '@angular/core';
 2348:   2: import { Observable } from 'rxjs';
 2349:   3: import { BaseRepository, QueryOptions } from './base.repository';
 2350:   4: import { Database } from '../types/database.types';
 2351:   5: import { TeamMemberRole } from '../types/account.types';
 2352:   6: 
 2353:   7: /**
 2354:   8:  * 从数据库类型中提取原始类型（snake_case）
 2355:   9:  */
 2356:  10: type TeamMemberRow = Database['public']['Tables']['team_members']['Row'];
 2357:  11: type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert'];
 2358:  12: type TeamMemberUpdate = Database['public']['Tables']['team_members']['Update'];
 2359:  13: 
 2360:  14: /**
 2361:  15:  * TeamMember 实体类型（camelCase）
 2362:  16:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 2363:  17:  */
 2364:  18: export type TeamMember = TeamMemberRow;
 2365:  19: export type { TeamMemberInsert, TeamMemberUpdate };
 2366:  20: 
 2367:  21: /**
 2368:  22:  * TeamMember Repository
 2369:  23:  * 
 2370:  24:  * 提供团队成员相关的数据访问方法
 2371:  25:  * 
 2372:  26:  * @example
 2373:  27:  * ```typescript
 2374:  28:  * const teamMemberRepo = inject(TeamMemberRepository);
 2375:  29:  * teamMemberRepo.findByTeamId('team-id').subscribe(members => {
 2376:  30:  *   console.log('Team members:', members);
 2377:  31:  * });
 2378:  32:  * ```
 2379:  33:  */
 2380:  34: @Injectable({
 2381:  35:   providedIn: 'root'
 2382:  36: })
 2383:  37: export class TeamMemberRepository extends BaseRepository<TeamMember, TeamMemberInsert, TeamMemberUpdate> {
 2384:  38:   protected tableName = 'team_members';
 2385:  39: 
 2386:  40:   /**
 2387:  41:    * 根据团队 ID 查询团队成员列表
 2388:  42:    * 
 2389:  43:    * @param teamId 团队 ID
 2390:  44:    * @param options 查询选项
 2391:  45:    * @returns Observable<TeamMember[]>
 2392:  46:    */
 2393:  47:   findByTeamId(teamId: string, options?: QueryOptions): Observable<TeamMember[]> {
 2394:  48:     return this.findAll({
 2395:  49:       ...options,
 2396:  50:       filters: {
 2397:  51:         ...options?.filters,
 2398:  52:         teamId, // 会自动转换为 team_id
 2399:  53:       },
 2400:  54:     });
 2401:  55:   }
 2402:  56: 
 2403:  57:   /**
 2404:  58:    * 根据账户 ID 查询团队成员关系
 2405:  59:    * 
 2406:  60:    * @param accountId 账户 ID
 2407:  61:    * @param options 查询选项
 2408:  62:    * @returns Observable<TeamMember[]>
 2409:  63:    */
 2410:  64:   findByAccountId(accountId: string, options?: QueryOptions): Observable<TeamMember[]> {
 2411:  65:     return this.findAll({
 2412:  66:       ...options,
 2413:  67:       filters: {
 2414:  68:         ...options?.filters,
 2415:  69:         accountId, // 会自动转换为 account_id
 2416:  70:       },
 2417:  71:     });
 2418:  72:   }
 2419:  73: 
 2420:  74:   /**
 2421:  75:    * 根据角色查询团队成员
 2422:  76:    * 
 2423:  77:    * @param role 成员角色
 2424:  78:    * @param options 查询选项
 2425:  79:    * @returns Observable<TeamMember[]>
 2426:  80:    */
 2427:  81:   findByRole(role: TeamMemberRole, options?: QueryOptions): Observable<TeamMember[]> {
 2428:  82:     return this.findAll({
 2429:  83:       ...options,
 2430:  84:       filters: {
 2431:  85:         ...options?.filters,
 2432:  86:         role,
 2433:  87:       },
 2434:  88:     });
 2435:  89:   }
 2436:  90: 
 2437:  91:   /**
 2438:  92:    * 查询团队中的负责人（leader）
 2439:  93:    * 
 2440:  94:    * @param teamId 团队 ID
 2441:  95:    * @returns Observable<TeamMember[]>
 2442:  96:    */
 2443:  97:   findLeadersByTeamId(teamId: string): Observable<TeamMember[]> {
 2444:  98:     return this.findAll({
 2445:  99:       filters: {
 2446: 100:         teamId, // 会自动转换为 team_id
 2447: 101:         role: TeamMemberRole.LEADER,
 2448: 102:       },
 2449: 103:     });
 2450: 104:   }
 2451: 105: }
 2452: ````
 2453: 
 2454: ## File: src/app/core/infra/repositories/team.repository.ts
 2455: ````typescript
 2456:  1: import { Injectable } from '@angular/core';
 2457:  2: import { Observable } from 'rxjs';
 2458:  3: import { BaseRepository, QueryOptions } from './base.repository';
 2459:  4: import { Database } from '../types/database.types';
 2460:  5: 
 2461:  6: /**
 2462:  7:  * 从数据库类型中提取原始类型（snake_case）
 2463:  8:  */
 2464:  9: type TeamRow = Database['public']['Tables']['teams']['Row'];
 2465: 10: type TeamInsert = Database['public']['Tables']['teams']['Insert'];
 2466: 11: type TeamUpdate = Database['public']['Tables']['teams']['Update'];
 2467: 12: 
 2468: 13: /**
 2469: 14:  * Team 实体类型（camelCase）
 2470: 15:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
 2471: 16:  */
 2472: 17: export type Team = TeamRow;
 2473: 18: export type { TeamInsert, TeamUpdate };
 2474: 19: 
 2475: 20: /**
 2476: 21:  * Team Repository
 2477: 22:  * 
 2478: 23:  * 提供团队相关的数据访问方法
 2479: 24:  * 
 2480: 25:  * @example
 2481: 26:  * ```typescript
 2482: 27:  * const teamRepo = inject(TeamRepository);
 2483: 28:  * teamRepo.findByOrganizationId('org-id').subscribe(teams => {
 2484: 29:  *   console.log('Organization teams:', teams);
 2485: 30:  * });
 2486: 31:  * ```
 2487: 32:  */
 2488: 33: @Injectable({
 2489: 34:   providedIn: 'root'
 2490: 35: })
 2491: 36: export class TeamRepository extends BaseRepository<Team, TeamInsert, TeamUpdate> {
 2492: 37:   protected tableName = 'teams';
 2493: 38: 
 2494: 39:   /**
 2495: 40:    * 根据组织 ID 查询团队列表
 2496: 41:    * 
 2497: 42:    * @param organizationId 组织 ID
 2498: 43:    * @param options 查询选项
 2499: 44:    * @returns Observable<Team[]>
 2500: 45:    */
 2501: 46:   findByOrganizationId(organizationId: string, options?: QueryOptions): Observable<Team[]> {
 2502: 47:     return this.findAll({
 2503: 48:       ...options,
 2504: 49:       filters: {
 2505: 50:         ...options?.filters,
 2506: 51:         organizationId, // 会自动转换为 organization_id
 2507: 52:       },
 2508: 53:     });
 2509: 54:   }
 2510: 55: 
 2511: 56:   /**
 2512: 57:    * 根据创建者 ID 查询团队列表
 2513: 58:    * 
 2514: 59:    * @param createdBy 创建者 ID
 2515: 60:    * @param options 查询选项
 2516: 61:    * @returns Observable<Team[]>
 2517: 62:    */
 2518: 63:   findByCreatedBy(createdBy: string, options?: QueryOptions): Observable<Team[]> {
 2519: 64:     return this.findAll({
 2520: 65:       ...options,
 2521: 66:       filters: {
 2522: 67:         ...options?.filters,
 2523: 68:         createdBy, // 会自动转换为 created_by
 2524: 69:       },
 2525: 70:     });
 2526: 71:   }
 2527: 72: }
 2528: ````
 2529: 
 2530: ## File: src/app/core/infra/types/account.types.ts
 2531: ````typescript
 2532:  1: /**
 2533:  2:  * 账户相关类型定义（基础设施层）
 2534:  3:  * 
 2535:  4:  * 这些类型被 Repository 层使用，因此放在 core 层
 2536:  5:  * 符合分层架构：core 不依赖 shared
 2537:  6:  * 
 2538:  7:  * @module core/infra/types
 2539:  8:  */
 2540:  9: 
 2541: 10: /**
 2542: 11:  * 账户类型枚举
 2543: 12:  * 对应数据库 accounts.type 字段
 2544: 13:  */
 2545: 14: export enum AccountType {
 2546: 15:   /** 用户账户 */
 2547: 16:   USER = 'User',
 2548: 17:   /** 机器人账户 */
 2549: 18:   BOT = 'Bot',
 2550: 19:   /** 组织账户 */
 2551: 20:   ORGANIZATION = 'Organization'
 2552: 21: }
 2553: 22: 
 2554: 23: /**
 2555: 24:  * 账户状态枚举
 2556: 25:  * 对应数据库 accounts.status 字段
 2557: 26:  */
 2558: 27: export enum AccountStatus {
 2559: 28:   /** 活跃 */
 2560: 29:   ACTIVE = 'active',
 2561: 30:   /** 非活跃 */
 2562: 31:   INACTIVE = 'inactive',
 2563: 32:   /** 已暂停 */
 2564: 33:   SUSPENDED = 'suspended'
 2565: 34: }
 2566: 35: 
 2567: 36: /**
 2568: 37:  * 团队成员角色枚举
 2569: 38:  * 对应数据库 team_members.role 字段
 2570: 39:  */
 2571: 40: export enum TeamMemberRole {
 2572: 41:   /** 团队负责人 */
 2573: 42:   LEADER = 'leader',
 2574: 43:   /** 团队成员 */
 2575: 44:   MEMBER = 'member'
 2576: 45: }
 2577: ````
 2578: 
 2579: ## File: src/app/core/infra/types/blueprint.types.ts
 2580: ````typescript
 2581:  1: /**
 2582:  2:  * 蓝图系统相关类型定义（基础设施层）
 2583:  3:  * 
 2584:  4:  * 这些类型被 Repository 层使用，因此放在 core 层
 2585:  5:  * 符合分层架构：core 不依赖 shared
 2586:  6:  * 
 2587:  7:  * @module core/infra/types
 2588:  8:  */
 2589:  9: 
 2590: 10: /**
 2591: 11:  * 蓝图状态枚举
 2592: 12:  * 对应数据库 blueprints.status 字段
 2593: 13:  */
 2594: 14: export enum BlueprintStatus {
 2595: 15:   /** 规划中 */
 2596: 16:   PLANNING = 'planning',
 2597: 17:   /** 进行中 */
 2598: 18:   ACTIVE = 'active',
 2599: 19:   /** 暂停 */
 2600: 20:   ON_HOLD = 'on_hold',
 2601: 21:   /** 已完成 */
 2602: 22:   COMPLETED = 'completed',
 2603: 23:   /** 已归档 */
 2604: 24:   ARCHIVED = 'archived'
 2605: 25: }
 2606: 26: 
 2607: 27: /**
 2608: 28:  * 分支类型枚举
 2609: 29:  * 对应数据库 blueprint_branches.branch_type 字段
 2610: 30:  */
 2611: 31: export enum BranchType {
 2612: 32:   /** 承揽商 */
 2613: 33:   CONTRACTOR = 'contractor',
 2614: 34:   /** 分包商 */
 2615: 35:   SUBCONTRACTOR = 'subcontractor',
 2616: 36:   /** 顾问 */
 2617: 37:   CONSULTANT = 'consultant'
 2618: 38: }
 2619: 39: 
 2620: 40: /**
 2621: 41:  * 分支状态枚举
 2622: 42:  * 对应数据库 blueprint_branches.status 字段
 2623: 43:  */
 2624: 44: export enum BranchStatus {
 2625: 45:   /** 活跃 */
 2626: 46:   ACTIVE = 'active',
 2627: 47:   /** 已合并 */
 2628: 48:   MERGED = 'merged',
 2629: 49:   /** 已关闭 */
 2630: 50:   CLOSED = 'closed'
 2631: 51: }
 2632: 52: 
 2633: 53: /**
 2634: 54:  * Pull Request 状态枚举
 2635: 55:  * 对应数据库 pull_requests.status 字段
 2636: 56:  */
 2637: 57: export enum PRStatus {
 2638: 58:   /** 打开 */
 2639: 59:   OPEN = 'open',
 2640: 60:   /** 审核中 */
 2641: 61:   REVIEWING = 'reviewing',
 2642: 62:   /** 已批准 */
 2643: 63:   APPROVED = 'approved',
 2644: 64:   /** 已拒绝 */
 2645: 65:   REJECTED = 'rejected',
 2646: 66:   /** 已合并 */
 2647: 67:   MERGED = 'merged',
 2648: 68:   /** 已关闭 */
 2649: 69:   CLOSED = 'closed'
 2650: 70: }
 2651: ````
 2652: 
 2653: ## File: src/app/core/infra/types/collaboration.types.ts
 2654: ````typescript
 2655:  1: /**
 2656:  2:  * 组织协作相关类型定义（基础设施层）
 2657:  3:  * 
 2658:  4:  * 这些类型被 Repository 层使用，因此放在 core 层
 2659:  5:  * 符合分层架构：core 不依赖 shared
 2660:  6:  * 
 2661:  7:  * @module core/infra/types
 2662:  8:  */
 2663:  9: 
 2664: 10: /**
 2665: 11:  * 协作类型枚举
 2666: 12:  * 对应数据库 organization_collaborations.collaboration_type 字段
 2667: 13:  */
 2668: 14: export enum CollaborationType {
 2669: 15:   /** 承揽商 */
 2670: 16:   CONTRACTOR = 'contractor',
 2671: 17:   /** 次承揽商 */
 2672: 18:   SUBCONTRACTOR = 'subcontractor',
 2673: 19:   /** 顾问 */
 2674: 20:   CONSULTANT = 'consultant',
 2675: 21:   /** 合作伙伴 */
 2676: 22:   PARTNER = 'partner'
 2677: 23: }
 2678: 24: 
 2679: 25: /**
 2680: 26:  * 协作状态枚举
 2681: 27:  * 对应数据库 organization_collaborations.status 字段
 2682: 28:  */
 2683: 29: export enum CollaborationStatus {
 2684: 30:   /** 待处理 */
 2685: 31:   PENDING = 'pending',
 2686: 32:   /** 活跃 */
 2687: 33:   ACTIVE = 'active',
 2688: 34:   /** 已暂停 */
 2689: 35:   SUSPENDED = 'suspended',
 2690: 36:   /** 已结束 */
 2691: 37:   ENDED = 'ended'
 2692: 38: }
 2693: 39: 
 2694: 40: /**
 2695: 41:  * 邀请状态枚举
 2696: 42:  * 对应数据库 collaboration_invitations.status 字段
 2697: 43:  */
 2698: 44: export enum InvitationStatus {
 2699: 45:   /** 待处理 */
 2700: 46:   PENDING = 'pending',
 2701: 47:   /** 已接受 */
 2702: 48:   ACCEPTED = 'accepted',
 2703: 49:   /** 已拒绝 */
 2704: 50:   REJECTED = 'rejected',
 2705: 51:   /** 已过期 */
 2706: 52:   EXPIRED = 'expired'
 2707: 53: }
 2708: ````
 2709: 
 2710: ## File: src/app/core/infra/types/database.types.ts
 2711: ````typescript
 2712:    1: export type Json =
 2713:    2:   | string
 2714:    3:   | number
 2715:    4:   | boolean
 2716:    5:   | null
 2717:    6:   | { [key: string]: Json | undefined }
 2718:    7:   | Json[]
 2719:    8: 
 2720:    9: export type Database = {
 2721:   10:   // Allows to automatically instantiate createClient with right options
 2722:   11:   // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
 2723:   12:   __InternalSupabase: {
 2724:   13:     PostgrestVersion: "13.0.5"
 2725:   14:   }
 2726:   15:   public: {
 2727:   16:     Tables: {
 2728:   17:       accounts: {
 2729:   18:         Row: {
 2730:   19:           auth_user_id: string | null
 2731:   20:           avatar_url: string | null
 2732:   21:           created_at: string | null
 2733:   22:           email: string | null
 2734:   23:           id: string
 2735:   24:           metadata: Json | null
 2736:   25:           name: string
 2737:   26:           status: string | null
 2738:   27:           type: string
 2739:   28:           updated_at: string | null
 2740:   29:         }
 2741:   30:         Insert: {
 2742:   31:           auth_user_id?: string | null
 2743:   32:           avatar_url?: string | null
 2744:   33:           created_at?: string | null
 2745:   34:           email?: string | null
 2746:   35:           id?: string
 2747:   36:           metadata?: Json | null
 2748:   37:           name: string
 2749:   38:           status?: string | null
 2750:   39:           type: string
 2751:   40:           updated_at?: string | null
 2752:   41:         }
 2753:   42:         Update: {
 2754:   43:           auth_user_id?: string | null
 2755:   44:           avatar_url?: string | null
 2756:   45:           created_at?: string | null
 2757:   46:           email?: string | null
 2758:   47:           id?: string
 2759:   48:           metadata?: Json | null
 2760:   49:           name?: string
 2761:   50:           status?: string | null
 2762:   51:           type?: string
 2763:   52:           updated_at?: string | null
 2764:   53:         }
 2765:   54:         Relationships: []
 2766:   55:       }
 2767:   56:       activity_logs: {
 2768:   57:         Row: {
 2769:   58:           action: string
 2770:   59:           action_details: Json | null
 2771:   60:           actor_id: string
 2772:   61:           blueprint_id: string
 2773:   62:           branch_id: string | null
 2774:   63:           created_at: string | null
 2775:   64:           id: string
 2776:   65:           ip_address: unknown
 2777:   66:           resource_id: string | null
 2778:   67:           resource_type: string
 2779:   68:           user_agent: string | null
 2780:   69:         }
 2781:   70:         Insert: {
 2782:   71:           action: string
 2783:   72:           action_details?: Json | null
 2784:   73:           actor_id: string
 2785:   74:           blueprint_id: string
 2786:   75:           branch_id?: string | null
 2787:   76:           created_at?: string | null
 2788:   77:           id?: string
 2789:   78:           ip_address?: unknown
 2790:   79:           resource_id?: string | null
 2791:   80:           resource_type: string
 2792:   81:           user_agent?: string | null
 2793:   82:         }
 2794:   83:         Update: {
 2795:   84:           action?: string
 2796:   85:           action_details?: Json | null
 2797:   86:           actor_id?: string
 2798:   87:           blueprint_id?: string
 2799:   88:           branch_id?: string | null
 2800:   89:           created_at?: string | null
 2801:   90:           id?: string
 2802:   91:           ip_address?: unknown
 2803:   92:           resource_id?: string | null
 2804:   93:           resource_type?: string
 2805:   94:           user_agent?: string | null
 2806:   95:         }
 2807:   96:         Relationships: [
 2808:   97:           {
 2809:   98:             foreignKeyName: "activity_logs_actor_id_fkey"
 2810:   99:             columns: ["actor_id"]
 2811:  100:             isOneToOne: false
 2812:  101:             referencedRelation: "accounts"
 2813:  102:             referencedColumns: ["id"]
 2814:  103:           },
 2815:  104:           {
 2816:  105:             foreignKeyName: "activity_logs_blueprint_id_fkey"
 2817:  106:             columns: ["blueprint_id"]
 2818:  107:             isOneToOne: false
 2819:  108:             referencedRelation: "blueprints"
 2820:  109:             referencedColumns: ["id"]
 2821:  110:           },
 2822:  111:           {
 2823:  112:             foreignKeyName: "activity_logs_branch_id_fkey"
 2824:  113:             columns: ["branch_id"]
 2825:  114:             isOneToOne: false
 2826:  115:             referencedRelation: "blueprint_branches"
 2827:  116:             referencedColumns: ["id"]
 2828:  117:           },
 2829:  118:         ]
 2830:  119:       }
 2831:  120:       analytics_cache: {
 2832:  121:         Row: {
 2833:  122:           aggregation_level: string | null
 2834:  123:           blueprint_id: string | null
 2835:  124:           branch_id: string | null
 2836:  125:           cache_key: string
 2837:  126:           cache_type: string
 2838:  127:           data: Json
 2839:  128:           expires_at: string
 2840:  129:           generated_at: string | null
 2841:  130:           id: string
 2842:  131:         }
 2843:  132:         Insert: {
 2844:  133:           aggregation_level?: string | null
 2845:  134:           blueprint_id?: string | null
 2846:  135:           branch_id?: string | null
 2847:  136:           cache_key: string
 2848:  137:           cache_type: string
 2849:  138:           data: Json
 2850:  139:           expires_at: string
 2851:  140:           generated_at?: string | null
 2852:  141:           id?: string
 2853:  142:         }
 2854:  143:         Update: {
 2855:  144:           aggregation_level?: string | null
 2856:  145:           blueprint_id?: string | null
 2857:  146:           branch_id?: string | null
 2858:  147:           cache_key?: string
 2859:  148:           cache_type?: string
 2860:  149:           data?: Json
 2861:  150:           expires_at?: string
 2862:  151:           generated_at?: string | null
 2863:  152:           id?: string
 2864:  153:         }
 2865:  154:         Relationships: [
 2866:  155:           {
 2867:  156:             foreignKeyName: "analytics_cache_blueprint_id_fkey"
 2868:  157:             columns: ["blueprint_id"]
 2869:  158:             isOneToOne: false
 2870:  159:             referencedRelation: "blueprints"
 2871:  160:             referencedColumns: ["id"]
 2872:  161:           },
 2873:  162:           {
 2874:  163:             foreignKeyName: "analytics_cache_branch_id_fkey"
 2875:  164:             columns: ["branch_id"]
 2876:  165:             isOneToOne: false
 2877:  166:             referencedRelation: "blueprint_branches"
 2878:  167:             referencedColumns: ["id"]
 2879:  168:           },
 2880:  169:         ]
 2881:  170:       }
 2882:  171:       blueprint_branches: {
 2883:  172:         Row: {
 2884:  173:           blueprint_id: string
 2885:  174:           branch_name: string
 2886:  175:           branch_type: string | null
 2887:  176:           forked_at: string | null
 2888:  177:           id: string
 2889:  178:           last_sync_at: string | null
 2890:  179:           notes: string | null
 2891:  180:           organization_id: string
 2892:  181:           status: string | null
 2893:  182:         }
 2894:  183:         Insert: {
 2895:  184:           blueprint_id: string
 2896:  185:           branch_name: string
 2897:  186:           branch_type?: string | null
 2898:  187:           forked_at?: string | null
 2899:  188:           id?: string
 2900:  189:           last_sync_at?: string | null
 2901:  190:           notes?: string | null
 2902:  191:           organization_id: string
 2903:  192:           status?: string | null
 2904:  193:         }
 2905:  194:         Update: {
 2906:  195:           blueprint_id?: string
 2907:  196:           branch_name?: string
 2908:  197:           branch_type?: string | null
 2909:  198:           forked_at?: string | null
 2910:  199:           id?: string
 2911:  200:           last_sync_at?: string | null
 2912:  201:           notes?: string | null
 2913:  202:           organization_id?: string
 2914:  203:           status?: string | null
 2915:  204:         }
 2916:  205:         Relationships: [
 2917:  206:           {
 2918:  207:             foreignKeyName: "blueprint_branches_blueprint_id_fkey"
 2919:  208:             columns: ["blueprint_id"]
 2920:  209:             isOneToOne: false
 2921:  210:             referencedRelation: "blueprints"
 2922:  211:             referencedColumns: ["id"]
 2923:  212:           },
 2924:  213:           {
 2925:  214:             foreignKeyName: "blueprint_branches_organization_id_fkey"
 2926:  215:             columns: ["organization_id"]
 2927:  216:             isOneToOne: false
 2928:  217:             referencedRelation: "accounts"
 2929:  218:             referencedColumns: ["id"]
 2930:  219:           },
 2931:  220:         ]
 2932:  221:       }
 2933:  222:       blueprint_configs: {
 2934:  223:         Row: {
 2935:  224:           blueprint_id: string
 2936:  225:           config_key: string
 2937:  226:           config_value: Json
 2938:  227:           id: string
 2939:  228:           updated_at: string | null
 2940:  229:           updated_by: string | null
 2941:  230:         }
 2942:  231:         Insert: {
 2943:  232:           blueprint_id: string
 2944:  233:           config_key: string
 2945:  234:           config_value: Json
 2946:  235:           id?: string
 2947:  236:           updated_at?: string | null
 2948:  237:           updated_by?: string | null
 2949:  238:         }
 2950:  239:         Update: {
 2951:  240:           blueprint_id?: string
 2952:  241:           config_key?: string
 2953:  242:           config_value?: Json
 2954:  243:           id?: string
 2955:  244:           updated_at?: string | null
 2956:  245:           updated_by?: string | null
 2957:  246:         }
 2958:  247:         Relationships: [
 2959:  248:           {
 2960:  249:             foreignKeyName: "blueprint_configs_blueprint_id_fkey"
 2961:  250:             columns: ["blueprint_id"]
 2962:  251:             isOneToOne: false
 2963:  252:             referencedRelation: "blueprints"
 2964:  253:             referencedColumns: ["id"]
 2965:  254:           },
 2966:  255:           {
 2967:  256:             foreignKeyName: "blueprint_configs_updated_by_fkey"
 2968:  257:             columns: ["updated_by"]
 2969:  258:             isOneToOne: false
 2970:  259:             referencedRelation: "accounts"
 2971:  260:             referencedColumns: ["id"]
 2972:  261:           },
 2973:  262:         ]
 2974:  263:       }
 2975:  264:       blueprints: {
 2976:  265:         Row: {
 2977:  266:           budget: number | null
 2978:  267:           created_at: string | null
 2979:  268:           description: string | null
 2980:  269:           end_date: string | null
 2981:  270:           id: string
 2982:  271:           location: string | null
 2983:  272:           metadata: Json | null
 2984:  273:           name: string
 2985:  274:           owner_id: string
 2986:  275:           project_code: string | null
 2987:  276:           start_date: string | null
 2988:  277:           status: string | null
 2989:  278:           updated_at: string | null
 2990:  279:         }
 2991:  280:         Insert: {
 2992:  281:           budget?: number | null
 2993:  282:           created_at?: string | null
 2994:  283:           description?: string | null
 2995:  284:           end_date?: string | null
 2996:  285:           id?: string
 2997:  286:           location?: string | null
 2998:  287:           metadata?: Json | null
 2999:  288:           name: string
 3000:  289:           owner_id: string
 3001:  290:           project_code?: string | null
 3002:  291:           start_date?: string | null
 3003:  292:           status?: string | null
 3004:  293:           updated_at?: string | null
 3005:  294:         }
 3006:  295:         Update: {
 3007:  296:           budget?: number | null
 3008:  297:           created_at?: string | null
 3009:  298:           description?: string | null
 3010:  299:           end_date?: string | null
 3011:  300:           id?: string
 3012:  301:           location?: string | null
 3013:  302:           metadata?: Json | null
 3014:  303:           name?: string
 3015:  304:           owner_id?: string
 3016:  305:           project_code?: string | null
 3017:  306:           start_date?: string | null
 3018:  307:           status?: string | null
 3019:  308:           updated_at?: string | null
 3020:  309:         }
 3021:  310:         Relationships: [
 3022:  311:           {
 3023:  312:             foreignKeyName: "blueprints_owner_id_fkey"
 3024:  313:             columns: ["owner_id"]
 3025:  314:             isOneToOne: false
 3026:  315:             referencedRelation: "accounts"
 3027:  316:             referencedColumns: ["id"]
 3028:  317:           },
 3029:  318:         ]
 3030:  319:       }
 3031:  320:       bot_execution_logs: {
 3032:  321:         Row: {
 3033:  322:           bot_id: string
 3034:  323:           bot_task_id: string | null
 3035:  324:           error_logs: Json | null
 3036:  325:           executed_at: string | null
 3037:  326:           execution_details: Json | null
 3038:  327:           execution_duration_ms: number | null
 3039:  328:           execution_status: string
 3040:  329:           id: string
 3041:  330:           items_failed: number | null
 3042:  331:           items_processed: number | null
 3043:  332:         }
 3044:  333:         Insert: {
 3045:  334:           bot_id: string
 3046:  335:           bot_task_id?: string | null
 3047:  336:           error_logs?: Json | null
 3048:  337:           executed_at?: string | null
 3049:  338:           execution_details?: Json | null
 3050:  339:           execution_duration_ms?: number | null
 3051:  340:           execution_status: string
 3052:  341:           id?: string
 3053:  342:           items_failed?: number | null
 3054:  343:           items_processed?: number | null
 3055:  344:         }
 3056:  345:         Update: {
 3057:  346:           bot_id?: string
 3058:  347:           bot_task_id?: string | null
 3059:  348:           error_logs?: Json | null
 3060:  349:           executed_at?: string | null
 3061:  350:           execution_details?: Json | null
 3062:  351:           execution_duration_ms?: number | null
 3063:  352:           execution_status?: string
 3064:  353:           id?: string
 3065:  354:           items_failed?: number | null
 3066:  355:           items_processed?: number | null
 3067:  356:         }
 3068:  357:         Relationships: [
 3069:  358:           {
 3070:  359:             foreignKeyName: "bot_execution_logs_bot_id_fkey"
 3071:  360:             columns: ["bot_id"]
 3072:  361:             isOneToOne: false
 3073:  362:             referencedRelation: "bots"
 3074:  363:             referencedColumns: ["id"]
 3075:  364:           },
 3076:  365:           {
 3077:  366:             foreignKeyName: "bot_execution_logs_bot_task_id_fkey"
 3078:  367:             columns: ["bot_task_id"]
 3079:  368:             isOneToOne: false
 3080:  369:             referencedRelation: "bot_tasks"
 3081:  370:             referencedColumns: ["id"]
 3082:  371:           },
 3083:  372:         ]
 3084:  373:       }
 3085:  374:       bot_tasks: {
 3086:  375:         Row: {
 3087:  376:           bot_id: string
 3088:  377:           completed_at: string | null
 3089:  378:           created_at: string | null
 3090:  379:           error_message: string | null
 3091:  380:           id: string
 3092:  381:           max_retries: number | null
 3093:  382:           priority: number | null
 3094:  383:           retry_count: number | null
 3095:  384:           scheduled_at: string | null
 3096:  385:           started_at: string | null
 3097:  386:           status: string | null
 3098:  387:           task_config: Json
 3099:  388:           task_type: string
 3100:  389:         }
 3101:  390:         Insert: {
 3102:  391:           bot_id: string
 3103:  392:           completed_at?: string | null
 3104:  393:           created_at?: string | null
 3105:  394:           error_message?: string | null
 3106:  395:           id?: string
 3107:  396:           max_retries?: number | null
 3108:  397:           priority?: number | null
 3109:  398:           retry_count?: number | null
 3110:  399:           scheduled_at?: string | null
 3111:  400:           started_at?: string | null
 3112:  401:           status?: string | null
 3113:  402:           task_config: Json
 3114:  403:           task_type: string
 3115:  404:         }
 3116:  405:         Update: {
 3117:  406:           bot_id?: string
 3118:  407:           completed_at?: string | null
 3119:  408:           created_at?: string | null
 3120:  409:           error_message?: string | null
 3121:  410:           id?: string
 3122:  411:           max_retries?: number | null
 3123:  412:           priority?: number | null
 3124:  413:           retry_count?: number | null
 3125:  414:           scheduled_at?: string | null
 3126:  415:           started_at?: string | null
 3127:  416:           status?: string | null
 3128:  417:           task_config?: Json
 3129:  418:           task_type?: string
 3130:  419:         }
 3131:  420:         Relationships: [
 3132:  421:           {
 3133:  422:             foreignKeyName: "bot_tasks_bot_id_fkey"
 3134:  423:             columns: ["bot_id"]
 3135:  424:             isOneToOne: false
 3136:  425:             referencedRelation: "bots"
 3137:  426:             referencedColumns: ["id"]
 3138:  427:           },
 3139:  428:         ]
 3140:  429:       }
 3141:  430:       bots: {
 3142:  431:         Row: {
 3143:  432:           account_id: string
 3144:  433:           bot_type: string
 3145:  434:           config: Json
 3146:  435:           created_at: string | null
 3147:  436:           created_by: string
 3148:  437:           description: string | null
 3149:  438:           id: string
 3150:  439:           is_enabled: boolean | null
 3151:  440:           name: string
 3152:  441:           updated_at: string | null
 3153:  442:         }
 3154:  443:         Insert: {
 3155:  444:           account_id: string
 3156:  445:           bot_type: string
 3157:  446:           config: Json
 3158:  447:           created_at?: string | null
 3159:  448:           created_by: string
 3160:  449:           description?: string | null
 3161:  450:           id?: string
 3162:  451:           is_enabled?: boolean | null
 3163:  452:           name: string
 3164:  453:           updated_at?: string | null
 3165:  454:         }
 3166:  455:         Update: {
 3167:  456:           account_id?: string
 3168:  457:           bot_type?: string
 3169:  458:           config?: Json
 3170:  459:           created_at?: string | null
 3171:  460:           created_by?: string
 3172:  461:           description?: string | null
 3173:  462:           id?: string
 3174:  463:           is_enabled?: boolean | null
 3175:  464:           name?: string
 3176:  465:           updated_at?: string | null
 3177:  466:         }
 3178:  467:         Relationships: [
 3179:  468:           {
 3180:  469:             foreignKeyName: "bots_account_id_fkey"
 3181:  470:             columns: ["account_id"]
 3182:  471:             isOneToOne: false
 3183:  472:             referencedRelation: "accounts"
 3184:  473:             referencedColumns: ["id"]
 3185:  474:           },
 3186:  475:           {
 3187:  476:             foreignKeyName: "bots_created_by_fkey"
 3188:  477:             columns: ["created_by"]
 3189:  478:             isOneToOne: false
 3190:  479:             referencedRelation: "accounts"
 3191:  480:             referencedColumns: ["id"]
 3192:  481:           },
 3193:  482:         ]
 3194:  483:       }
 3195:  484:       branch_forks: {
 3196:  485:         Row: {
 3197:  486:           blueprint_id: string
 3198:  487:           branch_id: string
 3199:  488:           fork_reason: string | null
 3200:  489:           forked_at: string | null
 3201:  490:           forked_by: string
 3202:  491:           forked_from_task_id: string | null
 3203:  492:           id: string
 3204:  493:         }
 3205:  494:         Insert: {
 3206:  495:           blueprint_id: string
 3207:  496:           branch_id: string
 3208:  497:           fork_reason?: string | null
 3209:  498:           forked_at?: string | null
 3210:  499:           forked_by: string
 3211:  500:           forked_from_task_id?: string | null
 3212:  501:           id?: string
 3213:  502:         }
 3214:  503:         Update: {
 3215:  504:           blueprint_id?: string
 3216:  505:           branch_id?: string
 3217:  506:           fork_reason?: string | null
 3218:  507:           forked_at?: string | null
 3219:  508:           forked_by?: string
 3220:  509:           forked_from_task_id?: string | null
 3221:  510:           id?: string
 3222:  511:         }
 3223:  512:         Relationships: [
 3224:  513:           {
 3225:  514:             foreignKeyName: "branch_forks_blueprint_id_fkey"
 3226:  515:             columns: ["blueprint_id"]
 3227:  516:             isOneToOne: false
 3228:  517:             referencedRelation: "blueprints"
 3229:  518:             referencedColumns: ["id"]
 3230:  519:           },
 3231:  520:           {
 3232:  521:             foreignKeyName: "branch_forks_branch_id_fkey"
 3233:  522:             columns: ["branch_id"]
 3234:  523:             isOneToOne: false
 3235:  524:             referencedRelation: "blueprint_branches"
 3236:  525:             referencedColumns: ["id"]
 3237:  526:           },
 3238:  527:           {
 3239:  528:             foreignKeyName: "branch_forks_forked_by_fkey"
 3240:  529:             columns: ["forked_by"]
 3241:  530:             isOneToOne: false
 3242:  531:             referencedRelation: "accounts"
 3243:  532:             referencedColumns: ["id"]
 3244:  533:           },
 3245:  534:           {
 3246:  535:             foreignKeyName: "branch_forks_forked_from_task_id_fkey"
 3247:  536:             columns: ["forked_from_task_id"]
 3248:  537:             isOneToOne: false
 3249:  538:             referencedRelation: "tasks"
 3250:  539:             referencedColumns: ["id"]
 3251:  540:           },
 3252:  541:         ]
 3253:  542:       }
 3254:  543:       branch_permissions: {
 3255:  544:         Row: {
 3256:  545:           account_id: string
 3257:  546:           branch_id: string
 3258:  547:           granted_at: string | null
 3259:  548:           granted_by: string
 3260:  549:           id: string
 3261:  550:           permission_level: string
 3262:  551:         }
 3263:  552:         Insert: {
 3264:  553:           account_id: string
 3265:  554:           branch_id: string
 3266:  555:           granted_at?: string | null
 3267:  556:           granted_by: string
 3268:  557:           id?: string
 3269:  558:           permission_level: string
 3270:  559:         }
 3271:  560:         Update: {
 3272:  561:           account_id?: string
 3273:  562:           branch_id?: string
 3274:  563:           granted_at?: string | null
 3275:  564:           granted_by?: string
 3276:  565:           id?: string
 3277:  566:           permission_level?: string
 3278:  567:         }
 3279:  568:         Relationships: [
 3280:  569:           {
 3281:  570:             foreignKeyName: "branch_permissions_account_id_fkey"
 3282:  571:             columns: ["account_id"]
 3283:  572:             isOneToOne: false
 3284:  573:             referencedRelation: "accounts"
 3285:  574:             referencedColumns: ["id"]
 3286:  575:           },
 3287:  576:           {
 3288:  577:             foreignKeyName: "branch_permissions_branch_id_fkey"
 3289:  578:             columns: ["branch_id"]
 3290:  579:             isOneToOne: false
 3291:  580:             referencedRelation: "blueprint_branches"
 3292:  581:             referencedColumns: ["id"]
 3293:  582:           },
 3294:  583:           {
 3295:  584:             foreignKeyName: "branch_permissions_granted_by_fkey"
 3296:  585:             columns: ["granted_by"]
 3297:  586:             isOneToOne: false
 3298:  587:             referencedRelation: "accounts"
 3299:  588:             referencedColumns: ["id"]
 3300:  589:           },
 3301:  590:         ]
 3302:  591:       }
 3303:  592:       collaboration_invitations: {
 3304:  593:         Row: {
 3305:  594:           blueprint_id: string
 3306:  595:           created_at: string | null
 3307:  596:           expires_at: string
 3308:  597:           from_org_id: string
 3309:  598:           id: string
 3310:  599:           invitation_message: string | null
 3311:  600:           responded_at: string | null
 3312:  601:           status: string | null
 3313:  602:           to_org_id: string
 3314:  603:         }
 3315:  604:         Insert: {
 3316:  605:           blueprint_id: string
 3317:  606:           created_at?: string | null
 3318:  607:           expires_at: string
 3319:  608:           from_org_id: string
 3320:  609:           id?: string
 3321:  610:           invitation_message?: string | null
 3322:  611:           responded_at?: string | null
 3323:  612:           status?: string | null
 3324:  613:           to_org_id: string
 3325:  614:         }
 3326:  615:         Update: {
 3327:  616:           blueprint_id?: string
 3328:  617:           created_at?: string | null
 3329:  618:           expires_at?: string
 3330:  619:           from_org_id?: string
 3331:  620:           id?: string
 3332:  621:           invitation_message?: string | null
 3333:  622:           responded_at?: string | null
 3334:  623:           status?: string | null
 3335:  624:           to_org_id?: string
 3336:  625:         }
 3337:  626:         Relationships: [
 3338:  627:           {
 3339:  628:             foreignKeyName: "collaboration_invitations_blueprint_id_fkey"
 3340:  629:             columns: ["blueprint_id"]
 3341:  630:             isOneToOne: false
 3342:  631:             referencedRelation: "blueprints"
 3343:  632:             referencedColumns: ["id"]
 3344:  633:           },
 3345:  634:           {
 3346:  635:             foreignKeyName: "collaboration_invitations_from_org_id_fkey"
 3347:  636:             columns: ["from_org_id"]
 3348:  637:             isOneToOne: false
 3349:  638:             referencedRelation: "accounts"
 3350:  639:             referencedColumns: ["id"]
 3351:  640:           },
 3352:  641:           {
 3353:  642:             foreignKeyName: "collaboration_invitations_to_org_id_fkey"
 3354:  643:             columns: ["to_org_id"]
 3355:  644:             isOneToOne: false
 3356:  645:             referencedRelation: "accounts"
 3357:  646:             referencedColumns: ["id"]
 3358:  647:           },
 3359:  648:         ]
 3360:  649:       }
 3361:  650:       collaboration_members: {
 3362:  651:         Row: {
 3363:  652:           account_id: string
 3364:  653:           collaboration_id: string
 3365:  654:           id: string
 3366:  655:           joined_at: string | null
 3367:  656:           permissions: Json | null
 3368:  657:           role: string | null
 3369:  658:         }
 3370:  659:         Insert: {
 3371:  660:           account_id: string
 3372:  661:           collaboration_id: string
 3373:  662:           id?: string
 3374:  663:           joined_at?: string | null
 3375:  664:           permissions?: Json | null
 3376:  665:           role?: string | null
 3377:  666:         }
 3378:  667:         Update: {
 3379:  668:           account_id?: string
 3380:  669:           collaboration_id?: string
 3381:  670:           id?: string
 3382:  671:           joined_at?: string | null
 3383:  672:           permissions?: Json | null
 3384:  673:           role?: string | null
 3385:  674:         }
 3386:  675:         Relationships: [
 3387:  676:           {
 3388:  677:             foreignKeyName: "collaboration_members_account_id_fkey"
 3389:  678:             columns: ["account_id"]
 3390:  679:             isOneToOne: false
 3391:  680:             referencedRelation: "accounts"
 3392:  681:             referencedColumns: ["id"]
 3393:  682:           },
 3394:  683:           {
 3395:  684:             foreignKeyName: "collaboration_members_collaboration_id_fkey"
 3396:  685:             columns: ["collaboration_id"]
 3397:  686:             isOneToOne: false
 3398:  687:             referencedRelation: "organization_collaborations"
 3399:  688:             referencedColumns: ["id"]
 3400:  689:           },
 3401:  690:         ]
 3402:  691:       }
 3403:  692:       comments: {
 3404:  693:         Row: {
 3405:  694:           attachments: Json | null
 3406:  695:           author_id: string
 3407:  696:           commentable_id: string
 3408:  697:           commentable_type: string
 3409:  698:           content: string
 3410:  699:           created_at: string | null
 3411:  700:           edited_at: string | null
 3412:  701:           id: string
 3413:  702:           is_edited: boolean | null
 3414:  703:           mentions: Json | null
 3415:  704:           parent_comment_id: string | null
 3416:  705:         }
 3417:  706:         Insert: {
 3418:  707:           attachments?: Json | null
 3419:  708:           author_id: string
 3420:  709:           commentable_id: string
 3421:  710:           commentable_type: string
 3422:  711:           content: string
 3423:  712:           created_at?: string | null
 3424:  713:           edited_at?: string | null
 3425:  714:           id?: string
 3426:  715:           is_edited?: boolean | null
 3427:  716:           mentions?: Json | null
 3428:  717:           parent_comment_id?: string | null
 3429:  718:         }
 3430:  719:         Update: {
 3431:  720:           attachments?: Json | null
 3432:  721:           author_id?: string
 3433:  722:           commentable_id?: string
 3434:  723:           commentable_type?: string
 3435:  724:           content?: string
 3436:  725:           created_at?: string | null
 3437:  726:           edited_at?: string | null
 3438:  727:           id?: string
 3439:  728:           is_edited?: boolean | null
 3440:  729:           mentions?: Json | null
 3441:  730:           parent_comment_id?: string | null
 3442:  731:         }
 3443:  732:         Relationships: [
 3444:  733:           {
 3445:  734:             foreignKeyName: "comments_author_id_fkey"
 3446:  735:             columns: ["author_id"]
 3447:  736:             isOneToOne: false
 3448:  737:             referencedRelation: "accounts"
 3449:  738:             referencedColumns: ["id"]
 3450:  739:           },
 3451:  740:           {
 3452:  741:             foreignKeyName: "comments_parent_comment_id_fkey"
 3453:  742:             columns: ["parent_comment_id"]
 3454:  743:             isOneToOne: false
 3455:  744:             referencedRelation: "comments"
 3456:  745:             referencedColumns: ["id"]
 3457:  746:           },
 3458:  747:         ]
 3459:  748:       }
 3460:  749:       daily_reports: {
 3461:  750:         Row: {
 3462:  751:           blueprint_id: string
 3463:  752:           branch_id: string | null
 3464:  753:           created_at: string | null
 3465:  754:           equipment_used: string | null
 3466:  755:           id: string
 3467:  756:           issues_encountered: string | null
 3468:  757:           materials_used: string | null
 3469:  758:           progress_notes: string | null
 3470:  759:           report_date: string
 3471:  760:           reported_by: string
 3472:  761:           task_id: string
 3473:  762:           updated_at: string | null
 3474:  763:           weather_info: Json | null
 3475:  764:           work_description: string
 3476:  765:           worker_count: number | null
 3477:  766:         }
 3478:  767:         Insert: {
 3479:  768:           blueprint_id: string
 3480:  769:           branch_id?: string | null
 3481:  770:           created_at?: string | null
 3482:  771:           equipment_used?: string | null
 3483:  772:           id?: string
 3484:  773:           issues_encountered?: string | null
 3485:  774:           materials_used?: string | null
 3486:  775:           progress_notes?: string | null
 3487:  776:           report_date: string
 3488:  777:           reported_by: string
 3489:  778:           task_id: string
 3490:  779:           updated_at?: string | null
 3491:  780:           weather_info?: Json | null
 3492:  781:           work_description: string
 3493:  782:           worker_count?: number | null
 3494:  783:         }
 3495:  784:         Update: {
 3496:  785:           blueprint_id?: string
 3497:  786:           branch_id?: string | null
 3498:  787:           created_at?: string | null
 3499:  788:           equipment_used?: string | null
 3500:  789:           id?: string
 3501:  790:           issues_encountered?: string | null
 3502:  791:           materials_used?: string | null
 3503:  792:           progress_notes?: string | null
 3504:  793:           report_date?: string
 3505:  794:           reported_by?: string
 3506:  795:           task_id?: string
 3507:  796:           updated_at?: string | null
 3508:  797:           weather_info?: Json | null
 3509:  798:           work_description?: string
 3510:  799:           worker_count?: number | null
 3511:  800:         }
 3512:  801:         Relationships: [
 3513:  802:           {
 3514:  803:             foreignKeyName: "daily_reports_blueprint_id_fkey"
 3515:  804:             columns: ["blueprint_id"]
 3516:  805:             isOneToOne: false
 3517:  806:             referencedRelation: "blueprints"
 3518:  807:             referencedColumns: ["id"]
 3519:  808:           },
 3520:  809:           {
 3521:  810:             foreignKeyName: "daily_reports_branch_id_fkey"
 3522:  811:             columns: ["branch_id"]
 3523:  812:             isOneToOne: false
 3524:  813:             referencedRelation: "blueprint_branches"
 3525:  814:             referencedColumns: ["id"]
 3526:  815:           },
 3527:  816:           {
 3528:  817:             foreignKeyName: "daily_reports_reported_by_fkey"
 3529:  818:             columns: ["reported_by"]
 3530:  819:             isOneToOne: false
 3531:  820:             referencedRelation: "accounts"
 3532:  821:             referencedColumns: ["id"]
 3533:  822:           },
 3534:  823:           {
 3535:  824:             foreignKeyName: "daily_reports_task_id_fkey"
 3536:  825:             columns: ["task_id"]
 3537:  826:             isOneToOne: false
 3538:  827:             referencedRelation: "tasks"
 3539:  828:             referencedColumns: ["id"]
 3540:  829:           },
 3541:  830:         ]
 3542:  831:       }
 3543:  832:       document_thumbnails: {
 3544:  833:         Row: {
 3545:  834:           document_id: string
 3546:  835:           file_size: number
 3547:  836:           generated_at: string | null
 3548:  837:           height: number
 3549:  838:           id: string
 3550:  839:           storage_path: string
 3551:  840:           thumbnail_size: string
 3552:  841:           width: number
 3553:  842:         }
 3554:  843:         Insert: {
 3555:  844:           document_id: string
 3556:  845:           file_size: number
 3557:  846:           generated_at?: string | null
 3558:  847:           height: number
 3559:  848:           id?: string
 3560:  849:           storage_path: string
 3561:  850:           thumbnail_size: string
 3562:  851:           width: number
 3563:  852:         }
 3564:  853:         Update: {
 3565:  854:           document_id?: string
 3566:  855:           file_size?: number
 3567:  856:           generated_at?: string | null
 3568:  857:           height?: number
 3569:  858:           id?: string
 3570:  859:           storage_path?: string
 3571:  860:           thumbnail_size?: string
 3572:  861:           width?: number
 3573:  862:         }
 3574:  863:         Relationships: [
 3575:  864:           {
 3576:  865:             foreignKeyName: "document_thumbnails_document_id_fkey"
 3577:  866:             columns: ["document_id"]
 3578:  867:             isOneToOne: false
 3579:  868:             referencedRelation: "documents"
 3580:  869:             referencedColumns: ["id"]
 3581:  870:           },
 3582:  871:         ]
 3583:  872:       }
 3584:  873:       document_versions: {
 3585:  874:         Row: {
 3586:  875:           change_description: string | null
 3587:  876:           checksum: string | null
 3588:  877:           created_at: string | null
 3589:  878:           created_by: string
 3590:  879:           document_id: string
 3591:  880:           file_name: string
 3592:  881:           file_size: number
 3593:  882:           id: string
 3594:  883:           storage_path: string
 3595:  884:           version_number: number
 3596:  885:         }
 3597:  886:         Insert: {
 3598:  887:           change_description?: string | null
 3599:  888:           checksum?: string | null
 3600:  889:           created_at?: string | null
 3601:  890:           created_by: string
 3602:  891:           document_id: string
 3603:  892:           file_name: string
 3604:  893:           file_size: number
 3605:  894:           id?: string
 3606:  895:           storage_path: string
 3607:  896:           version_number: number
 3608:  897:         }
 3609:  898:         Update: {
 3610:  899:           change_description?: string | null
 3611:  900:           checksum?: string | null
 3612:  901:           created_at?: string | null
 3613:  902:           created_by?: string
 3614:  903:           document_id?: string
 3615:  904:           file_name?: string
 3616:  905:           file_size?: number
 3617:  906:           id?: string
 3618:  907:           storage_path?: string
 3619:  908:           version_number?: number
 3620:  909:         }
 3621:  910:         Relationships: [
 3622:  911:           {
 3623:  912:             foreignKeyName: "document_versions_created_by_fkey"
 3624:  913:             columns: ["created_by"]
 3625:  914:             isOneToOne: false
 3626:  915:             referencedRelation: "accounts"
 3627:  916:             referencedColumns: ["id"]
 3628:  917:           },
 3629:  918:           {
 3630:  919:             foreignKeyName: "document_versions_document_id_fkey"
 3631:  920:             columns: ["document_id"]
 3632:  921:             isOneToOne: false
 3633:  922:             referencedRelation: "documents"
 3634:  923:             referencedColumns: ["id"]
 3635:  924:           },
 3636:  925:         ]
 3637:  926:       }
 3638:  927:       documents: {
 3639:  928:         Row: {
 3640:  929:           checksum: string | null
 3641:  930:           file_name: string
 3642:  931:           file_size: number
 3643:  932:           file_type: string
 3644:  933:           id: string
 3645:  934:           is_public: boolean | null
 3646:  935:           metadata: Json | null
 3647:  936:           mime_type: string
 3648:  937:           permanent_delete_at: string | null
 3649:  938:           soft_deleted_at: string | null
 3650:  939:           storage_bucket: string | null
 3651:  940:           storage_path: string
 3652:  941:           upload_source: string | null
 3653:  942:           uploaded_at: string | null
 3654:  943:           uploader_id: string
 3655:  944:         }
 3656:  945:         Insert: {
 3657:  946:           checksum?: string | null
 3658:  947:           file_name: string
 3659:  948:           file_size: number
 3660:  949:           file_type: string
 3661:  950:           id?: string
 3662:  951:           is_public?: boolean | null
 3663:  952:           metadata?: Json | null
 3664:  953:           mime_type: string
 3665:  954:           permanent_delete_at?: string | null
 3666:  955:           soft_deleted_at?: string | null
 3667:  956:           storage_bucket?: string | null
 3668:  957:           storage_path: string
 3669:  958:           upload_source?: string | null
 3670:  959:           uploaded_at?: string | null
 3671:  960:           uploader_id: string
 3672:  961:         }
 3673:  962:         Update: {
 3674:  963:           checksum?: string | null
 3675:  964:           file_name?: string
 3676:  965:           file_size?: number
 3677:  966:           file_type?: string
 3678:  967:           id?: string
 3679:  968:           is_public?: boolean | null
 3680:  969:           metadata?: Json | null
 3681:  970:           mime_type?: string
 3682:  971:           permanent_delete_at?: string | null
 3683:  972:           soft_deleted_at?: string | null
 3684:  973:           storage_bucket?: string | null
 3685:  974:           storage_path?: string
 3686:  975:           upload_source?: string | null
 3687:  976:           uploaded_at?: string | null
 3688:  977:           uploader_id?: string
 3689:  978:         }
 3690:  979:         Relationships: [
 3691:  980:           {
 3692:  981:             foreignKeyName: "documents_uploader_id_fkey"
 3693:  982:             columns: ["uploader_id"]
 3694:  983:             isOneToOne: false
 3695:  984:             referencedRelation: "accounts"
 3696:  985:             referencedColumns: ["id"]
 3697:  986:           },
 3698:  987:         ]
 3699:  988:       }
 3700:  989:       feature_flags: {
 3701:  990:         Row: {
 3702:  991:           created_at: string | null
 3703:  992:           created_by: string | null
 3704:  993:           description: string | null
 3705:  994:           end_date: string | null
 3706:  995:           flag_key: string
 3707:  996:           flag_name: string
 3708:  997:           id: string
 3709:  998:           is_enabled: boolean | null
 3710:  999:           rollout_percentage: number | null
 3711: 1000:           start_date: string | null
 3712: 1001:           target_accounts: Json | null
 3713: 1002:           target_organizations: Json | null
 3714: 1003:           updated_at: string | null
 3715: 1004:         }
 3716: 1005:         Insert: {
 3717: 1006:           created_at?: string | null
 3718: 1007:           created_by?: string | null
 3719: 1008:           description?: string | null
 3720: 1009:           end_date?: string | null
 3721: 1010:           flag_key: string
 3722: 1011:           flag_name: string
 3723: 1012:           id?: string
 3724: 1013:           is_enabled?: boolean | null
 3725: 1014:           rollout_percentage?: number | null
 3726: 1015:           start_date?: string | null
 3727: 1016:           target_accounts?: Json | null
 3728: 1017:           target_organizations?: Json | null
 3729: 1018:           updated_at?: string | null
 3730: 1019:         }
 3731: 1020:         Update: {
 3732: 1021:           created_at?: string | null
 3733: 1022:           created_by?: string | null
 3734: 1023:           description?: string | null
 3735: 1024:           end_date?: string | null
 3736: 1025:           flag_key?: string
 3737: 1026:           flag_name?: string
 3738: 1027:           id?: string
 3739: 1028:           is_enabled?: boolean | null
 3740: 1029:           rollout_percentage?: number | null
 3741: 1030:           start_date?: string | null
 3742: 1031:           target_accounts?: Json | null
 3743: 1032:           target_organizations?: Json | null
 3744: 1033:           updated_at?: string | null
 3745: 1034:         }
 3746: 1035:         Relationships: [
 3747: 1036:           {
 3748: 1037:             foreignKeyName: "feature_flags_created_by_fkey"
 3749: 1038:             columns: ["created_by"]
 3750: 1039:             isOneToOne: false
 3751: 1040:             referencedRelation: "accounts"
 3752: 1041:             referencedColumns: ["id"]
 3753: 1042:           },
 3754: 1043:         ]
 3755: 1044:       }
 3756: 1045:       inspection_photos: {
 3757: 1046:         Row: {
 3758: 1047:           caption: string | null
 3759: 1048:           document_id: string
 3760: 1049:           id: string
 3761: 1050:           inspection_id: string
 3762: 1051:           photo_type: string | null
 3763: 1052:           sequence_order: number | null
 3764: 1053:           uploaded_at: string | null
 3765: 1054:           uploaded_by: string
 3766: 1055:         }
 3767: 1056:         Insert: {
 3768: 1057:           caption?: string | null
 3769: 1058:           document_id: string
 3770: 1059:           id?: string
 3771: 1060:           inspection_id: string
 3772: 1061:           photo_type?: string | null
 3773: 1062:           sequence_order?: number | null
 3774: 1063:           uploaded_at?: string | null
 3775: 1064:           uploaded_by: string
 3776: 1065:         }
 3777: 1066:         Update: {
 3778: 1067:           caption?: string | null
 3779: 1068:           document_id?: string
 3780: 1069:           id?: string
 3781: 1070:           inspection_id?: string
 3782: 1071:           photo_type?: string | null
 3783: 1072:           sequence_order?: number | null
 3784: 1073:           uploaded_at?: string | null
 3785: 1074:           uploaded_by?: string
 3786: 1075:         }
 3787: 1076:         Relationships: [
 3788: 1077:           {
 3789: 1078:             foreignKeyName: "inspection_photos_document_id_fkey"
 3790: 1079:             columns: ["document_id"]
 3791: 1080:             isOneToOne: false
 3792: 1081:             referencedRelation: "documents"
 3793: 1082:             referencedColumns: ["id"]
 3794: 1083:           },
 3795: 1084:           {
 3796: 1085:             foreignKeyName: "inspection_photos_inspection_id_fkey"
 3797: 1086:             columns: ["inspection_id"]
 3798: 1087:             isOneToOne: false
 3799: 1088:             referencedRelation: "inspections"
 3800: 1089:             referencedColumns: ["id"]
 3801: 1090:           },
 3802: 1091:           {
 3803: 1092:             foreignKeyName: "inspection_photos_uploaded_by_fkey"
 3804: 1093:             columns: ["uploaded_by"]
 3805: 1094:             isOneToOne: false
 3806: 1095:             referencedRelation: "accounts"
 3807: 1096:             referencedColumns: ["id"]
 3808: 1097:           },
 3809: 1098:         ]
 3810: 1099:       }
 3811: 1100:       inspections: {
 3812: 1101:         Row: {
 3813: 1102:           acceptance_criteria: string | null
 3814: 1103:           completed_at: string | null
 3815: 1104:           corrective_actions: string | null
 3816: 1105:           defects_found: Json | null
 3817: 1106:           findings: string | null
 3818: 1107:           id: string
 3819: 1108:           inspected_at: string | null
 3820: 1109:           inspection_items: Json
 3821: 1110:           inspection_type: string | null
 3822: 1111:           inspector_id: string
 3823: 1112:           qc_id: string | null
 3824: 1113:           responsibility_transferred: boolean | null
 3825: 1114:           status: string | null
 3826: 1115:           task_id: string
 3827: 1116:           transfer_date: string | null
 3828: 1117:         }
 3829: 1118:         Insert: {
 3830: 1119:           acceptance_criteria?: string | null
 3831: 1120:           completed_at?: string | null
 3832: 1121:           corrective_actions?: string | null
 3833: 1122:           defects_found?: Json | null
 3834: 1123:           findings?: string | null
 3835: 1124:           id?: string
 3836: 1125:           inspected_at?: string | null
 3837: 1126:           inspection_items: Json
 3838: 1127:           inspection_type?: string | null
 3839: 1128:           inspector_id: string
 3840: 1129:           qc_id?: string | null
 3841: 1130:           responsibility_transferred?: boolean | null
 3842: 1131:           status?: string | null
 3843: 1132:           task_id: string
 3844: 1133:           transfer_date?: string | null
 3845: 1134:         }
 3846: 1135:         Update: {
 3847: 1136:           acceptance_criteria?: string | null
 3848: 1137:           completed_at?: string | null
 3849: 1138:           corrective_actions?: string | null
 3850: 1139:           defects_found?: Json | null
 3851: 1140:           findings?: string | null
 3852: 1141:           id?: string
 3853: 1142:           inspected_at?: string | null
 3854: 1143:           inspection_items?: Json
 3855: 1144:           inspection_type?: string | null
 3856: 1145:           inspector_id?: string
 3857: 1146:           qc_id?: string | null
 3858: 1147:           responsibility_transferred?: boolean | null
 3859: 1148:           status?: string | null
 3860: 1149:           task_id?: string
 3861: 1150:           transfer_date?: string | null
 3862: 1151:         }
 3863: 1152:         Relationships: [
 3864: 1153:           {
 3865: 1154:             foreignKeyName: "inspections_inspector_id_fkey"
 3866: 1155:             columns: ["inspector_id"]
 3867: 1156:             isOneToOne: false
 3868: 1157:             referencedRelation: "accounts"
 3869: 1158:             referencedColumns: ["id"]
 3870: 1159:           },
 3871: 1160:           {
 3872: 1161:             foreignKeyName: "inspections_qc_id_fkey"
 3873: 1162:             columns: ["qc_id"]
 3874: 1163:             isOneToOne: false
 3875: 1164:             referencedRelation: "quality_checks"
 3876: 1165:             referencedColumns: ["id"]
 3877: 1166:           },
 3878: 1167:           {
 3879: 1168:             foreignKeyName: "inspections_task_id_fkey"
 3880: 1169:             columns: ["task_id"]
 3881: 1170:             isOneToOne: false
 3882: 1171:             referencedRelation: "tasks"
 3883: 1172:             referencedColumns: ["id"]
 3884: 1173:           },
 3885: 1174:         ]
 3886: 1175:       }
 3887: 1176:       issue_assignments: {
 3888: 1177:         Row: {
 3889: 1178:           assigned_at: string | null
 3890: 1179:           assigned_by: string
 3891: 1180:           assignee_id: string
 3892: 1181:           assignment_note: string | null
 3893: 1182:           id: string
 3894: 1183:           issue_id: string
 3895: 1184:         }
 3896: 1185:         Insert: {
 3897: 1186:           assigned_at?: string | null
 3898: 1187:           assigned_by: string
 3899: 1188:           assignee_id: string
 3900: 1189:           assignment_note?: string | null
 3901: 1190:           id?: string
 3902: 1191:           issue_id: string
 3903: 1192:         }
 3904: 1193:         Update: {
 3905: 1194:           assigned_at?: string | null
 3906: 1195:           assigned_by?: string
 3907: 1196:           assignee_id?: string
 3908: 1197:           assignment_note?: string | null
 3909: 1198:           id?: string
 3910: 1199:           issue_id?: string
 3911: 1200:         }
 3912: 1201:         Relationships: [
 3913: 1202:           {
 3914: 1203:             foreignKeyName: "issue_assignments_assigned_by_fkey"
 3915: 1204:             columns: ["assigned_by"]
 3916: 1205:             isOneToOne: false
 3917: 1206:             referencedRelation: "accounts"
 3918: 1207:             referencedColumns: ["id"]
 3919: 1208:           },
 3920: 1209:           {
 3921: 1210:             foreignKeyName: "issue_assignments_assignee_id_fkey"
 3922: 1211:             columns: ["assignee_id"]
 3923: 1212:             isOneToOne: false
 3924: 1213:             referencedRelation: "accounts"
 3925: 1214:             referencedColumns: ["id"]
 3926: 1215:           },
 3927: 1216:           {
 3928: 1217:             foreignKeyName: "issue_assignments_issue_id_fkey"
 3929: 1218:             columns: ["issue_id"]
 3930: 1219:             isOneToOne: false
 3931: 1220:             referencedRelation: "issues"
 3932: 1221:             referencedColumns: ["id"]
 3933: 1222:           },
 3934: 1223:         ]
 3935: 1224:       }
 3936: 1225:       issue_photos: {
 3937: 1226:         Row: {
 3938: 1227:           caption: string | null
 3939: 1228:           document_id: string
 3940: 1229:           id: string
 3941: 1230:           issue_id: string
 3942: 1231:           photo_type: string | null
 3943: 1232:           sequence_order: number | null
 3944: 1233:           uploaded_at: string | null
 3945: 1234:           uploaded_by: string
 3946: 1235:         }
 3947: 1236:         Insert: {
 3948: 1237:           caption?: string | null
 3949: 1238:           document_id: string
 3950: 1239:           id?: string
 3951: 1240:           issue_id: string
 3952: 1241:           photo_type?: string | null
 3953: 1242:           sequence_order?: number | null
 3954: 1243:           uploaded_at?: string | null
 3955: 1244:           uploaded_by: string
 3956: 1245:         }
 3957: 1246:         Update: {
 3958: 1247:           caption?: string | null
 3959: 1248:           document_id?: string
 3960: 1249:           id?: string
 3961: 1250:           issue_id?: string
 3962: 1251:           photo_type?: string | null
 3963: 1252:           sequence_order?: number | null
 3964: 1253:           uploaded_at?: string | null
 3965: 1254:           uploaded_by?: string
 3966: 1255:         }
 3967: 1256:         Relationships: [
 3968: 1257:           {
 3969: 1258:             foreignKeyName: "issue_photos_document_id_fkey"
 3970: 1259:             columns: ["document_id"]
 3971: 1260:             isOneToOne: false
 3972: 1261:             referencedRelation: "documents"
 3973: 1262:             referencedColumns: ["id"]
 3974: 1263:           },
 3975: 1264:           {
 3976: 1265:             foreignKeyName: "issue_photos_issue_id_fkey"
 3977: 1266:             columns: ["issue_id"]
 3978: 1267:             isOneToOne: false
 3979: 1268:             referencedRelation: "issues"
 3980: 1269:             referencedColumns: ["id"]
 3981: 1270:           },
 3982: 1271:           {
 3983: 1272:             foreignKeyName: "issue_photos_uploaded_by_fkey"
 3984: 1273:             columns: ["uploaded_by"]
 3985: 1274:             isOneToOne: false
 3986: 1275:             referencedRelation: "accounts"
 3987: 1276:             referencedColumns: ["id"]
 3988: 1277:           },
 3989: 1278:         ]
 3990: 1279:       }
 3991: 1280:       issue_sync_logs: {
 3992: 1281:         Row: {
 3993: 1282:           id: string
 3994: 1283:           issue_id: string
 3995: 1284:           source_branch_id: string | null
 3996: 1285:           sync_data: Json | null
 3997: 1286:           sync_type: string | null
 3998: 1287:           synced_at: string | null
 3999: 1288:           synced_by: string | null
 4000: 1289:           target_blueprint_id: string
 4001: 1290:         }
 4002: 1291:         Insert: {
 4003: 1292:           id?: string
 4004: 1293:           issue_id: string
 4005: 1294:           source_branch_id?: string | null
 4006: 1295:           sync_data?: Json | null
 4007: 1296:           sync_type?: string | null
 4008: 1297:           synced_at?: string | null
 4009: 1298:           synced_by?: string | null
 4010: 1299:           target_blueprint_id: string
 4011: 1300:         }
 4012: 1301:         Update: {
 4013: 1302:           id?: string
 4014: 1303:           issue_id?: string
 4015: 1304:           source_branch_id?: string | null
 4016: 1305:           sync_data?: Json | null
 4017: 1306:           sync_type?: string | null
 4018: 1307:           synced_at?: string | null
 4019: 1308:           synced_by?: string | null
 4020: 1309:           target_blueprint_id?: string
 4021: 1310:         }
 4022: 1311:         Relationships: [
 4023: 1312:           {
 4024: 1313:             foreignKeyName: "issue_sync_logs_issue_id_fkey"
 4025: 1314:             columns: ["issue_id"]
 4026: 1315:             isOneToOne: false
 4027: 1316:             referencedRelation: "issues"
 4028: 1317:             referencedColumns: ["id"]
 4029: 1318:           },
 4030: 1319:           {
 4031: 1320:             foreignKeyName: "issue_sync_logs_source_branch_id_fkey"
 4032: 1321:             columns: ["source_branch_id"]
 4033: 1322:             isOneToOne: false
 4034: 1323:             referencedRelation: "blueprint_branches"
 4035: 1324:             referencedColumns: ["id"]
 4036: 1325:           },
 4037: 1326:           {
 4038: 1327:             foreignKeyName: "issue_sync_logs_synced_by_fkey"
 4039: 1328:             columns: ["synced_by"]
 4040: 1329:             isOneToOne: false
 4041: 1330:             referencedRelation: "accounts"
 4042: 1331:             referencedColumns: ["id"]
 4043: 1332:           },
 4044: 1333:           {
 4045: 1334:             foreignKeyName: "issue_sync_logs_target_blueprint_id_fkey"
 4046: 1335:             columns: ["target_blueprint_id"]
 4047: 1336:             isOneToOne: false
 4048: 1337:             referencedRelation: "blueprints"
 4049: 1338:             referencedColumns: ["id"]
 4050: 1339:           },
 4051: 1340:         ]
 4052: 1341:       }
 4053: 1342:       issues: {
 4054: 1343:         Row: {
 4055: 1344:           blueprint_id: string
 4056: 1345:           branch_id: string | null
 4057: 1346:           closed_at: string | null
 4058: 1347:           description: string
 4059: 1348:           id: string
 4060: 1349:           issue_type: string | null
 4061: 1350:           priority: string | null
 4062: 1351:           reported_at: string | null
 4063: 1352:           reported_by: string
 4064: 1353:           resolution_note: string | null
 4065: 1354:           resolved_at: string | null
 4066: 1355:           severity: string | null
 4067: 1356:           status: string | null
 4068: 1357:           synced_to_main: boolean | null
 4069: 1358:           task_id: string | null
 4070: 1359:           title: string
 4071: 1360:         }
 4072: 1361:         Insert: {
 4073: 1362:           blueprint_id: string
 4074: 1363:           branch_id?: string | null
 4075: 1364:           closed_at?: string | null
 4076: 1365:           description: string
 4077: 1366:           id?: string
 4078: 1367:           issue_type?: string | null
 4079: 1368:           priority?: string | null
 4080: 1369:           reported_at?: string | null
 4081: 1370:           reported_by: string
 4082: 1371:           resolution_note?: string | null
 4083: 1372:           resolved_at?: string | null
 4084: 1373:           severity?: string | null
 4085: 1374:           status?: string | null
 4086: 1375:           synced_to_main?: boolean | null
 4087: 1376:           task_id?: string | null
 4088: 1377:           title: string
 4089: 1378:         }
 4090: 1379:         Update: {
 4091: 1380:           blueprint_id?: string
 4092: 1381:           branch_id?: string | null
 4093: 1382:           closed_at?: string | null
 4094: 1383:           description?: string
 4095: 1384:           id?: string
 4096: 1385:           issue_type?: string | null
 4097: 1386:           priority?: string | null
 4098: 1387:           reported_at?: string | null
 4099: 1388:           reported_by?: string
 4100: 1389:           resolution_note?: string | null
 4101: 1390:           resolved_at?: string | null
 4102: 1391:           severity?: string | null
 4103: 1392:           status?: string | null
 4104: 1393:           synced_to_main?: boolean | null
 4105: 1394:           task_id?: string | null
 4106: 1395:           title?: string
 4107: 1396:         }
 4108: 1397:         Relationships: [
 4109: 1398:           {
 4110: 1399:             foreignKeyName: "issues_blueprint_id_fkey"
 4111: 1400:             columns: ["blueprint_id"]
 4112: 1401:             isOneToOne: false
 4113: 1402:             referencedRelation: "blueprints"
 4114: 1403:             referencedColumns: ["id"]
 4115: 1404:           },
 4116: 1405:           {
 4117: 1406:             foreignKeyName: "issues_branch_id_fkey"
 4118: 1407:             columns: ["branch_id"]
 4119: 1408:             isOneToOne: false
 4120: 1409:             referencedRelation: "blueprint_branches"
 4121: 1410:             referencedColumns: ["id"]
 4122: 1411:           },
 4123: 1412:           {
 4124: 1413:             foreignKeyName: "issues_reported_by_fkey"
 4125: 1414:             columns: ["reported_by"]
 4126: 1415:             isOneToOne: false
 4127: 1416:             referencedRelation: "accounts"
 4128: 1417:             referencedColumns: ["id"]
 4129: 1418:           },
 4130: 1419:           {
 4131: 1420:             foreignKeyName: "issues_task_id_fkey"
 4132: 1421:             columns: ["task_id"]
 4133: 1422:             isOneToOne: false
 4134: 1423:             referencedRelation: "tasks"
 4135: 1424:             referencedColumns: ["id"]
 4136: 1425:           },
 4137: 1426:         ]
 4138: 1427:       }
 4139: 1428:       notification_rules: {
 4140: 1429:         Row: {
 4141: 1430:           account_id: string
 4142: 1431:           channel: string
 4143: 1432:           created_at: string | null
 4144: 1433:           frequency: string | null
 4145: 1434:           id: string
 4146: 1435:           is_enabled: boolean | null
 4147: 1436:           notification_type: string
 4148: 1437:           quiet_hours_end: string | null
 4149: 1438:           quiet_hours_start: string | null
 4150: 1439:           updated_at: string | null
 4151: 1440:         }
 4152: 1441:         Insert: {
 4153: 1442:           account_id: string
 4154: 1443:           channel: string
 4155: 1444:           created_at?: string | null
 4156: 1445:           frequency?: string | null
 4157: 1446:           id?: string
 4158: 1447:           is_enabled?: boolean | null
 4159: 1448:           notification_type: string
 4160: 1449:           quiet_hours_end?: string | null
 4161: 1450:           quiet_hours_start?: string | null
 4162: 1451:           updated_at?: string | null
 4163: 1452:         }
 4164: 1453:         Update: {
 4165: 1454:           account_id?: string
 4166: 1455:           channel?: string
 4167: 1456:           created_at?: string | null
 4168: 1457:           frequency?: string | null
 4169: 1458:           id?: string
 4170: 1459:           is_enabled?: boolean | null
 4171: 1460:           notification_type?: string
 4172: 1461:           quiet_hours_end?: string | null
 4173: 1462:           quiet_hours_start?: string | null
 4174: 1463:           updated_at?: string | null
 4175: 1464:         }
 4176: 1465:         Relationships: [
 4177: 1466:           {
 4178: 1467:             foreignKeyName: "notification_rules_account_id_fkey"
 4179: 1468:             columns: ["account_id"]
 4180: 1469:             isOneToOne: false
 4181: 1470:             referencedRelation: "accounts"
 4182: 1471:             referencedColumns: ["id"]
 4183: 1472:           },
 4184: 1473:         ]
 4185: 1474:       }
 4186: 1475:       notification_subscriptions: {
 4187: 1476:         Row: {
 4188: 1477:           account_id: string
 4189: 1478:           id: string
 4190: 1479:           subscribable_id: string
 4191: 1480:           subscribable_type: string
 4192: 1481:           subscribed_at: string | null
 4193: 1482:           subscription_level: string | null
 4194: 1483:         }
 4195: 1484:         Insert: {
 4196: 1485:           account_id: string
 4197: 1486:           id?: string
 4198: 1487:           subscribable_id: string
 4199: 1488:           subscribable_type: string
 4200: 1489:           subscribed_at?: string | null
 4201: 1490:           subscription_level?: string | null
 4202: 1491:         }
 4203: 1492:         Update: {
 4204: 1493:           account_id?: string
 4205: 1494:           id?: string
 4206: 1495:           subscribable_id?: string
 4207: 1496:           subscribable_type?: string
 4208: 1497:           subscribed_at?: string | null
 4209: 1498:           subscription_level?: string | null
 4210: 1499:         }
 4211: 1500:         Relationships: [
 4212: 1501:           {
 4213: 1502:             foreignKeyName: "notification_subscriptions_account_id_fkey"
 4214: 1503:             columns: ["account_id"]
 4215: 1504:             isOneToOne: false
 4216: 1505:             referencedRelation: "accounts"
 4217: 1506:             referencedColumns: ["id"]
 4218: 1507:           },
 4219: 1508:         ]
 4220: 1509:       }
 4221: 1510:       notifications: {
 4222: 1511:         Row: {
 4223: 1512:           action_url: string | null
 4224: 1513:           content: string | null
 4225: 1514:           created_at: string | null
 4226: 1515:           id: string
 4227: 1516:           is_read: boolean | null
 4228: 1517:           notification_type: string
 4229: 1518:           priority: string | null
 4230: 1519:           read_at: string | null
 4231: 1520:           recipient_id: string
 4232: 1521:           related_id: string | null
 4233: 1522:           related_type: string | null
 4234: 1523:           sender_id: string | null
 4235: 1524:           title: string
 4236: 1525:         }
 4237: 1526:         Insert: {
 4238: 1527:           action_url?: string | null
 4239: 1528:           content?: string | null
 4240: 1529:           created_at?: string | null
 4241: 1530:           id?: string
 4242: 1531:           is_read?: boolean | null
 4243: 1532:           notification_type: string
 4244: 1533:           priority?: string | null
 4245: 1534:           read_at?: string | null
 4246: 1535:           recipient_id: string
 4247: 1536:           related_id?: string | null
 4248: 1537:           related_type?: string | null
 4249: 1538:           sender_id?: string | null
 4250: 1539:           title: string
 4251: 1540:         }
 4252: 1541:         Update: {
 4253: 1542:           action_url?: string | null
 4254: 1543:           content?: string | null
 4255: 1544:           created_at?: string | null
 4256: 1545:           id?: string
 4257: 1546:           is_read?: boolean | null
 4258: 1547:           notification_type?: string
 4259: 1548:           priority?: string | null
 4260: 1549:           read_at?: string | null
 4261: 1550:           recipient_id?: string
 4262: 1551:           related_id?: string | null
 4263: 1552:           related_type?: string | null
 4264: 1553:           sender_id?: string | null
 4265: 1554:           title?: string
 4266: 1555:         }
 4267: 1556:         Relationships: [
 4268: 1557:           {
 4269: 1558:             foreignKeyName: "notifications_recipient_id_fkey"
 4270: 1559:             columns: ["recipient_id"]
 4271: 1560:             isOneToOne: false
 4272: 1561:             referencedRelation: "accounts"
 4273: 1562:             referencedColumns: ["id"]
 4274: 1563:           },
 4275: 1564:           {
 4276: 1565:             foreignKeyName: "notifications_sender_id_fkey"
 4277: 1566:             columns: ["sender_id"]
 4278: 1567:             isOneToOne: false
 4279: 1568:             referencedRelation: "accounts"
 4280: 1569:             referencedColumns: ["id"]
 4281: 1570:           },
 4282: 1571:         ]
 4283: 1572:       }
 4284: 1573:       organization_collaborations: {
 4285: 1574:         Row: {
 4286: 1575:           blueprint_id: string
 4287: 1576:           collaboration_type: string | null
 4288: 1577:           collaborator_org_id: string
 4289: 1578:           contract_end_date: string | null
 4290: 1579:           contract_start_date: string | null
 4291: 1580:           created_at: string | null
 4292: 1581:           id: string
 4293: 1582:           notes: string | null
 4294: 1583:           owner_org_id: string
 4295: 1584:           status: string | null
 4296: 1585:           updated_at: string | null
 4297: 1586:         }
 4298: 1587:         Insert: {
 4299: 1588:           blueprint_id: string
 4300: 1589:           collaboration_type?: string | null
 4301: 1590:           collaborator_org_id: string
 4302: 1591:           contract_end_date?: string | null
 4303: 1592:           contract_start_date?: string | null
 4304: 1593:           created_at?: string | null
 4305: 1594:           id?: string
 4306: 1595:           notes?: string | null
 4307: 1596:           owner_org_id: string
 4308: 1597:           status?: string | null
 4309: 1598:           updated_at?: string | null
 4310: 1599:         }
 4311: 1600:         Update: {
 4312: 1601:           blueprint_id?: string
 4313: 1602:           collaboration_type?: string | null
 4314: 1603:           collaborator_org_id?: string
 4315: 1604:           contract_end_date?: string | null
 4316: 1605:           contract_start_date?: string | null
 4317: 1606:           created_at?: string | null
 4318: 1607:           id?: string
 4319: 1608:           notes?: string | null
 4320: 1609:           owner_org_id?: string
 4321: 1610:           status?: string | null
 4322: 1611:           updated_at?: string | null
 4323: 1612:         }
 4324: 1613:         Relationships: [
 4325: 1614:           {
 4326: 1615:             foreignKeyName: "organization_collaborations_blueprint_id_fkey"
 4327: 1616:             columns: ["blueprint_id"]
 4328: 1617:             isOneToOne: false
 4329: 1618:             referencedRelation: "blueprints"
 4330: 1619:             referencedColumns: ["id"]
 4331: 1620:           },
 4332: 1621:           {
 4333: 1622:             foreignKeyName: "organization_collaborations_collaborator_org_id_fkey"
 4334: 1623:             columns: ["collaborator_org_id"]
 4335: 1624:             isOneToOne: false
 4336: 1625:             referencedRelation: "accounts"
 4337: 1626:             referencedColumns: ["id"]
 4338: 1627:           },
 4339: 1628:           {
 4340: 1629:             foreignKeyName: "organization_collaborations_owner_org_id_fkey"
 4341: 1630:             columns: ["owner_org_id"]
 4342: 1631:             isOneToOne: false
 4343: 1632:             referencedRelation: "accounts"
 4344: 1633:             referencedColumns: ["id"]
 4345: 1634:           },
 4346: 1635:         ]
 4347: 1636:       }
 4348: 1637:       organization_schedules: {
 4349: 1638:         Row: {
 4350: 1639:           account_id: string | null
 4351: 1640:           blueprint_id: string | null
 4352: 1641:           branch_id: string | null
 4353: 1642:           created_at: string | null
 4354: 1643:           created_by: string
 4355: 1644:           end_time: string | null
 4356: 1645:           id: string
 4357: 1646:           notes: string | null
 4358: 1647:           organization_id: string
 4359: 1648:           schedule_date: string
 4360: 1649:           start_time: string | null
 4361: 1650:           team_id: string | null
 4362: 1651:           updated_at: string | null
 4363: 1652:           weather_info: Json | null
 4364: 1653:         }
 4365: 1654:         Insert: {
 4366: 1655:           account_id?: string | null
 4367: 1656:           blueprint_id?: string | null
 4368: 1657:           branch_id?: string | null
 4369: 1658:           created_at?: string | null
 4370: 1659:           created_by: string
 4371: 1660:           end_time?: string | null
 4372: 1661:           id?: string
 4373: 1662:           notes?: string | null
 4374: 1663:           organization_id: string
 4375: 1664:           schedule_date: string
 4376: 1665:           start_time?: string | null
 4377: 1666:           team_id?: string | null
 4378: 1667:           updated_at?: string | null
 4379: 1668:           weather_info?: Json | null
 4380: 1669:         }
 4381: 1670:         Update: {
 4382: 1671:           account_id?: string | null
 4383: 1672:           blueprint_id?: string | null
 4384: 1673:           branch_id?: string | null
 4385: 1674:           created_at?: string | null
 4386: 1675:           created_by?: string
 4387: 1676:           end_time?: string | null
 4388: 1677:           id?: string
 4389: 1678:           notes?: string | null
 4390: 1679:           organization_id?: string
 4391: 1680:           schedule_date?: string
 4392: 1681:           start_time?: string | null
 4393: 1682:           team_id?: string | null
 4394: 1683:           updated_at?: string | null
 4395: 1684:           weather_info?: Json | null
 4396: 1685:         }
 4397: 1686:         Relationships: [
 4398: 1687:           {
 4399: 1688:             foreignKeyName: "organization_schedules_account_id_fkey"
 4400: 1689:             columns: ["account_id"]
 4401: 1690:             isOneToOne: false
 4402: 1691:             referencedRelation: "accounts"
 4403: 1692:             referencedColumns: ["id"]
 4404: 1693:           },
 4405: 1694:           {
 4406: 1695:             foreignKeyName: "organization_schedules_blueprint_id_fkey"
 4407: 1696:             columns: ["blueprint_id"]
 4408: 1697:             isOneToOne: false
 4409: 1698:             referencedRelation: "blueprints"
 4410: 1699:             referencedColumns: ["id"]
 4411: 1700:           },
 4412: 1701:           {
 4413: 1702:             foreignKeyName: "organization_schedules_branch_id_fkey"
 4414: 1703:             columns: ["branch_id"]
 4415: 1704:             isOneToOne: false
 4416: 1705:             referencedRelation: "blueprint_branches"
 4417: 1706:             referencedColumns: ["id"]
 4418: 1707:           },
 4419: 1708:           {
 4420: 1709:             foreignKeyName: "organization_schedules_created_by_fkey"
 4421: 1710:             columns: ["created_by"]
 4422: 1711:             isOneToOne: false
 4423: 1712:             referencedRelation: "accounts"
 4424: 1713:             referencedColumns: ["id"]
 4425: 1714:           },
 4426: 1715:           {
 4427: 1716:             foreignKeyName: "organization_schedules_organization_id_fkey"
 4428: 1717:             columns: ["organization_id"]
 4429: 1718:             isOneToOne: false
 4430: 1719:             referencedRelation: "accounts"
 4431: 1720:             referencedColumns: ["id"]
 4432: 1721:           },
 4433: 1722:           {
 4434: 1723:             foreignKeyName: "organization_schedules_team_id_fkey"
 4435: 1724:             columns: ["team_id"]
 4436: 1725:             isOneToOne: false
 4437: 1726:             referencedRelation: "teams"
 4438: 1727:             referencedColumns: ["id"]
 4439: 1728:           },
 4440: 1729:         ]
 4441: 1730:       }
 4442: 1731:       permissions: {
 4443: 1732:         Row: {
 4444: 1733:           action: string
 4445: 1734:           created_at: string | null
 4446: 1735:           description: string | null
 4447: 1736:           id: string
 4448: 1737:           is_system_permission: boolean | null
 4449: 1738:           name: string
 4450: 1739:           resource: string
 4451: 1740:         }
 4452: 1741:         Insert: {
 4453: 1742:           action: string
 4454: 1743:           created_at?: string | null
 4455: 1744:           description?: string | null
 4456: 1745:           id?: string
 4457: 1746:           is_system_permission?: boolean | null
 4458: 1747:           name: string
 4459: 1748:           resource: string
 4460: 1749:         }
 4461: 1750:         Update: {
 4462: 1751:           action?: string
 4463: 1752:           created_at?: string | null
 4464: 1753:           description?: string | null
 4465: 1754:           id?: string
 4466: 1755:           is_system_permission?: boolean | null
 4467: 1756:           name?: string
 4468: 1757:           resource?: string
 4469: 1758:         }
 4470: 1759:         Relationships: []
 4471: 1760:       }
 4472: 1761:       personal_todos: {
 4473: 1762:         Row: {
 4474: 1763:           account_id: string
 4475: 1764:           completed_at: string | null
 4476: 1765:           created_at: string | null
 4477: 1766:           description: string | null
 4478: 1767:           due_date: string | null
 4479: 1768:           id: string
 4480: 1769:           priority: string | null
 4481: 1770:           related_id: string | null
 4482: 1771:           related_type: string | null
 4483: 1772:           status: string | null
 4484: 1773:           title: string
 4485: 1774:           todo_type: string
 4486: 1775:           updated_at: string | null
 4487: 1776:         }
 4488: 1777:         Insert: {
 4489: 1778:           account_id: string
 4490: 1779:           completed_at?: string | null
 4491: 1780:           created_at?: string | null
 4492: 1781:           description?: string | null
 4493: 1782:           due_date?: string | null
 4494: 1783:           id?: string
 4495: 1784:           priority?: string | null
 4496: 1785:           related_id?: string | null
 4497: 1786:           related_type?: string | null
 4498: 1787:           status?: string | null
 4499: 1788:           title: string
 4500: 1789:           todo_type: string
 4501: 1790:           updated_at?: string | null
 4502: 1791:         }
 4503: 1792:         Update: {
 4504: 1793:           account_id?: string
 4505: 1794:           completed_at?: string | null
 4506: 1795:           created_at?: string | null
 4507: 1796:           description?: string | null
 4508: 1797:           due_date?: string | null
 4509: 1798:           id?: string
 4510: 1799:           priority?: string | null
 4511: 1800:           related_id?: string | null
 4512: 1801:           related_type?: string | null
 4513: 1802:           status?: string | null
 4514: 1803:           title?: string
 4515: 1804:           todo_type?: string
 4516: 1805:           updated_at?: string | null
 4517: 1806:         }
 4518: 1807:         Relationships: [
 4519: 1808:           {
 4520: 1809:             foreignKeyName: "personal_todos_account_id_fkey"
 4521: 1810:             columns: ["account_id"]
 4522: 1811:             isOneToOne: false
 4523: 1812:             referencedRelation: "accounts"
 4524: 1813:             referencedColumns: ["id"]
 4525: 1814:           },
 4526: 1815:         ]
 4527: 1816:       }
 4528: 1817:       progress_tracking: {
 4529: 1818:         Row: {
 4530: 1819:           blueprint_id: string
 4531: 1820:           branch_id: string | null
 4532: 1821:           budget_spent: number | null
 4533: 1822:           budget_variance: number | null
 4534: 1823:           calculated_at: string | null
 4535: 1824:           completed_tasks: number | null
 4536: 1825:           completion_percentage: number | null
 4537: 1826:           id: string
 4538: 1827:           in_progress_tasks: number | null
 4539: 1828:           overdue_tasks: number | null
 4540: 1829:           pending_tasks: number | null
 4541: 1830:           quality_score: number | null
 4542: 1831:           safety_incidents: number | null
 4543: 1832:           schedule_variance_days: number | null
 4544: 1833:           total_tasks: number | null
 4545: 1834:           tracking_date: string
 4546: 1835:         }
 4547: 1836:         Insert: {
 4548: 1837:           blueprint_id: string
 4549: 1838:           branch_id?: string | null
 4550: 1839:           budget_spent?: number | null
 4551: 1840:           budget_variance?: number | null
 4552: 1841:           calculated_at?: string | null
 4553: 1842:           completed_tasks?: number | null
 4554: 1843:           completion_percentage?: number | null
 4555: 1844:           id?: string
 4556: 1845:           in_progress_tasks?: number | null
 4557: 1846:           overdue_tasks?: number | null
 4558: 1847:           pending_tasks?: number | null
 4559: 1848:           quality_score?: number | null
 4560: 1849:           safety_incidents?: number | null
 4561: 1850:           schedule_variance_days?: number | null
 4562: 1851:           total_tasks?: number | null
 4563: 1852:           tracking_date: string
 4564: 1853:         }
 4565: 1854:         Update: {
 4566: 1855:           blueprint_id?: string
 4567: 1856:           branch_id?: string | null
 4568: 1857:           budget_spent?: number | null
 4569: 1858:           budget_variance?: number | null
 4570: 1859:           calculated_at?: string | null
 4571: 1860:           completed_tasks?: number | null
 4572: 1861:           completion_percentage?: number | null
 4573: 1862:           id?: string
 4574: 1863:           in_progress_tasks?: number | null
 4575: 1864:           overdue_tasks?: number | null
 4576: 1865:           pending_tasks?: number | null
 4577: 1866:           quality_score?: number | null
 4578: 1867:           safety_incidents?: number | null
 4579: 1868:           schedule_variance_days?: number | null
 4580: 1869:           total_tasks?: number | null
 4581: 1870:           tracking_date?: string
 4582: 1871:         }
 4583: 1872:         Relationships: [
 4584: 1873:           {
 4585: 1874:             foreignKeyName: "progress_tracking_blueprint_id_fkey"
 4586: 1875:             columns: ["blueprint_id"]
 4587: 1876:             isOneToOne: false
 4588: 1877:             referencedRelation: "blueprints"
 4589: 1878:             referencedColumns: ["id"]
 4590: 1879:           },
 4591: 1880:           {
 4592: 1881:             foreignKeyName: "progress_tracking_branch_id_fkey"
 4593: 1882:             columns: ["branch_id"]
 4594: 1883:             isOneToOne: false
 4595: 1884:             referencedRelation: "blueprint_branches"
 4596: 1885:             referencedColumns: ["id"]
 4597: 1886:           },
 4598: 1887:         ]
 4599: 1888:       }
 4600: 1889:       pull_requests: {
 4601: 1890:         Row: {
 4602: 1891:           blueprint_id: string
 4603: 1892:           branch_id: string
 4604: 1893:           changes_summary: Json | null
 4605: 1894:           description: string | null
 4606: 1895:           id: string
 4607: 1896:           merged_at: string | null
 4608: 1897:           merged_by: string | null
 4609: 1898:           reviewed_at: string | null
 4610: 1899:           reviewed_by: string | null
 4611: 1900:           status: string | null
 4612: 1901:           submitted_at: string | null
 4613: 1902:           submitted_by: string
 4614: 1903:           title: string
 4615: 1904:         }
 4616: 1905:         Insert: {
 4617: 1906:           blueprint_id: string
 4618: 1907:           branch_id: string
 4619: 1908:           changes_summary?: Json | null
 4620: 1909:           description?: string | null
 4621: 1910:           id?: string
 4622: 1911:           merged_at?: string | null
 4623: 1912:           merged_by?: string | null
 4624: 1913:           reviewed_at?: string | null
 4625: 1914:           reviewed_by?: string | null
 4626: 1915:           status?: string | null
 4627: 1916:           submitted_at?: string | null
 4628: 1917:           submitted_by: string
 4629: 1918:           title: string
 4630: 1919:         }
 4631: 1920:         Update: {
 4632: 1921:           blueprint_id?: string
 4633: 1922:           branch_id?: string
 4634: 1923:           changes_summary?: Json | null
 4635: 1924:           description?: string | null
 4636: 1925:           id?: string
 4637: 1926:           merged_at?: string | null
 4638: 1927:           merged_by?: string | null
 4639: 1928:           reviewed_at?: string | null
 4640: 1929:           reviewed_by?: string | null
 4641: 1930:           status?: string | null
 4642: 1931:           submitted_at?: string | null
 4643: 1932:           submitted_by?: string
 4644: 1933:           title?: string
 4645: 1934:         }
 4646: 1935:         Relationships: [
 4647: 1936:           {
 4648: 1937:             foreignKeyName: "pull_requests_blueprint_id_fkey"
 4649: 1938:             columns: ["blueprint_id"]
 4650: 1939:             isOneToOne: false
 4651: 1940:             referencedRelation: "blueprints"
 4652: 1941:             referencedColumns: ["id"]
 4653: 1942:           },
 4654: 1943:           {
 4655: 1944:             foreignKeyName: "pull_requests_branch_id_fkey"
 4656: 1945:             columns: ["branch_id"]
 4657: 1946:             isOneToOne: false
 4658: 1947:             referencedRelation: "blueprint_branches"
 4659: 1948:             referencedColumns: ["id"]
 4660: 1949:           },
 4661: 1950:           {
 4662: 1951:             foreignKeyName: "pull_requests_merged_by_fkey"
 4663: 1952:             columns: ["merged_by"]
 4664: 1953:             isOneToOne: false
 4665: 1954:             referencedRelation: "accounts"
 4666: 1955:             referencedColumns: ["id"]
 4667: 1956:           },
 4668: 1957:           {
 4669: 1958:             foreignKeyName: "pull_requests_reviewed_by_fkey"
 4670: 1959:             columns: ["reviewed_by"]
 4671: 1960:             isOneToOne: false
 4672: 1961:             referencedRelation: "accounts"
 4673: 1962:             referencedColumns: ["id"]
 4674: 1963:           },
 4675: 1964:           {
 4676: 1965:             foreignKeyName: "pull_requests_submitted_by_fkey"
 4677: 1966:             columns: ["submitted_by"]
 4678: 1967:             isOneToOne: false
 4679: 1968:             referencedRelation: "accounts"
 4680: 1969:             referencedColumns: ["id"]
 4681: 1970:           },
 4682: 1971:         ]
 4683: 1972:       }
 4684: 1973:       qc_photos: {
 4685: 1974:         Row: {
 4686: 1975:           caption: string | null
 4687: 1976:           document_id: string
 4688: 1977:           id: string
 4689: 1978:           photo_type: string | null
 4690: 1979:           qc_id: string
 4691: 1980:           sequence_order: number | null
 4692: 1981:           uploaded_at: string | null
 4693: 1982:           uploaded_by: string
 4694: 1983:         }
 4695: 1984:         Insert: {
 4696: 1985:           caption?: string | null
 4697: 1986:           document_id: string
 4698: 1987:           id?: string
 4699: 1988:           photo_type?: string | null
 4700: 1989:           qc_id: string
 4701: 1990:           sequence_order?: number | null
 4702: 1991:           uploaded_at?: string | null
 4703: 1992:           uploaded_by: string
 4704: 1993:         }
 4705: 1994:         Update: {
 4706: 1995:           caption?: string | null
 4707: 1996:           document_id?: string
 4708: 1997:           id?: string
 4709: 1998:           photo_type?: string | null
 4710: 1999:           qc_id?: string
 4711: 2000:           sequence_order?: number | null
 4712: 2001:           uploaded_at?: string | null
 4713: 2002:           uploaded_by?: string
 4714: 2003:         }
 4715: 2004:         Relationships: [
 4716: 2005:           {
 4717: 2006:             foreignKeyName: "qc_photos_document_id_fkey"
 4718: 2007:             columns: ["document_id"]
 4719: 2008:             isOneToOne: false
 4720: 2009:             referencedRelation: "documents"
 4721: 2010:             referencedColumns: ["id"]
 4722: 2011:           },
 4723: 2012:           {
 4724: 2013:             foreignKeyName: "qc_photos_qc_id_fkey"
 4725: 2014:             columns: ["qc_id"]
 4726: 2015:             isOneToOne: false
 4727: 2016:             referencedRelation: "quality_checks"
 4728: 2017:             referencedColumns: ["id"]
 4729: 2018:           },
 4730: 2019:           {
 4731: 2020:             foreignKeyName: "qc_photos_uploaded_by_fkey"
 4732: 2021:             columns: ["uploaded_by"]
 4733: 2022:             isOneToOne: false
 4734: 2023:             referencedRelation: "accounts"
 4735: 2024:             referencedColumns: ["id"]
 4736: 2025:           },
 4737: 2026:         ]
 4738: 2027:       }
 4739: 2028:       quality_checks: {
 4740: 2029:         Row: {
 4741: 2030:           check_items: Json
 4742: 2031:           check_type: string | null
 4743: 2032:           checked_at: string | null
 4744: 2033:           completed_at: string | null
 4745: 2034:           findings: string | null
 4746: 2035:           id: string
 4747: 2036:           inspector_id: string
 4748: 2037:           recommendations: string | null
 4749: 2038:           staging_id: string | null
 4750: 2039:           status: string | null
 4751: 2040:           task_id: string
 4752: 2041:         }
 4753: 2042:         Insert: {
 4754: 2043:           check_items: Json
 4755: 2044:           check_type?: string | null
 4756: 2045:           checked_at?: string | null
 4757: 2046:           completed_at?: string | null
 4758: 2047:           findings?: string | null
 4759: 2048:           id?: string
 4760: 2049:           inspector_id: string
 4761: 2050:           recommendations?: string | null
 4762: 2051:           staging_id?: string | null
 4763: 2052:           status?: string | null
 4764: 2053:           task_id: string
 4765: 2054:         }
 4766: 2055:         Update: {
 4767: 2056:           check_items?: Json
 4768: 2057:           check_type?: string | null
 4769: 2058:           checked_at?: string | null
 4770: 2059:           completed_at?: string | null
 4771: 2060:           findings?: string | null
 4772: 2061:           id?: string
 4773: 2062:           inspector_id?: string
 4774: 2063:           recommendations?: string | null
 4775: 2064:           staging_id?: string | null
 4776: 2065:           status?: string | null
 4777: 2066:           task_id?: string
 4778: 2067:         }
 4779: 2068:         Relationships: [
 4780: 2069:           {
 4781: 2070:             foreignKeyName: "quality_checks_inspector_id_fkey"
 4782: 2071:             columns: ["inspector_id"]
 4783: 2072:             isOneToOne: false
 4784: 2073:             referencedRelation: "accounts"
 4785: 2074:             referencedColumns: ["id"]
 4786: 2075:           },
 4787: 2076:           {
 4788: 2077:             foreignKeyName: "quality_checks_staging_id_fkey"
 4789: 2078:             columns: ["staging_id"]
 4790: 2079:             isOneToOne: false
 4791: 2080:             referencedRelation: "task_staging"
 4792: 2081:             referencedColumns: ["id"]
 4793: 2082:           },
 4794: 2083:           {
 4795: 2084:             foreignKeyName: "quality_checks_task_id_fkey"
 4796: 2085:             columns: ["task_id"]
 4797: 2086:             isOneToOne: false
 4798: 2087:             referencedRelation: "tasks"
 4799: 2088:             referencedColumns: ["id"]
 4800: 2089:           },
 4801: 2090:         ]
 4802: 2091:       }
 4803: 2092:       report_photos: {
 4804: 2093:         Row: {
 4805: 2094:           caption: string | null
 4806: 2095:           document_id: string
 4807: 2096:           id: string
 4808: 2097:           photo_type: string | null
 4809: 2098:           report_id: string
 4810: 2099:           sequence_order: number | null
 4811: 2100:           uploaded_at: string | null
 4812: 2101:           uploaded_by: string
 4813: 2102:         }
 4814: 2103:         Insert: {
 4815: 2104:           caption?: string | null
 4816: 2105:           document_id: string
 4817: 2106:           id?: string
 4818: 2107:           photo_type?: string | null
 4819: 2108:           report_id: string
 4820: 2109:           sequence_order?: number | null
 4821: 2110:           uploaded_at?: string | null
 4822: 2111:           uploaded_by: string
 4823: 2112:         }
 4824: 2113:         Update: {
 4825: 2114:           caption?: string | null
 4826: 2115:           document_id?: string
 4827: 2116:           id?: string
 4828: 2117:           photo_type?: string | null
 4829: 2118:           report_id?: string
 4830: 2119:           sequence_order?: number | null
 4831: 2120:           uploaded_at?: string | null
 4832: 2121:           uploaded_by?: string
 4833: 2122:         }
 4834: 2123:         Relationships: [
 4835: 2124:           {
 4836: 2125:             foreignKeyName: "report_photos_document_id_fkey"
 4837: 2126:             columns: ["document_id"]
 4838: 2127:             isOneToOne: false
 4839: 2128:             referencedRelation: "documents"
 4840: 2129:             referencedColumns: ["id"]
 4841: 2130:           },
 4842: 2131:           {
 4843: 2132:             foreignKeyName: "report_photos_report_id_fkey"
 4844: 2133:             columns: ["report_id"]
 4845: 2134:             isOneToOne: false
 4846: 2135:             referencedRelation: "daily_reports"
 4847: 2136:             referencedColumns: ["id"]
 4848: 2137:           },
 4849: 2138:           {
 4850: 2139:             foreignKeyName: "report_photos_uploaded_by_fkey"
 4851: 2140:             columns: ["uploaded_by"]
 4852: 2141:             isOneToOne: false
 4853: 2142:             referencedRelation: "accounts"
 4854: 2143:             referencedColumns: ["id"]
 4855: 2144:           },
 4856: 2145:         ]
 4857: 2146:       }
 4858: 2147:       role_permissions: {
 4859: 2148:         Row: {
 4860: 2149:           created_at: string | null
 4861: 2150:           id: string
 4862: 2151:           permission_id: string
 4863: 2152:           role_id: string
 4864: 2153:         }
 4865: 2154:         Insert: {
 4866: 2155:           created_at?: string | null
 4867: 2156:           id?: string
 4868: 2157:           permission_id: string
 4869: 2158:           role_id: string
 4870: 2159:         }
 4871: 2160:         Update: {
 4872: 2161:           created_at?: string | null
 4873: 2162:           id?: string
 4874: 2163:           permission_id?: string
 4875: 2164:           role_id?: string
 4876: 2165:         }
 4877: 2166:         Relationships: [
 4878: 2167:           {
 4879: 2168:             foreignKeyName: "role_permissions_permission_id_fkey"
 4880: 2169:             columns: ["permission_id"]
 4881: 2170:             isOneToOne: false
 4882: 2171:             referencedRelation: "permissions"
 4883: 2172:             referencedColumns: ["id"]
 4884: 2173:           },
 4885: 2174:           {
 4886: 2175:             foreignKeyName: "role_permissions_role_id_fkey"
 4887: 2176:             columns: ["role_id"]
 4888: 2177:             isOneToOne: false
 4889: 2178:             referencedRelation: "roles"
 4890: 2179:             referencedColumns: ["id"]
 4891: 2180:           },
 4892: 2181:         ]
 4893: 2182:       }
 4894: 2183:       roles: {
 4895: 2184:         Row: {
 4896: 2185:           created_at: string | null
 4897: 2186:           description: string | null
 4898: 2187:           id: string
 4899: 2188:           is_system_role: boolean | null
 4900: 2189:           name: string
 4901: 2190:           updated_at: string | null
 4902: 2191:         }
 4903: 2192:         Insert: {
 4904: 2193:           created_at?: string | null
 4905: 2194:           description?: string | null
 4906: 2195:           id?: string
 4907: 2196:           is_system_role?: boolean | null
 4908: 2197:           name: string
 4909: 2198:           updated_at?: string | null
 4910: 2199:         }
 4911: 2200:         Update: {
 4912: 2201:           created_at?: string | null
 4913: 2202:           description?: string | null
 4914: 2203:           id?: string
 4915: 2204:           is_system_role?: boolean | null
 4916: 2205:           name?: string
 4917: 2206:           updated_at?: string | null
 4918: 2207:         }
 4919: 2208:         Relationships: []
 4920: 2209:       }
 4921: 2210:       settings: {
 4922: 2211:         Row: {
 4923: 2212:           created_at: string | null
 4924: 2213:           description: string | null
 4925: 2214:           id: string
 4926: 2215:           is_public: boolean | null
 4927: 2216:           scope_id: string | null
 4928: 2217:           setting_key: string
 4929: 2218:           setting_type: string | null
 4930: 2219:           setting_value: Json
 4931: 2220:           updated_at: string | null
 4932: 2221:           updated_by: string | null
 4933: 2222:         }
 4934: 2223:         Insert: {
 4935: 2224:           created_at?: string | null
 4936: 2225:           description?: string | null
 4937: 2226:           id?: string
 4938: 2227:           is_public?: boolean | null
 4939: 2228:           scope_id?: string | null
 4940: 2229:           setting_key: string
 4941: 2230:           setting_type?: string | null
 4942: 2231:           setting_value: Json
 4943: 2232:           updated_at?: string | null
 4944: 2233:           updated_by?: string | null
 4945: 2234:         }
 4946: 2235:         Update: {
 4947: 2236:           created_at?: string | null
 4948: 2237:           description?: string | null
 4949: 2238:           id?: string
 4950: 2239:           is_public?: boolean | null
 4951: 2240:           scope_id?: string | null
 4952: 2241:           setting_key?: string
 4953: 2242:           setting_type?: string | null
 4954: 2243:           setting_value?: Json
 4955: 2244:           updated_at?: string | null
 4956: 2245:           updated_by?: string | null
 4957: 2246:         }
 4958: 2247:         Relationships: [
 4959: 2248:           {
 4960: 2249:             foreignKeyName: "settings_updated_by_fkey"
 4961: 2250:             columns: ["updated_by"]
 4962: 2251:             isOneToOne: false
 4963: 2252:             referencedRelation: "accounts"
 4964: 2253:             referencedColumns: ["id"]
 4965: 2254:           },
 4966: 2255:         ]
 4967: 2256:       }
 4968: 2257:       task_assignments: {
 4969: 2258:         Row: {
 4970: 2259:           accepted_at: string | null
 4971: 2260:           assigned_at: string | null
 4972: 2261:           assigned_by: string
 4973: 2262:           assignee_id: string
 4974: 2263:           assignee_type: string
 4975: 2264:           assignment_note: string | null
 4976: 2265:           id: string
 4977: 2266:           task_id: string
 4978: 2267:         }
 4979: 2268:         Insert: {
 4980: 2269:           accepted_at?: string | null
 4981: 2270:           assigned_at?: string | null
 4982: 2271:           assigned_by: string
 4983: 2272:           assignee_id: string
 4984: 2273:           assignee_type: string
 4985: 2274:           assignment_note?: string | null
 4986: 2275:           id?: string
 4987: 2276:           task_id: string
 4988: 2277:         }
 4989: 2278:         Update: {
 4990: 2279:           accepted_at?: string | null
 4991: 2280:           assigned_at?: string | null
 4992: 2281:           assigned_by?: string
 4993: 2282:           assignee_id?: string
 4994: 2283:           assignee_type?: string
 4995: 2284:           assignment_note?: string | null
 4996: 2285:           id?: string
 4997: 2286:           task_id?: string
 4998: 2287:         }
 4999: 2288:         Relationships: [
 5000: 2289:           {
 5001: 2290:             foreignKeyName: "task_assignments_assigned_by_fkey"
 5002: 2291:             columns: ["assigned_by"]
 5003: 2292:             isOneToOne: false
 5004: 2293:             referencedRelation: "accounts"
 5005: 2294:             referencedColumns: ["id"]
 5006: 2295:           },
 5007: 2296:           {
 5008: 2297:             foreignKeyName: "task_assignments_assignee_id_fkey"
 5009: 2298:             columns: ["assignee_id"]
 5010: 2299:             isOneToOne: false
 5011: 2300:             referencedRelation: "accounts"
 5012: 2301:             referencedColumns: ["id"]
 5013: 2302:           },
 5014: 2303:           {
 5015: 2304:             foreignKeyName: "task_assignments_task_id_fkey"
 5016: 2305:             columns: ["task_id"]
 5017: 2306:             isOneToOne: false
 5018: 2307:             referencedRelation: "tasks"
 5019: 2308:             referencedColumns: ["id"]
 5020: 2309:           },
 5021: 2310:         ]
 5022: 2311:       }
 5023: 2312:       task_dependencies: {
 5024: 2313:         Row: {
 5025: 2314:           created_at: string | null
 5026: 2315:           dependency_type: string | null
 5027: 2316:           depends_on_task_id: string
 5028: 2317:           id: string
 5029: 2318:           lag_days: number | null
 5030: 2319:           task_id: string
 5031: 2320:         }
 5032: 2321:         Insert: {
 5033: 2322:           created_at?: string | null
 5034: 2323:           dependency_type?: string | null
 5035: 2324:           depends_on_task_id: string
 5036: 2325:           id?: string
 5037: 2326:           lag_days?: number | null
 5038: 2327:           task_id: string
 5039: 2328:         }
 5040: 2329:         Update: {
 5041: 2330:           created_at?: string | null
 5042: 2331:           dependency_type?: string | null
 5043: 2332:           depends_on_task_id?: string
 5044: 2333:           id?: string
 5045: 2334:           lag_days?: number | null
 5046: 2335:           task_id?: string
 5047: 2336:         }
 5048: 2337:         Relationships: [
 5049: 2338:           {
 5050: 2339:             foreignKeyName: "task_dependencies_depends_on_task_id_fkey"
 5051: 2340:             columns: ["depends_on_task_id"]
 5052: 2341:             isOneToOne: false
 5053: 2342:             referencedRelation: "tasks"
 5054: 2343:             referencedColumns: ["id"]
 5055: 2344:           },
 5056: 2345:           {
 5057: 2346:             foreignKeyName: "task_dependencies_task_id_fkey"
 5058: 2347:             columns: ["task_id"]
 5059: 2348:             isOneToOne: false
 5060: 2349:             referencedRelation: "tasks"
 5061: 2350:             referencedColumns: ["id"]
 5062: 2351:           },
 5063: 2352:         ]
 5064: 2353:       }
 5065: 2354:       task_lists: {
 5066: 2355:         Row: {
 5067: 2356:           account_id: string
 5068: 2357:           added_at: string | null
 5069: 2358:           id: string
 5070: 2359:           list_type: string | null
 5071: 2360:           task_id: string
 5072: 2361:         }
 5073: 2362:         Insert: {
 5074: 2363:           account_id: string
 5075: 2364:           added_at?: string | null
 5076: 2365:           id?: string
 5077: 2366:           list_type?: string | null
 5078: 2367:           task_id: string
 5079: 2368:         }
 5080: 2369:         Update: {
 5081: 2370:           account_id?: string
 5082: 2371:           added_at?: string | null
 5083: 2372:           id?: string
 5084: 2373:           list_type?: string | null
 5085: 2374:           task_id?: string
 5086: 2375:         }
 5087: 2376:         Relationships: [
 5088: 2377:           {
 5089: 2378:             foreignKeyName: "task_lists_account_id_fkey"
 5090: 2379:             columns: ["account_id"]
 5091: 2380:             isOneToOne: false
 5092: 2381:             referencedRelation: "accounts"
 5093: 2382:             referencedColumns: ["id"]
 5094: 2383:           },
 5095: 2384:           {
 5096: 2385:             foreignKeyName: "task_lists_task_id_fkey"
 5097: 2386:             columns: ["task_id"]
 5098: 2387:             isOneToOne: false
 5099: 2388:             referencedRelation: "tasks"
 5100: 2389:             referencedColumns: ["id"]
 5101: 2390:           },
 5102: 2391:         ]
 5103: 2392:       }
 5104: 2393:       task_staging: {
 5105: 2394:         Row: {
 5106: 2395:           can_withdraw: boolean | null
 5107: 2396:           confirmed_at: string | null
 5108: 2397:           expires_at: string
 5109: 2398:           id: string
 5110: 2399:           notes: string | null
 5111: 2400:           photos: Json | null
 5112: 2401:           staging_data: Json
 5113: 2402:           submitted_at: string | null
 5114: 2403:           submitted_by: string
 5115: 2404:           task_id: string
 5116: 2405:           withdrawn_at: string | null
 5117: 2406:         }
 5118: 2407:         Insert: {
 5119: 2408:           can_withdraw?: boolean | null
 5120: 2409:           confirmed_at?: string | null
 5121: 2410:           expires_at?: string
 5122: 2411:           id?: string
 5123: 2412:           notes?: string | null
 5124: 2413:           photos?: Json | null
 5125: 2414:           staging_data: Json
 5126: 2415:           submitted_at?: string | null
 5127: 2416:           submitted_by: string
 5128: 2417:           task_id: string
 5129: 2418:           withdrawn_at?: string | null
 5130: 2419:         }
 5131: 2420:         Update: {
 5132: 2421:           can_withdraw?: boolean | null
 5133: 2422:           confirmed_at?: string | null
 5134: 2423:           expires_at?: string
 5135: 2424:           id?: string
 5136: 2425:           notes?: string | null
 5137: 2426:           photos?: Json | null
 5138: 2427:           staging_data?: Json
 5139: 2428:           submitted_at?: string | null
 5140: 2429:           submitted_by?: string
 5141: 2430:           task_id?: string
 5142: 2431:           withdrawn_at?: string | null
 5143: 2432:         }
 5144: 2433:         Relationships: [
 5145: 2434:           {
 5146: 2435:             foreignKeyName: "task_staging_submitted_by_fkey"
 5147: 2436:             columns: ["submitted_by"]
 5148: 2437:             isOneToOne: false
 5149: 2438:             referencedRelation: "accounts"
 5150: 2439:             referencedColumns: ["id"]
 5151: 2440:           },
 5152: 2441:           {
 5153: 2442:             foreignKeyName: "task_staging_task_id_fkey"
 5154: 2443:             columns: ["task_id"]
 5155: 2444:             isOneToOne: false
 5156: 2445:             referencedRelation: "tasks"
 5157: 2446:             referencedColumns: ["id"]
 5158: 2447:           },
 5159: 2448:         ]
 5160: 2449:       }
 5161: 2450:       task_templates: {
 5162: 2451:         Row: {
 5163: 2452:           created_at: string | null
 5164: 2453:           created_by: string
 5165: 2454:           description: string | null
 5166: 2455:           id: string
 5167: 2456:           is_public: boolean | null
 5168: 2457:           name: string
 5169: 2458:           organization_id: string
 5170: 2459:           template_data: Json
 5171: 2460:           updated_at: string | null
 5172: 2461:           usage_count: number | null
 5173: 2462:         }
 5174: 2463:         Insert: {
 5175: 2464:           created_at?: string | null
 5176: 2465:           created_by: string
 5177: 2466:           description?: string | null
 5178: 2467:           id?: string
 5179: 2468:           is_public?: boolean | null
 5180: 2469:           name: string
 5181: 2470:           organization_id: string
 5182: 2471:           template_data: Json
 5183: 2472:           updated_at?: string | null
 5184: 2473:           usage_count?: number | null
 5185: 2474:         }
 5186: 2475:         Update: {
 5187: 2476:           created_at?: string | null
 5188: 2477:           created_by?: string
 5189: 2478:           description?: string | null
 5190: 2479:           id?: string
 5191: 2480:           is_public?: boolean | null
 5192: 2481:           name?: string
 5193: 2482:           organization_id?: string
 5194: 2483:           template_data?: Json
 5195: 2484:           updated_at?: string | null
 5196: 2485:           usage_count?: number | null
 5197: 2486:         }
 5198: 2487:         Relationships: [
 5199: 2488:           {
 5200: 2489:             foreignKeyName: "task_templates_created_by_fkey"
 5201: 2490:             columns: ["created_by"]
 5202: 2491:             isOneToOne: false
 5203: 2492:             referencedRelation: "accounts"
 5204: 2493:             referencedColumns: ["id"]
 5205: 2494:           },
 5206: 2495:           {
 5207: 2496:             foreignKeyName: "task_templates_organization_id_fkey"
 5208: 2497:             columns: ["organization_id"]
 5209: 2498:             isOneToOne: false
 5210: 2499:             referencedRelation: "accounts"
 5211: 2500:             referencedColumns: ["id"]
 5212: 2501:           },
 5213: 2502:         ]
 5214: 2503:       }
 5215: 2504:       tasks: {
 5216: 2505:         Row: {
 5217: 2506:           actual_end_date: string | null
 5218: 2507:           actual_hours: number | null
 5219: 2508:           actual_start_date: string | null
 5220: 2509:           blueprint_id: string
 5221: 2510:           branch_id: string | null
 5222: 2511:           contractor_fields: Json | null
 5223: 2512:           created_at: string | null
 5224: 2513:           created_by: string
 5225: 2514:           description: string | null
 5226: 2515:           estimated_hours: number | null
 5227: 2516:           id: string
 5228: 2517:           parent_task_id: string | null
 5229: 2518:           planned_end_date: string | null
 5230: 2519:           planned_start_date: string | null
 5231: 2520:           priority: string | null
 5232: 2521:           progress_percentage: number | null
 5233: 2522:           sequence_order: number | null
 5234: 2523:           status: string | null
 5235: 2524:           task_type: string | null
 5236: 2525:           title: string
 5237: 2526:           tree_level: number | null
 5238: 2527:           tree_path: unknown
 5239: 2528:           updated_at: string | null
 5240: 2529:         }
 5241: 2530:         Insert: {
 5242: 2531:           actual_end_date?: string | null
 5243: 2532:           actual_hours?: number | null
 5244: 2533:           actual_start_date?: string | null
 5245: 2534:           blueprint_id: string
 5246: 2535:           branch_id?: string | null
 5247: 2536:           contractor_fields?: Json | null
 5248: 2537:           created_at?: string | null
 5249: 2538:           created_by: string
 5250: 2539:           description?: string | null
 5251: 2540:           estimated_hours?: number | null
 5252: 2541:           id?: string
 5253: 2542:           parent_task_id?: string | null
 5254: 2543:           planned_end_date?: string | null
 5255: 2544:           planned_start_date?: string | null
 5256: 2545:           priority?: string | null
 5257: 2546:           progress_percentage?: number | null
 5258: 2547:           sequence_order?: number | null
 5259: 2548:           status?: string | null
 5260: 2549:           task_type?: string | null
 5261: 2550:           title: string
 5262: 2551:           tree_level?: number | null
 5263: 2552:           tree_path?: unknown
 5264: 2553:           updated_at?: string | null
 5265: 2554:         }
 5266: 2555:         Update: {
 5267: 2556:           actual_end_date?: string | null
 5268: 2557:           actual_hours?: number | null
 5269: 2558:           actual_start_date?: string | null
 5270: 2559:           blueprint_id?: string
 5271: 2560:           branch_id?: string | null
 5272: 2561:           contractor_fields?: Json | null
 5273: 2562:           created_at?: string | null
 5274: 2563:           created_by?: string
 5275: 2564:           description?: string | null
 5276: 2565:           estimated_hours?: number | null
 5277: 2566:           id?: string
 5278: 2567:           parent_task_id?: string | null
 5279: 2568:           planned_end_date?: string | null
 5280: 2569:           planned_start_date?: string | null
 5281: 2570:           priority?: string | null
 5282: 2571:           progress_percentage?: number | null
 5283: 2572:           sequence_order?: number | null
 5284: 2573:           status?: string | null
 5285: 2574:           task_type?: string | null
 5286: 2575:           title?: string
 5287: 2576:           tree_level?: number | null
 5288: 2577:           tree_path?: unknown
 5289: 2578:           updated_at?: string | null
 5290: 2579:         }
 5291: 2580:         Relationships: [
 5292: 2581:           {
 5293: 2582:             foreignKeyName: "tasks_blueprint_id_fkey"
 5294: 2583:             columns: ["blueprint_id"]
 5295: 2584:             isOneToOne: false
 5296: 2585:             referencedRelation: "blueprints"
 5297: 2586:             referencedColumns: ["id"]
 5298: 2587:           },
 5299: 2588:           {
 5300: 2589:             foreignKeyName: "tasks_branch_id_fkey"
 5301: 2590:             columns: ["branch_id"]
 5302: 2591:             isOneToOne: false
 5303: 2592:             referencedRelation: "blueprint_branches"
 5304: 2593:             referencedColumns: ["id"]
 5305: 2594:           },
 5306: 2595:           {
 5307: 2596:             foreignKeyName: "tasks_created_by_fkey"
 5308: 2597:             columns: ["created_by"]
 5309: 2598:             isOneToOne: false
 5310: 2599:             referencedRelation: "accounts"
 5311: 2600:             referencedColumns: ["id"]
 5312: 2601:           },
 5313: 2602:           {
 5314: 2603:             foreignKeyName: "tasks_parent_task_id_fkey"
 5315: 2604:             columns: ["parent_task_id"]
 5316: 2605:             isOneToOne: false
 5317: 2606:             referencedRelation: "tasks"
 5318: 2607:             referencedColumns: ["id"]
 5319: 2608:           },
 5320: 2609:         ]
 5321: 2610:       }
 5322: 2611:       team_members: {
 5323: 2612:         Row: {
 5324: 2613:           account_id: string
 5325: 2614:           id: string
 5326: 2615:           joined_at: string | null
 5327: 2616:           role: string | null
 5328: 2617:           team_id: string
 5329: 2618:         }
 5330: 2619:         Insert: {
 5331: 2620:           account_id: string
 5332: 2621:           id?: string
 5333: 2622:           joined_at?: string | null
 5334: 2623:           role?: string | null
 5335: 2624:           team_id: string
 5336: 2625:         }
 5337: 2626:         Update: {
 5338: 2627:           account_id?: string
 5339: 2628:           id?: string
 5340: 2629:           joined_at?: string | null
 5341: 2630:           role?: string | null
 5342: 2631:           team_id?: string
 5343: 2632:         }
 5344: 2633:         Relationships: [
 5345: 2634:           {
 5346: 2635:             foreignKeyName: "team_members_account_id_fkey"
 5347: 2636:             columns: ["account_id"]
 5348: 2637:             isOneToOne: false
 5349: 2638:             referencedRelation: "accounts"
 5350: 2639:             referencedColumns: ["id"]
 5351: 2640:           },
 5352: 2641:           {
 5353: 2642:             foreignKeyName: "team_members_team_id_fkey"
 5354: 2643:             columns: ["team_id"]
 5355: 2644:             isOneToOne: false
 5356: 2645:             referencedRelation: "teams"
 5357: 2646:             referencedColumns: ["id"]
 5358: 2647:           },
 5359: 2648:         ]
 5360: 2649:       }
 5361: 2650:       teams: {
 5362: 2651:         Row: {
 5363: 2652:           avatar_url: string | null
 5364: 2653:           created_at: string | null
 5365: 2654:           created_by: string
 5366: 2655:           description: string | null
 5367: 2656:           id: string
 5368: 2657:           name: string
 5369: 2658:           organization_id: string
 5370: 2659:           updated_at: string | null
 5371: 2660:         }
 5372: 2661:         Insert: {
 5373: 2662:           avatar_url?: string | null
 5374: 2663:           created_at?: string | null
 5375: 2664:           created_by: string
 5376: 2665:           description?: string | null
 5377: 2666:           id?: string
 5378: 2667:           name: string
 5379: 2668:           organization_id: string
 5380: 2669:           updated_at?: string | null
 5381: 2670:         }
 5382: 2671:         Update: {
 5383: 2672:           avatar_url?: string | null
 5384: 2673:           created_at?: string | null
 5385: 2674:           created_by?: string
 5386: 2675:           description?: string | null
 5387: 2676:           id?: string
 5388: 2677:           name?: string
 5389: 2678:           organization_id?: string
 5390: 2679:           updated_at?: string | null
 5391: 2680:         }
 5392: 2681:         Relationships: [
 5393: 2682:           {
 5394: 2683:             foreignKeyName: "teams_created_by_fkey"
 5395: 2684:             columns: ["created_by"]
 5396: 2685:             isOneToOne: false
 5397: 2686:             referencedRelation: "accounts"
 5398: 2687:             referencedColumns: ["id"]
 5399: 2688:           },
 5400: 2689:           {
 5401: 2690:             foreignKeyName: "teams_organization_id_fkey"
 5402: 2691:             columns: ["organization_id"]
 5403: 2692:             isOneToOne: false
 5404: 2693:             referencedRelation: "accounts"
 5405: 2694:             referencedColumns: ["id"]
 5406: 2695:           },
 5407: 2696:         ]
 5408: 2697:       }
 5409: 2698:       todo_status_tracking: {
 5410: 2699:         Row: {
 5411: 2700:           change_note: string | null
 5412: 2701:           changed_at: string | null
 5413: 2702:           changed_by: string | null
 5414: 2703:           from_status: string | null
 5415: 2704:           id: string
 5416: 2705:           to_status: string
 5417: 2706:           todo_id: string
 5418: 2707:         }
 5419: 2708:         Insert: {
 5420: 2709:           change_note?: string | null
 5421: 2710:           changed_at?: string | null
 5422: 2711:           changed_by?: string | null
 5423: 2712:           from_status?: string | null
 5424: 2713:           id?: string
 5425: 2714:           to_status: string
 5426: 2715:           todo_id: string
 5427: 2716:         }
 5428: 2717:         Update: {
 5429: 2718:           change_note?: string | null
 5430: 2719:           changed_at?: string | null
 5431: 2720:           changed_by?: string | null
 5432: 2721:           from_status?: string | null
 5433: 2722:           id?: string
 5434: 2723:           to_status?: string
 5435: 2724:           todo_id?: string
 5436: 2725:         }
 5437: 2726:         Relationships: [
 5438: 2727:           {
 5439: 2728:             foreignKeyName: "todo_status_tracking_changed_by_fkey"
 5440: 2729:             columns: ["changed_by"]
 5441: 2730:             isOneToOne: false
 5442: 2731:             referencedRelation: "accounts"
 5443: 2732:             referencedColumns: ["id"]
 5444: 2733:           },
 5445: 2734:           {
 5446: 2735:             foreignKeyName: "todo_status_tracking_todo_id_fkey"
 5447: 2736:             columns: ["todo_id"]
 5448: 2737:             isOneToOne: false
 5449: 2738:             referencedRelation: "personal_todos"
 5450: 2739:             referencedColumns: ["id"]
 5451: 2740:           },
 5452: 2741:         ]
 5453: 2742:       }
 5454: 2743:       user_roles: {
 5455: 2744:         Row: {
 5456: 2745:           account_id: string
 5457: 2746:           blueprint_id: string | null
 5458: 2747:           branch_id: string | null
 5459: 2748:           granted_at: string | null
 5460: 2749:           granted_by: string | null
 5461: 2750:           id: string
 5462: 2751:           role_id: string
 5463: 2752:         }
 5464: 2753:         Insert: {
 5465: 2754:           account_id: string
 5466: 2755:           blueprint_id?: string | null
 5467: 2756:           branch_id?: string | null
 5468: 2757:           granted_at?: string | null
 5469: 2758:           granted_by?: string | null
 5470: 2759:           id?: string
 5471: 2760:           role_id: string
 5472: 2761:         }
 5473: 2762:         Update: {
 5474: 2763:           account_id?: string
 5475: 2764:           blueprint_id?: string | null
 5476: 2765:           branch_id?: string | null
 5477: 2766:           granted_at?: string | null
 5478: 2767:           granted_by?: string | null
 5479: 2768:           id?: string
 5480: 2769:           role_id?: string
 5481: 2770:         }
 5482: 2771:         Relationships: [
 5483: 2772:           {
 5484: 2773:             foreignKeyName: "user_roles_account_id_fkey"
 5485: 2774:             columns: ["account_id"]
 5486: 2775:             isOneToOne: false
 5487: 2776:             referencedRelation: "accounts"
 5488: 2777:             referencedColumns: ["id"]
 5489: 2778:           },
 5490: 2779:           {
 5491: 2780:             foreignKeyName: "user_roles_blueprint_id_fkey"
 5492: 2781:             columns: ["blueprint_id"]
 5493: 2782:             isOneToOne: false
 5494: 2783:             referencedRelation: "blueprints"
 5495: 2784:             referencedColumns: ["id"]
 5496: 2785:           },
 5497: 2786:           {
 5498: 2787:             foreignKeyName: "user_roles_branch_id_fkey"
 5499: 2788:             columns: ["branch_id"]
 5500: 2789:             isOneToOne: false
 5501: 2790:             referencedRelation: "blueprint_branches"
 5502: 2791:             referencedColumns: ["id"]
 5503: 2792:           },
 5504: 2793:           {
 5505: 2794:             foreignKeyName: "user_roles_granted_by_fkey"
 5506: 2795:             columns: ["granted_by"]
 5507: 2796:             isOneToOne: false
 5508: 2797:             referencedRelation: "accounts"
 5509: 2798:             referencedColumns: ["id"]
 5510: 2799:           },
 5511: 2800:           {
 5512: 2801:             foreignKeyName: "user_roles_role_id_fkey"
 5513: 2802:             columns: ["role_id"]
 5514: 2803:             isOneToOne: false
 5515: 2804:             referencedRelation: "roles"
 5516: 2805:             referencedColumns: ["id"]
 5517: 2806:           },
 5518: 2807:         ]
 5519: 2808:       }
 5520: 2809:       weather_cache: {
 5521: 2810:         Row: {
 5522: 2811:           api_source: string | null
 5523: 2812:           expires_at: string
 5524: 2813:           fetched_at: string | null
 5525: 2814:           forecast_date: string
 5526: 2815:           id: string
 5527: 2816:           location: string
 5528: 2817:           weather_data: Json
 5529: 2818:         }
 5530: 2819:         Insert: {
 5531: 2820:           api_source?: string | null
 5532: 2821:           expires_at: string
 5533: 2822:           fetched_at?: string | null
 5534: 2823:           forecast_date: string
 5535: 2824:           id?: string
 5536: 2825:           location: string
 5537: 2826:           weather_data: Json
 5538: 2827:         }
 5539: 2828:         Update: {
 5540: 2829:           api_source?: string | null
 5541: 2830:           expires_at?: string
 5542: 2831:           fetched_at?: string | null
 5543: 2832:           forecast_date?: string
 5544: 2833:           id?: string
 5545: 2834:           location?: string
 5546: 2835:           weather_data?: Json
 5547: 2836:         }
 5548: 2837:         Relationships: []
 5549: 2838:       }
 5550: 2839:     }
 5551: 2840:     Views: {
 5552: 2841:       [_ in never]: never
 5553: 2842:     }
 5554: 2843:     Functions: {
 5555: 2844:       text2ltree: { Args: { "": string }; Returns: unknown }
 5556: 2845:     }
 5557: 2846:     Enums: {
 5558: 2847:       [_ in never]: never
 5559: 2848:     }
 5560: 2849:     CompositeTypes: {
 5561: 2850:       [_ in never]: never
 5562: 2851:     }
 5563: 2852:   }
 5564: 2853: }
 5565: 2854: 
 5566: 2855: type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
 5567: 2856: 
 5568: 2857: type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]
 5569: 2858: 
 5570: 2859: export type Tables<
 5571: 2860:   DefaultSchemaTableNameOrOptions extends
 5572: 2861:     | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
 5573: 2862:     | { schema: keyof DatabaseWithoutInternals },
 5574: 2863:   TableName extends DefaultSchemaTableNameOrOptions extends {
 5575: 2864:     schema: keyof DatabaseWithoutInternals
 5576: 2865:   }
 5577: 2866:     ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
 5578: 2867:         DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
 5579: 2868:     : never = never,
 5580: 2869: > = DefaultSchemaTableNameOrOptions extends {
 5581: 2870:   schema: keyof DatabaseWithoutInternals
 5582: 2871: }
 5583: 2872:   ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
 5584: 2873:       DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
 5585: 2874:       Row: infer R
 5586: 2875:     }
 5587: 2876:     ? R
 5588: 2877:     : never
 5589: 2878:   : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
 5590: 2879:         DefaultSchema["Views"])
 5591: 2880:     ? (DefaultSchema["Tables"] &
 5592: 2881:         DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
 5593: 2882:         Row: infer R
 5594: 2883:       }
 5595: 2884:       ? R
 5596: 2885:       : never
 5597: 2886:     : never
 5598: 2887: 
 5599: 2888: export type TablesInsert<
 5600: 2889:   DefaultSchemaTableNameOrOptions extends
 5601: 2890:     | keyof DefaultSchema["Tables"]
 5602: 2891:     | { schema: keyof DatabaseWithoutInternals },
 5603: 2892:   TableName extends DefaultSchemaTableNameOrOptions extends {
 5604: 2893:     schema: keyof DatabaseWithoutInternals
 5605: 2894:   }
 5606: 2895:     ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
 5607: 2896:     : never = never,
 5608: 2897: > = DefaultSchemaTableNameOrOptions extends {
 5609: 2898:   schema: keyof DatabaseWithoutInternals
 5610: 2899: }
 5611: 2900:   ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
 5612: 2901:       Insert: infer I
 5613: 2902:     }
 5614: 2903:     ? I
 5615: 2904:     : never
 5616: 2905:   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
 5617: 2906:     ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
 5618: 2907:         Insert: infer I
 5619: 2908:       }
 5620: 2909:       ? I
 5621: 2910:       : never
 5622: 2911:     : never
 5623: 2912: 
 5624: 2913: export type TablesUpdate<
 5625: 2914:   DefaultSchemaTableNameOrOptions extends
 5626: 2915:     | keyof DefaultSchema["Tables"]
 5627: 2916:     | { schema: keyof DatabaseWithoutInternals },
 5628: 2917:   TableName extends DefaultSchemaTableNameOrOptions extends {
 5629: 2918:     schema: keyof DatabaseWithoutInternals
 5630: 2919:   }
 5631: 2920:     ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
 5632: 2921:     : never = never,
 5633: 2922: > = DefaultSchemaTableNameOrOptions extends {
 5634: 2923:   schema: keyof DatabaseWithoutInternals
 5635: 2924: }
 5636: 2925:   ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
 5637: 2926:       Update: infer U
 5638: 2927:     }
 5639: 2928:     ? U
 5640: 2929:     : never
 5641: 2930:   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
 5642: 2931:     ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
 5643: 2932:         Update: infer U
 5644: 2933:       }
 5645: 2934:       ? U
 5646: 2935:       : never
 5647: 2936:     : never
 5648: 2937: 
 5649: 2938: export type Enums<
 5650: 2939:   DefaultSchemaEnumNameOrOptions extends
 5651: 2940:     | keyof DefaultSchema["Enums"]
 5652: 2941:     | { schema: keyof DatabaseWithoutInternals },
 5653: 2942:   EnumName extends DefaultSchemaEnumNameOrOptions extends {
 5654: 2943:     schema: keyof DatabaseWithoutInternals
 5655: 2944:   }
 5656: 2945:     ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
 5657: 2946:     : never = never,
 5658: 2947: > = DefaultSchemaEnumNameOrOptions extends {
 5659: 2948:   schema: keyof DatabaseWithoutInternals
 5660: 2949: }
 5661: 2950:   ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
 5662: 2951:   : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
 5663: 2952:     ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
 5664: 2953:     : never
 5665: 2954: 
 5666: 2955: export type CompositeTypes<
 5667: 2956:   PublicCompositeTypeNameOrOptions extends
 5668: 2957:     | keyof DefaultSchema["CompositeTypes"]
 5669: 2958:     | { schema: keyof DatabaseWithoutInternals },
 5670: 2959:   CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
 5671: 2960:     schema: keyof DatabaseWithoutInternals
 5672: 2961:   }
 5673: 2962:     ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
 5674: 2963:     : never = never,
 5675: 2964: > = PublicCompositeTypeNameOrOptions extends {
 5676: 2965:   schema: keyof DatabaseWithoutInternals
 5677: 2966: }
 5678: 2967:   ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
 5679: 2968:   : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
 5680: 2969:     ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
 5681: 2970:     : never
 5682: 2971: 
 5683: 2972: export const Constants = {
 5684: 2973:   public: {
 5685: 2974:     Enums: {},
 5686: 2975:   },
 5687: 2976: } as const
 5688: ````
 5689: 
 5690: ## File: src/app/core/infra/utils/index.ts
 5691: ````typescript
 5692: 1: /**
 5693: 2:  * 工具函数模块导出
 5694: 3:  */
 5695: 4: export * from './transformers';
 5696: ````
 5697: 
 5698: ## File: src/app/core/infra/utils/transformers.ts
 5699: ````typescript
 5700:   1: /**
 5701:   2:  * 数据转换工具
 5702:   3:  * 
 5703:   4:  * 提供 snake_case ↔ camelCase 转换功能
 5704:   5:  * 用于数据库字段名（snake_case）与 TypeScript 属性名（camelCase）之间的映射
 5705:   6:  */
 5706:   7: 
 5707:   8: /**
 5708:   9:  * 将 snake_case 转换为 camelCase
 5709:  10:  */
 5710:  11: function toCamelCase(str: string): string {
 5711:  12:   return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
 5712:  13: }
 5713:  14: 
 5714:  15: /**
 5715:  16:  * 将 camelCase 转换为 snake_case
 5716:  17:  */
 5717:  18: function toSnakeCase(str: string): string {
 5718:  19:   return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
 5719:  20: }
 5720:  21: 
 5721:  22: /**
 5722:  23:  * 递归转换对象的键名从 snake_case 到 camelCase
 5723:  24:  */
 5724:  25: function convertKeysToCamelCase<T>(obj: any): T {
 5725:  26:   if (obj === null || obj === undefined) {
 5726:  27:     return obj;
 5727:  28:   }
 5728:  29: 
 5729:  30:   if (Array.isArray(obj)) {
 5730:  31:     return obj.map(item => convertKeysToCamelCase(item)) as T;
 5731:  32:   }
 5732:  33: 
 5733:  34:   if (typeof obj === 'object' && obj.constructor === Object) {
 5734:  35:     const converted: any = {};
 5735:  36:     for (const key in obj) {
 5736:  37:       if (Object.prototype.hasOwnProperty.call(obj, key)) {
 5737:  38:         const camelKey = toCamelCase(key);
 5738:  39:         converted[camelKey] = convertKeysToCamelCase(obj[key]);
 5739:  40:       }
 5740:  41:     }
 5741:  42:     return converted as T;
 5742:  43:   }
 5743:  44: 
 5744:  45:   return obj;
 5745:  46: }
 5746:  47: 
 5747:  48: /**
 5748:  49:  * 递归转换对象的键名从 camelCase 到 snake_case
 5749:  50:  */
 5750:  51: function convertKeysToSnakeCase<T extends Record<string, any>>(obj: T): Record<string, any> {
 5751:  52:   if (obj === null || obj === undefined) {
 5752:  53:     return obj;
 5753:  54:   }
 5754:  55: 
 5755:  56:   if (Array.isArray(obj)) {
 5756:  57:     return obj.map(item => convertKeysToSnakeCase(item));
 5757:  58:   }
 5758:  59: 
 5759:  60:   if (typeof obj === 'object' && obj.constructor === Object) {
 5760:  61:     const converted: Record<string, any> = {};
 5761:  62:     for (const key in obj) {
 5762:  63:       if (Object.prototype.hasOwnProperty.call(obj, key)) {
 5763:  64:         const snakeKey = toSnakeCase(key);
 5764:  65:         converted[snakeKey] = convertKeysToSnakeCase(obj[key]);
 5765:  66:       }
 5766:  67:     }
 5767:  68:     return converted;
 5768:  69:   }
 5769:  70: 
 5770:  71:   return obj;
 5771:  72: }
 5772:  73: 
 5773:  74: /**
 5774:  75:  * 将数据库数据（snake_case）转换为应用数据（camelCase）
 5775:  76:  * 
 5776:  77:  * @param data 数据库数据
 5777:  78:  * @returns 转换后的数据
 5778:  79:  * 
 5779:  80:  * @example
 5780:  81:  * ```typescript
 5781:  82:  * const dbData = { user_id: '123', created_at: '2025-01-01' };
 5782:  83:  * const appData = toCamelCase(dbData);
 5783:  84:  * // { userId: '123', createdAt: '2025-01-01' }
 5784:  85:  * ```
 5785:  86:  */
 5786:  87: export function toCamelCaseData<T>(data: any): T {
 5787:  88:   return convertKeysToCamelCase<T>(data);
 5788:  89: }
 5789:  90: 
 5790:  91: /**
 5791:  92:  * 将应用数据（camelCase）转换为数据库数据（snake_case）
 5792:  93:  * 
 5793:  94:  * @param data 应用数据
 5794:  95:  * @returns 转换后的数据
 5795:  96:  * 
 5796:  97:  * @example
 5797:  98:  * ```typescript
 5798:  99:  * const appData = { userId: '123', createdAt: '2025-01-01' };
 5799: 100:  * const dbData = toSnakeCaseData(appData);
 5800: 101:  * // { user_id: '123', created_at: '2025-01-01' }
 5801: 102:  * ```
 5802: 103:  */
 5803: 104: export function toSnakeCaseData<T extends Record<string, any>>(data: T): Record<string, any> {
 5804: 105:   return convertKeysToSnakeCase(data);
 5805: 106: }
 5806: ````
 5807: 
 5808: ## File: src/app/core/net/default.interceptor.ts
 5809: ````typescript
 5810:  1: import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponseBase } from '@angular/common/http';
 5811:  2: import { Injector, inject } from '@angular/core';
 5812:  3: import { IGNORE_BASE_URL } from '@delon/theme';
 5813:  4: import { environment } from '@env/environment';
 5814:  5: import { Observable, of, throwError, mergeMap } from 'rxjs';
 5815:  6: 
 5816:  7: import { ReThrowHttpError, checkStatus, getAdditionalHeaders, toLogin } from './helper';
 5817:  8: import { tryRefreshToken } from './refresh-token';
 5818:  9: 
 5819: 10: function handleData(injector: Injector, ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
 5820: 11:   checkStatus(injector, ev);
 5821: 12:   // 业务处理：一些通用操作
 5822: 13:   switch (ev.status) {
 5823: 14:     case 200:
 5824: 15:       // 业务层级错误处理，以下是假定restful有一套统一输出格式（指不管成功与否都有相应的数据格式）情况下进行处理
 5825: 16:       // 例如响应内容：
 5826: 17:       //  错误内容：{ status: 1, msg: '非法参数' }
 5827: 18:       //  正确内容：{ status: 0, response: {  } }
 5828: 19:       // 则以下代码片断可直接适用
 5829: 20:       // if (ev instanceof HttpResponse) {
 5830: 21:       //   const body = ev.body;
 5831: 22:       //   if (body && body.status !== 0) {
 5832: 23:       //     const customError = req.context.get(CUSTOM_ERROR);
 5833: 24:       //     if (customError) injector.get(NzMessageService).error(body.msg);
 5834: 25:       //     return customError ? throwError(() => ({ body, _throw: true }) as ReThrowHttpError) : of({});
 5835: 26:       //   } else {
 5836: 27:       //     // 返回原始返回体
 5837: 28:       //     if (req.context.get(RAW_BODY) || ev.body instanceof Blob) {
 5838: 29:       //       return of(ev);
 5839: 30:       //     }
 5840: 31:       //     // 重新修改 `body` 内容为 `response` 内容，对于绝大多数场景已经无须再关心业务状态码
 5841: 32:       //     return of(new HttpResponse({ ...ev, body: body.response } as any));
 5842: 33:       //     // 或者依然保持完整的格式
 5843: 34:       //     return of(ev);
 5844: 35:       //   }
 5845: 36:       // }
 5846: 37:       break;
 5847: 38:     case 401:
 5848: 39:       if (environment.api.refreshTokenEnabled && environment.api.refreshTokenType === 're-request') {
 5849: 40:         return tryRefreshToken(injector, ev, req, next);
 5850: 41:       }
 5851: 42:       toLogin(injector);
 5852: 43:       break;
 5853: 44:     case 403:
 5854: 45:     case 404:
 5855: 46:     case 500:
 5856: 47:       // goTo(injector, `/exception/${ev.status}?url=${req.urlWithParams}`);
 5857: 48:       break;
 5858: 49:     default:
 5859: 50:       if (ev instanceof HttpErrorResponse) {
 5860: 51:         console.warn('未可知错误，大部分是由于后端不支持跨域CORS或无效配置引起，请参考 https://ng-alain.com/docs/server 解决跨域问题', ev);
 5861: 52:       }
 5862: 53:       break;
 5863: 54:   }
 5864: 55:   if (ev instanceof HttpErrorResponse) {
 5865: 56:     return throwError(() => ev);
 5866: 57:   } else if ((ev as unknown as ReThrowHttpError)._throw === true) {
 5867: 58:     return throwError(() => (ev as unknown as ReThrowHttpError).body);
 5868: 59:   } else {
 5869: 60:     return of(ev);
 5870: 61:   }
 5871: 62: }
 5872: 63: 
 5873: 64: export const defaultInterceptor: HttpInterceptorFn = (req, next) => {
 5874: 65:   // 统一加上服务端前缀
 5875: 66:   let url = req.url;
 5876: 67:   if (!req.context.get(IGNORE_BASE_URL) && !url.startsWith('https://') && !url.startsWith('http://')) {
 5877: 68:     const { baseUrl } = environment.api;
 5878: 69:     url = baseUrl + (baseUrl.endsWith('/') && url.startsWith('/') ? url.substring(1) : url);
 5879: 70:   }
 5880: 71:   const newReq = req.clone({ url, setHeaders: getAdditionalHeaders(req.headers) });
 5881: 72:   const injector = inject(Injector);
 5882: 73: 
 5883: 74:   return next(newReq).pipe(
 5884: 75:     mergeMap(ev => {
 5885: 76:       // 允许统一对请求错误处理
 5886: 77:       if (ev instanceof HttpResponseBase) {
 5887: 78:         return handleData(injector, ev, newReq, next);
 5888: 79:       }
 5889: 80:       // 若一切都正常，则后续操作
 5890: 81:       return of(ev);
 5891: 82:     })
 5892: 83:     // catchError((err: HttpErrorResponse) => handleData(injector, err, newReq, next))
 5893: 84:   );
 5894: 85: };
 5895: ````
 5896: 
 5897: ## File: src/app/core/net/helper.ts
 5898: ````typescript
 5899:  1: import { HttpHeaders, HttpResponseBase } from '@angular/common/http';
 5900:  2: import { Injector, inject } from '@angular/core';
 5901:  3: import { Router } from '@angular/router';
 5902:  4: import { DA_SERVICE_TOKEN } from '@delon/auth';
 5903:  5: import { ALAIN_I18N_TOKEN } from '@delon/theme';
 5904:  6: import { NzNotificationService } from 'ng-zorro-antd/notification';
 5905:  7: 
 5906:  8: export interface ReThrowHttpError {
 5907:  9:   body: any;
 5908: 10:   _throw: true;
 5909: 11: }
 5910: 12: 
 5911: 13: export const CODEMESSAGE: Record<number, string> = {
 5912: 14:   200: '服务器成功返回请求的数据。',
 5913: 15:   201: '新建或修改数据成功。',
 5914: 16:   202: '一个请求已经进入后台排队（异步任务）。',
 5915: 17:   204: '删除数据成功。',
 5916: 18:   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
 5917: 19:   401: '用户没有权限（令牌、用户名、密码错误）。',
 5918: 20:   403: '用户得到授权，但是访问是被禁止的。',
 5919: 21:   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
 5920: 22:   406: '请求的格式不可得。',
 5921: 23:   410: '请求的资源被永久删除，且不会再得到的。',
 5922: 24:   422: '当创建一个对象时，发生一个验证错误。',
 5923: 25:   500: '服务器发生错误，请检查服务器。',
 5924: 26:   502: '网关错误。',
 5925: 27:   503: '服务不可用，服务器暂时过载或维护。',
 5926: 28:   504: '网关超时。'
 5927: 29: };
 5928: 30: 
 5929: 31: export function goTo(injector: Injector, url: string): void {
 5930: 32:   setTimeout(() => injector.get(Router).navigateByUrl(url));
 5931: 33: }
 5932: 34: 
 5933: 35: export function toLogin(injector: Injector): void {
 5934: 36:   injector.get(NzNotificationService).error(`未登录或登录已过期，请重新登录。`, ``);
 5935: 37:   goTo(injector, injector.get(DA_SERVICE_TOKEN).login_url!);
 5936: 38: }
 5937: 39: 
 5938: 40: export function getAdditionalHeaders(headers?: HttpHeaders): Record<string, string> {
 5939: 41:   const res: Record<string, string> = {};
 5940: 42:   const lang = inject(ALAIN_I18N_TOKEN).currentLang;
 5941: 43:   if (!headers?.has('Accept-Language') && lang) {
 5942: 44:     res['Accept-Language'] = lang;
 5943: 45:   }
 5944: 46: 
 5945: 47:   return res;
 5946: 48: }
 5947: 49: 
 5948: 50: export function checkStatus(injector: Injector, ev: HttpResponseBase): void {
 5949: 51:   if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
 5950: 52:     return;
 5951: 53:   }
 5952: 54: 
 5953: 55:   const errortext = CODEMESSAGE[ev.status] || ev.statusText;
 5954: 56:   injector.get(NzNotificationService).error(`请求错误 ${ev.status}: ${ev.url}`, errortext);
 5955: 57: }
 5956: ````
 5957: 
 5958: ## File: src/app/core/net/index.ts
 5959: ````typescript
 5960: 1: export { provideBindAuthRefresh } from './refresh-token';
 5961: 2: export * from './default.interceptor';
 5962: ````
 5963: 
 5964: ## File: src/app/core/net/refresh-token.ts
 5965: ````typescript
 5966:   1: import { HttpClient, HttpHandlerFn, HttpRequest, HttpResponseBase } from '@angular/common/http';
 5967:   2: import { EnvironmentProviders, Injector, inject, provideAppInitializer } from '@angular/core';
 5968:   3: import { DA_SERVICE_TOKEN } from '@delon/auth';
 5969:   4: import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError, map } from 'rxjs';
 5970:   5: 
 5971:   6: import { toLogin } from './helper';
 5972:   7: import { SupabaseAuthAdapterService } from '../supabase';
 5973:   8: 
 5974:   9: let refreshToking = false;
 5975:  10: let refreshToken$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
 5976:  11: 
 5977:  12: /**
 5978:  13:  * 重新附加新 Token 信息
 5979:  14:  *
 5980:  15:  * > 由于已经发起的请求，不会再走一遍 `@delon/auth` 因此需要结合业务情况重新附加新的 Token
 5981:  16:  */
 5982:  17: function reAttachToken(injector: Injector, req: HttpRequest<any>): HttpRequest<any> {
 5983:  18:   const token = injector.get(DA_SERVICE_TOKEN).get()?.token;
 5984:  19:   return req.clone({
 5985:  20:     setHeaders: {
 5986:  21:       token: `Bearer ${token}`
 5987:  22:     }
 5988:  23:   });
 5989:  24: }
 5990:  25: 
 5991:  26: function refreshTokenRequest(injector: Injector): Observable<any> {
 5992:  27:   const adapter = injector.get(SupabaseAuthAdapterService);
 5993:  28:   return adapter.refreshSession().pipe(
 5994:  29:     map(session => adapter.convertSessionToTokenFormat(session))
 5995:  30:   );
 5996:  31: }
 5997:  32: 
 5998:  33: /**
 5999:  34:  * 刷新Token方式一：使用 401 重新刷新 Token
 6000:  35:  */
 6001:  36: export function tryRefreshToken(injector: Injector, ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
 6002:  37:   // 1、若请求为刷新Token请求，表示来自刷新Token可以直接跳转登录页
 6003:  38:   if ([`/api/auth/refresh`].some(url => req.url.includes(url))) {
 6004:  39:     toLogin(injector);
 6005:  40:     return throwError(() => ev);
 6006:  41:   }
 6007:  42:   // 2、如果 `refreshToking` 为 `true` 表示已经在请求刷新 Token 中，后续所有请求转入等待状态，直至结果返回后再重新发起请求
 6008:  43:   if (refreshToking) {
 6009:  44:     return refreshToken$.pipe(
 6010:  45:       filter(v => !!v),
 6011:  46:       take(1),
 6012:  47:       switchMap(() => next(reAttachToken(injector, req)))
 6013:  48:     );
 6014:  49:   }
 6015:  50:   // 3、尝试调用刷新 Token
 6016:  51:   refreshToking = true;
 6017:  52:   refreshToken$.next(null);
 6018:  53: 
 6019:  54:   return refreshTokenRequest(injector).pipe(
 6020:  55:     switchMap(res => {
 6021:  56:       // 通知后续请求继续执行
 6022:  57:       refreshToking = false;
 6023:  58:       refreshToken$.next(res);
 6024:  59:       // 重新保存新 token
 6025:  60:       injector.get(DA_SERVICE_TOKEN).set(res);
 6026:  61:       // 重新发起请求
 6027:  62:       return next(reAttachToken(injector, req));
 6028:  63:     }),
 6029:  64:     catchError(err => {
 6030:  65:       refreshToking = false;
 6031:  66:       toLogin(injector);
 6032:  67:       return throwError(() => err);
 6033:  68:     })
 6034:  69:   );
 6035:  70: }
 6036:  71: 
 6037:  72: function buildAuthRefresh(injector: Injector): void {
 6038:  73:   const tokenSrv = injector.get(DA_SERVICE_TOKEN);
 6039:  74:   tokenSrv.refresh
 6040:  75:     .pipe(
 6041:  76:       filter(() => !refreshToking),
 6042:  77:       switchMap(res => {
 6043:  78:         console.log(res);
 6044:  79:         refreshToking = true;
 6045:  80:         return refreshTokenRequest(injector);
 6046:  81:       })
 6047:  82:     )
 6048:  83:     .subscribe({
 6049:  84:       next: res => {
 6050:  85:         // TODO: Mock expired value
 6051:  86:         res.expired = +new Date() + 1000 * 60 * 5;
 6052:  87:         refreshToking = false;
 6053:  88:         tokenSrv.set(res);
 6054:  89:       },
 6055:  90:       error: () => toLogin(injector)
 6056:  91:     });
 6057:  92: }
 6058:  93: 
 6059:  94: /**
 6060:  95:  * 刷新Token方式二：使用 `@delon/auth` 的 `refresh` 接口，需要在 `app.config.ts` 中注册 `provideBindAuthRefresh`
 6061:  96:  */
 6062:  97: export function provideBindAuthRefresh(): EnvironmentProviders[] {
 6063:  98:   return [
 6064:  99:     provideAppInitializer(() => {
 6065: 100:       const initializerFn = (
 6066: 101:         (injector: Injector) => () =>
 6067: 102:           buildAuthRefresh(injector)
 6068: 103:       )(inject(Injector));
 6069: 104:       return initializerFn();
 6070: 105:     })
 6071: 106:   ];
 6072: 107: }
 6073: ````
 6074: 
 6075: ## File: src/app/core/permissions/index.ts
 6076: ````typescript
 6077: 1: export * from './types';
 6078: 2: export * from './permission.service';
 6079: 3: export * from './role.service';
 6080: ````
 6081: 
 6082: ## File: src/app/core/permissions/types.ts
 6083: ````typescript
 6084:  1: /**
 6085:  2:  * 权限服务类型定义
 6086:  3:  * 
 6087:  4:  * 参考 docs/30-0-完整SQL表結構定義.md 中的权限表结构
 6088:  5:  */
 6089:  6: 
 6090:  7: /**
 6091:  8:  * 角色定义
 6092:  9:  * 对应 roles 表
 6093: 10:  */
 6094: 11: export interface Role {
 6095: 12:   id: string;
 6096: 13:   name: string;
 6097: 14:   code: string;
 6098: 15:   description?: string;
 6099: 16:   is_system_role: boolean;
 6100: 17:   priority: number;
 6101: 18:   created_at?: string;
 6102: 19:   updated_at?: string;
 6103: 20: }
 6104: 21: 
 6105: 22: /**
 6106: 23:  * 权限定义
 6107: 24:  * 对应 permissions 表
 6108: 25:  */
 6109: 26: export interface Permission {
 6110: 27:   id: string;
 6111: 28:   name: string;
 6112: 29:   resource: string;
 6113: 30:   action: string;
 6114: 31:   description?: string;
 6115: 32:   is_system_permission?: boolean;
 6116: 33:   created_at?: string;
 6117: 34: }
 6118: 35: 
 6119: 36: /**
 6120: 37:  * 用户角色关联
 6121: 38:  * 对应 user_roles 表
 6122: 39:  */
 6123: 40: export interface UserRole {
 6124: 41:   id: string;
 6125: 42:   account_id: string;
 6126: 43:   role_id: string;
 6127: 44:   blueprint_id?: string | null;
 6128: 45:   branch_id?: string | null;
 6129: 46:   granted_by?: string | null;
 6130: 47:   granted_at?: string;
 6131: 48:   // 关联查询时包含的角色信息
 6132: 49:   roles?: Role;
 6133: 50: }
 6134: 51: 
 6135: 52: /**
 6136: 53:  * 分支权限
 6137: 54:  * 对应 branch_permissions 表
 6138: 55:  */
 6139: 56: export interface BranchPermission {
 6140: 57:   id: string;
 6141: 58:   branch_id: string;
 6142: 59:   account_id: string;
 6143: 60:   permission_level: 'owner' | 'admin' | 'write' | 'read';
 6144: 61:   granted_by: string;
 6145: 62:   granted_at?: string;
 6146: 63: }
 6147: 64: 
 6148: 65: /**
 6149: 66:  * 权限检查结果
 6150: 67:  */
 6151: 68: export interface PermissionCheckResult {
 6152: 69:   hasPermission: boolean;
 6153: 70:   reason?: string;
 6154: 71: }
 6155: 72: 
 6156: 73: /**
 6157: 74:  * 权限缓存项
 6158: 75:  */
 6159: 76: export interface PermissionCacheItem {
 6160: 77:   permission: string;
 6161: 78:   hasPermission: boolean;
 6162: 79:   expiresAt: number;
 6163: 80:   roles?: string[];
 6164: 81:   abilities?: string[];
 6165: 82: }
 6166: ````
 6167: 
 6168: ## File: src/app/core/start-page.guard.ts
 6169: ````typescript
 6170:  1: import { CanActivateFn } from '@angular/router';
 6171:  2: import { Observable } from 'rxjs';
 6172:  3: 
 6173:  4: /**
 6174:  5:  * Dynamically load the start page
 6175:  6:  *
 6176:  7:  * 动态加载启动页
 6177:  8:  */
 6178:  9: export const startPageGuard: CanActivateFn = (): boolean | Observable<boolean> => {
 6179: 10:   // Re-jump according to the first item of the menu, you can re-customize the logic
 6180: 11:   // 以下代码是根据菜单的第一项进行重新跳转，你可以重新定制逻辑
 6181: 12:   // const menuSrv = inject(MenuService);
 6182: 13:   // if (menuSrv.find({ url: state.url }) == null) {
 6183: 14:   //   inject(Router).navigateByUrl(menuSrv.menus[0].link!);
 6184: 15:   //   return false;
 6185: 16:   // }
 6186: 17:   return true;
 6187: 18: };
 6188: ````
 6189: 
 6190: ## File: src/app/core/supabase/index.ts
 6191: ````typescript
 6192: 1: export * from './supabase.service';
 6193: 2: export * from './supabase-auth-adapter.service';
 6194: ````
 6195: 
 6196: ## File: src/app/core/supabase/supabase-auth-adapter.service.ts
 6197: ````typescript
 6198:   1: import { Injectable, inject, PLATFORM_ID } from '@angular/core';
 6199:   2: import { isPlatformBrowser } from '@angular/common';
 6200:   3: import { DA_SERVICE_TOKEN } from '@delon/auth';
 6201:   4: import { Session, AuthChangeEvent, AuthError } from '@supabase/supabase-js';
 6202:   5: import { Observable, from, of, throwError, EMPTY } from 'rxjs';
 6203:   6: import { map, catchError, switchMap, tap } from 'rxjs/operators';
 6204:   7: 
 6205:   8: import { SupabaseService } from './supabase.service';
 6206:   9: 
 6207:  10: /**
 6208:  11:  * Supabase Auth 與 @delon/auth 適配器服務
 6209:  12:  * 
 6210:  13:  * 作為 Supabase Auth 與 @delon/auth 之間的橋樑，實現：
 6211:  14:  * 1. Session 格式轉換（Supabase Session → @delon/auth Token 格式）
 6212:  15:  * 2. 自動同步 Session 到 TokenService
 6213:  16:  * 3. 監聽 Auth 狀態變化
 6214:  17:  * 4. Token 刷新處理
 6215:  18:  * 
 6216:  19:  * @example
 6217:  20:  * ```typescript
 6218:  21:  * const adapter = inject(SupabaseAuthAdapterService);
 6219:  22:  * adapter.signIn('user@example.com', 'password').subscribe();
 6220:  23:  * ```
 6221:  24:  */
 6222:  25: @Injectable({
 6223:  26:   providedIn: 'root'
 6224:  27: })
 6225:  28: export class SupabaseAuthAdapterService {
 6226:  29:   private readonly supabaseService = inject(SupabaseService);
 6227:  30:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
 6228:  31:   private readonly platformId = inject(PLATFORM_ID);
 6229:  32:   private authListenerInitialized = false;
 6230:  33: 
 6231:  34:   constructor() {
 6232:  35:     // 在瀏覽器環境中初始化 Auth 監聽器
 6233:  36:     if (isPlatformBrowser(this.platformId)) {
 6234:  37:       this.initializeAuthListener();
 6235:  38:     }
 6236:  39:   }
 6237:  40: 
 6238:  41:   /**
 6239:  42:    * 登入
 6240:  43:    * 
 6241:  44:    * @param email 用戶郵箱
 6242:  45:    * @param password 密碼
 6243:  46:    * @returns Observable<{ error: AuthError | null }>
 6244:  47:    */
 6245:  48:   signIn(email: string, password: string): Observable<{ error: AuthError | null }> {
 6246:  49:     return from(
 6247:  50:       this.supabaseService.client.auth.signInWithPassword({
 6248:  51:         email,
 6249:  52:         password
 6250:  53:       })
 6251:  54:     ).pipe(
 6252:  55:       tap(({ data, error }) => {
 6253:  56:         if (!error && data.session) {
 6254:  57:           this.syncSessionToTokenService(data.session);
 6255:  58:         }
 6256:  59:       }),
 6257:  60:       map(({ error }) => ({ error }))
 6258:  61:     );
 6259:  62:   }
 6260:  63: 
 6261:  64:   /**
 6262:  65:    * 註冊
 6263:  66:    * 
 6264:  67:    * @param email 用戶郵箱
 6265:  68:    * @param password 密碼
 6266:  69:    * @param metadata 用戶元數據（可選）
 6267:  70:    * @returns Observable<{ error: AuthError | null }>
 6268:  71:    */
 6269:  72:   signUp(
 6270:  73:     email: string,
 6271:  74:     password: string,
 6272:  75:     metadata?: Record<string, any>
 6273:  76:   ): Observable<{ error: AuthError | null }> {
 6274:  77:     return from(
 6275:  78:       this.supabaseService.client.auth.signUp({
 6276:  79:         email,
 6277:  80:         password,
 6278:  81:         options: {
 6279:  82:           data: metadata
 6280:  83:         }
 6281:  84:       })
 6282:  85:     ).pipe(
 6283:  86:       tap(({ data, error }) => {
 6284:  87:         if (!error && data.session) {
 6285:  88:           this.syncSessionToTokenService(data.session);
 6286:  89:         }
 6287:  90:       }),
 6288:  91:       map(({ error }) => ({ error }))
 6289:  92:     );
 6290:  93:   }
 6291:  94: 
 6292:  95:   /**
 6293:  96:    * 登出
 6294:  97:    * 
 6295:  98:    * @returns Observable<{ error: AuthError | null }>
 6296:  99:    */
 6297: 100:   signOut(): Observable<{ error: AuthError | null }> {
 6298: 101:     return from(this.supabaseService.client.auth.signOut()).pipe(
 6299: 102:       tap(() => {
 6300: 103:         // 清除 TokenService
 6301: 104:         this.tokenService.clear();
 6302: 105:       }),
 6303: 106:       map(({ error }) => ({ error }))
 6304: 107:     );
 6305: 108:   }
 6306: 109: 
 6307: 110:   /**
 6308: 111:    * 刷新 Session
 6309: 112:    * 
 6310: 113:    * @returns Observable<Session>
 6311: 114:    */
 6312: 115:   refreshSession(): Observable<Session> {
 6313: 116:     return from(this.supabaseService.client.auth.refreshSession()).pipe(
 6314: 117:       switchMap(({ data, error }) => {
 6315: 118:         if (error) {
 6316: 119:           return throwError(() => error);
 6317: 120:         }
 6318: 121:         if (!data.session) {
 6319: 122:           return throwError(() => new Error('No session available'));
 6320: 123:         }
 6321: 124:         this.syncSessionToTokenService(data.session);
 6322: 125:         return of(data.session);
 6323: 126:       })
 6324: 127:     );
 6325: 128:   }
 6326: 129: 
 6327: 130:   /**
 6328: 131:    * 恢復 Session（應用啟動時調用）
 6329: 132:    * 
 6330: 133:    * @returns Observable<void>
 6331: 134:    */
 6332: 135:   restoreSession(): Observable<void> {
 6333: 136:     if (!isPlatformBrowser(this.platformId)) {
 6334: 137:       return of(undefined);
 6335: 138:     }
 6336: 139: 
 6337: 140:     return from(this.supabaseService.client.auth.getSession()).pipe(
 6338: 141:       tap(({ data }) => {
 6339: 142:         if (data.session) {
 6340: 143:           this.syncSessionToTokenService(data.session);
 6341: 144:         }
 6342: 145:       }),
 6343: 146:       map(() => undefined),
 6344: 147:       catchError(() => of(undefined))
 6345: 148:     );
 6346: 149:   }
 6347: 150: 
 6348: 151:   /**
 6349: 152:    * 初始化 Auth 狀態監聽器
 6350: 153:    * 監聽 Supabase Auth 狀態變化，自動同步到 TokenService
 6351: 154:    */
 6352: 155:   initializeAuthListener(): void {
 6353: 156:     if (this.authListenerInitialized || !isPlatformBrowser(this.platformId)) {
 6354: 157:       return;
 6355: 158:     }
 6356: 159: 
 6357: 160:     this.supabaseService.client.auth.onAuthStateChange(
 6358: 161:       (event: AuthChangeEvent, session: Session | null) => {
 6359: 162:         if (session) {
 6360: 163:           this.syncSessionToTokenService(session);
 6361: 164:         } else if (event === 'SIGNED_OUT') {
 6362: 165:           this.tokenService.clear();
 6363: 166:         }
 6364: 167:       }
 6365: 168:     );
 6366: 169: 
 6367: 170:     this.authListenerInitialized = true;
 6368: 171:   }
 6369: 172: 
 6370: 173:   /**
 6371: 174:    * 將 Supabase Session 轉換為 @delon/auth Token 格式
 6372: 175:    * 
 6373: 176:    * @param session Supabase Session
 6374: 177:    * @returns @delon/auth Token 格式對象
 6375: 178:    */
 6376: 179:   convertSessionToTokenFormat(session: Session): {
 6377: 180:     token: string;
 6378: 181:     refresh_token: string;
 6379: 182:     expired: number;
 6380: 183:     user: {
 6381: 184:       id: string;
 6382: 185:       email?: string;
 6383: 186:       [key: string]: any;
 6384: 187:     };
 6385: 188:   } {
 6386: 189:     const expiresIn = session.expires_in || 3600; // 預設 1 小時
 6387: 190:     const expired = Date.now() + expiresIn * 1000;
 6388: 191: 
 6389: 192:     return {
 6390: 193:       token: session.access_token,
 6391: 194:       refresh_token: session.refresh_token,
 6392: 195:       expired,
 6393: 196:       user: {
 6394: 197:         id: session.user.id,
 6395: 198:         email: session.user.email,
 6396: 199:         ...session.user.user_metadata,
 6397: 200:         ...session.user.app_metadata
 6398: 201:       }
 6399: 202:     };
 6400: 203:   }
 6401: 204: 
 6402: 205:   /**
 6403: 206:    * 同步 Supabase Session 到 @delon/auth TokenService
 6404: 207:    * 
 6405: 208:    * @param session Supabase Session
 6406: 209:    */
 6407: 210:   private syncSessionToTokenService(session: Session): void {
 6408: 211:     const tokenData = this.convertSessionToTokenFormat(session);
 6409: 212:     this.tokenService.set(tokenData);
 6410: 213:   }
 6411: 214: 
 6412: 215:   /**
 6413: 216:    * 獲取當前 Session
 6414: 217:    * 
 6415: 218:    * @returns Observable<Session | null>
 6416: 219:    */
 6417: 220:   getCurrentSession(): Observable<Session | null> {
 6418: 221:     return from(this.supabaseService.client.auth.getSession()).pipe(
 6419: 222:       map(({ data }) => data.session)
 6420: 223:     );
 6421: 224:   }
 6422: 225: }
 6423: ````
 6424: 
 6425: ## File: src/app/core/supabase/supabase.service.ts
 6426: ````typescript
 6427:  1: import { Injectable, inject } from '@angular/core';
 6428:  2: import { createClient, SupabaseClient } from '@supabase/supabase-js';
 6429:  3: import { environment } from '@env/environment';
 6430:  4: 
 6431:  5: /**
 6432:  6:  * Supabase 客戶端服務
 6433:  7:  * 
 6434:  8:  * 提供 Supabase 客戶端單例，用於訪問 Supabase 的所有功能：
 6435:  9:  * - Database (PostgreSQL)
 6436: 10:  * - Authentication
 6437: 11:  * - Storage
 6438: 12:  * - Realtime
 6439: 13:  * 
 6440: 14:  * @example
 6441: 15:  * ```typescript
 6442: 16:  * const supabase = inject(SupabaseService);
 6443: 17:  * const client = supabase.client;
 6444: 18:  * ```
 6445: 19:  */
 6446: 20: @Injectable({
 6447: 21:   providedIn: 'root'
 6448: 22: })
 6449: 23: export class SupabaseService {
 6450: 24:   private readonly supabase: SupabaseClient;
 6451: 25: 
 6452: 26:   constructor() {
 6453: 27:     const supabaseConfig = (environment as any)['supabase'];
 6454: 28:     if (!supabaseConfig?.url || !supabaseConfig?.anonKey) {
 6455: 29:       throw new Error('Supabase configuration is missing. Please check environment variables.');
 6456: 30:     }
 6457: 31: 
 6458: 32:     this.supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
 6459: 33:       auth: {
 6460: 34:         persistSession: true,
 6461: 35:         autoRefreshToken: true,
 6462: 36:         detectSessionInUrl: true
 6463: 37:       }
 6464: 38:     });
 6465: 39:   }
 6466: 40: 
 6467: 41:   /**
 6468: 42:    * 獲取 Supabase 客戶端實例
 6469: 43:    */
 6470: 44:   get client(): SupabaseClient {
 6471: 45:     return this.supabase;
 6472: 46:   }
 6473: 47: }
 6474: ````
 6475: 
 6476: ## File: src/app/layout/basic/basic.component.ts
 6477: ````typescript
 6478:   1: import { Component, inject } from '@angular/core';
 6479:   2: import { RouterLink, RouterOutlet } from '@angular/router';
 6480:   3: import { I18nPipe, SettingsService, User } from '@delon/theme';
 6481:   4: import { LayoutDefaultModule, LayoutDefaultOptions } from '@delon/theme/layout-default';
 6482:   5: import { SettingDrawerModule } from '@delon/theme/setting-drawer';
 6483:   6: import { ThemeBtnComponent } from '@delon/theme/theme-btn';
 6484:   7: import { environment } from '@env/environment';
 6485:   8: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
 6486:   9: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 6487:  10: import { NzIconModule } from 'ng-zorro-antd/icon';
 6488:  11: import { NzMenuModule } from 'ng-zorro-antd/menu';
 6489:  12: 
 6490:  13: import { HeaderClearStorageComponent } from './widgets/clear-storage.component';
 6491:  14: import { HeaderFullScreenComponent } from './widgets/fullscreen.component';
 6492:  15: import { HeaderI18nComponent } from './widgets/i18n.component';
 6493:  16: import { HeaderIconComponent } from './widgets/icon.component';
 6494:  17: import { HeaderNotifyComponent } from './widgets/notify.component';
 6495:  18: import { HeaderRTLComponent } from './widgets/rtl.component';
 6496:  19: import { HeaderSearchComponent } from './widgets/search.component';
 6497:  20: import { HeaderTaskComponent } from './widgets/task.component';
 6498:  21: import { HeaderUserComponent } from './widgets/user.component';
 6499:  22: 
 6500:  23: @Component({
 6501:  24:   selector: 'layout-basic',
 6502:  25:   template: `
 6503:  26:     <layout-default [options]="options" [asideUser]="asideUserTpl" [content]="contentTpl" [customError]="null">
 6504:  27:       <layout-default-header-item direction="left">
 6505:  28:         <a layout-default-header-item-trigger href="//github.com/ng-alain/ng-alain" target="_blank">
 6506:  29:           <i nz-icon nzType="github"></i>
 6507:  30:         </a>
 6508:  31:       </layout-default-header-item>
 6509:  32:       <layout-default-header-item direction="left" hidden="mobile">
 6510:  33:         <a layout-default-header-item-trigger routerLink="/passport/lock">
 6511:  34:           <i nz-icon nzType="lock"></i>
 6512:  35:         </a>
 6513:  36:       </layout-default-header-item>
 6514:  37:       <layout-default-header-item direction="left" hidden="pc">
 6515:  38:         <div layout-default-header-item-trigger (click)="searchToggleStatus = !searchToggleStatus">
 6516:  39:           <i nz-icon nzType="search"></i>
 6517:  40:         </div>
 6518:  41:       </layout-default-header-item>
 6519:  42:       <layout-default-header-item direction="middle">
 6520:  43:         <header-search class="alain-default__search" [(toggleChange)]="searchToggleStatus" />
 6521:  44:       </layout-default-header-item>
 6522:  45:       <layout-default-header-item direction="right">
 6523:  46:         <header-notify />
 6524:  47:       </layout-default-header-item>
 6525:  48:       <layout-default-header-item direction="right" hidden="mobile">
 6526:  49:         <header-task />
 6527:  50:       </layout-default-header-item>
 6528:  51:       <layout-default-header-item direction="right" hidden="mobile">
 6529:  52:         <header-icon />
 6530:  53:       </layout-default-header-item>
 6531:  54:       <layout-default-header-item direction="right" hidden="mobile">
 6532:  55:         <div layout-default-header-item-trigger nz-dropdown [nzDropdownMenu]="settingsMenu" nzTrigger="click" nzPlacement="bottomRight">
 6533:  56:           <i nz-icon nzType="setting"></i>
 6534:  57:         </div>
 6535:  58:         <nz-dropdown-menu #settingsMenu="nzDropdownMenu">
 6536:  59:           <div nz-menu style="width: 200px;">
 6537:  60:             <div nz-menu-item>
 6538:  61:               <header-rtl />
 6539:  62:             </div>
 6540:  63:             <div nz-menu-item>
 6541:  64:               <header-fullscreen />
 6542:  65:             </div>
 6543:  66:             <div nz-menu-item>
 6544:  67:               <header-clear-storage />
 6545:  68:             </div>
 6546:  69:             <div nz-menu-item>
 6547:  70:               <header-i18n />
 6548:  71:             </div>
 6549:  72:           </div>
 6550:  73:         </nz-dropdown-menu>
 6551:  74:       </layout-default-header-item>
 6552:  75:       <layout-default-header-item direction="right">
 6553:  76:         <header-user />
 6554:  77:       </layout-default-header-item>
 6555:  78:       <ng-template #asideUserTpl>
 6556:  79:         <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="userMenu" class="alain-default__aside-user">
 6557:  80:           <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="user.avatar" />
 6558:  81:           <div class="alain-default__aside-user-info">
 6559:  82:             <strong>{{ user.name }}</strong>
 6560:  83:             <p class="mb0">{{ user.email }}</p>
 6561:  84:           </div>
 6562:  85:         </div>
 6563:  86:         <nz-dropdown-menu #userMenu="nzDropdownMenu">
 6564:  87:           <ul nz-menu>
 6565:  88:             <li nz-menu-item routerLink="/pro/account/center">{{ 'menu.account.center' | i18n }}</li>
 6566:  89:             <li nz-menu-item routerLink="/pro/account/settings">{{ 'menu.account.settings' | i18n }}</li>
 6567:  90:           </ul>
 6568:  91:         </nz-dropdown-menu>
 6569:  92:       </ng-template>
 6570:  93:       <ng-template #contentTpl>
 6571:  94:         <router-outlet />
 6572:  95:       </ng-template>
 6573:  96:     </layout-default>
 6574:  97:     @if (showSettingDrawer) {
 6575:  98:       <setting-drawer />
 6576:  99:     }
 6577: 100:     <theme-btn />
 6578: 101:   `,
 6579: 102:   imports: [
 6580: 103:     RouterOutlet,
 6581: 104:     RouterLink,
 6582: 105:     I18nPipe,
 6583: 106:     LayoutDefaultModule,
 6584: 107:     NzIconModule,
 6585: 108:     NzMenuModule,
 6586: 109:     NzDropDownModule,
 6587: 110:     NzAvatarModule,
 6588: 111:     SettingDrawerModule,
 6589: 112:     ThemeBtnComponent,
 6590: 113:     HeaderSearchComponent,
 6591: 114:     HeaderNotifyComponent,
 6592: 115:     HeaderTaskComponent,
 6593: 116:     HeaderIconComponent,
 6594: 117:     HeaderRTLComponent,
 6595: 118:     HeaderI18nComponent,
 6596: 119:     HeaderClearStorageComponent,
 6597: 120:     HeaderFullScreenComponent,
 6598: 121:     HeaderUserComponent
 6599: 122:   ]
 6600: 123: })
 6601: 124: export class LayoutBasicComponent {
 6602: 125:   private readonly settings = inject(SettingsService);
 6603: 126:   options: LayoutDefaultOptions = {
 6604: 127:     logoExpanded: `./assets/logo-full.svg`,
 6605: 128:     logoCollapsed: `./assets/logo.svg`
 6606: 129:   };
 6607: 130:   searchToggleStatus = false;
 6608: 131:   showSettingDrawer = !environment.production;
 6609: 132:   get user(): User {
 6610: 133:     return this.settings.user;
 6611: 134:   }
 6612: 135: }
 6613: ````
 6614: 
 6615: ## File: src/app/layout/basic/widgets/clear-storage.component.ts
 6616: ````typescript
 6617:  1: import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
 6618:  2: import { I18nPipe } from '@delon/theme';
 6619:  3: import { NzIconModule } from 'ng-zorro-antd/icon';
 6620:  4: import { NzMessageService } from 'ng-zorro-antd/message';
 6621:  5: import { NzModalService } from 'ng-zorro-antd/modal';
 6622:  6: 
 6623:  7: @Component({
 6624:  8:   selector: 'header-clear-storage',
 6625:  9:   template: `
 6626: 10:     <i nz-icon nzType="tool"></i>
 6627: 11:     {{ 'menu.clear.local.storage' | i18n }}
 6628: 12:   `,
 6629: 13:   host: {
 6630: 14:     '[class.flex-1]': 'true'
 6631: 15:   },
 6632: 16:   changeDetection: ChangeDetectionStrategy.OnPush,
 6633: 17:   imports: [NzIconModule, I18nPipe]
 6634: 18: })
 6635: 19: export class HeaderClearStorageComponent {
 6636: 20:   private readonly modalSrv = inject(NzModalService);
 6637: 21:   private readonly messageSrv = inject(NzMessageService);
 6638: 22: 
 6639: 23:   @HostListener('click')
 6640: 24:   _click(): void {
 6641: 25:     this.modalSrv.confirm({
 6642: 26:       nzTitle: 'Make sure clear all local storage?',
 6643: 27:       nzOnOk: () => {
 6644: 28:         localStorage.clear();
 6645: 29:         this.messageSrv.success('Clear Finished!');
 6646: 30:       }
 6647: 31:     });
 6648: 32:   }
 6649: 33: }
 6650: ````
 6651: 
 6652: ## File: src/app/layout/basic/widgets/fullscreen.component.ts
 6653: ````typescript
 6654:  1: import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
 6655:  2: import { I18nPipe } from '@delon/theme';
 6656:  3: import { NzIconModule } from 'ng-zorro-antd/icon';
 6657:  4: import screenfull from 'screenfull';
 6658:  5: 
 6659:  6: @Component({
 6660:  7:   selector: 'header-fullscreen',
 6661:  8:   template: `
 6662:  9:     <i nz-icon [nzType]="status ? 'fullscreen-exit' : 'fullscreen'"></i>
 6663: 10:     {{ (status ? 'menu.fullscreen.exit' : 'menu.fullscreen') | i18n }}
 6664: 11:   `,
 6665: 12:   host: {
 6666: 13:     '[class.flex-1]': 'true'
 6667: 14:   },
 6668: 15:   changeDetection: ChangeDetectionStrategy.OnPush,
 6669: 16:   imports: [NzIconModule, I18nPipe]
 6670: 17: })
 6671: 18: export class HeaderFullScreenComponent {
 6672: 19:   status = false;
 6673: 20: 
 6674: 21:   @HostListener('window:resize')
 6675: 22:   _resize(): void {
 6676: 23:     this.status = screenfull.isFullscreen;
 6677: 24:   }
 6678: 25: 
 6679: 26:   @HostListener('click')
 6680: 27:   _click(): void {
 6681: 28:     if (screenfull.isEnabled) {
 6682: 29:       screenfull.toggle();
 6683: 30:     }
 6684: 31:   }
 6685: 32: }
 6686: ````
 6687: 
 6688: ## File: src/app/layout/basic/widgets/i18n.component.ts
 6689: ````typescript
 6690:  1: import { ChangeDetectionStrategy, Component, Input, booleanAttribute, inject, DOCUMENT } from '@angular/core';
 6691:  2: import { I18NService } from '@core';
 6692:  3: import { ALAIN_I18N_TOKEN, I18nPipe, SettingsService } from '@delon/theme';
 6693:  4: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 6694:  5: import { NzIconModule } from 'ng-zorro-antd/icon';
 6695:  6: import { NzMenuModule } from 'ng-zorro-antd/menu';
 6696:  7: 
 6697:  8: @Component({
 6698:  9:   selector: 'header-i18n',
 6699: 10:   template: `
 6700: 11:     @if (showLangText) {
 6701: 12:       <div nz-dropdown [nzDropdownMenu]="langMenu" nzPlacement="bottomRight">
 6702: 13:         <i nz-icon nzType="global"></i>
 6703: 14:         {{ 'menu.lang' | i18n }}
 6704: 15:         <i nz-icon nzType="down"></i>
 6705: 16:       </div>
 6706: 17:     } @else {
 6707: 18:       <i nz-dropdown [nzDropdownMenu]="langMenu" nzPlacement="bottomRight" nz-icon nzType="global"></i>
 6708: 19:     }
 6709: 20:     <nz-dropdown-menu #langMenu="nzDropdownMenu">
 6710: 21:       <ul nz-menu>
 6711: 22:         @for (item of langs; track $index) {
 6712: 23:           <li nz-menu-item [nzSelected]="item.code === curLangCode" (click)="change(item.code)">
 6713: 24:             <span role="img" [attr.aria-label]="item.text" class="pr-xs">{{ item.abbr }}</span>
 6714: 25:             {{ item.text }}
 6715: 26:           </li>
 6716: 27:         }
 6717: 28:       </ul>
 6718: 29:     </nz-dropdown-menu>
 6719: 30:   `,
 6720: 31:   host: {
 6721: 32:     '[class.flex-1]': 'true'
 6722: 33:   },
 6723: 34:   changeDetection: ChangeDetectionStrategy.OnPush,
 6724: 35:   imports: [I18nPipe, NzDropDownModule, NzIconModule, NzMenuModule]
 6725: 36: })
 6726: 37: export class HeaderI18nComponent {
 6727: 38:   private readonly settings = inject(SettingsService);
 6728: 39:   private readonly i18n = inject<I18NService>(ALAIN_I18N_TOKEN);
 6729: 40:   private readonly doc = inject(DOCUMENT);
 6730: 41:   /** Whether to display language text */
 6731: 42:   @Input({ transform: booleanAttribute }) showLangText = true;
 6732: 43: 
 6733: 44:   get langs(): Array<{ code: string; text: string; abbr: string }> {
 6734: 45:     return this.i18n.getLangs();
 6735: 46:   }
 6736: 47: 
 6737: 48:   get curLangCode(): string {
 6738: 49:     return this.settings.layout.lang;
 6739: 50:   }
 6740: 51: 
 6741: 52:   change(lang: string): void {
 6742: 53:     const spinEl = this.doc.createElement('div');
 6743: 54:     spinEl.setAttribute('class', `page-loading ant-spin ant-spin-lg ant-spin-spinning`);
 6744: 55:     spinEl.innerHTML = `<span class="ant-spin-dot ant-spin-dot-spin"><i></i><i></i><i></i><i></i></span>`;
 6745: 56:     this.doc.body.appendChild(spinEl);
 6746: 57: 
 6747: 58:     this.i18n.loadLangData(lang).subscribe(res => {
 6748: 59:       this.i18n.use(lang, res);
 6749: 60:       this.settings.setLayout('lang', lang);
 6750: 61:       setTimeout(() => this.doc.location.reload());
 6751: 62:     });
 6752: 63:   }
 6753: 64: }
 6754: ````
 6755: 
 6756: ## File: src/app/layout/basic/widgets/icon.component.ts
 6757: ````typescript
 6758:  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
 6759:  2: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 6760:  3: import { NzGridModule } from 'ng-zorro-antd/grid';
 6761:  4: import { NzIconModule } from 'ng-zorro-antd/icon';
 6762:  5: import { NzMenuModule } from 'ng-zorro-antd/menu';
 6763:  6: import { NzSpinModule } from 'ng-zorro-antd/spin';
 6764:  7: 
 6765:  8: @Component({
 6766:  9:   selector: 'header-icon',
 6767: 10:   template: `
 6768: 11:     <div
 6769: 12:       class="alain-default__nav-item"
 6770: 13:       nz-dropdown
 6771: 14:       [nzDropdownMenu]="iconMenu"
 6772: 15:       nzTrigger="click"
 6773: 16:       nzPlacement="bottomRight"
 6774: 17:       (nzVisibleChange)="change()"
 6775: 18:     >
 6776: 19:       <i nz-icon nzType="appstore"></i>
 6777: 20:     </div>
 6778: 21:     <nz-dropdown-menu #iconMenu="nzDropdownMenu">
 6779: 22:       <div nz-menu class="wd-xl animated jello">
 6780: 23:         <nz-spin [nzSpinning]="loading" [nzTip]="'正在读取数据...'">
 6781: 24:           <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="app-icons">
 6782: 25:             <div nz-col [nzSpan]="6">
 6783: 26:               <i nz-icon nzType="calendar" class="bg-error text-white"></i>
 6784: 27:               <small>Calendar</small>
 6785: 28:             </div>
 6786: 29:             <div nz-col [nzSpan]="6">
 6787: 30:               <i nz-icon nzType="file" class="bg-geekblue text-white"></i>
 6788: 31:               <small>Files</small>
 6789: 32:             </div>
 6790: 33:             <div nz-col [nzSpan]="6">
 6791: 34:               <i nz-icon nzType="cloud" class="bg-success text-white"></i>
 6792: 35:               <small>Cloud</small>
 6793: 36:             </div>
 6794: 37:             <div nz-col [nzSpan]="6">
 6795: 38:               <i nz-icon nzType="star" class="bg-magenta text-white"></i>
 6796: 39:               <small>Star</small>
 6797: 40:             </div>
 6798: 41:             <div nz-col [nzSpan]="6">
 6799: 42:               <i nz-icon nzType="team" class="bg-purple text-white"></i>
 6800: 43:               <small>Team</small>
 6801: 44:             </div>
 6802: 45:             <div nz-col [nzSpan]="6">
 6803: 46:               <i nz-icon nzType="scan" class="bg-warning text-white"></i>
 6804: 47:               <small>QR</small>
 6805: 48:             </div>
 6806: 49:             <div nz-col [nzSpan]="6">
 6807: 50:               <i nz-icon nzType="pay-circle" class="bg-cyan text-white"></i>
 6808: 51:               <small>Pay</small>
 6809: 52:             </div>
 6810: 53:             <div nz-col [nzSpan]="6">
 6811: 54:               <i nz-icon nzType="printer" class="bg-grey text-white"></i>
 6812: 55:               <small>Print</small>
 6813: 56:             </div>
 6814: 57:           </div>
 6815: 58:         </nz-spin>
 6816: 59:       </div>
 6817: 60:     </nz-dropdown-menu>
 6818: 61:   `,
 6819: 62:   changeDetection: ChangeDetectionStrategy.OnPush,
 6820: 63:   imports: [NzDropDownModule, NzIconModule, NzMenuModule, NzGridModule, NzSpinModule]
 6821: 64: })
 6822: 65: export class HeaderIconComponent {
 6823: 66:   private readonly cdr = inject(ChangeDetectorRef);
 6824: 67:   loading = true;
 6825: 68: 
 6826: 69:   change(): void {
 6827: 70:     setTimeout(() => {
 6828: 71:       this.loading = false;
 6829: 72:       this.cdr.detectChanges();
 6830: 73:     }, 500);
 6831: 74:   }
 6832: 75: }
 6833: ````
 6834: 
 6835: ## File: src/app/layout/basic/widgets/notify.component.ts
 6836: ````typescript
 6837:   1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
 6838:   2: import { NoticeIconList, NoticeIconModule, NoticeIconSelect, NoticeItem } from '@delon/abc/notice-icon';
 6839:   3: import { add, formatDistanceToNow, parse } from 'date-fns';
 6840:   4: import { NzI18nService } from 'ng-zorro-antd/i18n';
 6841:   5: import { NzMessageService } from 'ng-zorro-antd/message';
 6842:   6: 
 6843:   7: @Component({
 6844:   8:   selector: 'header-notify',
 6845:   9:   template: `
 6846:  10:     <notice-icon
 6847:  11:       [data]="data"
 6848:  12:       [count]="count"
 6849:  13:       [loading]="loading"
 6850:  14:       btnClass="alain-default__nav-item"
 6851:  15:       btnIconClass="alain-default__nav-item-icon"
 6852:  16:       (select)="select($event)"
 6853:  17:       (clear)="clear($event)"
 6854:  18:       (popoverVisibleChange)="loadData()"
 6855:  19:     />
 6856:  20:   `,
 6857:  21:   changeDetection: ChangeDetectionStrategy.OnPush,
 6858:  22:   imports: [NoticeIconModule]
 6859:  23: })
 6860:  24: export class HeaderNotifyComponent {
 6861:  25:   private readonly msg = inject(NzMessageService);
 6862:  26:   private readonly nzI18n = inject(NzI18nService);
 6863:  27:   private readonly cdr = inject(ChangeDetectorRef);
 6864:  28:   data: NoticeItem[] = [
 6865:  29:     {
 6866:  30:       title: '通知',
 6867:  31:       list: [],
 6868:  32:       emptyText: '你已查看所有通知',
 6869:  33:       emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
 6870:  34:       clearText: '清空通知'
 6871:  35:     },
 6872:  36:     {
 6873:  37:       title: '消息',
 6874:  38:       list: [],
 6875:  39:       emptyText: '您已读完所有消息',
 6876:  40:       emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
 6877:  41:       clearText: '清空消息'
 6878:  42:     },
 6879:  43:     {
 6880:  44:       title: '待办',
 6881:  45:       list: [],
 6882:  46:       emptyText: '你已完成所有待办',
 6883:  47:       emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
 6884:  48:       clearText: '清空待办'
 6885:  49:     }
 6886:  50:   ];
 6887:  51:   count = 5;
 6888:  52:   loading = false;
 6889:  53: 
 6890:  54:   private updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
 6891:  55:     const data = this.data.slice();
 6892:  56:     data.forEach(i => (i.list = []));
 6893:  57: 
 6894:  58:     notices.forEach(item => {
 6895:  59:       const newItem = { ...item } as NoticeIconList;
 6896:  60:       if (typeof newItem.datetime === 'string') {
 6897:  61:         newItem.datetime = parse(newItem.datetime, 'yyyy-MM-dd', new Date());
 6898:  62:       }
 6899:  63:       if (newItem.datetime) {
 6900:  64:         newItem.datetime = formatDistanceToNow(newItem.datetime as Date, { locale: this.nzI18n.getDateLocale() });
 6901:  65:       }
 6902:  66:       if (newItem.extra && newItem['status']) {
 6903:  67:         newItem['color'] = (
 6904:  68:           {
 6905:  69:             todo: undefined,
 6906:  70:             processing: 'blue',
 6907:  71:             urgent: 'red',
 6908:  72:             doing: 'gold'
 6909:  73:           } as Record<string, string | undefined>
 6910:  74:         )[newItem['status']];
 6911:  75:       }
 6912:  76:       data.find(w => w.title === newItem['type'])!.list.push(newItem);
 6913:  77:     });
 6914:  78:     return data;
 6915:  79:   }
 6916:  80: 
 6917:  81:   loadData(): void {
 6918:  82:     if (this.loading) {
 6919:  83:       return;
 6920:  84:     }
 6921:  85:     this.loading = true;
 6922:  86:     setTimeout(() => {
 6923:  87:       const now = new Date();
 6924:  88:       this.data = this.updateNoticeData([
 6925:  89:         {
 6926:  90:           id: '000000001',
 6927:  91:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
 6928:  92:           title: '你收到了 14 份新周报',
 6929:  93:           datetime: add(now, { days: 10 }),
 6930:  94:           type: '通知'
 6931:  95:         },
 6932:  96:         {
 6933:  97:           id: '000000002',
 6934:  98:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
 6935:  99:           title: '你推荐的 曲妮妮 已通过第三轮面试',
 6936: 100:           datetime: add(now, { days: -3 }),
 6937: 101:           type: '通知'
 6938: 102:         },
 6939: 103:         {
 6940: 104:           id: '000000003',
 6941: 105:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png',
 6942: 106:           title: '这种模板可以区分多种通知类型',
 6943: 107:           datetime: add(now, { months: -3 }),
 6944: 108:           read: true,
 6945: 109:           type: '通知'
 6946: 110:         },
 6947: 111:         {
 6948: 112:           id: '000000004',
 6949: 113:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/GvqBnKhFgObvnSGkDsje.png',
 6950: 114:           title: '左侧图标用于区分不同的类型',
 6951: 115:           datetime: add(now, { years: -1 }),
 6952: 116:           type: '通知'
 6953: 117:         },
 6954: 118:         {
 6955: 119:           id: '000000005',
 6956: 120:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
 6957: 121:           title: '内容不要超过两行字，超出时自动截断',
 6958: 122:           datetime: '2017-08-07',
 6959: 123:           type: '通知'
 6960: 124:         },
 6961: 125:         {
 6962: 126:           id: '000000006',
 6963: 127:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
 6964: 128:           title: '曲丽丽 评论了你',
 6965: 129:           description: '描述信息描述信息描述信息',
 6966: 130:           datetime: '2017-08-07',
 6967: 131:           type: '消息'
 6968: 132:         },
 6969: 133:         {
 6970: 134:           id: '000000007',
 6971: 135:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
 6972: 136:           title: '朱偏右 回复了你',
 6973: 137:           description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
 6974: 138:           datetime: '2017-08-07',
 6975: 139:           type: '消息'
 6976: 140:         },
 6977: 141:         {
 6978: 142:           id: '000000008',
 6979: 143:           avatar: 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg',
 6980: 144:           title: '标题',
 6981: 145:           description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
 6982: 146:           datetime: '2017-08-07',
 6983: 147:           type: '消息'
 6984: 148:         },
 6985: 149:         {
 6986: 150:           id: '000000009',
 6987: 151:           title: '任务名称',
 6988: 152:           description: '任务需要在 2017-01-12 20:00 前启动',
 6989: 153:           extra: '未开始',
 6990: 154:           status: 'todo',
 6991: 155:           type: '待办'
 6992: 156:         },
 6993: 157:         {
 6994: 158:           id: '000000010',
 6995: 159:           title: '第三方紧急代码变更',
 6996: 160:           description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
 6997: 161:           extra: '马上到期',
 6998: 162:           status: 'urgent',
 6999: 163:           type: '待办'
 7000: 164:         },
 7001: 165:         {
 7002: 166:           id: '000000011',
 7003: 167:           title: '信息安全考试',
 7004: 168:           description: '指派竹尔于 2017-01-09 前完成更新并发布',
 7005: 169:           extra: '已耗时 8 天',
 7006: 170:           status: 'doing',
 7007: 171:           type: '待办'
 7008: 172:         },
 7009: 173:         {
 7010: 174:           id: '000000012',
 7011: 175:           title: 'ABCD 版本发布',
 7012: 176:           description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
 7013: 177:           extra: '进行中',
 7014: 178:           status: 'processing',
 7015: 179:           type: '待办'
 7016: 180:         }
 7017: 181:       ]);
 7018: 182: 
 7019: 183:       this.loading = false;
 7020: 184:       this.cdr.detectChanges();
 7021: 185:     }, 500);
 7022: 186:   }
 7023: 187: 
 7024: 188:   clear(type: string): void {
 7025: 189:     this.msg.success(`清空了 ${type}`);
 7026: 190:   }
 7027: 191: 
 7028: 192:   select(res: NoticeIconSelect): void {
 7029: 193:     this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
 7030: 194:   }
 7031: 195: }
 7032: ````
 7033: 
 7034: ## File: src/app/layout/basic/widgets/rtl.component.ts
 7035: ````typescript
 7036:  1: import { UpperCasePipe } from '@angular/common';
 7037:  2: import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
 7038:  3: import { RTLService } from '@delon/theme';
 7039:  4: import { NzIconModule } from 'ng-zorro-antd/icon';
 7040:  5: 
 7041:  6: @Component({
 7042:  7:   selector: 'header-rtl',
 7043:  8:   template: `
 7044:  9:     <i nz-icon [nzType]="rtl.nextDir === 'rtl' ? 'border-left' : 'border-right'"></i>
 7045: 10:     {{ rtl.nextDir | uppercase }}
 7046: 11:   `,
 7047: 12:   host: {
 7048: 13:     '[class.flex-1]': 'true'
 7049: 14:   },
 7050: 15:   changeDetection: ChangeDetectionStrategy.OnPush,
 7051: 16:   imports: [NzIconModule, UpperCasePipe]
 7052: 17: })
 7053: 18: export class HeaderRTLComponent {
 7054: 19:   readonly rtl = inject(RTLService);
 7055: 20: 
 7056: 21:   @HostListener('click')
 7057: 22:   toggleDirection(): void {
 7058: 23:     this.rtl.toggle();
 7059: 24:   }
 7060: 25: }
 7061: ````
 7062: 
 7063: ## File: src/app/layout/basic/widgets/search.component.ts
 7064: ````typescript
 7065:   1: import {
 7066:   2:   AfterViewInit,
 7067:   3:   ChangeDetectionStrategy,
 7068:   4:   ChangeDetectorRef,
 7069:   5:   Component,
 7070:   6:   ElementRef,
 7071:   7:   EventEmitter,
 7072:   8:   HostBinding,
 7073:   9:   Input,
 7074:  10:   OnDestroy,
 7075:  11:   Output,
 7076:  12:   inject
 7077:  13: } from '@angular/core';
 7078:  14: import { FormsModule } from '@angular/forms';
 7079:  15: import { I18nPipe } from '@delon/theme';
 7080:  16: import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
 7081:  17: import { NzIconModule } from 'ng-zorro-antd/icon';
 7082:  18: import { NzInputModule } from 'ng-zorro-antd/input';
 7083:  19: import { BehaviorSubject, debounceTime, distinctUntilChanged, tap } from 'rxjs';
 7084:  20: 
 7085:  21: @Component({
 7086:  22:   selector: 'header-search',
 7087:  23:   template: `
 7088:  24:     <nz-input-group [nzPrefix]="iconTpl" [nzSuffix]="loadingTpl">
 7089:  25:       <ng-template #iconTpl>
 7090:  26:         <i nz-icon [nzType]="focus ? 'arrow-down' : 'search'"></i>
 7091:  27:       </ng-template>
 7092:  28:       <ng-template #loadingTpl>
 7093:  29:         @if (loading) {
 7094:  30:           <i nz-icon nzType="loading"></i>
 7095:  31:         }
 7096:  32:       </ng-template>
 7097:  33:       <input
 7098:  34:         type="text"
 7099:  35:         nz-input
 7100:  36:         [(ngModel)]="q"
 7101:  37:         [nzAutocomplete]="auto"
 7102:  38:         (input)="search($event)"
 7103:  39:         (focus)="qFocus()"
 7104:  40:         (blur)="qBlur()"
 7105:  41:         hotkey="F1"
 7106:  42:         [attr.placeholder]="'menu.search.placeholder' | i18n"
 7107:  43:       />
 7108:  44:     </nz-input-group>
 7109:  45:     <nz-autocomplete nzBackfill #auto>
 7110:  46:       @for (i of options; track $index) {
 7111:  47:         <nz-auto-option [nzValue]="i">{{ i }}</nz-auto-option>
 7112:  48:       }
 7113:  49:     </nz-autocomplete>
 7114:  50:   `,
 7115:  51:   changeDetection: ChangeDetectionStrategy.OnPush,
 7116:  52:   imports: [FormsModule, I18nPipe, NzInputModule, NzIconModule, NzAutocompleteModule]
 7117:  53: })
 7118:  54: export class HeaderSearchComponent implements AfterViewInit, OnDestroy {
 7119:  55:   private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
 7120:  56:   private readonly cdr = inject(ChangeDetectorRef);
 7121:  57:   q = '';
 7122:  58:   qIpt: HTMLInputElement | null = null;
 7123:  59:   options: string[] = [];
 7124:  60:   search$ = new BehaviorSubject('');
 7125:  61:   loading = false;
 7126:  62: 
 7127:  63:   @HostBinding('class.alain-default__search-focus')
 7128:  64:   focus = false;
 7129:  65:   @HostBinding('class.alain-default__search-toggled')
 7130:  66:   searchToggled = false;
 7131:  67: 
 7132:  68:   @Input()
 7133:  69:   set toggleChange(value: boolean) {
 7134:  70:     if (typeof value === 'undefined') {
 7135:  71:       return;
 7136:  72:     }
 7137:  73:     this.searchToggled = value;
 7138:  74:     this.focus = value;
 7139:  75:     if (value) {
 7140:  76:       setTimeout(() => this.qIpt!.focus());
 7141:  77:     }
 7142:  78:   }
 7143:  79:   @Output() readonly toggleChangeChange = new EventEmitter<boolean>();
 7144:  80: 
 7145:  81:   ngAfterViewInit(): void {
 7146:  82:     this.qIpt = this.el.querySelector('.ant-input') as HTMLInputElement;
 7147:  83:     this.search$
 7148:  84:       .pipe(
 7149:  85:         debounceTime(500),
 7150:  86:         distinctUntilChanged(),
 7151:  87:         tap({
 7152:  88:           complete: () => {
 7153:  89:             this.loading = true;
 7154:  90:           }
 7155:  91:         })
 7156:  92:       )
 7157:  93:       .subscribe(value => {
 7158:  94:         this.options = value ? [value, value + value, value + value + value] : [];
 7159:  95:         this.loading = false;
 7160:  96:         this.cdr.detectChanges();
 7161:  97:       });
 7162:  98:   }
 7163:  99: 
 7164: 100:   qFocus(): void {
 7165: 101:     this.focus = true;
 7166: 102:   }
 7167: 103: 
 7168: 104:   qBlur(): void {
 7169: 105:     this.focus = false;
 7170: 106:     this.searchToggled = false;
 7171: 107:     this.options.length = 0;
 7172: 108:     this.toggleChangeChange.emit(false);
 7173: 109:   }
 7174: 110: 
 7175: 111:   search(ev: Event): void {
 7176: 112:     this.search$.next((ev.target as HTMLInputElement).value);
 7177: 113:   }
 7178: 114: 
 7179: 115:   ngOnDestroy(): void {
 7180: 116:     this.search$.complete();
 7181: 117:     this.search$.unsubscribe();
 7182: 118:   }
 7183: 119: }
 7184: ````
 7185: 
 7186: ## File: src/app/layout/basic/widgets/task.component.ts
 7187: ````typescript
 7188:  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
 7189:  2: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
 7190:  3: import { NzBadgeModule } from 'ng-zorro-antd/badge';
 7191:  4: import { NzCardModule } from 'ng-zorro-antd/card';
 7192:  5: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 7193:  6: import { NzGridModule } from 'ng-zorro-antd/grid';
 7194:  7: import { NzIconModule } from 'ng-zorro-antd/icon';
 7195:  8: import { NzSpinModule } from 'ng-zorro-antd/spin';
 7196:  9: 
 7197: 10: @Component({
 7198: 11:   selector: 'header-task',
 7199: 12:   template: `
 7200: 13:     <div
 7201: 14:       class="alain-default__nav-item"
 7202: 15:       nz-dropdown
 7203: 16:       [nzDropdownMenu]="taskMenu"
 7204: 17:       nzTrigger="click"
 7205: 18:       nzPlacement="bottomRight"
 7206: 19:       (nzVisibleChange)="change()"
 7207: 20:     >
 7208: 21:       <nz-badge [nzDot]="true">
 7209: 22:         <i nz-icon nzType="bell" class="alain-default__nav-item-icon"></i>
 7210: 23:       </nz-badge>
 7211: 24:     </div>
 7212: 25:     <nz-dropdown-menu #taskMenu="nzDropdownMenu">
 7213: 26:       <div nz-menu class="wd-lg">
 7214: 27:         @if (loading) {
 7215: 28:           <div class="mx-lg p-lg"><nz-spin /></div>
 7216: 29:         } @else {
 7217: 30:           <nz-card nzTitle="Notifications" nzBordered="false" class="ant-card__body-nopadding">
 7218: 31:             <ng-template #extra><i nz-icon nzType="plus"></i></ng-template>
 7219: 32:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
 7220: 33:               <div nz-col [nzSpan]="4" class="text-center">
 7221: 34:                 <nz-avatar [nzSrc]="'./assets/tmp/img/1.png'" />
 7222: 35:               </div>
 7223: 36:               <div nz-col [nzSpan]="20">
 7224: 37:                 <strong>cipchk</strong>
 7225: 38:                 <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
 7226: 39:               </div>
 7227: 40:             </div>
 7228: 41:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
 7229: 42:               <div nz-col [nzSpan]="4" class="text-center">
 7230: 43:                 <nz-avatar [nzSrc]="'./assets/tmp/img/2.png'" />
 7231: 44:               </div>
 7232: 45:               <div nz-col [nzSpan]="20">
 7233: 46:                 <strong>はなさき</strong>
 7234: 47:                 <p class="mb0">ハルカソラトキヘダツヒカリ</p>
 7235: 48:               </div>
 7236: 49:             </div>
 7237: 50:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
 7238: 51:               <div nz-col [nzSpan]="4" class="text-center">
 7239: 52:                 <nz-avatar [nzSrc]="'./assets/tmp/img/3.png'" />
 7240: 53:               </div>
 7241: 54:               <div nz-col [nzSpan]="20">
 7242: 55:                 <strong>苏先生</strong>
 7243: 56:                 <p class="mb0">请告诉我，我应该说点什么好？</p>
 7244: 57:               </div>
 7245: 58:             </div>
 7246: 59:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
 7247: 60:               <div nz-col [nzSpan]="4" class="text-center">
 7248: 61:                 <nz-avatar [nzSrc]="'./assets/tmp/img/4.png'" />
 7249: 62:               </div>
 7250: 63:               <div nz-col [nzSpan]="20">
 7251: 64:                 <strong>Kent</strong>
 7252: 65:                 <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
 7253: 66:               </div>
 7254: 67:             </div>
 7255: 68:             <div nz-row [nzJustify]="'center'" [nzAlign]="'middle'" class="py-sm pr-md point bg-grey-lighter-h">
 7256: 69:               <div nz-col [nzSpan]="4" class="text-center">
 7257: 70:                 <nz-avatar [nzSrc]="'./assets/tmp/img/5.png'" />
 7258: 71:               </div>
 7259: 72:               <div nz-col [nzSpan]="20">
 7260: 73:                 <strong>Jefferson</strong>
 7261: 74:                 <p class="mb0">Please tell me what happened in a few words, don't go into details.</p>
 7262: 75:               </div>
 7263: 76:             </div>
 7264: 77:             <div nz-row>
 7265: 78:               <div nz-col [nzSpan]="24" class="pt-md border-top-1 text-center text-grey point">See All</div>
 7266: 79:             </div>
 7267: 80:           </nz-card>
 7268: 81:         }
 7269: 82:       </div>
 7270: 83:     </nz-dropdown-menu>
 7271: 84:   `,
 7272: 85:   changeDetection: ChangeDetectionStrategy.OnPush,
 7273: 86:   imports: [NzDropDownModule, NzBadgeModule, NzIconModule, NzSpinModule, NzGridModule, NzAvatarModule, NzCardModule]
 7274: 87: })
 7275: 88: export class HeaderTaskComponent {
 7276: 89:   private readonly cdr = inject(ChangeDetectorRef);
 7277: 90:   loading = true;
 7278: 91: 
 7279: 92:   change(): void {
 7280: 93:     setTimeout(() => {
 7281: 94:       this.loading = false;
 7282: 95:       this.cdr.detectChanges();
 7283: 96:     }, 500);
 7284: 97:   }
 7285: 98: }
 7286: ````
 7287: 
 7288: ## File: src/app/layout/basic/widgets/user.component.ts
 7289: ````typescript
 7290:  1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
 7291:  2: import { Router, RouterLink } from '@angular/router';
 7292:  3: import { DA_SERVICE_TOKEN } from '@delon/auth';
 7293:  4: import { I18nPipe, SettingsService, User } from '@delon/theme';
 7294:  5: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
 7295:  6: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
 7296:  7: import { NzIconModule } from 'ng-zorro-antd/icon';
 7297:  8: import { NzMenuModule } from 'ng-zorro-antd/menu';
 7298:  9: 
 7299: 10: @Component({
 7300: 11:   selector: 'header-user',
 7301: 12:   template: `
 7302: 13:     <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown nzPlacement="bottomRight" [nzDropdownMenu]="userMenu">
 7303: 14:       <nz-avatar [nzSrc]="user.avatar" nzSize="small" class="mr-sm" />
 7304: 15:       {{ user.name }}
 7305: 16:     </div>
 7306: 17:     <nz-dropdown-menu #userMenu="nzDropdownMenu">
 7307: 18:       <div nz-menu class="width-sm">
 7308: 19:         <div nz-menu-item routerLink="/pro/account/center">
 7309: 20:           <i nz-icon nzType="user" class="mr-sm"></i>
 7310: 21:           {{ 'menu.account.center' | i18n }}
 7311: 22:         </div>
 7312: 23:         <div nz-menu-item routerLink="/pro/account/settings">
 7313: 24:           <i nz-icon nzType="setting" class="mr-sm"></i>
 7314: 25:           {{ 'menu.account.settings' | i18n }}
 7315: 26:         </div>
 7316: 27:         <div nz-menu-item routerLink="/exception/trigger">
 7317: 28:           <i nz-icon nzType="close-circle" class="mr-sm"></i>
 7318: 29:           {{ 'menu.account.trigger' | i18n }}
 7319: 30:         </div>
 7320: 31:         <li nz-menu-divider></li>
 7321: 32:         <div nz-menu-item (click)="logout()">
 7322: 33:           <i nz-icon nzType="logout" class="mr-sm"></i>
 7323: 34:           {{ 'menu.account.logout' | i18n }}
 7324: 35:         </div>
 7325: 36:       </div>
 7326: 37:     </nz-dropdown-menu>
 7327: 38:   `,
 7328: 39:   changeDetection: ChangeDetectionStrategy.OnPush,
 7329: 40:   imports: [RouterLink, NzDropDownModule, NzMenuModule, NzIconModule, I18nPipe, NzAvatarModule]
 7330: 41: })
 7331: 42: export class HeaderUserComponent {
 7332: 43:   private readonly settings = inject(SettingsService);
 7333: 44:   private readonly router = inject(Router);
 7334: 45:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
 7335: 46:   get user(): User {
 7336: 47:     return this.settings.user;
 7337: 48:   }
 7338: 49: 
 7339: 50:   logout(): void {
 7340: 51:     this.tokenService.clear();
 7341: 52:     this.router.navigateByUrl(this.tokenService.login_url!);
 7342: 53:   }
 7343: 54: }
 7344: ````
 7345: 
 7346: ## File: src/app/layout/blank/blank.component.ts
 7347: ````typescript
 7348:  1: import { Component } from '@angular/core';
 7349:  2: import { RouterOutlet } from '@angular/router';
 7350:  3: 
 7351:  4: @Component({
 7352:  5:   selector: 'layout-blank',
 7353:  6:   template: `<router-outlet />`,
 7354:  7:   host: {
 7355:  8:     '[class.alain-blank]': 'true'
 7356:  9:   },
 7357: 10:   imports: [RouterOutlet]
 7358: 11: })
 7359: 12: export class LayoutBlankComponent {}
 7360: ````
 7361: 
 7362: ## File: src/app/layout/index.ts
 7363: ````typescript
 7364: 1: export * from './basic/basic.component';
 7365: 2: export * from './blank/blank.component';
 7366: 3: export * from './passport/passport.component';
 7367: ````
 7368: 
 7369: ## File: src/app/layout/passport/passport.component.ts
 7370: ````typescript
 7371:  1: import { Component, OnInit, inject } from '@angular/core';
 7372:  2: import { RouterOutlet } from '@angular/router';
 7373:  3: import { GlobalFooterModule } from '@delon/abc/global-footer';
 7374:  4: import { DA_SERVICE_TOKEN } from '@delon/auth';
 7375:  5: import { ThemeBtnComponent } from '@delon/theme/theme-btn';
 7376:  6: import { NzIconModule } from 'ng-zorro-antd/icon';
 7377:  7: 
 7378:  8: import { HeaderI18nComponent } from '../basic/widgets/i18n.component';
 7379:  9: 
 7380: 10: @Component({
 7381: 11:   selector: 'layout-passport',
 7382: 12:   template: `
 7383: 13:     <div class="container">
 7384: 14:       <header-i18n showLangText="false" class="langs" />
 7385: 15:       <div class="wrap">
 7386: 16:         <div class="top">
 7387: 17:           <div class="head">
 7388: 18:             <img class="logo" src="./assets/logo-color.svg" />
 7389: 19:             <span class="title">NG-ALAIN</span>
 7390: 20:           </div>
 7391: 21:           <div class="desc">武林中最有影响力的《葵花宝典》；欲练神功，挥刀自宫</div>
 7392: 22:         </div>
 7393: 23:         <router-outlet />
 7394: 24:         <global-footer [links]="links">
 7395: 25:           Copyright
 7396: 26:           <i nz-icon nzType="copyright"></i> 2023 <a href="//github.com/cipchk" target="_blank">卡色</a>出品
 7397: 27:         </global-footer>
 7398: 28:       </div>
 7399: 29:     </div>
 7400: 30:     <theme-btn />
 7401: 31:   `,
 7402: 32:   styleUrls: ['./passport.component.less'],
 7403: 33:   imports: [RouterOutlet, HeaderI18nComponent, GlobalFooterModule, NzIconModule, ThemeBtnComponent]
 7404: 34: })
 7405: 35: export class LayoutPassportComponent implements OnInit {
 7406: 36:   private tokenService = inject(DA_SERVICE_TOKEN);
 7407: 37: 
 7408: 38:   links = [
 7409: 39:     {
 7410: 40:       title: '帮助',
 7411: 41:       href: ''
 7412: 42:     },
 7413: 43:     {
 7414: 44:       title: '隐私',
 7415: 45:       href: ''
 7416: 46:     },
 7417: 47:     {
 7418: 48:       title: '条款',
 7419: 49:       href: ''
 7420: 50:     }
 7421: 51:   ];
 7422: 52: 
 7423: 53:   ngOnInit(): void {
 7424: 54:     this.tokenService.clear();
 7425: 55:   }
 7426: 56: }
 7427: ````
 7428: 
 7429: ## File: src/app/routes/accounts/bots/bot-list.component.ts
 7430: ````typescript
 7431:   1: import { Component, OnInit, inject } from '@angular/core';
 7432:   2: import { Router } from '@angular/router';
 7433:   3: import { STColumn } from '@delon/abc/st';
 7434:   4: import { SHARED_IMPORTS } from '@shared';
 7435:   5: import { AccountService, Account } from '@shared';
 7436:   6: import { NzMessageService } from 'ng-zorro-antd/message';
 7437:   7: 
 7438:   8: @Component({
 7439:   9:   selector: 'app-bot-list',
 7440:  10:   standalone: true,
 7441:  11:   imports: [SHARED_IMPORTS],
 7442:  12:   template: `
 7443:  13:     <page-header [title]="'机器人管理'">
 7444:  14:       <ng-template #extra>
 7445:  15:         <button nz-button nzType="primary" (click)="createBot()">
 7446:  16:           <span nz-icon nzType="plus"></span>
 7447:  17:           新建机器人
 7448:  18:         </button>
 7449:  19:       </ng-template>
 7450:  20:     </page-header>
 7451:  21: 
 7452:  22:     <nz-card nzTitle="管理系统中的所有机器人账户" style="margin-top: 16px;">
 7453:  23:       <st
 7454:  24:         #st
 7455:  25:         [data]="bots()"
 7456:  26:         [columns]="columns"
 7457:  27:         [loading]="loading()"
 7458:  28:         [page]="{ front: false, show: true, showSize: true }"
 7459:  29:         (change)="onTableChange($event)"
 7460:  30:       >
 7461:  31:         <ng-template #status let-record>
 7462:  32:           @switch (record.status) {
 7463:  33:             @case ('active') {
 7464:  34:               <nz-tag nzColor="success">活跃</nz-tag>
 7465:  35:             }
 7466:  36:             @case ('inactive') {
 7467:  37:               <nz-tag nzColor="default">非活跃</nz-tag>
 7468:  38:             }
 7469:  39:             @case ('suspended') {
 7470:  40:               <nz-tag nzColor="error">已暂停</nz-tag>
 7471:  41:             }
 7472:  42:           }
 7473:  43:         </ng-template>
 7474:  44:       </st>
 7475:  45:     </nz-card>
 7476:  46:   `
 7477:  47: })
 7478:  48: export class BotListComponent implements OnInit {
 7479:  49:   accountService = inject(AccountService);
 7480:  50:   router = inject(Router);
 7481:  51:   message = inject(NzMessageService);
 7482:  52: 
 7483:  53:   bots = this.accountService.accounts;
 7484:  54:   loading = this.accountService.loading;
 7485:  55: 
 7486:  56:   columns: STColumn[] = [
 7487:  57:     { title: 'ID', index: 'id', width: 100 },
 7488:  58:     { title: '机器人名称', index: 'name', width: 200 },
 7489:  59:     { title: '邮箱', index: 'email', width: 200 },
 7490:  60:     { title: '状态', index: 'status', width: 100, render: 'status' },
 7491:  61:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 7492:  62:     {
 7493:  63:       title: '操作',
 7494:  64:       width: 250,
 7495:  65:       buttons: [
 7496:  66:         {
 7497:  67:           text: '查看',
 7498:  68:           click: (record: Account) => this.viewDetail(record.id)
 7499:  69:         },
 7500:  70:         {
 7501:  71:           text: '编辑',
 7502:  72:           click: (record: Account) => this.edit(record.id)
 7503:  73:         },
 7504:  74:         {
 7505:  75:           text: '配置',
 7506:  76:           click: (record: Account) => this.configure(record.id)
 7507:  77:         },
 7508:  78:         {
 7509:  79:           text: '删除',
 7510:  80:           type: 'del',
 7511:  81:           pop: true,
 7512:  82:           click: (record: Account) => this.delete(record.id)
 7513:  83:         }
 7514:  84:       ]
 7515:  85:     }
 7516:  86:   ];
 7517:  87: 
 7518:  88:   ngOnInit(): void {
 7519:  89:     this.loadBots();
 7520:  90:   }
 7521:  91: 
 7522:  92:   async loadBots(): Promise<void> {
 7523:  93:     try {
 7524:  94:       await this.accountService.loadAccounts();
 7525:  95:       // 过滤出机器人类型的账户
 7526:  96:       // 注意：这里需要根据实际业务逻辑过滤
 7527:  97:     } catch (error) {
 7528:  98:       this.message.error('加载机器人列表失败');
 7529:  99:     }
 7530: 100:   }
 7531: 101: 
 7532: 102:   onTableChange(event: any): void {
 7533: 103:     // 处理表格变化事件（分页、排序等）
 7534: 104:   }
 7535: 105: 
 7536: 106:   createBot(): void {
 7537: 107:     this.router.navigate(['/accounts/create'], { queryParams: { type: 'Bot' } });
 7538: 108:   }
 7539: 109: 
 7540: 110:   viewDetail(id: string): void {
 7541: 111:     this.router.navigate(['/accounts', id]);
 7542: 112:   }
 7543: 113: 
 7544: 114:   edit(id: string): void {
 7545: 115:     this.router.navigate(['/accounts', id, 'edit']);
 7546: 116:   }
 7547: 117: 
 7548: 118:   configure(id: string): void {
 7549: 119:     // TODO: 导航到机器人配置页面
 7550: 120:     this.message.info('机器人配置功能开发中');
 7551: 121:   }
 7552: 122: 
 7553: 123:   async delete(id: string): Promise<void> {
 7554: 124:     try {
 7555: 125:       await this.accountService.deleteAccount(id);
 7556: 126:       this.message.success('删除成功');
 7557: 127:       await this.loadBots();
 7558: 128:     } catch (error) {
 7559: 129:       this.message.error('删除失败');
 7560: 130:     }
 7561: 131:   }
 7562: 132: }
 7563: ````
 7564: 
 7565: ## File: src/app/routes/accounts/detail/account-detail.component.ts
 7566: ````typescript
 7567:   1: import { Component, OnInit, inject, computed } from '@angular/core';
 7568:   2: import { ActivatedRoute, Router } from '@angular/router';
 7569:   3: import { SHARED_IMPORTS } from '@shared';
 7570:   4: import { AccountService, Account, AccountType, AccountStatus, TeamService, OrganizationScheduleService } from '@shared';
 7571:   5: import { NzMessageService } from 'ng-zorro-antd/message';
 7572:   6: 
 7573:   7: @Component({
 7574:   8:   selector: 'app-account-detail',
 7575:   9:   standalone: true,
 7576:  10:   imports: [SHARED_IMPORTS],
 7577:  11:   template: `
 7578:  12:     <page-header [title]="'账户详情'">
 7579:  13:       <ng-template #extra>
 7580:  14:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 7581:  15:           <span nz-icon nzType="arrow-left"></span>
 7582:  16:           返回
 7583:  17:         </button>
 7584:  18:         @if (account()) {
 7585:  19:           <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
 7586:  20:             <span nz-icon nzType="edit"></span>
 7587:  21:             编辑
 7588:  22:           </button>
 7589:  23:           <button nz-button nzDanger (click)="delete()">
 7590:  24:             <span nz-icon nzType="delete"></span>
 7591:  25:             删除
 7592:  26:           </button>
 7593:  27:         }
 7594:  28:       </ng-template>
 7595:  29:     </page-header>
 7596:  30: 
 7597:  31:     @if (accountService.loading()) {
 7598:  32:       <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
 7599:  33:         <ng-template #indicator>
 7600:  34:           <span nz-icon nzType="loading" style="font-size: 24px;"></span>
 7601:  35:         </ng-template>
 7602:  36:       </nz-spin>
 7603:  37:     } @else if (accountService.error()) {
 7604:  38:       <nz-alert
 7605:  39:         nzType="error"
 7606:  40:         [nzMessage]="'加载失败'"
 7607:  41:         [nzDescription]="accountService.error()"
 7608:  42:         nzShowIcon
 7609:  43:         style="margin: 16px;"
 7610:  44:       ></nz-alert>
 7611:  45:     } @else if (account()) {
 7612:  46:       <div style="padding: 16px;">
 7613:  47:         <!-- 账户基本信息 -->
 7614:  48:         <nz-card nzTitle="基本信息" style="margin-bottom: 16px;">
 7615:  49:           <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
 7616:  50:             <nz-descriptions-item nzTitle="ID">{{ account()!.id }}</nz-descriptions-item>
 7617:  51:             <nz-descriptions-item nzTitle="名称">{{ account()!.name }}</nz-descriptions-item>
 7618:  52:             <nz-descriptions-item nzTitle="邮箱">{{ account()!.email || '-' }}</nz-descriptions-item>
 7619:  53:             <nz-descriptions-item nzTitle="类型">
 7620:  54:               @switch (account()!.type) {
 7621:  55:                 @case ('User') {
 7622:  56:                   <nz-tag nzColor="blue">用户</nz-tag>
 7623:  57:                 }
 7624:  58:                 @case ('Bot') {
 7625:  59:                   <nz-tag nzColor="purple">机器人</nz-tag>
 7626:  60:                 }
 7627:  61:                 @case ('Organization') {
 7628:  62:                   <nz-tag nzColor="green">组织</nz-tag>
 7629:  63:                 }
 7630:  64:               }
 7631:  65:             </nz-descriptions-item>
 7632:  66:             <nz-descriptions-item nzTitle="状态">
 7633:  67:               @switch (account()!.status) {
 7634:  68:                 @case ('active') {
 7635:  69:                   <nz-tag nzColor="success">活跃</nz-tag>
 7636:  70:                 }
 7637:  71:                 @case ('inactive') {
 7638:  72:                   <nz-tag nzColor="default">非活跃</nz-tag>
 7639:  73:                 }
 7640:  74:                 @case ('suspended') {
 7641:  75:                   <nz-tag nzColor="error">已暂停</nz-tag>
 7642:  76:                 }
 7643:  77:               }
 7644:  78:             </nz-descriptions-item>
 7645:  79:             <nz-descriptions-item nzTitle="创建时间">
 7646:  80:               {{ account()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
 7647:  81:             </nz-descriptions-item>
 7648:  82:             <nz-descriptions-item nzTitle="更新时间">
 7649:  83:               {{ account()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
 7650:  84:             </nz-descriptions-item>
 7651:  85:           </nz-descriptions>
 7652:  86:         </nz-card>
 7653:  87: 
 7654:  88:         <!-- 组织账户：显示团队信息 -->
 7655:  89:         @if (account()!.type === AccountType.ORGANIZATION) {
 7656:  90:           <nz-card nzTitle="团队信息" style="margin-bottom: 16px;">
 7657:  91:             @if (teamService.loading()) {
 7658:  92:               <nz-spin nzSimple></nz-spin>
 7659:  93:             } @else if (teamService.teams().length > 0) {
 7660:  94:               <nz-table
 7661:  95:                 [nzData]="teamService.teams()"
 7662:  96:                 [nzShowPagination]="false"
 7663:  97:                 [nzSize]="'small'"
 7664:  98:               >
 7665:  99:                 <thead>
 7666: 100:                   <tr>
 7667: 101:                     <th>团队名称</th>
 7668: 102:                     <th>描述</th>
 7669: 103:                     <th>创建时间</th>
 7670: 104:                     <th>操作</th>
 7671: 105:                   </tr>
 7672: 106:                 </thead>
 7673: 107:                 <tbody>
 7674: 108:                   @for (team of teamService.teams(); track team.id) {
 7675: 109:                     <tr>
 7676: 110:                       <td>{{ team.name }}</td>
 7677: 111:                       <td>{{ team.description || '-' }}</td>
 7678: 112:                       <td>{{ team.created_at | date: 'yyyy-MM-dd' }}</td>
 7679: 113:                       <td>
 7680: 114:                         <button nz-button nzType="link" nzSize="small" (click)="viewTeam(team.id)">
 7681: 115:                           查看
 7682: 116:                         </button>
 7683: 117:                       </td>
 7684: 118:                     </tr>
 7685: 119:                   }
 7686: 120:                 </tbody>
 7687: 121:               </nz-table>
 7688: 122:             } @else {
 7689: 123:               <nz-empty nzNotFoundContent="暂无团队"></nz-empty>
 7690: 124:             }
 7691: 125:           </nz-card>
 7692: 126: 
 7693: 127:           <!-- 组织账户：显示排班信息 -->
 7694: 128:           <nz-card nzTitle="排班信息">
 7695: 129:             @if (scheduleService.loading()) {
 7696: 130:               <nz-spin nzSimple></nz-spin>
 7697: 131:             } @else if (scheduleService.schedules().length > 0) {
 7698: 132:               <nz-table
 7699: 133:                 [nzData]="scheduleService.schedules()"
 7700: 134:                 [nzShowPagination]="false"
 7701: 135:                 [nzSize]="'small'"
 7702: 136:               >
 7703: 137:                 <thead>
 7704: 138:                   <tr>
 7705: 139:                     <th>日期</th>
 7706: 140:                     <th>账户</th>
 7707: 141:                     <th>团队</th>
 7708: 142:                     <th>备注</th>
 7709: 143:                   </tr>
 7710: 144:                 </thead>
 7711: 145:                 <tbody>
 7712: 146:                   @for (schedule of scheduleService.schedules(); track schedule.id) {
 7713: 147:                     <tr>
 7714: 148:                       <td>{{ schedule.schedule_date | date: 'yyyy-MM-dd' }}</td>
 7715: 149:                       <td>{{ schedule.account_id || '-' }}</td>
 7716: 150:                       <td>{{ schedule.team_id || '-' }}</td>
 7717: 151:                       <td>{{ schedule.notes || '-' }}</td>
 7718: 152:                     </tr>
 7719: 153:                   }
 7720: 154:                 </tbody>
 7721: 155:               </nz-table>
 7722: 156:             } @else {
 7723: 157:               <nz-empty nzNotFoundContent="暂无排班记录"></nz-empty>
 7724: 158:             }
 7725: 159:           </nz-card>
 7726: 160:         }
 7727: 161:       </div>
 7728: 162:     } @else {
 7729: 163:       <nz-empty nzNotFoundContent="账户不存在"></nz-empty>
 7730: 164:     }
 7731: 165:   `
 7732: 166: })
 7733: 167: export class AccountDetailComponent implements OnInit {
 7734: 168:   accountService = inject(AccountService);
 7735: 169:   teamService = inject(TeamService);
 7736: 170:   scheduleService = inject(OrganizationScheduleService);
 7737: 171:   route = inject(ActivatedRoute);
 7738: 172:   router = inject(Router);
 7739: 173:   message = inject(NzMessageService);
 7740: 174: 
 7741: 175:   // 使用 computed 从 Service 获取账户信息
 7742: 176:   account = computed(() => this.accountService.selectedAccount());
 7743: 177: 
 7744: 178:   // 导出枚举供模板使用
 7745: 179:   AccountType = AccountType;
 7746: 180:   AccountStatus = AccountStatus;
 7747: 181: 
 7748: 182:   ngOnInit(): void {
 7749: 183:     const accountId = this.route.snapshot.paramMap.get('id');
 7750: 184:     if (accountId) {
 7751: 185:       this.loadAccount(accountId);
 7752: 186:     }
 7753: 187:   }
 7754: 188: 
 7755: 189:   async loadAccount(id: string): Promise<void> {
 7756: 190:     try {
 7757: 191:       const account = await this.accountService.loadAccountById(id);
 7758: 192:       if (account) {
 7759: 193:         // 如果是组织账户，加载团队和排班信息
 7760: 194:         if (account.type === AccountType.ORGANIZATION) {
 7761: 195:           await this.loadTeams(account.id);
 7762: 196:           await this.loadSchedules(account.id);
 7763: 197:         }
 7764: 198:       } else {
 7765: 199:         this.message.warning('账户不存在');
 7766: 200:         this.goBack();
 7767: 201:       }
 7768: 202:     } catch (error) {
 7769: 203:       this.message.error('加载账户详情失败');
 7770: 204:     }
 7771: 205:   }
 7772: 206: 
 7773: 207:   async loadTeams(organizationId: string): Promise<void> {
 7774: 208:     try {
 7775: 209:       await this.teamService.loadTeamsByOrganizationId(organizationId);
 7776: 210:     } catch (error) {
 7777: 211:       // 静默失败，不影响主流程
 7778: 212:       console.error('加载团队信息失败', error);
 7779: 213:     }
 7780: 214:   }
 7781: 215: 
 7782: 216:   async loadSchedules(organizationId: string): Promise<void> {
 7783: 217:     try {
 7784: 218:       await this.scheduleService.loadSchedulesByOrganizationId(organizationId);
 7785: 219:     } catch (error) {
 7786: 220:       // 静默失败，不影响主流程
 7787: 221:       console.error('加载排班信息失败', error);
 7788: 222:     }
 7789: 223:   }
 7790: 224: 
 7791: 225:   goBack(): void {
 7792: 226:     this.router.navigate(['/accounts']);
 7793: 227:   }
 7794: 228: 
 7795: 229:   edit(): void {
 7796: 230:     if (this.account()) {
 7797: 231:       this.router.navigate(['/accounts', this.account()!.id, 'edit']);
 7798: 232:     }
 7799: 233:   }
 7800: 234: 
 7801: 235:   async delete(): Promise<void> {
 7802: 236:     if (!this.account()) {
 7803: 237:       return;
 7804: 238:     }
 7805: 239: 
 7806: 240:     // 使用 nz-modal 确认删除（这里简化处理，实际应该使用 ModalHelper）
 7807: 241:     if (confirm('确定要删除此账户吗？此操作不可恢复。')) {
 7808: 242:       try {
 7809: 243:         await this.accountService.deleteAccount(this.account()!.id);
 7810: 244:         this.message.success('删除成功');
 7811: 245:         this.goBack();
 7812: 246:       } catch (error) {
 7813: 247:         this.message.error('删除失败');
 7814: 248:       }
 7815: 249:     }
 7816: 250:   }
 7817: 251: 
 7818: 252:   viewTeam(teamId: string): void {
 7819: 253:     this.router.navigate(['/accounts/teams', teamId]);
 7820: 254:   }
 7821: 255: }
 7822: ````
 7823: 
 7824: ## File: src/app/routes/accounts/form/account-form.component.ts
 7825: ````typescript
 7826:   1: import { Component, OnInit, inject, computed } from '@angular/core';
 7827:   2: import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 7828:   3: import { ActivatedRoute, Router } from '@angular/router';
 7829:   4: import { SHARED_IMPORTS } from '@shared';
 7830:   5: import { AccountService, Account, AccountType, AccountStatus, AccountInsert, AccountUpdate } from '@shared';
 7831:   6: import { NzMessageService } from 'ng-zorro-antd/message';
 7832:   7: 
 7833:   8: /**
 7834:   9:  * 账户表单类型定义
 7835:  10:  */
 7836:  11: interface AccountFormValue {
 7837:  12:   name: string;
 7838:  13:   email: string | null;
 7839:  14:   type: AccountType;
 7840:  15:   status?: AccountStatus;
 7841:  16: }
 7842:  17: 
 7843:  18: @Component({
 7844:  19:   selector: 'app-account-form',
 7845:  20:   standalone: true,
 7846:  21:   imports: [SHARED_IMPORTS, ReactiveFormsModule],
 7847:  22:   template: `
 7848:  23:     <page-header [title]="isEditMode() ? '编辑账户' : '创建账户'">
 7849:  24:       <ng-template #extra>
 7850:  25:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 7851:  26:           <span nz-icon nzType="arrow-left"></span>
 7852:  27:           返回
 7853:  28:         </button>
 7854:  29:       </ng-template>
 7855:  30:     </page-header>
 7856:  31: 
 7857:  32:     <div style="padding: 16px;">
 7858:  33:       @if (accountService.loading()) {
 7859:  34:         <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
 7860:  35:           <ng-template #indicator>
 7861:  36:             <span nz-icon nzType="loading" style="font-size: 24px;"></span>
 7862:  37:           </ng-template>
 7863:  38:         </nz-spin>
 7864:  39:       } @else {
 7865:  40:         <nz-card [nzTitle]="isEditMode() ? '编辑账户信息' : '创建新账户'">
 7866:  41:           <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
 7867:  42:             <nz-form-item>
 7868:  43:               <nz-form-label [nzSpan]="4" nzRequired>账户名称</nz-form-label>
 7869:  44:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入账户名称'">
 7870:  45:                 <input nz-input formControlName="name" placeholder="请输入账户名称" />
 7871:  46:               </nz-form-control>
 7872:  47:             </nz-form-item>
 7873:  48: 
 7874:  49:             <nz-form-item>
 7875:  50:               <nz-form-label [nzSpan]="4" nzRequired>邮箱</nz-form-label>
 7876:  51:               <nz-form-control
 7877:  52:                 [nzSpan]="20"
 7878:  53:                 [nzErrorTip]="form.get('email')?.hasError('required') ? '请输入邮箱' : '请输入有效的邮箱地址'"
 7879:  54:               >
 7880:  55:                 <input nz-input formControlName="email" type="email" placeholder="请输入邮箱地址" />
 7881:  56:               </nz-form-control>
 7882:  57:             </nz-form-item>
 7883:  58: 
 7884:  59:             <nz-form-item>
 7885:  60:               <nz-form-label [nzSpan]="4" nzRequired>账户类型</nz-form-label>
 7886:  61:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择账户类型'">
 7887:  62:                 <nz-select formControlName="type" nzPlaceHolder="请选择账户类型">
 7888:  63:                   <nz-option [nzValue]="AccountType.USER" nzLabel="用户"></nz-option>
 7889:  64:                   <nz-option [nzValue]="AccountType.BOT" nzLabel="机器人"></nz-option>
 7890:  65:                   <nz-option [nzValue]="AccountType.ORGANIZATION" nzLabel="组织"></nz-option>
 7891:  66:                 </nz-select>
 7892:  67:               </nz-form-control>
 7893:  68:             </nz-form-item>
 7894:  69: 
 7895:  70:             @if (isEditMode()) {
 7896:  71:               <nz-form-item>
 7897:  72:                 <nz-form-label [nzSpan]="4">状态</nz-form-label>
 7898:  73:                 <nz-form-control [nzSpan]="20">
 7899:  74:                   <nz-select formControlName="status" nzPlaceHolder="请选择状态">
 7900:  75:                     <nz-option [nzValue]="AccountStatus.ACTIVE" nzLabel="活跃"></nz-option>
 7901:  76:                     <nz-option [nzValue]="AccountStatus.INACTIVE" nzLabel="非活跃"></nz-option>
 7902:  77:                     <nz-option [nzValue]="AccountStatus.SUSPENDED" nzLabel="已暂停"></nz-option>
 7903:  78:                   </nz-select>
 7904:  79:                 </nz-form-control>
 7905:  80:               </nz-form-item>
 7906:  81:             }
 7907:  82: 
 7908:  83:             <nz-form-item>
 7909:  84:               <nz-form-control [nzSpan]="24" [nzOffset]="4">
 7910:  85:                 <button nz-button nzType="primary" [nzLoading]="accountService.loading()" [disabled]="form.invalid">
 7911:  86:                   <span nz-icon nzType="save"></span>
 7912:  87:                   {{ isEditMode() ? '保存' : '创建' }}
 7913:  88:                 </button>
 7914:  89:                 <button nz-button nzType="default" type="button" (click)="goBack()" style="margin-left: 8px;">
 7915:  90:                   取消
 7916:  91:                 </button>
 7917:  92:               </nz-form-control>
 7918:  93:             </nz-form-item>
 7919:  94:           </form>
 7920:  95:         </nz-card>
 7921:  96:       }
 7922:  97:     </div>
 7923:  98:   `
 7924:  99: })
 7925: 100: export class AccountFormComponent implements OnInit {
 7926: 101:   accountService = inject(AccountService);
 7927: 102:   route = inject(ActivatedRoute);
 7928: 103:   router = inject(Router);
 7929: 104:   message = inject(NzMessageService);
 7930: 105: 
 7931: 106:   // 导出枚举供模板使用
 7932: 107:   AccountType = AccountType;
 7933: 108:   AccountStatus = AccountStatus;
 7934: 109: 
 7935: 110:   // 判断是否为编辑模式
 7936: 111:   isEditMode = computed(() => {
 7937: 112:     const id = this.route.snapshot.paramMap.get('id');
 7938: 113:     return !!id;
 7939: 114:   });
 7940: 115: 
 7941: 116:   // 表单定义
 7942: 117:   form = new FormGroup<{
 7943: 118:     name: FormControl<string>;
 7944: 119:     email: FormControl<string | null>;
 7945: 120:     type: FormControl<AccountType>;
 7946: 121:     status?: FormControl<AccountStatus>;
 7947: 122:   }>({
 7948: 123:     name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
 7949: 124:     email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
 7950: 125:     type: new FormControl(AccountType.USER, { nonNullable: true, validators: [Validators.required] }),
 7951: 126:     status: new FormControl(AccountStatus.ACTIVE, { nonNullable: true })
 7952: 127:   });
 7953: 128: 
 7954: 129:   ngOnInit(): void {
 7955: 130:     if (this.isEditMode()) {
 7956: 131:       const accountId = this.route.snapshot.paramMap.get('id');
 7957: 132:       if (accountId) {
 7958: 133:         this.loadAccount(accountId);
 7959: 134:       }
 7960: 135:     }
 7961: 136:   }
 7962: 137: 
 7963: 138:   async loadAccount(id: string): Promise<void> {
 7964: 139:     try {
 7965: 140:       const account = await this.accountService.loadAccountById(id);
 7966: 141:       if (account) {
 7967: 142:         this.form.patchValue({
 7968: 143:           name: account.name,
 7969: 144:           email: account.email,
 7970: 145:           type: account.type as AccountType,
 7971: 146:           status: account.status as AccountStatus
 7972: 147:         });
 7973: 148:       } else {
 7974: 149:         this.message.warning('账户不存在');
 7975: 150:         this.goBack();
 7976: 151:       }
 7977: 152:     } catch (error) {
 7978: 153:       this.message.error('加载账户信息失败');
 7979: 154:     }
 7980: 155:   }
 7981: 156: 
 7982: 157:   async onSubmit(): Promise<void> {
 7983: 158:     if (this.form.invalid) {
 7984: 159:       // 标记所有字段为 touched，显示验证错误
 7985: 160:       Object.values(this.form.controls).forEach(control => {
 7986: 161:         if (control.invalid) {
 7987: 162:           control.markAsTouched();
 7988: 163:           control.updateValueAndValidity({ onlySelf: true });
 7989: 164:         }
 7990: 165:       });
 7991: 166:       return;
 7992: 167:     }
 7993: 168: 
 7994: 169:     const formValue = this.form.value as AccountFormValue;
 7995: 170: 
 7996: 171:     try {
 7997: 172:       if (this.isEditMode()) {
 7998: 173:         const accountId = this.route.snapshot.paramMap.get('id')!;
 7999: 174:         const updateData: AccountUpdate = {
 8000: 175:           name: formValue.name,
 8001: 176:           email: formValue.email || undefined,
 8002: 177:           type: formValue.type,
 8003: 178:           status: formValue.status
 8004: 179:         };
 8005: 180:         await this.accountService.updateAccount(accountId, updateData);
 8006: 181:         this.message.success('更新成功');
 8007: 182:         this.router.navigate(['/accounts', accountId]);
 8008: 183:       } else {
 8009: 184:         const insertData: AccountInsert = {
 8010: 185:           name: formValue.name,
 8011: 186:           email: formValue.email || undefined,
 8012: 187:           type: formValue.type,
 8013: 188:           status: formValue.status || AccountStatus.ACTIVE
 8014: 189:         };
 8015: 190:         const account = await this.accountService.createAccount(insertData);
 8016: 191:         this.message.success('创建成功');
 8017: 192:         this.router.navigate(['/accounts', account.id]);
 8018: 193:       }
 8019: 194:     } catch (error) {
 8020: 195:       this.message.error(this.isEditMode() ? '更新失败' : '创建失败');
 8021: 196:     }
 8022: 197:   }
 8023: 198: 
 8024: 199:   goBack(): void {
 8025: 200:     if (this.isEditMode()) {
 8026: 201:       const accountId = this.route.snapshot.paramMap.get('id');
 8027: 202:       if (accountId) {
 8028: 203:         this.router.navigate(['/accounts', accountId]);
 8029: 204:       } else {
 8030: 205:         this.router.navigate(['/accounts']);
 8031: 206:       }
 8032: 207:     } else {
 8033: 208:       this.router.navigate(['/accounts']);
 8034: 209:     }
 8035: 210:   }
 8036: 211: }
 8037: ````
 8038: 
 8039: ## File: src/app/routes/accounts/list/account-list.component.ts
 8040: ````typescript
 8041:   1: import { Component, OnInit, inject, signal } from '@angular/core';
 8042:   2: import { Router } from '@angular/router';
 8043:   3: import { STColumn, STData } from '@delon/abc/st';
 8044:   4: import { SHARED_IMPORTS } from '@shared';
 8045:   5: import { AccountService, Account, AccountType, AccountStatus } from '@shared';
 8046:   6: import { NzMessageService } from 'ng-zorro-antd/message';
 8047:   7: 
 8048:   8: @Component({
 8049:   9:   selector: 'app-account-list',
 8050:  10:   standalone: true,
 8051:  11:   imports: [SHARED_IMPORTS],
 8052:  12:   template: `
 8053:  13:     <page-header [title]="'账户管理'">
 8054:  14:       <ng-template #extra>
 8055:  15:         <button nz-button nzType="primary" (click)="createAccount()">
 8056:  16:           <span nz-icon nzType="plus"></span>
 8057:  17:           新建账户
 8058:  18:         </button>
 8059:  19:       </ng-template>
 8060:  20:     </page-header>
 8061:  21: 
 8062:  22:     <nz-card nzTitle="管理系统中的所有账户" style="margin-top: 16px;">
 8063:  23:       <st
 8064:  24:         #st
 8065:  25:         [data]="accountService.accounts()"
 8066:  26:         [columns]="columns"
 8067:  27:         [loading]="accountService.loading()"
 8068:  28:         [page]="{ front: false, show: true, showSize: true }"
 8069:  29:         (change)="onTableChange($event)"
 8070:  30:       >
 8071:  31:         <ng-template #type let-record>
 8072:  32:           @switch (record.type) {
 8073:  33:             @case ('User') {
 8074:  34:               <nz-tag nzColor="blue">用户</nz-tag>
 8075:  35:             }
 8076:  36:             @case ('Bot') {
 8077:  37:               <nz-tag nzColor="purple">机器人</nz-tag>
 8078:  38:             }
 8079:  39:             @case ('Organization') {
 8080:  40:               <nz-tag nzColor="green">组织</nz-tag>
 8081:  41:             }
 8082:  42:           }
 8083:  43:         </ng-template>
 8084:  44: 
 8085:  45:         <ng-template #status let-record>
 8086:  46:           @switch (record.status) {
 8087:  47:             @case ('active') {
 8088:  48:               <nz-tag nzColor="success">活跃</nz-tag>
 8089:  49:             }
 8090:  50:             @case ('inactive') {
 8091:  51:               <nz-tag nzColor="default">非活跃</nz-tag>
 8092:  52:             }
 8093:  53:             @case ('suspended') {
 8094:  54:               <nz-tag nzColor="error">已暂停</nz-tag>
 8095:  55:             }
 8096:  56:           }
 8097:  57:         </ng-template>
 8098:  58:       </st>
 8099:  59:     </nz-card>
 8100:  60:   `
 8101:  61: })
 8102:  62: export class AccountListComponent implements OnInit {
 8103:  63:   accountService = inject(AccountService);
 8104:  64:   router = inject(Router);
 8105:  65:   message = inject(NzMessageService);
 8106:  66: 
 8107:  67:   columns: STColumn[] = [
 8108:  68:     { title: 'ID', index: 'id', width: 100 },
 8109:  69:     { title: '名称', index: 'name', width: 200 },
 8110:  70:     { title: '类型', index: 'type', width: 100, render: 'type' },
 8111:  71:     { title: '邮箱', index: 'email', width: 200 },
 8112:  72:     { title: '状态', index: 'status', width: 100, render: 'status' },
 8113:  73:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 8114:  74:     {
 8115:  75:       title: '操作',
 8116:  76:       width: 200,
 8117:  77:       buttons: [
 8118:  78:         {
 8119:  79:           text: '查看',
 8120:  80:           click: (record: Account) => this.viewDetail(record.id)
 8121:  81:         },
 8122:  82:         {
 8123:  83:           text: '编辑',
 8124:  84:           click: (record: Account) => this.edit(record.id)
 8125:  85:         },
 8126:  86:         {
 8127:  87:           text: '删除',
 8128:  88:           type: 'del',
 8129:  89:           pop: true,
 8130:  90:           click: (record: Account) => this.delete(record.id)
 8131:  91:         }
 8132:  92:       ]
 8133:  93:     }
 8134:  94:   ];
 8135:  95: 
 8136:  96:   ngOnInit(): void {
 8137:  97:     this.loadAccounts();
 8138:  98:   }
 8139:  99: 
 8140: 100:   async loadAccounts(): Promise<void> {
 8141: 101:     try {
 8142: 102:       await this.accountService.loadAccounts();
 8143: 103:     } catch (error) {
 8144: 104:       this.message.error('加载账户列表失败');
 8145: 105:     }
 8146: 106:   }
 8147: 107: 
 8148: 108:   onTableChange(event: any): void {
 8149: 109:     // 处理表格变化事件（分页、排序等）
 8150: 110:   }
 8151: 111: 
 8152: 112:   createAccount(): void {
 8153: 113:     this.router.navigate(['/accounts/create']);
 8154: 114:   }
 8155: 115: 
 8156: 116:   viewDetail(id: string): void {
 8157: 117:     this.router.navigate(['/accounts', id]);
 8158: 118:   }
 8159: 119: 
 8160: 120:   edit(id: string): void {
 8161: 121:     this.router.navigate(['/accounts', id, 'edit']);
 8162: 122:   }
 8163: 123: 
 8164: 124:   async delete(id: string): Promise<void> {
 8165: 125:     try {
 8166: 126:       await this.accountService.deleteAccount(id);
 8167: 127:       this.message.success('删除成功');
 8168: 128:     } catch (error) {
 8169: 129:       this.message.error('删除失败');
 8170: 130:     }
 8171: 131:   }
 8172: 132: }
 8173: ````
 8174: 
 8175: ## File: src/app/routes/accounts/organizations/organization-list.component.ts
 8176: ````typescript
 8177:   1: import { Component, OnInit, inject } from '@angular/core';
 8178:   2: import { Router } from '@angular/router';
 8179:   3: import { STColumn } from '@delon/abc/st';
 8180:   4: import { SHARED_IMPORTS } from '@shared';
 8181:   5: import { AccountService, Account } from '@shared';
 8182:   6: import { NzMessageService } from 'ng-zorro-antd/message';
 8183:   7: 
 8184:   8: @Component({
 8185:   9:   selector: 'app-organization-list',
 8186:  10:   standalone: true,
 8187:  11:   imports: [SHARED_IMPORTS],
 8188:  12:   template: `
 8189:  13:     <page-header [title]="'组织管理'">
 8190:  14:       <ng-template #extra>
 8191:  15:         <button nz-button nzType="primary" (click)="createOrganization()">
 8192:  16:           <span nz-icon nzType="plus"></span>
 8193:  17:           新建组织
 8194:  18:         </button>
 8195:  19:       </ng-template>
 8196:  20:     </page-header>
 8197:  21: 
 8198:  22:     <nz-card nzTitle="管理系统中的所有组织账户" style="margin-top: 16px;">
 8199:  23:       <st
 8200:  24:         #st
 8201:  25:         [data]="organizations()"
 8202:  26:         [columns]="columns"
 8203:  27:         [loading]="loading()"
 8204:  28:         [page]="{ front: false, show: true, showSize: true }"
 8205:  29:         (change)="onTableChange($event)"
 8206:  30:       >
 8207:  31:         <ng-template #status let-record>
 8208:  32:           @switch (record.status) {
 8209:  33:             @case ('active') {
 8210:  34:               <nz-tag nzColor="success">活跃</nz-tag>
 8211:  35:             }
 8212:  36:             @case ('inactive') {
 8213:  37:               <nz-tag nzColor="default">非活跃</nz-tag>
 8214:  38:             }
 8215:  39:             @case ('suspended') {
 8216:  40:               <nz-tag nzColor="error">已暂停</nz-tag>
 8217:  41:             }
 8218:  42:           }
 8219:  43:         </ng-template>
 8220:  44:       </st>
 8221:  45:     </nz-card>
 8222:  46:   `
 8223:  47: })
 8224:  48: export class OrganizationListComponent implements OnInit {
 8225:  49:   accountService = inject(AccountService);
 8226:  50:   router = inject(Router);
 8227:  51:   message = inject(NzMessageService);
 8228:  52: 
 8229:  53:   organizations = this.accountService.accounts;
 8230:  54:   loading = this.accountService.loading;
 8231:  55: 
 8232:  56:   columns: STColumn[] = [
 8233:  57:     { title: 'ID', index: 'id', width: 100 },
 8234:  58:     { title: '组织名称', index: 'name', width: 200 },
 8235:  59:     { title: '邮箱', index: 'email', width: 200 },
 8236:  60:     { title: '状态', index: 'status', width: 100, render: 'status' },
 8237:  61:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 8238:  62:     {
 8239:  63:       title: '操作',
 8240:  64:       width: 250,
 8241:  65:       buttons: [
 8242:  66:         {
 8243:  67:           text: '查看',
 8244:  68:           click: (record: Account) => this.viewDetail(record.id)
 8245:  69:         },
 8246:  70:         {
 8247:  71:           text: '编辑',
 8248:  72:           click: (record: Account) => this.edit(record.id)
 8249:  73:         },
 8250:  74:         {
 8251:  75:           text: '成员管理',
 8252:  76:           click: (record: Account) => this.manageMembers(record.id)
 8253:  77:         },
 8254:  78:         {
 8255:  79:           text: '删除',
 8256:  80:           type: 'del',
 8257:  81:           pop: true,
 8258:  82:           click: (record: Account) => this.delete(record.id)
 8259:  83:         }
 8260:  84:       ]
 8261:  85:     }
 8262:  86:   ];
 8263:  87: 
 8264:  88:   ngOnInit(): void {
 8265:  89:     this.loadOrganizations();
 8266:  90:   }
 8267:  91: 
 8268:  92:   async loadOrganizations(): Promise<void> {
 8269:  93:     try {
 8270:  94:       await this.accountService.loadAccounts();
 8271:  95:       // 过滤出组织类型的账户
 8272:  96:       // 注意：这里需要根据实际业务逻辑过滤
 8273:  97:     } catch (error) {
 8274:  98:       this.message.error('加载组织列表失败');
 8275:  99:     }
 8276: 100:   }
 8277: 101: 
 8278: 102:   onTableChange(event: any): void {
 8279: 103:     // 处理表格变化事件（分页、排序等）
 8280: 104:   }
 8281: 105: 
 8282: 106:   createOrganization(): void {
 8283: 107:     this.router.navigate(['/accounts/create'], { queryParams: { type: 'Organization' } });
 8284: 108:   }
 8285: 109: 
 8286: 110:   viewDetail(id: string): void {
 8287: 111:     this.router.navigate(['/accounts', id]);
 8288: 112:   }
 8289: 113: 
 8290: 114:   edit(id: string): void {
 8291: 115:     this.router.navigate(['/accounts', id, 'edit']);
 8292: 116:   }
 8293: 117: 
 8294: 118:   manageMembers(id: string): void {
 8295: 119:     // TODO: 导航到成员管理页面
 8296: 120:     this.message.info('成员管理功能开发中');
 8297: 121:   }
 8298: 122: 
 8299: 123:   async delete(id: string): Promise<void> {
 8300: 124:     try {
 8301: 125:       await this.accountService.deleteAccount(id);
 8302: 126:       this.message.success('删除成功');
 8303: 127:       await this.loadOrganizations();
 8304: 128:     } catch (error) {
 8305: 129:       this.message.error('删除失败');
 8306: 130:     }
 8307: 131:   }
 8308: 132: }
 8309: ````
 8310: 
 8311: ## File: src/app/routes/accounts/schedules/schedule-list.component.ts
 8312: ````typescript
 8313:   1: import { Component, OnInit, inject } from '@angular/core';
 8314:   2: import { Router } from '@angular/router';
 8315:   3: import { STColumn } from '@delon/abc/st';
 8316:   4: import { SHARED_IMPORTS } from '@shared';
 8317:   5: import { OrganizationScheduleService, OrganizationSchedule } from '@shared';
 8318:   6: import { NzMessageService } from 'ng-zorro-antd/message';
 8319:   7: 
 8320:   8: @Component({
 8321:   9:   selector: 'app-schedule-list',
 8322:  10:   standalone: true,
 8323:  11:   imports: [SHARED_IMPORTS],
 8324:  12:   template: `
 8325:  13:     <page-header [title]="'排班管理'">
 8326:  14:       <ng-template #extra>
 8327:  15:         <button nz-button nzType="primary" (click)="createSchedule()">
 8328:  16:           <span nz-icon nzType="plus"></span>
 8329:  17:           新建排班
 8330:  18:         </button>
 8331:  19:       </ng-template>
 8332:  20:     </page-header>
 8333:  21: 
 8334:  22:     <nz-card nzTitle="管理系统中的所有排班" style="margin-top: 16px;">
 8335:  23:       <st
 8336:  24:         #st
 8337:  25:         [data]="scheduleService.schedules()"
 8338:  26:         [columns]="columns"
 8339:  27:         [loading]="scheduleService.loading()"
 8340:  28:         [page]="{ front: false, show: true, showSize: true }"
 8341:  29:         (change)="onTableChange($event)"
 8342:  30:       >
 8343:  31:         <ng-template #date let-record>
 8344:  32:           {{ record.scheduleDate | date: 'yyyy-MM-dd' }}
 8345:  33:         </ng-template>
 8346:  34:       </st>
 8347:  35:     </nz-card>
 8348:  36:   `
 8349:  37: })
 8350:  38: export class ScheduleListComponent implements OnInit {
 8351:  39:   scheduleService = inject(OrganizationScheduleService);
 8352:  40:   router = inject(Router);
 8353:  41:   message = inject(NzMessageService);
 8354:  42: 
 8355:  43:   columns: STColumn[] = [
 8356:  44:     { title: 'ID', index: 'id', width: 100 },
 8357:  45:     { title: '日期', index: 'schedule_date', width: 120, render: 'date' },
 8358:  46:     { title: '组织ID', index: 'organization_id', width: 200 },
 8359:  47:     { title: '蓝图ID', index: 'blueprint_id', width: 200 },
 8360:  48:     { title: '分支ID', index: 'branch_id', width: 200 },
 8361:  49:     { title: '账户ID', index: 'account_id', width: 200 },
 8362:  50:     { title: '团队ID', index: 'team_id', width: 200 },
 8363:  51:     { title: '备注', index: 'notes', width: 200 },
 8364:  52:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 8365:  53:     {
 8366:  54:       title: '操作',
 8367:  55:       width: 200,
 8368:  56:       buttons: [
 8369:  57:         {
 8370:  58:           text: '编辑',
 8371:  59:           click: (record: OrganizationSchedule) => this.edit(record.id)
 8372:  60:         },
 8373:  61:         {
 8374:  62:           text: '删除',
 8375:  63:           type: 'del',
 8376:  64:           pop: true,
 8377:  65:           click: (record: OrganizationSchedule) => this.delete(record.id)
 8378:  66:         }
 8379:  67:       ]
 8380:  68:     }
 8381:  69:   ];
 8382:  70: 
 8383:  71:   ngOnInit(): void {
 8384:  72:     this.loadSchedules();
 8385:  73:   }
 8386:  74: 
 8387:  75:   async loadSchedules(): Promise<void> {
 8388:  76:     try {
 8389:  77:       await this.scheduleService.loadSchedules();
 8390:  78:     } catch (error) {
 8391:  79:       this.message.error('加载排班列表失败');
 8392:  80:     }
 8393:  81:   }
 8394:  82: 
 8395:  83:   onTableChange(event: any): void {
 8396:  84:     // 处理表格变化事件（分页、排序等）
 8397:  85:   }
 8398:  86: 
 8399:  87:   createSchedule(): void {
 8400:  88:     // TODO: 实现创建排班功能（可以使用 Modal 或跳转到创建页面）
 8401:  89:     this.message.info('创建排班功能待实现');
 8402:  90:   }
 8403:  91: 
 8404:  92:   edit(id: string): void {
 8405:  93:     // TODO: 实现编辑排班功能
 8406:  94:     this.message.info('编辑排班功能待实现');
 8407:  95:   }
 8408:  96: 
 8409:  97:   async delete(id: string): Promise<void> {
 8410:  98:     try {
 8411:  99:       await this.scheduleService.deleteSchedule(id);
 8412: 100:       this.message.success('删除成功');
 8413: 101:       await this.loadSchedules();
 8414: 102:     } catch (error) {
 8415: 103:       this.message.error('删除失败');
 8416: 104:     }
 8417: 105:   }
 8418: 106: }
 8419: ````
 8420: 
 8421: ## File: src/app/routes/accounts/teams/team-detail/team-detail.component.ts
 8422: ````typescript
 8423:   1: import { Component, OnInit, inject, computed } from '@angular/core';
 8424:   2: import { ActivatedRoute, Router } from '@angular/router';
 8425:   3: import { SHARED_IMPORTS } from '@shared';
 8426:   4: import { TeamService, Team, TeamMember, TeamMemberRole } from '@shared';
 8427:   5: import { NzMessageService } from 'ng-zorro-antd/message';
 8428:   6: 
 8429:   7: @Component({
 8430:   8:   selector: 'app-team-detail',
 8431:   9:   standalone: true,
 8432:  10:   imports: [SHARED_IMPORTS],
 8433:  11:   template: `
 8434:  12:     <page-header [title]="'团队详情'">
 8435:  13:       <ng-template #extra>
 8436:  14:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 8437:  15:           <span nz-icon nzType="arrow-left"></span>
 8438:  16:           返回
 8439:  17:         </button>
 8440:  18:         @if (team()) {
 8441:  19:           <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
 8442:  20:             <span nz-icon nzType="edit"></span>
 8443:  21:             编辑
 8444:  22:           </button>
 8445:  23:           <button nz-button nzDanger (click)="delete()">
 8446:  24:             <span nz-icon nzType="delete"></span>
 8447:  25:             删除
 8448:  26:           </button>
 8449:  27:         }
 8450:  28:       </ng-template>
 8451:  29:     </page-header>
 8452:  30: 
 8453:  31:     @if (teamService.loading()) {
 8454:  32:       <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
 8455:  33:         <ng-template #indicator>
 8456:  34:           <span nz-icon nzType="loading" style="font-size: 24px;"></span>
 8457:  35:         </ng-template>
 8458:  36:       </nz-spin>
 8459:  37:     } @else if (teamService.error()) {
 8460:  38:       <nz-alert
 8461:  39:         nzType="error"
 8462:  40:         [nzMessage]="'加载失败'"
 8463:  41:         [nzDescription]="teamService.error()"
 8464:  42:         nzShowIcon
 8465:  43:         style="margin: 16px;"
 8466:  44:       ></nz-alert>
 8467:  45:     } @else if (team()) {
 8468:  46:       <div style="padding: 16px;">
 8469:  47:         <!-- 团队基本信息 -->
 8470:  48:         <nz-card nzTitle="基本信息" style="margin-bottom: 16px;">
 8471:  49:           <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
 8472:  50:             <nz-descriptions-item nzTitle="ID">{{ team()!.id }}</nz-descriptions-item>
 8473:  51:             <nz-descriptions-item nzTitle="团队名称">{{ team()!.name }}</nz-descriptions-item>
 8474:  52:             <nz-descriptions-item nzTitle="描述">{{ team()!.description || '-' }}</nz-descriptions-item>
 8475:  53:             <nz-descriptions-item nzTitle="组织ID">{{ team()!.organization_id }}</nz-descriptions-item>
 8476:  54:             <nz-descriptions-item nzTitle="创建时间">
 8477:  55:               {{ team()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
 8478:  56:             </nz-descriptions-item>
 8479:  57:             <nz-descriptions-item nzTitle="更新时间">
 8480:  58:               {{ team()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
 8481:  59:             </nz-descriptions-item>
 8482:  60:           </nz-descriptions>
 8483:  61:         </nz-card>
 8484:  62: 
 8485:  63:         <!-- 团队成员列表 -->
 8486:  64:         <nz-card nzTitle="团队成员">
 8487:  65:           <ng-template #extra>
 8488:  66:             <button nz-button nzType="primary" nzSize="small" (click)="addMember()">
 8489:  67:               <span nz-icon nzType="plus"></span>
 8490:  68:               添加成员
 8491:  69:             </button>
 8492:  70:           </ng-template>
 8493:  71: 
 8494:  72:           @if (teamService.teamMembers().length > 0) {
 8495:  73:             <nz-table
 8496:  74:               [nzData]="teamService.teamMembers()"
 8497:  75:               [nzShowPagination]="false"
 8498:  76:               [nzSize]="'small'"
 8499:  77:             >
 8500:  78:               <thead>
 8501:  79:                 <tr>
 8502:  80:                   <th>账户ID</th>
 8503:  81:                   <th>角色</th>
 8504:  82:                   <th>加入时间</th>
 8505:  83:                   <th>操作</th>
 8506:  84:                 </tr>
 8507:  85:               </thead>
 8508:  86:               <tbody>
 8509:  87:                 @for (member of teamService.teamMembers(); track member.id) {
 8510:  88:                   <tr>
 8511:  89:                     <td>{{ member.account_id }}</td>
 8512:  90:                     <td>
 8513:  91:                       @switch (member.role) {
 8514:  92:                         @case ('leader') {
 8515:  93:                           <nz-tag nzColor="red">负责人</nz-tag>
 8516:  94:                         }
 8517:  95:                         @case ('member') {
 8518:  96:                           <nz-tag nzColor="blue">成员</nz-tag>
 8519:  97:                         }
 8520:  98:                       }
 8521:  99:                     </td>
 8522: 100:                     <td>{{ member.joined_at | date: 'yyyy-MM-dd' }}</td>
 8523: 101:                     <td>
 8524: 102:                       <button nz-button nzType="link" nzSize="small" (click)="changeRole(member)">
 8525: 103:                         变更角色
 8526: 104:                       </button>
 8527: 105:                       <button nz-button nzType="link" nzDanger nzSize="small" (click)="removeMember(member.id)">
 8528: 106:                         移除
 8529: 107:                       </button>
 8530: 108:                     </td>
 8531: 109:                   </tr>
 8532: 110:                 }
 8533: 111:               </tbody>
 8534: 112:             </nz-table>
 8535: 113:           } @else {
 8536: 114:             <nz-empty nzNotFoundContent="暂无成员"></nz-empty>
 8537: 115:           }
 8538: 116:         </nz-card>
 8539: 117:       </div>
 8540: 118:     } @else {
 8541: 119:       <nz-empty nzNotFoundContent="团队不存在"></nz-empty>
 8542: 120:     }
 8543: 121:   `
 8544: 122: })
 8545: 123: export class TeamDetailComponent implements OnInit {
 8546: 124:   teamService = inject(TeamService);
 8547: 125:   route = inject(ActivatedRoute);
 8548: 126:   router = inject(Router);
 8549: 127:   message = inject(NzMessageService);
 8550: 128: 
 8551: 129:   // 使用 computed 从 Service 获取团队信息
 8552: 130:   team = computed(() => this.teamService.selectedTeam());
 8553: 131: 
 8554: 132:   // 导出枚举供模板使用
 8555: 133:   TeamMemberRole = TeamMemberRole;
 8556: 134: 
 8557: 135:   ngOnInit(): void {
 8558: 136:     const teamId = this.route.snapshot.paramMap.get('id');
 8559: 137:     if (teamId) {
 8560: 138:       this.loadTeam(teamId);
 8561: 139:     }
 8562: 140:   }
 8563: 141: 
 8564: 142:   async loadTeam(id: string): Promise<void> {
 8565: 143:     try {
 8566: 144:       const team = await this.teamService.loadTeamById(id);
 8567: 145:       if (!team) {
 8568: 146:         this.message.warning('团队不存在');
 8569: 147:         this.goBack();
 8570: 148:       }
 8571: 149:     } catch (error) {
 8572: 150:       this.message.error('加载团队详情失败');
 8573: 151:     }
 8574: 152:   }
 8575: 153: 
 8576: 154:   goBack(): void {
 8577: 155:     this.router.navigate(['/accounts/teams']);
 8578: 156:   }
 8579: 157: 
 8580: 158:   edit(): void {
 8581: 159:     if (this.team()) {
 8582: 160:       this.router.navigate(['/accounts/teams', this.team()!.id, 'edit']);
 8583: 161:     }
 8584: 162:   }
 8585: 163: 
 8586: 164:   async delete(): Promise<void> {
 8587: 165:     if (!this.team()) {
 8588: 166:       return;
 8589: 167:     }
 8590: 168: 
 8591: 169:     if (confirm('确定要删除此团队吗？此操作不可恢复。')) {
 8592: 170:       try {
 8593: 171:         await this.teamService.deleteTeam(this.team()!.id);
 8594: 172:         this.message.success('删除成功');
 8595: 173:         this.goBack();
 8596: 174:       } catch (error) {
 8597: 175:         this.message.error('删除失败');
 8598: 176:       }
 8599: 177:     }
 8600: 178:   }
 8601: 179: 
 8602: 180:   addMember(): void {
 8603: 181:     // TODO: 实现添加成员功能（可以使用 Modal 或跳转到添加页面）
 8604: 182:     this.message.info('添加成员功能待实现');
 8605: 183:   }
 8606: 184: 
 8607: 185:   async changeRole(member: TeamMember): Promise<void> {
 8608: 186:     // TODO: 实现变更角色功能
 8609: 187:     const newRole = member.role === TeamMemberRole.LEADER ? TeamMemberRole.MEMBER : TeamMemberRole.LEADER;
 8610: 188:     try {
 8611: 189:       await this.teamService.updateTeamMemberRole(member.id, newRole);
 8612: 190:       this.message.success('角色变更成功');
 8613: 191:     } catch (error) {
 8614: 192:       this.message.error('角色变更失败');
 8615: 193:     }
 8616: 194:   }
 8617: 195: 
 8618: 196:   async removeMember(memberId: string): Promise<void> {
 8619: 197:     if (confirm('确定要移除此成员吗？')) {
 8620: 198:       try {
 8621: 199:         await this.teamService.removeTeamMember(memberId);
 8622: 200:         this.message.success('移除成功');
 8623: 201:       } catch (error) {
 8624: 202:         this.message.error('移除失败');
 8625: 203:       }
 8626: 204:     }
 8627: 205:   }
 8628: 206: }
 8629: ````
 8630: 
 8631: ## File: src/app/routes/accounts/teams/team-list.component.ts
 8632: ````typescript
 8633:   1: import { Component, OnInit, inject, computed } from '@angular/core';
 8634:   2: import { Router } from '@angular/router';
 8635:   3: import { STColumn } from '@delon/abc/st';
 8636:   4: import { SHARED_IMPORTS } from '@shared';
 8637:   5: import { TeamService, Team } from '@shared';
 8638:   6: import { NzMessageService } from 'ng-zorro-antd/message';
 8639:   7: 
 8640:   8: @Component({
 8641:   9:   selector: 'app-team-list',
 8642:  10:   standalone: true,
 8643:  11:   imports: [SHARED_IMPORTS],
 8644:  12:   template: `
 8645:  13:     <page-header [title]="'团队管理'">
 8646:  14:       <ng-template #extra>
 8647:  15:         <button nz-button nzType="primary" (click)="createTeam()">
 8648:  16:           <span nz-icon nzType="plus"></span>
 8649:  17:           新建团队
 8650:  18:         </button>
 8651:  19:       </ng-template>
 8652:  20:     </page-header>
 8653:  21: 
 8654:  22:     <nz-card nzTitle="管理系统中的所有团队" style="margin-top: 16px;">
 8655:  23:       <st
 8656:  24:         #st
 8657:  25:         [data]="teamService.teams()"
 8658:  26:         [columns]="columns"
 8659:  27:         [loading]="teamService.loading()"
 8660:  28:         [page]="{ front: false, show: true, showSize: true }"
 8661:  29:         (change)="onTableChange($event)"
 8662:  30:       >
 8663:  31:         <ng-template #description let-record>
 8664:  32:           {{ record.description || '-' }}
 8665:  33:         </ng-template>
 8666:  34:       </st>
 8667:  35:     </nz-card>
 8668:  36:   `
 8669:  37: })
 8670:  38: export class TeamListComponent implements OnInit {
 8671:  39:   teamService = inject(TeamService);
 8672:  40:   router = inject(Router);
 8673:  41:   message = inject(NzMessageService);
 8674:  42: 
 8675:  43:   columns: STColumn[] = [
 8676:  44:     { title: 'ID', index: 'id', width: 100 },
 8677:  45:     { title: '团队名称', index: 'name', width: 200 },
 8678:  46:     { title: '描述', index: 'description', width: 300, render: 'description' },
 8679:  47:     { title: '组织ID', index: 'organization_id', width: 200 },
 8680:  48:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 8681:  49:     {
 8682:  50:       title: '操作',
 8683:  51:       width: 200,
 8684:  52:       buttons: [
 8685:  53:         {
 8686:  54:           text: '查看',
 8687:  55:           click: (record: Team) => this.viewDetail(record.id)
 8688:  56:         },
 8689:  57:         {
 8690:  58:           text: '编辑',
 8691:  59:           click: (record: Team) => this.edit(record.id)
 8692:  60:         },
 8693:  61:         {
 8694:  62:           text: '删除',
 8695:  63:           type: 'del',
 8696:  64:           pop: true,
 8697:  65:           click: (record: Team) => this.delete(record.id)
 8698:  66:         }
 8699:  67:       ]
 8700:  68:     }
 8701:  69:   ];
 8702:  70: 
 8703:  71:   ngOnInit(): void {
 8704:  72:     this.loadTeams();
 8705:  73:   }
 8706:  74: 
 8707:  75:   async loadTeams(): Promise<void> {
 8708:  76:     try {
 8709:  77:       await this.teamService.loadTeams();
 8710:  78:     } catch (error) {
 8711:  79:       this.message.error('加载团队列表失败');
 8712:  80:     }
 8713:  81:   }
 8714:  82: 
 8715:  83:   onTableChange(event: any): void {
 8716:  84:     // 处理表格变化事件（分页、排序等）
 8717:  85:   }
 8718:  86: 
 8719:  87:   createTeam(): void {
 8720:  88:     this.router.navigate(['/accounts/teams/create']);
 8721:  89:   }
 8722:  90: 
 8723:  91:   viewDetail(id: string): void {
 8724:  92:     this.router.navigate(['/accounts/teams', id]);
 8725:  93:   }
 8726:  94: 
 8727:  95:   edit(id: string): void {
 8728:  96:     this.router.navigate(['/accounts/teams', id, 'edit']);
 8729:  97:   }
 8730:  98: 
 8731:  99:   async delete(id: string): Promise<void> {
 8732: 100:     try {
 8733: 101:       await this.teamService.deleteTeam(id);
 8734: 102:       this.message.success('删除成功');
 8735: 103:       await this.loadTeams();
 8736: 104:     } catch (error) {
 8737: 105:       this.message.error('删除失败');
 8738: 106:     }
 8739: 107:   }
 8740: 108: }
 8741: ````
 8742: 
 8743: ## File: src/app/routes/accounts/users/user-list.component.ts
 8744: ````typescript
 8745:   1: import { Component, OnInit, inject } from '@angular/core';
 8746:   2: import { Router } from '@angular/router';
 8747:   3: import { STColumn } from '@delon/abc/st';
 8748:   4: import { SHARED_IMPORTS } from '@shared';
 8749:   5: import { AccountService, Account } from '@shared';
 8750:   6: import { NzMessageService } from 'ng-zorro-antd/message';
 8751:   7: 
 8752:   8: @Component({
 8753:   9:   selector: 'app-user-list',
 8754:  10:   standalone: true,
 8755:  11:   imports: [SHARED_IMPORTS],
 8756:  12:   template: `
 8757:  13:     <page-header [title]="'用户管理'">
 8758:  14:       <ng-template #extra>
 8759:  15:         <button nz-button nzType="primary" (click)="createUser()">
 8760:  16:           <span nz-icon nzType="plus"></span>
 8761:  17:           新建用户
 8762:  18:         </button>
 8763:  19:       </ng-template>
 8764:  20:     </page-header>
 8765:  21: 
 8766:  22:     <nz-card nzTitle="管理系统中的所有用户账户" style="margin-top: 16px;">
 8767:  23:       <st
 8768:  24:         #st
 8769:  25:         [data]="users()"
 8770:  26:         [columns]="columns"
 8771:  27:         [loading]="loading()"
 8772:  28:         [page]="{ front: false, show: true, showSize: true }"
 8773:  29:         (change)="onTableChange($event)"
 8774:  30:       >
 8775:  31:         <ng-template #status let-record>
 8776:  32:           @switch (record.status) {
 8777:  33:             @case ('active') {
 8778:  34:               <nz-tag nzColor="success">活跃</nz-tag>
 8779:  35:             }
 8780:  36:             @case ('inactive') {
 8781:  37:               <nz-tag nzColor="default">非活跃</nz-tag>
 8782:  38:             }
 8783:  39:             @case ('suspended') {
 8784:  40:               <nz-tag nzColor="error">已暂停</nz-tag>
 8785:  41:             }
 8786:  42:           }
 8787:  43:         </ng-template>
 8788:  44:       </st>
 8789:  45:     </nz-card>
 8790:  46:   `
 8791:  47: })
 8792:  48: export class UserListComponent implements OnInit {
 8793:  49:   accountService = inject(AccountService);
 8794:  50:   router = inject(Router);
 8795:  51:   message = inject(NzMessageService);
 8796:  52: 
 8797:  53:   users = this.accountService.accounts;
 8798:  54:   loading = this.accountService.loading;
 8799:  55: 
 8800:  56:   columns: STColumn[] = [
 8801:  57:     { title: 'ID', index: 'id', width: 100 },
 8802:  58:     { title: '用户名', index: 'name', width: 200 },
 8803:  59:     { title: '邮箱', index: 'email', width: 200 },
 8804:  60:     { title: '状态', index: 'status', width: 100, render: 'status' },
 8805:  61:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 8806:  62:     {
 8807:  63:       title: '操作',
 8808:  64:       width: 200,
 8809:  65:       buttons: [
 8810:  66:         {
 8811:  67:           text: '查看',
 8812:  68:           click: (record: Account) => this.viewDetail(record.id)
 8813:  69:         },
 8814:  70:         {
 8815:  71:           text: '编辑',
 8816:  72:           click: (record: Account) => this.edit(record.id)
 8817:  73:         },
 8818:  74:         {
 8819:  75:           text: '删除',
 8820:  76:           type: 'del',
 8821:  77:           pop: true,
 8822:  78:           click: (record: Account) => this.delete(record.id)
 8823:  79:         }
 8824:  80:       ]
 8825:  81:     }
 8826:  82:   ];
 8827:  83: 
 8828:  84:   ngOnInit(): void {
 8829:  85:     this.loadUsers();
 8830:  86:   }
 8831:  87: 
 8832:  88:   async loadUsers(): Promise<void> {
 8833:  89:     try {
 8834:  90:       await this.accountService.loadAccounts();
 8835:  91:       // 过滤出用户类型的账户
 8836:  92:       // 注意：这里需要根据实际业务逻辑过滤
 8837:  93:     } catch (error) {
 8838:  94:       this.message.error('加载用户列表失败');
 8839:  95:     }
 8840:  96:   }
 8841:  97: 
 8842:  98:   onTableChange(event: any): void {
 8843:  99:     // 处理表格变化事件（分页、排序等）
 8844: 100:   }
 8845: 101: 
 8846: 102:   createUser(): void {
 8847: 103:     this.router.navigate(['/accounts/create'], { queryParams: { type: 'User' } });
 8848: 104:   }
 8849: 105: 
 8850: 106:   viewDetail(id: string): void {
 8851: 107:     this.router.navigate(['/accounts', id]);
 8852: 108:   }
 8853: 109: 
 8854: 110:   edit(id: string): void {
 8855: 111:     this.router.navigate(['/accounts', id, 'edit']);
 8856: 112:   }
 8857: 113: 
 8858: 114:   async delete(id: string): Promise<void> {
 8859: 115:     try {
 8860: 116:       await this.accountService.deleteAccount(id);
 8861: 117:       this.message.success('删除成功');
 8862: 118:       await this.loadUsers();
 8863: 119:     } catch (error) {
 8864: 120:       this.message.error('删除失败');
 8865: 121:     }
 8866: 122:   }
 8867: 123: }
 8868: ````
 8869: 
 8870: ## File: src/app/routes/blueprints/branches/branch-management.component.ts
 8871: ````typescript
 8872:   1: import { Component, OnInit, inject, computed } from '@angular/core';
 8873:   2: import { ActivatedRoute, Router } from '@angular/router';
 8874:   3: import { STColumn } from '@delon/abc/st';
 8875:   4: import { SHARED_IMPORTS } from '@shared';
 8876:   5: import { BranchService, BlueprintBranch } from '@shared';
 8877:   6: import { BranchStatus, BranchType } from '@core';
 8878:   7: import { NzMessageService } from 'ng-zorro-antd/message';
 8879:   8: 
 8880:   9: @Component({
 8881:  10:   selector: 'app-branch-management',
 8882:  11:   standalone: true,
 8883:  12:   imports: [SHARED_IMPORTS],
 8884:  13:   template: `
 8885:  14:     <page-header [title]="'分支管理'">
 8886:  15:       <ng-template #extra>
 8887:  16:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 8888:  17:           <span nz-icon nzType="arrow-left"></span>
 8889:  18:           返回
 8890:  19:         </button>
 8891:  20:         <button nz-button nzType="primary" (click)="forkBranch()">
 8892:  21:           <span nz-icon nzType="git-branch"></span>
 8893:  22:           Fork 分支
 8894:  23:         </button>
 8895:  24:       </ng-template>
 8896:  25:     </page-header>
 8897:  26: 
 8898:  27:     <nz-card nzTitle="蓝图分支列表" style="margin-top: 16px;">
 8899:  28:       <st
 8900:  29:         #st
 8901:  30:         [data]="branchService.branches()"
 8902:  31:         [columns]="columns"
 8903:  32:         [loading]="branchService.loading()"
 8904:  33:         [page]="{ front: false, show: true, showSize: true }"
 8905:  34:         (change)="onTableChange()"
 8906:  35:       >
 8907:  36:         <ng-template #type let-record>
 8908:  37:           @switch (record.branch_type) {
 8909:  38:             @case ('contractor') {
 8910:  39:               <nz-tag nzColor="blue">承揽商</nz-tag>
 8911:  40:             }
 8912:  41:             @case ('subcontractor') {
 8913:  42:               <nz-tag nzColor="cyan">次承揽商</nz-tag>
 8914:  43:             }
 8915:  44:             @case ('consultant') {
 8916:  45:               <nz-tag nzColor="purple">顾问</nz-tag>
 8917:  46:             }
 8918:  47:             @default {
 8919:  48:               <nz-tag>未知</nz-tag>
 8920:  49:             }
 8921:  50:           }
 8922:  51:         </ng-template>
 8923:  52: 
 8924:  53:         <ng-template #status let-record>
 8925:  54:           @switch (record.status) {
 8926:  55:             @case ('active') {
 8927:  56:               <nz-tag nzColor="success">活跃</nz-tag>
 8928:  57:             }
 8929:  58:             @case ('merged') {
 8930:  59:               <nz-tag nzColor="blue">已合并</nz-tag>
 8931:  60:             }
 8932:  61:             @case ('closed') {
 8933:  62:               <nz-tag nzColor="default">已关闭</nz-tag>
 8934:  63:             }
 8935:  64:             @default {
 8936:  65:               <nz-tag>未知</nz-tag>
 8937:  66:             }
 8938:  67:           }
 8939:  68:         </ng-template>
 8940:  69:       </st>
 8941:  70:     </nz-card>
 8942:  71:   `
 8943:  72: })
 8944:  73: export class BranchManagementComponent implements OnInit {
 8945:  74:   branchService = inject(BranchService);
 8946:  75:   route = inject(ActivatedRoute);
 8947:  76:   router = inject(Router);
 8948:  77:   message = inject(NzMessageService);
 8949:  78: 
 8950:  79:   blueprintId = computed(() => this.route.snapshot.paramMap.get('id') || '');
 8951:  80: 
 8952:  81:   columns: STColumn[] = [
 8953:  82:     { title: 'ID', index: 'id', width: 100 },
 8954:  83:     { title: '分支名称', index: 'branch_name', width: 200 },
 8955:  84:     { title: '组织ID', index: 'organization_id', width: 150 },
 8956:  85:     { title: '分支类型', index: 'branch_type', width: 120, render: 'type' },
 8957:  86:     { title: '状态', index: 'status', width: 100, render: 'status' },
 8958:  87:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 8959:  88:     {
 8960:  89:       title: '操作',
 8961:  90:       width: 200,
 8962:  91:       buttons: [
 8963:  92:         {
 8964:  93:           text: '查看',
 8965:  94:           click: (record: BlueprintBranch) => this.viewBranch(record.id)
 8966:  95:         },
 8967:  96:         {
 8968:  97:           text: '同步',
 8969:  98:           click: (record: BlueprintBranch) => this.syncBranch(record.id)
 8970:  99:         },
 8971: 100:         {
 8972: 101:           text: '关闭',
 8973: 102:           click: (record: BlueprintBranch) => this.closeBranch(record.id)
 8974: 103:         }
 8975: 104:       ]
 8976: 105:     }
 8977: 106:   ];
 8978: 107: 
 8979: 108:   ngOnInit(): void {
 8980: 109:     const id = this.blueprintId();
 8981: 110:     if (id) {
 8982: 111:       this.loadBranches(id);
 8983: 112:     }
 8984: 113:   }
 8985: 114: 
 8986: 115:   async loadBranches(blueprintId: string): Promise<void> {
 8987: 116:     try {
 8988: 117:       await this.branchService.loadBranchesByBlueprintId(blueprintId);
 8989: 118:     } catch (error) {
 8990: 119:       this.message.error('加载分支列表失败');
 8991: 120:     }
 8992: 121:   }
 8993: 122: 
 8994: 123:   onTableChange(): void {
 8995: 124:     // 表格变化处理
 8996: 125:   }
 8997: 126: 
 8998: 127:   goBack(): void {
 8999: 128:     const blueprintId = this.blueprintId();
 9000: 129:     if (blueprintId) {
 9001: 130:       this.router.navigate(['/blueprints', blueprintId]);
 9002: 131:     } else {
 9003: 132:       this.router.navigate(['/blueprints/list']);
 9004: 133:     }
 9005: 134:   }
 9006: 135: 
 9007: 136:   forkBranch(): void {
 9008: 137:     // TODO: 实现 Fork 分支对话框
 9009: 138:     this.message.info('Fork 分支功能待实现');
 9010: 139:   }
 9011: 140: 
 9012: 141:   viewBranch(branchId: string): void {
 9013: 142:     // TODO: 实现查看分支详情
 9014: 143:     this.message.info('查看分支详情功能待实现');
 9015: 144:   }
 9016: 145: 
 9017: 146:   async syncBranch(branchId: string): Promise<void> {
 9018: 147:     try {
 9019: 148:       await this.branchService.syncFromMainBranch(branchId);
 9020: 149:       this.message.success('同步成功');
 9021: 150:     } catch (error) {
 9022: 151:       this.message.error('同步失败');
 9023: 152:     }
 9024: 153:   }
 9025: 154: 
 9026: 155:   async closeBranch(branchId: string): Promise<void> {
 9027: 156:     try {
 9028: 157:       await this.branchService.closeBranch(branchId);
 9029: 158:       this.message.success('关闭成功');
 9030: 159:       const blueprintId = this.blueprintId();
 9031: 160:       if (blueprintId) {
 9032: 161:         await this.loadBranches(blueprintId);
 9033: 162:       }
 9034: 163:     } catch (error) {
 9035: 164:       this.message.error('关闭失败');
 9036: 165:     }
 9037: 166:   }
 9038: 167: }
 9039: ````
 9040: 
 9041: ## File: src/app/routes/blueprints/detail/blueprint-detail.component.ts
 9042: ````typescript
 9043:   1: import { Component, OnInit, inject, computed } from '@angular/core';
 9044:   2: import { ActivatedRoute, Router } from '@angular/router';
 9045:   3: import { SHARED_IMPORTS } from '@shared';
 9046:   4: import { BlueprintService, Blueprint } from '@shared';
 9047:   5: import { BlueprintStatus } from '@core';
 9048:   6: import { NzMessageService } from 'ng-zorro-antd/message';
 9049:   7: 
 9050:   8: @Component({
 9051:   9:   selector: 'app-blueprint-detail',
 9052:  10:   standalone: true,
 9053:  11:   imports: [SHARED_IMPORTS],
 9054:  12:   template: `
 9055:  13:     <page-header [title]="'蓝图详情'">
 9056:  14:       <ng-template #extra>
 9057:  15:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 9058:  16:           <span nz-icon nzType="arrow-left"></span>
 9059:  17:           返回
 9060:  18:         </button>
 9061:  19:         @if (blueprint()) {
 9062:  20:           <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
 9063:  21:             <span nz-icon nzType="edit"></span>
 9064:  22:             编辑
 9065:  23:           </button>
 9066:  24:           <button nz-button (click)="manageBranches()" style="margin-right: 8px;">
 9067:  25:             <span nz-icon nzType="git-branch"></span>
 9068:  26:             分支管理
 9069:  27:           </button>
 9070:  28:           <button nz-button nzDanger (click)="delete()">
 9071:  29:             <span nz-icon nzType="delete"></span>
 9072:  30:             删除
 9073:  31:           </button>
 9074:  32:         }
 9075:  33:       </ng-template>
 9076:  34:     </page-header>
 9077:  35: 
 9078:  36:     @if (blueprintService.loading()) {
 9079:  37:       <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
 9080:  38:         <ng-template #indicator>
 9081:  39:           <span nz-icon nzType="loading" style="font-size: 24px;"></span>
 9082:  40:         </ng-template>
 9083:  41:       </nz-spin>
 9084:  42:     } @else if (blueprintService.error()) {
 9085:  43:       <nz-alert
 9086:  44:         nzType="error"
 9087:  45:         [nzMessage]="'加载失败'"
 9088:  46:         [nzDescription]="blueprintService.error()"
 9089:  47:         nzShowIcon
 9090:  48:         style="margin: 16px;"
 9091:  49:       ></nz-alert>
 9092:  50:     } @else if (blueprint()) {
 9093:  51:       <div style="padding: 16px;">
 9094:  52:         <!-- 蓝图基本信息 -->
 9095:  53:         <nz-card nzTitle="基本信息" style="margin-bottom: 16px;">
 9096:  54:           <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
 9097:  55:             <nz-descriptions-item nzTitle="ID">{{ blueprint()!.id }}</nz-descriptions-item>
 9098:  56:             <nz-descriptions-item nzTitle="项目名称">{{ blueprint()!.name }}</nz-descriptions-item>
 9099:  57:             <nz-descriptions-item nzTitle="项目代码">{{ blueprint()!.project_code || '-' }}</nz-descriptions-item>
 9100:  58:             <nz-descriptions-item nzTitle="拥有者">{{ blueprint()!.owner_id }}</nz-descriptions-item>
 9101:  59:             <nz-descriptions-item nzTitle="状态">
 9102:  60:               @switch (blueprint()!.status) {
 9103:  61:                 @case ('planning') {
 9104:  62:                   <nz-tag nzColor="default">规划中</nz-tag>
 9105:  63:                 }
 9106:  64:                 @case ('active') {
 9107:  65:                   <nz-tag nzColor="success">进行中</nz-tag>
 9108:  66:                 }
 9109:  67:                 @case ('on_hold') {
 9110:  68:                   <nz-tag nzColor="warning">暂停</nz-tag>
 9111:  69:                 }
 9112:  70:                 @case ('completed') {
 9113:  71:                   <nz-tag nzColor="blue">已完成</nz-tag>
 9114:  72:                 }
 9115:  73:                 @case ('archived') {
 9116:  74:                   <nz-tag nzColor="default">已归档</nz-tag>
 9117:  75:                 }
 9118:  76:                 @default {
 9119:  77:                   <nz-tag>未知</nz-tag>
 9120:  78:                 }
 9121:  79:               }
 9122:  80:             </nz-descriptions-item>
 9123:  81:             <nz-descriptions-item nzTitle="开始日期">
 9124:  82:               {{ blueprint()!.start_date ? (blueprint()!.start_date | date: 'yyyy-MM-dd') : '-' }}
 9125:  83:             </nz-descriptions-item>
 9126:  84:             <nz-descriptions-item nzTitle="结束日期">
 9127:  85:               {{ blueprint()!.end_date ? (blueprint()!.end_date | date: 'yyyy-MM-dd') : '-' }}
 9128:  86:             </nz-descriptions-item>
 9129:  87:             <nz-descriptions-item nzTitle="创建时间">
 9130:  88:               {{ blueprint()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
 9131:  89:             </nz-descriptions-item>
 9132:  90:             <nz-descriptions-item nzTitle="更新时间">
 9133:  91:               {{ blueprint()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
 9134:  92:             </nz-descriptions-item>
 9135:  93:           </nz-descriptions>
 9136:  94:         </nz-card>
 9137:  95: 
 9138:  96:         <!-- 蓝图配置 -->
 9139:  97:         @if (blueprintService.configs().length > 0) {
 9140:  98:           <nz-card nzTitle="配置信息" style="margin-bottom: 16px;">
 9141:  99:             <nz-descriptions nzBordered [nzColumn]="{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }">
 9142: 100:               @for (config of blueprintService.configs(); track config.id) {
 9143: 101:                 <nz-descriptions-item [nzTitle]="config.config_key">
 9144: 102:                   {{ config.config_value | json }}
 9145: 103:                 </nz-descriptions-item>
 9146: 104:               }
 9147: 105:             </nz-descriptions>
 9148: 106:           </nz-card>
 9149: 107:         }
 9150: 108:       </div>
 9151: 109:     } @else {
 9152: 110:       <nz-empty nzNotFoundContent="蓝图不存在"></nz-empty>
 9153: 111:     }
 9154: 112:   `
 9155: 113: })
 9156: 114: export class BlueprintDetailComponent implements OnInit {
 9157: 115:   blueprintService = inject(BlueprintService);
 9158: 116:   route = inject(ActivatedRoute);
 9159: 117:   router = inject(Router);
 9160: 118:   message = inject(NzMessageService);
 9161: 119: 
 9162: 120:   // 使用 computed 从 Service 获取蓝图信息
 9163: 121:   blueprint = computed(() => this.blueprintService.selectedBlueprint());
 9164: 122: 
 9165: 123:   // 导出枚举供模板使用
 9166: 124:   BlueprintStatus = BlueprintStatus;
 9167: 125: 
 9168: 126:   ngOnInit(): void {
 9169: 127:     const blueprintId = this.route.snapshot.paramMap.get('id');
 9170: 128:     if (blueprintId) {
 9171: 129:       this.loadBlueprint(blueprintId);
 9172: 130:     }
 9173: 131:   }
 9174: 132: 
 9175: 133:   async loadBlueprint(id: string): Promise<void> {
 9176: 134:     try {
 9177: 135:       const blueprint = await this.blueprintService.loadBlueprintById(id);
 9178: 136:       if (!blueprint) {
 9179: 137:         this.message.warning('蓝图不存在');
 9180: 138:         this.goBack();
 9181: 139:       }
 9182: 140:     } catch (error) {
 9183: 141:       this.message.error('加载蓝图详情失败');
 9184: 142:     }
 9185: 143:   }
 9186: 144: 
 9187: 145:   goBack(): void {
 9188: 146:     this.router.navigate(['/blueprints/list']);
 9189: 147:   }
 9190: 148: 
 9191: 149:   edit(): void {
 9192: 150:     if (this.blueprint()) {
 9193: 151:       this.router.navigate(['/blueprints', this.blueprint()!.id, 'edit']);
 9194: 152:     }
 9195: 153:   }
 9196: 154: 
 9197: 155:   manageBranches(): void {
 9198: 156:     if (this.blueprint()) {
 9199: 157:       this.router.navigate(['/blueprints', this.blueprint()!.id, 'branches']);
 9200: 158:     }
 9201: 159:   }
 9202: 160: 
 9203: 161:   async delete(): Promise<void> {
 9204: 162:     if (!this.blueprint()) {
 9205: 163:       return;
 9206: 164:     }
 9207: 165: 
 9208: 166:     if (confirm('确定要删除此蓝图吗？此操作不可恢复。')) {
 9209: 167:       try {
 9210: 168:         await this.blueprintService.deleteBlueprint(this.blueprint()!.id);
 9211: 169:         this.message.success('删除成功');
 9212: 170:         this.goBack();
 9213: 171:       } catch (error) {
 9214: 172:         this.message.error('删除失败');
 9215: 173:       }
 9216: 174:     }
 9217: 175:   }
 9218: 176: }
 9219: ````
 9220: 
 9221: ## File: src/app/routes/blueprints/fork/blueprint-fork.component.ts
 9222: ````typescript
 9223:  1: import { Component, OnInit, inject } from '@angular/core';
 9224:  2: import { ActivatedRoute, Router } from '@angular/router';
 9225:  3: import { SHARED_IMPORTS } from '@shared';
 9226:  4: import { BlueprintService } from '@shared';
 9227:  5: import { NzMessageService } from 'ng-zorro-antd/message';
 9228:  6: 
 9229:  7: @Component({
 9230:  8:   selector: 'app-blueprint-fork',
 9231:  9:   standalone: true,
 9232: 10:   imports: [SHARED_IMPORTS],
 9233: 11:   template: `
 9234: 12:     <page-header [title]="'Fork 任务'">
 9235: 13:       <ng-template #breadcrumb>
 9236: 14:         <nz-breadcrumb>
 9237: 15:           <nz-breadcrumb-item>
 9238: 16:             <a routerLink="/blueprints">蓝图列表</a>
 9239: 17:           </nz-breadcrumb-item>
 9240: 18:           <nz-breadcrumb-item>Fork 任务</nz-breadcrumb-item>
 9241: 19:         </nz-breadcrumb>
 9242: 20:       </ng-template>
 9243: 21:     </page-header>
 9244: 22: 
 9245: 23:     <nz-card nzTitle="创建 Fork 任务" style="margin-top: 16px;">
 9246: 24:       <nz-alert
 9247: 25:         nzType="info"
 9248: 26:         nzMessage="Fork 任务功能开发中"
 9249: 27:         nzDescription="此页面将用于从现有蓝图创建 Fork 任务。"
 9250: 28:         [nzShowIcon]="true"
 9251: 29:         style="margin-bottom: 16px;"
 9252: 30:       ></nz-alert>
 9253: 31: 
 9254: 32:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
 9255: 33:     </nz-card>
 9256: 34:   `
 9257: 35: })
 9258: 36: export class BlueprintForkComponent implements OnInit {
 9259: 37:   blueprintService = inject(BlueprintService);
 9260: 38:   route = inject(ActivatedRoute);
 9261: 39:   router = inject(Router);
 9262: 40:   message = inject(NzMessageService);
 9263: 41: 
 9264: 42:   blueprintId = '';
 9265: 43: 
 9266: 44:   ngOnInit(): void {
 9267: 45:     this.blueprintId = this.route.snapshot.paramMap.get('id') || '';
 9268: 46:     if (!this.blueprintId) {
 9269: 47:       this.message.error('蓝图ID不存在');
 9270: 48:       this.router.navigate(['/blueprints']);
 9271: 49:     }
 9272: 50:   }
 9273: 51: }
 9274: ````
 9275: 
 9276: ## File: src/app/routes/blueprints/form/blueprint-form.component.ts
 9277: ````typescript
 9278:   1: import { Component, OnInit, inject, computed, signal } from '@angular/core';
 9279:   2: import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 9280:   3: import { ActivatedRoute, Router } from '@angular/router';
 9281:   4: import { SHARED_IMPORTS } from '@shared';
 9282:   5: import { BlueprintService, Blueprint, BlueprintInsert, BlueprintUpdate } from '@shared';
 9283:   6: import { BlueprintStatus } from '@core';
 9284:   7: import { NzMessageService } from 'ng-zorro-antd/message';
 9285:   8: 
 9286:   9: /**
 9287:  10:  * 蓝图表单类型定义
 9288:  11:  */
 9289:  12: interface BlueprintFormValue {
 9290:  13:   name: string;
 9291:  14:   projectCode?: string | null;
 9292:  15:   ownerId: string;
 9293:  16:   status: BlueprintStatus;
 9294:  17:   startDate?: string | null;
 9295:  18:   endDate?: string | null;
 9296:  19:   description?: string | null;
 9297:  20: }
 9298:  21: 
 9299:  22: @Component({
 9300:  23:   selector: 'app-blueprint-form',
 9301:  24:   standalone: true,
 9302:  25:   imports: [SHARED_IMPORTS, ReactiveFormsModule],
 9303:  26:   template: `
 9304:  27:     <page-header [title]="isEditMode() ? '编辑蓝图' : '创建蓝图'">
 9305:  28:       <ng-template #extra>
 9306:  29:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 9307:  30:           <span nz-icon nzType="arrow-left"></span>
 9308:  31:           返回
 9309:  32:         </button>
 9310:  33:       </ng-template>
 9311:  34:     </page-header>
 9312:  35: 
 9313:  36:     <div style="padding: 16px;">
 9314:  37:       @if (blueprintService.loading()) {
 9315:  38:         <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
 9316:  39:           <ng-template #indicator>
 9317:  40:             <span nz-icon nzType="loading" style="font-size: 24px;"></span>
 9318:  41:           </ng-template>
 9319:  42:         </nz-spin>
 9320:  43:       } @else {
 9321:  44:         <nz-card [nzTitle]="isEditMode() ? '编辑蓝图信息' : '创建新蓝图'">
 9322:  45:           <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
 9323:  46:             <nz-form-item>
 9324:  47:               <nz-form-label [nzSpan]="4" nzRequired>项目名称</nz-form-label>
 9325:  48:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入项目名称'">
 9326:  49:                 <input nz-input formControlName="name" placeholder="请输入项目名称" />
 9327:  50:               </nz-form-control>
 9328:  51:             </nz-form-item>
 9329:  52: 
 9330:  53:             <nz-form-item>
 9331:  54:               <nz-form-label [nzSpan]="4">项目代码</nz-form-label>
 9332:  55:               <nz-form-control [nzSpan]="20">
 9333:  56:                 <input nz-input formControlName="projectCode" placeholder="请输入项目代码" />
 9334:  57:               </nz-form-control>
 9335:  58:             </nz-form-item>
 9336:  59: 
 9337:  60:             <nz-form-item>
 9338:  61:               <nz-form-label [nzSpan]="4" nzRequired>拥有者ID</nz-form-label>
 9339:  62:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入拥有者ID'">
 9340:  63:                 <input nz-input formControlName="ownerId" placeholder="请输入拥有者ID" />
 9341:  64:               </nz-form-control>
 9342:  65:             </nz-form-item>
 9343:  66: 
 9344:  67:             <nz-form-item>
 9345:  68:               <nz-form-label [nzSpan]="4" nzRequired>状态</nz-form-label>
 9346:  69:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择状态'">
 9347:  70:                 <nz-select formControlName="status" nzPlaceHolder="请选择状态">
 9348:  71:                   <nz-option [nzValue]="BlueprintStatus.PLANNING" nzLabel="规划中"></nz-option>
 9349:  72:                   <nz-option [nzValue]="BlueprintStatus.ACTIVE" nzLabel="进行中"></nz-option>
 9350:  73:                   <nz-option [nzValue]="BlueprintStatus.ON_HOLD" nzLabel="暂停"></nz-option>
 9351:  74:                   <nz-option [nzValue]="BlueprintStatus.COMPLETED" nzLabel="已完成"></nz-option>
 9352:  75:                   <nz-option [nzValue]="BlueprintStatus.ARCHIVED" nzLabel="已归档"></nz-option>
 9353:  76:                 </nz-select>
 9354:  77:               </nz-form-control>
 9355:  78:             </nz-form-item>
 9356:  79: 
 9357:  80:             <nz-form-item>
 9358:  81:               <nz-form-label [nzSpan]="4">开始日期</nz-form-label>
 9359:  82:               <nz-form-control [nzSpan]="20">
 9360:  83:                 <nz-date-picker formControlName="startDate" nzPlaceHolder="请选择开始日期" style="width: 100%;"></nz-date-picker>
 9361:  84:               </nz-form-control>
 9362:  85:             </nz-form-item>
 9363:  86: 
 9364:  87:             <nz-form-item>
 9365:  88:               <nz-form-label [nzSpan]="4">结束日期</nz-form-label>
 9366:  89:               <nz-form-control [nzSpan]="20">
 9367:  90:                 <nz-date-picker formControlName="endDate" nzPlaceHolder="请选择结束日期" style="width: 100%;"></nz-date-picker>
 9368:  91:               </nz-form-control>
 9369:  92:             </nz-form-item>
 9370:  93: 
 9371:  94:             <nz-form-item>
 9372:  95:               <nz-form-label [nzSpan]="4">描述</nz-form-label>
 9373:  96:               <nz-form-control [nzSpan]="20">
 9374:  97:                 <textarea nz-input formControlName="description" [nzAutosize]="{ minRows: 3, maxRows: 6 }" placeholder="请输入描述"></textarea>
 9375:  98:               </nz-form-control>
 9376:  99:             </nz-form-item>
 9377: 100: 
 9378: 101:             <nz-form-item>
 9379: 102:               <nz-form-control [nzOffset]="4" [nzSpan]="20">
 9380: 103:                 <button nz-button nzType="primary" [disabled]="!form.valid" [nzLoading]="submitting()">
 9381: 104:                   提交
 9382: 105:                 </button>
 9383: 106:                 <button nz-button nzType="default" (click)="goBack()" style="margin-left: 8px;">
 9384: 107:                   取消
 9385: 108:                 </button>
 9386: 109:               </nz-form-control>
 9387: 110:             </nz-form-item>
 9388: 111:           </form>
 9389: 112:         </nz-card>
 9390: 113:       }
 9391: 114:     </div>
 9392: 115:   `
 9393: 116: })
 9394: 117: export class BlueprintFormComponent implements OnInit {
 9395: 118:   blueprintService = inject(BlueprintService);
 9396: 119:   route = inject(ActivatedRoute);
 9397: 120:   router = inject(Router);
 9398: 121:   message = inject(NzMessageService);
 9399: 122: 
 9400: 123:   // 使用 signal 管理提交状态
 9401: 124:   submitting = signal(false);
 9402: 125: 
 9403: 126:   // 使用 computed 判断是否为编辑模式
 9404: 127:   isEditMode = computed(() => {
 9405: 128:     const id = this.route.snapshot.paramMap.get('id');
 9406: 129:     return !!id && id !== 'create';
 9407: 130:   });
 9408: 131: 
 9409: 132:   // 导出枚举供模板使用
 9410: 133:   BlueprintStatus = BlueprintStatus;
 9411: 134: 
 9412: 135:   form = new FormGroup({
 9413: 136:     name: new FormControl('', [Validators.required]),
 9414: 137:     projectCode: new FormControl(''),
 9415: 138:     ownerId: new FormControl('', [Validators.required]),
 9416: 139:     status: new FormControl(BlueprintStatus.PLANNING, [Validators.required]),
 9417: 140:     startDate: new FormControl(''),
 9418: 141:     endDate: new FormControl(''),
 9419: 142:     description: new FormControl('')
 9420: 143:   });
 9421: 144: 
 9422: 145:   ngOnInit(): void {
 9423: 146:     if (this.isEditMode()) {
 9424: 147:       const blueprintId = this.route.snapshot.paramMap.get('id');
 9425: 148:       if (blueprintId) {
 9426: 149:         this.loadBlueprint(blueprintId);
 9427: 150:       }
 9428: 151:     }
 9429: 152:   }
 9430: 153: 
 9431: 154:   async loadBlueprint(id: string): Promise<void> {
 9432: 155:     try {
 9433: 156:       const blueprint = await this.blueprintService.loadBlueprintById(id);
 9434: 157:       if (blueprint) {
 9435: 158:         this.form.patchValue({
 9436: 159:           name: blueprint.name,
 9437: 160:           projectCode: blueprint.project_code || '',
 9438: 161:           ownerId: blueprint.owner_id,
 9439: 162:           status: blueprint.status as BlueprintStatus,
 9440: 163:           startDate: blueprint.start_date || '',
 9441: 164:           endDate: blueprint.end_date || '',
 9442: 165:           description: blueprint.description || ''
 9443: 166:         });
 9444: 167:       }
 9445: 168:     } catch (error) {
 9446: 169:       this.message.error('加载蓝图信息失败');
 9447: 170:     }
 9448: 171:   }
 9449: 172: 
 9450: 173:   async onSubmit(): Promise<void> {
 9451: 174:     if (!this.form.valid) {
 9452: 175:       Object.values(this.form.controls).forEach(control => {
 9453: 176:         if (control.invalid) {
 9454: 177:           control.markAsDirty();
 9455: 178:           control.updateValueAndValidity({ onlySelf: true });
 9456: 179:         }
 9457: 180:       });
 9458: 181:       return;
 9459: 182:     }
 9460: 183: 
 9461: 184:     this.submitting.set(true);
 9462: 185: 
 9463: 186:     try {
 9464: 187:       const formValue = this.form.value as BlueprintFormValue;
 9465: 188: 
 9466: 189:       if (this.isEditMode()) {
 9467: 190:         const blueprintId = this.route.snapshot.paramMap.get('id')!;
 9468: 191:         const updateData = {
 9469: 192:           name: formValue.name,
 9470: 193:           project_code: formValue.projectCode || null,
 9471: 194:           status: formValue.status,
 9472: 195:           start_date: formValue.startDate || null,
 9473: 196:           end_date: formValue.endDate || null,
 9474: 197:           description: formValue.description || null
 9475: 198:         } as any as BlueprintUpdate;
 9476: 199:         await this.blueprintService.updateBlueprint(blueprintId, updateData);
 9477: 200:         this.message.success('更新成功');
 9478: 201:       } else {
 9479: 202:         const insertData = {
 9480: 203:           name: formValue.name,
 9481: 204:           project_code: formValue.projectCode || null,
 9482: 205:           owner_id: formValue.ownerId,
 9483: 206:           status: formValue.status,
 9484: 207:           start_date: formValue.startDate || null,
 9485: 208:           end_date: formValue.endDate || null,
 9486: 209:           description: formValue.description || null
 9487: 210:         } as any as BlueprintInsert;
 9488: 211:         const blueprint = await this.blueprintService.createBlueprint(insertData);
 9489: 212:         this.message.success('创建成功');
 9490: 213:         this.router.navigate(['/blueprints', blueprint.id]);
 9491: 214:       }
 9492: 215:     } catch (error) {
 9493: 216:       this.message.error(this.isEditMode() ? '更新失败' : '创建失败');
 9494: 217:     } finally {
 9495: 218:       this.submitting.set(false);
 9496: 219:     }
 9497: 220:   }
 9498: 221: 
 9499: 222:   goBack(): void {
 9500: 223:     this.router.navigate(['/blueprints/list']);
 9501: 224:   }
 9502: 225: }
 9503: ````
 9504: 
 9505: ## File: src/app/routes/blueprints/list/blueprint-list.component.ts
 9506: ````typescript
 9507:   1: import { Component, OnInit, inject } from '@angular/core';
 9508:   2: import { Router } from '@angular/router';
 9509:   3: import { STColumn } from '@delon/abc/st';
 9510:   4: import { SHARED_IMPORTS } from '@shared';
 9511:   5: import { BlueprintService, Blueprint } from '@shared';
 9512:   6: import { BlueprintStatus } from '@core';
 9513:   7: import { NzMessageService } from 'ng-zorro-antd/message';
 9514:   8: 
 9515:   9: @Component({
 9516:  10:   selector: 'app-blueprint-list',
 9517:  11:   standalone: true,
 9518:  12:   imports: [SHARED_IMPORTS],
 9519:  13:   template: `
 9520:  14:     <page-header [title]="'蓝图管理'">
 9521:  15:       <ng-template #extra>
 9522:  16:         <button nz-button nzType="primary" (click)="createBlueprint()">
 9523:  17:           <span nz-icon nzType="plus"></span>
 9524:  18:           新建蓝图
 9525:  19:         </button>
 9526:  20:       </ng-template>
 9527:  21:     </page-header>
 9528:  22: 
 9529:  23:     <nz-card nzTitle="管理系统中的所有蓝图" style="margin-top: 16px;">
 9530:  24:       <st
 9531:  25:         #st
 9532:  26:         [data]="blueprintService.blueprints()"
 9533:  27:         [columns]="columns"
 9534:  28:         [loading]="blueprintService.loading()"
 9535:  29:         [page]="{ front: false, show: true, showSize: true }"
 9536:  30:         (change)="onTableChange()"
 9537:  31:       >
 9538:  32:         <ng-template #status let-record>
 9539:  33:           @switch (record.status) {
 9540:  34:             @case ('planning') {
 9541:  35:               <nz-tag nzColor="default">规划中</nz-tag>
 9542:  36:             }
 9543:  37:             @case ('active') {
 9544:  38:               <nz-tag nzColor="success">进行中</nz-tag>
 9545:  39:             }
 9546:  40:             @case ('on_hold') {
 9547:  41:               <nz-tag nzColor="warning">暂停</nz-tag>
 9548:  42:             }
 9549:  43:             @case ('completed') {
 9550:  44:               <nz-tag nzColor="blue">已完成</nz-tag>
 9551:  45:             }
 9552:  46:             @case ('archived') {
 9553:  47:               <nz-tag nzColor="default">已归档</nz-tag>
 9554:  48:             }
 9555:  49:             @default {
 9556:  50:               <nz-tag>未知</nz-tag>
 9557:  51:             }
 9558:  52:           }
 9559:  53:         </ng-template>
 9560:  54:       </st>
 9561:  55:     </nz-card>
 9562:  56:   `
 9563:  57: })
 9564:  58: export class BlueprintListComponent implements OnInit {
 9565:  59:   blueprintService = inject(BlueprintService);
 9566:  60:   router = inject(Router);
 9567:  61:   message = inject(NzMessageService);
 9568:  62: 
 9569:  63:   columns: STColumn[] = [
 9570:  64:     { title: 'ID', index: 'id', width: 100 },
 9571:  65:     { title: '项目名称', index: 'name', width: 200 },
 9572:  66:     { title: '项目代码', index: 'project_code', width: 150 },
 9573:  67:     { title: '拥有者', index: 'owner_id', width: 150 },
 9574:  68:     { title: '状态', index: 'status', width: 100, render: 'status' },
 9575:  69:     { title: '开始日期', index: 'start_date', type: 'date', width: 120 },
 9576:  70:     { title: '结束日期', index: 'end_date', type: 'date', width: 120 },
 9577:  71:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 9578:  72:     {
 9579:  73:       title: '操作',
 9580:  74:       width: 250,
 9581:  75:       buttons: [
 9582:  76:         {
 9583:  77:           text: '查看',
 9584:  78:           click: (record: Blueprint) => this.viewDetail(record.id)
 9585:  79:         },
 9586:  80:         {
 9587:  81:           text: '编辑',
 9588:  82:           click: (record: Blueprint) => this.edit(record.id)
 9589:  83:         },
 9590:  84:         {
 9591:  85:           text: '分支管理',
 9592:  86:           click: (record: Blueprint) => this.manageBranches(record.id)
 9593:  87:         },
 9594:  88:         {
 9595:  89:           text: '删除',
 9596:  90:           type: 'del',
 9597:  91:           pop: {
 9598:  92:             title: '确定要删除这个蓝图吗？',
 9599:  93:             okType: 'danger'
 9600:  94:           },
 9601:  95:           click: (record: Blueprint) => this.delete(record.id)
 9602:  96:         }
 9603:  97:       ]
 9604:  98:     }
 9605:  99:   ];
 9606: 100: 
 9607: 101:   ngOnInit(): void {
 9608: 102:     this.loadData();
 9609: 103:   }
 9610: 104: 
 9611: 105:   async loadData(): Promise<void> {
 9612: 106:     try {
 9613: 107:       await this.blueprintService.loadBlueprints();
 9614: 108:     } catch (error) {
 9615: 109:       this.message.error('加载蓝图列表失败');
 9616: 110:     }
 9617: 111:   }
 9618: 112: 
 9619: 113:   onTableChange(): void {
 9620: 114:     // 表格变化处理
 9621: 115:   }
 9622: 116: 
 9623: 117:   createBlueprint(): void {
 9624: 118:     this.router.navigate(['/blueprints/create']);
 9625: 119:   }
 9626: 120: 
 9627: 121:   viewDetail(id: string): void {
 9628: 122:     this.router.navigate(['/blueprints', id]);
 9629: 123:   }
 9630: 124: 
 9631: 125:   edit(id: string): void {
 9632: 126:     this.router.navigate(['/blueprints', id, 'edit']);
 9633: 127:   }
 9634: 128: 
 9635: 129:   manageBranches(id: string): void {
 9636: 130:     this.router.navigate(['/blueprints', id, 'branches']);
 9637: 131:   }
 9638: 132: 
 9639: 133:   async delete(id: string): Promise<void> {
 9640: 134:     try {
 9641: 135:       await this.blueprintService.deleteBlueprint(id);
 9642: 136:       this.message.success('删除成功');
 9643: 137:       await this.loadData();
 9644: 138:     } catch (error) {
 9645: 139:       this.message.error('删除失败');
 9646: 140:     }
 9647: 141:   }
 9648: 142: }
 9649: ````
 9650: 
 9651: ## File: src/app/routes/blueprints/pull-requests/pull-request-list.component.ts
 9652: ````typescript
 9653:   1: import { Component, OnInit, inject, computed } from '@angular/core';
 9654:   2: import { ActivatedRoute, Router } from '@angular/router';
 9655:   3: import { STColumn } from '@delon/abc/st';
 9656:   4: import { SHARED_IMPORTS } from '@shared';
 9657:   5: import { PullRequestService, PullRequest } from '@shared';
 9658:   6: import { PRStatus } from '@core';
 9659:   7: import { NzMessageService } from 'ng-zorro-antd/message';
 9660:   8: 
 9661:   9: @Component({
 9662:  10:   selector: 'app-pull-request-list',
 9663:  11:   standalone: true,
 9664:  12:   imports: [SHARED_IMPORTS],
 9665:  13:   template: `
 9666:  14:     <page-header [title]="'Pull Request 管理'">
 9667:  15:       <ng-template #extra>
 9668:  16:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 9669:  17:           <span nz-icon nzType="arrow-left"></span>
 9670:  18:           返回
 9671:  19:         </button>
 9672:  20:         <button nz-button nzType="primary" (click)="createPR()">
 9673:  21:           <span nz-icon nzType="plus"></span>
 9674:  22:           创建 PR
 9675:  23:         </button>
 9676:  24:       </ng-template>
 9677:  25:     </page-header>
 9678:  26: 
 9679:  27:     <nz-card nzTitle="Pull Request 列表" style="margin-top: 16px;">
 9680:  28:       <st
 9681:  29:         #st
 9682:  30:         [data]="prService.pullRequests()"
 9683:  31:         [columns]="columns"
 9684:  32:         [loading]="prService.loading()"
 9685:  33:         [page]="{ front: false, show: true, showSize: true }"
 9686:  34:         (change)="onTableChange()"
 9687:  35:       >
 9688:  36:         <ng-template #status let-record>
 9689:  37:           @switch (record.status) {
 9690:  38:             @case ('open') {
 9691:  39:               <nz-tag nzColor="blue">打开</nz-tag>
 9692:  40:             }
 9693:  41:             @case ('reviewing') {
 9694:  42:               <nz-tag nzColor="orange">审核中</nz-tag>
 9695:  43:             }
 9696:  44:             @case ('approved') {
 9697:  45:               <nz-tag nzColor="green">已批准</nz-tag>
 9698:  46:             }
 9699:  47:             @case ('rejected') {
 9700:  48:               <nz-tag nzColor="red">已拒绝</nz-tag>
 9701:  49:             }
 9702:  50:             @case ('merged') {
 9703:  51:               <nz-tag nzColor="purple">已合并</nz-tag>
 9704:  52:             }
 9705:  53:             @case ('closed') {
 9706:  54:               <nz-tag nzColor="default">已关闭</nz-tag>
 9707:  55:             }
 9708:  56:             @default {
 9709:  57:               <nz-tag>未知</nz-tag>
 9710:  58:             }
 9711:  59:           }
 9712:  60:         </ng-template>
 9713:  61:       </st>
 9714:  62:     </nz-card>
 9715:  63:   `
 9716:  64: })
 9717:  65: export class PullRequestListComponent implements OnInit {
 9718:  66:   prService = inject(PullRequestService);
 9719:  67:   route = inject(ActivatedRoute);
 9720:  68:   router = inject(Router);
 9721:  69:   message = inject(NzMessageService);
 9722:  70: 
 9723:  71:   blueprintId = computed(() => this.route.snapshot.paramMap.get('id') || '');
 9724:  72: 
 9725:  73:   columns: STColumn[] = [
 9726:  74:     { title: 'ID', index: 'id', width: 100 },
 9727:  75:     { title: '标题', index: 'title', width: 200 },
 9728:  76:     { title: '分支ID', index: 'branch_id', width: 150 },
 9729:  77:     { title: '提交者', index: 'submitted_by', width: 150 },
 9730:  78:     { title: '状态', index: 'status', width: 100, render: 'status' },
 9731:  79:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
 9732:  80:     {
 9733:  81:       title: '操作',
 9734:  82:       width: 250,
 9735:  83:       buttons: [
 9736:  84:         {
 9737:  85:           text: '查看',
 9738:  86:           click: (record: PullRequest) => this.viewPR(record.id)
 9739:  87:         },
 9740:  88:         {
 9741:  89:           text: '审核',
 9742:  90:           click: (record: PullRequest) => this.reviewPR(record.id)
 9743:  91:         },
 9744:  92:         {
 9745:  93:           text: '合并',
 9746:  94:           click: (record: PullRequest) => this.mergePR(record.id)
 9747:  95:         }
 9748:  96:       ]
 9749:  97:     }
 9750:  98:   ];
 9751:  99: 
 9752: 100:   ngOnInit(): void {
 9753: 101:     const id = this.blueprintId();
 9754: 102:     if (id) {
 9755: 103:       this.loadPRs(id);
 9756: 104:     }
 9757: 105:   }
 9758: 106: 
 9759: 107:   async loadPRs(blueprintId: string): Promise<void> {
 9760: 108:     try {
 9761: 109:       await this.prService.loadPullRequestsByBlueprintId(blueprintId);
 9762: 110:     } catch (error) {
 9763: 111:       this.message.error('加载 Pull Request 列表失败');
 9764: 112:     }
 9765: 113:   }
 9766: 114: 
 9767: 115:   onTableChange(): void {
 9768: 116:     // 表格变化处理
 9769: 117:   }
 9770: 118: 
 9771: 119:   goBack(): void {
 9772: 120:     const blueprintId = this.blueprintId();
 9773: 121:     if (blueprintId) {
 9774: 122:       this.router.navigate(['/blueprints', blueprintId]);
 9775: 123:     } else {
 9776: 124:       this.router.navigate(['/blueprints/list']);
 9777: 125:     }
 9778: 126:   }
 9779: 127: 
 9780: 128:   createPR(): void {
 9781: 129:     // TODO: 实现创建 PR 对话框
 9782: 130:     this.message.info('创建 PR 功能待实现');
 9783: 131:   }
 9784: 132: 
 9785: 133:   viewPR(prId: string): void {
 9786: 134:     // TODO: 实现查看 PR 详情
 9787: 135:     this.message.info('查看 PR 详情功能待实现');
 9788: 136:   }
 9789: 137: 
 9790: 138:   async reviewPR(prId: string): Promise<void> {
 9791: 139:     // TODO: 实现审核 PR 对话框
 9792: 140:     this.message.info('审核 PR 功能待实现');
 9793: 141:   }
 9794: 142: 
 9795: 143:   async mergePR(prId: string): Promise<void> {
 9796: 144:     // TODO: 实现合并 PR 对话框
 9797: 145:     this.message.info('合并 PR 功能待实现');
 9798: 146:   }
 9799: 147: }
 9800: ````
 9801: 
 9802: ## File: src/app/routes/blueprints/review/pr-review.component.ts
 9803: ````typescript
 9804:  1: import { Component, OnInit, inject } from '@angular/core';
 9805:  2: import { ActivatedRoute, Router } from '@angular/router';
 9806:  3: import { SHARED_IMPORTS } from '@shared';
 9807:  4: import { NzMessageService } from 'ng-zorro-antd/message';
 9808:  5: 
 9809:  6: @Component({
 9810:  7:   selector: 'app-pr-review',
 9811:  8:   standalone: true,
 9812:  9:   imports: [SHARED_IMPORTS],
 9813: 10:   template: `
 9814: 11:     <page-header [title]="'PR 审查'">
 9815: 12:       <ng-template #breadcrumb>
 9816: 13:         <nz-breadcrumb>
 9817: 14:           <nz-breadcrumb-item>
 9818: 15:             <a routerLink="/blueprints">蓝图列表</a>
 9819: 16:           </nz-breadcrumb-item>
 9820: 17:           <nz-breadcrumb-item>
 9821: 18:             <a [routerLink]="['/blueprints', blueprintId, 'pull-requests']">Pull Requests</a>
 9822: 19:           </nz-breadcrumb-item>
 9823: 20:           <nz-breadcrumb-item>审查</nz-breadcrumb-item>
 9824: 21:         </nz-breadcrumb>
 9825: 22:       </ng-template>
 9826: 23:     </page-header>
 9827: 24: 
 9828: 25:     <nz-card nzTitle="Pull Request 审查" style="margin-top: 16px;">
 9829: 26:       <nz-alert
 9830: 27:         nzType="info"
 9831: 28:         nzMessage="PR 审查功能开发中"
 9832: 29:         nzDescription="此页面将用于审查和批准 Pull Request。"
 9833: 30:         [nzShowIcon]="true"
 9834: 31:         style="margin-bottom: 16px;"
 9835: 32:       ></nz-alert>
 9836: 33: 
 9837: 34:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
 9838: 35:     </nz-card>
 9839: 36:   `
 9840: 37: })
 9841: 38: export class PrReviewComponent implements OnInit {
 9842: 39:   route = inject(ActivatedRoute);
 9843: 40:   router = inject(Router);
 9844: 41:   message = inject(NzMessageService);
 9845: 42: 
 9846: 43:   blueprintId = '';
 9847: 44:   prId = '';
 9848: 45: 
 9849: 46:   ngOnInit(): void {
 9850: 47:     this.blueprintId = this.route.snapshot.paramMap.get('id') || '';
 9851: 48:     this.prId = this.route.snapshot.paramMap.get('prId') || '';
 9852: 49:     if (!this.blueprintId || !this.prId) {
 9853: 50:       this.message.error('蓝图ID或PR ID不存在');
 9854: 51:       this.router.navigate(['/blueprints']);
 9855: 52:     }
 9856: 53:   }
 9857: 54: }
 9858: ````
 9859: 
 9860: ## File: src/app/routes/blueprints/settings/blueprint-settings.component.ts
 9861: ````typescript
 9862:  1: import { Component, OnInit, inject } from '@angular/core';
 9863:  2: import { ActivatedRoute, Router } from '@angular/router';
 9864:  3: import { SHARED_IMPORTS } from '@shared';
 9865:  4: import { BlueprintService } from '@shared';
 9866:  5: import { NzMessageService } from 'ng-zorro-antd/message';
 9867:  6: 
 9868:  7: @Component({
 9869:  8:   selector: 'app-blueprint-settings',
 9870:  9:   standalone: true,
 9871: 10:   imports: [SHARED_IMPORTS],
 9872: 11:   template: `
 9873: 12:     <page-header [title]="'蓝图设置'">
 9874: 13:       <ng-template #breadcrumb>
 9875: 14:         <nz-breadcrumb>
 9876: 15:           <nz-breadcrumb-item>
 9877: 16:             <a routerLink="/blueprints">蓝图列表</a>
 9878: 17:           </nz-breadcrumb-item>
 9879: 18:           <nz-breadcrumb-item>设置</nz-breadcrumb-item>
 9880: 19:         </nz-breadcrumb>
 9881: 20:       </ng-template>
 9882: 21:     </page-header>
 9883: 22: 
 9884: 23:     <nz-card nzTitle="蓝图配置" style="margin-top: 16px;">
 9885: 24:       <nz-alert
 9886: 25:         nzType="info"
 9887: 26:         nzMessage="蓝图设置功能开发中"
 9888: 27:         nzDescription="此页面将用于配置蓝图的各种设置选项。"
 9889: 28:         [nzShowIcon]="true"
 9890: 29:         style="margin-bottom: 16px;"
 9891: 30:       ></nz-alert>
 9892: 31: 
 9893: 32:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
 9894: 33:     </nz-card>
 9895: 34:   `
 9896: 35: })
 9897: 36: export class BlueprintSettingsComponent implements OnInit {
 9898: 37:   blueprintService = inject(BlueprintService);
 9899: 38:   route = inject(ActivatedRoute);
 9900: 39:   router = inject(Router);
 9901: 40:   message = inject(NzMessageService);
 9902: 41: 
 9903: 42:   blueprintId = '';
 9904: 43: 
 9905: 44:   ngOnInit(): void {
 9906: 45:     this.blueprintId = this.route.snapshot.paramMap.get('id') || '';
 9907: 46:     if (!this.blueprintId) {
 9908: 47:       this.message.error('蓝图ID不存在');
 9909: 48:       this.router.navigate(['/blueprints']);
 9910: 49:     }
 9911: 50:   }
 9912: 51: }
 9913: ````
 9914: 
 9915: ## File: src/app/routes/collaboration/detail/collaboration-detail.component.ts
 9916: ````typescript
 9917:   1: import { Component, OnInit, inject, computed } from '@angular/core';
 9918:   2: import { ActivatedRoute, Router } from '@angular/router';
 9919:   3: import { SHARED_IMPORTS } from '@shared';
 9920:   4: import { CollaborationService, OrganizationCollaboration } from '@shared';
 9921:   5: import { CollaborationType, CollaborationStatus } from '@core';
 9922:   6: import { NzMessageService } from 'ng-zorro-antd/message';
 9923:   7: 
 9924:   8: @Component({
 9925:   9:   selector: 'app-collaboration-detail',
 9926:  10:   standalone: true,
 9927:  11:   imports: [SHARED_IMPORTS],
 9928:  12:   template: `
 9929:  13:     <page-header [title]="'协作关系详情'">
 9930:  14:       <ng-template #extra>
 9931:  15:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
 9932:  16:           <span nz-icon nzType="arrow-left"></span>
 9933:  17:           返回
 9934:  18:         </button>
 9935:  19:         @if (collaboration()) {
 9936:  20:           <button nz-button nzType="primary" (click)="edit()" style="margin-right: 8px;">
 9937:  21:             <span nz-icon nzType="edit"></span>
 9938:  22:             编辑
 9939:  23:           </button>
 9940:  24:           <button nz-button nzDanger (click)="delete()">
 9941:  25:             <span nz-icon nzType="delete"></span>
 9942:  26:             删除
 9943:  27:           </button>
 9944:  28:         }
 9945:  29:       </ng-template>
 9946:  30:     </page-header>
 9947:  31: 
 9948:  32:     @if (collaborationService.loading()) {
 9949:  33:       <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
 9950:  34:         <ng-template #indicator>
 9951:  35:           <span nz-icon nzType="loading" style="font-size: 24px;"></span>
 9952:  36:         </ng-template>
 9953:  37:       </nz-spin>
 9954:  38:     } @else if (collaborationService.error()) {
 9955:  39:       <nz-alert
 9956:  40:         nzType="error"
 9957:  41:         [nzMessage]="'加载失败'"
 9958:  42:         [nzDescription]="collaborationService.error()"
 9959:  43:         nzShowIcon
 9960:  44:         style="margin: 16px;"
 9961:  45:       ></nz-alert>
 9962:  46:     } @else if (collaboration()) {
 9963:  47:       <div style="padding: 16px;">
 9964:  48:         <!-- 协作关系基本信息 -->
 9965:  49:         <nz-card nzTitle="基本信息" style="margin-bottom: 16px;">
 9966:  50:           <nz-descriptions nzBordered [nzColumn]="{ xxl: 3, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }">
 9967:  51:             <nz-descriptions-item nzTitle="ID">{{ collaboration()!.id }}</nz-descriptions-item>
 9968:  52:             <nz-descriptions-item nzTitle="蓝图ID">{{ collaboration()!.blueprint_id }}</nz-descriptions-item>
 9969:  53:             <nz-descriptions-item nzTitle="拥有者组织">{{ collaboration()!.owner_org_id }}</nz-descriptions-item>
 9970:  54:             <nz-descriptions-item nzTitle="协作组织">{{ collaboration()!.collaborator_org_id }}</nz-descriptions-item>
 9971:  55:             <nz-descriptions-item nzTitle="协作类型">
 9972:  56:               @switch (collaboration()!.collaboration_type) {
 9973:  57:                 @case ('contractor') {
 9974:  58:                   <nz-tag nzColor="blue">承揽商</nz-tag>
 9975:  59:                 }
 9976:  60:                 @case ('subcontractor') {
 9977:  61:                   <nz-tag nzColor="cyan">次承揽商</nz-tag>
 9978:  62:                 }
 9979:  63:                 @case ('consultant') {
 9980:  64:                   <nz-tag nzColor="purple">顾问</nz-tag>
 9981:  65:                 }
 9982:  66:                 @case ('partner') {
 9983:  67:                   <nz-tag nzColor="green">合作伙伴</nz-tag>
 9984:  68:                 }
 9985:  69:                 @default {
 9986:  70:                   <nz-tag>未知</nz-tag>
 9987:  71:                 }
 9988:  72:               }
 9989:  73:             </nz-descriptions-item>
 9990:  74:             <nz-descriptions-item nzTitle="状态">
 9991:  75:               @switch (collaboration()!.status) {
 9992:  76:                 @case ('pending') {
 9993:  77:                   <nz-tag nzColor="orange">待处理</nz-tag>
 9994:  78:                 }
 9995:  79:                 @case ('active') {
 9996:  80:                   <nz-tag nzColor="success">活跃</nz-tag>
 9997:  81:                 }
 9998:  82:                 @case ('suspended') {
 9999:  83:                   <nz-tag nzColor="warning">已暂停</nz-tag>
10000:  84:                 }
10001:  85:                 @case ('ended') {
10002:  86:                   <nz-tag nzColor="default">已结束</nz-tag>
10003:  87:                 }
10004:  88:                 @default {
10005:  89:                   <nz-tag>未知</nz-tag>
10006:  90:                 }
10007:  91:               }
10008:  92:             </nz-descriptions-item>
10009:  93:             <nz-descriptions-item nzTitle="合同开始日期">
10010:  94:               {{ collaboration()!.contract_start_date ? (collaboration()!.contract_start_date | date: 'yyyy-MM-dd') : '-' }}
10011:  95:             </nz-descriptions-item>
10012:  96:             <nz-descriptions-item nzTitle="合同结束日期">
10013:  97:               {{ collaboration()!.contract_end_date ? (collaboration()!.contract_end_date | date: 'yyyy-MM-dd') : '-' }}
10014:  98:             </nz-descriptions-item>
10015:  99:             <nz-descriptions-item nzTitle="创建时间">
10016: 100:               {{ collaboration()!.created_at | date: 'yyyy-MM-dd HH:mm:ss' }}
10017: 101:             </nz-descriptions-item>
10018: 102:             <nz-descriptions-item nzTitle="更新时间">
10019: 103:               {{ collaboration()!.updated_at | date: 'yyyy-MM-dd HH:mm:ss' }}
10020: 104:             </nz-descriptions-item>
10021: 105:           </nz-descriptions>
10022: 106:         </nz-card>
10023: 107:       </div>
10024: 108:     } @else {
10025: 109:       <nz-empty nzNotFoundContent="协作关系不存在"></nz-empty>
10026: 110:     }
10027: 111:   `
10028: 112: })
10029: 113: export class CollaborationDetailComponent implements OnInit {
10030: 114:   collaborationService = inject(CollaborationService);
10031: 115:   route = inject(ActivatedRoute);
10032: 116:   router = inject(Router);
10033: 117:   message = inject(NzMessageService);
10034: 118: 
10035: 119:   // 使用 computed 从 Service 获取协作关系信息
10036: 120:   collaboration = computed(() => this.collaborationService.selectedCollaboration());
10037: 121: 
10038: 122:   // 导出枚举供模板使用
10039: 123:   CollaborationType = CollaborationType;
10040: 124:   CollaborationStatus = CollaborationStatus;
10041: 125: 
10042: 126:   ngOnInit(): void {
10043: 127:     const collaborationId = this.route.snapshot.paramMap.get('id');
10044: 128:     if (collaborationId) {
10045: 129:       this.loadCollaboration(collaborationId);
10046: 130:     }
10047: 131:   }
10048: 132: 
10049: 133:   async loadCollaboration(id: string): Promise<void> {
10050: 134:     try {
10051: 135:       const collaboration = await this.collaborationService.loadCollaborationById(id);
10052: 136:       if (!collaboration) {
10053: 137:         this.message.warning('协作关系不存在');
10054: 138:         this.goBack();
10055: 139:       }
10056: 140:     } catch (error) {
10057: 141:       this.message.error('加载协作关系详情失败');
10058: 142:     }
10059: 143:   }
10060: 144: 
10061: 145:   goBack(): void {
10062: 146:     this.router.navigate(['/collaboration/list']);
10063: 147:   }
10064: 148: 
10065: 149:   edit(): void {
10066: 150:     if (this.collaboration()) {
10067: 151:       this.router.navigate(['/collaboration', this.collaboration()!.id, 'edit']);
10068: 152:     }
10069: 153:   }
10070: 154: 
10071: 155:   async delete(): Promise<void> {
10072: 156:     if (!this.collaboration()) {
10073: 157:       return;
10074: 158:     }
10075: 159: 
10076: 160:     if (confirm('确定要删除此协作关系吗？此操作不可恢复。')) {
10077: 161:       try {
10078: 162:         await this.collaborationService.deleteCollaboration(this.collaboration()!.id);
10079: 163:         this.message.success('删除成功');
10080: 164:         this.goBack();
10081: 165:       } catch (error) {
10082: 166:         this.message.error('删除失败');
10083: 167:       }
10084: 168:     }
10085: 169:   }
10086: 170: }
10087: ````
10088: 
10089: ## File: src/app/routes/collaboration/form/collaboration-form.component.ts
10090: ````typescript
10091:   1: import { Component, OnInit, inject, computed } from '@angular/core';
10092:   2: import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
10093:   3: import { ActivatedRoute, Router } from '@angular/router';
10094:   4: import { SHARED_IMPORTS } from '@shared';
10095:   5: import {
10096:   6:   CollaborationService,
10097:   7:   OrganizationCollaboration,
10098:   8:   OrganizationCollaborationInsert,
10099:   9:   OrganizationCollaborationUpdate
10100:  10: } from '@shared';
10101:  11: import { CollaborationType, CollaborationStatus } from '@core';
10102:  12: import { NzMessageService } from 'ng-zorro-antd/message';
10103:  13: 
10104:  14: /**
10105:  15:  * 协作关系表单类型定义
10106:  16:  */
10107:  17: interface CollaborationFormValue {
10108:  18:   blueprint_id: string;
10109:  19:   owner_org_id: string;
10110:  20:   collaborator_org_id: string;
10111:  21:   collaboration_type: CollaborationType;
10112:  22:   status?: CollaborationStatus;
10113:  23:   contract_start_date?: string | null;
10114:  24:   contract_end_date?: string | null;
10115:  25:   notes?: string | null;
10116:  26: }
10117:  27: 
10118:  28: @Component({
10119:  29:   selector: 'app-collaboration-form',
10120:  30:   standalone: true,
10121:  31:   imports: [SHARED_IMPORTS, ReactiveFormsModule],
10122:  32:   template: `
10123:  33:     <page-header [title]="isEditMode() ? '编辑协作关系' : '创建协作关系'">
10124:  34:       <ng-template #extra>
10125:  35:         <button nz-button nzType="default" (click)="goBack()" style="margin-right: 8px;">
10126:  36:           <span nz-icon nzType="arrow-left"></span>
10127:  37:           返回
10128:  38:         </button>
10129:  39:       </ng-template>
10130:  40:     </page-header>
10131:  41: 
10132:  42:     <div style="padding: 16px;">
10133:  43:       @if (collaborationService.loading()) {
10134:  44:         <nz-spin nzSimple [nzSize]="'large'" style="display: block; padding: 50px; text-align: center;">
10135:  45:           <ng-template #indicator>
10136:  46:             <span nz-icon nzType="loading" style="font-size: 24px;"></span>
10137:  47:           </ng-template>
10138:  48:         </nz-spin>
10139:  49:       } @else {
10140:  50:         <nz-card [nzTitle]="isEditMode() ? '编辑协作关系信息' : '创建新协作关系'">
10141:  51:           <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
10142:  52:             <nz-form-item>
10143:  53:               <nz-form-label [nzSpan]="4" nzRequired>蓝图ID</nz-form-label>
10144:  54:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入蓝图ID'">
10145:  55:                 <input nz-input formControlName="blueprint_id" placeholder="请输入蓝图ID" />
10146:  56:               </nz-form-control>
10147:  57:             </nz-form-item>
10148:  58: 
10149:  59:             <nz-form-item>
10150:  60:               <nz-form-label [nzSpan]="4" nzRequired>拥有者组织ID</nz-form-label>
10151:  61:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入拥有者组织ID'">
10152:  62:                 <input nz-input formControlName="owner_org_id" placeholder="请输入拥有者组织ID" />
10153:  63:               </nz-form-control>
10154:  64:             </nz-form-item>
10155:  65: 
10156:  66:             <nz-form-item>
10157:  67:               <nz-form-label [nzSpan]="4" nzRequired>协作组织ID</nz-form-label>
10158:  68:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请输入协作组织ID'">
10159:  69:                 <input nz-input formControlName="collaborator_org_id" placeholder="请输入协作组织ID" />
10160:  70:               </nz-form-control>
10161:  71:             </nz-form-item>
10162:  72: 
10163:  73:             <nz-form-item>
10164:  74:               <nz-form-label [nzSpan]="4" nzRequired>协作类型</nz-form-label>
10165:  75:               <nz-form-control [nzSpan]="20" [nzErrorTip]="'请选择协作类型'">
10166:  76:                 <nz-select formControlName="collaboration_type" nzPlaceHolder="请选择协作类型">
10167:  77:                   <nz-option [nzValue]="CollaborationType.CONTRACTOR" nzLabel="承揽商"></nz-option>
10168:  78:                   <nz-option [nzValue]="CollaborationType.SUBCONTRACTOR" nzLabel="次承揽商"></nz-option>
10169:  79:                   <nz-option [nzValue]="CollaborationType.CONSULTANT" nzLabel="顾问"></nz-option>
10170:  80:                   <nz-option [nzValue]="CollaborationType.PARTNER" nzLabel="合作伙伴"></nz-option>
10171:  81:                 </nz-select>
10172:  82:               </nz-form-control>
10173:  83:             </nz-form-item>
10174:  84: 
10175:  85:             @if (isEditMode()) {
10176:  86:               <nz-form-item>
10177:  87:                 <nz-form-label [nzSpan]="4">状态</nz-form-label>
10178:  88:                 <nz-form-control [nzSpan]="20">
10179:  89:                   <nz-select formControlName="status" nzPlaceHolder="请选择状态">
10180:  90:                     <nz-option [nzValue]="CollaborationStatus.PENDING" nzLabel="待处理"></nz-option>
10181:  91:                     <nz-option [nzValue]="CollaborationStatus.ACTIVE" nzLabel="活跃"></nz-option>
10182:  92:                     <nz-option [nzValue]="CollaborationStatus.SUSPENDED" nzLabel="已暂停"></nz-option>
10183:  93:                     <nz-option [nzValue]="CollaborationStatus.ENDED" nzLabel="已结束"></nz-option>
10184:  94:                   </nz-select>
10185:  95:                 </nz-form-control>
10186:  96:               </nz-form-item>
10187:  97:             }
10188:  98: 
10189:  99:             <nz-form-item>
10190: 100:               <nz-form-label [nzSpan]="4">合同开始日期</nz-form-label>
10191: 101:               <nz-form-control [nzSpan]="20">
10192: 102:                 <input nz-input formControlName="contract_start_date" type="date" />
10193: 103:               </nz-form-control>
10194: 104:             </nz-form-item>
10195: 105: 
10196: 106:             <nz-form-item>
10197: 107:               <nz-form-label [nzSpan]="4">合同结束日期</nz-form-label>
10198: 108:               <nz-form-control [nzSpan]="20">
10199: 109:                 <input nz-input formControlName="contract_end_date" type="date" />
10200: 110:               </nz-form-control>
10201: 111:             </nz-form-item>
10202: 112: 
10203: 113:             <nz-form-item>
10204: 114:               <nz-form-label [nzSpan]="4">备注</nz-form-label>
10205: 115:               <nz-form-control [nzSpan]="20">
10206: 116:                 <textarea nz-input formControlName="notes" rows="4" placeholder="请输入备注"></textarea>
10207: 117:               </nz-form-control>
10208: 118:             </nz-form-item>
10209: 119: 
10210: 120:             <nz-form-item>
10211: 121:               <nz-form-control [nzSpan]="24" [nzOffset]="4">
10212: 122:                 <button
10213: 123:                   nz-button
10214: 124:                   nzType="primary"
10215: 125:                   [nzLoading]="collaborationService.loading()"
10216: 126:                   [disabled]="form.invalid"
10217: 127:                 >
10218: 128:                   <span nz-icon nzType="save"></span>
10219: 129:                   {{ isEditMode() ? '保存' : '创建' }}
10220: 130:                 </button>
10221: 131:                 <button nz-button nzType="default" type="button" (click)="goBack()" style="margin-left: 8px;">
10222: 132:                   取消
10223: 133:                 </button>
10224: 134:               </nz-form-control>
10225: 135:             </nz-form-item>
10226: 136:           </form>
10227: 137:         </nz-card>
10228: 138:       }
10229: 139:     </div>
10230: 140:   `
10231: 141: })
10232: 142: export class CollaborationFormComponent implements OnInit {
10233: 143:   collaborationService = inject(CollaborationService);
10234: 144:   route = inject(ActivatedRoute);
10235: 145:   router = inject(Router);
10236: 146:   message = inject(NzMessageService);
10237: 147: 
10238: 148:   // 导出枚举供模板使用
10239: 149:   CollaborationType = CollaborationType;
10240: 150:   CollaborationStatus = CollaborationStatus;
10241: 151: 
10242: 152:   // 判断是否为编辑模式
10243: 153:   isEditMode = computed(() => {
10244: 154:     const id = this.route.snapshot.paramMap.get('id');
10245: 155:     return !!id;
10246: 156:   });
10247: 157: 
10248: 158:   // 表单定义
10249: 159:   form = new FormGroup<{
10250: 160:     blueprint_id: FormControl<string>;
10251: 161:     owner_org_id: FormControl<string>;
10252: 162:     collaborator_org_id: FormControl<string>;
10253: 163:     collaboration_type: FormControl<CollaborationType>;
10254: 164:     status?: FormControl<CollaborationStatus>;
10255: 165:     contract_start_date?: FormControl<string | null>;
10256: 166:     contract_end_date?: FormControl<string | null>;
10257: 167:     notes?: FormControl<string | null>;
10258: 168:   }>({
10259: 169:     blueprint_id: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
10260: 170:     owner_org_id: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
10261: 171:     collaborator_org_id: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
10262: 172:     collaboration_type: new FormControl(CollaborationType.CONTRACTOR, {
10263: 173:       nonNullable: true,
10264: 174:       validators: [Validators.required]
10265: 175:     }),
10266: 176:     status: new FormControl(CollaborationStatus.ACTIVE, { nonNullable: true }),
10267: 177:     contract_start_date: new FormControl(null),
10268: 178:     contract_end_date: new FormControl(null),
10269: 179:     notes: new FormControl(null)
10270: 180:   });
10271: 181: 
10272: 182:   ngOnInit(): void {
10273: 183:     if (this.isEditMode()) {
10274: 184:       const collaborationId = this.route.snapshot.paramMap.get('id');
10275: 185:       if (collaborationId) {
10276: 186:         this.loadCollaboration(collaborationId);
10277: 187:       }
10278: 188:     }
10279: 189:   }
10280: 190: 
10281: 191:   async loadCollaboration(id: string): Promise<void> {
10282: 192:     try {
10283: 193:       const collaboration = await this.collaborationService.loadCollaborationById(id);
10284: 194:       if (collaboration) {
10285: 195:         this.form.patchValue({
10286: 196:           blueprint_id: collaboration.blueprint_id,
10287: 197:           owner_org_id: collaboration.owner_org_id,
10288: 198:           collaborator_org_id: collaboration.collaborator_org_id,
10289: 199:           collaboration_type: collaboration.collaboration_type as CollaborationType,
10290: 200:           status: collaboration.status as CollaborationStatus,
10291: 201:           contract_start_date: collaboration.contract_start_date || null,
10292: 202:           contract_end_date: collaboration.contract_end_date || null,
10293: 203:           notes: collaboration.notes || null
10294: 204:         });
10295: 205:       } else {
10296: 206:         this.message.warning('协作关系不存在');
10297: 207:         this.goBack();
10298: 208:       }
10299: 209:     } catch (error) {
10300: 210:       this.message.error('加载协作关系信息失败');
10301: 211:     }
10302: 212:   }
10303: 213: 
10304: 214:   async onSubmit(): Promise<void> {
10305: 215:     if (this.form.invalid) {
10306: 216:       // 标记所有字段为 touched，显示验证错误
10307: 217:       Object.values(this.form.controls).forEach(control => {
10308: 218:         if (control && control.invalid) {
10309: 219:           control.markAsTouched();
10310: 220:           control.updateValueAndValidity({ onlySelf: true });
10311: 221:         }
10312: 222:       });
10313: 223:       return;
10314: 224:     }
10315: 225: 
10316: 226:     const formValue = this.form.value as CollaborationFormValue;
10317: 227: 
10318: 228:     try {
10319: 229:       if (this.isEditMode()) {
10320: 230:         const collaborationId = this.route.snapshot.paramMap.get('id')!;
10321: 231:         const updateData: OrganizationCollaborationUpdate = {
10322: 232:           blueprint_id: formValue.blueprint_id,
10323: 233:           owner_org_id: formValue.owner_org_id,
10324: 234:           collaborator_org_id: formValue.collaborator_org_id,
10325: 235:           collaboration_type: formValue.collaboration_type,
10326: 236:           status: formValue.status,
10327: 237:           contract_start_date: formValue.contract_start_date || undefined,
10328: 238:           contract_end_date: formValue.contract_end_date || undefined,
10329: 239:           notes: formValue.notes || undefined
10330: 240:         };
10331: 241:         await this.collaborationService.updateCollaboration(collaborationId, updateData);
10332: 242:         this.message.success('更新成功');
10333: 243:         this.router.navigate(['/collaboration', collaborationId]);
10334: 244:       } else {
10335: 245:         const insertData: OrganizationCollaborationInsert = {
10336: 246:           blueprint_id: formValue.blueprint_id,
10337: 247:           owner_org_id: formValue.owner_org_id,
10338: 248:           collaborator_org_id: formValue.collaborator_org_id,
10339: 249:           collaboration_type: formValue.collaboration_type,
10340: 250:           status: formValue.status || CollaborationStatus.ACTIVE,
10341: 251:           contract_start_date: formValue.contract_start_date || undefined,
10342: 252:           contract_end_date: formValue.contract_end_date || undefined,
10343: 253:           notes: formValue.notes || undefined
10344: 254:         };
10345: 255:         const collaboration = await this.collaborationService.createCollaboration(insertData);
10346: 256:         this.message.success('创建成功');
10347: 257:         this.router.navigate(['/collaboration', collaboration.id]);
10348: 258:       }
10349: 259:     } catch (error) {
10350: 260:       this.message.error(this.isEditMode() ? '更新失败' : '创建失败');
10351: 261:     }
10352: 262:   }
10353: 263: 
10354: 264:   goBack(): void {
10355: 265:     if (this.isEditMode()) {
10356: 266:       const collaborationId = this.route.snapshot.paramMap.get('id');
10357: 267:       if (collaborationId) {
10358: 268:         this.router.navigate(['/collaboration', collaborationId]);
10359: 269:       } else {
10360: 270:         this.router.navigate(['/collaboration/list']);
10361: 271:       }
10362: 272:     } else {
10363: 273:       this.router.navigate(['/collaboration/list']);
10364: 274:     }
10365: 275:   }
10366: 276: }
10367: ````
10368: 
10369: ## File: src/app/routes/collaboration/invitations/invitation-list.component.ts
10370: ````typescript
10371:   1: import { Component, OnInit, inject } from '@angular/core';
10372:   2: import { Router } from '@angular/router';
10373:   3: import { STColumn } from '@delon/abc/st';
10374:   4: import { SHARED_IMPORTS } from '@shared';
10375:   5: import { InvitationService, CollaborationInvitation } from '@shared';
10376:   6: import { InvitationStatus } from '@core';
10377:   7: import { NzMessageService } from 'ng-zorro-antd/message';
10378:   8: 
10379:   9: @Component({
10380:  10:   selector: 'app-invitation-list',
10381:  11:   standalone: true,
10382:  12:   imports: [SHARED_IMPORTS],
10383:  13:   template: `
10384:  14:     <page-header [title]="'协作邀请管理'">
10385:  15:       <ng-template #extra>
10386:  16:         <button nz-button nzType="primary" (click)="createInvitation()">
10387:  17:           <span nz-icon nzType="plus"></span>
10388:  18:           发送邀请
10389:  19:         </button>
10390:  20:       </ng-template>
10391:  21:     </page-header>
10392:  22: 
10393:  23:     <nz-card nzTitle="管理系统中的所有协作邀请" style="margin-top: 16px;">
10394:  24:       <st
10395:  25:         #st
10396:  26:         [data]="invitationService.invitations()"
10397:  27:         [columns]="columns"
10398:  28:         [loading]="invitationService.loading()"
10399:  29:         [page]="{ front: false, show: true, showSize: true }"
10400:  30:         (change)="onTableChange()"
10401:  31:       >
10402:  32:         <ng-template #status let-record>
10403:  33:           @switch (record.status) {
10404:  34:             @case ('pending') {
10405:  35:               <nz-tag nzColor="orange">待处理</nz-tag>
10406:  36:             }
10407:  37:             @case ('accepted') {
10408:  38:               <nz-tag nzColor="success">已接受</nz-tag>
10409:  39:             }
10410:  40:             @case ('rejected') {
10411:  41:               <nz-tag nzColor="error">已拒绝</nz-tag>
10412:  42:             }
10413:  43:             @case ('expired') {
10414:  44:               <nz-tag nzColor="default">已过期</nz-tag>
10415:  45:             }
10416:  46:             @default {
10417:  47:               <nz-tag>未知</nz-tag>
10418:  48:             }
10419:  49:           }
10420:  50:         </ng-template>
10421:  51:       </st>
10422:  52:     </nz-card>
10423:  53:   `
10424:  54: })
10425:  55: export class InvitationListComponent implements OnInit {
10426:  56:   invitationService = inject(InvitationService);
10427:  57:   router = inject(Router);
10428:  58:   message = inject(NzMessageService);
10429:  59: 
10430:  60:   columns: STColumn[] = [
10431:  61:     { title: 'ID', index: 'id', width: 100 },
10432:  62:     { title: '蓝图ID', index: 'blueprint_id', width: 150 },
10433:  63:     { title: '发送组织', index: 'from_org_id', width: 150 },
10434:  64:     { title: '接收组织', index: 'to_org_id', width: 150 },
10435:  65:     { title: '状态', index: 'status', width: 100, render: 'status' },
10436:  66:     { title: '邀请消息', index: 'message', width: 200 },
10437:  67:     { title: '过期时间', index: 'expires_at', type: 'date', width: 180 },
10438:  68:     { title: '响应时间', index: 'responded_at', type: 'date', width: 180 },
10439:  69:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
10440:  70:     {
10441:  71:       title: '操作',
10442:  72:       width: 250,
10443:  73:       buttons: [
10444:  74:         {
10445:  75:           text: '查看',
10446:  76:           click: (record: CollaborationInvitation) => this.viewDetail(record.id)
10447:  77:         },
10448:  78:         {
10449:  79:           text: '接受',
10450:  80:           type: 'link',
10451:  81:           click: (record: CollaborationInvitation) => this.accept(record.id),
10452:  82:           iif: (record: CollaborationInvitation) => record.status === InvitationStatus.PENDING
10453:  83:         },
10454:  84:         {
10455:  85:           text: '拒绝',
10456:  86:           type: 'link',
10457:  87:           click: (record: CollaborationInvitation) => this.reject(record.id),
10458:  88:           iif: (record: CollaborationInvitation) => record.status === InvitationStatus.PENDING
10459:  89:         },
10460:  90:         {
10461:  91:           text: '删除',
10462:  92:           type: 'del',
10463:  93:           pop: {
10464:  94:             title: '确定要删除这个邀请吗？',
10465:  95:             okType: 'danger'
10466:  96:           },
10467:  97:           click: (record: CollaborationInvitation) => this.delete(record.id)
10468:  98:         }
10469:  99:       ]
10470: 100:     }
10471: 101:   ];
10472: 102: 
10473: 103:   ngOnInit(): void {
10474: 104:     this.loadData();
10475: 105:   }
10476: 106: 
10477: 107:   async loadData(): Promise<void> {
10478: 108:     try {
10479: 109:       await this.invitationService.loadInvitations();
10480: 110:     } catch (error) {
10481: 111:       this.message.error('加载邀请列表失败');
10482: 112:     }
10483: 113:   }
10484: 114: 
10485: 115:   onTableChange(): void {
10486: 116:     // 表格变化处理
10487: 117:   }
10488: 118: 
10489: 119:   createInvitation(): void {
10490: 120:     this.router.navigate(['/collaboration/invitations/create']);
10491: 121:   }
10492: 122: 
10493: 123:   viewDetail(id: string): void {
10494: 124:     this.router.navigate(['/collaboration/invitations', id]);
10495: 125:   }
10496: 126: 
10497: 127:   async accept(id: string): Promise<void> {
10498: 128:     try {
10499: 129:       await this.invitationService.acceptInvitation(id);
10500: 130:       this.message.success('接受邀请成功');
10501: 131:       await this.loadData();
10502: 132:     } catch (error) {
10503: 133:       this.message.error('接受邀请失败');
10504: 134:     }
10505: 135:   }
10506: 136: 
10507: 137:   async reject(id: string): Promise<void> {
10508: 138:     try {
10509: 139:       await this.invitationService.rejectInvitation(id);
10510: 140:       this.message.success('拒绝邀请成功');
10511: 141:       await this.loadData();
10512: 142:     } catch (error) {
10513: 143:       this.message.error('拒绝邀请失败');
10514: 144:     }
10515: 145:   }
10516: 146: 
10517: 147:   async delete(id: string): Promise<void> {
10518: 148:     try {
10519: 149:       await this.invitationService.deleteInvitation(id);
10520: 150:       this.message.success('删除成功');
10521: 151:       await this.loadData();
10522: 152:     } catch (error) {
10523: 153:       this.message.error('删除失败');
10524: 154:     }
10525: 155:   }
10526: 156: }
10527: ````
10528: 
10529: ## File: src/app/routes/collaboration/list/collaboration-list.component.spec.ts
10530: ````typescript
10531:   1: import { ComponentFixture, TestBed } from '@angular/core/testing';
10532:   2: import { Router } from '@angular/router';
10533:   3: import { NoopAnimationsModule } from '@angular/platform-browser/animations';
10534:   4: import { NzMessageService } from 'ng-zorro-antd/message';
10535:   5: import { SettingsService } from '@delon/theme';
10536:   6: import { SHARED_IMPORTS } from '@shared';
10537:   7: import { CollaborationService } from '@shared';
10538:   8: import { CollaborationListComponent } from './collaboration-list.component';
10539:   9: import { OrganizationCollaboration } from '@shared';
10540:  10: import { CollaborationType, CollaborationStatus } from '@core';
10541:  11: import { NzSafeAny } from 'ng-zorro-antd/core/types';
10542:  12: 
10543:  13: describe('CollaborationListComponent', () => {
10544:  14:   let component: CollaborationListComponent;
10545:  15:   let fixture: ComponentFixture<CollaborationListComponent>;
10546:  16:   let collaborationService: jasmine.SpyObj<CollaborationService>;
10547:  17:   let router: jasmine.SpyObj<Router>;
10548:  18:   let messageService: jasmine.SpyObj<NzMessageService>;
10549:  19: 
10550:  20:   const mockCollaborations: OrganizationCollaboration[] = [
10551:  21:     {
10552:  22:       id: 'collab-1',
10553:  23:       blueprint_id: 'blueprint-1',
10554:  24:       owner_org_id: 'org-1',
10555:  25:       collaborator_org_id: 'org-2',
10556:  26:       collaboration_type: CollaborationType.CONTRACTOR,
10557:  27:       status: CollaborationStatus.ACTIVE,
10558:  28:       contract_start_date: '2025-01-01',
10559:  29:       contract_end_date: '2025-12-31',
10560:  30:       notes: 'Test collaboration',
10561:  31:       created_at: '2025-01-01T00:00:00Z',
10562:  32:       updated_at: '2025-01-01T00:00:00Z'
10563:  33:     } as OrganizationCollaboration
10564:  34:   ];
10565:  35: 
10566:  36:   beforeEach(async () => {
10567:  37:     const collaborationServiceSpy = jasmine.createSpyObj('CollaborationService', [
10568:  38:       'loadCollaborations',
10569:  39:       'createCollaboration',
10570:  40:       'deleteCollaboration'
10571:  41:     ], {
10572:  42:       collaborations: jasmine.createSpy('collaborations').and.returnValue(mockCollaborations),
10573:  43:       loading: jasmine.createSpy('loading').and.returnValue(false),
10574:  44:       error: jasmine.createSpy('error').and.returnValue(null)
10575:  45:     });
10576:  46: 
10577:  47:     const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
10578:  48:     const messageServiceSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error']);
10579:  49:     const mockSettingsService: NzSafeAny = {
10580:  50:       layout: {
10581:  51:         lang: null
10582:  52:       }
10583:  53:     };
10584:  54: 
10585:  55:     await TestBed.configureTestingModule({
10586:  56:       imports: [
10587:  57:         NoopAnimationsModule,
10588:  58:         CollaborationListComponent,
10589:  59:         SHARED_IMPORTS
10590:  60:       ],
10591:  61:       providers: [
10592:  62:         { provide: CollaborationService, useValue: collaborationServiceSpy },
10593:  63:         { provide: Router, useValue: routerSpy },
10594:  64:         { provide: NzMessageService, useValue: messageServiceSpy },
10595:  65:         { provide: SettingsService, useValue: mockSettingsService }
10596:  66:       ]
10597:  67:     }).compileComponents();
10598:  68: 
10599:  69:     fixture = TestBed.createComponent(CollaborationListComponent);
10600:  70:     component = fixture.componentInstance;
10601:  71:     collaborationService = TestBed.inject(CollaborationService) as jasmine.SpyObj<CollaborationService>;
10602:  72:     router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
10603:  73:     messageService = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
10604:  74:   });
10605:  75: 
10606:  76:   it('should create', () => {
10607:  77:     expect(component).toBeTruthy();
10608:  78:   });
10609:  79: 
10610:  80:   it('should load collaborations on init', async () => {
10611:  81:     collaborationService.loadCollaborations.and.returnValue(Promise.resolve());
10612:  82: 
10613:  83:     component.ngOnInit();
10614:  84:     await fixture.whenStable();
10615:  85:     fixture.detectChanges();
10616:  86: 
10617:  87:     expect(collaborationService.loadCollaborations).toHaveBeenCalled();
10618:  88:   });
10619:  89: 
10620:  90:   it('should navigate to create page when create button clicked', () => {
10621:  91:     component.createCollaboration();
10622:  92: 
10623:  93:     expect(router.navigate).toHaveBeenCalledWith(['/collaboration/form']);
10624:  94:   });
10625:  95: 
10626:  96:   it('should display collaborations in table', () => {
10627:  97:     fixture.detectChanges();
10628:  98: 
10629:  99:     const compiled = fixture.nativeElement;
10630: 100:     expect(compiled.querySelector('st')).toBeTruthy();
10631: 101:   });
10632: 102: });
10633: ````
10634: 
10635: ## File: src/app/routes/collaboration/list/collaboration-list.component.ts
10636: ````typescript
10637:   1: import { Component, OnInit, inject } from '@angular/core';
10638:   2: import { Router } from '@angular/router';
10639:   3: import { STColumn } from '@delon/abc/st';
10640:   4: import { SHARED_IMPORTS } from '@shared';
10641:   5: import { CollaborationService, OrganizationCollaboration } from '@shared';
10642:   6: import { CollaborationType, CollaborationStatus } from '@core';
10643:   7: import { NzMessageService } from 'ng-zorro-antd/message';
10644:   8: 
10645:   9: @Component({
10646:  10:   selector: 'app-collaboration-list',
10647:  11:   standalone: true,
10648:  12:   imports: [SHARED_IMPORTS],
10649:  13:   template: `
10650:  14:     <page-header [title]="'协作关系管理'">
10651:  15:       <ng-template #extra>
10652:  16:         <button nz-button nzType="primary" (click)="createCollaboration()">
10653:  17:           <span nz-icon nzType="plus"></span>
10654:  18:           新建协作关系
10655:  19:         </button>
10656:  20:       </ng-template>
10657:  21:     </page-header>
10658:  22: 
10659:  23:     <nz-card nzTitle="管理系统中的所有协作关系" style="margin-top: 16px;">
10660:  24:       <st
10661:  25:         #st
10662:  26:         [data]="collaborationService.collaborations()"
10663:  27:         [columns]="columns"
10664:  28:         [loading]="collaborationService.loading()"
10665:  29:         [page]="{ front: false, show: true, showSize: true }"
10666:  30:         (change)="onTableChange()"
10667:  31:       >
10668:  32:         <ng-template #type let-record>
10669:  33:           @switch (record.collaboration_type) {
10670:  34:             @case ('contractor') {
10671:  35:               <nz-tag nzColor="blue">承揽商</nz-tag>
10672:  36:             }
10673:  37:             @case ('subcontractor') {
10674:  38:               <nz-tag nzColor="cyan">次承揽商</nz-tag>
10675:  39:             }
10676:  40:             @case ('consultant') {
10677:  41:               <nz-tag nzColor="purple">顾问</nz-tag>
10678:  42:             }
10679:  43:             @case ('partner') {
10680:  44:               <nz-tag nzColor="green">合作伙伴</nz-tag>
10681:  45:             }
10682:  46:             @default {
10683:  47:               <nz-tag>未知</nz-tag>
10684:  48:             }
10685:  49:           }
10686:  50:         </ng-template>
10687:  51: 
10688:  52:         <ng-template #status let-record>
10689:  53:           @switch (record.status) {
10690:  54:             @case ('pending') {
10691:  55:               <nz-tag nzColor="orange">待处理</nz-tag>
10692:  56:             }
10693:  57:             @case ('active') {
10694:  58:               <nz-tag nzColor="success">活跃</nz-tag>
10695:  59:             }
10696:  60:             @case ('suspended') {
10697:  61:               <nz-tag nzColor="warning">已暂停</nz-tag>
10698:  62:             }
10699:  63:             @case ('ended') {
10700:  64:               <nz-tag nzColor="default">已结束</nz-tag>
10701:  65:             }
10702:  66:             @default {
10703:  67:               <nz-tag>未知</nz-tag>
10704:  68:             }
10705:  69:           }
10706:  70:         </ng-template>
10707:  71:       </st>
10708:  72:     </nz-card>
10709:  73:   `
10710:  74: })
10711:  75: export class CollaborationListComponent implements OnInit {
10712:  76:   collaborationService = inject(CollaborationService);
10713:  77:   router = inject(Router);
10714:  78:   message = inject(NzMessageService);
10715:  79: 
10716:  80:   columns: STColumn[] = [
10717:  81:     { title: 'ID', index: 'id', width: 100 },
10718:  82:     { title: '蓝图ID', index: 'blueprint_id', width: 150 },
10719:  83:     { title: '拥有者组织', index: 'owner_org_id', width: 150 },
10720:  84:     { title: '协作组织', index: 'collaborator_org_id', width: 150 },
10721:  85:     { title: '协作类型', index: 'collaboration_type', width: 120, render: 'type' },
10722:  86:     { title: '状态', index: 'status', width: 100, render: 'status' },
10723:  87:     { title: '合同开始日期', index: 'contract_start_date', type: 'date', width: 120 },
10724:  88:     { title: '合同结束日期', index: 'contract_end_date', type: 'date', width: 120 },
10725:  89:     { title: '创建时间', index: 'created_at', type: 'date', width: 180 },
10726:  90:     {
10727:  91:       title: '操作',
10728:  92:       width: 200,
10729:  93:       buttons: [
10730:  94:         {
10731:  95:           text: '查看',
10732:  96:           click: (record: OrganizationCollaboration) => this.viewDetail(record.id)
10733:  97:         },
10734:  98:         {
10735:  99:           text: '编辑',
10736: 100:           click: (record: OrganizationCollaboration) => this.edit(record.id)
10737: 101:         },
10738: 102:         {
10739: 103:           text: '删除',
10740: 104:           type: 'del',
10741: 105:           pop: {
10742: 106:             title: '确定要删除这个协作关系吗？',
10743: 107:             okType: 'danger'
10744: 108:           },
10745: 109:           click: (record: OrganizationCollaboration) => this.delete(record.id)
10746: 110:         }
10747: 111:       ]
10748: 112:     }
10749: 113:   ];
10750: 114: 
10751: 115:   ngOnInit(): void {
10752: 116:     this.loadData();
10753: 117:   }
10754: 118: 
10755: 119:   async loadData(): Promise<void> {
10756: 120:     try {
10757: 121:       await this.collaborationService.loadCollaborations();
10758: 122:     } catch (error) {
10759: 123:       this.message.error('加载协作关系列表失败');
10760: 124:     }
10761: 125:   }
10762: 126: 
10763: 127:   onTableChange(): void {
10764: 128:     // 表格变化处理
10765: 129:   }
10766: 130: 
10767: 131:   createCollaboration(): void {
10768: 132:     this.router.navigate(['/collaboration/create']);
10769: 133:   }
10770: 134: 
10771: 135:   viewDetail(id: string): void {
10772: 136:     this.router.navigate(['/collaboration', id]);
10773: 137:   }
10774: 138: 
10775: 139:   edit(id: string): void {
10776: 140:     this.router.navigate(['/collaboration', id, 'edit']);
10777: 141:   }
10778: 142: 
10779: 143:   async delete(id: string): Promise<void> {
10780: 144:     try {
10781: 145:       await this.collaborationService.deleteCollaboration(id);
10782: 146:       this.message.success('删除成功');
10783: 147:       await this.loadData();
10784: 148:     } catch (error) {
10785: 149:       this.message.error('删除失败');
10786: 150:     }
10787: 151:   }
10788: 152: }
10789: ````
10790: 
10791: ## File: src/app/routes/collaboration/routes.ts
10792: ````typescript
10793:  1: import { Routes } from '@angular/router';
10794:  2: 
10795:  3: export const COLLABORATION_ROUTES: Routes = [
10796:  4:   {
10797:  5:     path: '',
10798:  6:     redirectTo: 'list',
10799:  7:     pathMatch: 'full'
10800:  8:   },
10801:  9:   {
10802: 10:     path: 'list',
10803: 11:     loadComponent: () =>
10804: 12:       import('./list/collaboration-list.component').then(m => m.CollaborationListComponent)
10805: 13:   },
10806: 14:   {
10807: 15:     path: 'create',
10808: 16:     loadComponent: () => import('./form/collaboration-form.component').then(m => m.CollaborationFormComponent)
10809: 17:   },
10810: 18:   {
10811: 19:     path: 'invitations',
10812: 20:     loadComponent: () => import('./invitations/invitation-list.component').then(m => m.InvitationListComponent)
10813: 21:   },
10814: 22:   {
10815: 23:     path: ':id/edit',
10816: 24:     loadComponent: () => import('./form/collaboration-form.component').then(m => m.CollaborationFormComponent)
10817: 25:   },
10818: 26:   {
10819: 27:     path: ':id',
10820: 28:     loadComponent: () => import('./detail/collaboration-detail.component').then(m => m.CollaborationDetailComponent)
10821: 29:   }
10822: 30: ];
10823: ````
10824: 
10825: ## File: src/app/routes/dashboard/analysis/analysis.component.ts
10826: ````typescript
10827:   1: import { DecimalPipe } from '@angular/common';
10828:   2: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
10829:   3: import { STColumn } from '@delon/abc/st';
10830:   4: import { G2BarModule } from '@delon/chart/bar';
10831:   5: import { G2CardModule } from '@delon/chart/card';
10832:   6: import { G2MiniAreaModule } from '@delon/chart/mini-area';
10833:   7: import { G2MiniBarModule } from '@delon/chart/mini-bar';
10834:   8: import { G2MiniProgressModule } from '@delon/chart/mini-progress';
10835:   9: import { NumberInfoModule } from '@delon/chart/number-info';
10836:  10: import { G2PieModule } from '@delon/chart/pie';
10837:  11: import { G2TimelineModule } from '@delon/chart/timeline';
10838:  12: import { TrendModule } from '@delon/chart/trend';
10839:  13: import { ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
10840:  14: import { getTimeDistance } from '@delon/util/date-time';
10841:  15: import { deepCopy } from '@delon/util/other';
10842:  16: import { SHARED_IMPORTS, yuan } from '@shared';
10843:  17: import type { NzSafeAny } from 'ng-zorro-antd/core/types';
10844:  18: import { NzMessageService } from 'ng-zorro-antd/message';
10845:  19: 
10846:  20: @Component({
10847:  21:   selector: 'app-dashboard-analysis',
10848:  22:   templateUrl: './analysis.component.html',
10849:  23:   styleUrls: ['./analysis.component.less'],
10850:  24:   changeDetection: ChangeDetectionStrategy.OnPush,
10851:  25:   imports: [
10852:  26:     ...SHARED_IMPORTS,
10853:  27:     G2TimelineModule,
10854:  28:     G2PieModule,
10855:  29:     NumberInfoModule,
10856:  30:     TrendModule,
10857:  31:     G2MiniAreaModule,
10858:  32:     DecimalPipe,
10859:  33:     G2BarModule,
10860:  34:     G2MiniProgressModule,
10861:  35:     G2CardModule,
10862:  36:     G2MiniBarModule
10863:  37:   ]
10864:  38: })
10865:  39: export class DashboardAnalysisComponent implements OnInit {
10866:  40:   private readonly http = inject(_HttpClient);
10867:  41:   readonly msg = inject(NzMessageService);
10868:  42:   private readonly i18n = inject(ALAIN_I18N_TOKEN);
10869:  43:   private readonly cdr = inject(ChangeDetectorRef);
10870:  44: 
10871:  45:   data: any = {};
10872:  46:   loading = true;
10873:  47:   dateRange: Date[] = [];
10874:  48:   dateRangeTypes = ['today', 'week', 'month', 'year'];
10875:  49:   dateRangeType = this.dateRangeTypes[0];
10876:  50:   rankingListData: Array<{ title: string; total: number }> = Array(7)
10877:  51:     .fill({})
10878:  52:     .map((_, i) => {
10879:  53:       return {
10880:  54:         title: this.i18n.fanyi('app.analysis.test', { no: i }),
10881:  55:         total: 323234
10882:  56:       };
10883:  57:     });
10884:  58:   titleMap = {
10885:  59:     y1: this.i18n.fanyi('app.analysis.traffic'),
10886:  60:     y2: this.i18n.fanyi('app.analysis.payments')
10887:  61:   };
10888:  62:   searchColumn: STColumn[] = [
10889:  63:     { title: { text: '排名', i18n: 'app.analysis.table.rank' }, index: 'index' },
10890:  64:     {
10891:  65:       title: { text: '搜索关键词', i18n: 'app.analysis.table.search-keyword' },
10892:  66:       index: 'keyword',
10893:  67:       click: item => this.msg.success(item.keyword)
10894:  68:     },
10895:  69:     {
10896:  70:       type: 'number',
10897:  71:       title: { text: '用户数', i18n: 'app.analysis.table.users' },
10898:  72:       index: 'count',
10899:  73:       sort: {
10900:  74:         compare: (a, b) => a.count - b.count
10901:  75:       }
10902:  76:     },
10903:  77:     {
10904:  78:       type: 'number',
10905:  79:       title: { text: '周涨幅', i18n: 'app.analysis.table.weekly-range' },
10906:  80:       index: 'range',
10907:  81:       render: 'range',
10908:  82:       sort: {
10909:  83:         compare: (a, b) => a.range - b.range
10910:  84:       }
10911:  85:     }
10912:  86:   ];
10913:  87: 
10914:  88:   salesType = 'all';
10915:  89:   salesPieData: any;
10916:  90:   salesTotal = 0;
10917:  91: 
10918:  92:   saleTabs: string[] = ['sales', 'visits'];
10919:  93: 
10920:  94:   offlineIdx = 0;
10921:  95: 
10922:  96:   ngOnInit(): void {
10923:  97:     this.http.get('/chart').subscribe(res => {
10924:  98:       res.offlineData.forEach((item: any) => {
10925:  99:         item.chart = deepCopy(res.offlineChartData);
10926: 100:       });
10927: 101:       this.data = res;
10928: 102:       this.loading = false;
10929: 103:       this.changeSaleType();
10930: 104:     });
10931: 105:   }
10932: 106: 
10933: 107:   setDate(type: string): void {
10934: 108:     this.dateRange = getTimeDistance(type as NzSafeAny);
10935: 109:     this.dateRangeType = type;
10936: 110:     setTimeout(() => this.cdr.detectChanges());
10937: 111:   }
10938: 112:   changeSaleType(): void {
10939: 113:     this.salesPieData =
10940: 114:       this.salesType === 'all'
10941: 115:         ? this.data.salesTypeData
10942: 116:         : this.salesType === 'online'
10943: 117:           ? this.data.salesTypeDataOnline
10944: 118:           : this.data.salesTypeDataOffline;
10945: 119:     if (this.salesPieData) {
10946: 120:       this.salesTotal = this.salesPieData.reduce((pre: number, now: { y: number }) => now.y + pre, 0);
10947: 121:     }
10948: 122:     this.cdr.detectChanges();
10949: 123:   }
10950: 124: 
10951: 125:   handlePieValueFormat(value: string | number): string {
10952: 126:     return yuan(value);
10953: 127:   }
10954: 128:   offlineChange(idx: number): void {
10955: 129:     if (this.data.offlineData[idx].show !== true) {
10956: 130:       this.data.offlineData[idx].show = true;
10957: 131:       this.cdr.detectChanges();
10958: 132:     }
10959: 133:   }
10960: 134: }
10961: ````
10962: 
10963: ## File: src/app/routes/dashboard/monitor/monitor.component.ts
10964: ````typescript
10965:   1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
10966:   2: import { CountDownModule } from '@delon/abc/count-down';
10967:   3: import { G2GaugeModule } from '@delon/chart/gauge';
10968:   4: import { G2MiniAreaModule } from '@delon/chart/mini-area';
10969:   5: import { NumberInfoModule } from '@delon/chart/number-info';
10970:   6: import { G2PieModule } from '@delon/chart/pie';
10971:   7: import { G2TagCloudModule } from '@delon/chart/tag-cloud';
10972:   8: import { G2WaterWaveModule } from '@delon/chart/water-wave';
10973:   9: import { _HttpClient } from '@delon/theme';
10974:  10: import { SHARED_IMPORTS } from '@shared';
10975:  11: import type { CountdownConfig } from 'ngx-countdown';
10976:  12: import { zip } from 'rxjs';
10977:  13: 
10978:  14: @Component({
10979:  15:   selector: 'app-dashboard-monitor',
10980:  16:   templateUrl: './monitor.component.html',
10981:  17:   styleUrls: ['./monitor.component.less'],
10982:  18:   changeDetection: ChangeDetectionStrategy.OnPush,
10983:  19:   imports: [
10984:  20:     ...SHARED_IMPORTS,
10985:  21:     G2WaterWaveModule,
10986:  22:     G2TagCloudModule,
10987:  23:     G2PieModule,
10988:  24:     G2GaugeModule,
10989:  25:     G2MiniAreaModule,
10990:  26:     NumberInfoModule,
10991:  27:     CountDownModule
10992:  28:   ]
10993:  29: })
10994:  30: export class DashboardMonitorComponent implements OnInit, OnDestroy {
10995:  31:   private readonly http = inject(_HttpClient);
10996:  32:   private readonly cdr = inject(ChangeDetectorRef);
10997:  33: 
10998:  34:   data: any = {};
10999:  35:   tags = [];
11000:  36:   loading = true;
11001:  37:   q = {
11002:  38:     start: null,
11003:  39:     end: null
11004:  40:   };
11005:  41:   percent: number | null = null;
11006:  42:   cd: CountdownConfig = {
11007:  43:     format: `HH:mm:ss.S`,
11008:  44:     leftTime: 10000
11009:  45:   };
11010:  46: 
11011:  47:   // region: active chart
11012:  48: 
11013:  49:   activeTime$: any;
11014:  50: 
11015:  51:   activeData!: any[];
11016:  52: 
11017:  53:   activeStat = {
11018:  54:     max: 0,
11019:  55:     min: 0,
11020:  56:     t1: '',
11021:  57:     t2: ''
11022:  58:   };
11023:  59: 
11024:  60:   ngOnInit(): void {
11025:  61:     zip(this.http.get('/chart'), this.http.get('/chart/tags')).subscribe(([res, tags]: [any, any]) => {
11026:  62:       this.data = res;
11027:  63:       tags.list[Math.floor(Math.random() * tags.list.length) + 1].value = 1000;
11028:  64:       this.tags = tags.list;
11029:  65:       this.loading = false;
11030:  66:       this.cdr.detectChanges();
11031:  67:     });
11032:  68: 
11033:  69:     // active chart
11034:  70:     this.refData();
11035:  71:     this.activeTime$ = setInterval(() => this.refData(), 1000 * 2);
11036:  72:   }
11037:  73: 
11038:  74:   refData(): void {
11039:  75:     const activeData: any[] = [];
11040:  76:     for (let i = 0; i < 24; i += 1) {
11041:  77:       activeData.push({
11042:  78:         x: `${i.toString().padStart(2, '0')}:00`,
11043:  79:         y: i * 50 + Math.floor(Math.random() * 200)
11044:  80:       });
11045:  81:     }
11046:  82:     this.activeData = activeData;
11047:  83:     // stat
11048:  84:     this.activeStat.max = [...activeData].sort()[activeData.length - 1].y + 200;
11049:  85:     this.activeStat.min = [...activeData].sort()[Math.floor(activeData.length / 2)].y;
11050:  86:     this.activeStat.t1 = activeData[Math.floor(activeData.length / 2)].x;
11051:  87:     this.activeStat.t2 = activeData[activeData.length - 1].x;
11052:  88:     // percent
11053:  89:     this.percent = Math.floor(Math.random() * 100);
11054:  90:     this.cdr.detectChanges();
11055:  91:   }
11056:  92: 
11057:  93:   // endregion
11058:  94: 
11059:  95:   couponFormat(val: any): string {
11060:  96:     switch (parseInt(val, 10)) {
11061:  97:       case 20:
11062:  98:         return '差';
11063:  99:       case 40:
11064: 100:         return '中';
11065: 101:       case 60:
11066: 102:         return '良';
11067: 103:       case 80:
11068: 104:         return '优';
11069: 105:       default:
11070: 106:         return '';
11071: 107:     }
11072: 108:   }
11073: 109: 
11074: 110:   ngOnDestroy(): void {
11075: 111:     if (this.activeTime$) {
11076: 112:       clearInterval(this.activeTime$);
11077: 113:     }
11078: 114:   }
11079: 115: }
11080: ````
11081: 
11082: ## File: src/app/routes/dashboard/routes.ts
11083: ````typescript
11084:  1: import { Routes } from '@angular/router';
11085:  2: 
11086:  3: import { DashboardAnalysisComponent } from './analysis/analysis.component';
11087:  4: import { DashboardMonitorComponent } from './monitor/monitor.component';
11088:  5: import { DashboardV1Component } from './v1/v1.component';
11089:  6: import { DashboardWorkplaceComponent } from './workplace/workplace.component';
11090:  7: 
11091:  8: export const routes: Routes = [
11092:  9:   { path: '', redirectTo: 'v1', pathMatch: 'full' },
11093: 10:   { path: 'v1', component: DashboardV1Component },
11094: 11:   { path: 'analysis', component: DashboardAnalysisComponent },
11095: 12:   { path: 'monitor', component: DashboardMonitorComponent },
11096: 13:   { path: 'workplace', component: DashboardWorkplaceComponent }
11097: 14: ];
11098: ````
11099: 
11100: ## File: src/app/routes/dashboard/v1/v1.component.ts
11101: ````typescript
11102:   1: import { Platform } from '@angular/cdk/platform';
11103:   2: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, DOCUMENT } from '@angular/core';
11104:   3: import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
11105:   4: import type { Chart } from '@antv/g2';
11106:   5: import { OnboardingModule, OnboardingService } from '@delon/abc/onboarding';
11107:   6: import { QuickMenuModule } from '@delon/abc/quick-menu';
11108:   7: import { G2BarModule } from '@delon/chart/bar';
11109:   8: import { G2MiniBarModule } from '@delon/chart/mini-bar';
11110:   9: import { G2TimelineModule } from '@delon/chart/timeline';
11111:  10: import { _HttpClient } from '@delon/theme';
11112:  11: import { SHARED_IMPORTS } from '@shared';
11113:  12: import { timer } from 'rxjs';
11114:  13: 
11115:  14: @Component({
11116:  15:   selector: 'app-dashboard-v1',
11117:  16:   templateUrl: './v1.component.html',
11118:  17:   changeDetection: ChangeDetectionStrategy.OnPush,
11119:  18:   imports: [...SHARED_IMPORTS, G2TimelineModule, G2BarModule, G2MiniBarModule, QuickMenuModule, OnboardingModule]
11120:  19: })
11121:  20: export class DashboardV1Component implements OnInit {
11122:  21:   private readonly http = inject(_HttpClient);
11123:  22:   private readonly cdr = inject(ChangeDetectorRef);
11124:  23:   private readonly obSrv = inject(OnboardingService);
11125:  24:   private readonly platform = inject(Platform);
11126:  25:   private readonly doc = inject(DOCUMENT);
11127:  26:   todoData = [
11128:  27:     {
11129:  28:       completed: true,
11130:  29:       avatar: '1',
11131:  30:       name: '苏先生',
11132:  31:       content: `请告诉我，我应该说点什么好？`
11133:  32:     },
11134:  33:     {
11135:  34:       completed: false,
11136:  35:       avatar: '2',
11137:  36:       name: 'はなさき',
11138:  37:       content: `ハルカソラトキヘダツヒカリ`
11139:  38:     },
11140:  39:     {
11141:  40:       completed: false,
11142:  41:       avatar: '3',
11143:  42:       name: 'cipchk',
11144:  43:       content: `this world was never meant for one as beautiful as you.`
11145:  44:     },
11146:  45:     {
11147:  46:       completed: false,
11148:  47:       avatar: '4',
11149:  48:       name: 'Kent',
11150:  49:       content: `my heart is beating with hers`
11151:  50:     },
11152:  51:     {
11153:  52:       completed: false,
11154:  53:       avatar: '5',
11155:  54:       name: 'Are you',
11156:  55:       content: `They always said that I love beautiful girl than my friends`
11157:  56:     },
11158:  57:     {
11159:  58:       completed: false,
11160:  59:       avatar: '6',
11161:  60:       name: 'Forever',
11162:  61:       content: `Walking through green fields ，sunshine in my eyes.`
11163:  62:     }
11164:  63:   ];
11165:  64: 
11166:  65:   webSite!: any[];
11167:  66:   salesData!: any[];
11168:  67:   offlineChartData!: any[];
11169:  68: 
11170:  69:   constructor() {
11171:  70:     timer(1000)
11172:  71:       .pipe(takeUntilDestroyed())
11173:  72:       .subscribe(() => this.genOnboarding());
11174:  73:   }
11175:  74: 
11176:  75:   fixDark(chart: Chart): void {
11177:  76:     if (!this.platform.isBrowser || (this.doc.body as HTMLBodyElement).getAttribute('data-theme') !== 'dark') return;
11178:  77: 
11179:  78:     chart.theme({
11180:  79:       styleSheet: {
11181:  80:         backgroundColor: 'transparent'
11182:  81:       }
11183:  82:     });
11184:  83:   }
11185:  84: 
11186:  85:   ngOnInit(): void {
11187:  86:     this.http.get('/chart').subscribe(res => {
11188:  87:       this.webSite = res.visitData.slice(0, 10);
11189:  88:       this.salesData = res.salesData;
11190:  89:       this.offlineChartData = res.offlineChartData;
11191:  90:       this.cdr.detectChanges();
11192:  91:     });
11193:  92:   }
11194:  93: 
11195:  94:   private genOnboarding(): void {
11196:  95:     const KEY = 'on-boarding';
11197:  96:     if (!this.platform.isBrowser || localStorage.getItem(KEY) === '1') {
11198:  97:       return;
11199:  98:     }
11200:  99:     this.http.get(`./assets/tmp/on-boarding.json`).subscribe(res => {
11201: 100:       this.obSrv.start(res);
11202: 101:       localStorage.setItem(KEY, '1');
11203: 102:     });
11204: 103:   }
11205: 104: }
11206: ````
11207: 
11208: ## File: src/app/routes/dashboard/workplace/workplace.component.ts
11209: ````typescript
11210:   1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
11211:   2: import { G2RadarModule } from '@delon/chart/radar';
11212:   3: import { _HttpClient } from '@delon/theme';
11213:   4: import { SHARED_IMPORTS } from '@shared';
11214:   5: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
11215:   6: import { NzMessageService } from 'ng-zorro-antd/message';
11216:   7: import { zip } from 'rxjs';
11217:   8: 
11218:   9: @Component({
11219:  10:   selector: 'app-dashboard-workplace',
11220:  11:   templateUrl: './workplace.component.html',
11221:  12:   styleUrls: ['./workplace.component.less'],
11222:  13:   changeDetection: ChangeDetectionStrategy.OnPush,
11223:  14:   imports: [...SHARED_IMPORTS, NzAvatarModule, G2RadarModule]
11224:  15: })
11225:  16: export class DashboardWorkplaceComponent implements OnInit {
11226:  17:   private readonly http = inject(_HttpClient);
11227:  18:   readonly msg = inject(NzMessageService);
11228:  19:   private readonly cdr = inject(ChangeDetectorRef);
11229:  20: 
11230:  21:   notice: any[] = [];
11231:  22:   activities: any[] = [];
11232:  23:   radarData!: any[];
11233:  24:   loading = true;
11234:  25: 
11235:  26:   links = [
11236:  27:     {
11237:  28:       title: '操作一',
11238:  29:       href: ''
11239:  30:     },
11240:  31:     {
11241:  32:       title: '操作二',
11242:  33:       href: ''
11243:  34:     },
11244:  35:     {
11245:  36:       title: '操作三',
11246:  37:       href: ''
11247:  38:     },
11248:  39:     {
11249:  40:       title: '操作四',
11250:  41:       href: ''
11251:  42:     },
11252:  43:     {
11253:  44:       title: '操作五',
11254:  45:       href: ''
11255:  46:     },
11256:  47:     {
11257:  48:       title: '操作六',
11258:  49:       href: ''
11259:  50:     }
11260:  51:   ];
11261:  52:   members = [
11262:  53:     {
11263:  54:       id: 'members-1',
11264:  55:       title: '科学搬砖组',
11265:  56:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
11266:  57:       link: ''
11267:  58:     },
11268:  59:     {
11269:  60:       id: 'members-2',
11270:  61:       title: '程序员日常',
11271:  62:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
11272:  63:       link: ''
11273:  64:     },
11274:  65:     {
11275:  66:       id: 'members-3',
11276:  67:       title: '设计天团',
11277:  68:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
11278:  69:       link: ''
11279:  70:     },
11280:  71:     {
11281:  72:       id: 'members-4',
11282:  73:       title: '中二少女团',
11283:  74:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
11284:  75:       link: ''
11285:  76:     },
11286:  77:     {
11287:  78:       id: 'members-5',
11288:  79:       title: '骗你学计算机',
11289:  80:       logo: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
11290:  81:       link: ''
11291:  82:     }
11292:  83:   ];
11293:  84: 
11294:  85:   ngOnInit(): void {
11295:  86:     zip(this.http.get('/chart'), this.http.get('/api/notice'), this.http.get('/api/activities')).subscribe(
11296:  87:       ([chart, notice, activities]: [any, any, any]) => {
11297:  88:         this.radarData = chart.radarData;
11298:  89:         this.notice = notice;
11299:  90:         this.activities = activities.map((item: any) => {
11300:  91:           item.template = item.template.split(/@\{([^{}]*)\}/gi).map((key: string) => {
11301:  92:             if (item[key]) {
11302:  93:               return `<a>${item[key].name}</a>`;
11303:  94:             }
11304:  95:             return key;
11305:  96:           });
11306:  97:           return item;
11307:  98:         });
11308:  99:         this.loading = false;
11309: 100:         this.cdr.detectChanges();
11310: 101:       }
11311: 102:     );
11312: 103:   }
11313: 104: }
11314: ````
11315: 
11316: ## File: src/app/routes/data-v/relation/relation.component.ts
11317: ````typescript
11318: 1: import { Component } from '@angular/core';
11319: 2: import { SHARED_IMPORTS } from '@shared';
11320: 3: 
11321: 4: @Component({
11322: 5:   selector: 'app-data-v-relation',
11323: 6:   templateUrl: './relation.component.html',
11324: 7:   imports: SHARED_IMPORTS
11325: 8: })
11326: 9: export class RelationComponent {}
11327: ````
11328: 
11329: ## File: src/app/routes/data-v/routes.ts
11330: ````typescript
11331: 1: import { Routes } from '@angular/router';
11332: 2: 
11333: 3: import { RelationComponent } from './relation/relation.component';
11334: 4: 
11335: 5: export const routes: Routes = [{ path: 'relation', component: RelationComponent }];
11336: ````
11337: 
11338: ## File: src/app/routes/delon/acl/acl.component.ts
11339: ````typescript
11340:  1: import { Component, inject } from '@angular/core';
11341:  2: import { ACLService } from '@delon/acl';
11342:  3: import { MenuService } from '@delon/theme';
11343:  4: import { SHARED_IMPORTS } from '@shared';
11344:  5: 
11345:  6: @Component({
11346:  7:   selector: 'app-acl',
11347:  8:   templateUrl: './acl.component.html',
11348:  9:   imports: SHARED_IMPORTS
11349: 10: })
11350: 11: export class ACLComponent {
11351: 12:   private readonly aclSrv = inject(ACLService);
11352: 13:   private readonly menuSrv = inject(MenuService);
11353: 14: 
11354: 15:   full = true;
11355: 16:   roleA = '';
11356: 17:   roleB = '';
11357: 18: 
11358: 19:   get data(): {
11359: 20:     full: boolean;
11360: 21:     roles: string[];
11361: 22:     abilities: Array<string | number>;
11362: 23:   } {
11363: 24:     return this.aclSrv.data;
11364: 25:   }
11365: 26: 
11366: 27:   private reMenu(): void {
11367: 28:     this.menuSrv.resume();
11368: 29:   }
11369: 30: 
11370: 31:   toggleFull(): void {
11371: 32:     this.full = !this.full;
11372: 33:     this.aclSrv.setFull(this.full);
11373: 34:     this.reMenu();
11374: 35:   }
11375: 36: 
11376: 37:   toggleRoleA(): void {
11377: 38:     this.full = false;
11378: 39:     this.roleA = this.roleA === 'role-a' ? '' : 'role-a';
11379: 40:     this.aclSrv.setFull(this.full);
11380: 41:     this.aclSrv.setRole([this.roleA]);
11381: 42:     this.reMenu();
11382: 43:   }
11383: 44: 
11384: 45:   toggleRoleB(): void {
11385: 46:     this.full = false;
11386: 47:     this.roleB = this.roleB === 'role-b' ? '' : 'role-b';
11387: 48:     this.aclSrv.setFull(this.full);
11388: 49:     this.aclSrv.setRole([this.roleB]);
11389: 50:     this.reMenu();
11390: 51:   }
11391: 52: }
11392: ````
11393: 
11394: ## File: src/app/routes/delon/cache/cache.component.ts
11395: ````typescript
11396:  1: import { Component, inject } from '@angular/core';
11397:  2: import { CacheService } from '@delon/cache';
11398:  3: import { SHARED_IMPORTS } from '@shared';
11399:  4: import { NzMessageService } from 'ng-zorro-antd/message';
11400:  5: 
11401:  6: @Component({
11402:  7:   selector: 'app-cache',
11403:  8:   templateUrl: './cache.component.html',
11404:  9:   imports: SHARED_IMPORTS
11405: 10: })
11406: 11: export class CacheComponent {
11407: 12:   private readonly cache = inject(CacheService);
11408: 13:   private readonly msg = inject(NzMessageService);
11409: 14: 
11410: 15:   KEY = 'user';
11411: 16: 
11412: 17:   set(): void {
11413: 18:     this.cache.set(this.KEY, +new Date());
11414: 19:   }
11415: 20: 
11416: 21:   get(): void {
11417: 22:     this.msg.success(this.cache.getNone(this.KEY));
11418: 23:   }
11419: 24: }
11420: ````
11421: 
11422: ## File: src/app/routes/delon/downfile/downfile.component.ts
11423: ````typescript
11424:  1: import { Component } from '@angular/core';
11425:  2: import { DownFileDirective } from '@delon/abc/down-file';
11426:  3: import { SHARED_IMPORTS } from '@shared';
11427:  4: 
11428:  5: @Component({
11429:  6:   selector: 'app-down-file',
11430:  7:   templateUrl: './downfile.component.html',
11431:  8:   imports: [...SHARED_IMPORTS, DownFileDirective]
11432:  9: })
11433: 10: export class DownFileComponent {
11434: 11:   fileTypes = ['.xlsx', '.docx', '.pptx', '.pdf'];
11435: 12: 
11436: 13:   data = {
11437: 14:     otherdata: 1,
11438: 15:     time: new Date()
11439: 16:   };
11440: 17: }
11441: ````
11442: 
11443: ## File: src/app/routes/delon/form/form.component.ts
11444: ````typescript
11445:  1: import { Component } from '@angular/core';
11446:  2: import { STColumn } from '@delon/abc/st';
11447:  3: import { SFSchema } from '@delon/form';
11448:  4: import { SHARED_IMPORTS } from '@shared';
11449:  5: 
11450:  6: @Component({
11451:  7:   selector: 'app-delon-form',
11452:  8:   templateUrl: './form.component.html',
11453:  9:   imports: SHARED_IMPORTS
11454: 10: })
11455: 11: export class DelonFormComponent {
11456: 12:   params: any = {};
11457: 13:   url = `/user`;
11458: 14:   searchSchema: SFSchema = {
11459: 15:     properties: {
11460: 16:       no: {
11461: 17:         type: 'string',
11462: 18:         title: '编号'
11463: 19:       }
11464: 20:     }
11465: 21:   };
11466: 22:   columns: STColumn[] = [
11467: 23:     { title: '编号', index: 'no' },
11468: 24:     { title: '调用次数', type: 'number', index: 'callNo' },
11469: 25:     { title: '头像', type: 'img', width: '50px', index: 'avatar' },
11470: 26:     { title: '时间', type: 'date', index: 'updatedAt' }
11471: 27:   ];
11472: 28: }
11473: ````
11474: 
11475: ## File: src/app/routes/delon/guard/admin.component.ts
11476: ````typescript
11477: 1: import { Component } from '@angular/core';
11478: 2: 
11479: 3: @Component({
11480: 4:   selector: 'app-guard-admin',
11481: 5:   template: ` <p>这是一个admin页面</p> `
11482: 6: })
11483: 7: export class GuardAdminComponent {}
11484: ````
11485: 
11486: ## File: src/app/routes/delon/guard/auth.component.ts
11487: ````typescript
11488: 1: import { Component } from '@angular/core';
11489: 2: 
11490: 3: @Component({
11491: 4:   selector: 'app-guard-auth',
11492: 5:   template: ` <p>这是一个user1页面</p> `
11493: 6: })
11494: 7: export class GuardAuthComponent {}
11495: ````
11496: 
11497: ## File: src/app/routes/delon/guard/can-leave.ts
11498: ````typescript
11499:  1: import { inject } from '@angular/core';
11500:  2: import { CanDeactivateFn } from '@angular/router';
11501:  3: import { NzModalService } from 'ng-zorro-antd/modal';
11502:  4: import { Observable } from 'rxjs';
11503:  5: 
11504:  6: import { GuardComponent } from './guard.component';
11505:  7: 
11506:  8: export const canLeave: CanDeactivateFn<GuardComponent> = (): Observable<boolean> => {
11507:  9:   const srv = inject(NzModalService);
11508: 10:   return new Observable(observer => {
11509: 11:     srv.confirm({
11510: 12:       nzTitle: '确认要离开吗？',
11511: 13:       nzContent: '你已经填写了部分表单离开会放弃已经填写的内容。',
11512: 14:       nzOkText: '离开',
11513: 15:       nzCancelText: '取消',
11514: 16:       nzOnOk: () => {
11515: 17:         observer.next(true);
11516: 18:         observer.complete();
11517: 19:       },
11518: 20:       nzOnCancel: () => {
11519: 21:         observer.next(false);
11520: 22:         observer.complete();
11521: 23:       }
11522: 24:     });
11523: 25:   });
11524: 26: };
11525: ````
11526: 
11527: ## File: src/app/routes/delon/guard/guard.component.ts
11528: ````typescript
11529:  1: import { Component, inject } from '@angular/core';
11530:  2: import { Router } from '@angular/router';
11531:  3: import { ACLService } from '@delon/acl';
11532:  4: import { MenuService } from '@delon/theme';
11533:  5: import { SHARED_IMPORTS } from '@shared';
11534:  6: 
11535:  7: @Component({
11536:  8:   selector: 'app-guard',
11537:  9:   templateUrl: './guard.component.html',
11538: 10:   imports: SHARED_IMPORTS
11539: 11: })
11540: 12: export class GuardComponent {
11541: 13:   private readonly aclSrv = inject(ACLService);
11542: 14:   private readonly menuSrv = inject(MenuService);
11543: 15:   private readonly router = inject(Router);
11544: 16: 
11545: 17:   get data(): any {
11546: 18:     return this.aclSrv.data;
11547: 19:   }
11548: 20: 
11549: 21:   setRole(value: string | boolean): void {
11550: 22:     this.aclSrv.setFull(false);
11551: 23:     if (typeof value === 'boolean') {
11552: 24:       this.aclSrv.setFull(value);
11553: 25:     } else {
11554: 26:       this.aclSrv.set({ role: [value as string] });
11555: 27:     }
11556: 28:     this.menuSrv.resume();
11557: 29:     this.router.navigate(['/delon/guard']);
11558: 30:   }
11559: 31: }
11560: ````
11561: 
11562: ## File: src/app/routes/delon/guard/leave.component.ts
11563: ````typescript
11564:  1: import { Component } from '@angular/core';
11565:  2: import { SHARED_IMPORTS } from '@shared';
11566:  3: 
11567:  4: @Component({
11568:  5:   selector: 'app-guard-leave',
11569:  6:   template: `
11570:  7:     <p>离开时需要确认</p>
11571:  8:     <button nz-button [nzType]="'primary'" [routerLink]="['/delon/guard']">
11572:  9:       <span>我要离开</span>
11573: 10:     </button>
11574: 11:   `,
11575: 12:   imports: SHARED_IMPORTS
11576: 13: })
11577: 14: export class GuardLeaveComponent {}
11578: ````
11579: 
11580: ## File: src/app/routes/delon/print/print.component.ts
11581: ````typescript
11582:  1: import { Component, inject } from '@angular/core';
11583:  2: import { Lodop, LodopService } from '@delon/abc/lodop';
11584:  3: import { SHARED_IMPORTS } from '@shared';
11585:  4: import { NzMessageService } from 'ng-zorro-antd/message';
11586:  5: 
11587:  6: @Component({
11588:  7:   selector: 'app-print',
11589:  8:   templateUrl: './print.component.html',
11590:  9:   imports: SHARED_IMPORTS
11591: 10: })
11592: 11: export class PrintComponent {
11593: 12:   private readonly lodopSrv = inject(LodopService);
11594: 13:   private readonly msg = inject(NzMessageService);
11595: 14: 
11596: 15:   constructor() {
11597: 16:     this.lodopSrv.lodop.subscribe(({ lodop, ok }) => {
11598: 17:       if (!ok) {
11599: 18:         this.error = true;
11600: 19:         return;
11601: 20:       }
11602: 21:       this.error = false;
11603: 22:       this.msg.success(`打印机加载成功`);
11604: 23:       this.lodop = lodop as Lodop;
11605: 24:       this.pinters = this.lodopSrv.printer;
11606: 25:     });
11607: 26:   }
11608: 27: 
11609: 28:   cog: any = {
11610: 29:     url: 'https://localhost:8443/CLodopfuncs.js',
11611: 30:     printer: '',
11612: 31:     paper: '',
11613: 32:     html: `
11614: 33:       <h1>Title</h1>
11615: 34:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
11616: 35:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
11617: 36:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
11618: 37:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
11619: 38:       <p>这~！@#￥%……&*（）——sdilfjnvn</p>
11620: 39:     `
11621: 40:   };
11622: 41:   error = false;
11623: 42:   lodop: Lodop | null = null;
11624: 43:   pinters: any[] = [];
11625: 44:   papers: string[] = [];
11626: 45: 
11627: 46:   printing = false;
11628: 47: 
11629: 48:   reload(options: { url: string } | null = { url: 'https://localhost:8443/CLodopfuncs.js' }): void {
11630: 49:     this.pinters = [];
11631: 50:     this.papers = [];
11632: 51:     this.cog.printer = '';
11633: 52:     this.cog.paper = '';
11634: 53: 
11635: 54:     this.lodopSrv.cog = { ...this.cog, ...options };
11636: 55:     this.error = false;
11637: 56:     if (options === null) {
11638: 57:       this.lodopSrv.reset();
11639: 58:     }
11640: 59:   }
11641: 60: 
11642: 61:   changePinter(name: string): void {
11643: 62:     if (this.lodop == null) {
11644: 63:       return;
11645: 64:     }
11646: 65:     this.papers = this.lodop.GET_PAGESIZES_LIST(name, '\n').split('\n');
11647: 66:   }
11648: 67:   print(isPrivew = false): void {
11649: 68:     const LODOP = this.lodop as Lodop;
11650: 69:     LODOP.PRINT_INITA(10, 20, 810, 610, '测试C-Lodop远程打印四步骤');
11651: 70:     LODOP.SET_PRINTER_INDEXA(this.cog.printer);
11652: 71:     LODOP.SET_PRINT_PAGESIZE(0, 0, 0, this.cog.paper);
11653: 72:     LODOP.ADD_PRINT_TEXT(1, 1, 300, 200, '下面输出的是本页源代码及其展现效果：');
11654: 73:     LODOP.ADD_PRINT_TEXT(20, 10, '90%', '95%', this.cog.html);
11655: 74:     LODOP.SET_PRINT_STYLEA(0, 'ItemType', 4);
11656: 75:     LODOP.NEWPAGEA();
11657: 76:     LODOP.ADD_PRINT_HTM(20, 10, '90%', '95%', this.cog.html);
11658: 77:     if (isPrivew) {
11659: 78:       LODOP.PREVIEW();
11660: 79:     } else {
11661: 80:       LODOP.PRINT();
11662: 81:     }
11663: 82:   }
11664: 83: }
11665: ````
11666: 
11667: ## File: src/app/routes/delon/qr/qr.component.ts
11668: ````typescript
11669:  1: import { Component } from '@angular/core';
11670:  2: import { SHARED_IMPORTS } from '@shared';
11671:  3: import { NzQRCodeComponent } from 'ng-zorro-antd/qr-code';
11672:  4: 
11673:  5: @Component({
11674:  6:   selector: 'app-qr',
11675:  7:   templateUrl: './qr.component.html',
11676:  8:   imports: [...SHARED_IMPORTS, NzQRCodeComponent]
11677:  9: })
11678: 10: export class QRComponent {
11679: 11:   value = 'https://ng-alain.com/';
11680: 12:   background = '#ffffff';
11681: 13:   foreground = '#000000';
11682: 14:   level: 'L' | 'M' | 'Q' | 'H' = 'L';
11683: 15:   mime = 'image/png';
11684: 16:   padding = 10;
11685: 17:   size = 220;
11686: 18: }
11687: ````
11688: 
11689: ## File: src/app/routes/delon/routes.ts
11690: ````typescript
11691:  1: import { Routes } from '@angular/router';
11692:  2: import { aclCanActivate } from '@delon/acl';
11693:  3: 
11694:  4: import { ACLComponent } from './acl/acl.component';
11695:  5: import { CacheComponent } from './cache/cache.component';
11696:  6: import { DownFileComponent } from './downfile/downfile.component';
11697:  7: import { DelonFormComponent } from './form/form.component';
11698:  8: import { GuardAdminComponent } from './guard/admin.component';
11699:  9: import { GuardAuthComponent } from './guard/auth.component';
11700: 10: import { canLeave } from './guard/can-leave';
11701: 11: import { GuardComponent } from './guard/guard.component';
11702: 12: import { GuardLeaveComponent } from './guard/leave.component';
11703: 13: import { PrintComponent } from './print/print.component';
11704: 14: import { QRComponent } from './qr/qr.component';
11705: 15: import { STDemoComponent } from './st/st.component';
11706: 16: import { UtilComponent } from './util/util.component';
11707: 17: import { XlsxComponent } from './xlsx/xlsx.component';
11708: 18: import { ZipComponent } from './zip/zip.component';
11709: 19: 
11710: 20: export const routes: Routes = [
11711: 21:   { path: 'st', component: STDemoComponent },
11712: 22:   { path: 'util', component: UtilComponent },
11713: 23:   { path: 'print', component: PrintComponent },
11714: 24:   { path: 'acl', component: ACLComponent },
11715: 25:   {
11716: 26:     path: 'guard',
11717: 27:     component: GuardComponent,
11718: 28:     children: [
11719: 29:       {
11720: 30:         path: 'leave',
11721: 31:         component: GuardLeaveComponent,
11722: 32:         canDeactivate: [canLeave]
11723: 33:       },
11724: 34:       {
11725: 35:         path: 'auth',
11726: 36:         component: GuardAuthComponent,
11727: 37:         canActivate: [aclCanActivate],
11728: 38:         data: { guard: 'user1' }
11729: 39:       },
11730: 40:       {
11731: 41:         path: 'admin',
11732: 42:         component: GuardAdminComponent,
11733: 43:         canActivate: [aclCanActivate],
11734: 44:         data: { guard: 'admin' }
11735: 45:       }
11736: 46:     ]
11737: 47:   },
11738: 48:   { path: 'cache', component: CacheComponent },
11739: 49:   { path: 'qr', component: QRComponent },
11740: 50:   { path: 'downfile', component: DownFileComponent },
11741: 51:   { path: 'xlsx', component: XlsxComponent },
11742: 52:   { path: 'zip', component: ZipComponent },
11743: 53:   { path: 'form', component: DelonFormComponent }
11744: 54: ];
11745: ````
11746: 
11747: ## File: src/app/routes/delon/st/st.component.ts
11748: ````typescript
11749:  1: import { Component, OnInit, inject } from '@angular/core';
11750:  2: import { FullContentModule } from '@delon/abc/full-content';
11751:  3: import { STColumn } from '@delon/abc/st';
11752:  4: import { G2MiniBarComponent, G2MiniBarData } from '@delon/chart/mini-bar';
11753:  5: import { _HttpClient } from '@delon/theme';
11754:  6: import { SHARED_IMPORTS } from '@shared';
11755:  7: import { NzMessageService } from 'ng-zorro-antd/message';
11756:  8: 
11757:  9: @Component({
11758: 10:   selector: 'app-st',
11759: 11:   templateUrl: './st.component.html',
11760: 12:   imports: [...SHARED_IMPORTS, FullContentModule, G2MiniBarComponent]
11761: 13: })
11762: 14: export class STDemoComponent implements OnInit {
11763: 15:   readonly http = inject(_HttpClient);
11764: 16:   private readonly message = inject(NzMessageService);
11765: 17: 
11766: 18:   ps = 20;
11767: 19:   total = 200; // mock total
11768: 20:   args = { _allow_anonymous: true, userid: null };
11769: 21:   url = `https://api.randomuser.me/?results=20`;
11770: 22:   events: G2MiniBarData[] = [];
11771: 23:   scroll = { y: '230px' };
11772: 24:   columns: STColumn[] = [
11773: 25:     { title: 'id', index: 'id.value', type: 'checkbox' },
11774: 26:     { title: 'Avatar', index: 'picture.thumbnail', type: 'img', width: 80 },
11775: 27:     {
11776: 28:       title: 'Name',
11777: 29:       index: 'name.first',
11778: 30:       width: 150,
11779: 31:       format: item => `${item.name.first} ${item.name.last}`,
11780: 32:       type: 'link',
11781: 33:       click: item => this.message.info(`${item.name.first}`)
11782: 34:     },
11783: 35:     { title: 'Email', index: 'email' },
11784: 36:     {
11785: 37:       title: 'Gender',
11786: 38:       index: 'gender',
11787: 39:       type: 'yn',
11788: 40:       yn: {
11789: 41:         truth: 'female',
11790: 42:         yes: '男',
11791: 43:         no: '女',
11792: 44:         mode: 'text'
11793: 45:       },
11794: 46:       width: 120
11795: 47:     },
11796: 48:     { title: 'Events', render: 'events', width: 90 },
11797: 49:     { title: 'Registered', index: 'registered.date', type: 'date', width: 170 },
11798: 50:     {
11799: 51:       title: 'Actions',
11800: 52:       width: 120,
11801: 53:       buttons: [
11802: 54:         {
11803: 55:           text: 'Edit',
11804: 56:           click: item => this.message.info(`edit [${item.id.value}]`),
11805: 57:           iif: item => item.gender === 'female'
11806: 58:         },
11807: 59:         {
11808: 60:           text: 'Delete',
11809: 61:           type: 'del',
11810: 62:           click: item => this.message.info(`deleted [${item.id.value}]`)
11811: 63:         }
11812: 64:       ]
11813: 65:     }
11814: 66:   ];
11815: 67: 
11816: 68:   ngOnInit(): void {
11817: 69:     this.http.get('/chart/visit').subscribe((res: G2MiniBarData[]) => (this.events = res.slice(0, 8)));
11818: 70:   }
11819: 71: 
11820: 72:   fullChange(val?: boolean): void {
11821: 73:     this.scroll = val ? { y: '350px' } : { y: '230px' };
11822: 74:   }
11823: 75: }
11824: ````
11825: 
11826: ## File: src/app/routes/delon/util/util.component.ts
11827: ````typescript
11828:  1: import { Component, inject } from '@angular/core';
11829:  2: import { copy } from '@delon/util/browser';
11830:  3: import { format } from '@delon/util/format';
11831:  4: import { SHARED_IMPORTS, yuan } from '@shared';
11832:  5: import { NzMessageService } from 'ng-zorro-antd/message';
11833:  6: 
11834:  7: @Component({
11835:  8:   selector: 'app-util',
11836:  9:   templateUrl: './util.component.html',
11837: 10:   imports: SHARED_IMPORTS
11838: 11: })
11839: 12: export class UtilComponent {
11840: 13:   readonly messageSrv = inject(NzMessageService);
11841: 14: 
11842: 15:   format_str = 'this is ${name}';
11843: 16:   format_res = '';
11844: 17:   format_obj = JSON.stringify({ name: 'asdf' });
11845: 18: 
11846: 19:   // yuan
11847: 20:   yuan_str: any;
11848: 21:   yuan_res!: string;
11849: 22: 
11850: 23:   content = `time ${+new Date()}
11851: 24: 
11852: 25:     中文！@#￥%……&*`;
11853: 26:   onFormat(): void {
11854: 27:     let obj = null;
11855: 28:     try {
11856: 29:       obj = JSON.parse(this.format_obj);
11857: 30:     } catch {
11858: 31:       this.messageSrv.error(`无法使用 JSON.parse 转换`);
11859: 32:       return;
11860: 33:     }
11861: 34:     this.format_res = format(this.format_str, obj, true);
11862: 35:   }
11863: 36:   onYuan(value: string): void {
11864: 37:     this.yuan_res = yuan(value);
11865: 38:   }
11866: 39:   onCopy(): void {
11867: 40:     copy(`time ${+new Date()}`).then(() => this.messageSrv.success(`success`));
11868: 41:   }
11869: 42: }
11870: ````
11871: 
11872: ## File: src/app/routes/delon/xlsx/xlsx.component.ts
11873: ````typescript
11874:  1: import { Component, inject } from '@angular/core';
11875:  2: import { STColumn } from '@delon/abc/st';
11876:  3: import { XlsxService } from '@delon/abc/xlsx';
11877:  4: import { SHARED_IMPORTS } from '@shared';
11878:  5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
11879:  6: 
11880:  7: @Component({
11881:  8:   selector: 'app-xlsx',
11882:  9:   templateUrl: './xlsx.component.html',
11883: 10:   imports: SHARED_IMPORTS
11884: 11: })
11885: 12: export class XlsxComponent {
11886: 13:   private readonly xlsx = inject(XlsxService);
11887: 14: 
11888: 15:   data: any;
11889: 16:   users: Array<{ id: number; name: string; age: number }> = Array(100)
11890: 17:     .fill(0)
11891: 18:     .map((_item: number, idx: number) => {
11892: 19:       return {
11893: 20:         id: idx + 1,
11894: 21:         name: `name ${idx + 1}`,
11895: 22:         age: Math.ceil(Math.random() * 10) + 20
11896: 23:       };
11897: 24:     });
11898: 25: 
11899: 26:   columns: STColumn[] = [
11900: 27:     { title: '编号', index: 'id', type: 'checkbox' },
11901: 28:     { title: '姓名', index: 'name' },
11902: 29:     { title: '年龄', index: 'age' }
11903: 30:   ];
11904: 31: 
11905: 32:   url(): void {
11906: 33:     this.xlsx.import(`./assets/tmp/demo.xlsx`).then(res => (this.data = res));
11907: 34:   }
11908: 35: 
11909: 36:   change(e: Event): void {
11910: 37:     const file = (e.target as HTMLInputElement).files![0];
11911: 38:     this.xlsx.import(file).then(res => (this.data = res));
11912: 39:   }
11913: 40: 
11914: 41:   download(): void {
11915: 42:     const data = [this.columns.map(i => i.title)];
11916: 43:     this.users.forEach((i: Record<string, NzSafeAny>) => data.push(this.columns.map(c => i[c.index as string])));
11917: 44:     this.xlsx.export({
11918: 45:       sheets: [
11919: 46:         {
11920: 47:           data,
11921: 48:           name: 'sheet name'
11922: 49:         }
11923: 50:       ]
11924: 51:     });
11925: 52:   }
11926: 53: }
11927: ````
11928: 
11929: ## File: src/app/routes/delon/zip/zip.component.ts
11930: ````typescript
11931:  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
11932:  2: import { ZipService } from '@delon/abc/zip';
11933:  3: import { SHARED_IMPORTS } from '@shared';
11934:  4: import type jsZipType from 'jszip';
11935:  5: import { NzMessageService } from 'ng-zorro-antd/message';
11936:  6: 
11937:  7: @Component({
11938:  8:   selector: 'app-zip',
11939:  9:   templateUrl: './zip.component.html',
11940: 10:   changeDetection: ChangeDetectionStrategy.OnPush,
11941: 11:   imports: SHARED_IMPORTS
11942: 12: })
11943: 13: export class ZipComponent implements OnInit {
11944: 14:   private readonly zip = inject(ZipService);
11945: 15:   private readonly msg = inject(NzMessageService);
11946: 16:   private readonly cdr = inject(ChangeDetectorRef);
11947: 17: 
11948: 18:   list: any;
11949: 19:   instance: jsZipType | null = null;
11950: 20:   data: Array<{ path?: string; url?: string }> = [
11951: 21:     { path: 'demo.docx', url: 'https://ng-alain.com/assets/demo.docx' },
11952: 22:     {
11953: 23:       path: '小程序标志.zip',
11954: 24:       url: 'https://wximg.gtimg.com/shake_tv/mina/standard_logo.zip'
11955: 25:     }
11956: 26:   ];
11957: 27: 
11958: 28:   ngOnInit(): void {
11959: 29:     this.zip.create().then(ret => {
11960: 30:       this.instance = ret;
11961: 31:       this.cdr.detectChanges();
11962: 32:     });
11963: 33:   }
11964: 34: 
11965: 35:   private format(data: any): void {
11966: 36:     const files = data.files;
11967: 37:     this.list = Object.keys(files).map(key => {
11968: 38:       return {
11969: 39:         name: key,
11970: 40:         dir: files[key].dir,
11971: 41:         date: files[key].date
11972: 42:       };
11973: 43:     });
11974: 44:     this.cdr.detectChanges();
11975: 45:   }
11976: 46: 
11977: 47:   url(): void {
11978: 48:     this.zip.read(`./assets/tmp/demo.zip`).then(res => this.format(res));
11979: 49:   }
11980: 50: 
11981: 51:   change(e: Event): void {
11982: 52:     const file = (e.target as HTMLInputElement).files![0];
11983: 53:     this.zip.read(file).then(res => this.format(res));
11984: 54:   }
11985: 55: 
11986: 56:   download(): void {
11987: 57:     const promises: Array<Promise<void>> = [];
11988: 58:     this.data.forEach(item => {
11989: 59:       promises.push(this.zip.pushUrl(this.instance, item.path!, item.url!));
11990: 60:     });
11991: 61:     Promise.all(promises).then(
11992: 62:       () => {
11993: 63:         this.zip.save(this.instance).then(() => {
11994: 64:           this.msg.success('download success');
11995: 65:           this.data = [];
11996: 66:         });
11997: 67:       },
11998: 68:       (error: unknown) => {
11999: 69:         console.warn(error);
12000: 70:         this.msg.error(JSON.stringify(error));
12001: 71:       }
12002: 72:     );
12003: 73:   }
12004: 74: }
12005: ````
12006: 
12007: ## File: src/app/routes/exception/exception.component.ts
12008: ````typescript
12009:  1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
12010:  2: import { ActivatedRoute } from '@angular/router';
12011:  3: import { ExceptionModule, ExceptionType } from '@delon/abc/exception';
12012:  4: 
12013:  5: @Component({
12014:  6:   selector: 'app-exception',
12015:  7:   template: ` <exception [type]="type" style="min-height: 500px; height: 80%;" />`,
12016:  8:   changeDetection: ChangeDetectionStrategy.OnPush,
12017:  9:   imports: [ExceptionModule]
12018: 10: })
12019: 11: export class ExceptionComponent {
12020: 12:   private readonly route = inject(ActivatedRoute);
12021: 13:   get type(): ExceptionType {
12022: 14:     return this.route.snapshot.data['type'];
12023: 15:   }
12024: 16: }
12025: ````
12026: 
12027: ## File: src/app/routes/exception/routes.ts
12028: ````typescript
12029:  1: import { Routes } from '@angular/router';
12030:  2: 
12031:  3: import { ExceptionComponent } from './exception.component';
12032:  4: import { ExceptionTriggerComponent } from './trigger.component';
12033:  5: 
12034:  6: export const routes: Routes = [
12035:  7:   { path: '403', component: ExceptionComponent, data: { type: 403 } },
12036:  8:   { path: '404', component: ExceptionComponent, data: { type: 404 } },
12037:  9:   { path: '500', component: ExceptionComponent, data: { type: 500 } },
12038: 10:   { path: 'trigger', component: ExceptionTriggerComponent }
12039: 11: ];
12040: ````
12041: 
12042: ## File: src/app/routes/exception/trigger.component.ts
12043: ````typescript
12044:  1: import { Component, inject } from '@angular/core';
12045:  2: import { DA_SERVICE_TOKEN } from '@delon/auth';
12046:  3: import { _HttpClient } from '@delon/theme';
12047:  4: import { NzButtonModule } from 'ng-zorro-antd/button';
12048:  5: import { NzCardModule } from 'ng-zorro-antd/card';
12049:  6: 
12050:  7: @Component({
12051:  8:   selector: 'exception-trigger',
12052:  9:   template: `
12053: 10:     <div class="pt-lg">
12054: 11:       <nz-card>
12055: 12:         @for (t of types; track $index) {
12056: 13:           <button (click)="go(t)" nz-button nzDanger>触发{{ t }}</button>
12057: 14:         }
12058: 15:         <button nz-button nzType="link" (click)="refresh()">触发刷新Token</button>
12059: 16:       </nz-card>
12060: 17:     </div>
12061: 18:   `,
12062: 19:   imports: [NzCardModule, NzButtonModule]
12063: 20: })
12064: 21: export class ExceptionTriggerComponent {
12065: 22:   private readonly http = inject(_HttpClient);
12066: 23:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
12067: 24: 
12068: 25:   types = [401, 403, 404, 500];
12069: 26: 
12070: 27:   go(type: number): void {
12071: 28:     this.http.get(`/api/${type}`).subscribe();
12072: 29:   }
12073: 30: 
12074: 31:   refresh(): void {
12075: 32:     this.tokenService.set({ token: 'invalid-token' });
12076: 33:     // 必须提供一个后端地址，无法通过 Mock 来模拟
12077: 34:     this.http.post(`https://localhost:5001/auth`).subscribe({
12078: 35:       next: res => console.warn('成功', res),
12079: 36:       error: err => {
12080: 37:         console.log('最后结果失败', err);
12081: 38:       }
12082: 39:     });
12083: 40:   }
12084: 41: }
12085: ````
12086: 
12087: ## File: src/app/routes/extras/helpcenter/helpcenter.component.ts
12088: ````typescript
12089:  1: import { Component, inject } from '@angular/core';
12090:  2: import { SHARED_IMPORTS } from '@shared';
12091:  3: import { NzMessageService } from 'ng-zorro-antd/message';
12092:  4: 
12093:  5: @Component({
12094:  6:   selector: 'app-helpcenter',
12095:  7:   templateUrl: './helpcenter.component.html',
12096:  8:   imports: SHARED_IMPORTS
12097:  9: })
12098: 10: export class HelpCenterComponent {
12099: 11:   readonly msg = inject(NzMessageService);
12100: 12:   type = '';
12101: 13:   q = '';
12102: 14: 
12103: 15:   quick(key: string): void {
12104: 16:     this.q = key;
12105: 17:     this.search();
12106: 18:   }
12107: 19: 
12108: 20:   search(): void {
12109: 21:     this.msg.success(`搜索：${this.q}`);
12110: 22:   }
12111: 23: }
12112: ````
12113: 
12114: ## File: src/app/routes/extras/poi/edit/edit.component.ts
12115: ````typescript
12116:  1: import { Component, OnInit, inject } from '@angular/core';
12117:  2: import { _HttpClient } from '@delon/theme';
12118:  3: import { SHARED_IMPORTS } from '@shared';
12119:  4: import { NzMessageService } from 'ng-zorro-antd/message';
12120:  5: import { NzModalRef } from 'ng-zorro-antd/modal';
12121:  6: 
12122:  7: @Component({
12123:  8:   selector: 'app-extras-poi-edit',
12124:  9:   templateUrl: './edit.component.html',
12125: 10:   imports: SHARED_IMPORTS
12126: 11: })
12127: 12: export class ExtrasPoiEditComponent implements OnInit {
12128: 13:   readonly msgSrv = inject(NzMessageService);
12129: 14:   private readonly modal = inject(NzModalRef);
12130: 15:   readonly http = inject(_HttpClient);
12131: 16: 
12132: 17:   i: any;
12133: 18:   cat: string[] = ['美食', '美食,粤菜', '美食,粤菜,湛江菜'];
12134: 19: 
12135: 20:   ngOnInit(): void {
12136: 21:     if (this.i.id > 0) {
12137: 22:       this.http.get('/pois').subscribe(res => (this.i = res.list[0]));
12138: 23:     }
12139: 24:   }
12140: 25: 
12141: 26:   save(): void {
12142: 27:     this.http.get('/pois').subscribe(() => {
12143: 28:       this.msgSrv.success('保存成功，只是模拟，实际未变更');
12144: 29:       this.modal.destroy(true);
12145: 30:     });
12146: 31:   }
12147: 32: 
12148: 33:   close(): void {
12149: 34:     this.modal.destroy();
12150: 35:   }
12151: 36: }
12152: ````
12153: 
12154: ## File: src/app/routes/extras/poi/poi.component.ts
12155: ````typescript
12156:  1: import { Component, ViewChild, inject } from '@angular/core';
12157:  2: import { STColumn, STComponent } from '@delon/abc/st';
12158:  3: import { ModalHelper } from '@delon/theme';
12159:  4: import { SHARED_IMPORTS } from '@shared';
12160:  5: import { NzMessageService } from 'ng-zorro-antd/message';
12161:  6: 
12162:  7: import { ExtrasPoiEditComponent } from './edit/edit.component';
12163:  8: 
12164:  9: @Component({
12165: 10:   selector: 'app-extras-poi',
12166: 11:   templateUrl: './poi.component.html',
12167: 12:   imports: SHARED_IMPORTS
12168: 13: })
12169: 14: export class ExtrasPoiComponent {
12170: 15:   private readonly msg = inject(NzMessageService);
12171: 16:   private readonly modal = inject(ModalHelper);
12172: 17: 
12173: 18:   @ViewChild('st', { static: true })
12174: 19:   st!: STComponent;
12175: 20:   s = {
12176: 21:     pi: 1,
12177: 22:     ps: 10,
12178: 23:     user_id: '',
12179: 24:     s: '',
12180: 25:     q: ''
12181: 26:   };
12182: 27:   url = '/pois';
12183: 28:   columns: STColumn[] = [
12184: 29:     { title: '编号', index: 'id', width: '100px' },
12185: 30:     { title: '门店名称', index: 'name' },
12186: 31:     { title: '分店名', index: 'branch_name' },
12187: 32:     { title: '状态', index: 'status_str', width: '100px' },
12188: 33:     {
12189: 34:       title: '操作',
12190: 35:       width: '180px',
12191: 36:       buttons: [
12192: 37:         {
12193: 38:           text: '编辑',
12194: 39:           type: 'modal',
12195: 40:           modal: {
12196: 41:             component: ExtrasPoiEditComponent,
12197: 42:             paramsName: 'i'
12198: 43:           },
12199: 44:           click: () => this.msg.info('回调，重新发起列表刷新')
12200: 45:         },
12201: 46:         { text: '图片', click: () => this.msg.info('click photo') },
12202: 47:         { text: '经营SKU', click: () => this.msg.info('click sku') }
12203: 48:       ]
12204: 49:     }
12205: 50:   ];
12206: 51: 
12207: 52:   add(): void {
12208: 53:     this.modal.createStatic(ExtrasPoiEditComponent, { i: { id: 0 } }).subscribe(() => {
12209: 54:       this.st.load();
12210: 55:       this.msg.info('回调，重新发起列表刷新');
12211: 56:     });
12212: 57:   }
12213: 58: }
12214: ````
12215: 
12216: ## File: src/app/routes/extras/routes.ts
12217: ````typescript
12218:  1: import { Routes } from '@angular/router';
12219:  2: 
12220:  3: import { HelpCenterComponent } from './helpcenter/helpcenter.component';
12221:  4: import { ExtrasPoiComponent } from './poi/poi.component';
12222:  5: import { ExtrasSettingsComponent } from './settings/settings.component';
12223:  6: 
12224:  7: export const routes: Routes = [
12225:  8:   { path: 'helpcenter', component: HelpCenterComponent },
12226:  9:   { path: 'settings', component: ExtrasSettingsComponent },
12227: 10:   { path: 'poi', component: ExtrasPoiComponent }
12228: 11: ];
12229: ````
12230: 
12231: ## File: src/app/routes/extras/settings/settings.component.ts
12232: ````typescript
12233:  1: import { Component, OnInit, inject } from '@angular/core';
12234:  2: import { FormBuilder, Validators } from '@angular/forms';
12235:  3: import { SHARED_IMPORTS } from '@shared';
12236:  4: import { NzMessageService } from 'ng-zorro-antd/message';
12237:  5: import { NzUploadComponent } from 'ng-zorro-antd/upload';
12238:  6: 
12239:  7: @Component({
12240:  8:   selector: 'app-extras-settings',
12241:  9:   templateUrl: './settings.component.html',
12242: 10:   imports: [...SHARED_IMPORTS, NzUploadComponent]
12243: 11: })
12244: 12: export class ExtrasSettingsComponent implements OnInit {
12245: 13:   readonly msg = inject(NzMessageService);
12246: 14: 
12247: 15:   active = 1;
12248: 16:   profileForm = inject(FormBuilder).nonNullable.group({
12249: 17:     name: ['', Validators.compose([Validators.required, Validators.pattern(`^[-_a-zA-Z0-9]{4,20}$`)])],
12250: 18:     email: '',
12251: 19:     bio: ['', Validators.maxLength(160)],
12252: 20:     url: '',
12253: 21:     company: '',
12254: 22:     location: ''
12255: 23:   });
12256: 24:   pwd = {
12257: 25:     old_password: '',
12258: 26:     new_password: '',
12259: 27:     confirm_new_password: ''
12260: 28:   };
12261: 29:   // Email
12262: 30:   primary_email = 'cipchk@qq.com';
12263: 31: 
12264: 32:   profileSave(value: any): void {
12265: 33:     console.log('profile value', value);
12266: 34:   }
12267: 35: 
12268: 36:   pwdSave(): void {
12269: 37:     if (!this.pwd.old_password) {
12270: 38:       this.msg.error('invalid old password');
12271: 39:       return;
12272: 40:     }
12273: 41:     if (!this.pwd.new_password) {
12274: 42:       this.msg.error('invalid new password');
12275: 43:       return;
12276: 44:     }
12277: 45:     if (!this.pwd.confirm_new_password) {
12278: 46:       this.msg.error('invalid confirm new password');
12279: 47:       return;
12280: 48:     }
12281: 49:     console.log('pwd value', this.pwd);
12282: 50:   }
12283: 51: 
12284: 52:   ngOnInit(): void {
12285: 53:     this.profileForm.patchValue({
12286: 54:       name: 'cipchk',
12287: 55:       email: 'cipchk@qq.com'
12288: 56:     });
12289: 57:   }
12290: 58: }
12291: ````
12292: 
12293: ## File: src/app/routes/issues/assignments/issue-assignments.component.ts
12294: ````typescript
12295:  1: import { Component, OnInit, inject } from '@angular/core';
12296:  2: import { SHARED_IMPORTS } from '@shared';
12297:  3: 
12298:  4: @Component({
12299:  5:   selector: 'app-issue-assignments',
12300:  6:   standalone: true,
12301:  7:   imports: [SHARED_IMPORTS],
12302:  8:   template: `
12303:  9:     <page-header [title]="'问题分配'"></page-header>
12304: 10: 
12305: 11:     <nz-card nzTitle="问题分配管理" style="margin-top: 16px;">
12306: 12:       <nz-alert
12307: 13:         nzType="info"
12308: 14:         nzMessage="问题分配功能开发中"
12309: 15:         nzDescription="此页面将用于管理问题的分配。"
12310: 16:         [nzShowIcon]="true"
12311: 17:         style="margin-bottom: 16px;"
12312: 18:       ></nz-alert>
12313: 19: 
12314: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
12315: 21:     </nz-card>
12316: 22:   `
12317: 23: })
12318: 24: export class IssueAssignmentsComponent implements OnInit {
12319: 25:   ngOnInit(): void {
12320: 26:     // TODO: 加载问题分配数据
12321: 27:   }
12322: 28: }
12323: ````
12324: 
12325: ## File: src/app/routes/issues/close/issue-close.component.ts
12326: ````typescript
12327:  1: import { Component, OnInit, inject } from '@angular/core';
12328:  2: import { ActivatedRoute, Router } from '@angular/router';
12329:  3: import { SHARED_IMPORTS } from '@shared';
12330:  4: import { NzMessageService } from 'ng-zorro-antd/message';
12331:  5: 
12332:  6: @Component({
12333:  7:   selector: 'app-issue-close',
12334:  8:   standalone: true,
12335:  9:   imports: [SHARED_IMPORTS],
12336: 10:   template: `
12337: 11:     <page-header [title]="'关闭问题'"></page-header>
12338: 12: 
12339: 13:     <nz-card nzTitle="关闭问题" style="margin-top: 16px;">
12340: 14:       <nz-alert
12341: 15:         nzType="info"
12342: 16:         nzMessage="关闭问题功能开发中"
12343: 17:         nzDescription="此页面将用于关闭问题。"
12344: 18:         [nzShowIcon]="true"
12345: 19:         style="margin-bottom: 16px;"
12346: 20:       ></nz-alert>
12347: 21: 
12348: 22:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
12349: 23:     </nz-card>
12350: 24:   `
12351: 25: })
12352: 26: export class IssueCloseComponent implements OnInit {
12353: 27:   route = inject(ActivatedRoute);
12354: 28:   router = inject(Router);
12355: 29:   message = inject(NzMessageService);
12356: 30: 
12357: 31:   issueId = '';
12358: 32: 
12359: 33:   ngOnInit(): void {
12360: 34:     this.issueId = this.route.snapshot.paramMap.get('id') || '';
12361: 35:     if (!this.issueId) {
12362: 36:       this.message.error('问题ID不存在');
12363: 37:       this.router.navigate(['/issues']);
12364: 38:     }
12365: 39:   }
12366: 40: }
12367: ````
12368: 
12369: ## File: src/app/routes/issues/detail/issue-detail.component.ts
12370: ````typescript
12371:  1: import { Component, OnInit, inject } from '@angular/core';
12372:  2: import { ActivatedRoute, Router } from '@angular/router';
12373:  3: import { SHARED_IMPORTS } from '@shared';
12374:  4: import { NzMessageService } from 'ng-zorro-antd/message';
12375:  5: 
12376:  6: @Component({
12377:  7:   selector: 'app-issue-detail',
12378:  8:   standalone: true,
12379:  9:   imports: [SHARED_IMPORTS],
12380: 10:   template: `
12381: 11:     <page-header [title]="'问题详情'">
12382: 12:       <ng-template #extra>
12383: 13:         <button nz-button (click)="handle()">处理</button>
12384: 14:         <button nz-button nzType="primary" (click)="close()" style="margin-left: 8px;">关闭</button>
12385: 15:       </ng-template>
12386: 16:     </page-header>
12387: 17: 
12388: 18:     <nz-card nzTitle="问题详细信息" style="margin-top: 16px;">
12389: 19:       <nz-alert
12390: 20:         nzType="info"
12391: 21:         nzMessage="问题详情功能开发中"
12392: 22:         nzDescription="此页面将用于显示问题的详细信息。"
12393: 23:         [nzShowIcon]="true"
12394: 24:         style="margin-bottom: 16px;"
12395: 25:       ></nz-alert>
12396: 26: 
12397: 27:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
12398: 28:     </nz-card>
12399: 29:   `
12400: 30: })
12401: 31: export class IssueDetailComponent implements OnInit {
12402: 32:   route = inject(ActivatedRoute);
12403: 33:   router = inject(Router);
12404: 34:   message = inject(NzMessageService);
12405: 35: 
12406: 36:   issueId = '';
12407: 37: 
12408: 38:   ngOnInit(): void {
12409: 39:     this.issueId = this.route.snapshot.paramMap.get('id') || '';
12410: 40:     if (!this.issueId) {
12411: 41:       this.message.error('问题ID不存在');
12412: 42:       this.router.navigate(['/issues']);
12413: 43:     }
12414: 44:   }
12415: 45: 
12416: 46:   handle(): void {
12417: 47:     this.router.navigate(['/issues', this.issueId, 'handle']);
12418: 48:   }
12419: 49: 
12420: 50:   close(): void {
12421: 51:     this.router.navigate(['/issues', this.issueId, 'close']);
12422: 52:   }
12423: 53: }
12424: ````
12425: 
12426: ## File: src/app/routes/issues/form/issue-form.component.ts
12427: ````typescript
12428:  1: import { Component, OnInit, inject } from '@angular/core';
12429:  2: import { ActivatedRoute, Router } from '@angular/router';
12430:  3: import { SHARED_IMPORTS } from '@shared';
12431:  4: import { NzMessageService } from 'ng-zorro-antd/message';
12432:  5: 
12433:  6: @Component({
12434:  7:   selector: 'app-issue-form',
12435:  8:   standalone: true,
12436:  9:   imports: [SHARED_IMPORTS],
12437: 10:   template: `
12438: 11:     <page-header [title]="isEdit ? '编辑问题' : '新建问题'"></page-header>
12439: 12: 
12440: 13:     <nz-card nzTitle="问题表单" style="margin-top: 16px;">
12441: 14:       <nz-alert
12442: 15:         nzType="info"
12443: 16:         nzMessage="问题表单功能开发中"
12444: 17:         nzDescription="此页面将用于创建或编辑问题。"
12445: 18:         [nzShowIcon]="true"
12446: 19:         style="margin-bottom: 16px;"
12447: 20:       ></nz-alert>
12448: 21: 
12449: 22:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
12450: 23:     </nz-card>
12451: 24:   `
12452: 25: })
12453: 26: export class IssueFormComponent implements OnInit {
12454: 27:   route = inject(ActivatedRoute);
12455: 28:   router = inject(Router);
12456: 29:   message = inject(NzMessageService);
12457: 30: 
12458: 31:   isEdit = false;
12459: 32:   issueId = '';
12460: 33: 
12461: 34:   ngOnInit(): void {
12462: 35:     this.issueId = this.route.snapshot.paramMap.get('id') || '';
12463: 36:     this.isEdit = !!this.issueId;
12464: 37:   }
12465: 38: }
12466: ````
12467: 
12468: ## File: src/app/routes/issues/handle/issue-handle.component.ts
12469: ````typescript
12470:  1: import { Component, OnInit, inject } from '@angular/core';
12471:  2: import { ActivatedRoute, Router } from '@angular/router';
12472:  3: import { SHARED_IMPORTS } from '@shared';
12473:  4: import { NzMessageService } from 'ng-zorro-antd/message';
12474:  5: 
12475:  6: @Component({
12476:  7:   selector: 'app-issue-handle',
12477:  8:   standalone: true,
12478:  9:   imports: [SHARED_IMPORTS],
12479: 10:   template: `
12480: 11:     <page-header [title]="'处理问题'"></page-header>
12481: 12: 
12482: 13:     <nz-card nzTitle="问题处理" style="margin-top: 16px;">
12483: 14:       <nz-alert
12484: 15:         nzType="info"
12485: 16:         nzMessage="问题处理功能开发中"
12486: 17:         nzDescription="此页面将用于处理问题。"
12487: 18:         [nzShowIcon]="true"
12488: 19:         style="margin-bottom: 16px;"
12489: 20:       ></nz-alert>
12490: 21: 
12491: 22:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
12492: 23:     </nz-card>
12493: 24:   `
12494: 25: })
12495: 26: export class IssueHandleComponent implements OnInit {
12496: 27:   route = inject(ActivatedRoute);
12497: 28:   router = inject(Router);
12498: 29:   message = inject(NzMessageService);
12499: 30: 
12500: 31:   issueId = '';
12501: 32: 
12502: 33:   ngOnInit(): void {
12503: 34:     this.issueId = this.route.snapshot.paramMap.get('id') || '';
12504: 35:     if (!this.issueId) {
12505: 36:       this.message.error('问题ID不存在');
12506: 37:       this.router.navigate(['/issues']);
12507: 38:     }
12508: 39:   }
12509: 40: }
12510: ````
12511: 
12512: ## File: src/app/routes/issues/list/issue-list.component.ts
12513: ````typescript
12514:  1: import { Component, OnInit, inject } from '@angular/core';
12515:  2: import { Router } from '@angular/router';
12516:  3: import { SHARED_IMPORTS } from '@shared';
12517:  4: import { NzMessageService } from 'ng-zorro-antd/message';
12518:  5: 
12519:  6: @Component({
12520:  7:   selector: 'app-issue-list',
12521:  8:   standalone: true,
12522:  9:   imports: [SHARED_IMPORTS],
12523: 10:   template: `
12524: 11:     <page-header [title]="'问题列表'">
12525: 12:       <ng-template #extra>
12526: 13:         <button nz-button nzType="primary" (click)="createIssue()">
12527: 14:           <span nz-icon nzType="plus"></span>
12528: 15:           新建问题
12529: 16:         </button>
12530: 17:       </ng-template>
12531: 18:     </page-header>
12532: 19: 
12533: 20:     <nz-card nzTitle="问题跟踪管理" style="margin-top: 16px;">
12534: 21:       <nz-alert
12535: 22:         nzType="info"
12536: 23:         nzMessage="问题跟踪功能开发中"
12537: 24:         nzDescription="此页面将用于显示和管理所有问题。"
12538: 25:         [nzShowIcon]="true"
12539: 26:         style="margin-bottom: 16px;"
12540: 27:       ></nz-alert>
12541: 28: 
12542: 29:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
12543: 30:     </nz-card>
12544: 31:   `
12545: 32: })
12546: 33: export class IssueListComponent implements OnInit {
12547: 34:   router = inject(Router);
12548: 35:   message = inject(NzMessageService);
12549: 36: 
12550: 37:   ngOnInit(): void {
12551: 38:     // TODO: 加载问题列表
12552: 39:   }
12553: 40: 
12554: 41:   createIssue(): void {
12555: 42:     this.router.navigate(['/issues/create']);
12556: 43:   }
12557: 44: }
12558: ````
12559: 
12560: ## File: src/app/routes/issues/photos/issue-photos.component.ts
12561: ````typescript
12562:  1: import { Component, OnInit, inject } from '@angular/core';
12563:  2: import { ActivatedRoute, Router } from '@angular/router';
12564:  3: import { SHARED_IMPORTS } from '@shared';
12565:  4: import { NzMessageService } from 'ng-zorro-antd/message';
12566:  5: 
12567:  6: @Component({
12568:  7:   selector: 'app-issue-photos',
12569:  8:   standalone: true,
12570:  9:   imports: [SHARED_IMPORTS],
12571: 10:   template: `
12572: 11:     <page-header [title]="'处理照片'"></page-header>
12573: 12: 
12574: 13:     <nz-card nzTitle="问题处理照片管理" style="margin-top: 16px;">
12575: 14:       <nz-alert
12576: 15:         nzType="info"
12577: 16:         nzMessage="处理照片功能开发中"
12578: 17:         nzDescription="此页面将用于管理问题处理照片。"
12579: 18:         [nzShowIcon]="true"
12580: 19:         style="margin-bottom: 16px;"
12581: 20:       ></nz-alert>
12582: 21: 
12583: 22:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
12584: 23:     </nz-card>
12585: 24:   `
12586: 25: })
12587: 26: export class IssuePhotosComponent implements OnInit {
12588: 27:   route = inject(ActivatedRoute);
12589: 28:   router = inject(Router);
12590: 29:   message = inject(NzMessageService);
12591: 30: 
12592: 31:   issueId = '';
12593: 32: 
12594: 33:   ngOnInit(): void {
12595: 34:     this.issueId = this.route.snapshot.paramMap.get('id') || '';
12596: 35:     if (!this.issueId) {
12597: 36:       this.message.error('问题ID不存在');
12598: 37:       this.router.navigate(['/issues']);
12599: 38:     }
12600: 39:   }
12601: 40: }
12602: ````
12603: 
12604: ## File: src/app/routes/issues/routes.ts
12605: ````typescript
12606:  1: import { Routes } from '@angular/router';
12607:  2: 
12608:  3: export const ISSUE_ROUTES: Routes = [
12609:  4:   {
12610:  5:     path: '',
12611:  6:     redirectTo: 'list',
12612:  7:     pathMatch: 'full'
12613:  8:   },
12614:  9:   {
12615: 10:     path: 'list',
12616: 11:     loadComponent: () => import('./list/issue-list.component').then(m => m.IssueListComponent)
12617: 12:   },
12618: 13:   {
12619: 14:     path: 'create',
12620: 15:     loadComponent: () => import('./form/issue-form.component').then(m => m.IssueFormComponent)
12621: 16:   },
12622: 17:   {
12623: 18:     path: ':id',
12624: 19:     loadComponent: () => import('./detail/issue-detail.component').then(m => m.IssueDetailComponent)
12625: 20:   },
12626: 21:   {
12627: 22:     path: 'assignments',
12628: 23:     loadComponent: () => import('./assignments/issue-assignments.component').then(m => m.IssueAssignmentsComponent)
12629: 24:   },
12630: 25:   {
12631: 26:     path: ':id/handle',
12632: 27:     loadComponent: () => import('./handle/issue-handle.component').then(m => m.IssueHandleComponent)
12633: 28:   },
12634: 29:   {
12635: 30:     path: ':id/photos',
12636: 31:     loadComponent: () => import('./photos/issue-photos.component').then(m => m.IssuePhotosComponent)
12637: 32:   },
12638: 33:   {
12639: 34:     path: ':id/close',
12640: 35:     loadComponent: () => import('./close/issue-close.component').then(m => m.IssueCloseComponent)
12641: 36:   }
12642: 37: ];
12643: ````
12644: 
12645: ## File: src/app/routes/passport/callback.component.ts
12646: ````typescript
12647:  1: import { Component, Input, OnInit, inject } from '@angular/core';
12648:  2: import { SocialService } from '@delon/auth';
12649:  3: import { SettingsService } from '@delon/theme';
12650:  4: 
12651:  5: @Component({
12652:  6:   selector: 'app-callback',
12653:  7:   template: ``,
12654:  8:   providers: [SocialService],
12655:  9:   standalone: true
12656: 10: })
12657: 11: export class CallbackComponent implements OnInit {
12658: 12:   private readonly socialService = inject(SocialService);
12659: 13:   private readonly settingsSrv = inject(SettingsService);
12660: 14:   @Input() type = '';
12661: 15: 
12662: 16:   ngOnInit(): void {
12663: 17:     this.mockModel();
12664: 18:   }
12665: 19: 
12666: 20:   private mockModel(): void {
12667: 21:     const info = {
12668: 22:       token: '123456789',
12669: 23:       name: 'cipchk',
12670: 24:       email: `${this.type}@${this.type}.com`,
12671: 25:       id: 10000,
12672: 26:       time: +new Date()
12673: 27:     };
12674: 28:     this.settingsSrv.setUser({
12675: 29:       ...this.settingsSrv.user,
12676: 30:       ...info
12677: 31:     });
12678: 32:     this.socialService.callback(info);
12679: 33:   }
12680: 34: }
12681: ````
12682: 
12683: ## File: src/app/routes/passport/lock/lock.component.ts
12684: ````typescript
12685:  1: import { Component, inject } from '@angular/core';
12686:  2: import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
12687:  3: import { Router } from '@angular/router';
12688:  4: import { DA_SERVICE_TOKEN } from '@delon/auth';
12689:  5: import { I18nPipe, SettingsService, User } from '@delon/theme';
12690:  6: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
12691:  7: import { NzButtonModule } from 'ng-zorro-antd/button';
12692:  8: import { NzFormModule } from 'ng-zorro-antd/form';
12693:  9: import { NzGridModule } from 'ng-zorro-antd/grid';
12694: 10: import { NzInputModule } from 'ng-zorro-antd/input';
12695: 11: 
12696: 12: @Component({
12697: 13:   selector: 'passport-lock',
12698: 14:   templateUrl: './lock.component.html',
12699: 15:   styleUrls: ['./lock.component.less'],
12700: 16:   imports: [ReactiveFormsModule, I18nPipe, NzAvatarModule, NzFormModule, NzGridModule, NzButtonModule, NzInputModule]
12701: 17: })
12702: 18: export class UserLockComponent {
12703: 19:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
12704: 20:   private readonly settings = inject(SettingsService);
12705: 21:   private readonly router = inject(Router);
12706: 22: 
12707: 23:   f = new FormGroup({
12708: 24:     password: new FormControl('', { nonNullable: true, validators: [Validators.required] })
12709: 25:   });
12710: 26: 
12711: 27:   get user(): User {
12712: 28:     return this.settings.user;
12713: 29:   }
12714: 30: 
12715: 31:   submit(): void {
12716: 32:     this.f.controls.password.markAsDirty();
12717: 33:     this.f.controls.password.updateValueAndValidity();
12718: 34:     if (this.f.valid) {
12719: 35:       console.log('Valid!');
12720: 36:       console.log(this.f.value);
12721: 37:       this.tokenService.set({
12722: 38:         token: '123'
12723: 39:       });
12724: 40:       this.router.navigate(['dashboard']);
12725: 41:     }
12726: 42:   }
12727: 43: }
12728: ````
12729: 
12730: ## File: src/app/routes/passport/login/login.component.ts
12731: ````typescript
12732:   1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
12733:   2: import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
12734:   3: import { Router, RouterLink } from '@angular/router';
12735:   4: import { StartupService, SupabaseAuthAdapterService } from '@core';
12736:   5: import { ReuseTabService } from '@delon/abc/reuse-tab';
12737:   6: import { DA_SERVICE_TOKEN } from '@delon/auth';
12738:   7: import { I18nPipe } from '@delon/theme';
12739:   8: import { NzAlertModule } from 'ng-zorro-antd/alert';
12740:   9: import { NzButtonModule } from 'ng-zorro-antd/button';
12741:  10: import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
12742:  11: import { NzFormModule } from 'ng-zorro-antd/form';
12743:  12: import { NzInputModule } from 'ng-zorro-antd/input';
12744:  13: import { finalize } from 'rxjs';
12745:  14: 
12746:  15: @Component({
12747:  16:   selector: 'passport-login',
12748:  17:   templateUrl: './login.component.html',
12749:  18:   styleUrls: ['./login.component.less'],
12750:  19:   changeDetection: ChangeDetectionStrategy.OnPush,
12751:  20:   imports: [
12752:  21:     RouterLink,
12753:  22:     ReactiveFormsModule,
12754:  23:     I18nPipe,
12755:  24:     NzCheckboxModule,
12756:  25:     NzAlertModule,
12757:  26:     NzFormModule,
12758:  27:     NzInputModule,
12759:  28:     NzButtonModule
12760:  29:   ]
12761:  30: })
12762:  31: export class UserLoginComponent implements OnDestroy {
12763:  32:   private readonly router = inject(Router);
12764:  33:   private readonly reuseTabService = inject(ReuseTabService, { optional: true });
12765:  34:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
12766:  35:   private readonly startupSrv = inject(StartupService);
12767:  36:   private readonly cdr = inject(ChangeDetectorRef);
12768:  37:   private readonly supabaseAuthAdapter = inject(SupabaseAuthAdapterService);
12769:  38: 
12770:  39:   form = inject(FormBuilder).nonNullable.group({
12771:  40:     userName: ['', [Validators.required, Validators.email]],
12772:  41:     password: ['', [Validators.required, Validators.minLength(6)]],
12773:  42:     remember: [true]
12774:  43:   });
12775:  44:   error = '';
12776:  45:   loading = false;
12777:  46: 
12778:  47:   submit(): void {
12779:  48:     this.error = '';
12780:  49:     const { userName, password } = this.form.controls;
12781:  50:     userName.markAsDirty();
12782:  51:     userName.updateValueAndValidity();
12783:  52:     password.markAsDirty();
12784:  53:     password.updateValueAndValidity();
12785:  54:     if (userName.invalid || password.invalid) {
12786:  55:       return;
12787:  56:     }
12788:  57: 
12789:  58:     // 使用 Supabase Auth 進行登入
12790:  59:     // 適配器會自動將 Session 同步到 @delon/auth TokenService
12791:  60:     const email = String(this.form.value.userName || '');
12792:  61:     const pwd = String(this.form.value.password || '');
12793:  62: 
12794:  63:     if (!email || !pwd) {
12795:  64:       this.error = '請輸入帳號和密碼';
12796:  65:       this.cdr.detectChanges();
12797:  66:       return;
12798:  67:     }
12799:  68: 
12800:  69:     this.loading = true;
12801:  70:     this.cdr.detectChanges();
12802:  71: 
12803:  72:     this.supabaseAuthAdapter
12804:  73:       .signIn(email, pwd)
12805:  74:       .pipe(
12806:  75:         finalize(() => {
12807:  76:           this.loading = false;
12808:  77:           this.cdr.detectChanges();
12809:  78:         })
12810:  79:       )
12811:  80:       .subscribe({
12812:  81:         next: result => {
12813:  82:           if (result.error) {
12814:  83:             this.error = result.error.message || '登入失敗';
12815:  84:             this.cdr.detectChanges();
12816:  85:             return;
12817:  86:           }
12818:  87:           // 清空路由复用信息
12819:  88:           this.reuseTabService?.clear();
12820:  89:           // 適配器已自動同步 Session 到 TokenService
12821:  90:           // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
12822:  91:           this.startupSrv.load().subscribe(() => {
12823:  92:             let url = this.tokenService.referrer!.url || '/';
12824:  93:             if (url.includes('/passport')) {
12825:  94:               url = '/';
12826:  95:             }
12827:  96:             this.router.navigateByUrl(url);
12828:  97:           });
12829:  98:         },
12830:  99:         error: err => {
12831: 100:           this.error = err.message || '登入失敗，請稍後再試';
12832: 101:           this.cdr.detectChanges();
12833: 102:         }
12834: 103:       });
12835: 104:   }
12836: 105: 
12837: 106:   ngOnDestroy(): void {
12838: 107:     // 不再需要清理 interval
12839: 108:   }
12840: 109: }
12841: ````
12842: 
12843: ## File: src/app/routes/passport/register-result/register-result.component.ts
12844: ````typescript
12845:  1: import { Component, Input, inject } from '@angular/core';
12846:  2: import { RouterLink } from '@angular/router';
12847:  3: import { I18nPipe } from '@delon/theme';
12848:  4: import { NzButtonModule } from 'ng-zorro-antd/button';
12849:  5: import { NzMessageService } from 'ng-zorro-antd/message';
12850:  6: import { NzResultModule } from 'ng-zorro-antd/result';
12851:  7: 
12852:  8: @Component({
12853:  9:   selector: 'passport-register-result',
12854: 10:   templateUrl: './register-result.component.html',
12855: 11:   imports: [RouterLink, I18nPipe, NzButtonModule, NzResultModule]
12856: 12: })
12857: 13: export class UserRegisterResultComponent {
12858: 14:   readonly msg = inject(NzMessageService);
12859: 15:   @Input() email = '';
12860: 16: }
12861: ````
12862: 
12863: ## File: src/app/routes/passport/register/register.component.ts
12864: ````typescript
12865:   1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
12866:   2: import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
12867:   3: import { Router, RouterLink } from '@angular/router';
12868:   4: import { SupabaseAuthAdapterService } from '@core';
12869:   5: import { I18nPipe } from '@delon/theme';
12870:   6: import { MatchControl } from '@delon/util/form';
12871:   7: import { NzAlertModule } from 'ng-zorro-antd/alert';
12872:   8: import { NzButtonModule } from 'ng-zorro-antd/button';
12873:   9: import { NzSafeAny } from 'ng-zorro-antd/core/types';
12874:  10: import { NzFormModule } from 'ng-zorro-antd/form';
12875:  11: import { NzInputModule } from 'ng-zorro-antd/input';
12876:  12: import { NzPopoverModule } from 'ng-zorro-antd/popover';
12877:  13: import { NzProgressModule } from 'ng-zorro-antd/progress';
12878:  14: import { finalize } from 'rxjs';
12879:  15: 
12880:  16: @Component({
12881:  17:   selector: 'passport-register',
12882:  18:   templateUrl: './register.component.html',
12883:  19:   styleUrls: ['./register.component.less'],
12884:  20:   changeDetection: ChangeDetectionStrategy.OnPush,
12885:  21:   imports: [
12886:  22:     ReactiveFormsModule,
12887:  23:     I18nPipe,
12888:  24:     RouterLink,
12889:  25:     NzAlertModule,
12890:  26:     NzFormModule,
12891:  27:     NzInputModule,
12892:  28:     NzPopoverModule,
12893:  29:     NzProgressModule,
12894:  30:     NzButtonModule
12895:  31:   ]
12896:  32: })
12897:  33: export class UserRegisterComponent implements OnDestroy {
12898:  34:   private readonly router = inject(Router);
12899:  35:   private readonly cdr = inject(ChangeDetectorRef);
12900:  36:   private readonly supabaseAuthAdapter = inject(SupabaseAuthAdapterService);
12901:  37: 
12902:  38:   // #region fields
12903:  39: 
12904:  40:   form = inject(FormBuilder).nonNullable.group(
12905:  41:     {
12906:  42:       mail: ['', [Validators.required, Validators.email]],
12907:  43:       password: ['', [Validators.required, Validators.minLength(6), UserRegisterComponent.checkPassword.bind(this)]],
12908:  44:       confirm: ['', [Validators.required, Validators.minLength(6)]]
12909:  45:     },
12910:  46:     {
12911:  47:       validators: MatchControl('password', 'confirm')
12912:  48:     }
12913:  49:   );
12914:  50:   error = '';
12915:  51:   loading = false;
12916:  52:   visible = false;
12917:  53:   status = 'pool';
12918:  54:   progress = 0;
12919:  55:   passwordProgressMap: Record<string, 'success' | 'normal' | 'exception'> = {
12920:  56:     ok: 'success',
12921:  57:     pass: 'normal',
12922:  58:     pool: 'exception'
12923:  59:   };
12924:  60: 
12925:  61:   static checkPassword(control: FormControl): NzSafeAny {
12926:  62:     if (!control) {
12927:  63:       return null;
12928:  64:     }
12929:  65:     // eslint-disable-next-line @typescript-eslint/no-this-alias
12930:  66:     const self: NzSafeAny = this;
12931:  67:     self.visible = !!control.value;
12932:  68:     if (control.value && control.value.length > 9) {
12933:  69:       self.status = 'ok';
12934:  70:     } else if (control.value && control.value.length > 5) {
12935:  71:       self.status = 'pass';
12936:  72:     } else {
12937:  73:       self.status = 'pool';
12938:  74:     }
12939:  75: 
12940:  76:     if (self.visible) {
12941:  77:       self.progress = control.value.length * 10 > 100 ? 100 : control.value.length * 10;
12942:  78:     }
12943:  79:   }
12944:  80: 
12945:  81:   submit(): void {
12946:  82:     this.error = '';
12947:  83:     Object.keys(this.form.controls).forEach(key => {
12948:  84:       const control = (this.form.controls as NzSafeAny)[key] as AbstractControl;
12949:  85:       control.markAsDirty();
12950:  86:       control.updateValueAndValidity();
12951:  87:     });
12952:  88:     if (this.form.invalid) {
12953:  89:       return;
12954:  90:     }
12955:  91: 
12956:  92:     const email = String(this.form.value.mail || '');
12957:  93:     const password = String(this.form.value.password || '');
12958:  94: 
12959:  95:     if (!email || !password) {
12960:  96:       this.error = '請填寫完整的註冊資訊';
12961:  97:       this.cdr.detectChanges();
12962:  98:       return;
12963:  99:     }
12964: 100: 
12965: 101:     this.loading = true;
12966: 102:     this.cdr.detectChanges();
12967: 103: 
12968: 104:     this.supabaseAuthAdapter
12969: 105:       .signUp(email, password)
12970: 106:       .pipe(
12971: 107:         finalize(() => {
12972: 108:           this.loading = false;
12973: 109:           this.cdr.detectChanges();
12974: 110:         })
12975: 111:       )
12976: 112:       .subscribe({
12977: 113:         next: result => {
12978: 114:           if (result.error) {
12979: 115:             this.error = result.error.message || '註冊失敗';
12980: 116:             this.cdr.detectChanges();
12981: 117:             return;
12982: 118:           }
12983: 119:           // 註冊成功，導航到註冊結果頁面
12984: 120:           // Supabase 註冊可能返回 session（email 驗證關閉）或 null（email 驗證開啟）
12985: 121:           this.router.navigate(['passport', 'register-result'], { queryParams: { email } });
12986: 122:         },
12987: 123:         error: err => {
12988: 124:           this.error = err.message || '註冊失敗，請稍後再試';
12989: 125:           this.cdr.detectChanges();
12990: 126:         }
12991: 127:       });
12992: 128:   }
12993: 129: 
12994: 130:   ngOnDestroy(): void {
12995: 131:     // 不再需要清理 interval
12996: 132:   }
12997: 133: }
12998: ````
12999: 
13000: ## File: src/app/routes/passport/routes.ts
13001: ````typescript
13002:  1: import { Routes } from '@angular/router';
13003:  2: 
13004:  3: import { CallbackComponent } from './callback.component';
13005:  4: import { UserLockComponent } from './lock/lock.component';
13006:  5: import { UserLoginComponent } from './login/login.component';
13007:  6: import { UserRegisterComponent } from './register/register.component';
13008:  7: import { UserRegisterResultComponent } from './register-result/register-result.component';
13009:  8: import { LayoutPassportComponent } from '../../layout';
13010:  9: 
13011: 10: export const routes: Routes = [
13012: 11:   // passport
13013: 12:   {
13014: 13:     path: 'passport',
13015: 14:     component: LayoutPassportComponent,
13016: 15:     children: [
13017: 16:       {
13018: 17:         path: 'login',
13019: 18:         component: UserLoginComponent,
13020: 19:         data: { title: '登录', titleI18n: 'app.login.login' }
13021: 20:       },
13022: 21:       {
13023: 22:         path: 'register',
13024: 23:         component: UserRegisterComponent,
13025: 24:         data: { title: '注册', titleI18n: 'app.register.register' }
13026: 25:       },
13027: 26:       {
13028: 27:         path: 'register-result',
13029: 28:         component: UserRegisterResultComponent,
13030: 29:         data: { title: '注册结果', titleI18n: 'app.register.register' }
13031: 30:       },
13032: 31:       {
13033: 32:         path: 'lock',
13034: 33:         component: UserLockComponent,
13035: 34:         data: { title: '锁屏', titleI18n: 'app.lock' }
13036: 35:       }
13037: 36:     ]
13038: 37:   },
13039: 38:   // 单页不包裹Layout
13040: 39:   { path: 'passport/callback/:type', component: CallbackComponent }
13041: 40: ];
13042: ````
13043: 
13044: ## File: src/app/routes/pro/account/center/applications/applications.component.ts
13045: ````typescript
13046:  1: import { DecimalPipe } from '@angular/common';
13047:  2: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
13048:  3: import { _HttpClient } from '@delon/theme';
13049:  4: import { SHARED_IMPORTS } from '@shared';
13050:  5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
13051:  6: 
13052:  7: @Component({
13053:  8:   selector: 'app-account-center-applications',
13054:  9:   templateUrl: './applications.component.html',
13055: 10:   styleUrls: ['./applications.component.less'],
13056: 11:   changeDetection: ChangeDetectionStrategy.OnPush,
13057: 12:   imports: [...SHARED_IMPORTS, DecimalPipe]
13058: 13: })
13059: 14: export class ProAccountCenterApplicationsComponent {
13060: 15:   private readonly http = inject(_HttpClient);
13061: 16:   private readonly cdr = inject(ChangeDetectorRef);
13062: 17: 
13063: 18:   listLoading = true;
13064: 19:   list: any[] = [];
13065: 20:   constructor() {
13066: 21:     this.http.get('/api/list', { count: 8 }).subscribe((res: NzSafeAny[]) => {
13067: 22:       this.list = res.map(item => {
13068: 23:         item.activeUser = this.formatWan(item.activeUser);
13069: 24:         return item;
13070: 25:       });
13071: 26:       this.listLoading = false;
13072: 27:       this.cdr.detectChanges();
13073: 28:     });
13074: 29:   }
13075: 30: 
13076: 31:   private formatWan(val: number): string {
13077: 32:     const v = val * 1;
13078: 33:     if (!v || isNaN(v)) {
13079: 34:       return '';
13080: 35:     }
13081: 36: 
13082: 37:     let result: string | number = val;
13083: 38:     if (val > 10000) {
13084: 39:       result = Math.floor(val / 10000);
13085: 40:       result = `${result}`;
13086: 41:     }
13087: 42:     return result.toString();
13088: 43:   }
13089: 44: }
13090: ````
13091: 
13092: ## File: src/app/routes/pro/account/center/articles/articles.component.ts
13093: ````typescript
13094:  1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
13095:  2: import { _HttpClient } from '@delon/theme';
13096:  3: import { SHARED_IMPORTS } from '@shared';
13097:  4: 
13098:  5: @Component({
13099:  6:   selector: 'app-account-center-articles',
13100:  7:   templateUrl: './articles.component.html',
13101:  8:   changeDetection: ChangeDetectionStrategy.OnPush,
13102:  9:   imports: SHARED_IMPORTS
13103: 10: })
13104: 11: export class ProAccountCenterArticlesComponent {
13105: 12:   list$ = inject(_HttpClient).get('/api/list', { count: 8 });
13106: 13: }
13107: ````
13108: 
13109: ## File: src/app/routes/pro/account/center/center.component.ts
13110: ````typescript
13111:  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
13112:  2: import { ActivationEnd, Router } from '@angular/router';
13113:  3: import { _HttpClient } from '@delon/theme';
13114:  4: import { SHARED_IMPORTS } from '@shared';
13115:  5: import { Subscription, zip, filter } from 'rxjs';
13116:  6: 
13117:  7: @Component({
13118:  8:   selector: 'app-account-center',
13119:  9:   templateUrl: './center.component.html',
13120: 10:   styleUrls: ['./center.component.less'],
13121: 11:   changeDetection: ChangeDetectionStrategy.OnPush,
13122: 12:   imports: SHARED_IMPORTS
13123: 13: })
13124: 14: export class ProAccountCenterComponent implements OnInit, OnDestroy {
13125: 15:   private readonly router = inject(Router);
13126: 16:   private readonly http = inject(_HttpClient);
13127: 17:   private readonly cdr = inject(ChangeDetectorRef);
13128: 18: 
13129: 19:   private router$!: Subscription;
13130: 20:   @ViewChild('tagInput', { static: false }) private tagInput!: ElementRef<HTMLInputElement>;
13131: 21:   user: any;
13132: 22:   notice: any;
13133: 23:   tabs = [
13134: 24:     {
13135: 25:       key: 'articles',
13136: 26:       tab: '文章 (8)'
13137: 27:     },
13138: 28:     {
13139: 29:       key: 'applications',
13140: 30:       tab: '应用 (8)'
13141: 31:     },
13142: 32:     {
13143: 33:       key: 'projects',
13144: 34:       tab: '项目 (8)'
13145: 35:     }
13146: 36:   ];
13147: 37:   pos = 0;
13148: 38:   taging = false;
13149: 39:   tagValue = '';
13150: 40: 
13151: 41:   private setActive(): void {
13152: 42:     const key = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
13153: 43:     const idx = this.tabs.findIndex(w => w.key === key);
13154: 44:     if (idx !== -1) {
13155: 45:       this.pos = idx;
13156: 46:     }
13157: 47:   }
13158: 48: 
13159: 49:   ngOnInit(): void {
13160: 50:     zip(this.http.get('/user/current'), this.http.get('/api/notice')).subscribe(([user, notice]) => {
13161: 51:       this.user = user;
13162: 52:       this.notice = notice;
13163: 53:       this.cdr.detectChanges();
13164: 54:     });
13165: 55:     this.router$ = this.router.events.pipe(filter(e => e instanceof ActivationEnd)).subscribe(() => this.setActive());
13166: 56:     this.setActive();
13167: 57:   }
13168: 58: 
13169: 59:   to(item: { key: string }): void {
13170: 60:     this.router.navigateByUrl(`/pro/account/center/${item.key}`);
13171: 61:   }
13172: 62:   tagShowIpt(): void {
13173: 63:     this.taging = true;
13174: 64:     this.cdr.detectChanges();
13175: 65:     this.tagInput.nativeElement.focus();
13176: 66:   }
13177: 67: 
13178: 68:   tagBlur(): void {
13179: 69:     const { user, cdr, tagValue } = this;
13180: 70:     if (tagValue && user.tags.filter((tag: { label: string }) => tag.label === tagValue).length === 0) {
13181: 71:       user.tags.push({ label: tagValue });
13182: 72:     }
13183: 73:     this.tagValue = '';
13184: 74:     this.taging = false;
13185: 75:     cdr.detectChanges();
13186: 76:   }
13187: 77: 
13188: 78:   tagEnter(e: KeyboardEvent): void {
13189: 79:     if (e.key === 'Enter') {
13190: 80:       this.tagBlur();
13191: 81:     }
13192: 82:   }
13193: 83: 
13194: 84:   ngOnDestroy(): void {
13195: 85:     this.router$.unsubscribe();
13196: 86:   }
13197: 87: }
13198: ````
13199: 
13200: ## File: src/app/routes/pro/account/center/projects/projects.component.ts
13201: ````typescript
13202:  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
13203:  2: import { _HttpClient } from '@delon/theme';
13204:  3: import { SHARED_IMPORTS } from '@shared';
13205:  4: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
13206:  5: import { NzMessageService } from 'ng-zorro-antd/message';
13207:  6: 
13208:  7: @Component({
13209:  8:   selector: 'app-account-center-projects',
13210:  9:   templateUrl: './projects.component.html',
13211: 10:   styleUrls: ['./projects.component.less'],
13212: 11:   changeDetection: ChangeDetectionStrategy.OnPush,
13213: 12:   imports: [...SHARED_IMPORTS, NzAvatarModule]
13214: 13: })
13215: 14: export class ProAccountCenterProjectsComponent {
13216: 15:   private readonly http = inject(_HttpClient);
13217: 16:   private readonly msg = inject(NzMessageService);
13218: 17:   private readonly cdr = inject(ChangeDetectorRef);
13219: 18: 
13220: 19:   listLoading = true;
13221: 20:   list: any[] = [];
13222: 21: 
13223: 22:   constructor() {
13224: 23:     this.http.get('/api/list', { count: 8 }).subscribe(res => {
13225: 24:       this.list = res;
13226: 25:       this.listLoading = false;
13227: 26:       this.cdr.detectChanges();
13228: 27:     });
13229: 28:   }
13230: 29: 
13231: 30:   suc(id: number): void {
13232: 31:     this.msg.success(`标题：${id}`);
13233: 32:   }
13234: 33: }
13235: ````
13236: 
13237: ## File: src/app/routes/pro/account/settings/base/base.component.ts
13238: ````typescript
13239:  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
13240:  2: import { _HttpClient } from '@delon/theme';
13241:  3: import { SHARED_IMPORTS } from '@shared';
13242:  4: import { NzMessageService } from 'ng-zorro-antd/message';
13243:  5: import { NzUploadComponent } from 'ng-zorro-antd/upload';
13244:  6: import { zip } from 'rxjs';
13245:  7: 
13246:  8: interface ProAccountSettingsUser {
13247:  9:   email: string;
13248: 10:   name: string;
13249: 11:   profile: string;
13250: 12:   country: string;
13251: 13:   address: string;
13252: 14:   phone: string;
13253: 15:   avatar: string;
13254: 16:   geographic: {
13255: 17:     province: {
13256: 18:       key: string;
13257: 19:     };
13258: 20:     city: {
13259: 21:       key: string;
13260: 22:     };
13261: 23:   };
13262: 24: }
13263: 25: 
13264: 26: interface ProAccountSettingsCity {
13265: 27:   name: string;
13266: 28:   id: string;
13267: 29: }
13268: 30: 
13269: 31: @Component({
13270: 32:   selector: 'app-account-settings-base',
13271: 33:   templateUrl: './base.component.html',
13272: 34:   styleUrls: ['./base.component.less'],
13273: 35:   changeDetection: ChangeDetectionStrategy.OnPush,
13274: 36:   imports: [...SHARED_IMPORTS, NzUploadComponent]
13275: 37: })
13276: 38: export class ProAccountSettingsBaseComponent implements OnInit {
13277: 39:   private readonly http = inject(_HttpClient);
13278: 40:   private readonly cdr = inject(ChangeDetectorRef);
13279: 41:   private readonly msg = inject(NzMessageService);
13280: 42: 
13281: 43:   avatar = '';
13282: 44:   userLoading = true;
13283: 45:   user!: ProAccountSettingsUser;
13284: 46: 
13285: 47:   // #region geo
13286: 48: 
13287: 49:   provinces: ProAccountSettingsCity[] = [];
13288: 50:   cities: ProAccountSettingsCity[] = [];
13289: 51: 
13290: 52:   ngOnInit(): void {
13291: 53:     zip(this.http.get('/user/current'), this.http.get('/geo/province')).subscribe(
13292: 54:       ([user, province]: [ProAccountSettingsUser, ProAccountSettingsCity[]]) => {
13293: 55:         this.userLoading = false;
13294: 56:         this.user = user;
13295: 57:         this.provinces = province;
13296: 58:         this.choProvince(user.geographic.province.key, false);
13297: 59:         this.cdr.detectChanges();
13298: 60:       }
13299: 61:     );
13300: 62:   }
13301: 63: 
13302: 64:   choProvince(pid: string, cleanCity = true): void {
13303: 65:     this.http.get(`/geo/${pid}`).subscribe(res => {
13304: 66:       this.cities = res;
13305: 67:       if (cleanCity) {
13306: 68:         this.user.geographic.city.key = '';
13307: 69:       }
13308: 70:       this.cdr.detectChanges();
13309: 71:     });
13310: 72:   }
13311: 73: 
13312: 74:   // #endregion
13313: 75: 
13314: 76:   save(): boolean {
13315: 77:     this.msg.success(JSON.stringify(this.user));
13316: 78:     return false;
13317: 79:   }
13318: 80: }
13319: ````
13320: 
13321: ## File: src/app/routes/pro/account/settings/binding/binding.component.ts
13322: ````typescript
13323:  1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
13324:  2: import { SHARED_IMPORTS } from '@shared';
13325:  3: import { NzMessageService } from 'ng-zorro-antd/message';
13326:  4: 
13327:  5: @Component({
13328:  6:   selector: 'app-account-settings-binding',
13329:  7:   templateUrl: './binding.component.html',
13330:  8:   changeDetection: ChangeDetectionStrategy.OnPush,
13331:  9:   imports: SHARED_IMPORTS
13332: 10: })
13333: 11: export class ProAccountSettingsBindingComponent {
13334: 12:   readonly msg = inject(NzMessageService);
13335: 13: }
13336: ````
13337: 
13338: ## File: src/app/routes/pro/account/settings/notification/notification.component.ts
13339: ````typescript
13340:  1: import { ChangeDetectionStrategy, Component } from '@angular/core';
13341:  2: import { SHARED_IMPORTS } from '@shared';
13342:  3: 
13343:  4: @Component({
13344:  5:   selector: 'app-account-settings-notification',
13345:  6:   templateUrl: './notification.component.html',
13346:  7:   changeDetection: ChangeDetectionStrategy.OnPush,
13347:  8:   imports: SHARED_IMPORTS
13348:  9: })
13349: 10: export class ProAccountSettingsNotificationComponent {
13350: 11:   i: {
13351: 12:     password: boolean;
13352: 13:     messages: boolean;
13353: 14:     todo: boolean;
13354: 15:   } = {
13355: 16:     password: true,
13356: 17:     messages: true,
13357: 18:     todo: true
13358: 19:   };
13359: 20: }
13360: ````
13361: 
13362: ## File: src/app/routes/pro/account/settings/security/security.component.ts
13363: ````typescript
13364:  1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
13365:  2: import { SHARED_IMPORTS } from '@shared';
13366:  3: import { NzMessageService } from 'ng-zorro-antd/message';
13367:  4: 
13368:  5: @Component({
13369:  6:   selector: 'app-account-settings-security',
13370:  7:   templateUrl: './security.component.html',
13371:  8:   changeDetection: ChangeDetectionStrategy.OnPush,
13372:  9:   imports: SHARED_IMPORTS
13373: 10: })
13374: 11: export class ProAccountSettingsSecurityComponent {
13375: 12:   readonly msg = inject(NzMessageService);
13376: 13: }
13377: ````
13378: 
13379: ## File: src/app/routes/pro/account/settings/settings.component.ts
13380: ````typescript
13381:  1: import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, inject } from '@angular/core';
13382:  2: import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
13383:  3: import { ActivationEnd, Router } from '@angular/router';
13384:  4: import { SHARED_IMPORTS } from '@shared';
13385:  5: import { NzMenuModeType } from 'ng-zorro-antd/menu';
13386:  6: import { fromEvent, debounceTime, filter } from 'rxjs';
13387:  7: 
13388:  8: @Component({
13389:  9:   selector: 'app-account-settings',
13390: 10:   templateUrl: './settings.component.html',
13391: 11:   styleUrls: ['./settings.component.less'],
13392: 12:   changeDetection: ChangeDetectionStrategy.OnPush,
13393: 13:   imports: SHARED_IMPORTS
13394: 14: })
13395: 15: export class ProAccountSettingsComponent implements AfterViewInit {
13396: 16:   private readonly router = inject(Router);
13397: 17:   private readonly cdr = inject(ChangeDetectorRef);
13398: 18:   private readonly el: HTMLElement = inject(ElementRef).nativeElement;
13399: 19:   private readonly d$ = inject(DestroyRef);
13400: 20:   mode: NzMenuModeType = 'inline';
13401: 21:   title!: string;
13402: 22:   menus: Array<{ key: string; title: string; selected?: boolean }> = [
13403: 23:     {
13404: 24:       key: 'base',
13405: 25:       title: '基本设置'
13406: 26:     },
13407: 27:     {
13408: 28:       key: 'security',
13409: 29:       title: '安全设置'
13410: 30:     },
13411: 31:     {
13412: 32:       key: 'binding',
13413: 33:       title: '账号绑定'
13414: 34:     },
13415: 35:     {
13416: 36:       key: 'notification',
13417: 37:       title: '新消息通知'
13418: 38:     }
13419: 39:   ];
13420: 40: 
13421: 41:   private setActive(): void {
13422: 42:     const key = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
13423: 43:     this.menus.forEach(i => {
13424: 44:       i.selected = i.key === key;
13425: 45:     });
13426: 46:     this.title = this.menus.find(w => w.selected)!.title;
13427: 47:     this.cdr.detectChanges();
13428: 48:   }
13429: 49: 
13430: 50:   to(item: { key: string }): void {
13431: 51:     this.router.navigateByUrl(`/pro/account/settings/${item.key}`);
13432: 52:   }
13433: 53: 
13434: 54:   private resize(): void {
13435: 55:     const el = this.el;
13436: 56:     let mode: NzMenuModeType = 'inline';
13437: 57:     const { offsetWidth } = el;
13438: 58:     if (offsetWidth < 641 && offsetWidth > 400) {
13439: 59:       mode = 'horizontal';
13440: 60:     }
13441: 61:     if (window.innerWidth < 768 && offsetWidth > 400) {
13442: 62:       mode = 'horizontal';
13443: 63:     }
13444: 64:     this.mode = mode;
13445: 65:     this.cdr.detectChanges();
13446: 66:   }
13447: 67: 
13448: 68:   ngAfterViewInit(): void {
13449: 69:     this.router.events
13450: 70:       .pipe(
13451: 71:         takeUntilDestroyed(this.d$),
13452: 72:         filter(e => e instanceof ActivationEnd)
13453: 73:       )
13454: 74:       .subscribe(() => this.setActive());
13455: 75: 
13456: 76:     fromEvent(window, 'resize')
13457: 77:       .pipe(takeUntilDestroyed(this.d$), debounceTime(200))
13458: 78:       .subscribe(() => this.resize());
13459: 79: 
13460: 80:     this.setActive();
13461: 81:   }
13462: 82: }
13463: ````
13464: 
13465: ## File: src/app/routes/pro/form/advanced-form/advanced-form.component.ts
13466: ````typescript
13467:   1: import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
13468:   2: import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
13469:   3: import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
13470:   4: import { SHARED_IMPORTS } from '@shared';
13471:   5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
13472:   6: 
13473:   7: interface UserForm {
13474:   8:   key: FormControl<string>;
13475:   9:   workId: FormControl<string>;
13476:  10:   name: FormControl<string>;
13477:  11:   department: FormControl<string>;
13478:  12: }
13479:  13: 
13480:  14: @Component({
13481:  15:   selector: 'app-advanced-form',
13482:  16:   templateUrl: './advanced-form.component.html',
13483:  17:   changeDetection: ChangeDetectionStrategy.OnPush,
13484:  18:   imports: [...SHARED_IMPORTS, FooterToolbarModule]
13485:  19: })
13486:  20: export class AdvancedFormComponent implements OnInit {
13487:  21:   editIndex = -1;
13488:  22:   editObj = {};
13489:  23:   form = new FormGroup({
13490:  24:     name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
13491:  25:     url: new FormControl('', { validators: [Validators.required] }),
13492:  26:     owner: new FormControl(undefined, { validators: [Validators.required] }),
13493:  27:     approver: new FormControl('', { validators: [Validators.required] }),
13494:  28:     date_range: new FormControl('', { validators: [Validators.required] }),
13495:  29:     type: new FormControl('', { validators: [Validators.required] }),
13496:  30:     name2: new FormControl('', { validators: [Validators.required] }),
13497:  31:     summary: new FormControl('', { validators: [Validators.required] }),
13498:  32:     owner2: new FormControl('', { validators: [Validators.required] }),
13499:  33:     approver2: new FormControl('', { validators: [Validators.required] }),
13500:  34:     time: new FormControl('', { validators: [Validators.required] }),
13501:  35:     type2: new FormControl('', { validators: [Validators.required] }),
13502:  36:     items: new FormArray<FormGroup<UserForm>>([])
13503:  37:   });
13504:  38:   users: Array<{ value: string; label: string }> = [
13505:  39:     { value: 'xiao', label: '付晓晓' },
13506:  40:     { value: 'mao', label: '周毛毛' }
13507:  41:   ];
13508:  42: 
13509:  43:   ngOnInit(): void {
13510:  44:     const userList = [
13511:  45:       {
13512:  46:         key: '1',
13513:  47:         workId: '00001',
13514:  48:         name: 'John Brown',
13515:  49:         department: 'New York No. 1 Lake Park'
13516:  50:       },
13517:  51:       {
13518:  52:         key: '2',
13519:  53:         workId: '00002',
13520:  54:         name: 'Jim Green',
13521:  55:         department: 'London No. 1 Lake Park'
13522:  56:       },
13523:  57:       {
13524:  58:         key: '3',
13525:  59:         workId: '00003',
13526:  60:         name: 'Joe Black',
13527:  61:         department: 'Sidney No. 1 Lake Park'
13528:  62:       }
13529:  63:     ];
13530:  64:     userList.forEach(i => {
13531:  65:       const field = this.createUser();
13532:  66:       field.patchValue(i);
13533:  67:       this.items.push(field);
13534:  68:     });
13535:  69:   }
13536:  70: 
13537:  71:   createUser(): FormGroup<UserForm> {
13538:  72:     return new FormGroup({
13539:  73:       key: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
13540:  74:       name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
13541:  75:       workId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
13542:  76:       department: new FormControl('', { nonNullable: true, validators: [Validators.required] })
13543:  77:     });
13544:  78:   }
13545:  79: 
13546:  80:   get items(): FormArray<FormGroup<UserForm>> {
13547:  81:     return this.form.controls.items;
13548:  82:   }
13549:  83: 
13550:  84:   add(): void {
13551:  85:     this.items.push(this.createUser());
13552:  86:     this.edit(this.items.length - 1);
13553:  87:   }
13554:  88: 
13555:  89:   del(index: number): void {
13556:  90:     this.items.removeAt(index);
13557:  91:   }
13558:  92: 
13559:  93:   edit(index: number): void {
13560:  94:     if (this.editIndex !== -1 && this.editObj) {
13561:  95:       this.items.at(this.editIndex).patchValue(this.editObj);
13562:  96:     }
13563:  97:     this.editObj = { ...this.items.at(index).value };
13564:  98:     this.editIndex = index;
13565:  99:   }
13566: 100: 
13567: 101:   save(index: number): void {
13568: 102:     const item = this.items.at(index);
13569: 103:     this.formValidity(item.controls);
13570: 104:     if (item.invalid) {
13571: 105:       return;
13572: 106:     }
13573: 107:     this.editIndex = -1;
13574: 108:   }
13575: 109: 
13576: 110:   cancel(index: number): void {
13577: 111:     const item = this.items.at(index);
13578: 112:     if (!item.value.key) {
13579: 113:       this.del(index);
13580: 114:     } else {
13581: 115:       item.patchValue(this.editObj);
13582: 116:     }
13583: 117:     this.editIndex = -1;
13584: 118:   }
13585: 119: 
13586: 120:   _submitForm(): void {
13587: 121:     this.formValidity(this.form.controls);
13588: 122:     if (this.form.invalid) {
13589: 123:       return;
13590: 124:     }
13591: 125:   }
13592: 126: 
13593: 127:   private formValidity(controls: NzSafeAny): void {
13594: 128:     Object.keys(controls).forEach(key => {
13595: 129:       const control = (controls as NzSafeAny)[key] as AbstractControl;
13596: 130:       control.markAsDirty();
13597: 131:       control.updateValueAndValidity();
13598: 132:     });
13599: 133:   }
13600: 134: }
13601: ````
13602: 
13603: ## File: src/app/routes/pro/form/basic-form/basic-form.component.ts
13604: ````typescript
13605:  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
13606:  2: import { FormControl, FormGroup, Validators } from '@angular/forms';
13607:  3: import { SHARED_IMPORTS } from '@shared';
13608:  4: import { NzMessageService } from 'ng-zorro-antd/message';
13609:  5: 
13610:  6: @Component({
13611:  7:   selector: 'app-basic-form',
13612:  8:   templateUrl: './basic-form.component.html',
13613:  9:   changeDetection: ChangeDetectionStrategy.OnPush,
13614: 10:   imports: SHARED_IMPORTS
13615: 11: })
13616: 12: export class BasicFormComponent {
13617: 13:   private readonly msg = inject(NzMessageService);
13618: 14:   private readonly cdr = inject(ChangeDetectorRef);
13619: 15: 
13620: 16:   form = new FormGroup({
13621: 17:     title: new FormControl('', Validators.required),
13622: 18:     date: new FormControl('', Validators.required),
13623: 19:     goal: new FormControl('', Validators.required),
13624: 20:     standard: new FormControl('', Validators.required),
13625: 21:     client: new FormControl(''),
13626: 22:     invites: new FormControl(''),
13627: 23:     weight: new FormControl(''),
13628: 24:     public: new FormControl(1, [Validators.min(1), Validators.max(3)]),
13629: 25:     publicUsers: new FormControl('')
13630: 26:   });
13631: 27:   submitting = false;
13632: 28: 
13633: 29:   submit(): void {
13634: 30:     this.submitting = true;
13635: 31:     setTimeout(() => {
13636: 32:       this.submitting = false;
13637: 33:       this.msg.success(`提交成功`);
13638: 34:       this.cdr.detectChanges();
13639: 35:     }, 1000);
13640: 36:   }
13641: 37: }
13642: ````
13643: 
13644: ## File: src/app/routes/pro/form/step-form/step-form.component.ts
13645: ````typescript
13646:  1: import { AfterViewInit, Component, inject } from '@angular/core';
13647:  2: import { SHARED_IMPORTS } from '@shared';
13648:  3: import { NzStepsModule } from 'ng-zorro-antd/steps';
13649:  4: 
13650:  5: import { Step1Component } from './step1.component';
13651:  6: import { Step2Component } from './step2.component';
13652:  7: import { Step3Component } from './step3.component';
13653:  8: import { TransferService } from './transfer.service';
13654:  9: 
13655: 10: @Component({
13656: 11:   selector: 'app-step-form',
13657: 12:   templateUrl: './step-form.component.html',
13658: 13:   styleUrls: ['./step-form.component.less'],
13659: 14:   providers: [TransferService],
13660: 15:   imports: [...SHARED_IMPORTS, NzStepsModule, Step1Component, Step2Component, Step3Component]
13661: 16: })
13662: 17: export class StepFormComponent implements AfterViewInit {
13663: 18:   private readonly srv = inject(TransferService);
13664: 19:   get item(): TransferService {
13665: 20:     return this.srv;
13666: 21:   }
13667: 22: 
13668: 23:   ngAfterViewInit(): void {
13669: 24:     console.log('item', this.item);
13670: 25:   }
13671: 26: }
13672: ````
13673: 
13674: ## File: src/app/routes/pro/form/step-form/step1.component.ts
13675: ````typescript
13676:  1: import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
13677:  2: import { FormControl, FormGroup, Validators } from '@angular/forms';
13678:  3: import { SHARED_IMPORTS } from '@shared';
13679:  4: 
13680:  5: import { TransferService } from './transfer.service';
13681:  6: 
13682:  7: @Component({
13683:  8:   selector: 'app-step1',
13684:  9:   templateUrl: './step1.component.html',
13685: 10:   changeDetection: ChangeDetectionStrategy.OnPush,
13686: 11:   imports: SHARED_IMPORTS
13687: 12: })
13688: 13: export class Step1Component implements OnInit {
13689: 14:   private readonly srv = inject(TransferService);
13690: 15: 
13691: 16:   form = new FormGroup({
13692: 17:     pay_account: new FormControl('', Validators.compose([Validators.required, Validators.email])),
13693: 18:     receiver_type: new FormControl('', Validators.required),
13694: 19:     receiver_account: new FormControl('', Validators.required),
13695: 20:     receiver_name: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)])),
13696: 21:     amount: new FormControl(
13697: 22:       '',
13698: 23:       Validators.compose([Validators.required, Validators.pattern(`[0-9]+`), Validators.min(1), Validators.max(10000 * 100)])
13699: 24:     )
13700: 25:   });
13701: 26: 
13702: 27:   get item(): TransferService {
13703: 28:     return this.srv;
13704: 29:   }
13705: 30: 
13706: 31:   ngOnInit(): void {
13707: 32:     this.form.patchValue(this.item as any);
13708: 33:   }
13709: 34: 
13710: 35:   _submitForm(): void {
13711: 36:     Object.assign(this.item, this.form.value);
13712: 37:     ++this.item.step;
13713: 38:   }
13714: 39: }
13715: ````
13716: 
13717: ## File: src/app/routes/pro/form/step-form/step2.component.ts
13718: ````typescript
13719:  1: import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
13720:  2: import { FormControl, FormGroup, Validators } from '@angular/forms';
13721:  3: import { SHARED_IMPORTS } from '@shared';
13722:  4: 
13723:  5: import { TransferService } from './transfer.service';
13724:  6: 
13725:  7: @Component({
13726:  8:   selector: 'app-step2',
13727:  9:   templateUrl: './step2.component.html',
13728: 10:   changeDetection: ChangeDetectionStrategy.OnPush,
13729: 11:   imports: SHARED_IMPORTS
13730: 12: })
13731: 13: export class Step2Component implements OnInit {
13732: 14:   private readonly srv = inject(TransferService);
13733: 15: 
13734: 16:   form = new FormGroup({
13735: 17:     password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
13736: 18:   });
13737: 19:   loading = false;
13738: 20:   get item(): TransferService {
13739: 21:     return this.srv;
13740: 22:   }
13741: 23: 
13742: 24:   ngOnInit(): void {
13743: 25:     this.form.patchValue(this.item);
13744: 26:   }
13745: 27: 
13746: 28:   _submitForm(): void {
13747: 29:     this.loading = true;
13748: 30:     setTimeout(() => {
13749: 31:       this.loading = false;
13750: 32:       ++this.item.step;
13751: 33:     }, 500);
13752: 34:   }
13753: 35: 
13754: 36:   prev(): void {
13755: 37:     --this.item.step;
13756: 38:   }
13757: 39: }
13758: ````
13759: 
13760: ## File: src/app/routes/pro/form/step-form/step3.component.ts
13761: ````typescript
13762:  1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
13763:  2: import { SHARED_IMPORTS } from '@shared';
13764:  3: import { NzResultModule } from 'ng-zorro-antd/result';
13765:  4: 
13766:  5: import { TransferService } from './transfer.service';
13767:  6: 
13768:  7: @Component({
13769:  8:   selector: 'app-step3',
13770:  9:   templateUrl: './step3.component.html',
13771: 10:   changeDetection: ChangeDetectionStrategy.OnPush,
13772: 11:   imports: [...SHARED_IMPORTS, NzResultModule]
13773: 12: })
13774: 13: export class Step3Component {
13775: 14:   private readonly srv = inject(TransferService);
13776: 15: 
13777: 16:   get item(): TransferService {
13778: 17:     return this.srv;
13779: 18:   }
13780: 19: }
13781: ````
13782: 
13783: ## File: src/app/routes/pro/form/step-form/transfer.service.ts
13784: ````typescript
13785:  1: import { Injectable } from '@angular/core';
13786:  2: 
13787:  3: @Injectable()
13788:  4: export class TransferService {
13789:  5:   step = 1;
13790:  6: 
13791:  7:   /**
13792:  8:    * 付款账户
13793:  9:    */
13794: 10:   pay_account = '';
13795: 11: 
13796: 12:   /**
13797: 13:    * 收款账户类型
13798: 14:    */
13799: 15:   receiver_type: 'alipay' | 'bank' = 'alipay';
13800: 16: 
13801: 17:   get receiver_type_str(): string {
13802: 18:     return this.receiver_type === 'alipay' ? '支付宝' : '银行';
13803: 19:   }
13804: 20: 
13805: 21:   /**
13806: 22:    * 收款账户
13807: 23:    */
13808: 24:   receiver_account = '';
13809: 25: 
13810: 26:   /**
13811: 27:    * 收款姓名
13812: 28:    */
13813: 29:   receiver_name = '';
13814: 30: 
13815: 31:   /**
13816: 32:    * 金额
13817: 33:    */
13818: 34:   amount = 500;
13819: 35: 
13820: 36:   /**
13821: 37:    * 支付密码
13822: 38:    */
13823: 39:   password = '123456';
13824: 40: 
13825: 41:   again(): void {
13826: 42:     this.step = 0;
13827: 43:     this.pay_account = 'ant-design@alipay.com';
13828: 44:     this.receiver_type = 'alipay';
13829: 45:     this.receiver_account = 'test@example.com';
13830: 46:     this.receiver_name = 'asdf';
13831: 47:     this.amount = 500;
13832: 48:   }
13833: 49: 
13834: 50:   constructor() {
13835: 51:     this.again();
13836: 52:   }
13837: 53: }
13838: ````
13839: 
13840: ## File: src/app/routes/pro/list/applications/applications.component.ts
13841: ````typescript
13842:  1: import { DecimalPipe } from '@angular/common';
13843:  2: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
13844:  3: import { TagSelectComponent } from '@delon/abc/tag-select';
13845:  4: import { _HttpClient } from '@delon/theme';
13846:  5: import { SHARED_IMPORTS } from '@shared';
13847:  6: 
13848:  7: interface ProListApplicationListItem {
13849:  8:   title: string;
13850:  9:   avatar: string;
13851: 10:   activeUser: string | number;
13852: 11:   newUser: number;
13853: 12: }
13854: 13: 
13855: 14: @Component({
13856: 15:   selector: 'app-list-applications',
13857: 16:   templateUrl: './applications.component.html',
13858: 17:   styleUrls: ['./applications.component.less'],
13859: 18:   changeDetection: ChangeDetectionStrategy.OnPush,
13860: 19:   imports: [...SHARED_IMPORTS, TagSelectComponent, DecimalPipe]
13861: 20: })
13862: 21: export class ProListApplicationsComponent implements OnInit {
13863: 22:   private readonly http = inject(_HttpClient);
13864: 23:   private readonly cdr = inject(ChangeDetectorRef);
13865: 24: 
13866: 25:   q = {
13867: 26:     ps: 8,
13868: 27:     user: null,
13869: 28:     rate: null,
13870: 29:     categories: [],
13871: 30:     owners: ['zxx']
13872: 31:   };
13873: 32: 
13874: 33:   list: ProListApplicationListItem[] = [];
13875: 34: 
13876: 35:   loading = true;
13877: 36: 
13878: 37:   // region: cateogry
13879: 38:   categories = [
13880: 39:     { id: 0, text: '全部', value: false },
13881: 40:     { id: 1, text: '类目一', value: false },
13882: 41:     { id: 2, text: '类目二', value: false },
13883: 42:     { id: 3, text: '类目三', value: false },
13884: 43:     { id: 4, text: '类目四', value: false },
13885: 44:     { id: 5, text: '类目五', value: false },
13886: 45:     { id: 6, text: '类目六', value: false },
13887: 46:     { id: 7, text: '类目七', value: false },
13888: 47:     { id: 8, text: '类目八', value: false },
13889: 48:     { id: 9, text: '类目九', value: false },
13890: 49:     { id: 10, text: '类目十', value: false },
13891: 50:     { id: 11, text: '类目十一', value: false },
13892: 51:     { id: 12, text: '类目十二', value: false }
13893: 52:   ];
13894: 53: 
13895: 54:   changeCategory(status: boolean, idx: number): void {
13896: 55:     if (idx === 0) {
13897: 56:       this.categories.map(i => (i.value = status));
13898: 57:     } else {
13899: 58:       this.categories[idx].value = status;
13900: 59:     }
13901: 60:     this.getData();
13902: 61:   }
13903: 62:   // endregion
13904: 63: 
13905: 64:   ngOnInit(): void {
13906: 65:     this.getData();
13907: 66:   }
13908: 67: 
13909: 68:   getData(): void {
13910: 69:     this.loading = true;
13911: 70:     this.http.get('/api/list', { count: this.q.ps }).subscribe(res => {
13912: 71:       this.list = res.map((item: ProListApplicationListItem) => {
13913: 72:         item.activeUser = this.formatWan(item.activeUser as number);
13914: 73:         return item;
13915: 74:       });
13916: 75:       this.loading = false;
13917: 76:       this.cdr.detectChanges();
13918: 77:     });
13919: 78:   }
13920: 79: 
13921: 80:   private formatWan(val: number): string | number {
13922: 81:     const v = val * 1;
13923: 82:     if (!v || isNaN(v)) {
13924: 83:       return '';
13925: 84:     }
13926: 85: 
13927: 86:     let result: number | string = val;
13928: 87:     if (val > 10000) {
13929: 88:       result = Math.floor(val / 10000);
13930: 89:       result = `${result}`;
13931: 90:     }
13932: 91:     return result;
13933: 92:   }
13934: 93: }
13935: ````
13936: 
13937: ## File: src/app/routes/pro/list/articles/articles.component.ts
13938: ````typescript
13939:  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
13940:  2: import { TagSelectComponent } from '@delon/abc/tag-select';
13941:  3: import { _HttpClient } from '@delon/theme';
13942:  4: import { SHARED_IMPORTS } from '@shared';
13943:  5: 
13944:  6: @Component({
13945:  7:   selector: 'app-list-articles',
13946:  8:   templateUrl: './articles.component.html',
13947:  9:   changeDetection: ChangeDetectionStrategy.OnPush,
13948: 10:   imports: [...SHARED_IMPORTS, TagSelectComponent]
13949: 11: })
13950: 12: export class ProListArticlesComponent implements OnInit {
13951: 13:   private readonly http = inject(_HttpClient);
13952: 14:   private readonly cdr = inject(ChangeDetectorRef);
13953: 15: 
13954: 16:   q = {
13955: 17:     ps: 5,
13956: 18:     categories: [],
13957: 19:     owners: ['zxx'],
13958: 20:     user: '',
13959: 21:     rate: ''
13960: 22:   };
13961: 23: 
13962: 24:   list: any[] = [];
13963: 25:   loading = false;
13964: 26: 
13965: 27:   categories = [
13966: 28:     { id: 0, text: '全部', value: false },
13967: 29:     { id: 1, text: '类目一', value: false },
13968: 30:     { id: 2, text: '类目二', value: false },
13969: 31:     { id: 3, text: '类目三', value: false },
13970: 32:     { id: 4, text: '类目四', value: false },
13971: 33:     { id: 5, text: '类目五', value: false },
13972: 34:     { id: 6, text: '类目六', value: false },
13973: 35:     { id: 7, text: '类目七', value: false },
13974: 36:     { id: 8, text: '类目八', value: false },
13975: 37:     { id: 9, text: '类目九', value: false },
13976: 38:     { id: 10, text: '类目十', value: false },
13977: 39:     { id: 11, text: '类目十一', value: false },
13978: 40:     { id: 12, text: '类目十二', value: false }
13979: 41:   ];
13980: 42: 
13981: 43:   owners = [
13982: 44:     {
13983: 45:       id: 'wzj',
13984: 46:       name: '我自己'
13985: 47:     },
13986: 48:     {
13987: 49:       id: 'wjh',
13988: 50:       name: '吴家豪'
13989: 51:     },
13990: 52:     {
13991: 53:       id: 'zxx',
13992: 54:       name: '周星星'
13993: 55:     },
13994: 56:     {
13995: 57:       id: 'zly',
13996: 58:       name: '赵丽颖'
13997: 59:     },
13998: 60:     {
13999: 61:       id: 'ym',
14000: 62:       name: '姚明'
14001: 63:     }
14002: 64:   ];
14003: 65: 
14004: 66:   changeCategory(status: boolean, idx: number): void {
14005: 67:     if (idx === 0) {
14006: 68:       this.categories.map(i => (i.value = status));
14007: 69:     } else {
14008: 70:       this.categories[idx].value = status;
14009: 71:     }
14010: 72:   }
14011: 73: 
14012: 74:   setOwner(): void {
14013: 75:     this.q.owners = [`wzj`];
14014: 76:     // TODO: wait nz-dropdown OnPush mode
14015: 77:     setTimeout(() => this.cdr.detectChanges());
14016: 78:   }
14017: 79: 
14018: 80:   ngOnInit(): void {
14019: 81:     this.getData();
14020: 82:   }
14021: 83: 
14022: 84:   getData(more = false): void {
14023: 85:     this.loading = true;
14024: 86:     this.http.get('/api/list', { count: this.q.ps }).subscribe(res => {
14025: 87:       this.list = more ? this.list.concat(res) : res;
14026: 88:       this.loading = false;
14027: 89:       this.cdr.detectChanges();
14028: 90:     });
14029: 91:   }
14030: 92: }
14031: ````
14032: 
14033: ## File: src/app/routes/pro/list/basic-list/basic-list.component.ts
14034: ````typescript
14035:  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
14036:  2: import { ModalHelper, _HttpClient } from '@delon/theme';
14037:  3: import { SHARED_IMPORTS } from '@shared';
14038:  4: import { NzMessageService } from 'ng-zorro-antd/message';
14039:  5: import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
14040:  6: 
14041:  7: import { ProBasicListEditComponent } from './edit/edit.component';
14042:  8: 
14043:  9: @Component({
14044: 10:   selector: 'app-basic-list',
14045: 11:   templateUrl: './basic-list.component.html',
14046: 12:   styleUrls: ['./basic-list.component.less'],
14047: 13:   changeDetection: ChangeDetectionStrategy.OnPush,
14048: 14:   imports: [...SHARED_IMPORTS, NzPaginationComponent]
14049: 15: })
14050: 16: export class ProBasicListComponent implements OnInit {
14051: 17:   private readonly http = inject(_HttpClient);
14052: 18:   private readonly msg = inject(NzMessageService);
14053: 19:   private readonly modal = inject(ModalHelper);
14054: 20:   private readonly cdr = inject(ChangeDetectorRef);
14055: 21: 
14056: 22:   q = {
14057: 23:     q: '',
14058: 24:     status: 'all'
14059: 25:   };
14060: 26:   loading = false;
14061: 27:   data: Array<{
14062: 28:     id: number;
14063: 29:     title: string;
14064: 30:     subDescription: string;
14065: 31:     href: string;
14066: 32:     logo: string;
14067: 33:     owner: string;
14068: 34:     createdAt: Date;
14069: 35:     percent: number;
14070: 36:     status: string;
14071: 37:   }> = [];
14072: 38: 
14073: 39:   ngOnInit(): void {
14074: 40:     this.getData();
14075: 41:   }
14076: 42: 
14077: 43:   getData(): void {
14078: 44:     this.loading = true;
14079: 45:     this.http.get('/api/list', { count: 5 }).subscribe(res => {
14080: 46:       this.data = res;
14081: 47:       this.loading = false;
14082: 48:       this.cdr.detectChanges();
14083: 49:     });
14084: 50:   }
14085: 51: 
14086: 52:   openEdit(record: { id?: number } = {}): void {
14087: 53:     this.modal.create(ProBasicListEditComponent, { record }, { size: 'md' }).subscribe(res => {
14088: 54:       if (record.id) {
14089: 55:         record = { ...record, id: 'mock_id', percent: 0, ...res };
14090: 56:       } else {
14091: 57:         this.data.splice(0, 0, res);
14092: 58:         this.data = [...this.data];
14093: 59:       }
14094: 60:       this.cdr.detectChanges();
14095: 61:     });
14096: 62:   }
14097: 63: 
14098: 64:   remove(title: string): void {
14099: 65:     this.msg.success(`删除：${title}`);
14100: 66:   }
14101: 67: }
14102: ````
14103: 
14104: ## File: src/app/routes/pro/list/basic-list/edit/edit.component.ts
14105: ````typescript
14106:  1: import { Component, inject } from '@angular/core';
14107:  2: import { SFSchema } from '@delon/form';
14108:  3: import { SHARED_IMPORTS } from '@shared';
14109:  4: import { NzMessageService } from 'ng-zorro-antd/message';
14110:  5: import { NzModalRef } from 'ng-zorro-antd/modal';
14111:  6: 
14112:  7: @Component({
14113:  8:   selector: 'app-basic-list-edit',
14114:  9:   templateUrl: './edit.component.html',
14115: 10:   imports: SHARED_IMPORTS
14116: 11: })
14117: 12: export class ProBasicListEditComponent {
14118: 13:   private readonly modal = inject(NzModalRef);
14119: 14:   private readonly msgSrv = inject(NzMessageService);
14120: 15: 
14121: 16:   record: any = {};
14122: 17:   schema: SFSchema = {
14123: 18:     properties: {
14124: 19:       title: { type: 'string', title: '任务名称', maxLength: 50 },
14125: 20:       createdAt: { type: 'string', title: '开始时间', format: 'date' },
14126: 21:       owner: {
14127: 22:         type: 'string',
14128: 23:         title: '任务负责人',
14129: 24:         enum: [
14130: 25:           { value: 'asdf', label: 'asdf' },
14131: 26:           { value: '卡色', label: '卡色' },
14132: 27:           { value: 'cipchk', label: 'cipchk' }
14133: 28:         ]
14134: 29:       },
14135: 30:       subDescription: {
14136: 31:         type: 'string',
14137: 32:         title: '产品描述',
14138: 33:         ui: {
14139: 34:           widget: 'textarea',
14140: 35:           autosize: { minRows: 2, maxRows: 6 }
14141: 36:         }
14142: 37:       }
14143: 38:     },
14144: 39:     required: ['title', 'createdAt', 'owner'],
14145: 40:     ui: {
14146: 41:       spanLabelFixed: 150,
14147: 42:       grid: { span: 24 }
14148: 43:     }
14149: 44:   };
14150: 45: 
14151: 46:   save(value: any): void {
14152: 47:     this.msgSrv.success('保存成功');
14153: 48:     this.modal.close(value);
14154: 49:   }
14155: 50: 
14156: 51:   close(): void {
14157: 52:     this.modal.destroy();
14158: 53:   }
14159: 54: }
14160: ````
14161: 
14162: ## File: src/app/routes/pro/list/card-list/card-list.component.ts
14163: ````typescript
14164:  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
14165:  2: import { EllipsisComponent } from '@delon/abc/ellipsis';
14166:  3: import { _HttpClient } from '@delon/theme';
14167:  4: import { SHARED_IMPORTS } from '@shared';
14168:  5: import { NzMessageService } from 'ng-zorro-antd/message';
14169:  6: 
14170:  7: @Component({
14171:  8:   selector: 'app-list-card-list',
14172:  9:   templateUrl: './card-list.component.html',
14173: 10:   styles: [
14174: 11:     `
14175: 12:       :host ::ng-deep .ant-card-meta-title {
14176: 13:         margin-bottom: 12px;
14177: 14:       }
14178: 15:     `
14179: 16:   ],
14180: 17:   encapsulation: ViewEncapsulation.Emulated,
14181: 18:   changeDetection: ChangeDetectionStrategy.OnPush,
14182: 19:   imports: [...SHARED_IMPORTS, EllipsisComponent]
14183: 20: })
14184: 21: export class ProCardListComponent implements OnInit {
14185: 22:   private readonly http = inject(_HttpClient);
14186: 23:   private readonly msg = inject(NzMessageService);
14187: 24:   private readonly cdr = inject(ChangeDetectorRef);
14188: 25: 
14189: 26:   list: Array<{ id: number; title: string; avatar: string; description: string } | null> = [null];
14190: 27: 
14191: 28:   loading = true;
14192: 29: 
14193: 30:   ngOnInit(): void {
14194: 31:     this.loading = true;
14195: 32:     this.http.get('/api/list', { count: 8 }).subscribe(res => {
14196: 33:       this.list = this.list.concat(res);
14197: 34:       this.loading = false;
14198: 35:       this.cdr.detectChanges();
14199: 36:     });
14200: 37:   }
14201: 38: 
14202: 39:   show(text: string): void {
14203: 40:     this.msg.success(text);
14204: 41:   }
14205: 42: }
14206: ````
14207: 
14208: ## File: src/app/routes/pro/list/list/list.component.ts
14209: ````typescript
14210:  1: import { Component, DestroyRef, OnInit, inject } from '@angular/core';
14211:  2: import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
14212:  3: import { ActivationEnd, Router } from '@angular/router';
14213:  4: import { SHARED_IMPORTS } from '@shared';
14214:  5: import { filter } from 'rxjs';
14215:  6: 
14216:  7: @Component({
14217:  8:   selector: 'app-list-layout',
14218:  9:   templateUrl: './list.component.html',
14219: 10:   imports: SHARED_IMPORTS
14220: 11: })
14221: 12: export class ProListLayoutComponent implements OnInit {
14222: 13:   private readonly router = inject(Router);
14223: 14:   private readonly d$ = inject(DestroyRef);
14224: 15: 
14225: 16:   tabs = [
14226: 17:     {
14227: 18:       key: 'articles',
14228: 19:       tab: '文章'
14229: 20:     },
14230: 21:     {
14231: 22:       key: 'applications',
14232: 23:       tab: '应用'
14233: 24:     },
14234: 25:     {
14235: 26:       key: 'projects',
14236: 27:       tab: '项目'
14237: 28:     }
14238: 29:   ];
14239: 30: 
14240: 31:   pos = 0;
14241: 32: 
14242: 33:   private setActive(): void {
14243: 34:     const key = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
14244: 35:     const idx = this.tabs.findIndex(w => w.key === key);
14245: 36:     if (idx !== -1) {
14246: 37:       this.pos = idx;
14247: 38:     }
14248: 39:   }
14249: 40: 
14250: 41:   ngOnInit(): void {
14251: 42:     this.router.events
14252: 43:       .pipe(
14253: 44:         takeUntilDestroyed(this.d$),
14254: 45:         filter(e => e instanceof ActivationEnd)
14255: 46:       )
14256: 47:       .subscribe(() => this.setActive());
14257: 48:     this.setActive();
14258: 49:   }
14259: 50: 
14260: 51:   to(item: { key: string }): void {
14261: 52:     this.router.navigateByUrl(`/pro/list/${item.key}`);
14262: 53:   }
14263: 54: }
14264: ````
14265: 
14266: ## File: src/app/routes/pro/list/projects/projects.component.ts
14267: ````typescript
14268:  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
14269:  2: import { TagSelectComponent } from '@delon/abc/tag-select';
14270:  3: import { _HttpClient } from '@delon/theme';
14271:  4: import { SHARED_IMPORTS } from '@shared';
14272:  5: import { NzMessageService } from 'ng-zorro-antd/message';
14273:  6: 
14274:  7: @Component({
14275:  8:   selector: 'app-list-projects',
14276:  9:   templateUrl: './projects.component.html',
14277: 10:   styleUrls: ['./projects.component.less'],
14278: 11:   changeDetection: ChangeDetectionStrategy.OnPush,
14279: 12:   imports: [...SHARED_IMPORTS, TagSelectComponent]
14280: 13: })
14281: 14: export class ProListProjectsComponent implements OnInit {
14282: 15:   private readonly http = inject(_HttpClient);
14283: 16:   readonly msg = inject(NzMessageService);
14284: 17:   private readonly cdr = inject(ChangeDetectorRef);
14285: 18: 
14286: 19:   q = {
14287: 20:     ps: 8,
14288: 21:     categories: [],
14289: 22:     owners: ['zxx'],
14290: 23:     user: null,
14291: 24:     rate: null
14292: 25:   };
14293: 26:   list: any[] = [];
14294: 27:   loading = true;
14295: 28: 
14296: 29:   categories = [
14297: 30:     { id: 0, text: '全部', value: false },
14298: 31:     { id: 1, text: '类目一', value: false },
14299: 32:     { id: 2, text: '类目二', value: false },
14300: 33:     { id: 3, text: '类目三', value: false },
14301: 34:     { id: 4, text: '类目四', value: false },
14302: 35:     { id: 5, text: '类目五', value: false },
14303: 36:     { id: 6, text: '类目六', value: false },
14304: 37:     { id: 7, text: '类目七', value: false },
14305: 38:     { id: 8, text: '类目八', value: false },
14306: 39:     { id: 9, text: '类目九', value: false },
14307: 40:     { id: 10, text: '类目十', value: false },
14308: 41:     { id: 11, text: '类目十一', value: false },
14309: 42:     { id: 12, text: '类目十二', value: false }
14310: 43:   ];
14311: 44: 
14312: 45:   changeCategory(status: boolean, idx: number): void {
14313: 46:     if (idx === 0) {
14314: 47:       this.categories.map(i => (i.value = status));
14315: 48:     } else {
14316: 49:       this.categories[idx].value = status;
14317: 50:     }
14318: 51:     this.getData();
14319: 52:   }
14320: 53: 
14321: 54:   ngOnInit(): void {
14322: 55:     this.getData();
14323: 56:   }
14324: 57: 
14325: 58:   getData(): void {
14326: 59:     this.loading = true;
14327: 60:     this.http.get('/api/list', { count: this.q.ps }).subscribe(res => {
14328: 61:       this.list = this.list.concat(res);
14329: 62:       this.loading = false;
14330: 63:       this.cdr.detectChanges();
14331: 64:     });
14332: 65:   }
14333: 66: }
14334: ````
14335: 
14336: ## File: src/app/routes/pro/list/table-list/table-list.component.ts
14337: ````typescript
14338:   1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
14339:   2: import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
14340:   3: import { _HttpClient } from '@delon/theme';
14341:   4: import { SHARED_IMPORTS } from '@shared';
14342:   5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
14343:   6: import { NzMessageService } from 'ng-zorro-antd/message';
14344:   7: import { NzModalService } from 'ng-zorro-antd/modal';
14345:   8: import { map, tap } from 'rxjs';
14346:   9: 
14347:  10: @Component({
14348:  11:   selector: 'app-table-list',
14349:  12:   templateUrl: './table-list.component.html',
14350:  13:   changeDetection: ChangeDetectionStrategy.OnPush,
14351:  14:   imports: SHARED_IMPORTS
14352:  15: })
14353:  16: export class ProTableListComponent implements OnInit {
14354:  17:   private readonly http = inject(_HttpClient);
14355:  18:   private readonly msg = inject(NzMessageService);
14356:  19:   private readonly modalSrv = inject(NzModalService);
14357:  20:   private readonly cdr = inject(ChangeDetectorRef);
14358:  21: 
14359:  22:   q: {
14360:  23:     pi: number;
14361:  24:     ps: number;
14362:  25:     no: string;
14363:  26:     sorter: string;
14364:  27:     status: number | null;
14365:  28:     statusList: NzSafeAny[];
14366:  29:   } = {
14367:  30:     pi: 1,
14368:  31:     ps: 10,
14369:  32:     no: '',
14370:  33:     sorter: '',
14371:  34:     status: null,
14372:  35:     statusList: []
14373:  36:   };
14374:  37:   data: any[] = [];
14375:  38:   loading = false;
14376:  39:   status = [
14377:  40:     { index: 0, text: '关闭', value: false, type: 'default', checked: false },
14378:  41:     {
14379:  42:       index: 1,
14380:  43:       text: '运行中',
14381:  44:       value: false,
14382:  45:       type: 'processing',
14383:  46:       checked: false
14384:  47:     },
14385:  48:     { index: 2, text: '已上线', value: false, type: 'success', checked: false },
14386:  49:     { index: 3, text: '异常', value: false, type: 'error', checked: false }
14387:  50:   ];
14388:  51:   @ViewChild('st', { static: true })
14389:  52:   st!: STComponent;
14390:  53:   columns: STColumn[] = [
14391:  54:     { title: '', index: 'key', type: 'checkbox' },
14392:  55:     { title: '规则编号', index: 'no' },
14393:  56:     { title: '描述', index: 'description' },
14394:  57:     {
14395:  58:       title: '服务调用次数',
14396:  59:       index: 'callNo',
14397:  60:       type: 'number',
14398:  61:       format: item => `${item.callNo} 万`,
14399:  62:       sort: {
14400:  63:         compare: (a, b) => a.callNo - b.callNo
14401:  64:       }
14402:  65:     },
14403:  66:     {
14404:  67:       title: '状态',
14405:  68:       index: 'status',
14406:  69:       render: 'status',
14407:  70:       filter: {
14408:  71:         menus: this.status,
14409:  72:         fn: (filter, record) => record.status === filter['index']
14410:  73:       }
14411:  74:     },
14412:  75:     {
14413:  76:       title: '更新时间',
14414:  77:       index: 'updatedAt',
14415:  78:       type: 'date',
14416:  79:       sort: {
14417:  80:         compare: (a, b) => a.updatedAt - b.updatedAt
14418:  81:       }
14419:  82:     },
14420:  83:     {
14421:  84:       title: '操作',
14422:  85:       buttons: [
14423:  86:         {
14424:  87:           text: '配置',
14425:  88:           click: item => this.msg.success(`配置${item.no}`)
14426:  89:         },
14427:  90:         {
14428:  91:           text: '订阅警报',
14429:  92:           click: item => this.msg.success(`订阅警报${item.no}`)
14430:  93:         }
14431:  94:       ]
14432:  95:     }
14433:  96:   ];
14434:  97:   selectedRows: STData[] = [];
14435:  98:   description = '';
14436:  99:   totalCallNo = 0;
14437: 100:   expandForm = false;
14438: 101: 
14439: 102:   ngOnInit(): void {
14440: 103:     this.getData();
14441: 104:   }
14442: 105: 
14443: 106:   getData(): void {
14444: 107:     this.loading = true;
14445: 108:     this.q.statusList = this.status.filter(w => w.checked).map(item => item.index);
14446: 109:     if (this.q.status !== null && this.q.status > -1) {
14447: 110:       this.q.statusList.push(this.q.status);
14448: 111:     }
14449: 112:     this.http
14450: 113:       .get('/rule', this.q)
14451: 114:       .pipe(
14452: 115:         map((list: Array<{ status: number; statusText: string; statusType: string }>) =>
14453: 116:           list.map(i => {
14454: 117:             const statusItem = this.status[i.status];
14455: 118:             i.statusText = statusItem.text;
14456: 119:             i.statusType = statusItem.type;
14457: 120:             return i;
14458: 121:           })
14459: 122:         ),
14460: 123:         tap(() => (this.loading = false))
14461: 124:       )
14462: 125:       .subscribe(res => {
14463: 126:         this.data = res;
14464: 127:         this.cdr.detectChanges();
14465: 128:       });
14466: 129:   }
14467: 130: 
14468: 131:   stChange(e: STChange): void {
14469: 132:     switch (e.type) {
14470: 133:       case 'checkbox':
14471: 134:         this.selectedRows = e.checkbox!;
14472: 135:         this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv['callNo'], 0);
14473: 136:         this.cdr.detectChanges();
14474: 137:         break;
14475: 138:       case 'filter':
14476: 139:         this.getData();
14477: 140:         break;
14478: 141:     }
14479: 142:   }
14480: 143: 
14481: 144:   remove(): void {
14482: 145:     this.http.delete('/rule', { nos: this.selectedRows.map(i => i['no']).join(',') }).subscribe(() => {
14483: 146:       this.getData();
14484: 147:       this.st.clearCheck();
14485: 148:     });
14486: 149:   }
14487: 150: 
14488: 151:   approval(): void {
14489: 152:     this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
14490: 153:   }
14491: 154: 
14492: 155:   add(tpl: TemplateRef<unknown>): void {
14493: 156:     this.modalSrv.create({
14494: 157:       nzTitle: '新建规则',
14495: 158:       nzContent: tpl,
14496: 159:       nzOnOk: () => {
14497: 160:         this.loading = true;
14498: 161:         this.http.post('/rule', { description: this.description }).subscribe(() => this.getData());
14499: 162:       }
14500: 163:     });
14501: 164:   }
14502: 165: 
14503: 166:   reset(): void {
14504: 167:     // wait form reset updated finished
14505: 168:     setTimeout(() => this.getData());
14506: 169:   }
14507: 170: }
14508: ````
14509: 
14510: ## File: src/app/routes/pro/profile/advanced/advanced.component.ts
14511: ````typescript
14512:  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
14513:  2: import { STColumn } from '@delon/abc/st';
14514:  3: import { _HttpClient } from '@delon/theme';
14515:  4: import { SHARED_IMPORTS } from '@shared';
14516:  5: import { NzSafeAny } from 'ng-zorro-antd/core/types';
14517:  6: import { NzMessageService } from 'ng-zorro-antd/message';
14518:  7: import { NzStepsModule } from 'ng-zorro-antd/steps';
14519:  8: import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
14520:  9: 
14521: 10: @Component({
14522: 11:   selector: 'app-profile-advanced',
14523: 12:   templateUrl: './advanced.component.html',
14524: 13:   styleUrls: ['./advanced.component.less'],
14525: 14:   changeDetection: ChangeDetectionStrategy.OnPush,
14526: 15:   imports: [...SHARED_IMPORTS, NzStepsModule]
14527: 16: })
14528: 17: export class ProProfileAdvancedComponent implements OnInit {
14529: 18:   readonly msg = inject(NzMessageService);
14530: 19:   private readonly http = inject(_HttpClient);
14531: 20:   private readonly cdr = inject(ChangeDetectorRef);
14532: 21: 
14533: 22:   list: Array<Record<string, NzSafeAny>> = [];
14534: 23:   data = {
14535: 24:     advancedOperation1: [],
14536: 25:     advancedOperation2: [],
14537: 26:     advancedOperation3: []
14538: 27:   };
14539: 28:   opColumns: STColumn[] = [
14540: 29:     { title: '操作类型', index: 'type' },
14541: 30:     { title: '操作人', index: 'name' },
14542: 31:     { title: '执行结果', index: 'status', render: 'status' },
14543: 32:     { title: '操作时间', index: 'updatedAt', type: 'date' },
14544: 33:     { title: '备注', index: 'memo', default: '-' }
14545: 34:   ];
14546: 35: 
14547: 36:   ngOnInit(): void {
14548: 37:     this.http.get('/profile/advanced').subscribe(res => {
14549: 38:       this.data = res;
14550: 39:       this.change({ index: 0, tab: null });
14551: 40:       this.cdr.detectChanges();
14552: 41:     });
14553: 42:   }
14554: 43: 
14555: 44:   change(args: NzTabChangeEvent): void {
14556: 45:     this.list = (this.data as NzSafeAny)[`advancedOperation${args.index! + 1}`];
14557: 46:   }
14558: 47: }
14559: ````
14560: 
14561: ## File: src/app/routes/pro/profile/basic/basic.component.ts
14562: ````typescript
14563:  1: import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
14564:  2: import { STColumn } from '@delon/abc/st';
14565:  3: import { _HttpClient } from '@delon/theme';
14566:  4: import { SHARED_IMPORTS } from '@shared';
14567:  5: import { NzMessageService } from 'ng-zorro-antd/message';
14568:  6: import { tap } from 'rxjs';
14569:  7: 
14570:  8: @Component({
14571:  9:   selector: 'app-profile-basic',
14572: 10:   templateUrl: './basic.component.html',
14573: 11:   changeDetection: ChangeDetectionStrategy.OnPush,
14574: 12:   imports: SHARED_IMPORTS
14575: 13: })
14576: 14: export class ProProfileBaseComponent {
14577: 15:   private readonly http = inject(_HttpClient);
14578: 16:   private readonly msg = inject(NzMessageService);
14579: 17: 
14580: 18:   basicNum = 0;
14581: 19:   amountNum = 0;
14582: 20:   goods = this.http.get('/profile/goods').pipe(
14583: 21:     tap((list: Array<{ num: number; amount: number }>) => {
14584: 22:       list.forEach(item => {
14585: 23:         this.basicNum += Number(item.num);
14586: 24:         this.amountNum += Number(item.amount);
14587: 25:       });
14588: 26:     })
14589: 27:   );
14590: 28:   goodsColumns: STColumn[] = [
14591: 29:     {
14592: 30:       title: '商品编号',
14593: 31:       index: 'id',
14594: 32:       type: 'link',
14595: 33:       click: item => this.msg.success(`show ${item.id}`)
14596: 34:     },
14597: 35:     { title: '商品名称', index: 'name' },
14598: 36:     { title: '商品条码', index: 'barcode' },
14599: 37:     { title: '单价', index: 'price', type: 'currency' },
14600: 38:     { title: '数量（件）', index: 'num', className: 'text-right' },
14601: 39:     { title: '金额', index: 'amount', type: 'currency' }
14602: 40:   ];
14603: 41:   progress = this.http.get('/profile/progress');
14604: 42:   progressColumns: STColumn[] = [
14605: 43:     { title: '时间', index: 'time' },
14606: 44:     { title: '当前进度', index: 'rate' },
14607: 45:     {
14608: 46:       title: '状态',
14609: 47:       index: 'status',
14610: 48:       type: 'badge',
14611: 49:       badge: {
14612: 50:         success: { text: '成功', color: 'success' },
14613: 51:         processing: { text: '进行中', color: 'processing' }
14614: 52:       }
14615: 53:     },
14616: 54:     { title: '操作员ID', index: 'operator' },
14617: 55:     { title: '耗时', index: 'cost' }
14618: 56:   ];
14619: 57: }
14620: ````
14621: 
14622: ## File: src/app/routes/pro/result/fail/fail.component.ts
14623: ````typescript
14624:  1: import { Component } from '@angular/core';
14625:  2: import { SHARED_IMPORTS } from '@shared';
14626:  3: import { NzResultModule } from 'ng-zorro-antd/result';
14627:  4: 
14628:  5: @Component({
14629:  6:   selector: 'app-result-fail',
14630:  7:   templateUrl: './fail.component.html',
14631:  8:   imports: [...SHARED_IMPORTS, NzResultModule]
14632:  9: })
14633: 10: export class ProResultFailComponent {}
14634: ````
14635: 
14636: ## File: src/app/routes/pro/result/success/success.component.ts
14637: ````typescript
14638:  1: import { Component, inject } from '@angular/core';
14639:  2: import { SHARED_IMPORTS } from '@shared';
14640:  3: import { NzMessageService } from 'ng-zorro-antd/message';
14641:  4: import { NzResultModule } from 'ng-zorro-antd/result';
14642:  5: import { NzStepsModule } from 'ng-zorro-antd/steps';
14643:  6: 
14644:  7: @Component({
14645:  8:   selector: 'app-result-success',
14646:  9:   templateUrl: './success.component.html',
14647: 10:   imports: [...SHARED_IMPORTS, NzResultModule, NzStepsModule]
14648: 11: })
14649: 12: export class ProResultSuccessComponent {
14650: 13:   readonly msg = inject(NzMessageService);
14651: 14: }
14652: ````
14653: 
14654: ## File: src/app/routes/pro/routes.ts
14655: ````typescript
14656:   1: import { Routes } from '@angular/router';
14657:   2: 
14658:   3: import { ProAccountCenterApplicationsComponent } from './account/center/applications/applications.component';
14659:   4: import { ProAccountCenterArticlesComponent } from './account/center/articles/articles.component';
14660:   5: import { ProAccountCenterComponent } from './account/center/center.component';
14661:   6: import { ProAccountCenterProjectsComponent } from './account/center/projects/projects.component';
14662:   7: import { ProAccountSettingsBaseComponent } from './account/settings/base/base.component';
14663:   8: import { ProAccountSettingsBindingComponent } from './account/settings/binding/binding.component';
14664:   9: import { ProAccountSettingsNotificationComponent } from './account/settings/notification/notification.component';
14665:  10: import { ProAccountSettingsSecurityComponent } from './account/settings/security/security.component';
14666:  11: import { ProAccountSettingsComponent } from './account/settings/settings.component';
14667:  12: import { AdvancedFormComponent } from './form/advanced-form/advanced-form.component';
14668:  13: import { BasicFormComponent } from './form/basic-form/basic-form.component';
14669:  14: import { StepFormComponent } from './form/step-form/step-form.component';
14670:  15: import { ProListApplicationsComponent } from './list/applications/applications.component';
14671:  16: import { ProListArticlesComponent } from './list/articles/articles.component';
14672:  17: import { ProBasicListComponent } from './list/basic-list/basic-list.component';
14673:  18: import { ProCardListComponent } from './list/card-list/card-list.component';
14674:  19: import { ProListLayoutComponent } from './list/list/list.component';
14675:  20: import { ProListProjectsComponent } from './list/projects/projects.component';
14676:  21: import { ProTableListComponent } from './list/table-list/table-list.component';
14677:  22: import { ProProfileAdvancedComponent } from './profile/advanced/advanced.component';
14678:  23: import { ProProfileBaseComponent } from './profile/basic/basic.component';
14679:  24: import { ProResultFailComponent } from './result/fail/fail.component';
14680:  25: import { ProResultSuccessComponent } from './result/success/success.component';
14681:  26: 
14682:  27: export const routes: Routes = [
14683:  28:   {
14684:  29:     path: 'form',
14685:  30:     children: [
14686:  31:       { path: 'basic-form', component: BasicFormComponent },
14687:  32:       { path: 'step-form', component: StepFormComponent },
14688:  33:       { path: 'advanced-form', component: AdvancedFormComponent }
14689:  34:     ]
14690:  35:   },
14691:  36:   {
14692:  37:     path: 'list',
14693:  38:     children: [
14694:  39:       { path: 'table-list', component: ProTableListComponent },
14695:  40:       { path: 'basic-list', component: ProBasicListComponent },
14696:  41:       { path: 'card-list', component: ProCardListComponent },
14697:  42:       {
14698:  43:         path: '',
14699:  44:         component: ProListLayoutComponent,
14700:  45:         children: [
14701:  46:           { path: 'articles', component: ProListArticlesComponent },
14702:  47:           { path: 'projects', component: ProListProjectsComponent },
14703:  48:           { path: 'applications', component: ProListApplicationsComponent }
14704:  49:         ]
14705:  50:       }
14706:  51:     ]
14707:  52:   },
14708:  53:   {
14709:  54:     path: 'profile',
14710:  55:     children: [
14711:  56:       { path: 'basic', component: ProProfileBaseComponent },
14712:  57:       { path: 'advanced', component: ProProfileAdvancedComponent }
14713:  58:     ]
14714:  59:   },
14715:  60:   {
14716:  61:     path: 'result',
14717:  62:     children: [
14718:  63:       { path: 'success', component: ProResultSuccessComponent },
14719:  64:       { path: 'fail', component: ProResultFailComponent }
14720:  65:     ]
14721:  66:   },
14722:  67:   {
14723:  68:     path: 'account',
14724:  69:     children: [
14725:  70:       {
14726:  71:         path: 'center',
14727:  72:         component: ProAccountCenterComponent,
14728:  73:         children: [
14729:  74:           { path: '', redirectTo: 'articles', pathMatch: 'full' },
14730:  75:           {
14731:  76:             path: 'articles',
14732:  77:             component: ProAccountCenterArticlesComponent,
14733:  78:             data: { titleI18n: 'pro-account-center' }
14734:  79:           },
14735:  80:           {
14736:  81:             path: 'projects',
14737:  82:             component: ProAccountCenterProjectsComponent,
14738:  83:             data: { titleI18n: 'pro-account-center' }
14739:  84:           },
14740:  85:           {
14741:  86:             path: 'applications',
14742:  87:             component: ProAccountCenterApplicationsComponent,
14743:  88:             data: { titleI18n: 'pro-account-center' }
14744:  89:           }
14745:  90:         ]
14746:  91:       },
14747:  92:       {
14748:  93:         path: 'settings',
14749:  94:         component: ProAccountSettingsComponent,
14750:  95:         children: [
14751:  96:           { path: '', redirectTo: 'base', pathMatch: 'full' },
14752:  97:           {
14753:  98:             path: 'base',
14754:  99:             component: ProAccountSettingsBaseComponent,
14755: 100:             data: { titleI18n: 'pro-account-settings' }
14756: 101:           },
14757: 102:           {
14758: 103:             path: 'security',
14759: 104:             component: ProAccountSettingsSecurityComponent,
14760: 105:             data: { titleI18n: 'pro-account-settings' }
14761: 106:           },
14762: 107:           {
14763: 108:             path: 'binding',
14764: 109:             component: ProAccountSettingsBindingComponent,
14765: 110:             data: { titleI18n: 'pro-account-settings' }
14766: 111:           },
14767: 112:           {
14768: 113:             path: 'notification',
14769: 114:             component: ProAccountSettingsNotificationComponent,
14770: 115:             data: { titleI18n: 'pro-account-settings' }
14771: 116:           }
14772: 117:         ]
14773: 118:       }
14774: 119:     ]
14775: 120:   }
14776: 121: ];
14777: ````
14778: 
14779: ## File: src/app/routes/quality/checks/quality-checks.component.ts
14780: ````typescript
14781:  1: import { Component, OnInit, inject } from '@angular/core';
14782:  2: import { SHARED_IMPORTS } from '@shared';
14783:  3: 
14784:  4: @Component({
14785:  5:   selector: 'app-quality-checks',
14786:  6:   standalone: true,
14787:  7:   imports: [SHARED_IMPORTS],
14788:  8:   template: `
14789:  9:     <page-header [title]="'质量检查'"></page-header>
14790: 10: 
14791: 11:     <nz-card nzTitle="质量检查管理" style="margin-top: 16px;">
14792: 12:       <nz-alert
14793: 13:         nzType="info"
14794: 14:         nzMessage="质量检查功能开发中"
14795: 15:         nzDescription="此页面将用于管理质量检查。"
14796: 16:         [nzShowIcon]="true"
14797: 17:         style="margin-bottom: 16px;"
14798: 18:       ></nz-alert>
14799: 19: 
14800: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
14801: 21:     </nz-card>
14802: 22:   `
14803: 23: })
14804: 24: export class QualityChecksComponent implements OnInit {
14805: 25:   ngOnInit(): void {
14806: 26:     // TODO: 加载质量检查数据
14807: 27:   }
14808: 28: }
14809: ````
14810: 
14811: ## File: src/app/routes/quality/inspections/quality-inspections.component.ts
14812: ````typescript
14813:  1: import { Component, OnInit, inject } from '@angular/core';
14814:  2: import { SHARED_IMPORTS } from '@shared';
14815:  3: 
14816:  4: @Component({
14817:  5:   selector: 'app-quality-inspections',
14818:  6:   standalone: true,
14819:  7:   imports: [SHARED_IMPORTS],
14820:  8:   template: `
14821:  9:     <page-header [title]="'验收管理'"></page-header>
14822: 10: 
14823: 11:     <nz-card nzTitle="验收管理" style="margin-top: 16px;">
14824: 12:       <nz-alert
14825: 13:         nzType="info"
14826: 14:         nzMessage="验收管理功能开发中"
14827: 15:         nzDescription="此页面将用于管理验收流程。"
14828: 16:         [nzShowIcon]="true"
14829: 17:         style="margin-bottom: 16px;"
14830: 18:       ></nz-alert>
14831: 19: 
14832: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
14833: 21:     </nz-card>
14834: 22:   `
14835: 23: })
14836: 24: export class QualityInspectionsComponent implements OnInit {
14837: 25:   ngOnInit(): void {
14838: 26:     // TODO: 加载验收管理数据
14839: 27:   }
14840: 28: }
14841: ````
14842: 
14843: ## File: src/app/routes/quality/photos/quality-photos.component.ts
14844: ````typescript
14845:  1: import { Component, OnInit, inject } from '@angular/core';
14846:  2: import { SHARED_IMPORTS } from '@shared';
14847:  3: 
14848:  4: @Component({
14849:  5:   selector: 'app-quality-photos',
14850:  6:   standalone: true,
14851:  7:   imports: [SHARED_IMPORTS],
14852:  8:   template: `
14853:  9:     <page-header [title]="'验收照片'"></page-header>
14854: 10: 
14855: 11:     <nz-card nzTitle="验收照片管理" style="margin-top: 16px;">
14856: 12:       <nz-alert
14857: 13:         nzType="info"
14858: 14:         nzMessage="验收照片功能开发中"
14859: 15:         nzDescription="此页面将用于管理验收照片。"
14860: 16:         [nzShowIcon]="true"
14861: 17:         style="margin-bottom: 16px;"
14862: 18:       ></nz-alert>
14863: 19: 
14864: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
14865: 21:     </nz-card>
14866: 22:   `
14867: 23: })
14868: 24: export class QualityPhotosComponent implements OnInit {
14869: 25:   ngOnInit(): void {
14870: 26:     // TODO: 加载验收照片数据
14871: 27:   }
14872: 28: }
14873: ````
14874: 
14875: ## File: src/app/routes/quality/results/quality-results.component.ts
14876: ````typescript
14877:  1: import { Component, OnInit, inject } from '@angular/core';
14878:  2: import { SHARED_IMPORTS } from '@shared';
14879:  3: 
14880:  4: @Component({
14881:  5:   selector: 'app-quality-results',
14882:  6:   standalone: true,
14883:  7:   imports: [SHARED_IMPORTS],
14884:  8:   template: `
14885:  9:     <page-header [title]="'验收结果'"></page-header>
14886: 10: 
14887: 11:     <nz-card nzTitle="验收结果管理" style="margin-top: 16px;">
14888: 12:       <nz-alert
14889: 13:         nzType="info"
14890: 14:         nzMessage="验收结果功能开发中"
14891: 15:         nzDescription="此页面将用于查看和管理验收结果。"
14892: 16:         [nzShowIcon]="true"
14893: 17:         style="margin-bottom: 16px;"
14894: 18:       ></nz-alert>
14895: 19: 
14896: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
14897: 21:     </nz-card>
14898: 22:   `
14899: 23: })
14900: 24: export class QualityResultsComponent implements OnInit {
14901: 25:   ngOnInit(): void {
14902: 26:     // TODO: 加载验收结果数据
14903: 27:   }
14904: 28: }
14905: ````
14906: 
14907: ## File: src/app/routes/quality/routes.ts
14908: ````typescript
14909:  1: import { Routes } from '@angular/router';
14910:  2: 
14911:  3: export const QUALITY_ROUTES: Routes = [
14912:  4:   {
14913:  5:     path: '',
14914:  6:     redirectTo: 'checks',
14915:  7:     pathMatch: 'full'
14916:  8:   },
14917:  9:   {
14918: 10:     path: 'checks',
14919: 11:     loadComponent: () => import('./checks/quality-checks.component').then(m => m.QualityChecksComponent)
14920: 12:   },
14921: 13:   {
14922: 14:     path: 'submit',
14923: 15:     loadComponent: () => import('./submit/quality-submit.component').then(m => m.QualitySubmitComponent)
14924: 16:   },
14925: 17:   {
14926: 18:     path: 'inspections',
14927: 19:     loadComponent: () => import('./inspections/quality-inspections.component').then(m => m.QualityInspectionsComponent)
14928: 20:   },
14929: 21:   {
14930: 22:     path: 'photos',
14931: 23:     loadComponent: () => import('./photos/quality-photos.component').then(m => m.QualityPhotosComponent)
14932: 24:   },
14933: 25:   {
14934: 26:     path: 'results',
14935: 27:     loadComponent: () => import('./results/quality-results.component').then(m => m.QualityResultsComponent)
14936: 28:   }
14937: 29: ];
14938: ````
14939: 
14940: ## File: src/app/routes/quality/submit/quality-submit.component.ts
14941: ````typescript
14942:  1: import { Component, OnInit, inject } from '@angular/core';
14943:  2: import { SHARED_IMPORTS } from '@shared';
14944:  3: 
14945:  4: @Component({
14946:  5:   selector: 'app-quality-submit',
14947:  6:   standalone: true,
14948:  7:   imports: [SHARED_IMPORTS],
14949:  8:   template: `
14950:  9:     <page-header [title]="'提交验收'"></page-header>
14951: 10: 
14952: 11:     <nz-card nzTitle="提交验收申请" style="margin-top: 16px;">
14953: 12:       <nz-alert
14954: 13:         nzType="info"
14955: 14:         nzMessage="提交验收功能开发中"
14956: 15:         nzDescription="此页面将用于提交验收申请。"
14957: 16:         [nzShowIcon]="true"
14958: 17:         style="margin-bottom: 16px;"
14959: 18:       ></nz-alert>
14960: 19: 
14961: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
14962: 21:     </nz-card>
14963: 22:   `
14964: 23: })
14965: 24: export class QualitySubmitComponent implements OnInit {
14966: 25:   ngOnInit(): void {
14967: 26:     // TODO: 加载提交验收表单
14968: 27:   }
14969: 28: }
14970: ````
14971: 
14972: ## File: src/app/routes/style/color.service.ts
14973: ````typescript
14974:  1: import { Injectable } from '@angular/core';
14975:  2: 
14976:  3: @Injectable()
14977:  4: export class ColorService {
14978:  5:   APP_COLORS = {
14979:  6:     primary: '#1890ff',
14980:  7:     success: '#52c41a',
14981:  8:     error: '#f5222d',
14982:  9:     warning: '#fadb14',
14983: 10:     red: '#f5222d',
14984: 11:     volcano: '#fa541c',
14985: 12:     orange: '#fa8c16',
14986: 13:     gold: '#faad14',
14987: 14:     yellow: '#fadb14',
14988: 15:     lime: '#a0d911',
14989: 16:     green: '#52c41a',
14990: 17:     cyan: '#13c2c2',
14991: 18:     blue: '#1890ff',
14992: 19:     geekblue: '#2f54eb',
14993: 20:     purple: '#722ed1',
14994: 21:     magenta: '#eb2f96'
14995: 22:   };
14996: 23: 
14997: 24:   get names(): string[] {
14998: 25:     return Object.keys(this.APP_COLORS).filter((_, index) => index > 3);
14999: 26:   }
15000: 27: 
15001: 28:   get brands(): string[] {
15002: 29:     return ['primary', 'success', 'error', 'warning'];
15003: 30:   }
15004: 31: }
15005: ````
15006: 
15007: ## File: src/app/routes/style/colors/colors.component.ts
15008: ````typescript
15009:  1: import { Component, inject } from '@angular/core';
15010:  2: import { copy } from '@delon/util/browser';
15011:  3: import { SHARED_IMPORTS } from '@shared';
15012:  4: import { NzMessageService } from 'ng-zorro-antd/message';
15013:  5: 
15014:  6: import { ColorService } from '../color.service';
15015:  7: 
15016:  8: @Component({
15017:  9:   selector: 'app-colors',
15018: 10:   templateUrl: './colors.component.html',
15019: 11:   styleUrls: ['./colors.component.less'],
15020: 12:   imports: SHARED_IMPORTS
15021: 13: })
15022: 14: export class ColorsComponent {
15023: 15:   private readonly colorSrv = inject(ColorService);
15024: 16:   private readonly msg = inject(NzMessageService);
15025: 17: 
15026: 18:   nums = Array(10)
15027: 19:     .fill(1)
15028: 20:     .map((v, i) => v + i);
15029: 21: 
15030: 22:   get names(): string[] {
15031: 23:     return this.colorSrv.names;
15032: 24:   }
15033: 25: 
15034: 26:   get brands(): string[] {
15035: 27:     return this.colorSrv.brands;
15036: 28:   }
15037: 29: 
15038: 30:   onCopy(str: string): void {
15039: 31:     copy(str).then(() => this.msg.success(`Copied Success!`));
15040: 32:   }
15041: 33: }
15042: ````
15043: 
15044: ## File: src/app/routes/style/gridmasonry/gridmasonry.component.ts
15045: ````typescript
15046:  1: import { Component } from '@angular/core';
15047:  2: import { SHARED_IMPORTS } from '@shared';
15048:  3: 
15049:  4: @Component({
15050:  5:   selector: 'app-gridmasonry',
15051:  6:   templateUrl: './gridmasonry.component.html',
15052:  7:   styleUrls: ['./gridmasonry.component.less'],
15053:  8:   imports: SHARED_IMPORTS
15054:  9: })
15055: 10: export class GridMasonryComponent {}
15056: ````
15057: 
15058: ## File: src/app/routes/style/routes.ts
15059: ````typescript
15060:  1: import { Routes } from '@angular/router';
15061:  2: 
15062:  3: import { ColorService } from './color.service';
15063:  4: import { ColorsComponent } from './colors/colors.component';
15064:  5: import { GridMasonryComponent } from './gridmasonry/gridmasonry.component';
15065:  6: import { TypographyComponent } from './typography/typography.component';
15066:  7: 
15067:  8: export const routes: Routes = [
15068:  9:   {
15069: 10:     path: '',
15070: 11:     providers: [ColorService],
15071: 12:     children: [
15072: 13:       { path: 'gridmasonry', component: GridMasonryComponent },
15073: 14:       { path: 'typography', component: TypographyComponent },
15074: 15:       { path: 'colors', component: ColorsComponent }
15075: 16:     ]
15076: 17:   }
15077: 18: ];
15078: ````
15079: 
15080: ## File: src/app/routes/style/typography/typography.component.ts
15081: ````typescript
15082:  1: import { Component, inject } from '@angular/core';
15083:  2: import { SHARED_IMPORTS } from '@shared';
15084:  3: 
15085:  4: import { ColorService } from '../color.service';
15086:  5: 
15087:  6: @Component({
15088:  7:   selector: 'app-typography',
15089:  8:   templateUrl: './typography.component.html',
15090:  9:   imports: SHARED_IMPORTS
15091: 10: })
15092: 11: export class TypographyComponent {
15093: 12:   private readonly colorSrv = inject(ColorService);
15094: 13:   get names(): string[] {
15095: 14:     return this.colorSrv.names;
15096: 15:   }
15097: 16: }
15098: ````
15099: 
15100: ## File: src/app/routes/tasks/assignments/task-assignments.component.ts
15101: ````typescript
15102:  1: import { Component, OnInit, inject } from '@angular/core';
15103:  2: import { SHARED_IMPORTS } from '@shared';
15104:  3: 
15105:  4: @Component({
15106:  5:   selector: 'app-task-assignments',
15107:  6:   standalone: true,
15108:  7:   imports: [SHARED_IMPORTS],
15109:  8:   template: `
15110:  9:     <page-header [title]="'任务分配'"></page-header>
15111: 10: 
15112: 11:     <nz-card nzTitle="任务分配管理" style="margin-top: 16px;">
15113: 12:       <nz-alert
15114: 13:         nzType="info"
15115: 14:         nzMessage="任务分配功能开发中"
15116: 15:         nzDescription="此页面将用于管理任务的分配。"
15117: 16:         [nzShowIcon]="true"
15118: 17:         style="margin-bottom: 16px;"
15119: 18:       ></nz-alert>
15120: 19: 
15121: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
15122: 21:     </nz-card>
15123: 22:   `
15124: 23: })
15125: 24: export class TaskAssignmentsComponent implements OnInit {
15126: 25:   ngOnInit(): void {
15127: 26:     // TODO: 加载任务分配数据
15128: 27:   }
15129: 28: }
15130: ````
15131: 
15132: ## File: src/app/routes/tasks/board/task-board.component.ts
15133: ````typescript
15134:  1: import { Component, OnInit, inject } from '@angular/core';
15135:  2: import { SHARED_IMPORTS } from '@shared';
15136:  3: 
15137:  4: @Component({
15138:  5:   selector: 'app-task-board',
15139:  6:   standalone: true,
15140:  7:   imports: [SHARED_IMPORTS],
15141:  8:   template: `
15142:  9:     <page-header [title]="'任务看板'"></page-header>
15143: 10: 
15144: 11:     <nz-card nzTitle="任务看板视图" style="margin-top: 16px;">
15145: 12:       <nz-alert
15146: 13:         nzType="info"
15147: 14:         nzMessage="任务看板功能开发中"
15148: 15:         nzDescription="此页面将用于以看板形式展示任务。"
15149: 16:         [nzShowIcon]="true"
15150: 17:         style="margin-bottom: 16px;"
15151: 18:       ></nz-alert>
15152: 19: 
15153: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
15154: 21:     </nz-card>
15155: 22:   `
15156: 23: })
15157: 24: export class TaskBoardComponent implements OnInit {
15158: 25:   ngOnInit(): void {
15159: 26:     // TODO: 加载任务看板数据
15160: 27:   }
15161: 28: }
15162: ````
15163: 
15164: ## File: src/app/routes/tasks/calendar/task-calendar.component.ts
15165: ````typescript
15166:  1: import { Component, OnInit, inject } from '@angular/core';
15167:  2: import { SHARED_IMPORTS } from '@shared';
15168:  3: 
15169:  4: @Component({
15170:  5:   selector: 'app-task-calendar',
15171:  6:   standalone: true,
15172:  7:   imports: [SHARED_IMPORTS],
15173:  8:   template: `
15174:  9:     <page-header [title]="'任务日历'"></page-header>
15175: 10: 
15176: 11:     <nz-card nzTitle="任务日历视图" style="margin-top: 16px;">
15177: 12:       <nz-alert
15178: 13:         nzType="info"
15179: 14:         nzMessage="任务日历功能开发中"
15180: 15:         nzDescription="此页面将用于以日历形式展示任务。"
15181: 16:         [nzShowIcon]="true"
15182: 17:         style="margin-bottom: 16px;"
15183: 18:       ></nz-alert>
15184: 19: 
15185: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
15186: 21:     </nz-card>
15187: 22:   `
15188: 23: })
15189: 24: export class TaskCalendarComponent implements OnInit {
15190: 25:   ngOnInit(): void {
15191: 26:     // TODO: 加载任务日历数据
15192: 27:   }
15193: 28: }
15194: ````
15195: 
15196: ## File: src/app/routes/tasks/daily-reports/daily-reports.component.ts
15197: ````typescript
15198:  1: import { Component, OnInit, inject } from '@angular/core';
15199:  2: import { SHARED_IMPORTS } from '@shared';
15200:  3: 
15201:  4: @Component({
15202:  5:   selector: 'app-daily-reports',
15203:  6:   standalone: true,
15204:  7:   imports: [SHARED_IMPORTS],
15205:  8:   template: `
15206:  9:     <page-header [title]="'日报管理'"></page-header>
15207: 10: 
15208: 11:     <nz-card nzTitle="每日工作报告" style="margin-top: 16px;">
15209: 12:       <nz-alert
15210: 13:         nzType="info"
15211: 14:         nzMessage="日报功能开发中"
15212: 15:         nzDescription="此页面将用于管理每日工作报告。"
15213: 16:         [nzShowIcon]="true"
15214: 17:         style="margin-bottom: 16px;"
15215: 18:       ></nz-alert>
15216: 19: 
15217: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
15218: 21:     </nz-card>
15219: 22:   `
15220: 23: })
15221: 24: export class DailyReportsComponent implements OnInit {
15222: 25:   ngOnInit(): void {
15223: 26:     // TODO: 加载日报数据
15224: 27:   }
15225: 28: }
15226: ````
15227: 
15228: ## File: src/app/routes/tasks/detail/task-detail.component.ts
15229: ````typescript
15230:  1: import { Component, OnInit, inject } from '@angular/core';
15231:  2: import { ActivatedRoute, Router } from '@angular/router';
15232:  3: import { SHARED_IMPORTS } from '@shared';
15233:  4: import { NzMessageService } from 'ng-zorro-antd/message';
15234:  5: 
15235:  6: @Component({
15236:  7:   selector: 'app-task-detail',
15237:  8:   standalone: true,
15238:  9:   imports: [SHARED_IMPORTS],
15239: 10:   template: `
15240: 11:     <page-header [title]="'任务详情'">
15241: 12:       <ng-template #extra>
15242: 13:         <button nz-button (click)="edit()">编辑</button>
15243: 14:       </ng-template>
15244: 15:     </page-header>
15245: 16: 
15246: 17:     <nz-card nzTitle="任务详细信息" style="margin-top: 16px;">
15247: 18:       <nz-alert
15248: 19:         nzType="info"
15249: 20:         nzMessage="任务详情功能开发中"
15250: 21:         nzDescription="此页面将用于显示任务的详细信息。"
15251: 22:         [nzShowIcon]="true"
15252: 23:         style="margin-bottom: 16px;"
15253: 24:       ></nz-alert>
15254: 25: 
15255: 26:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
15256: 27:     </nz-card>
15257: 28:   `
15258: 29: })
15259: 30: export class TaskDetailComponent implements OnInit {
15260: 31:   route = inject(ActivatedRoute);
15261: 32:   router = inject(Router);
15262: 33:   message = inject(NzMessageService);
15263: 34: 
15264: 35:   taskId = '';
15265: 36: 
15266: 37:   ngOnInit(): void {
15267: 38:     this.taskId = this.route.snapshot.paramMap.get('id') || '';
15268: 39:     if (!this.taskId) {
15269: 40:       this.message.error('任务ID不存在');
15270: 41:       this.router.navigate(['/tasks']);
15271: 42:     }
15272: 43:   }
15273: 44: 
15274: 45:   edit(): void {
15275: 46:     this.router.navigate(['/tasks', this.taskId, 'edit']);
15276: 47:   }
15277: 48: }
15278: ````
15279: 
15280: ## File: src/app/routes/tasks/form/task-form.component.ts
15281: ````typescript
15282:  1: import { Component, OnInit, inject } from '@angular/core';
15283:  2: import { ActivatedRoute, Router } from '@angular/router';
15284:  3: import { SHARED_IMPORTS } from '@shared';
15285:  4: import { NzMessageService } from 'ng-zorro-antd/message';
15286:  5: 
15287:  6: @Component({
15288:  7:   selector: 'app-task-form',
15289:  8:   standalone: true,
15290:  9:   imports: [SHARED_IMPORTS],
15291: 10:   template: `
15292: 11:     <page-header [title]="isEdit ? '编辑任务' : '新建任务'"></page-header>
15293: 12: 
15294: 13:     <nz-card nzTitle="任务表单" style="margin-top: 16px;">
15295: 14:       <nz-alert
15296: 15:         nzType="info"
15297: 16:         nzMessage="任务表单功能开发中"
15298: 17:         nzDescription="此页面将用于创建或编辑任务。"
15299: 18:         [nzShowIcon]="true"
15300: 19:         style="margin-bottom: 16px;"
15301: 20:       ></nz-alert>
15302: 21: 
15303: 22:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
15304: 23:     </nz-card>
15305: 24:   `
15306: 25: })
15307: 26: export class TaskFormComponent implements OnInit {
15308: 27:   route = inject(ActivatedRoute);
15309: 28:   router = inject(Router);
15310: 29:   message = inject(NzMessageService);
15311: 30: 
15312: 31:   isEdit = false;
15313: 32:   taskId = '';
15314: 33: 
15315: 34:   ngOnInit(): void {
15316: 35:     this.taskId = this.route.snapshot.paramMap.get('id') || '';
15317: 36:     this.isEdit = !!this.taskId;
15318: 37:   }
15319: 38: }
15320: ````
15321: 
15322: ## File: src/app/routes/tasks/list/task-list.component.ts
15323: ````typescript
15324:  1: import { Component, OnInit, inject } from '@angular/core';
15325:  2: import { Router } from '@angular/router';
15326:  3: import { STColumn } from '@delon/abc/st';
15327:  4: import { SHARED_IMPORTS } from '@shared';
15328:  5: import { NzMessageService } from 'ng-zorro-antd/message';
15329:  6: 
15330:  7: @Component({
15331:  8:   selector: 'app-task-list',
15332:  9:   standalone: true,
15333: 10:   imports: [SHARED_IMPORTS],
15334: 11:   template: `
15335: 12:     <page-header [title]="'任务列表'">
15336: 13:       <ng-template #extra>
15337: 14:         <button nz-button nzType="primary" (click)="createTask()">
15338: 15:           <span nz-icon nzType="plus"></span>
15339: 16:           新建任务
15340: 17:         </button>
15341: 18:       </ng-template>
15342: 19:     </page-header>
15343: 20: 
15344: 21:     <nz-card nzTitle="任务树形视图" style="margin-top: 16px;">
15345: 22:       <nz-alert
15346: 23:         nzType="info"
15347: 24:         nzMessage="任务管理功能开发中"
15348: 25:         nzDescription="此页面将用于显示和管理所有任务。"
15349: 26:         [nzShowIcon]="true"
15350: 27:         style="margin-bottom: 16px;"
15351: 28:       ></nz-alert>
15352: 29: 
15353: 30:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
15354: 31:     </nz-card>
15355: 32:   `
15356: 33: })
15357: 34: export class TaskListComponent implements OnInit {
15358: 35:   router = inject(Router);
15359: 36:   message = inject(NzMessageService);
15360: 37: 
15361: 38:   ngOnInit(): void {
15362: 39:     // TODO: 加载任务列表
15363: 40:   }
15364: 41: 
15365: 42:   createTask(): void {
15366: 43:     this.router.navigate(['/tasks/create']);
15367: 44:   }
15368: 45: }
15369: ````
15370: 
15371: ## File: src/app/routes/tasks/photos/task-photos.component.ts
15372: ````typescript
15373:  1: import { Component, OnInit, inject } from '@angular/core';
15374:  2: import { SHARED_IMPORTS } from '@shared';
15375:  3: 
15376:  4: @Component({
15377:  5:   selector: 'app-task-photos',
15378:  6:   standalone: true,
15379:  7:   imports: [SHARED_IMPORTS],
15380:  8:   template: `
15381:  9:     <page-header [title]="'施工照片'"></page-header>
15382: 10: 
15383: 11:     <nz-card nzTitle="施工照片管理" style="margin-top: 16px;">
15384: 12:       <nz-alert
15385: 13:         nzType="info"
15386: 14:         nzMessage="施工照片功能开发中"
15387: 15:         nzDescription="此页面将用于管理施工照片。"
15388: 16:         [nzShowIcon]="true"
15389: 17:         style="margin-bottom: 16px;"
15390: 18:       ></nz-alert>
15391: 19: 
15392: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
15393: 21:     </nz-card>
15394: 22:   `
15395: 23: })
15396: 24: export class TaskPhotosComponent implements OnInit {
15397: 25:   ngOnInit(): void {
15398: 26:     // TODO: 加载施工照片数据
15399: 27:   }
15400: 28: }
15401: ````
15402: 
15403: ## File: src/app/routes/tasks/routes.ts
15404: ````typescript
15405:  1: import { Routes } from '@angular/router';
15406:  2: 
15407:  3: export const TASK_ROUTES: Routes = [
15408:  4:   {
15409:  5:     path: '',
15410:  6:     redirectTo: 'list',
15411:  7:     pathMatch: 'full'
15412:  8:   },
15413:  9:   {
15414: 10:     path: 'list',
15415: 11:     loadComponent: () => import('./list/task-list.component').then(m => m.TaskListComponent)
15416: 12:   },
15417: 13:   {
15418: 14:     path: 'board',
15419: 15:     loadComponent: () => import('./board/task-board.component').then(m => m.TaskBoardComponent)
15420: 16:   },
15421: 17:   {
15422: 18:     path: 'calendar',
15423: 19:     loadComponent: () => import('./calendar/task-calendar.component').then(m => m.TaskCalendarComponent)
15424: 20:   },
15425: 21:   {
15426: 22:     path: 'create',
15427: 23:     loadComponent: () => import('./form/task-form.component').then(m => m.TaskFormComponent)
15428: 24:   },
15429: 25:   {
15430: 26:     path: ':id',
15431: 27:     loadComponent: () => import('./detail/task-detail.component').then(m => m.TaskDetailComponent)
15432: 28:   },
15433: 29:   {
15434: 30:     path: ':id/edit',
15435: 31:     loadComponent: () => import('./form/task-form.component').then(m => m.TaskFormComponent)
15436: 32:   },
15437: 33:   {
15438: 34:     path: 'assignments',
15439: 35:     loadComponent: () => import('./assignments/task-assignments.component').then(m => m.TaskAssignmentsComponent)
15440: 36:   },
15441: 37:   {
15442: 38:     path: 'todo',
15443: 39:     loadComponent: () => import('./todo/task-todo.component').then(m => m.TaskTodoComponent)
15444: 40:   },
15445: 41:   {
15446: 42:     path: 'staging',
15447: 43:     loadComponent: () => import('./staging/task-staging.component').then(m => m.TaskStagingComponent)
15448: 44:   },
15449: 45:   {
15450: 46:     path: 'daily-reports',
15451: 47:     loadComponent: () => import('./daily-reports/daily-reports.component').then(m => m.DailyReportsComponent)
15452: 48:   },
15453: 49:   {
15454: 50:     path: 'photos',
15455: 51:     loadComponent: () => import('./photos/task-photos.component').then(m => m.TaskPhotosComponent)
15456: 52:   },
15457: 53:   {
15458: 54:     path: 'weather',
15459: 55:     loadComponent: () => import('./weather/task-weather.component').then(m => m.TaskWeatherComponent)
15460: 56:   }
15461: 57: ];
15462: ````
15463: 
15464: ## File: src/app/routes/tasks/staging/task-staging.component.ts
15465: ````typescript
15466:  1: import { Component, OnInit, inject } from '@angular/core';
15467:  2: import { SHARED_IMPORTS } from '@shared';
15468:  3: 
15469:  4: @Component({
15470:  5:   selector: 'app-task-staging',
15471:  6:   standalone: true,
15472:  7:   imports: [SHARED_IMPORTS],
15473:  8:   template: `
15474:  9:     <page-header [title]="'暂存区'"></page-header>
15475: 10: 
15476: 11:     <nz-card nzTitle="任务暂存区" style="margin-top: 16px;">
15477: 12:       <nz-alert
15478: 13:         nzType="info"
15479: 14:         nzMessage="暂存区功能开发中"
15480: 15:         nzDescription="此页面将用于管理48小时内可撤回的任务。"
15481: 16:         [nzShowIcon]="true"
15482: 17:         style="margin-bottom: 16px;"
15483: 18:       ></nz-alert>
15484: 19: 
15485: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
15486: 21:     </nz-card>
15487: 22:   `
15488: 23: })
15489: 24: export class TaskStagingComponent implements OnInit {
15490: 25:   ngOnInit(): void {
15491: 26:     // TODO: 加载暂存区数据
15492: 27:   }
15493: 28: }
15494: ````
15495: 
15496: ## File: src/app/routes/tasks/todo/task-todo.component.ts
15497: ````typescript
15498:  1: import { Component, OnInit, inject } from '@angular/core';
15499:  2: import { SHARED_IMPORTS } from '@shared';
15500:  3: 
15501:  4: @Component({
15502:  5:   selector: 'app-task-todo',
15503:  6:   standalone: true,
15504:  7:   imports: [SHARED_IMPORTS],
15505:  8:   template: `
15506:  9:     <page-header [title]="'待办列表'"></page-header>
15507: 10: 
15508: 11:     <nz-card nzTitle="任务待办列表" style="margin-top: 16px;">
15509: 12:       <nz-alert
15510: 13:         nzType="info"
15511: 14:         nzMessage="待办列表功能开发中"
15512: 15:         nzDescription="此页面将用于显示所有待办任务。"
15513: 16:         [nzShowIcon]="true"
15514: 17:         style="margin-bottom: 16px;"
15515: 18:       ></nz-alert>
15516: 19: 
15517: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
15518: 21:     </nz-card>
15519: 22:   `
15520: 23: })
15521: 24: export class TaskTodoComponent implements OnInit {
15522: 25:   ngOnInit(): void {
15523: 26:     // TODO: 加载待办列表数据
15524: 27:   }
15525: 28: }
15526: ````
15527: 
15528: ## File: src/app/routes/tasks/weather/task-weather.component.ts
15529: ````typescript
15530:  1: import { Component, OnInit, inject } from '@angular/core';
15531:  2: import { SHARED_IMPORTS } from '@shared';
15532:  3: 
15533:  4: @Component({
15534:  5:   selector: 'app-task-weather',
15535:  6:   standalone: true,
15536:  7:   imports: [SHARED_IMPORTS],
15537:  8:   template: `
15538:  9:     <page-header [title]="'天气记录'"></page-header>
15539: 10: 
15540: 11:     <nz-card nzTitle="天气记录管理" style="margin-top: 16px;">
15541: 12:       <nz-alert
15542: 13:         nzType="info"
15543: 14:         nzMessage="天气记录功能开发中"
15544: 15:         nzDescription="此页面将用于管理天气记录。"
15545: 16:         [nzShowIcon]="true"
15546: 17:         style="margin-bottom: 16px;"
15547: 18:       ></nz-alert>
15548: 19: 
15549: 20:       <nz-empty nzNotFoundContent="功能开发中"></nz-empty>
15550: 21:     </nz-card>
15551: 22:   `
15552: 23: })
15553: 24: export class TaskWeatherComponent implements OnInit {
15554: 25:   ngOnInit(): void {
15555: 26:     // TODO: 加载天气记录数据
15556: 27:   }
15557: 28: }
15558: ````
15559: 
15560: ## File: src/app/routes/widgets/routes.ts
15561: ````typescript
15562: 1: import { Routes } from '@angular/router';
15563: 2: 
15564: 3: import { WidgetsComponent } from './widgets/widgets.component';
15565: 4: 
15566: 5: export const routes: Routes = [{ path: '', component: WidgetsComponent }];
15567: ````
15568: 
15569: ## File: src/app/routes/widgets/widgets/widgets.component.ts
15570: ````typescript
15571:  1: import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
15572:  2: import { G2MiniAreaModule } from '@delon/chart/mini-area';
15573:  3: import { G2MiniBarData, G2MiniBarModule } from '@delon/chart/mini-bar';
15574:  4: import { _HttpClient } from '@delon/theme';
15575:  5: import { SHARED_IMPORTS } from '@shared';
15576:  6: import { NzCarouselModule } from 'ng-zorro-antd/carousel';
15577:  7: import { NzMessageService } from 'ng-zorro-antd/message';
15578:  8: 
15579:  9: @Component({
15580: 10:   selector: 'app-widgets',
15581: 11:   templateUrl: './widgets.component.html',
15582: 12:   styleUrls: ['./widgets.component.less'],
15583: 13:   changeDetection: ChangeDetectionStrategy.OnPush,
15584: 14:   imports: [...SHARED_IMPORTS, NzCarouselModule, G2MiniBarModule, G2MiniAreaModule]
15585: 15: })
15586: 16: export class WidgetsComponent implements OnInit {
15587: 17:   readonly msg = inject(NzMessageService);
15588: 18:   private readonly http = inject(_HttpClient);
15589: 19:   private readonly cdr = inject(ChangeDetectorRef);
15590: 20: 
15591: 21:   data: G2MiniBarData[] = [];
15592: 22:   smallData: G2MiniBarData[] = [];
15593: 23:   todoData: Array<{ completed: boolean; avatar: string; name: string; content: string }> = [
15594: 24:     {
15595: 25:       completed: true,
15596: 26:       avatar: '1',
15597: 27:       name: '苏先生',
15598: 28:       content: `请告诉我，我应该说点什么好？`
15599: 29:     },
15600: 30:     {
15601: 31:       completed: false,
15602: 32:       avatar: '2',
15603: 33:       name: 'はなさき',
15604: 34:       content: `ハルカソラトキヘダツヒカリ`
15605: 35:     },
15606: 36:     {
15607: 37:       completed: false,
15608: 38:       avatar: '3',
15609: 39:       name: 'cipchk',
15610: 40:       content: `this world was never meant for one as beautiful as you.`
15611: 41:     },
15612: 42:     {
15613: 43:       completed: false,
15614: 44:       avatar: '4',
15615: 45:       name: 'Kent',
15616: 46:       content: `my heart is beating with hers`
15617: 47:     },
15618: 48:     {
15619: 49:       completed: false,
15620: 50:       avatar: '5',
15621: 51:       name: 'Are you',
15622: 52:       content: `They always said that I love beautiful girl than my friends`
15623: 53:     },
15624: 54:     {
15625: 55:       completed: false,
15626: 56:       avatar: '6',
15627: 57:       name: 'Forever',
15628: 58:       content: `Walking through green fields ，sunshine in my eyes.`
15629: 59:     }
15630: 60:   ];
15631: 61:   like = false;
15632: 62:   dislike = false;
15633: 63: 
15634: 64:   ngOnInit(): void {
15635: 65:     this.http.get('/chart/visit').subscribe((res: G2MiniBarData[]) => {
15636: 66:       this.data = res;
15637: 67:       this.smallData = res.slice(0, 6);
15638: 68:       this.cdr.detectChanges();
15639: 69:     });
15640: 70:   }
15641: 71: }
15642: ````
15643: 
15644: ## File: src/app/shared/cell-widget/index.ts
15645: ````typescript
15646: 1: import type { CellWidgetProvideConfig } from '@delon/abc/cell';
15647: 2: 
15648: 3: export const CELL_WIDGETS: CellWidgetProvideConfig[] = [];
15649: ````
15650: 
15651: ## File: src/app/shared/json-schema/index.ts
15652: ````typescript
15653:  1: import type { SFWidgetProvideConfig } from '@delon/form';
15654:  2: // import { withCascaderWidget } from '@delon/form/widgets/cascader';
15655:  3: 
15656:  4: import { TestWidget } from './test/test.widget';
15657:  5: 
15658:  6: export const SF_WIDGETS: SFWidgetProvideConfig[] = [
15659:  7:   { KEY: TestWidget.KEY, type: TestWidget }
15660:  8:   // Non-built-in widget registration method
15661:  9:   // withCascaderWidget()
15662: 10: ];
15663: ````
15664: 
15665: ## File: src/app/shared/json-schema/test/test.widget.ts
15666: ````typescript
15667:  1: import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
15668:  2: import { ControlWidget, DelonFormModule } from '@delon/form';
15669:  3: 
15670:  4: @Component({
15671:  5:   selector: 'test',
15672:  6:   template: `
15673:  7:     <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
15674:  8:       test widget
15675:  9:     </sf-item-wrap>
15676: 10:   `,
15677: 11:   preserveWhitespaces: false,
15678: 12:   changeDetection: ChangeDetectionStrategy.OnPush,
15679: 13:   imports: [DelonFormModule]
15680: 14: })
15681: 15: export class TestWidget extends ControlWidget implements OnInit {
15682: 16:   static readonly KEY = 'test';
15683: 17: 
15684: 18:   ngOnInit(): void {
15685: 19:     console.warn('init test widget');
15686: 20:   }
15687: 21: }
15688: ````
15689: 
15690: ## File: src/app/shared/models/account/types.ts
15691: ````typescript
15692:  1: import { Database, AccountType, AccountStatus, TeamMemberRole } from '@core';
15693:  2: 
15694:  3: /**
15695:  4:  * 重新导出账户相关枚举（从 core 层导入）
15696:  5:  * 保持向后兼容，允许从 @shared/models/account 导入
15697:  6:  * 
15698:  7:  * 这些枚举定义在 core 层，因为 Repository 层需要使用它们
15699:  8:  * 符合分层架构：core 不依赖 shared
15700:  9:  */
15701: 10: export { AccountType, AccountStatus, TeamMemberRole };
15702: 11: 
15703: 12: /**
15704: 13:  * Account 实体类型（camelCase）
15705: 14:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
15706: 15:  */
15707: 16: export type Account = Database['public']['Tables']['accounts']['Row'];
15708: 17: export type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
15709: 18: export type AccountUpdate = Database['public']['Tables']['accounts']['Update'];
15710: 19: 
15711: 20: /**
15712: 21:  * Team 实体类型（camelCase）
15713: 22:  */
15714: 23: export type Team = Database['public']['Tables']['teams']['Row'];
15715: 24: export type TeamInsert = Database['public']['Tables']['teams']['Insert'];
15716: 25: export type TeamUpdate = Database['public']['Tables']['teams']['Update'];
15717: 26: 
15718: 27: /**
15719: 28:  * TeamMember 实体类型（camelCase）
15720: 29:  */
15721: 30: export type TeamMember = Database['public']['Tables']['team_members']['Row'];
15722: 31: export type TeamMemberInsert = Database['public']['Tables']['team_members']['Insert'];
15723: 32: export type TeamMemberUpdate = Database['public']['Tables']['team_members']['Update'];
15724: 33: 
15725: 34: /**
15726: 35:  * OrganizationSchedule 实体类型（camelCase）
15727: 36:  */
15728: 37: export type OrganizationSchedule = Database['public']['Tables']['organization_schedules']['Row'];
15729: 38: export type OrganizationScheduleInsert = Database['public']['Tables']['organization_schedules']['Insert'];
15730: 39: export type OrganizationScheduleUpdate = Database['public']['Tables']['organization_schedules']['Update'];
15731: ````
15732: 
15733: ## File: src/app/shared/models/blueprint/index.ts
15734: ````typescript
15735:  1: /**
15736:  2:  * 蓝图模型导出
15737:  3:  * 
15738:  4:  * 提供蓝图系统相关的类型定义：
15739:  5:  * - Blueprint: 蓝图主表
15740:  6:  * - BlueprintConfig: 蓝图配置
15741:  7:  * - BlueprintBranch: 蓝图分支
15742:  8:  * - BranchFork: 分支 Fork 记录
15743:  9:  * - PullRequest: Pull Request
15744: 10:  * 
15745: 11:  * @module shared/models/blueprint
15746: 12:  */
15747: 13: 
15748: 14: export * from './types';
15749: ````
15750: 
15751: ## File: src/app/shared/models/blueprint/types.ts
15752: ````typescript
15753:  1: import { Database, BlueprintStatus, BranchType, BranchStatus, PRStatus } from '@core';
15754:  2: 
15755:  3: /**
15756:  4:  * 重新导出蓝图系统相关枚举（从 core 层导入）
15757:  5:  * 保持向后兼容，允许从 @shared/models/blueprint 导入
15758:  6:  * 
15759:  7:  * 这些枚举定义在 core 层，因为 Repository 层需要使用它们
15760:  8:  * 符合分层架构：core 不依赖 shared
15761:  9:  */
15762: 10: export { BlueprintStatus, BranchType, BranchStatus, PRStatus };
15763: 11: 
15764: 12: /**
15765: 13:  * Blueprint 实体类型（camelCase）
15766: 14:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
15767: 15:  */
15768: 16: export type Blueprint = Database['public']['Tables']['blueprints']['Row'];
15769: 17: export type BlueprintInsert = Database['public']['Tables']['blueprints']['Insert'];
15770: 18: export type BlueprintUpdate = Database['public']['Tables']['blueprints']['Update'];
15771: 19: 
15772: 20: /**
15773: 21:  * BlueprintConfig 实体类型（camelCase）
15774: 22:  */
15775: 23: export type BlueprintConfig = Database['public']['Tables']['blueprint_configs']['Row'];
15776: 24: export type BlueprintConfigInsert = Database['public']['Tables']['blueprint_configs']['Insert'];
15777: 25: export type BlueprintConfigUpdate = Database['public']['Tables']['blueprint_configs']['Update'];
15778: 26: 
15779: 27: /**
15780: 28:  * BlueprintBranch 实体类型（camelCase）
15781: 29:  */
15782: 30: export type BlueprintBranch = Database['public']['Tables']['blueprint_branches']['Row'];
15783: 31: export type BlueprintBranchInsert = Database['public']['Tables']['blueprint_branches']['Insert'];
15784: 32: export type BlueprintBranchUpdate = Database['public']['Tables']['blueprint_branches']['Update'];
15785: 33: 
15786: 34: /**
15787: 35:  * BranchFork 实体类型（camelCase）
15788: 36:  */
15789: 37: export type BranchFork = Database['public']['Tables']['branch_forks']['Row'];
15790: 38: export type BranchForkInsert = Database['public']['Tables']['branch_forks']['Insert'];
15791: 39: export type BranchForkUpdate = Database['public']['Tables']['branch_forks']['Update'];
15792: 40: 
15793: 41: /**
15794: 42:  * PullRequest 实体类型（camelCase）
15795: 43:  */
15796: 44: export type PullRequest = Database['public']['Tables']['pull_requests']['Row'];
15797: 45: export type PullRequestInsert = Database['public']['Tables']['pull_requests']['Insert'];
15798: 46: export type PullRequestUpdate = Database['public']['Tables']['pull_requests']['Update'];
15799: ````
15800: 
15801: ## File: src/app/shared/models/collaboration/index.ts
15802: ````typescript
15803: 1: /**
15804: 2:  * 组织协作模型导出
15805: 3:  */
15806: 4: export * from './types';
15807: ````
15808: 
15809: ## File: src/app/shared/models/collaboration/types.ts
15810: ````typescript
15811:  1: import { Database, CollaborationType, CollaborationStatus, InvitationStatus } from '@core';
15812:  2: 
15813:  3: /**
15814:  4:  * 重新导出协作相关枚举（从 core 层导入）
15815:  5:  * 保持向后兼容，允许从 @shared/models/collaboration 导入
15816:  6:  * 
15817:  7:  * 这些枚举定义在 core 层，因为 Repository 层需要使用它们
15818:  8:  * 符合分层架构：core 不依赖 shared
15819:  9:  */
15820: 10: export { CollaborationType, CollaborationStatus, InvitationStatus };
15821: 11: 
15822: 12: /**
15823: 13:  * OrganizationCollaboration 实体类型（camelCase）
15824: 14:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
15825: 15:  */
15826: 16: export type OrganizationCollaboration = Database['public']['Tables']['organization_collaborations']['Row'];
15827: 17: export type OrganizationCollaborationInsert = Database['public']['Tables']['organization_collaborations']['Insert'];
15828: 18: export type OrganizationCollaborationUpdate = Database['public']['Tables']['organization_collaborations']['Update'];
15829: 19: 
15830: 20: /**
15831: 21:  * CollaborationInvitation 实体类型（camelCase）
15832: 22:  */
15833: 23: export type CollaborationInvitation = Database['public']['Tables']['collaboration_invitations']['Row'];
15834: 24: export type CollaborationInvitationInsert = Database['public']['Tables']['collaboration_invitations']['Insert'];
15835: 25: export type CollaborationInvitationUpdate = Database['public']['Tables']['collaboration_invitations']['Update'];
15836: 26: 
15837: 27: /**
15838: 28:  * CollaborationMember 实体类型（camelCase）
15839: 29:  */
15840: 30: export type CollaborationMember = Database['public']['Tables']['collaboration_members']['Row'];
15841: 31: export type CollaborationMemberInsert = Database['public']['Tables']['collaboration_members']['Insert'];
15842: 32: export type CollaborationMemberUpdate = Database['public']['Tables']['collaboration_members']['Update'];
15843: ````
15844: 
15845: ## File: src/app/shared/services/account/account.service.spec.ts
15846: ````typescript
15847:   1: import { TestBed } from '@angular/core/testing';
15848:   2: import { of, throwError } from 'rxjs';
15849:   3: import { AccountRepository } from '@core';
15850:   4: import { AccountService } from './account.service';
15851:   5: import { Account, AccountType, AccountStatus } from '@shared';
15852:   6: 
15853:   7: describe('AccountService', () => {
15854:   8:   let service: AccountService;
15855:   9:   let repository: jasmine.SpyObj<AccountRepository>;
15856:  10: 
15857:  11:   const mockAccount: Account = {
15858:  12:     id: 'account-1',
15859:  13:     auth_user_id: 'auth-user-1',
15860:  14:     type: AccountType.USER,
15861:  15:     name: 'Test User',
15862:  16:     email: 'test@example.com',
15863:  17:     avatar_url: null,
15864:  18:     status: AccountStatus.ACTIVE,
15865:  19:     metadata: {},
15866:  20:     created_at: '2025-01-01T00:00:00Z',
15867:  21:     updated_at: '2025-01-01T00:00:00Z'
15868:  22:   } as Account;
15869:  23: 
15870:  24:   const mockAccounts: Account[] = [
15871:  25:     mockAccount,
15872:  26:     {
15873:  27:       ...mockAccount,
15874:  28:       id: 'account-2',
15875:  29:       type: AccountType.ORGANIZATION,
15876:  30:       name: 'Test Organization',
15877:  31:       status: AccountStatus.INACTIVE
15878:  32:     }
15879:  33:   ];
15880:  34: 
15881:  35:   beforeEach(() => {
15882:  36:     const repositorySpy = jasmine.createSpyObj('AccountRepository', [
15883:  37:       'findAll',
15884:  38:       'findById',
15885:  39:       'findByType',
15886:  40:       'findByStatus',
15887:  41:       'findByAuthUserId',
15888:  42:       'findByEmail',
15889:  43:       'create',
15890:  44:       'update',
15891:  45:       'delete'
15892:  46:     ]);
15893:  47: 
15894:  48:     TestBed.configureTestingModule({
15895:  49:       providers: [AccountService, { provide: AccountRepository, useValue: repositorySpy }]
15896:  50:     });
15897:  51: 
15898:  52:     service = TestBed.inject(AccountService);
15899:  53:     repository = TestBed.inject(AccountRepository) as jasmine.SpyObj<AccountRepository>;
15900:  54:   });
15901:  55: 
15902:  56:   it('should be created', () => {
15903:  57:     expect(service).toBeTruthy();
15904:  58:   });
15905:  59: 
15906:  60:   describe('Initial state', () => {
15907:  61:     it('should have empty accounts', () => {
15908:  62:       expect(service.accounts().length).toBe(0);
15909:  63:     });
15910:  64: 
15911:  65:     it('should have null selected account', () => {
15912:  66:       expect(service.selectedAccount()).toBeNull();
15913:  67:     });
15914:  68: 
15915:  69:     it('should have false loading state', () => {
15916:  70:       expect(service.loading()).toBe(false);
15917:  71:     });
15918:  72: 
15919:  73:     it('should have null error state', () => {
15920:  74:       expect(service.error()).toBeNull();
15921:  75:     });
15922:  76:   });
15923:  77: 
15924:  78:   describe('loadAccounts', () => {
15925:  79:     it('should load accounts successfully', async () => {
15926:  80:       repository.findAll.and.returnValue(of(mockAccounts));
15927:  81: 
15928:  82:       await service.loadAccounts();
15929:  83: 
15930:  84:       expect(service.accounts().length).toBe(2);
15931:  85:       expect(service.accounts()[0].id).toBe('account-1');
15932:  86:       expect(service.loading()).toBe(false);
15933:  87:       expect(service.error()).toBeNull();
15934:  88:     });
15935:  89: 
15936:  90:     it('should set loading state during load', async () => {
15937:  91:       repository.findAll.and.returnValue(of(mockAccounts));
15938:  92: 
15939:  93:       const loadPromise = service.loadAccounts();
15940:  94:       expect(service.loading()).toBe(true);
15941:  95: 
15942:  96:       await loadPromise;
15943:  97:       expect(service.loading()).toBe(false);
15944:  98:     });
15945:  99: 
15946: 100:     it('should handle error when loading fails', async () => {
15947: 101:       const error = new Error('Load failed');
15948: 102:       repository.findAll.and.returnValue(throwError(() => error));
15949: 103: 
15950: 104:       try {
15951: 105:         await service.loadAccounts();
15952: 106:         fail('should have thrown error');
15953: 107:       } catch (e) {
15954: 108:         expect(service.error()).toBe('Load failed');
15955: 109:         expect(service.loading()).toBe(false);
15956: 110:       }
15957: 111:     });
15958: 112:   });
15959: 113: 
15960: 114:   describe('loadAccountById', () => {
15961: 115:     it('should load account by id successfully', async () => {
15962: 116:       repository.findById.and.returnValue(of(mockAccount));
15963: 117: 
15964: 118:       const result = await service.loadAccountById('account-1');
15965: 119: 
15966: 120:       expect(result).toEqual(mockAccount);
15967: 121:       expect(service.selectedAccount()).toEqual(mockAccount);
15968: 122:       expect(service.loading()).toBe(false);
15969: 123:     });
15970: 124: 
15971: 125:     it('should return null when account not found', async () => {
15972: 126:       repository.findById.and.returnValue(of(null));
15973: 127: 
15974: 128:       const result = await service.loadAccountById('non-existent');
15975: 129: 
15976: 130:       expect(result).toBeNull();
15977: 131:       expect(service.selectedAccount()).toBeNull();
15978: 132:     });
15979: 133: 
15980: 134:     it('should handle error when loading by id fails', async () => {
15981: 135:       const error = new Error('Not found');
15982: 136:       repository.findById.and.returnValue(throwError(() => error));
15983: 137: 
15984: 138:       try {
15985: 139:         await service.loadAccountById('account-1');
15986: 140:         fail('should have thrown error');
15987: 141:       } catch (e) {
15988: 142:         expect(service.error()).toBe('Not found');
15989: 143:       }
15990: 144:     });
15991: 145:   });
15992: 146: 
15993: 147:   describe('loadAccountsByType', () => {
15994: 148:     it('should load accounts by type', async () => {
15995: 149:       repository.findByType.and.returnValue(of([mockAccount]));
15996: 150: 
15997: 151:       const result = await service.loadAccountsByType(AccountType.USER);
15998: 152: 
15999: 153:       expect(result.length).toBe(1);
16000: 154:       expect(repository.findByType).toHaveBeenCalledWith(AccountType.USER);
16001: 155:     });
16002: 156:   });
16003: 157: 
16004: 158:   describe('loadAccountsByStatus', () => {
16005: 159:     it('should load accounts by status', async () => {
16006: 160:       repository.findByStatus.and.returnValue(of([mockAccount]));
16007: 161: 
16008: 162:       const result = await service.loadAccountsByStatus(AccountStatus.ACTIVE);
16009: 163: 
16010: 164:       expect(result.length).toBe(1);
16011: 165:       expect(repository.findByStatus).toHaveBeenCalledWith(AccountStatus.ACTIVE);
16012: 166:     });
16013: 167:   });
16014: 168: 
16015: 169:   describe('createAccount', () => {
16016: 170:     it('should create account successfully', async () => {
16017: 171:       const newAccount = { ...mockAccount, id: 'account-new' };
16018: 172:       repository.create.and.returnValue(of(newAccount));
16019: 173: 
16020: 174:       const result = await service.createAccount({
16021: 175:         type: AccountType.USER,
16022: 176:         name: 'New User',
16023: 177:         email: 'new@example.com'
16024: 178:       });
16025: 179: 
16026: 180:       expect(result).toEqual(newAccount);
16027: 181:       expect(service.accounts().length).toBe(1);
16028: 182:       expect(service.accounts()[0].id).toBe('account-new');
16029: 183:     });
16030: 184: 
16031: 185:     it('should handle error when creating fails', async () => {
16032: 186:       const error = new Error('Create failed');
16033: 187:       repository.create.and.returnValue(throwError(() => error));
16034: 188: 
16035: 189:       try {
16036: 190:         await service.createAccount({
16037: 191:           type: AccountType.USER,
16038: 192:           name: 'New User',
16039: 193:           email: 'new@example.com'
16040: 194:         });
16041: 195:         fail('should have thrown error');
16042: 196:       } catch (e) {
16043: 197:         expect(service.error()).toBe('Create failed');
16044: 198:       }
16045: 199:     });
16046: 200:   });
16047: 201: 
16048: 202:   describe('updateAccount', () => {
16049: 203:     beforeEach(() => {
16050: 204:       service['accountsState'].set(mockAccounts);
16051: 205:     });
16052: 206: 
16053: 207:     it('should update account successfully', async () => {
16054: 208:       const updated = { ...mockAccount, name: 'Updated Name' };
16055: 209:       repository.update.and.returnValue(of(updated));
16056: 210: 
16057: 211:       const result = await service.updateAccount('account-1', { name: 'Updated Name' });
16058: 212: 
16059: 213:       expect(result).toEqual(updated);
16060: 214:       expect(service.accounts()[0].name).toBe('Updated Name');
16061: 215:     });
16062: 216: 
16063: 217:     it('should update selected account if it matches', async () => {
16064: 218:       service.selectAccount(mockAccount);
16065: 219:       const updated = { ...mockAccount, name: 'Updated Name' };
16066: 220:       repository.update.and.returnValue(of(updated));
16067: 221: 
16068: 222:       await service.updateAccount('account-1', { name: 'Updated Name' });
16069: 223: 
16070: 224:       expect(service.selectedAccount()?.name).toBe('Updated Name');
16071: 225:     });
16072: 226: 
16073: 227:     it('should handle error when updating fails', async () => {
16074: 228:       const error = new Error('Update failed');
16075: 229:       repository.update.and.returnValue(throwError(() => error));
16076: 230: 
16077: 231:       try {
16078: 232:         await service.updateAccount('account-1', { name: 'Updated' });
16079: 233:         fail('should have thrown error');
16080: 234:       } catch (e) {
16081: 235:         expect(service.error()).toBe('Update failed');
16082: 236:       }
16083: 237:     });
16084: 238:   });
16085: 239: 
16086: 240:   describe('deleteAccount', () => {
16087: 241:     beforeEach(() => {
16088: 242:       service['accountsState'].set(mockAccounts);
16089: 243:     });
16090: 244: 
16091: 245:     it('should delete account successfully', async () => {
16092: 246:       repository.delete.and.returnValue(of(undefined));
16093: 247: 
16094: 248:       await service.deleteAccount('account-1');
16095: 249: 
16096: 250:       expect(service.accounts().length).toBe(1);
16097: 251:       expect(service.accounts()[0].id).toBe('account-2');
16098: 252:     });
16099: 253: 
16100: 254:     it('should clear selected account if deleted', async () => {
16101: 255:       service.selectAccount(mockAccount);
16102: 256:       repository.delete.and.returnValue(of(undefined));
16103: 257: 
16104: 258:       await service.deleteAccount('account-1');
16105: 259: 
16106: 260:       expect(service.selectedAccount()).toBeNull();
16107: 261:     });
16108: 262: 
16109: 263:     it('should handle error when deleting fails', async () => {
16110: 264:       const error = new Error('Delete failed');
16111: 265:       repository.delete.and.returnValue(throwError(() => error));
16112: 266: 
16113: 267:       try {
16114: 268:         await service.deleteAccount('account-1');
16115: 269:         fail('should have thrown error');
16116: 270:       } catch (e) {
16117: 271:         expect(service.error()).toBe('Delete failed');
16118: 272:       }
16119: 273:     });
16120: 274:   });
16121: 275: 
16122: 276:   describe('selectAccount', () => {
16123: 277:     it('should select account', () => {
16124: 278:       service.selectAccount(mockAccount);
16125: 279: 
16126: 280:       expect(service.selectedAccount()).toEqual(mockAccount);
16127: 281:     });
16128: 282: 
16129: 283:     it('should clear selection when null', () => {
16130: 284:       service.selectAccount(mockAccount);
16131: 285:       service.selectAccount(null);
16132: 286: 
16133: 287:       expect(service.selectedAccount()).toBeNull();
16134: 288:     });
16135: 289:   });
16136: 290: 
16137: 291:   describe('findByAuthUserId', () => {
16138: 292:     it('should find account by auth user id', async () => {
16139: 293:       repository.findByAuthUserId.and.returnValue(of(mockAccount));
16140: 294: 
16141: 295:       const result = await service.findByAuthUserId('auth-user-1');
16142: 296: 
16143: 297:       expect(result).toEqual(mockAccount);
16144: 298:       expect(repository.findByAuthUserId).toHaveBeenCalledWith('auth-user-1');
16145: 299:     });
16146: 300:   });
16147: 301: 
16148: 302:   describe('findByEmail', () => {
16149: 303:     it('should find account by email', async () => {
16150: 304:       repository.findByEmail.and.returnValue(of(mockAccount));
16151: 305: 
16152: 306:       const result = await service.findByEmail('test@example.com');
16153: 307: 
16154: 308:       expect(result).toEqual(mockAccount);
16155: 309:       expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
16156: 310:     });
16157: 311:   });
16158: 312: 
16159: 313:   describe('reset', () => {
16160: 314:     it('should reset all state', () => {
16161: 315:       service['accountsState'].set(mockAccounts);
16162: 316:       service.selectAccount(mockAccount);
16163: 317:       service['errorState'].set('Some error');
16164: 318: 
16165: 319:       service.reset();
16166: 320: 
16167: 321:       expect(service.accounts().length).toBe(0);
16168: 322:       expect(service.selectedAccount()).toBeNull();
16169: 323:       expect(service.error()).toBeNull();
16170: 324:     });
16171: 325:   });
16172: 326: 
16173: 327:   describe('Computed signals', () => {
16174: 328:     beforeEach(() => {
16175: 329:       service['accountsState'].set(mockAccounts);
16176: 330:     });
16177: 331: 
16178: 332:     it('should compute activeAccounts', () => {
16179: 333:       expect(service.activeAccounts().length).toBe(1);
16180: 334:       expect(service.activeAccounts()[0].status).toBe(AccountStatus.ACTIVE);
16181: 335:     });
16182: 336: 
16183: 337:     it('should compute userAccounts', () => {
16184: 338:       expect(service.userAccounts().length).toBe(1);
16185: 339:       expect(service.userAccounts()[0].type).toBe(AccountType.USER);
16186: 340:     });
16187: 341: 
16188: 342:     it('should compute organizationAccounts', () => {
16189: 343:       expect(service.organizationAccounts().length).toBe(1);
16190: 344:       expect(service.organizationAccounts()[0].type).toBe(AccountType.ORGANIZATION);
16191: 345:     });
16192: 346:   });
16193: 347: });
16194: ````
16195: 
16196: ## File: src/app/shared/services/account/account.service.ts
16197: ````typescript
16198:   1: import { Injectable, inject } from '@angular/core';
16199:   2: import { signal, computed } from '@angular/core';
16200:   3: import { Observable, firstValueFrom } from 'rxjs';
16201:   4: import { AccountRepository, AccountInsert, AccountUpdate } from '@core';
16202:   5: import { Account, AccountType, AccountStatus } from '@shared';
16203:   6: 
16204:   7: /**
16205:   8:  * Account Service
16206:   9:  * 
16207:  10:  * 提供账户相关的业务逻辑和状态管理
16208:  11:  * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
16209:  12:  * 
16210:  13:  * @example
16211:  14:  * ```typescript
16212:  15:  * const accountService = inject(AccountService);
16213:  16:  * 
16214:  17:  * // 订阅账户列表
16215:  18:  * effect(() => {
16216:  19:  *   console.log('Accounts:', accountService.accounts());
16217:  20:  * });
16218:  21:  * 
16219:  22:  * // 加载账户列表
16220:  23:  * await accountService.loadAccounts();
16221:  24:  * ```
16222:  25:  */
16223:  26: @Injectable({
16224:  27:   providedIn: 'root'
16225:  28: })
16226:  29: export class AccountService {
16227:  30:   private accountRepository = inject(AccountRepository);
16228:  31: 
16229:  32:   // 使用 Signals 管理状态
16230:  33:   private accountsState = signal<Account[]>([]);
16231:  34:   private selectedAccountState = signal<Account | null>(null);
16232:  35:   private loadingState = signal<boolean>(false);
16233:  36:   private errorState = signal<string | null>(null);
16234:  37: 
16235:  38:   // 暴露 ReadonlySignal 给组件
16236:  39:   readonly accounts = this.accountsState.asReadonly();
16237:  40:   readonly selectedAccount = this.selectedAccountState.asReadonly();
16238:  41:   readonly loading = this.loadingState.asReadonly();
16239:  42:   readonly error = this.errorState.asReadonly();
16240:  43: 
16241:  44:   // Computed signals
16242:  45:   readonly activeAccounts = computed(() =>
16243:  46:     this.accounts().filter(a => a.status === AccountStatus.ACTIVE)
16244:  47:   );
16245:  48: 
16246:  49:   readonly userAccounts = computed(() =>
16247:  50:     this.accounts().filter(a => a.type === AccountType.USER)
16248:  51:   );
16249:  52: 
16250:  53:   readonly organizationAccounts = computed(() =>
16251:  54:     this.accounts().filter(a => a.type === AccountType.ORGANIZATION)
16252:  55:   );
16253:  56: 
16254:  57:   /**
16255:  58:    * 加载所有账户
16256:  59:    */
16257:  60:   async loadAccounts(): Promise<void> {
16258:  61:     this.loadingState.set(true);
16259:  62:     this.errorState.set(null);
16260:  63: 
16261:  64:     try {
16262:  65:       const accounts = await firstValueFrom(this.accountRepository.findAll());
16263:  66:       this.accountsState.set(accounts);
16264:  67:     } catch (error) {
16265:  68:       this.errorState.set(error instanceof Error ? error.message : '加载账户列表失败');
16266:  69:       throw error;
16267:  70:     } finally {
16268:  71:       this.loadingState.set(false);
16269:  72:     }
16270:  73:   }
16271:  74: 
16272:  75:   /**
16273:  76:    * 根据 ID 加载账户
16274:  77:    */
16275:  78:   async loadAccountById(id: string): Promise<Account | null> {
16276:  79:     this.loadingState.set(true);
16277:  80:     this.errorState.set(null);
16278:  81: 
16279:  82:     try {
16280:  83:       const account = await firstValueFrom(this.accountRepository.findById(id));
16281:  84:       if (account) {
16282:  85:         this.selectedAccountState.set(account);
16283:  86:       }
16284:  87:       return account;
16285:  88:     } catch (error) {
16286:  89:       this.errorState.set(error instanceof Error ? error.message : '加载账户失败');
16287:  90:       throw error;
16288:  91:     } finally {
16289:  92:       this.loadingState.set(false);
16290:  93:     }
16291:  94:   }
16292:  95: 
16293:  96:   /**
16294:  97:    * 根据类型加载账户
16295:  98:    */
16296:  99:   async loadAccountsByType(type: AccountType): Promise<Account[]> {
16297: 100:     this.loadingState.set(true);
16298: 101:     this.errorState.set(null);
16299: 102: 
16300: 103:     try {
16301: 104:       const accounts = await firstValueFrom(this.accountRepository.findByType(type));
16302: 105:       return accounts;
16303: 106:     } catch (error) {
16304: 107:       this.errorState.set(error instanceof Error ? error.message : '加载账户列表失败');
16305: 108:       throw error;
16306: 109:     } finally {
16307: 110:       this.loadingState.set(false);
16308: 111:     }
16309: 112:   }
16310: 113: 
16311: 114:   /**
16312: 115:    * 根据状态加载账户
16313: 116:    */
16314: 117:   async loadAccountsByStatus(status: AccountStatus): Promise<Account[]> {
16315: 118:     this.loadingState.set(true);
16316: 119:     this.errorState.set(null);
16317: 120: 
16318: 121:     try {
16319: 122:       const accounts = await firstValueFrom(this.accountRepository.findByStatus(status));
16320: 123:       return accounts;
16321: 124:     } catch (error) {
16322: 125:       this.errorState.set(error instanceof Error ? error.message : '加载账户列表失败');
16323: 126:       throw error;
16324: 127:     } finally {
16325: 128:       this.loadingState.set(false);
16326: 129:     }
16327: 130:   }
16328: 131: 
16329: 132:   /**
16330: 133:    * 创建账户
16331: 134:    */
16332: 135:   async createAccount(data: AccountInsert): Promise<Account> {
16333: 136:     this.loadingState.set(true);
16334: 137:     this.errorState.set(null);
16335: 138: 
16336: 139:     try {
16337: 140:       const account = await firstValueFrom(this.accountRepository.create(data));
16338: 141:       // 更新本地状态
16339: 142:       this.accountsState.update(accounts => [...accounts, account]);
16340: 143:       return account;
16341: 144:     } catch (error) {
16342: 145:       this.errorState.set(error instanceof Error ? error.message : '创建账户失败');
16343: 146:       throw error;
16344: 147:     } finally {
16345: 148:       this.loadingState.set(false);
16346: 149:     }
16347: 150:   }
16348: 151: 
16349: 152:   /**
16350: 153:    * 更新账户
16351: 154:    */
16352: 155:   async updateAccount(id: string, data: AccountUpdate): Promise<Account> {
16353: 156:     this.loadingState.set(true);
16354: 157:     this.errorState.set(null);
16355: 158: 
16356: 159:     try {
16357: 160:       const account = await firstValueFrom(this.accountRepository.update(id, data));
16358: 161:       // 更新本地状态
16359: 162:       this.accountsState.update(accounts =>
16360: 163:         accounts.map(a => a.id === id ? account : a)
16361: 164:       );
16362: 165:       // 如果更新的是当前选中的账户，也更新选中状态
16363: 166:       if (this.selectedAccount()?.id === id) {
16364: 167:         this.selectedAccountState.set(account);
16365: 168:       }
16366: 169:       return account;
16367: 170:     } catch (error) {
16368: 171:       this.errorState.set(error instanceof Error ? error.message : '更新账户失败');
16369: 172:       throw error;
16370: 173:     } finally {
16371: 174:       this.loadingState.set(false);
16372: 175:     }
16373: 176:   }
16374: 177: 
16375: 178:   /**
16376: 179:    * 删除账户
16377: 180:    */
16378: 181:   async deleteAccount(id: string): Promise<void> {
16379: 182:     this.loadingState.set(true);
16380: 183:     this.errorState.set(null);
16381: 184: 
16382: 185:     try {
16383: 186:       await firstValueFrom(this.accountRepository.delete(id));
16384: 187:       // 更新本地状态
16385: 188:       this.accountsState.update(accounts => accounts.filter(a => a.id !== id));
16386: 189:       // 如果删除的是当前选中的账户，清空选中状态
16387: 190:       if (this.selectedAccount()?.id === id) {
16388: 191:         this.selectedAccountState.set(null);
16389: 192:       }
16390: 193:     } catch (error) {
16391: 194:       this.errorState.set(error instanceof Error ? error.message : '删除账户失败');
16392: 195:       throw error;
16393: 196:     } finally {
16394: 197:       this.loadingState.set(false);
16395: 198:     }
16396: 199:   }
16397: 200: 
16398: 201:   /**
16399: 202:    * 选择账户
16400: 203:    */
16401: 204:   selectAccount(account: Account | null): void {
16402: 205:     this.selectedAccountState.set(account);
16403: 206:   }
16404: 207: 
16405: 208:   /**
16406: 209:    * 根据 auth_user_id 查找账户
16407: 210:    */
16408: 211:   async findByAuthUserId(authUserId: string): Promise<Account | null> {
16409: 212:     this.loadingState.set(true);
16410: 213:     this.errorState.set(null);
16411: 214: 
16412: 215:     try {
16413: 216:       const account = await firstValueFrom(this.accountRepository.findByAuthUserId(authUserId));
16414: 217:       return account;
16415: 218:     } catch (error) {
16416: 219:       this.errorState.set(error instanceof Error ? error.message : '查找账户失败');
16417: 220:       throw error;
16418: 221:     } finally {
16419: 222:       this.loadingState.set(false);
16420: 223:     }
16421: 224:   }
16422: 225: 
16423: 226:   /**
16424: 227:    * 根据邮箱查找账户
16425: 228:    */
16426: 229:   async findByEmail(email: string): Promise<Account | null> {
16427: 230:     this.loadingState.set(true);
16428: 231:     this.errorState.set(null);
16429: 232: 
16430: 233:     try {
16431: 234:       const account = await firstValueFrom(this.accountRepository.findByEmail(email));
16432: 235:       return account;
16433: 236:     } catch (error) {
16434: 237:       this.errorState.set(error instanceof Error ? error.message : '查找账户失败');
16435: 238:       throw error;
16436: 239:     } finally {
16437: 240:       this.loadingState.set(false);
16438: 241:     }
16439: 242:   }
16440: 243: 
16441: 244:   /**
16442: 245:    * 重置状态
16443: 246:    */
16444: 247:   reset(): void {
16445: 248:     this.accountsState.set([]);
16446: 249:     this.selectedAccountState.set(null);
16447: 250:     this.errorState.set(null);
16448: 251:   }
16449: 252: }
16450: ````
16451: 
16452: ## File: src/app/shared/services/account/organization-schedule.service.ts
16453: ````typescript
16454:   1: import { Injectable, inject } from '@angular/core';
16455:   2: import { signal, computed } from '@angular/core';
16456:   3: import { Observable, firstValueFrom } from 'rxjs';
16457:   4: import {
16458:   5:   OrganizationScheduleRepository,
16459:   6:   OrganizationSchedule,
16460:   7:   OrganizationScheduleInsert,
16461:   8:   OrganizationScheduleUpdate
16462:   9: } from '@core';
16463:  10: 
16464:  11: /**
16465:  12:  * OrganizationSchedule Service
16466:  13:  * 
16467:  14:  * 提供组织排班相关的业务逻辑和状态管理
16468:  15:  * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
16469:  16:  * 
16470:  17:  * @example
16471:  18:  * ```typescript
16472:  19:  * const scheduleService = inject(OrganizationScheduleService);
16473:  20:  * 
16474:  21:  * // 订阅排班列表
16475:  22:  * effect(() => {
16476:  23:  *   console.log('Schedules:', scheduleService.schedules());
16477:  24:  * });
16478:  25:  * 
16479:  26:  * // 加载组织下的排班列表
16480:  27:  * await scheduleService.loadSchedulesByOrganizationId('org-id');
16481:  28:  * ```
16482:  29:  */
16483:  30: @Injectable({
16484:  31:   providedIn: 'root'
16485:  32: })
16486:  33: export class OrganizationScheduleService {
16487:  34:   private scheduleRepository = inject(OrganizationScheduleRepository);
16488:  35: 
16489:  36:   // 使用 Signals 管理状态
16490:  37:   private schedulesState = signal<OrganizationSchedule[]>([]);
16491:  38:   private selectedScheduleState = signal<OrganizationSchedule | null>(null);
16492:  39:   private loadingState = signal<boolean>(false);
16493:  40:   private errorState = signal<string | null>(null);
16494:  41: 
16495:  42:   // 暴露 ReadonlySignal 给组件
16496:  43:   readonly schedules = this.schedulesState.asReadonly();
16497:  44:   readonly selectedSchedule = this.selectedScheduleState.asReadonly();
16498:  45:   readonly loading = this.loadingState.asReadonly();
16499:  46:   readonly error = this.errorState.asReadonly();
16500:  47: 
16501:  48:   /**
16502:  49:    * 加载所有排班
16503:  50:    */
16504:  51:   async loadSchedules(): Promise<void> {
16505:  52:     this.loadingState.set(true);
16506:  53:     this.errorState.set(null);
16507:  54: 
16508:  55:     try {
16509:  56:       const schedules = await firstValueFrom(
16510:  57:         this.scheduleRepository.findAll()
16511:  58:       ) as OrganizationSchedule[];
16512:  59:       this.schedulesState.set(schedules);
16513:  60:     } catch (error) {
16514:  61:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
16515:  62:       throw error;
16516:  63:     } finally {
16517:  64:       this.loadingState.set(false);
16518:  65:     }
16519:  66:   }
16520:  67: 
16521:  68:   /**
16522:  69:    * 根据组织 ID 加载排班列表
16523:  70:    */
16524:  71:   async loadSchedulesByOrganizationId(organizationId: string): Promise<OrganizationSchedule[]> {
16525:  72:     this.loadingState.set(true);
16526:  73:     this.errorState.set(null);
16527:  74: 
16528:  75:     try {
16529:  76:       const schedules = await firstValueFrom(
16530:  77:         this.scheduleRepository.findByOrganizationId(organizationId)
16531:  78:       ) as OrganizationSchedule[];
16532:  79:       this.schedulesState.set(schedules);
16533:  80:       return schedules;
16534:  81:     } catch (error) {
16535:  82:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
16536:  83:       throw error;
16537:  84:     } finally {
16538:  85:       this.loadingState.set(false);
16539:  86:     }
16540:  87:   }
16541:  88: 
16542:  89:   /**
16543:  90:    * 根据蓝图 ID 加载排班列表
16544:  91:    */
16545:  92:   async loadSchedulesByBlueprintId(blueprintId: string): Promise<OrganizationSchedule[]> {
16546:  93:     this.loadingState.set(true);
16547:  94:     this.errorState.set(null);
16548:  95: 
16549:  96:     try {
16550:  97:       const schedules = await firstValueFrom(
16551:  98:         this.scheduleRepository.findByBlueprintId(blueprintId)
16552:  99:       ) as OrganizationSchedule[];
16553: 100:       return schedules;
16554: 101:     } catch (error) {
16555: 102:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
16556: 103:       throw error;
16557: 104:     } finally {
16558: 105:       this.loadingState.set(false);
16559: 106:     }
16560: 107:   }
16561: 108: 
16562: 109:   /**
16563: 110:    * 根据分支 ID 加载排班列表
16564: 111:    */
16565: 112:   async loadSchedulesByBranchId(branchId: string): Promise<OrganizationSchedule[]> {
16566: 113:     this.loadingState.set(true);
16567: 114:     this.errorState.set(null);
16568: 115: 
16569: 116:     try {
16570: 117:       const schedules = await firstValueFrom(
16571: 118:         this.scheduleRepository.findByBranchId(branchId)
16572: 119:       ) as OrganizationSchedule[];
16573: 120:       return schedules;
16574: 121:     } catch (error) {
16575: 122:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
16576: 123:       throw error;
16577: 124:     } finally {
16578: 125:       this.loadingState.set(false);
16579: 126:     }
16580: 127:   }
16581: 128: 
16582: 129:   /**
16583: 130:    * 根据账户 ID 加载排班列表
16584: 131:    */
16585: 132:   async loadSchedulesByAccountId(accountId: string): Promise<OrganizationSchedule[]> {
16586: 133:     this.loadingState.set(true);
16587: 134:     this.errorState.set(null);
16588: 135: 
16589: 136:     try {
16590: 137:       const schedules = await firstValueFrom(
16591: 138:         this.scheduleRepository.findByAccountId(accountId)
16592: 139:       ) as OrganizationSchedule[];
16593: 140:       return schedules;
16594: 141:     } catch (error) {
16595: 142:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
16596: 143:       throw error;
16597: 144:     } finally {
16598: 145:       this.loadingState.set(false);
16599: 146:     }
16600: 147:   }
16601: 148: 
16602: 149:   /**
16603: 150:    * 根据团队 ID 加载排班列表
16604: 151:    */
16605: 152:   async loadSchedulesByTeamId(teamId: string): Promise<OrganizationSchedule[]> {
16606: 153:     this.loadingState.set(true);
16607: 154:     this.errorState.set(null);
16608: 155: 
16609: 156:     try {
16610: 157:       const schedules = await firstValueFrom(
16611: 158:         this.scheduleRepository.findByTeamId(teamId)
16612: 159:       ) as OrganizationSchedule[];
16613: 160:       return schedules;
16614: 161:     } catch (error) {
16615: 162:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
16616: 163:       throw error;
16617: 164:     } finally {
16618: 165:       this.loadingState.set(false);
16619: 166:     }
16620: 167:   }
16621: 168: 
16622: 169:   /**
16623: 170:    * 根据日期范围加载排班列表
16624: 171:    */
16625: 172:   async loadSchedulesByDateRange(startDate: string, endDate: string): Promise<OrganizationSchedule[]> {
16626: 173:     this.loadingState.set(true);
16627: 174:     this.errorState.set(null);
16628: 175: 
16629: 176:     try {
16630: 177:       const schedules = await firstValueFrom(
16631: 178:         this.scheduleRepository.findByDateRange(startDate, endDate)
16632: 179:       ) as OrganizationSchedule[];
16633: 180:       return schedules;
16634: 181:     } catch (error) {
16635: 182:       this.errorState.set(error instanceof Error ? error.message : '加载排班列表失败');
16636: 183:       throw error;
16637: 184:     } finally {
16638: 185:       this.loadingState.set(false);
16639: 186:     }
16640: 187:   }
16641: 188: 
16642: 189:   /**
16643: 190:    * 根据 ID 加载排班
16644: 191:    */
16645: 192:   async loadScheduleById(id: string): Promise<OrganizationSchedule | null> {
16646: 193:     this.loadingState.set(true);
16647: 194:     this.errorState.set(null);
16648: 195: 
16649: 196:     try {
16650: 197:       const schedule = await firstValueFrom(
16651: 198:         this.scheduleRepository.findById(id)
16652: 199:       ) as OrganizationSchedule | null;
16653: 200:       if (schedule) {
16654: 201:         this.selectedScheduleState.set(schedule);
16655: 202:       }
16656: 203:       return schedule;
16657: 204:     } catch (error) {
16658: 205:       this.errorState.set(error instanceof Error ? error.message : '加载排班失败');
16659: 206:       throw error;
16660: 207:     } finally {
16661: 208:       this.loadingState.set(false);
16662: 209:     }
16663: 210:   }
16664: 211: 
16665: 212:   /**
16666: 213:    * 创建排班
16667: 214:    */
16668: 215:   async createSchedule(data: OrganizationScheduleInsert): Promise<OrganizationSchedule> {
16669: 216:     this.loadingState.set(true);
16670: 217:     this.errorState.set(null);
16671: 218: 
16672: 219:     try {
16673: 220:       const schedule = await firstValueFrom(
16674: 221:         this.scheduleRepository.create(data)
16675: 222:       ) as OrganizationSchedule;
16676: 223:       // 更新本地状态
16677: 224:       this.schedulesState.update(schedules => [...schedules, schedule]);
16678: 225:       return schedule;
16679: 226:     } catch (error) {
16680: 227:       this.errorState.set(error instanceof Error ? error.message : '创建排班失败');
16681: 228:       throw error;
16682: 229:     } finally {
16683: 230:       this.loadingState.set(false);
16684: 231:     }
16685: 232:   }
16686: 233: 
16687: 234:   /**
16688: 235:    * 更新排班
16689: 236:    */
16690: 237:   async updateSchedule(id: string, data: OrganizationScheduleUpdate): Promise<OrganizationSchedule> {
16691: 238:     this.loadingState.set(true);
16692: 239:     this.errorState.set(null);
16693: 240: 
16694: 241:     try {
16695: 242:       const schedule = await firstValueFrom(
16696: 243:         this.scheduleRepository.update(id, data)
16697: 244:       ) as OrganizationSchedule;
16698: 245:       // 更新本地状态
16699: 246:       this.schedulesState.update(schedules =>
16700: 247:         schedules.map(s => s.id === id ? schedule : s)
16701: 248:       );
16702: 249:       // 如果更新的是当前选中的排班，也更新选中状态
16703: 250:       if (this.selectedSchedule()?.id === id) {
16704: 251:         this.selectedScheduleState.set(schedule);
16705: 252:       }
16706: 253:       return schedule;
16707: 254:     } catch (error) {
16708: 255:       this.errorState.set(error instanceof Error ? error.message : '更新排班失败');
16709: 256:       throw error;
16710: 257:     } finally {
16711: 258:       this.loadingState.set(false);
16712: 259:     }
16713: 260:   }
16714: 261: 
16715: 262:   /**
16716: 263:    * 删除排班
16717: 264:    */
16718: 265:   async deleteSchedule(id: string): Promise<void> {
16719: 266:     this.loadingState.set(true);
16720: 267:     this.errorState.set(null);
16721: 268: 
16722: 269:     try {
16723: 270:       await firstValueFrom(this.scheduleRepository.delete(id));
16724: 271:       // 更新本地状态
16725: 272:       this.schedulesState.update(schedules => schedules.filter(s => s.id !== id));
16726: 273:       // 如果删除的是当前选中的排班，清空选中状态
16727: 274:       if (this.selectedSchedule()?.id === id) {
16728: 275:         this.selectedScheduleState.set(null);
16729: 276:       }
16730: 277:     } catch (error) {
16731: 278:       this.errorState.set(error instanceof Error ? error.message : '删除排班失败');
16732: 279:       throw error;
16733: 280:     } finally {
16734: 281:       this.loadingState.set(false);
16735: 282:     }
16736: 283:   }
16737: 284: 
16738: 285:   /**
16739: 286:    * 选择排班
16740: 287:    */
16741: 288:   selectSchedule(schedule: OrganizationSchedule | null): void {
16742: 289:     this.selectedScheduleState.set(schedule);
16743: 290:   }
16744: 291: 
16745: 292:   /**
16746: 293:    * 重置状态
16747: 294:    */
16748: 295:   reset(): void {
16749: 296:     this.schedulesState.set([]);
16750: 297:     this.selectedScheduleState.set(null);
16751: 298:     this.errorState.set(null);
16752: 299:   }
16753: 300: }
16754: ````
16755: 
16756: ## File: src/app/shared/services/account/team.service.spec.ts
16757: ````typescript
16758:   1: import { TestBed } from '@angular/core/testing';
16759:   2: import { of, throwError } from 'rxjs';
16760:   3: import { TeamRepository, TeamMemberRepository, TeamMemberRole } from '@core';
16761:   4: import { TeamService } from './team.service';
16762:   5: import { Team, TeamMember } from '@shared';
16763:   6: 
16764:   7: describe('TeamService', () => {
16765:   8:   let service: TeamService;
16766:   9:   let teamRepository: jasmine.SpyObj<TeamRepository>;
16767:  10:   let teamMemberRepository: jasmine.SpyObj<TeamMemberRepository>;
16768:  11: 
16769:  12:   const mockTeam: Team = {
16770:  13:     id: 'team-1',
16771:  14:     organization_id: 'org-1',
16772:  15:     name: 'Test Team',
16773:  16:     description: 'Test team description',
16774:  17:     avatar_url: null,
16775:  18:     created_by: 'account-1',
16776:  19:     created_at: '2025-01-01T00:00:00Z',
16777:  20:     updated_at: '2025-01-01T00:00:00Z'
16778:  21:   } as Team;
16779:  22: 
16780:  23:   const mockTeams: Team[] = [
16781:  24:     mockTeam,
16782:  25:     {
16783:  26:       ...mockTeam,
16784:  27:       id: 'team-2',
16785:  28:       name: 'Test Team 2'
16786:  29:     }
16787:  30:   ];
16788:  31: 
16789:  32:   const mockTeamMember: TeamMember = {
16790:  33:     id: 'member-1',
16791:  34:     team_id: 'team-1',
16792:  35:     account_id: 'account-1',
16793:  36:     role: TeamMemberRole.MEMBER,
16794:  37:     joined_at: '2025-01-01T00:00:00Z'
16795:  38:   } as TeamMember;
16796:  39: 
16797:  40:   const mockTeamMembers: TeamMember[] = [
16798:  41:     mockTeamMember,
16799:  42:     {
16800:  43:       ...mockTeamMember,
16801:  44:       id: 'member-2',
16802:  45:       account_id: 'account-2',
16803:  46:       role: TeamMemberRole.LEADER
16804:  47:     }
16805:  48:   ];
16806:  49: 
16807:  50:   beforeEach(() => {
16808:  51:     const teamRepositorySpy = jasmine.createSpyObj('TeamRepository', [
16809:  52:       'findAll',
16810:  53:       'findById',
16811:  54:       'findByOrganizationId',
16812:  55:       'create',
16813:  56:       'update',
16814:  57:       'delete'
16815:  58:     ]);
16816:  59: 
16817:  60:     const teamMemberRepositorySpy = jasmine.createSpyObj('TeamMemberRepository', [
16818:  61:       'findByTeamId',
16819:  62:       'create',
16820:  63:       'update',
16821:  64:       'delete'
16822:  65:     ]);
16823:  66: 
16824:  67:     TestBed.configureTestingModule({
16825:  68:       providers: [
16826:  69:         TeamService,
16827:  70:         { provide: TeamRepository, useValue: teamRepositorySpy },
16828:  71:         { provide: TeamMemberRepository, useValue: teamMemberRepositorySpy }
16829:  72:       ]
16830:  73:     });
16831:  74: 
16832:  75:     service = TestBed.inject(TeamService);
16833:  76:     teamRepository = TestBed.inject(TeamRepository) as jasmine.SpyObj<TeamRepository>;
16834:  77:     teamMemberRepository = TestBed.inject(
16835:  78:       TeamMemberRepository
16836:  79:     ) as jasmine.SpyObj<TeamMemberRepository>;
16837:  80:   });
16838:  81: 
16839:  82:   it('should be created', () => {
16840:  83:     expect(service).toBeTruthy();
16841:  84:   });
16842:  85: 
16843:  86:   describe('Initial state', () => {
16844:  87:     it('should have empty teams', () => {
16845:  88:       expect(service.teams().length).toBe(0);
16846:  89:     });
16847:  90: 
16848:  91:     it('should have null selected team', () => {
16849:  92:       expect(service.selectedTeam()).toBeNull();
16850:  93:     });
16851:  94: 
16852:  95:     it('should have empty team members', () => {
16853:  96:       expect(service.teamMembers().length).toBe(0);
16854:  97:     });
16855:  98: 
16856:  99:     it('should have false loading state', () => {
16857: 100:       expect(service.loading()).toBe(false);
16858: 101:     });
16859: 102: 
16860: 103:     it('should have null error state', () => {
16861: 104:       expect(service.error()).toBeNull();
16862: 105:     });
16863: 106:   });
16864: 107: 
16865: 108:   describe('loadTeams', () => {
16866: 109:     it('should load teams successfully', async () => {
16867: 110:       teamRepository.findAll.and.returnValue(of(mockTeams));
16868: 111: 
16869: 112:       await service.loadTeams();
16870: 113: 
16871: 114:       expect(service.teams().length).toBe(2);
16872: 115:       expect(service.teams()[0].id).toBe('team-1');
16873: 116:       expect(service.loading()).toBe(false);
16874: 117:     });
16875: 118: 
16876: 119:     it('should handle error when loading fails', async () => {
16877: 120:       const error = new Error('Load failed');
16878: 121:       teamRepository.findAll.and.returnValue(throwError(() => error));
16879: 122: 
16880: 123:       try {
16881: 124:         await service.loadTeams();
16882: 125:         fail('should have thrown error');
16883: 126:       } catch (e) {
16884: 127:         expect(service.error()).toBe('Load failed');
16885: 128:       }
16886: 129:     });
16887: 130:   });
16888: 131: 
16889: 132:   describe('loadTeamsByOrganizationId', () => {
16890: 133:     it('should load teams by organization id', async () => {
16891: 134:       teamRepository.findByOrganizationId.and.returnValue(of(mockTeams));
16892: 135: 
16893: 136:       const result = await service.loadTeamsByOrganizationId('org-1');
16894: 137: 
16895: 138:       expect(result.length).toBe(2);
16896: 139:       expect(teamRepository.findByOrganizationId).toHaveBeenCalledWith('org-1');
16897: 140:     });
16898: 141:   });
16899: 142: 
16900: 143:   describe('loadTeamById', () => {
16901: 144:     it('should load team by id and members', async () => {
16902: 145:       teamRepository.findById.and.returnValue(of(mockTeam));
16903: 146:       teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));
16904: 147: 
16905: 148:       const result = await service.loadTeamById('team-1');
16906: 149: 
16907: 150:       expect(result).toEqual(mockTeam);
16908: 151:       expect(service.selectedTeam()).toEqual(mockTeam);
16909: 152:       expect(service.teamMembers().length).toBe(2);
16910: 153:     });
16911: 154:   });
16912: 155: 
16913: 156:   describe('createTeam', () => {
16914: 157:     it('should create team successfully', async () => {
16915: 158:       const newTeam = { ...mockTeam, id: 'team-new' };
16916: 159:       teamRepository.create.and.returnValue(of(newTeam));
16917: 160: 
16918: 161:       const result = await service.createTeam({
16919: 162:         organization_id: 'org-1',
16920: 163:         name: 'New Team',
16921: 164:         created_by: 'account-1'
16922: 165:       });
16923: 166: 
16924: 167:       expect(result).toEqual(newTeam);
16925: 168:       expect(service.teams().length).toBe(1);
16926: 169:     });
16927: 170:   });
16928: 171: 
16929: 172:   describe('updateTeam', () => {
16930: 173:     beforeEach(() => {
16931: 174:       service['teamsState'].set(mockTeams);
16932: 175:     });
16933: 176: 
16934: 177:     it('should update team successfully', async () => {
16935: 178:       const updated = { ...mockTeam, name: 'Updated Name' };
16936: 179:       teamRepository.update.and.returnValue(of(updated));
16937: 180: 
16938: 181:       const result = await service.updateTeam('team-1', { name: 'Updated Name' });
16939: 182: 
16940: 183:       expect(result).toEqual(updated);
16941: 184:       expect(service.teams()[0].name).toBe('Updated Name');
16942: 185:     });
16943: 186:   });
16944: 187: 
16945: 188:   describe('deleteTeam', () => {
16946: 189:     beforeEach(() => {
16947: 190:       service['teamsState'].set(mockTeams);
16948: 191:     });
16949: 192: 
16950: 193:     it('should delete team successfully', async () => {
16951: 194:       teamRepository.delete.and.returnValue(of(undefined));
16952: 195: 
16953: 196:       await service.deleteTeam('team-1');
16954: 197: 
16955: 198:       expect(service.teams().length).toBe(1);
16956: 199:       expect(service.teams()[0].id).toBe('team-2');
16957: 200:     });
16958: 201: 
16959: 202:     it('should clear selected team and members if deleted', async () => {
16960: 203:       teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));
16961: 204:       service.selectTeam(mockTeam);
16962: 205:       await new Promise(resolve => setTimeout(resolve, 0)); // Wait for async loadTeamMembers
16963: 206:       service['teamMembersState'].set(mockTeamMembers);
16964: 207:       teamRepository.delete.and.returnValue(of(undefined));
16965: 208: 
16966: 209:       await service.deleteTeam('team-1');
16967: 210: 
16968: 211:       expect(service.selectedTeam()).toBeNull();
16969: 212:       expect(service.teamMembers().length).toBe(0);
16970: 213:     });
16971: 214:   });
16972: 215: 
16973: 216:   describe('selectTeam', () => {
16974: 217:     it('should select team and load members', async () => {
16975: 218:       teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));
16976: 219: 
16977: 220:       service.selectTeam(mockTeam);
16978: 221:       await new Promise(resolve => setTimeout(resolve, 0)); // Wait for async loadTeamMembers
16979: 222: 
16980: 223:       expect(service.selectedTeam()).toEqual(mockTeam);
16981: 224:       expect(teamMemberRepository.findByTeamId).toHaveBeenCalledWith('team-1');
16982: 225:     });
16983: 226: 
16984: 227:     it('should clear selection when null', () => {
16985: 228:       teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));
16986: 229:       service.selectTeam(mockTeam);
16987: 230:       service.selectTeam(null);
16988: 231: 
16989: 232:       expect(service.selectedTeam()).toBeNull();
16990: 233:       expect(service.teamMembers().length).toBe(0);
16991: 234:     });
16992: 235:   });
16993: 236: 
16994: 237:   describe('loadTeamMembers', () => {
16995: 238:     it('should load team members successfully', async () => {
16996: 239:       teamMemberRepository.findByTeamId.and.returnValue(of(mockTeamMembers));
16997: 240: 
16998: 241:       const result = await service.loadTeamMembers('team-1');
16999: 242: 
17000: 243:       expect(result.length).toBe(2);
17001: 244:       expect(service.teamMembers().length).toBe(2);
17002: 245:     });
17003: 246:   });
17004: 247: 
17005: 248:   describe('addTeamMember', () => {
17006: 249:     it('should add team member successfully', async () => {
17007: 250:       const newMember = { ...mockTeamMember, id: 'member-new' };
17008: 251:       teamMemberRepository.create.and.returnValue(of(newMember));
17009: 252: 
17010: 253:       const result = await service.addTeamMember('team-1', 'account-3', TeamMemberRole.MEMBER);
17011: 254: 
17012: 255:       expect(result).toEqual(newMember);
17013: 256:       expect(service.teamMembers().length).toBe(1);
17014: 257:     });
17015: 258:   });
17016: 259: 
17017: 260:   describe('removeTeamMember', () => {
17018: 261:     beforeEach(() => {
17019: 262:       service['teamMembersState'].set(mockTeamMembers);
17020: 263:     });
17021: 264: 
17022: 265:     it('should remove team member successfully', async () => {
17023: 266:       teamMemberRepository.delete.and.returnValue(of(undefined));
17024: 267: 
17025: 268:       await service.removeTeamMember('member-1');
17026: 269: 
17027: 270:       expect(service.teamMembers().length).toBe(1);
17028: 271:       expect(service.teamMembers()[0].id).toBe('member-2');
17029: 272:     });
17030: 273:   });
17031: 274: 
17032: 275:   describe('updateTeamMemberRole', () => {
17033: 276:     beforeEach(() => {
17034: 277:       service['teamMembersState'].set(mockTeamMembers);
17035: 278:     });
17036: 279: 
17037: 280:     it('should update team member role successfully', async () => {
17038: 281:       const updated = { ...mockTeamMember, role: TeamMemberRole.LEADER };
17039: 282:       teamMemberRepository.update.and.returnValue(of(updated));
17040: 283: 
17041: 284:       const result = await service.updateTeamMemberRole('member-1', TeamMemberRole.LEADER);
17042: 285: 
17043: 286:       expect(result.role).toBe(TeamMemberRole.LEADER);
17044: 287:       expect(service.teamMembers()[0].role).toBe(TeamMemberRole.LEADER);
17045: 288:     });
17046: 289:   });
17047: 290: 
17048: 291:   describe('reset', () => {
17049: 292:     it('should reset all state', () => {
17050: 293:       service['teamsState'].set(mockTeams);
17051: 294:       service.selectTeam(mockTeam);
17052: 295:       service['teamMembersState'].set(mockTeamMembers);
17053: 296:       service['errorState'].set('Some error');
17054: 297: 
17055: 298:       service.reset();
17056: 299: 
17057: 300:       expect(service.teams().length).toBe(0);
17058: 301:       expect(service.selectedTeam()).toBeNull();
17059: 302:       expect(service.teamMembers().length).toBe(0);
17060: 303:       expect(service.error()).toBeNull();
17061: 304:     });
17062: 305:   });
17063: 306: });
17064: ````
17065: 
17066: ## File: src/app/shared/services/account/team.service.ts
17067: ````typescript
17068:   1: import { Injectable, inject } from '@angular/core';
17069:   2: import { signal, computed } from '@angular/core';
17070:   3: import { Observable, firstValueFrom } from 'rxjs';
17071:   4: import { TeamRepository, Team, TeamInsert, TeamUpdate, TeamMemberRepository, TeamMember, TeamMemberInsert, TeamMemberUpdate, TeamMemberRole } from '@core';
17072:   5: 
17073:   6: /**
17074:   7:  * Team Service
17075:   8:  * 
17076:   9:  * 提供团队相关的业务逻辑和状态管理
17077:  10:  * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
17078:  11:  * 
17079:  12:  * @example
17080:  13:  * ```typescript
17081:  14:  * const teamService = inject(TeamService);
17082:  15:  * 
17083:  16:  * // 订阅团队列表
17084:  17:  * effect(() => {
17085:  18:  *   console.log('Teams:', teamService.teams());
17086:  19:  * });
17087:  20:  * 
17088:  21:  * // 加载组织下的团队列表
17089:  22:  * await teamService.loadTeamsByOrganizationId('org-id');
17090:  23:  * ```
17091:  24:  */
17092:  25: @Injectable({
17093:  26:   providedIn: 'root'
17094:  27: })
17095:  28: export class TeamService {
17096:  29:   private teamRepository = inject(TeamRepository);
17097:  30:   private teamMemberRepository = inject(TeamMemberRepository);
17098:  31: 
17099:  32:   // 使用 Signals 管理状态
17100:  33:   private teamsState = signal<Team[]>([]);
17101:  34:   private selectedTeamState = signal<Team | null>(null);
17102:  35:   private teamMembersState = signal<TeamMember[]>([]);
17103:  36:   private loadingState = signal<boolean>(false);
17104:  37:   private errorState = signal<string | null>(null);
17105:  38: 
17106:  39:   // 暴露 ReadonlySignal 给组件
17107:  40:   readonly teams = this.teamsState.asReadonly();
17108:  41:   readonly selectedTeam = this.selectedTeamState.asReadonly();
17109:  42:   readonly teamMembers = this.teamMembersState.asReadonly();
17110:  43:   readonly loading = this.loadingState.asReadonly();
17111:  44:   readonly error = this.errorState.asReadonly();
17112:  45: 
17113:  46:   /**
17114:  47:    * 加载所有团队
17115:  48:    */
17116:  49:   async loadTeams(): Promise<void> {
17117:  50:     this.loadingState.set(true);
17118:  51:     this.errorState.set(null);
17119:  52: 
17120:  53:     try {
17121:  54:       const teams = await firstValueFrom(this.teamRepository.findAll()) as Team[];
17122:  55:       this.teamsState.set(teams);
17123:  56:     } catch (error) {
17124:  57:       this.errorState.set(error instanceof Error ? error.message : '加载团队列表失败');
17125:  58:       throw error;
17126:  59:     } finally {
17127:  60:       this.loadingState.set(false);
17128:  61:     }
17129:  62:   }
17130:  63: 
17131:  64:   /**
17132:  65:    * 根据组织 ID 加载团队列表
17133:  66:    */
17134:  67:   async loadTeamsByOrganizationId(organizationId: string): Promise<Team[]> {
17135:  68:     this.loadingState.set(true);
17136:  69:     this.errorState.set(null);
17137:  70: 
17138:  71:     try {
17139:  72:       const teams = await firstValueFrom(
17140:  73:         this.teamRepository.findByOrganizationId(organizationId)
17141:  74:       ) as Team[];
17142:  75:       this.teamsState.set(teams);
17143:  76:       return teams;
17144:  77:     } catch (error) {
17145:  78:       this.errorState.set(error instanceof Error ? error.message : '加载团队列表失败');
17146:  79:       throw error;
17147:  80:     } finally {
17148:  81:       this.loadingState.set(false);
17149:  82:     }
17150:  83:   }
17151:  84: 
17152:  85:   /**
17153:  86:    * 根据 ID 加载团队
17154:  87:    */
17155:  88:   async loadTeamById(id: string): Promise<Team | null> {
17156:  89:     this.loadingState.set(true);
17157:  90:     this.errorState.set(null);
17158:  91: 
17159:  92:     try {
17160:  93:       const team = await firstValueFrom(this.teamRepository.findById(id)) as Team | null;
17161:  94:       if (team) {
17162:  95:         this.selectedTeamState.set(team);
17163:  96:         // 同时加载团队成员
17164:  97:         await this.loadTeamMembers(id);
17165:  98:       }
17166:  99:       return team;
17167: 100:     } catch (error) {
17168: 101:       this.errorState.set(error instanceof Error ? error.message : '加载团队失败');
17169: 102:       throw error;
17170: 103:     } finally {
17171: 104:       this.loadingState.set(false);
17172: 105:     }
17173: 106:   }
17174: 107: 
17175: 108:   /**
17176: 109:    * 创建团队
17177: 110:    */
17178: 111:   async createTeam(data: TeamInsert): Promise<Team> {
17179: 112:     this.loadingState.set(true);
17180: 113:     this.errorState.set(null);
17181: 114: 
17182: 115:     try {
17183: 116:       const team = await firstValueFrom(this.teamRepository.create(data)) as Team;
17184: 117:       // 更新本地状态
17185: 118:       this.teamsState.update(teams => [...teams, team]);
17186: 119:       return team;
17187: 120:     } catch (error) {
17188: 121:       this.errorState.set(error instanceof Error ? error.message : '创建团队失败');
17189: 122:       throw error;
17190: 123:     } finally {
17191: 124:       this.loadingState.set(false);
17192: 125:     }
17193: 126:   }
17194: 127: 
17195: 128:   /**
17196: 129:    * 更新团队
17197: 130:    */
17198: 131:   async updateTeam(id: string, data: TeamUpdate): Promise<Team> {
17199: 132:     this.loadingState.set(true);
17200: 133:     this.errorState.set(null);
17201: 134: 
17202: 135:     try {
17203: 136:       const team = await firstValueFrom(this.teamRepository.update(id, data)) as Team;
17204: 137:       // 更新本地状态
17205: 138:       this.teamsState.update(teams =>
17206: 139:         teams.map(t => t.id === id ? team : t)
17207: 140:       );
17208: 141:       // 如果更新的是当前选中的团队，也更新选中状态
17209: 142:       if (this.selectedTeam()?.id === id) {
17210: 143:         this.selectedTeamState.set(team);
17211: 144:       }
17212: 145:       return team;
17213: 146:     } catch (error) {
17214: 147:       this.errorState.set(error instanceof Error ? error.message : '更新团队失败');
17215: 148:       throw error;
17216: 149:     } finally {
17217: 150:       this.loadingState.set(false);
17218: 151:     }
17219: 152:   }
17220: 153: 
17221: 154:   /**
17222: 155:    * 删除团队
17223: 156:    */
17224: 157:   async deleteTeam(id: string): Promise<void> {
17225: 158:     this.loadingState.set(true);
17226: 159:     this.errorState.set(null);
17227: 160: 
17228: 161:     try {
17229: 162:       await firstValueFrom(this.teamRepository.delete(id));
17230: 163:       // 更新本地状态
17231: 164:       this.teamsState.update(teams => teams.filter(t => t.id !== id));
17232: 165:       // 如果删除的是当前选中的团队，清空选中状态
17233: 166:       if (this.selectedTeam()?.id === id) {
17234: 167:         this.selectedTeamState.set(null);
17235: 168:         this.teamMembersState.set([]);
17236: 169:       }
17237: 170:     } catch (error) {
17238: 171:       this.errorState.set(error instanceof Error ? error.message : '删除团队失败');
17239: 172:       throw error;
17240: 173:     } finally {
17241: 174:       this.loadingState.set(false);
17242: 175:     }
17243: 176:   }
17244: 177: 
17245: 178:   /**
17246: 179:    * 选择团队
17247: 180:    */
17248: 181:   selectTeam(team: Team | null): void {
17249: 182:     this.selectedTeamState.set(team);
17250: 183:     if (team) {
17251: 184:       this.loadTeamMembers(team.id);
17252: 185:     } else {
17253: 186:       this.teamMembersState.set([]);
17254: 187:     }
17255: 188:   }
17256: 189: 
17257: 190:   /**
17258: 191:    * 加载团队成员列表
17259: 192:    */
17260: 193:   async loadTeamMembers(teamId: string): Promise<TeamMember[]> {
17261: 194:     this.loadingState.set(true);
17262: 195:     this.errorState.set(null);
17263: 196: 
17264: 197:     try {
17265: 198:       const members = await firstValueFrom(
17266: 199:         this.teamMemberRepository.findByTeamId(teamId)
17267: 200:       ) as TeamMember[];
17268: 201:       this.teamMembersState.set(members);
17269: 202:       return members;
17270: 203:     } catch (error) {
17271: 204:       this.errorState.set(error instanceof Error ? error.message : '加载团队成员失败');
17272: 205:       throw error;
17273: 206:     } finally {
17274: 207:       this.loadingState.set(false);
17275: 208:     }
17276: 209:   }
17277: 210: 
17278: 211:   /**
17279: 212:    * 添加团队成员
17280: 213:    */
17281: 214:   async addTeamMember(teamId: string, accountId: string, role: TeamMemberRole = TeamMemberRole.MEMBER): Promise<TeamMember> {
17282: 215:     this.loadingState.set(true);
17283: 216:     this.errorState.set(null);
17284: 217: 
17285: 218:     try {
17286: 219:       // BaseRepository 会自动将 camelCase 转换为 snake_case
17287: 220:       const memberData = {
17288: 221:         teamId, // 会自动转换为 team_id
17289: 222:         accountId, // 会自动转换为 account_id
17290: 223:         role,
17291: 224:       } as any as TeamMemberInsert;
17292: 225:       const member = await firstValueFrom(
17293: 226:         this.teamMemberRepository.create(memberData)
17294: 227:       ) as TeamMember;
17295: 228:       // 更新本地状态
17296: 229:       this.teamMembersState.update(members => [...members, member]);
17297: 230:       return member;
17298: 231:     } catch (error) {
17299: 232:       this.errorState.set(error instanceof Error ? error.message : '添加团队成员失败');
17300: 233:       throw error;
17301: 234:     } finally {
17302: 235:       this.loadingState.set(false);
17303: 236:     }
17304: 237:   }
17305: 238: 
17306: 239:   /**
17307: 240:    * 移除团队成员
17308: 241:    */
17309: 242:   async removeTeamMember(memberId: string): Promise<void> {
17310: 243:     this.loadingState.set(true);
17311: 244:     this.errorState.set(null);
17312: 245: 
17313: 246:     try {
17314: 247:       await firstValueFrom(this.teamMemberRepository.delete(memberId));
17315: 248:       // 更新本地状态
17316: 249:       this.teamMembersState.update(members => members.filter(m => m.id !== memberId));
17317: 250:     } catch (error) {
17318: 251:       this.errorState.set(error instanceof Error ? error.message : '移除团队成员失败');
17319: 252:       throw error;
17320: 253:     } finally {
17321: 254:       this.loadingState.set(false);
17322: 255:     }
17323: 256:   }
17324: 257: 
17325: 258:   /**
17326: 259:    * 更新团队成员角色
17327: 260:    */
17328: 261:   async updateTeamMemberRole(memberId: string, role: TeamMemberRole): Promise<TeamMember> {
17329: 262:     this.loadingState.set(true);
17330: 263:     this.errorState.set(null);
17331: 264: 
17332: 265:     try {
17333: 266:       const updateData: TeamMemberUpdate = { role };
17334: 267:       const member = await firstValueFrom(
17335: 268:         this.teamMemberRepository.update(memberId, updateData)
17336: 269:       ) as TeamMember;
17337: 270:       // 更新本地状态
17338: 271:       this.teamMembersState.update(members =>
17339: 272:         members.map(m => m.id === memberId ? member : m)
17340: 273:       );
17341: 274:       return member;
17342: 275:     } catch (error) {
17343: 276:       this.errorState.set(error instanceof Error ? error.message : '更新团队成员角色失败');
17344: 277:       throw error;
17345: 278:     } finally {
17346: 279:       this.loadingState.set(false);
17347: 280:     }
17348: 281:   }
17349: 282: 
17350: 283:   /**
17351: 284:    * 重置状态
17352: 285:    */
17353: 286:   reset(): void {
17354: 287:     this.teamsState.set([]);
17355: 288:     this.selectedTeamState.set(null);
17356: 289:     this.teamMembersState.set([]);
17357: 290:     this.errorState.set(null);
17358: 291:   }
17359: 292: }
17360: ````
17361: 
17362: ## File: src/app/shared/services/blueprint/blueprint.service.ts
17363: ````typescript
17364:   1: import { Injectable, inject } from '@angular/core';
17365:   2: import { signal, computed } from '@angular/core';
17366:   3: import { Observable, firstValueFrom } from 'rxjs';
17367:   4: import {
17368:   5:   BlueprintRepository,
17369:   6:   BlueprintConfigRepository,
17370:   7:   BlueprintInsert,
17371:   8:   BlueprintUpdate,
17372:   9:   BlueprintConfigInsert,
17373:  10:   BlueprintConfigUpdate
17374:  11: } from '@core';
17375:  12: import { Blueprint, BlueprintConfig, BlueprintStatus } from '@shared';
17376:  13: 
17377:  14: /**
17378:  15:  * Blueprint Service
17379:  16:  * 
17380:  17:  * 提供蓝图相关的业务逻辑和状态管理
17381:  18:  * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
17382:  19:  * 
17383:  20:  * @example
17384:  21:  * ```typescript
17385:  22:  * const blueprintService = inject(BlueprintService);
17386:  23:  * 
17387:  24:  * // 订阅蓝图列表
17388:  25:  * effect(() => {
17389:  26:  *   console.log('Blueprints:', blueprintService.blueprints());
17390:  27:  * });
17391:  28:  * 
17392:  29:  * // 加载蓝图列表
17393:  30:  * await blueprintService.loadBlueprints();
17394:  31:  * ```
17395:  32:  */
17396:  33: @Injectable({
17397:  34:   providedIn: 'root'
17398:  35: })
17399:  36: export class BlueprintService {
17400:  37:   private blueprintRepository = inject(BlueprintRepository);
17401:  38:   private blueprintConfigRepository = inject(BlueprintConfigRepository);
17402:  39: 
17403:  40:   // 使用 Signals 管理状态
17404:  41:   private blueprintsState = signal<Blueprint[]>([]);
17405:  42:   private selectedBlueprintState = signal<Blueprint | null>(null);
17406:  43:   private configsState = signal<BlueprintConfig[]>([]);
17407:  44:   private loadingState = signal<boolean>(false);
17408:  45:   private errorState = signal<string | null>(null);
17409:  46: 
17410:  47:   // 暴露 ReadonlySignal 给组件
17411:  48:   readonly blueprints = this.blueprintsState.asReadonly();
17412:  49:   readonly selectedBlueprint = this.selectedBlueprintState.asReadonly();
17413:  50:   readonly configs = this.configsState.asReadonly();
17414:  51:   readonly loading = this.loadingState.asReadonly();
17415:  52:   readonly error = this.errorState.asReadonly();
17416:  53: 
17417:  54:   // Computed signals
17418:  55:   readonly activeBlueprints = computed(() =>
17419:  56:     this.blueprints().filter(b => b.status === BlueprintStatus.ACTIVE)
17420:  57:   );
17421:  58: 
17422:  59:   readonly planningBlueprints = computed(() =>
17423:  60:     this.blueprints().filter(b => b.status === BlueprintStatus.PLANNING)
17424:  61:   );
17425:  62: 
17426:  63:   readonly completedBlueprints = computed(() =>
17427:  64:     this.blueprints().filter(b => b.status === BlueprintStatus.COMPLETED)
17428:  65:   );
17429:  66: 
17430:  67:   /**
17431:  68:    * 加载所有蓝图
17432:  69:    */
17433:  70:   async loadBlueprints(): Promise<void> {
17434:  71:     this.loadingState.set(true);
17435:  72:     this.errorState.set(null);
17436:  73: 
17437:  74:     try {
17438:  75:       const blueprints = await firstValueFrom(this.blueprintRepository.findAll());
17439:  76:       this.blueprintsState.set(blueprints);
17440:  77:     } catch (error) {
17441:  78:       this.errorState.set(error instanceof Error ? error.message : '加载蓝图列表失败');
17442:  79:       throw error;
17443:  80:     } finally {
17444:  81:       this.loadingState.set(false);
17445:  82:     }
17446:  83:   }
17447:  84: 
17448:  85:   /**
17449:  86:    * 根据 ID 加载蓝图
17450:  87:    */
17451:  88:   async loadBlueprintById(id: string): Promise<Blueprint | null> {
17452:  89:     this.loadingState.set(true);
17453:  90:     this.errorState.set(null);
17454:  91: 
17455:  92:     try {
17456:  93:       const blueprint = await firstValueFrom(this.blueprintRepository.findById(id));
17457:  94:       if (blueprint) {
17458:  95:         this.selectedBlueprintState.set(blueprint);
17459:  96:         // 同时加载配置
17460:  97:         await this.loadConfigs(id);
17461:  98:       }
17462:  99:       return blueprint;
17463: 100:     } catch (error) {
17464: 101:       this.errorState.set(error instanceof Error ? error.message : '加载蓝图失败');
17465: 102:       throw error;
17466: 103:     } finally {
17467: 104:       this.loadingState.set(false);
17468: 105:     }
17469: 106:   }
17470: 107: 
17471: 108:   /**
17472: 109:    * 根据拥有者 ID 加载蓝图列表
17473: 110:    */
17474: 111:   async loadBlueprintsByOwnerId(ownerId: string): Promise<Blueprint[]> {
17475: 112:     this.loadingState.set(true);
17476: 113:     this.errorState.set(null);
17477: 114: 
17478: 115:     try {
17479: 116:       const blueprints = await firstValueFrom(this.blueprintRepository.findByOwnerId(ownerId));
17480: 117:       this.blueprintsState.set(blueprints);
17481: 118:       return blueprints;
17482: 119:     } catch (error) {
17483: 120:       this.errorState.set(error instanceof Error ? error.message : '加载蓝图列表失败');
17484: 121:       throw error;
17485: 122:     } finally {
17486: 123:       this.loadingState.set(false);
17487: 124:     }
17488: 125:   }
17489: 126: 
17490: 127:   /**
17491: 128:    * 根据状态加载蓝图列表
17492: 129:    */
17493: 130:   async loadBlueprintsByStatus(status: BlueprintStatus): Promise<Blueprint[]> {
17494: 131:     this.loadingState.set(true);
17495: 132:     this.errorState.set(null);
17496: 133: 
17497: 134:     try {
17498: 135:       const blueprints = await firstValueFrom(this.blueprintRepository.findByStatus(status));
17499: 136:       return blueprints;
17500: 137:     } catch (error) {
17501: 138:       this.errorState.set(error instanceof Error ? error.message : '加载蓝图列表失败');
17502: 139:       throw error;
17503: 140:     } finally {
17504: 141:       this.loadingState.set(false);
17505: 142:     }
17506: 143:   }
17507: 144: 
17508: 145:   /**
17509: 146:    * 根据项目代码加载蓝图
17510: 147:    */
17511: 148:   async loadBlueprintByProjectCode(projectCode: string): Promise<Blueprint | null> {
17512: 149:     this.loadingState.set(true);
17513: 150:     this.errorState.set(null);
17514: 151: 
17515: 152:     try {
17516: 153:       const blueprint = await firstValueFrom(
17517: 154:         this.blueprintRepository.findByProjectCode(projectCode)
17518: 155:       );
17519: 156:       if (blueprint) {
17520: 157:         this.selectedBlueprintState.set(blueprint);
17521: 158:       }
17522: 159:       return blueprint;
17523: 160:     } catch (error) {
17524: 161:       this.errorState.set(error instanceof Error ? error.message : '加载蓝图失败');
17525: 162:       throw error;
17526: 163:     } finally {
17527: 164:       this.loadingState.set(false);
17528: 165:     }
17529: 166:   }
17530: 167: 
17531: 168:   /**
17532: 169:    * 创建蓝图
17533: 170:    */
17534: 171:   async createBlueprint(data: BlueprintInsert): Promise<Blueprint> {
17535: 172:     this.loadingState.set(true);
17536: 173:     this.errorState.set(null);
17537: 174: 
17538: 175:     try {
17539: 176:       const blueprint = await firstValueFrom(this.blueprintRepository.create(data));
17540: 177:       // 更新本地状态
17541: 178:       this.blueprintsState.update(blueprints => [...blueprints, blueprint]);
17542: 179:       return blueprint;
17543: 180:     } catch (error) {
17544: 181:       this.errorState.set(error instanceof Error ? error.message : '创建蓝图失败');
17545: 182:       throw error;
17546: 183:     } finally {
17547: 184:       this.loadingState.set(false);
17548: 185:     }
17549: 186:   }
17550: 187: 
17551: 188:   /**
17552: 189:    * 更新蓝图
17553: 190:    */
17554: 191:   async updateBlueprint(id: string, data: BlueprintUpdate): Promise<Blueprint> {
17555: 192:     this.loadingState.set(true);
17556: 193:     this.errorState.set(null);
17557: 194: 
17558: 195:     try {
17559: 196:       const blueprint = await firstValueFrom(this.blueprintRepository.update(id, data));
17560: 197:       // 更新本地状态
17561: 198:       this.blueprintsState.update(blueprints =>
17562: 199:         blueprints.map(b => (b.id === id ? blueprint : b))
17563: 200:       );
17564: 201:       // 如果更新的是当前选中的蓝图，也更新选中状态
17565: 202:       if (this.selectedBlueprint()?.id === id) {
17566: 203:         this.selectedBlueprintState.set(blueprint);
17567: 204:       }
17568: 205:       return blueprint;
17569: 206:     } catch (error) {
17570: 207:       this.errorState.set(error instanceof Error ? error.message : '更新蓝图失败');
17571: 208:       throw error;
17572: 209:     } finally {
17573: 210:       this.loadingState.set(false);
17574: 211:     }
17575: 212:   }
17576: 213: 
17577: 214:   /**
17578: 215:    * 删除蓝图
17579: 216:    */
17580: 217:   async deleteBlueprint(id: string): Promise<void> {
17581: 218:     this.loadingState.set(true);
17582: 219:     this.errorState.set(null);
17583: 220: 
17584: 221:     try {
17585: 222:       await firstValueFrom(this.blueprintRepository.delete(id));
17586: 223:       // 更新本地状态
17587: 224:       this.blueprintsState.update(blueprints => blueprints.filter(b => b.id !== id));
17588: 225:       // 如果删除的是当前选中的蓝图，清空选中状态
17589: 226:       if (this.selectedBlueprint()?.id === id) {
17590: 227:         this.selectedBlueprintState.set(null);
17591: 228:         this.configsState.set([]);
17592: 229:       }
17593: 230:     } catch (error) {
17594: 231:       this.errorState.set(error instanceof Error ? error.message : '删除蓝图失败');
17595: 232:       throw error;
17596: 233:     } finally {
17597: 234:       this.loadingState.set(false);
17598: 235:     }
17599: 236:   }
17600: 237: 
17601: 238:   /**
17602: 239:    * 选择蓝图
17603: 240:    */
17604: 241:   selectBlueprint(blueprint: Blueprint | null): void {
17605: 242:     this.selectedBlueprintState.set(blueprint);
17606: 243:     if (blueprint) {
17607: 244:       this.loadConfigs(blueprint.id);
17608: 245:     } else {
17609: 246:       this.configsState.set([]);
17610: 247:     }
17611: 248:   }
17612: 249: 
17613: 250:   /**
17614: 251:    * 加载蓝图配置
17615: 252:    */
17616: 253:   async loadConfigs(blueprintId: string): Promise<BlueprintConfig[]> {
17617: 254:     this.loadingState.set(true);
17618: 255:     this.errorState.set(null);
17619: 256: 
17620: 257:     try {
17621: 258:       const configs = await firstValueFrom(
17622: 259:         this.blueprintConfigRepository.findByBlueprintId(blueprintId)
17623: 260:       );
17624: 261:       this.configsState.set(configs);
17625: 262:       return configs;
17626: 263:     } catch (error) {
17627: 264:       this.errorState.set(error instanceof Error ? error.message : '加载配置失败');
17628: 265:       throw error;
17629: 266:     } finally {
17630: 267:       this.loadingState.set(false);
17631: 268:     }
17632: 269:   }
17633: 270: 
17634: 271:   /**
17635: 272:    * 获取配置值
17636: 273:    */
17637: 274:   async getConfig(blueprintId: string, configKey: string): Promise<BlueprintConfig | null> {
17638: 275:     return await firstValueFrom(
17639: 276:       this.blueprintConfigRepository.findByConfigKey(blueprintId, configKey)
17640: 277:     );
17641: 278:   }
17642: 279: 
17643: 280:   /**
17644: 281:    * 设置配置
17645: 282:    */
17646: 283:   async setConfig(
17647: 284:     blueprintId: string,
17648: 285:     configKey: string,
17649: 286:     configValue: any,
17650: 287:     updatedBy?: string
17651: 288:   ): Promise<BlueprintConfig> {
17652: 289:     this.loadingState.set(true);
17653: 290:     this.errorState.set(null);
17654: 291: 
17655: 292:     try {
17656: 293:       const config = await firstValueFrom(
17657: 294:         this.blueprintConfigRepository.upsertConfig(blueprintId, configKey, configValue, updatedBy)
17658: 295:       );
17659: 296:       // 更新本地状态
17660: 297:       this.configsState.update(configs => {
17661: 298:         // 注意：数据库字段是 config_key，但 BaseRepository 会转换为 configKey
17662: 299:         const existing = configs.find(c => (c as any).configKey === configKey || (c as any).config_key === configKey);
17663: 300:         if (existing) {
17664: 301:           return configs.map(c => (c.id === config.id ? config : c));
17665: 302:         }
17666: 303:         return [...configs, config];
17667: 304:       });
17668: 305:       return config;
17669: 306:     } catch (error) {
17670: 307:       this.errorState.set(error instanceof Error ? error.message : '设置配置失败');
17671: 308:       throw error;
17672: 309:     } finally {
17673: 310:       this.loadingState.set(false);
17674: 311:     }
17675: 312:   }
17676: 313: 
17677: 314:   /**
17678: 315:    * 重置状态
17679: 316:    */
17680: 317:   reset(): void {
17681: 318:     this.blueprintsState.set([]);
17682: 319:     this.selectedBlueprintState.set(null);
17683: 320:     this.configsState.set([]);
17684: 321:     this.errorState.set(null);
17685: 322:   }
17686: 323: }
17687: ````
17688: 
17689: ## File: src/app/shared/services/blueprint/branch.service.ts
17690: ````typescript
17691:   1: import { Injectable, inject } from '@angular/core';
17692:   2: import { signal, computed } from '@angular/core';
17693:   3: import { Observable, firstValueFrom } from 'rxjs';
17694:   4: import {
17695:   5:   BlueprintBranchRepository,
17696:   6:   BranchForkRepository,
17697:   7:   BlueprintBranchInsert,
17698:   8:   BlueprintBranchUpdate,
17699:   9:   BranchForkInsert,
17700:  10:   BranchType,
17701:  11:   BranchStatus
17702:  12: } from '@core';
17703:  13: import { BlueprintBranch, BranchFork } from '@shared';
17704:  14: 
17705:  15: /**
17706:  16:  * Branch Service
17707:  17:  * 
17708:  18:  * 提供分支管理相关的业务逻辑和状态管理
17709:  19:  * 实现 Git-like 分支模型：Fork 机制、分支同步等
17710:  20:  * 
17711:  21:  * @example
17712:  22:  * ```typescript
17713:  23:  * const branchService = inject(BranchService);
17714:  24:  * 
17715:  25:  * // 订阅分支列表
17716:  26:  * effect(() => {
17717:  27:  *   console.log('Branches:', branchService.branches());
17718:  28:  * });
17719:  29:  * 
17720:  30:  * // Fork 分支给组织
17721:  31:  * await branchService.forkBranch('blueprint-id', 'org-id', 'branch-name');
17722:  32:  * ```
17723:  33:  */
17724:  34: @Injectable({
17725:  35:   providedIn: 'root'
17726:  36: })
17727:  37: export class BranchService {
17728:  38:   private branchRepository = inject(BlueprintBranchRepository);
17729:  39:   private branchForkRepository = inject(BranchForkRepository);
17730:  40: 
17731:  41:   // 使用 Signals 管理状态
17732:  42:   private branchesState = signal<BlueprintBranch[]>([]);
17733:  43:   private selectedBranchState = signal<BlueprintBranch | null>(null);
17734:  44:   private forksState = signal<BranchFork[]>([]);
17735:  45:   private loadingState = signal<boolean>(false);
17736:  46:   private errorState = signal<string | null>(null);
17737:  47: 
17738:  48:   // 暴露 ReadonlySignal 给组件
17739:  49:   readonly branches = this.branchesState.asReadonly();
17740:  50:   readonly selectedBranch = this.selectedBranchState.asReadonly();
17741:  51:   readonly forks = this.forksState.asReadonly();
17742:  52:   readonly loading = this.loadingState.asReadonly();
17743:  53:   readonly error = this.errorState.asReadonly();
17744:  54: 
17745:  55:   // Computed signals
17746:  56:   readonly activeBranches = computed(() =>
17747:  57:     this.branches().filter(b => b.status === BranchStatus.ACTIVE)
17748:  58:   );
17749:  59: 
17750:  60:   readonly mergedBranches = computed(() =>
17751:  61:     this.branches().filter(b => b.status === BranchStatus.MERGED)
17752:  62:   );
17753:  63: 
17754:  64:   /**
17755:  65:    * 加载所有分支
17756:  66:    */
17757:  67:   async loadBranches(): Promise<void> {
17758:  68:     this.loadingState.set(true);
17759:  69:     this.errorState.set(null);
17760:  70: 
17761:  71:     try {
17762:  72:       const branches = await firstValueFrom(this.branchRepository.findAll());
17763:  73:       this.branchesState.set(branches);
17764:  74:     } catch (error) {
17765:  75:       this.errorState.set(error instanceof Error ? error.message : '加载分支列表失败');
17766:  76:       throw error;
17767:  77:     } finally {
17768:  78:       this.loadingState.set(false);
17769:  79:     }
17770:  80:   }
17771:  81: 
17772:  82:   /**
17773:  83:    * 根据蓝图 ID 加载分支列表
17774:  84:    */
17775:  85:   async loadBranchesByBlueprintId(blueprintId: string): Promise<BlueprintBranch[]> {
17776:  86:     this.loadingState.set(true);
17777:  87:     this.errorState.set(null);
17778:  88: 
17779:  89:     try {
17780:  90:       const branches = await firstValueFrom(
17781:  91:         this.branchRepository.findByBlueprintId(blueprintId)
17782:  92:       );
17783:  93:       this.branchesState.set(branches);
17784:  94:       return branches;
17785:  95:     } catch (error) {
17786:  96:       this.errorState.set(error instanceof Error ? error.message : '加载分支列表失败');
17787:  97:       throw error;
17788:  98:     } finally {
17789:  99:       this.loadingState.set(false);
17790: 100:     }
17791: 101:   }
17792: 102: 
17793: 103:   /**
17794: 104:    * 根据组织 ID 加载分支列表
17795: 105:    */
17796: 106:   async loadBranchesByOrganizationId(organizationId: string): Promise<BlueprintBranch[]> {
17797: 107:     this.loadingState.set(true);
17798: 108:     this.errorState.set(null);
17799: 109: 
17800: 110:     try {
17801: 111:       const branches = await firstValueFrom(
17802: 112:         this.branchRepository.findByOrganizationId(organizationId)
17803: 113:       );
17804: 114:       this.branchesState.set(branches);
17805: 115:       return branches;
17806: 116:     } catch (error) {
17807: 117:       this.errorState.set(error instanceof Error ? error.message : '加载分支列表失败');
17808: 118:       throw error;
17809: 119:     } finally {
17810: 120:       this.loadingState.set(false);
17811: 121:     }
17812: 122:   }
17813: 123: 
17814: 124:   /**
17815: 125:    * 根据 ID 加载分支
17816: 126:    */
17817: 127:   async loadBranchById(id: string): Promise<BlueprintBranch | null> {
17818: 128:     this.loadingState.set(true);
17819: 129:     this.errorState.set(null);
17820: 130: 
17821: 131:     try {
17822: 132:       const branch = await firstValueFrom(this.branchRepository.findById(id));
17823: 133:       if (branch) {
17824: 134:         this.selectedBranchState.set(branch);
17825: 135:         // 同时加载 Fork 记录
17826: 136:         await this.loadForksByBranchId(id);
17827: 137:       }
17828: 138:       return branch;
17829: 139:     } catch (error) {
17830: 140:       this.errorState.set(error instanceof Error ? error.message : '加载分支失败');
17831: 141:       throw error;
17832: 142:     } finally {
17833: 143:       this.loadingState.set(false);
17834: 144:     }
17835: 145:   }
17836: 146: 
17837: 147:   /**
17838: 148:    * Fork 分支给组织（创建组织分支）
17839: 149:    * 
17840: 150:    * @param blueprintId 蓝图 ID
17841: 151:    * @param organizationId 组织 ID
17842: 152:    * @param branchName 分支名称
17843: 153:    * @param branchType 分支类型
17844: 154:    * @param forkedBy Fork 操作者 ID
17845: 155:    * @param notes 备注
17846: 156:    * @returns 创建的分支
17847: 157:    */
17848: 158:   async forkBranch(
17849: 159:     blueprintId: string,
17850: 160:     organizationId: string,
17851: 161:     branchName: string,
17852: 162:     branchType: BranchType = BranchType.CONTRACTOR,
17853: 163:     forkedBy: string,
17854: 164:     notes?: string
17855: 165:   ): Promise<BlueprintBranch> {
17856: 166:     this.loadingState.set(true);
17857: 167:     this.errorState.set(null);
17858: 168: 
17859: 169:     try {
17860: 170:       // 检查是否已存在分支
17861: 171:       const existing = await firstValueFrom(
17862: 172:         this.branchRepository.findByBlueprintAndOrganization(blueprintId, organizationId)
17863: 173:       );
17864: 174: 
17865: 175:       if (existing) {
17866: 176:         throw new Error('该组织已存在分支');
17867: 177:       }
17868: 178: 
17869: 179:       // 创建分支
17870: 180:       // 使用类型断言，因为 BaseRepository 会自动进行 camelCase → snake_case 转换
17871: 181:       const branchData = {
17872: 182:         blueprintId,
17873: 183:         organizationId,
17874: 184:         branchName,
17875: 185:         branchType,
17876: 186:         status: BranchStatus.ACTIVE,
17877: 187:         notes
17878: 188:       } as any as BlueprintBranchInsert;
17879: 189: 
17880: 190:       const branch = await firstValueFrom(this.branchRepository.create(branchData));
17881: 191: 
17882: 192:       // 创建 Fork 记录
17883: 193:       // 使用类型断言，因为 BaseRepository 会自动进行 camelCase → snake_case 转换
17884: 194:       const forkData = {
17885: 195:         blueprintId,
17886: 196:         branchId: branch.id,
17887: 197:         forkedBy,
17888: 198:         forkReason: notes
17889: 199:       } as any as BranchForkInsert;
17890: 200:       await firstValueFrom(this.branchForkRepository.create(forkData));
17891: 201: 
17892: 202:       // 更新本地状态
17893: 203:       this.branchesState.update(branches => [...branches, branch]);
17894: 204:       return branch;
17895: 205:     } catch (error) {
17896: 206:       this.errorState.set(error instanceof Error ? error.message : 'Fork 分支失败');
17897: 207:       throw error;
17898: 208:     } finally {
17899: 209:       this.loadingState.set(false);
17900: 210:     }
17901: 211:   }
17902: 212: 
17903: 213:   /**
17904: 214:    * 更新分支
17905: 215:    */
17906: 216:   async updateBranch(id: string, data: BlueprintBranchUpdate): Promise<BlueprintBranch> {
17907: 217:     this.loadingState.set(true);
17908: 218:     this.errorState.set(null);
17909: 219: 
17910: 220:     try {
17911: 221:       const branch = await firstValueFrom(this.branchRepository.update(id, data));
17912: 222:       // 更新本地状态
17913: 223:       this.branchesState.update(branches =>
17914: 224:         branches.map(b => (b.id === id ? branch : b))
17915: 225:       );
17916: 226:       // 如果更新的是当前选中的分支，也更新选中状态
17917: 227:       if (this.selectedBranch()?.id === id) {
17918: 228:         this.selectedBranchState.set(branch);
17919: 229:       }
17920: 230:       return branch;
17921: 231:     } catch (error) {
17922: 232:       this.errorState.set(error instanceof Error ? error.message : '更新分支失败');
17923: 233:       throw error;
17924: 234:     } finally {
17925: 235:       this.loadingState.set(false);
17926: 236:     }
17927: 237:   }
17928: 238: 
17929: 239:   /**
17930: 240:    * 删除分支
17931: 241:    */
17932: 242:   async deleteBranch(id: string): Promise<void> {
17933: 243:     this.loadingState.set(true);
17934: 244:     this.errorState.set(null);
17935: 245: 
17936: 246:     try {
17937: 247:       await firstValueFrom(this.branchRepository.delete(id));
17938: 248:       // 更新本地状态
17939: 249:       this.branchesState.update(branches => branches.filter(b => b.id !== id));
17940: 250:       // 如果删除的是当前选中的分支，清空选中状态
17941: 251:       if (this.selectedBranch()?.id === id) {
17942: 252:         this.selectedBranchState.set(null);
17943: 253:         this.forksState.set([]);
17944: 254:       }
17945: 255:     } catch (error) {
17946: 256:       this.errorState.set(error instanceof Error ? error.message : '删除分支失败');
17947: 257:       throw error;
17948: 258:     } finally {
17949: 259:       this.loadingState.set(false);
17950: 260:     }
17951: 261:   }
17952: 262: 
17953: 263:   /**
17954: 264:    * 选择分支
17955: 265:    */
17956: 266:   selectBranch(branch: BlueprintBranch | null): void {
17957: 267:     this.selectedBranchState.set(branch);
17958: 268:     if (branch) {
17959: 269:       this.loadForksByBranchId(branch.id);
17960: 270:     } else {
17961: 271:       this.forksState.set([]);
17962: 272:     }
17963: 273:   }
17964: 274: 
17965: 275:   /**
17966: 276:    * 加载分支的 Fork 记录
17967: 277:    */
17968: 278:   async loadForksByBranchId(branchId: string): Promise<BranchFork[]> {
17969: 279:     this.loadingState.set(true);
17970: 280:     this.errorState.set(null);
17971: 281: 
17972: 282:     try {
17973: 283:       const forks = await firstValueFrom(this.branchForkRepository.findByBranchId(branchId));
17974: 284:       this.forksState.set(forks);
17975: 285:       return forks;
17976: 286:     } catch (error) {
17977: 287:       this.errorState.set(error instanceof Error ? error.message : '加载 Fork 记录失败');
17978: 288:       throw error;
17979: 289:     } finally {
17980: 290:       this.loadingState.set(false);
17981: 291:     }
17982: 292:   }
17983: 293: 
17984: 294:   /**
17985: 295:    * 同步主分支数据到分支（更新 last_sync_at）
17986: 296:    * 
17987: 297:    * @param branchId 分支 ID
17988: 298:    */
17989: 299:   async syncFromMainBranch(branchId: string): Promise<void> {
17990: 300:     this.loadingState.set(true);
17991: 301:     this.errorState.set(null);
17992: 302: 
17993: 303:     try {
17994: 304:       await this.updateBranch(branchId, {
17995: 305:         lastSyncAt: new Date().toISOString()
17996: 306:       } as any);
17997: 307:     } catch (error) {
17998: 308:       this.errorState.set(error instanceof Error ? error.message : '同步主分支数据失败');
17999: 309:       throw error;
18000: 310:     } finally {
18001: 311:       this.loadingState.set(false);
18002: 312:     }
18003: 313:   }
18004: 314: 
18005: 315:   /**
18006: 316:    * 关闭分支
18007: 317:    */
18008: 318:   async closeBranch(branchId: string): Promise<BlueprintBranch> {
18009: 319:     return await this.updateBranch(branchId, {
18010: 320:       status: BranchStatus.CLOSED
18011: 321:     } as any);
18012: 322:   }
18013: 323: 
18014: 324:   /**
18015: 325:    * 标记分支为已合并
18016: 326:    */
18017: 327:   async markBranchAsMerged(branchId: string): Promise<BlueprintBranch> {
18018: 328:     return await this.updateBranch(branchId, {
18019: 329:       status: BranchStatus.MERGED
18020: 330:     } as any);
18021: 331:   }
18022: 332: 
18023: 333:   /**
18024: 334:    * 重置状态
18025: 335:    */
18026: 336:   reset(): void {
18027: 337:     this.branchesState.set([]);
18028: 338:     this.selectedBranchState.set(null);
18029: 339:     this.forksState.set([]);
18030: 340:     this.errorState.set(null);
18031: 341:   }
18032: 342: }
18033: ````
18034: 
18035: ## File: src/app/shared/services/blueprint/index.ts
18036: ````typescript
18037:  1: /**
18038:  2:  * 蓝图服务导出
18039:  3:  * 
18040:  4:  * 提供蓝图系统相关的服务：
18041:  5:  * - BlueprintService: 蓝图 CRUD 操作和主分支管理
18042:  6:  * - BranchService: 分支管理和 Fork 机制
18043:  7:  * - PullRequestService: PR 创建、审核、合并
18044:  8:  * 
18045:  9:  * @module shared/services/blueprint
18046: 10:  */
18047: 11: 
18048: 12: export * from './blueprint.service';
18049: 13: export * from './branch.service';
18050: 14: export * from './pull-request.service';
18051: ````
18052: 
18053: ## File: src/app/shared/services/blueprint/pull-request.service.ts
18054: ````typescript
18055:   1: import { Injectable, inject } from '@angular/core';
18056:   2: import { signal, computed } from '@angular/core';
18057:   3: import { Observable, firstValueFrom } from 'rxjs';
18058:   4: import {
18059:   5:   PullRequestRepository,
18060:   6:   PullRequestInsert,
18061:   7:   PullRequestUpdate,
18062:   8:   PRStatus
18063:   9: } from '@core';
18064:  10: import { PullRequest } from '@shared';
18065:  11: 
18066:  12: /**
18067:  13:  * PullRequest Service
18068:  14:  * 
18069:  15:  * 提供 Pull Request 相关的业务逻辑和状态管理
18070:  16:  * 实现 Git-like PR 机制：创建、审核、合并（更新承揽字段）
18071:  17:  * 
18072:  18:  * @example
18073:  19:  * ```typescript
18074:  20:  * const prService = inject(PullRequestService);
18075:  21:  * 
18076:  22:  * // 订阅 PR 列表
18077:  23:  * effect(() => {
18078:  24:  *   console.log('Pull Requests:', prService.pullRequests());
18079:  25:  * });
18080:  26:  * 
18081:  27:  * // 创建 PR
18082:  28:  * await prService.createPullRequest({
18083:  29:  *   blueprintId: 'blueprint-id',
18084:  30:  *   branchId: 'branch-id',
18085:  31:  *   title: '提交执行数据',
18086:  32:  *   submittedBy: 'user-id'
18087:  33:  * });
18088:  34:  * ```
18089:  35:  */
18090:  36: @Injectable({
18091:  37:   providedIn: 'root'
18092:  38: })
18093:  39: export class PullRequestService {
18094:  40:   private pullRequestRepository = inject(PullRequestRepository);
18095:  41: 
18096:  42:   // 使用 Signals 管理状态
18097:  43:   private pullRequestsState = signal<PullRequest[]>([]);
18098:  44:   private selectedPullRequestState = signal<PullRequest | null>(null);
18099:  45:   private loadingState = signal<boolean>(false);
18100:  46:   private errorState = signal<string | null>(null);
18101:  47: 
18102:  48:   // 暴露 ReadonlySignal 给组件
18103:  49:   readonly pullRequests = this.pullRequestsState.asReadonly();
18104:  50:   readonly selectedPullRequest = this.selectedPullRequestState.asReadonly();
18105:  51:   readonly loading = this.loadingState.asReadonly();
18106:  52:   readonly error = this.errorState.asReadonly();
18107:  53: 
18108:  54:   // Computed signals
18109:  55:   readonly openPullRequests = computed(() =>
18110:  56:     this.pullRequests().filter(pr => pr.status === PRStatus.OPEN)
18111:  57:   );
18112:  58: 
18113:  59:   readonly reviewingPullRequests = computed(() =>
18114:  60:     this.pullRequests().filter(pr => pr.status === PRStatus.REVIEWING)
18115:  61:   );
18116:  62: 
18117:  63:   readonly approvedPullRequests = computed(() =>
18118:  64:     this.pullRequests().filter(pr => pr.status === PRStatus.APPROVED)
18119:  65:   );
18120:  66: 
18121:  67:   readonly mergedPullRequests = computed(() =>
18122:  68:     this.pullRequests().filter(pr => pr.status === PRStatus.MERGED)
18123:  69:   );
18124:  70: 
18125:  71:   /**
18126:  72:    * 加载所有 Pull Request
18127:  73:    */
18128:  74:   async loadPullRequests(): Promise<void> {
18129:  75:     this.loadingState.set(true);
18130:  76:     this.errorState.set(null);
18131:  77: 
18132:  78:     try {
18133:  79:       const pullRequests = await firstValueFrom(this.pullRequestRepository.findAll());
18134:  80:       this.pullRequestsState.set(pullRequests);
18135:  81:     } catch (error) {
18136:  82:       this.errorState.set(error instanceof Error ? error.message : '加载 Pull Request 列表失败');
18137:  83:       throw error;
18138:  84:     } finally {
18139:  85:       this.loadingState.set(false);
18140:  86:     }
18141:  87:   }
18142:  88: 
18143:  89:   /**
18144:  90:    * 根据 ID 加载 Pull Request
18145:  91:    */
18146:  92:   async loadPullRequestById(id: string): Promise<PullRequest | null> {
18147:  93:     this.loadingState.set(true);
18148:  94:     this.errorState.set(null);
18149:  95: 
18150:  96:     try {
18151:  97:       const pullRequest = await firstValueFrom(this.pullRequestRepository.findById(id));
18152:  98:       if (pullRequest) {
18153:  99:         this.selectedPullRequestState.set(pullRequest);
18154: 100:       }
18155: 101:       return pullRequest;
18156: 102:     } catch (error) {
18157: 103:       this.errorState.set(error instanceof Error ? error.message : '加载 Pull Request 失败');
18158: 104:       throw error;
18159: 105:     } finally {
18160: 106:       this.loadingState.set(false);
18161: 107:     }
18162: 108:   }
18163: 109: 
18164: 110:   /**
18165: 111:    * 根据蓝图 ID 加载 Pull Request 列表
18166: 112:    */
18167: 113:   async loadPullRequestsByBlueprintId(blueprintId: string): Promise<PullRequest[]> {
18168: 114:     this.loadingState.set(true);
18169: 115:     this.errorState.set(null);
18170: 116: 
18171: 117:     try {
18172: 118:       const pullRequests = await firstValueFrom(
18173: 119:         this.pullRequestRepository.findByBlueprintId(blueprintId)
18174: 120:       );
18175: 121:       this.pullRequestsState.set(pullRequests);
18176: 122:       return pullRequests;
18177: 123:     } catch (error) {
18178: 124:       this.errorState.set(error instanceof Error ? error.message : '加载 Pull Request 列表失败');
18179: 125:       throw error;
18180: 126:     } finally {
18181: 127:       this.loadingState.set(false);
18182: 128:     }
18183: 129:   }
18184: 130: 
18185: 131:   /**
18186: 132:    * 根据分支 ID 加载 Pull Request 列表
18187: 133:    */
18188: 134:   async loadPullRequestsByBranchId(branchId: string): Promise<PullRequest[]> {
18189: 135:     this.loadingState.set(true);
18190: 136:     this.errorState.set(null);
18191: 137: 
18192: 138:     try {
18193: 139:       const pullRequests = await firstValueFrom(
18194: 140:         this.pullRequestRepository.findByBranchId(branchId)
18195: 141:       );
18196: 142:       this.pullRequestsState.set(pullRequests);
18197: 143:       return pullRequests;
18198: 144:     } catch (error) {
18199: 145:       this.errorState.set(error instanceof Error ? error.message : '加载 Pull Request 列表失败');
18200: 146:       throw error;
18201: 147:     } finally {
18202: 148:       this.loadingState.set(false);
18203: 149:     }
18204: 150:   }
18205: 151: 
18206: 152:   /**
18207: 153:    * 创建 Pull Request
18208: 154:    * 
18209: 155:    * @param data PR 数据
18210: 156:    * @returns 创建的 PR
18211: 157:    */
18212: 158:   async createPullRequest(data: PullRequestInsert): Promise<PullRequest> {
18213: 159:     this.loadingState.set(true);
18214: 160:     this.errorState.set(null);
18215: 161: 
18216: 162:     try {
18217: 163:       const pullRequest = await firstValueFrom(
18218: 164:         this.pullRequestRepository.create({
18219: 165:           ...data,
18220: 166:           status: PRStatus.OPEN
18221: 167:         } as any)
18222: 168:       );
18223: 169:       // 更新本地状态
18224: 170:       this.pullRequestsState.update(prs => [...prs, pullRequest]);
18225: 171:       return pullRequest;
18226: 172:     } catch (error) {
18227: 173:       this.errorState.set(error instanceof Error ? error.message : '创建 Pull Request 失败');
18228: 174:       throw error;
18229: 175:     } finally {
18230: 176:       this.loadingState.set(false);
18231: 177:     }
18232: 178:   }
18233: 179: 
18234: 180:   /**
18235: 181:    * 更新 Pull Request
18236: 182:    */
18237: 183:   async updatePullRequest(id: string, data: PullRequestUpdate): Promise<PullRequest> {
18238: 184:     this.loadingState.set(true);
18239: 185:     this.errorState.set(null);
18240: 186: 
18241: 187:     try {
18242: 188:       const pullRequest = await firstValueFrom(
18243: 189:         this.pullRequestRepository.update(id, data)
18244: 190:       );
18245: 191:       // 更新本地状态
18246: 192:       this.pullRequestsState.update(prs =>
18247: 193:         prs.map(pr => (pr.id === id ? pullRequest : pr))
18248: 194:       );
18249: 195:       // 如果更新的是当前选中的 PR，也更新选中状态
18250: 196:       if (this.selectedPullRequest()?.id === id) {
18251: 197:         this.selectedPullRequestState.set(pullRequest);
18252: 198:       }
18253: 199:       return pullRequest;
18254: 200:     } catch (error) {
18255: 201:       this.errorState.set(error instanceof Error ? error.message : '更新 Pull Request 失败');
18256: 202:       throw error;
18257: 203:     } finally {
18258: 204:       this.loadingState.set(false);
18259: 205:     }
18260: 206:   }
18261: 207: 
18262: 208:   /**
18263: 209:    * 删除 Pull Request
18264: 210:    */
18265: 211:   async deletePullRequest(id: string): Promise<void> {
18266: 212:     this.loadingState.set(true);
18267: 213:     this.errorState.set(null);
18268: 214: 
18269: 215:     try {
18270: 216:       await firstValueFrom(this.pullRequestRepository.delete(id));
18271: 217:       // 更新本地状态
18272: 218:       this.pullRequestsState.update(prs => prs.filter(pr => pr.id !== id));
18273: 219:       // 如果删除的是当前选中的 PR，清空选中状态
18274: 220:       if (this.selectedPullRequest()?.id === id) {
18275: 221:         this.selectedPullRequestState.set(null);
18276: 222:       }
18277: 223:     } catch (error) {
18278: 224:       this.errorState.set(error instanceof Error ? error.message : '删除 Pull Request 失败');
18279: 225:       throw error;
18280: 226:     } finally {
18281: 227:       this.loadingState.set(false);
18282: 228:     }
18283: 229:   }
18284: 230: 
18285: 231:   /**
18286: 232:    * 选择 Pull Request
18287: 233:    */
18288: 234:   selectPullRequest(pullRequest: PullRequest | null): void {
18289: 235:     this.selectedPullRequestState.set(pullRequest);
18290: 236:   }
18291: 237: 
18292: 238:   /**
18293: 239:    * 开始审核 PR（状态变为 reviewing）
18294: 240:    * 
18295: 241:    * @param prId PR ID
18296: 242:    * @param reviewedBy 审核者 ID
18297: 243:    */
18298: 244:   async startReview(prId: string, reviewedBy: string): Promise<PullRequest> {
18299: 245:     return await this.updatePullRequest(prId, {
18300: 246:       status: PRStatus.REVIEWING,
18301: 247:       reviewedBy
18302: 248:     } as any);
18303: 249:   }
18304: 250: 
18305: 251:   /**
18306: 252:    * 批准 PR（状态变为 approved）
18307: 253:    * 
18308: 254:    * @param prId PR ID
18309: 255:    * @param reviewedBy 审核者 ID
18310: 256:    */
18311: 257:   async approvePullRequest(prId: string, reviewedBy: string): Promise<PullRequest> {
18312: 258:     return await this.updatePullRequest(prId, {
18313: 259:       status: PRStatus.APPROVED,
18314: 260:       reviewedBy,
18315: 261:       reviewedAt: new Date().toISOString()
18316: 262:     } as any);
18317: 263:   }
18318: 264: 
18319: 265:   /**
18320: 266:    * 拒绝 PR（状态变为 rejected）
18321: 267:    * 
18322: 268:    * @param prId PR ID
18323: 269:    * @param reviewedBy 审核者 ID
18324: 270:    */
18325: 271:   async rejectPullRequest(prId: string, reviewedBy: string): Promise<PullRequest> {
18326: 272:     return await this.updatePullRequest(prId, {
18327: 273:       status: PRStatus.REJECTED,
18328: 274:       reviewedBy,
18329: 275:       reviewedAt: new Date().toISOString()
18330: 276:     } as any);
18331: 277:   }
18332: 278: 
18333: 279:   /**
18334: 280:    * 合并 PR（状态变为 merged，更新承揽字段）
18335: 281:    * 
18336: 282:    * 注意：实际的合并逻辑（更新任务承揽字段）应该在 Service 层或更高层实现
18337: 283:    * 这里只更新 PR 状态
18338: 284:    * 
18339: 285:    * @param prId PR ID
18340: 286:    * @param mergedBy 合并者 ID
18341: 287:    * @param changesSummary 变更摘要（用于记录合并的内容）
18342: 288:    */
18343: 289:   async mergePullRequest(
18344: 290:     prId: string,
18345: 291:     mergedBy: string,
18346: 292:     changesSummary?: any
18347: 293:   ): Promise<PullRequest> {
18348: 294:     return await this.updatePullRequest(prId, {
18349: 295:       status: PRStatus.MERGED,
18350: 296:       mergedBy,
18351: 297:       mergedAt: new Date().toISOString(),
18352: 298:       changesSummary: changesSummary || {}
18353: 299:     } as any);
18354: 300:   }
18355: 301: 
18356: 302:   /**
18357: 303:    * 关闭 PR（状态变为 closed）
18358: 304:    * 
18359: 305:    * @param prId PR ID
18360: 306:    */
18361: 307:   async closePullRequest(prId: string): Promise<PullRequest> {
18362: 308:     return await this.updatePullRequest(prId, {
18363: 309:       status: PRStatus.CLOSED
18364: 310:     } as any);
18365: 311:   }
18366: 312: 
18367: 313:   /**
18368: 314:    * 重置状态
18369: 315:    */
18370: 316:   reset(): void {
18371: 317:     this.pullRequestsState.set([]);
18372: 318:     this.selectedPullRequestState.set(null);
18373: 319:     this.errorState.set(null);
18374: 320:   }
18375: 321: }
18376: ````
18377: 
18378: ## File: src/app/shared/services/collaboration/collaboration.service.spec.ts
18379: ````typescript
18380:   1: import { TestBed } from '@angular/core/testing';
18381:   2: import { of, throwError } from 'rxjs';
18382:   3: import {
18383:   4:   OrganizationCollaborationRepository,
18384:   5:   CollaborationType,
18385:   6:   CollaborationStatus
18386:   7: } from '@core';
18387:   8: import { CollaborationService } from './collaboration.service';
18388:   9: import { OrganizationCollaboration } from '@shared';
18389:  10: 
18390:  11: describe('CollaborationService', () => {
18391:  12:   let service: CollaborationService;
18392:  13:   let repository: jasmine.SpyObj<OrganizationCollaborationRepository>;
18393:  14: 
18394:  15:   const mockCollaboration: OrganizationCollaboration = {
18395:  16:     id: 'collab-1',
18396:  17:     blueprint_id: 'blueprint-1',
18397:  18:     owner_org_id: 'org-1',
18398:  19:     collaborator_org_id: 'org-2',
18399:  20:     collaboration_type: CollaborationType.CONTRACTOR,
18400:  21:     status: CollaborationStatus.ACTIVE,
18401:  22:     contract_start_date: '2025-01-01',
18402:  23:     contract_end_date: '2025-12-31',
18403:  24:     notes: 'Test collaboration',
18404:  25:     created_at: '2025-01-01T00:00:00Z',
18405:  26:     updated_at: '2025-01-01T00:00:00Z'
18406:  27:   } as OrganizationCollaboration;
18407:  28: 
18408:  29:   const mockCollaborations: OrganizationCollaboration[] = [
18409:  30:     mockCollaboration,
18410:  31:     {
18411:  32:       ...mockCollaboration,
18412:  33:       id: 'collab-2',
18413:  34:       status: CollaborationStatus.PENDING,
18414:  35:       collaboration_type: CollaborationType.SUBCONTRACTOR
18415:  36:     }
18416:  37:   ];
18417:  38: 
18418:  39:   beforeEach(() => {
18419:  40:     const repositorySpy = jasmine.createSpyObj('OrganizationCollaborationRepository', [
18420:  41:       'findAll',
18421:  42:       'findById',
18422:  43:       'findByBlueprintId',
18423:  44:       'findByOwnerOrgId',
18424:  45:       'findByCollaboratorOrgId',
18425:  46:       'findByCollaborationType',
18426:  47:       'findByStatus',
18427:  48:       'create',
18428:  49:       'update',
18429:  50:       'delete'
18430:  51:     ]);
18431:  52: 
18432:  53:     TestBed.configureTestingModule({
18433:  54:       providers: [
18434:  55:         CollaborationService,
18435:  56:         { provide: OrganizationCollaborationRepository, useValue: repositorySpy }
18436:  57:       ]
18437:  58:     });
18438:  59: 
18439:  60:     service = TestBed.inject(CollaborationService);
18440:  61:     repository = TestBed.inject(
18441:  62:       OrganizationCollaborationRepository
18442:  63:     ) as jasmine.SpyObj<OrganizationCollaborationRepository>;
18443:  64:   });
18444:  65: 
18445:  66:   it('should be created', () => {
18446:  67:     expect(service).toBeTruthy();
18447:  68:   });
18448:  69: 
18449:  70:   describe('Initial state', () => {
18450:  71:     it('should have empty collaborations', () => {
18451:  72:       expect(service.collaborations().length).toBe(0);
18452:  73:     });
18453:  74: 
18454:  75:     it('should have null selected collaboration', () => {
18455:  76:       expect(service.selectedCollaboration()).toBeNull();
18456:  77:     });
18457:  78: 
18458:  79:     it('should have false loading state', () => {
18459:  80:       expect(service.loading()).toBe(false);
18460:  81:     });
18461:  82: 
18462:  83:     it('should have null error state', () => {
18463:  84:       expect(service.error()).toBeNull();
18464:  85:     });
18465:  86:   });
18466:  87: 
18467:  88:   describe('loadCollaborations', () => {
18468:  89:     it('should load collaborations successfully', async () => {
18469:  90:       repository.findAll.and.returnValue(of(mockCollaborations));
18470:  91: 
18471:  92:       await service.loadCollaborations();
18472:  93: 
18473:  94:       expect(service.collaborations().length).toBe(2);
18474:  95:       expect(service.collaborations()[0].id).toBe('collab-1');
18475:  96:       expect(service.loading()).toBe(false);
18476:  97:       expect(service.error()).toBeNull();
18477:  98:     });
18478:  99: 
18479: 100:     it('should set loading state during load', async () => {
18480: 101:       repository.findAll.and.returnValue(of(mockCollaborations));
18481: 102: 
18482: 103:       const loadPromise = service.loadCollaborations();
18483: 104:       expect(service.loading()).toBe(true);
18484: 105: 
18485: 106:       await loadPromise;
18486: 107:       expect(service.loading()).toBe(false);
18487: 108:     });
18488: 109: 
18489: 110:     it('should handle error when loading fails', async () => {
18490: 111:       const error = new Error('Load failed');
18491: 112:       repository.findAll.and.returnValue(throwError(() => error));
18492: 113: 
18493: 114:       try {
18494: 115:         await service.loadCollaborations();
18495: 116:         fail('should have thrown error');
18496: 117:       } catch (e) {
18497: 118:         expect(service.error()).toBe('Load failed');
18498: 119:         expect(service.loading()).toBe(false);
18499: 120:       }
18500: 121:     });
18501: 122:   });
18502: 123: 
18503: 124:   describe('loadCollaborationById', () => {
18504: 125:     it('should load collaboration by id successfully', async () => {
18505: 126:       repository.findById.and.returnValue(of(mockCollaboration));
18506: 127: 
18507: 128:       const result = await service.loadCollaborationById('collab-1');
18508: 129: 
18509: 130:       expect(result).toEqual(mockCollaboration);
18510: 131:       expect(service.selectedCollaboration()).toEqual(mockCollaboration);
18511: 132:       expect(service.loading()).toBe(false);
18512: 133:     });
18513: 134: 
18514: 135:     it('should return null when collaboration not found', async () => {
18515: 136:       repository.findById.and.returnValue(of(null));
18516: 137: 
18517: 138:       const result = await service.loadCollaborationById('non-existent');
18518: 139: 
18519: 140:       expect(result).toBeNull();
18520: 141:       expect(service.selectedCollaboration()).toBeNull();
18521: 142:     });
18522: 143: 
18523: 144:     it('should handle error when loading by id fails', async () => {
18524: 145:       const error = new Error('Not found');
18525: 146:       repository.findById.and.returnValue(throwError(() => error));
18526: 147: 
18527: 148:       try {
18528: 149:         await service.loadCollaborationById('collab-1');
18529: 150:         fail('should have thrown error');
18530: 151:       } catch (e) {
18531: 152:         expect(service.error()).toBe('Not found');
18532: 153:       }
18533: 154:     });
18534: 155:   });
18535: 156: 
18536: 157:   describe('loadCollaborationsByBlueprintId', () => {
18537: 158:     it('should load collaborations by blueprint id', async () => {
18538: 159:       repository.findByBlueprintId.and.returnValue(of(mockCollaborations));
18539: 160: 
18540: 161:       const result = await service.loadCollaborationsByBlueprintId('blueprint-1');
18541: 162: 
18542: 163:       expect(result.length).toBe(2);
18543: 164:       expect(repository.findByBlueprintId).toHaveBeenCalledWith('blueprint-1');
18544: 165:     });
18545: 166:   });
18546: 167: 
18547: 168:   describe('loadCollaborationsByOwnerOrgId', () => {
18548: 169:     it('should load collaborations by owner org id', async () => {
18549: 170:       repository.findByOwnerOrgId.and.returnValue(of(mockCollaborations));
18550: 171: 
18551: 172:       const result = await service.loadCollaborationsByOwnerOrgId('org-1');
18552: 173: 
18553: 174:       expect(result.length).toBe(2);
18554: 175:       expect(repository.findByOwnerOrgId).toHaveBeenCalledWith('org-1');
18555: 176:     });
18556: 177:   });
18557: 178: 
18558: 179:   describe('loadCollaborationsByCollaboratorOrgId', () => {
18559: 180:     it('should load collaborations by collaborator org id', async () => {
18560: 181:       repository.findByCollaboratorOrgId.and.returnValue(of(mockCollaborations));
18561: 182: 
18562: 183:       const result = await service.loadCollaborationsByCollaboratorOrgId('org-2');
18563: 184: 
18564: 185:       expect(result.length).toBe(2);
18565: 186:       expect(repository.findByCollaboratorOrgId).toHaveBeenCalledWith('org-2');
18566: 187:     });
18567: 188:   });
18568: 189: 
18569: 190:   describe('loadCollaborationsByType', () => {
18570: 191:     it('should load collaborations by type', async () => {
18571: 192:       repository.findByCollaborationType.and.returnValue(of([mockCollaboration]));
18572: 193: 
18573: 194:       const result = await service.loadCollaborationsByType(CollaborationType.CONTRACTOR);
18574: 195: 
18575: 196:       expect(result.length).toBe(1);
18576: 197:       expect(repository.findByCollaborationType).toHaveBeenCalledWith(CollaborationType.CONTRACTOR);
18577: 198:     });
18578: 199:   });
18579: 200: 
18580: 201:   describe('loadCollaborationsByStatus', () => {
18581: 202:     it('should load collaborations by status', async () => {
18582: 203:       repository.findByStatus.and.returnValue(of([mockCollaboration]));
18583: 204: 
18584: 205:       const result = await service.loadCollaborationsByStatus(CollaborationStatus.ACTIVE);
18585: 206: 
18586: 207:       expect(result.length).toBe(1);
18587: 208:       expect(repository.findByStatus).toHaveBeenCalledWith(CollaborationStatus.ACTIVE);
18588: 209:     });
18589: 210:   });
18590: 211: 
18591: 212:   describe('createCollaboration', () => {
18592: 213:     it('should create collaboration successfully', async () => {
18593: 214:       const newCollaboration = { ...mockCollaboration, id: 'collab-new' };
18594: 215:       repository.create.and.returnValue(of(newCollaboration));
18595: 216: 
18596: 217:       const result = await service.createCollaboration({
18597: 218:         blueprint_id: 'blueprint-1',
18598: 219:         owner_org_id: 'org-1',
18599: 220:         collaborator_org_id: 'org-2',
18600: 221:         collaboration_type: CollaborationType.CONTRACTOR
18601: 222:       });
18602: 223: 
18603: 224:       expect(result).toEqual(newCollaboration);
18604: 225:       expect(service.collaborations().length).toBe(1);
18605: 226:       expect(service.collaborations()[0].id).toBe('collab-new');
18606: 227:     });
18607: 228: 
18608: 229:     it('should handle error when creating fails', async () => {
18609: 230:       const error = new Error('Create failed');
18610: 231:       repository.create.and.returnValue(throwError(() => error));
18611: 232: 
18612: 233:       try {
18613: 234:         await service.createCollaboration({
18614: 235:           blueprint_id: 'blueprint-1',
18615: 236:           owner_org_id: 'org-1',
18616: 237:           collaborator_org_id: 'org-2',
18617: 238:           collaboration_type: CollaborationType.CONTRACTOR
18618: 239:         });
18619: 240:         fail('should have thrown error');
18620: 241:       } catch (e) {
18621: 242:         expect(service.error()).toBe('Create failed');
18622: 243:       }
18623: 244:     });
18624: 245:   });
18625: 246: 
18626: 247:   describe('updateCollaboration', () => {
18627: 248:     beforeEach(() => {
18628: 249:       service['collaborationsState'].set(mockCollaborations);
18629: 250:     });
18630: 251: 
18631: 252:     it('should update collaboration successfully', async () => {
18632: 253:       const updated = { ...mockCollaboration, notes: 'Updated notes' };
18633: 254:       repository.update.and.returnValue(of(updated));
18634: 255: 
18635: 256:       const result = await service.updateCollaboration('collab-1', { notes: 'Updated notes' });
18636: 257: 
18637: 258:       expect(result).toEqual(updated);
18638: 259:       expect(service.collaborations()[0].notes).toBe('Updated notes');
18639: 260:     });
18640: 261: 
18641: 262:     it('should update selected collaboration if it matches', async () => {
18642: 263:       service.selectCollaboration(mockCollaboration);
18643: 264:       const updated = { ...mockCollaboration, notes: 'Updated notes' };
18644: 265:       repository.update.and.returnValue(of(updated));
18645: 266: 
18646: 267:       await service.updateCollaboration('collab-1', { notes: 'Updated notes' });
18647: 268: 
18648: 269:       expect(service.selectedCollaboration()?.notes).toBe('Updated notes');
18649: 270:     });
18650: 271: 
18651: 272:     it('should handle error when updating fails', async () => {
18652: 273:       const error = new Error('Update failed');
18653: 274:       repository.update.and.returnValue(throwError(() => error));
18654: 275: 
18655: 276:       try {
18656: 277:         await service.updateCollaboration('collab-1', { notes: 'Updated' });
18657: 278:         fail('should have thrown error');
18658: 279:       } catch (e) {
18659: 280:         expect(service.error()).toBe('Update failed');
18660: 281:       }
18661: 282:     });
18662: 283:   });
18663: 284: 
18664: 285:   describe('deleteCollaboration', () => {
18665: 286:     beforeEach(() => {
18666: 287:       service['collaborationsState'].set(mockCollaborations);
18667: 288:     });
18668: 289: 
18669: 290:     it('should delete collaboration successfully', async () => {
18670: 291:       repository.delete.and.returnValue(of(undefined));
18671: 292: 
18672: 293:       await service.deleteCollaboration('collab-1');
18673: 294: 
18674: 295:       expect(service.collaborations().length).toBe(1);
18675: 296:       expect(service.collaborations()[0].id).toBe('collab-2');
18676: 297:     });
18677: 298: 
18678: 299:     it('should clear selected collaboration if deleted', async () => {
18679: 300:       service.selectCollaboration(mockCollaboration);
18680: 301:       repository.delete.and.returnValue(of(undefined));
18681: 302: 
18682: 303:       await service.deleteCollaboration('collab-1');
18683: 304: 
18684: 305:       expect(service.selectedCollaboration()).toBeNull();
18685: 306:     });
18686: 307: 
18687: 308:     it('should handle error when deleting fails', async () => {
18688: 309:       const error = new Error('Delete failed');
18689: 310:       repository.delete.and.returnValue(throwError(() => error));
18690: 311: 
18691: 312:       try {
18692: 313:         await service.deleteCollaboration('collab-1');
18693: 314:         fail('should have thrown error');
18694: 315:       } catch (e) {
18695: 316:         expect(service.error()).toBe('Delete failed');
18696: 317:       }
18697: 318:     });
18698: 319:   });
18699: 320: 
18700: 321:   describe('selectCollaboration', () => {
18701: 322:     it('should select collaboration', () => {
18702: 323:       service.selectCollaboration(mockCollaboration);
18703: 324: 
18704: 325:       expect(service.selectedCollaboration()).toEqual(mockCollaboration);
18705: 326:     });
18706: 327: 
18707: 328:     it('should clear selection when null', () => {
18708: 329:       service.selectCollaboration(mockCollaboration);
18709: 330:       service.selectCollaboration(null);
18710: 331: 
18711: 332:       expect(service.selectedCollaboration()).toBeNull();
18712: 333:     });
18713: 334:   });
18714: 335: 
18715: 336:   describe('reset', () => {
18716: 337:     it('should reset all state', () => {
18717: 338:       service['collaborationsState'].set(mockCollaborations);
18718: 339:       service.selectCollaboration(mockCollaboration);
18719: 340:       service['errorState'].set('Some error');
18720: 341: 
18721: 342:       service.reset();
18722: 343: 
18723: 344:       expect(service.collaborations().length).toBe(0);
18724: 345:       expect(service.selectedCollaboration()).toBeNull();
18725: 346:       expect(service.error()).toBeNull();
18726: 347:     });
18727: 348:   });
18728: 349: 
18729: 350:   describe('Computed signals', () => {
18730: 351:     beforeEach(() => {
18731: 352:       service['collaborationsState'].set(mockCollaborations);
18732: 353:     });
18733: 354: 
18734: 355:     it('should compute activeCollaborations', () => {
18735: 356:       expect(service.activeCollaborations().length).toBe(1);
18736: 357:       expect(service.activeCollaborations()[0].status).toBe(CollaborationStatus.ACTIVE);
18737: 358:     });
18738: 359: 
18739: 360:     it('should compute pendingCollaborations', () => {
18740: 361:       expect(service.pendingCollaborations().length).toBe(1);
18741: 362:       expect(service.pendingCollaborations()[0].status).toBe(CollaborationStatus.PENDING);
18742: 363:     });
18743: 364: 
18744: 365:     it('should compute contractorCollaborations', () => {
18745: 366:       expect(service.contractorCollaborations().length).toBe(1);
18746: 367:       expect(service.contractorCollaborations()[0].collaboration_type).toBe(
18747: 368:         CollaborationType.CONTRACTOR
18748: 369:       );
18749: 370:     });
18750: 371:   });
18751: 372: });
18752: ````
18753: 
18754: ## File: src/app/shared/services/collaboration/collaboration.service.ts
18755: ````typescript
18756:   1: import { Injectable, inject } from '@angular/core';
18757:   2: import { signal, computed } from '@angular/core';
18758:   3: import { Observable, firstValueFrom } from 'rxjs';
18759:   4: import {
18760:   5:   OrganizationCollaborationRepository,
18761:   6:   OrganizationCollaborationInsert,
18762:   7:   OrganizationCollaborationUpdate,
18763:   8:   CollaborationType,
18764:   9:   CollaborationStatus
18765:  10: } from '@core';
18766:  11: import { OrganizationCollaboration } from '@shared';
18767:  12: 
18768:  13: /**
18769:  14:  * Collaboration Service
18770:  15:  * 
18771:  16:  * 提供组织协作关系相关的业务逻辑和状态管理
18772:  17:  * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
18773:  18:  * 
18774:  19:  * @example
18775:  20:  * ```typescript
18776:  21:  * const collaborationService = inject(CollaborationService);
18777:  22:  * 
18778:  23:  * // 订阅协作关系列表
18779:  24:  * effect(() => {
18780:  25:  *   console.log('Collaborations:', collaborationService.collaborations());
18781:  26:  * });
18782:  27:  * 
18783:  28:  * // 加载协作关系列表
18784:  29:  * await collaborationService.loadCollaborations();
18785:  30:  * ```
18786:  31:  */
18787:  32: @Injectable({
18788:  33:   providedIn: 'root'
18789:  34: })
18790:  35: export class CollaborationService {
18791:  36:   private collaborationRepository = inject(OrganizationCollaborationRepository);
18792:  37: 
18793:  38:   // 使用 Signals 管理状态
18794:  39:   private collaborationsState = signal<OrganizationCollaboration[]>([]);
18795:  40:   private selectedCollaborationState = signal<OrganizationCollaboration | null>(null);
18796:  41:   private loadingState = signal<boolean>(false);
18797:  42:   private errorState = signal<string | null>(null);
18798:  43: 
18799:  44:   // 暴露 ReadonlySignal 给组件
18800:  45:   readonly collaborations = this.collaborationsState.asReadonly();
18801:  46:   readonly selectedCollaboration = this.selectedCollaborationState.asReadonly();
18802:  47:   readonly loading = this.loadingState.asReadonly();
18803:  48:   readonly error = this.errorState.asReadonly();
18804:  49: 
18805:  50:   // Computed signals
18806:  51:   readonly activeCollaborations = computed(() =>
18807:  52:     this.collaborations().filter(c => c.status === CollaborationStatus.ACTIVE)
18808:  53:   );
18809:  54: 
18810:  55:   readonly pendingCollaborations = computed(() =>
18811:  56:     this.collaborations().filter(c => c.status === CollaborationStatus.PENDING)
18812:  57:   );
18813:  58: 
18814:  59:   readonly contractorCollaborations = computed(() =>
18815:  60:     this.collaborations().filter(c => c.collaboration_type === CollaborationType.CONTRACTOR)
18816:  61:   );
18817:  62: 
18818:  63:   /**
18819:  64:    * 加载所有协作关系
18820:  65:    */
18821:  66:   async loadCollaborations(): Promise<void> {
18822:  67:     this.loadingState.set(true);
18823:  68:     this.errorState.set(null);
18824:  69: 
18825:  70:     try {
18826:  71:       const collaborations = await firstValueFrom(this.collaborationRepository.findAll());
18827:  72:       this.collaborationsState.set(collaborations);
18828:  73:     } catch (error) {
18829:  74:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
18830:  75:       throw error;
18831:  76:     } finally {
18832:  77:       this.loadingState.set(false);
18833:  78:     }
18834:  79:   }
18835:  80: 
18836:  81:   /**
18837:  82:    * 根据 ID 加载协作关系
18838:  83:    */
18839:  84:   async loadCollaborationById(id: string): Promise<OrganizationCollaboration | null> {
18840:  85:     this.loadingState.set(true);
18841:  86:     this.errorState.set(null);
18842:  87: 
18843:  88:     try {
18844:  89:       const collaboration = await firstValueFrom(this.collaborationRepository.findById(id));
18845:  90:       if (collaboration) {
18846:  91:         this.selectedCollaborationState.set(collaboration);
18847:  92:       }
18848:  93:       return collaboration;
18849:  94:     } catch (error) {
18850:  95:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系失败');
18851:  96:       throw error;
18852:  97:     } finally {
18853:  98:       this.loadingState.set(false);
18854:  99:     }
18855: 100:   }
18856: 101: 
18857: 102:   /**
18858: 103:    * 根据蓝图 ID 加载协作关系
18859: 104:    */
18860: 105:   async loadCollaborationsByBlueprintId(blueprintId: string): Promise<OrganizationCollaboration[]> {
18861: 106:     this.loadingState.set(true);
18862: 107:     this.errorState.set(null);
18863: 108: 
18864: 109:     try {
18865: 110:       const collaborations = await firstValueFrom(
18866: 111:         this.collaborationRepository.findByBlueprintId(blueprintId)
18867: 112:       );
18868: 113:       return collaborations;
18869: 114:     } catch (error) {
18870: 115:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
18871: 116:       throw error;
18872: 117:     } finally {
18873: 118:       this.loadingState.set(false);
18874: 119:     }
18875: 120:   }
18876: 121: 
18877: 122:   /**
18878: 123:    * 根据拥有者组织 ID 加载协作关系
18879: 124:    */
18880: 125:   async loadCollaborationsByOwnerOrgId(ownerOrgId: string): Promise<OrganizationCollaboration[]> {
18881: 126:     this.loadingState.set(true);
18882: 127:     this.errorState.set(null);
18883: 128: 
18884: 129:     try {
18885: 130:       const collaborations = await firstValueFrom(
18886: 131:         this.collaborationRepository.findByOwnerOrgId(ownerOrgId)
18887: 132:       );
18888: 133:       return collaborations;
18889: 134:     } catch (error) {
18890: 135:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
18891: 136:       throw error;
18892: 137:     } finally {
18893: 138:       this.loadingState.set(false);
18894: 139:     }
18895: 140:   }
18896: 141: 
18897: 142:   /**
18898: 143:    * 根据协作组织 ID 加载协作关系
18899: 144:    */
18900: 145:   async loadCollaborationsByCollaboratorOrgId(
18901: 146:     collaboratorOrgId: string
18902: 147:   ): Promise<OrganizationCollaboration[]> {
18903: 148:     this.loadingState.set(true);
18904: 149:     this.errorState.set(null);
18905: 150: 
18906: 151:     try {
18907: 152:       const collaborations = await firstValueFrom(
18908: 153:         this.collaborationRepository.findByCollaboratorOrgId(collaboratorOrgId)
18909: 154:       );
18910: 155:       return collaborations;
18911: 156:     } catch (error) {
18912: 157:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
18913: 158:       throw error;
18914: 159:     } finally {
18915: 160:       this.loadingState.set(false);
18916: 161:     }
18917: 162:   }
18918: 163: 
18919: 164:   /**
18920: 165:    * 根据协作类型加载协作关系
18921: 166:    */
18922: 167:   async loadCollaborationsByType(
18923: 168:     collaborationType: CollaborationType
18924: 169:   ): Promise<OrganizationCollaboration[]> {
18925: 170:     this.loadingState.set(true);
18926: 171:     this.errorState.set(null);
18927: 172: 
18928: 173:     try {
18929: 174:       const collaborations = await firstValueFrom(
18930: 175:         this.collaborationRepository.findByCollaborationType(collaborationType)
18931: 176:       );
18932: 177:       return collaborations;
18933: 178:     } catch (error) {
18934: 179:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
18935: 180:       throw error;
18936: 181:     } finally {
18937: 182:       this.loadingState.set(false);
18938: 183:     }
18939: 184:   }
18940: 185: 
18941: 186:   /**
18942: 187:    * 根据状态加载协作关系
18943: 188:    */
18944: 189:   async loadCollaborationsByStatus(
18945: 190:     status: CollaborationStatus
18946: 191:   ): Promise<OrganizationCollaboration[]> {
18947: 192:     this.loadingState.set(true);
18948: 193:     this.errorState.set(null);
18949: 194: 
18950: 195:     try {
18951: 196:       const collaborations = await firstValueFrom(
18952: 197:         this.collaborationRepository.findByStatus(status)
18953: 198:       );
18954: 199:       return collaborations;
18955: 200:     } catch (error) {
18956: 201:       this.errorState.set(error instanceof Error ? error.message : '加载协作关系列表失败');
18957: 202:       throw error;
18958: 203:     } finally {
18959: 204:       this.loadingState.set(false);
18960: 205:     }
18961: 206:   }
18962: 207: 
18963: 208:   /**
18964: 209:    * 创建协作关系
18965: 210:    */
18966: 211:   async createCollaboration(
18967: 212:     data: OrganizationCollaborationInsert
18968: 213:   ): Promise<OrganizationCollaboration> {
18969: 214:     this.loadingState.set(true);
18970: 215:     this.errorState.set(null);
18971: 216: 
18972: 217:     try {
18973: 218:       const collaboration = await firstValueFrom(this.collaborationRepository.create(data));
18974: 219:       // 更新本地状态
18975: 220:       this.collaborationsState.update(collaborations => [...collaborations, collaboration]);
18976: 221:       return collaboration;
18977: 222:     } catch (error) {
18978: 223:       this.errorState.set(error instanceof Error ? error.message : '创建协作关系失败');
18979: 224:       throw error;
18980: 225:     } finally {
18981: 226:       this.loadingState.set(false);
18982: 227:     }
18983: 228:   }
18984: 229: 
18985: 230:   /**
18986: 231:    * 更新协作关系
18987: 232:    */
18988: 233:   async updateCollaboration(
18989: 234:     id: string,
18990: 235:     data: OrganizationCollaborationUpdate
18991: 236:   ): Promise<OrganizationCollaboration> {
18992: 237:     this.loadingState.set(true);
18993: 238:     this.errorState.set(null);
18994: 239: 
18995: 240:     try {
18996: 241:       const collaboration = await firstValueFrom(this.collaborationRepository.update(id, data));
18997: 242:       // 更新本地状态
18998: 243:       this.collaborationsState.update(collaborations =>
18999: 244:         collaborations.map(c => (c.id === id ? collaboration : c))
19000: 245:       );
19001: 246:       // 如果更新的是当前选中的协作关系，也更新选中状态
19002: 247:       if (this.selectedCollaboration()?.id === id) {
19003: 248:         this.selectedCollaborationState.set(collaboration);
19004: 249:       }
19005: 250:       return collaboration;
19006: 251:     } catch (error) {
19007: 252:       this.errorState.set(error instanceof Error ? error.message : '更新协作关系失败');
19008: 253:       throw error;
19009: 254:     } finally {
19010: 255:       this.loadingState.set(false);
19011: 256:     }
19012: 257:   }
19013: 258: 
19014: 259:   /**
19015: 260:    * 删除协作关系
19016: 261:    */
19017: 262:   async deleteCollaboration(id: string): Promise<void> {
19018: 263:     this.loadingState.set(true);
19019: 264:     this.errorState.set(null);
19020: 265: 
19021: 266:     try {
19022: 267:       await firstValueFrom(this.collaborationRepository.delete(id));
19023: 268:       // 更新本地状态
19024: 269:       this.collaborationsState.update(collaborations => collaborations.filter(c => c.id !== id));
19025: 270:       // 如果删除的是当前选中的协作关系，清空选中状态
19026: 271:       if (this.selectedCollaboration()?.id === id) {
19027: 272:         this.selectedCollaborationState.set(null);
19028: 273:       }
19029: 274:     } catch (error) {
19030: 275:       this.errorState.set(error instanceof Error ? error.message : '删除协作关系失败');
19031: 276:       throw error;
19032: 277:     } finally {
19033: 278:       this.loadingState.set(false);
19034: 279:     }
19035: 280:   }
19036: 281: 
19037: 282:   /**
19038: 283:    * 选择协作关系
19039: 284:    */
19040: 285:   selectCollaboration(collaboration: OrganizationCollaboration | null): void {
19041: 286:     this.selectedCollaborationState.set(collaboration);
19042: 287:   }
19043: 288: 
19044: 289:   /**
19045: 290:    * 重置状态
19046: 291:    */
19047: 292:   reset(): void {
19048: 293:     this.collaborationsState.set([]);
19049: 294:     this.selectedCollaborationState.set(null);
19050: 295:     this.errorState.set(null);
19051: 296:   }
19052: 297: }
19053: ````
19054: 
19055: ## File: src/app/shared/services/collaboration/index.ts
19056: ````typescript
19057: 1: /**
19058: 2:  * Collaboration Services
19059: 3:  * 
19060: 4:  * 组织协作系统相关的服务
19061: 5:  */
19062: 6: export * from './collaboration.service';
19063: 7: export * from './invitation.service';
19064: ````
19065: 
19066: ## File: src/app/shared/services/collaboration/invitation.service.spec.ts
19067: ````typescript
19068:   1: import { TestBed } from '@angular/core/testing';
19069:   2: import { of, throwError } from 'rxjs';
19070:   3: import { CollaborationInvitationRepository, InvitationStatus } from '@core';
19071:   4: import { InvitationService } from './invitation.service';
19072:   5: import { CollaborationInvitation } from '@shared';
19073:   6: 
19074:   7: describe('InvitationService', () => {
19075:   8:   let service: InvitationService;
19076:   9:   let repository: jasmine.SpyObj<CollaborationInvitationRepository>;
19077:  10: 
19078:  11:   const mockInvitation: CollaborationInvitation = {
19079:  12:     id: 'inv-1',
19080:  13:     blueprint_id: 'blueprint-1',
19081:  14:     from_org_id: 'org-1',
19082:  15:     to_org_id: 'org-2',
19083:  16:     invitation_message: 'Test invitation',
19084:  17:     status: InvitationStatus.PENDING,
19085:  18:     expires_at: '2025-12-31T23:59:59Z',
19086:  19:     responded_at: null,
19087:  20:     created_at: '2025-01-01T00:00:00Z'
19088:  21:   } as CollaborationInvitation;
19089:  22: 
19090:  23:   const mockInvitations: CollaborationInvitation[] = [
19091:  24:     mockInvitation,
19092:  25:     {
19093:  26:       ...mockInvitation,
19094:  27:       id: 'inv-2',
19095:  28:       status: InvitationStatus.ACCEPTED,
19096:  29:       responded_at: '2025-01-02T00:00:00Z'
19097:  30:     },
19098:  31:     {
19099:  32:       ...mockInvitation,
19100:  33:       id: 'inv-3',
19101:  34:       status: InvitationStatus.EXPIRED,
19102:  35:       expires_at: '2024-01-01T00:00:00Z'
19103:  36:     }
19104:  37:   ];
19105:  38: 
19106:  39:   beforeEach(() => {
19107:  40:     const repositorySpy = jasmine.createSpyObj('CollaborationInvitationRepository', [
19108:  41:       'findAll',
19109:  42:       'findById',
19110:  43:       'findByBlueprintId',
19111:  44:       'findByFromOrgId',
19112:  45:       'findByToOrgId',
19113:  46:       'findByStatus',
19114:  47:       'findPending',
19115:  48:       'findExpired',
19116:  49:       'create',
19117:  50:       'update',
19118:  51:       'delete'
19119:  52:     ]);
19120:  53: 
19121:  54:     TestBed.configureTestingModule({
19122:  55:       providers: [
19123:  56:         InvitationService,
19124:  57:         { provide: CollaborationInvitationRepository, useValue: repositorySpy }
19125:  58:       ]
19126:  59:     });
19127:  60: 
19128:  61:     service = TestBed.inject(InvitationService);
19129:  62:     repository = TestBed.inject(
19130:  63:       CollaborationInvitationRepository
19131:  64:     ) as jasmine.SpyObj<CollaborationInvitationRepository>;
19132:  65:   });
19133:  66: 
19134:  67:   it('should be created', () => {
19135:  68:     expect(service).toBeTruthy();
19136:  69:   });
19137:  70: 
19138:  71:   describe('Initial state', () => {
19139:  72:     it('should have empty invitations', () => {
19140:  73:       expect(service.invitations().length).toBe(0);
19141:  74:     });
19142:  75: 
19143:  76:     it('should have null selected invitation', () => {
19144:  77:       expect(service.selectedInvitation()).toBeNull();
19145:  78:     });
19146:  79: 
19147:  80:     it('should have false loading state', () => {
19148:  81:       expect(service.loading()).toBe(false);
19149:  82:     });
19150:  83: 
19151:  84:     it('should have null error state', () => {
19152:  85:       expect(service.error()).toBeNull();
19153:  86:     });
19154:  87:   });
19155:  88: 
19156:  89:   describe('loadInvitations', () => {
19157:  90:     it('should load invitations successfully', async () => {
19158:  91:       repository.findAll.and.returnValue(of(mockInvitations));
19159:  92: 
19160:  93:       await service.loadInvitations();
19161:  94: 
19162:  95:       expect(service.invitations().length).toBe(3);
19163:  96:       expect(service.invitations()[0].id).toBe('inv-1');
19164:  97:       expect(service.loading()).toBe(false);
19165:  98:       expect(service.error()).toBeNull();
19166:  99:     });
19167: 100: 
19168: 101:     it('should handle error when loading fails', async () => {
19169: 102:       const error = new Error('Load failed');
19170: 103:       repository.findAll.and.returnValue(throwError(() => error));
19171: 104: 
19172: 105:       try {
19173: 106:         await service.loadInvitations();
19174: 107:         fail('should have thrown error');
19175: 108:       } catch (e) {
19176: 109:         expect(service.error()).toBe('Load failed');
19177: 110:         expect(service.loading()).toBe(false);
19178: 111:       }
19179: 112:     });
19180: 113:   });
19181: 114: 
19182: 115:   describe('loadInvitationById', () => {
19183: 116:     it('should load invitation by id successfully', async () => {
19184: 117:       repository.findById.and.returnValue(of(mockInvitation));
19185: 118: 
19186: 119:       const result = await service.loadInvitationById('inv-1');
19187: 120: 
19188: 121:       expect(result).toEqual(mockInvitation);
19189: 122:       expect(service.selectedInvitation()).toEqual(mockInvitation);
19190: 123:     });
19191: 124: 
19192: 125:     it('should return null when invitation not found', async () => {
19193: 126:       repository.findById.and.returnValue(of(null));
19194: 127: 
19195: 128:       const result = await service.loadInvitationById('non-existent');
19196: 129: 
19197: 130:       expect(result).toBeNull();
19198: 131:     });
19199: 132:   });
19200: 133: 
19201: 134:   describe('loadInvitationsByBlueprintId', () => {
19202: 135:     it('should load invitations by blueprint id', async () => {
19203: 136:       repository.findByBlueprintId.and.returnValue(of(mockInvitations));
19204: 137: 
19205: 138:       const result = await service.loadInvitationsByBlueprintId('blueprint-1');
19206: 139: 
19207: 140:       expect(result.length).toBe(3);
19208: 141:       expect(repository.findByBlueprintId).toHaveBeenCalledWith('blueprint-1');
19209: 142:     });
19210: 143:   });
19211: 144: 
19212: 145:   describe('loadInvitationsByFromOrgId', () => {
19213: 146:     it('should load invitations by from org id', async () => {
19214: 147:       repository.findByFromOrgId.and.returnValue(of(mockInvitations));
19215: 148: 
19216: 149:       const result = await service.loadInvitationsByFromOrgId('org-1');
19217: 150: 
19218: 151:       expect(result.length).toBe(3);
19219: 152:       expect(repository.findByFromOrgId).toHaveBeenCalledWith('org-1');
19220: 153:     });
19221: 154:   });
19222: 155: 
19223: 156:   describe('loadInvitationsByToOrgId', () => {
19224: 157:     it('should load invitations by to org id', async () => {
19225: 158:       repository.findByToOrgId.and.returnValue(of(mockInvitations));
19226: 159: 
19227: 160:       const result = await service.loadInvitationsByToOrgId('org-2');
19228: 161: 
19229: 162:       expect(result.length).toBe(3);
19230: 163:       expect(repository.findByToOrgId).toHaveBeenCalledWith('org-2');
19231: 164:     });
19232: 165:   });
19233: 166: 
19234: 167:   describe('loadInvitationsByStatus', () => {
19235: 168:     it('should load invitations by status', async () => {
19236: 169:       repository.findByStatus.and.returnValue(of([mockInvitation]));
19237: 170: 
19238: 171:       const result = await service.loadInvitationsByStatus(InvitationStatus.PENDING);
19239: 172: 
19240: 173:       expect(result.length).toBe(1);
19241: 174:       expect(repository.findByStatus).toHaveBeenCalledWith(InvitationStatus.PENDING);
19242: 175:     });
19243: 176:   });
19244: 177: 
19245: 178:   describe('loadPendingInvitations', () => {
19246: 179:     it('should load pending invitations', async () => {
19247: 180:       repository.findPending.and.returnValue(of([mockInvitation]));
19248: 181: 
19249: 182:       const result = await service.loadPendingInvitations();
19250: 183: 
19251: 184:       expect(result.length).toBe(1);
19252: 185:       expect(repository.findPending).toHaveBeenCalled();
19253: 186:     });
19254: 187:   });
19255: 188: 
19256: 189:   describe('loadExpiredInvitations', () => {
19257: 190:     it('should load expired invitations', async () => {
19258: 191:       repository.findExpired.and.returnValue(of([mockInvitations[2]]));
19259: 192: 
19260: 193:       const result = await service.loadExpiredInvitations();
19261: 194: 
19262: 195:       expect(result.length).toBe(1);
19263: 196:       expect(repository.findExpired).toHaveBeenCalled();
19264: 197:     });
19265: 198:   });
19266: 199: 
19267: 200:   describe('createInvitation', () => {
19268: 201:     it('should create invitation successfully', async () => {
19269: 202:       const newInvitation = { ...mockInvitation, id: 'inv-new' };
19270: 203:       repository.create.and.returnValue(of(newInvitation));
19271: 204: 
19272: 205:       const result = await service.createInvitation({
19273: 206:         blueprint_id: 'blueprint-1',
19274: 207:         from_org_id: 'org-1',
19275: 208:         to_org_id: 'org-2',
19276: 209:         expires_at: '2025-12-31T23:59:59Z'
19277: 210:       });
19278: 211: 
19279: 212:       expect(result).toEqual(newInvitation);
19280: 213:       expect(service.invitations().length).toBe(1);
19281: 214:     });
19282: 215:   });
19283: 216: 
19284: 217:   describe('updateInvitation', () => {
19285: 218:     beforeEach(() => {
19286: 219:       service['invitationsState'].set(mockInvitations);
19287: 220:     });
19288: 221: 
19289: 222:     it('should update invitation successfully', async () => {
19290: 223:       const updated = { ...mockInvitation, invitation_message: 'Updated message' };
19291: 224:       repository.update.and.returnValue(of(updated));
19292: 225: 
19293: 226:       const result = await service.updateInvitation('inv-1', {
19294: 227:         invitation_message: 'Updated message'
19295: 228:       });
19296: 229: 
19297: 230:       expect(result).toEqual(updated);
19298: 231:       expect(service.invitations()[0].invitation_message).toBe('Updated message');
19299: 232:     });
19300: 233:   });
19301: 234: 
19302: 235:   describe('acceptInvitation', () => {
19303: 236:     beforeEach(() => {
19304: 237:       service['invitationsState'].set([mockInvitation]);
19305: 238:     });
19306: 239: 
19307: 240:     it('should accept invitation successfully', async () => {
19308: 241:       const accepted = {
19309: 242:         ...mockInvitation,
19310: 243:         status: InvitationStatus.ACCEPTED,
19311: 244:         responded_at: new Date().toISOString()
19312: 245:       };
19313: 246:       repository.update.and.returnValue(of(accepted));
19314: 247: 
19315: 248:       const result = await service.acceptInvitation('inv-1');
19316: 249: 
19317: 250:       expect(result.status).toBe(InvitationStatus.ACCEPTED);
19318: 251:       expect(result.responded_at).toBeTruthy();
19319: 252:       expect(repository.update).toHaveBeenCalledWith('inv-1', jasmine.any(Object));
19320: 253:     });
19321: 254:   });
19322: 255: 
19323: 256:   describe('rejectInvitation', () => {
19324: 257:     beforeEach(() => {
19325: 258:       service['invitationsState'].set([mockInvitation]);
19326: 259:     });
19327: 260: 
19328: 261:     it('should reject invitation successfully', async () => {
19329: 262:       const rejected = {
19330: 263:         ...mockInvitation,
19331: 264:         status: InvitationStatus.REJECTED,
19332: 265:         responded_at: new Date().toISOString()
19333: 266:       };
19334: 267:       repository.update.and.returnValue(of(rejected));
19335: 268: 
19336: 269:       const result = await service.rejectInvitation('inv-1');
19337: 270: 
19338: 271:       expect(result.status).toBe(InvitationStatus.REJECTED);
19339: 272:       expect(result.responded_at).toBeTruthy();
19340: 273:       expect(repository.update).toHaveBeenCalledWith('inv-1', jasmine.any(Object));
19341: 274:     });
19342: 275:   });
19343: 276: 
19344: 277:   describe('deleteInvitation', () => {
19345: 278:     beforeEach(() => {
19346: 279:       service['invitationsState'].set(mockInvitations);
19347: 280:     });
19348: 281: 
19349: 282:     it('should delete invitation successfully', async () => {
19350: 283:       repository.delete.and.returnValue(of(undefined));
19351: 284: 
19352: 285:       await service.deleteInvitation('inv-1');
19353: 286: 
19354: 287:       expect(service.invitations().length).toBe(2);
19355: 288:       expect(service.invitations()[0].id).toBe('inv-2');
19356: 289:     });
19357: 290: 
19358: 291:     it('should clear selected invitation if deleted', async () => {
19359: 292:       service.selectInvitation(mockInvitation);
19360: 293:       repository.delete.and.returnValue(of(undefined));
19361: 294: 
19362: 295:       await service.deleteInvitation('inv-1');
19363: 296: 
19364: 297:       expect(service.selectedInvitation()).toBeNull();
19365: 298:     });
19366: 299:   });
19367: 300: 
19368: 301:   describe('selectInvitation', () => {
19369: 302:     it('should select invitation', () => {
19370: 303:       service.selectInvitation(mockInvitation);
19371: 304: 
19372: 305:       expect(service.selectedInvitation()).toEqual(mockInvitation);
19373: 306:     });
19374: 307:   });
19375: 308: 
19376: 309:   describe('reset', () => {
19377: 310:     it('should reset all state', () => {
19378: 311:       service['invitationsState'].set(mockInvitations);
19379: 312:       service.selectInvitation(mockInvitation);
19380: 313:       service['errorState'].set('Some error');
19381: 314: 
19382: 315:       service.reset();
19383: 316: 
19384: 317:       expect(service.invitations().length).toBe(0);
19385: 318:       expect(service.selectedInvitation()).toBeNull();
19386: 319:       expect(service.error()).toBeNull();
19387: 320:     });
19388: 321:   });
19389: 322: 
19390: 323:   describe('Computed signals', () => {
19391: 324:     beforeEach(() => {
19392: 325:       service['invitationsState'].set(mockInvitations);
19393: 326:     });
19394: 327: 
19395: 328:     it('should compute pendingInvitations', () => {
19396: 329:       expect(service.pendingInvitations().length).toBe(1);
19397: 330:       expect(service.pendingInvitations()[0].status).toBe(InvitationStatus.PENDING);
19398: 331:     });
19399: 332: 
19400: 333:     it('should compute acceptedInvitations', () => {
19401: 334:       expect(service.acceptedInvitations().length).toBe(1);
19402: 335:       expect(service.acceptedInvitations()[0].status).toBe(InvitationStatus.ACCEPTED);
19403: 336:     });
19404: 337: 
19405: 338:     it('should compute expiredInvitations', () => {
19406: 339:       expect(service.expiredInvitations().length).toBe(1);
19407: 340:       expect(service.expiredInvitations()[0].id).toBe('inv-3');
19408: 341:     });
19409: 342:   });
19410: 343: });
19411: ````
19412: 
19413: ## File: src/app/shared/services/collaboration/invitation.service.ts
19414: ````typescript
19415:   1: import { Injectable, inject } from '@angular/core';
19416:   2: import { signal, computed } from '@angular/core';
19417:   3: import { Observable, firstValueFrom } from 'rxjs';
19418:   4: import {
19419:   5:   CollaborationInvitationRepository,
19420:   6:   CollaborationInvitationInsert,
19421:   7:   CollaborationInvitationUpdate,
19422:   8:   InvitationStatus
19423:   9: } from '@core';
19424:  10: import { CollaborationInvitation } from '@shared';
19425:  11: 
19426:  12: /**
19427:  13:  * Invitation Service
19428:  14:  * 
19429:  15:  * 提供协作邀请相关的业务逻辑和状态管理
19430:  16:  * 使用 Signals 管理状态，暴露 ReadonlySignal 给组件
19431:  17:  * 
19432:  18:  * @example
19433:  19:  * ```typescript
19434:  20:  * const invitationService = inject(InvitationService);
19435:  21:  * 
19436:  22:  * // 订阅邀请列表
19437:  23:  * effect(() => {
19438:  24:  *   console.log('Invitations:', invitationService.invitations());
19439:  25:  * });
19440:  26:  * 
19441:  27:  * // 加载邀请列表
19442:  28:  * await invitationService.loadInvitations();
19443:  29:  * ```
19444:  30:  */
19445:  31: @Injectable({
19446:  32:   providedIn: 'root'
19447:  33: })
19448:  34: export class InvitationService {
19449:  35:   private invitationRepository = inject(CollaborationInvitationRepository);
19450:  36: 
19451:  37:   // 使用 Signals 管理状态
19452:  38:   private invitationsState = signal<CollaborationInvitation[]>([]);
19453:  39:   private selectedInvitationState = signal<CollaborationInvitation | null>(null);
19454:  40:   private loadingState = signal<boolean>(false);
19455:  41:   private errorState = signal<string | null>(null);
19456:  42: 
19457:  43:   // 暴露 ReadonlySignal 给组件
19458:  44:   readonly invitations = this.invitationsState.asReadonly();
19459:  45:   readonly selectedInvitation = this.selectedInvitationState.asReadonly();
19460:  46:   readonly loading = this.loadingState.asReadonly();
19461:  47:   readonly error = this.errorState.asReadonly();
19462:  48: 
19463:  49:   // Computed signals
19464:  50:   readonly pendingInvitations = computed(() =>
19465:  51:     this.invitations().filter(i => i.status === InvitationStatus.PENDING)
19466:  52:   );
19467:  53: 
19468:  54:   readonly acceptedInvitations = computed(() =>
19469:  55:     this.invitations().filter(i => i.status === InvitationStatus.ACCEPTED)
19470:  56:   );
19471:  57: 
19472:  58:   readonly expiredInvitations = computed(() =>
19473:  59:     this.invitations().filter(i => {
19474:  60:       if (!i.expires_at) return false;
19475:  61:       return new Date(i.expires_at) < new Date();
19476:  62:     })
19477:  63:   );
19478:  64: 
19479:  65:   /**
19480:  66:    * 加载所有邀请
19481:  67:    */
19482:  68:   async loadInvitations(): Promise<void> {
19483:  69:     this.loadingState.set(true);
19484:  70:     this.errorState.set(null);
19485:  71: 
19486:  72:     try {
19487:  73:       const invitations = await firstValueFrom(this.invitationRepository.findAll());
19488:  74:       this.invitationsState.set(invitations);
19489:  75:     } catch (error) {
19490:  76:       this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
19491:  77:       throw error;
19492:  78:     } finally {
19493:  79:       this.loadingState.set(false);
19494:  80:     }
19495:  81:   }
19496:  82: 
19497:  83:   /**
19498:  84:    * 根据 ID 加载邀请
19499:  85:    */
19500:  86:   async loadInvitationById(id: string): Promise<CollaborationInvitation | null> {
19501:  87:     this.loadingState.set(true);
19502:  88:     this.errorState.set(null);
19503:  89: 
19504:  90:     try {
19505:  91:       const invitation = await firstValueFrom(this.invitationRepository.findById(id));
19506:  92:       if (invitation) {
19507:  93:         this.selectedInvitationState.set(invitation);
19508:  94:       }
19509:  95:       return invitation;
19510:  96:     } catch (error) {
19511:  97:       this.errorState.set(error instanceof Error ? error.message : '加载邀请失败');
19512:  98:       throw error;
19513:  99:     } finally {
19514: 100:       this.loadingState.set(false);
19515: 101:     }
19516: 102:   }
19517: 103: 
19518: 104:   /**
19519: 105:    * 根据蓝图 ID 加载邀请
19520: 106:    */
19521: 107:   async loadInvitationsByBlueprintId(blueprintId: string): Promise<CollaborationInvitation[]> {
19522: 108:     this.loadingState.set(true);
19523: 109:     this.errorState.set(null);
19524: 110: 
19525: 111:     try {
19526: 112:       const invitations = await firstValueFrom(
19527: 113:         this.invitationRepository.findByBlueprintId(blueprintId)
19528: 114:       );
19529: 115:       return invitations;
19530: 116:     } catch (error) {
19531: 117:       this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
19532: 118:       throw error;
19533: 119:     } finally {
19534: 120:       this.loadingState.set(false);
19535: 121:     }
19536: 122:   }
19537: 123: 
19538: 124:   /**
19539: 125:    * 根据发送组织 ID 加载邀请
19540: 126:    */
19541: 127:   async loadInvitationsByFromOrgId(fromOrgId: string): Promise<CollaborationInvitation[]> {
19542: 128:     this.loadingState.set(true);
19543: 129:     this.errorState.set(null);
19544: 130: 
19545: 131:     try {
19546: 132:       const invitations = await firstValueFrom(
19547: 133:         this.invitationRepository.findByFromOrgId(fromOrgId)
19548: 134:       );
19549: 135:       return invitations;
19550: 136:     } catch (error) {
19551: 137:       this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
19552: 138:       throw error;
19553: 139:     } finally {
19554: 140:       this.loadingState.set(false);
19555: 141:     }
19556: 142:   }
19557: 143: 
19558: 144:   /**
19559: 145:    * 根据接收组织 ID 加载邀请
19560: 146:    */
19561: 147:   async loadInvitationsByToOrgId(toOrgId: string): Promise<CollaborationInvitation[]> {
19562: 148:     this.loadingState.set(true);
19563: 149:     this.errorState.set(null);
19564: 150: 
19565: 151:     try {
19566: 152:       const invitations = await firstValueFrom(
19567: 153:         this.invitationRepository.findByToOrgId(toOrgId)
19568: 154:       );
19569: 155:       return invitations;
19570: 156:     } catch (error) {
19571: 157:       this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
19572: 158:       throw error;
19573: 159:     } finally {
19574: 160:       this.loadingState.set(false);
19575: 161:     }
19576: 162:   }
19577: 163: 
19578: 164:   /**
19579: 165:    * 根据状态加载邀请
19580: 166:    */
19581: 167:   async loadInvitationsByStatus(status: InvitationStatus): Promise<CollaborationInvitation[]> {
19582: 168:     this.loadingState.set(true);
19583: 169:     this.errorState.set(null);
19584: 170: 
19585: 171:     try {
19586: 172:       const invitations = await firstValueFrom(
19587: 173:         this.invitationRepository.findByStatus(status)
19588: 174:       );
19589: 175:       return invitations;
19590: 176:     } catch (error) {
19591: 177:       this.errorState.set(error instanceof Error ? error.message : '加载邀请列表失败');
19592: 178:       throw error;
19593: 179:     } finally {
19594: 180:       this.loadingState.set(false);
19595: 181:     }
19596: 182:   }
19597: 183: 
19598: 184:   /**
19599: 185:    * 加载待处理邀请
19600: 186:    */
19601: 187:   async loadPendingInvitations(): Promise<CollaborationInvitation[]> {
19602: 188:     this.loadingState.set(true);
19603: 189:     this.errorState.set(null);
19604: 190: 
19605: 191:     try {
19606: 192:       const invitations = await firstValueFrom(this.invitationRepository.findPending());
19607: 193:       return invitations;
19608: 194:     } catch (error) {
19609: 195:       this.errorState.set(error instanceof Error ? error.message : '加载待处理邀请失败');
19610: 196:       throw error;
19611: 197:     } finally {
19612: 198:       this.loadingState.set(false);
19613: 199:     }
19614: 200:   }
19615: 201: 
19616: 202:   /**
19617: 203:    * 加载过期邀请
19618: 204:    */
19619: 205:   async loadExpiredInvitations(): Promise<CollaborationInvitation[]> {
19620: 206:     this.loadingState.set(true);
19621: 207:     this.errorState.set(null);
19622: 208: 
19623: 209:     try {
19624: 210:       const invitations = await firstValueFrom(this.invitationRepository.findExpired());
19625: 211:       return invitations;
19626: 212:     } catch (error) {
19627: 213:       this.errorState.set(error instanceof Error ? error.message : '加载过期邀请失败');
19628: 214:       throw error;
19629: 215:     } finally {
19630: 216:       this.loadingState.set(false);
19631: 217:     }
19632: 218:   }
19633: 219: 
19634: 220:   /**
19635: 221:    * 创建邀请
19636: 222:    */
19637: 223:   async createInvitation(data: CollaborationInvitationInsert): Promise<CollaborationInvitation> {
19638: 224:     this.loadingState.set(true);
19639: 225:     this.errorState.set(null);
19640: 226: 
19641: 227:     try {
19642: 228:       const invitation = await firstValueFrom(this.invitationRepository.create(data));
19643: 229:       // 更新本地状态
19644: 230:       this.invitationsState.update(invitations => [...invitations, invitation]);
19645: 231:       return invitation;
19646: 232:     } catch (error) {
19647: 233:       this.errorState.set(error instanceof Error ? error.message : '创建邀请失败');
19648: 234:       throw error;
19649: 235:     } finally {
19650: 236:       this.loadingState.set(false);
19651: 237:     }
19652: 238:   }
19653: 239: 
19654: 240:   /**
19655: 241:    * 更新邀请
19656: 242:    */
19657: 243:   async updateInvitation(
19658: 244:     id: string,
19659: 245:     data: CollaborationInvitationUpdate
19660: 246:   ): Promise<CollaborationInvitation> {
19661: 247:     this.loadingState.set(true);
19662: 248:     this.errorState.set(null);
19663: 249: 
19664: 250:     try {
19665: 251:       const invitation = await firstValueFrom(this.invitationRepository.update(id, data));
19666: 252:       // 更新本地状态
19667: 253:       this.invitationsState.update(invitations =>
19668: 254:         invitations.map(i => (i.id === id ? invitation : i))
19669: 255:       );
19670: 256:       // 如果更新的是当前选中的邀请，也更新选中状态
19671: 257:       if (this.selectedInvitation()?.id === id) {
19672: 258:         this.selectedInvitationState.set(invitation);
19673: 259:       }
19674: 260:       return invitation;
19675: 261:     } catch (error) {
19676: 262:       this.errorState.set(error instanceof Error ? error.message : '更新邀请失败');
19677: 263:       throw error;
19678: 264:     } finally {
19679: 265:       this.loadingState.set(false);
19680: 266:     }
19681: 267:   }
19682: 268: 
19683: 269:   /**
19684: 270:    * 接受邀请
19685: 271:    */
19686: 272:   async acceptInvitation(id: string): Promise<CollaborationInvitation> {
19687: 273:     return this.updateInvitation(id, {
19688: 274:       status: InvitationStatus.ACCEPTED,
19689: 275:       responded_at: new Date().toISOString()
19690: 276:     });
19691: 277:   }
19692: 278: 
19693: 279:   /**
19694: 280:    * 拒绝邀请
19695: 281:    */
19696: 282:   async rejectInvitation(id: string): Promise<CollaborationInvitation> {
19697: 283:     return this.updateInvitation(id, {
19698: 284:       status: InvitationStatus.REJECTED,
19699: 285:       responded_at: new Date().toISOString()
19700: 286:     });
19701: 287:   }
19702: 288: 
19703: 289:   /**
19704: 290:    * 删除邀请
19705: 291:    */
19706: 292:   async deleteInvitation(id: string): Promise<void> {
19707: 293:     this.loadingState.set(true);
19708: 294:     this.errorState.set(null);
19709: 295: 
19710: 296:     try {
19711: 297:       await firstValueFrom(this.invitationRepository.delete(id));
19712: 298:       // 更新本地状态
19713: 299:       this.invitationsState.update(invitations => invitations.filter(i => i.id !== id));
19714: 300:       // 如果删除的是当前选中的邀请，清空选中状态
19715: 301:       if (this.selectedInvitation()?.id === id) {
19716: 302:         this.selectedInvitationState.set(null);
19717: 303:       }
19718: 304:     } catch (error) {
19719: 305:       this.errorState.set(error instanceof Error ? error.message : '删除邀请失败');
19720: 306:       throw error;
19721: 307:     } finally {
19722: 308:       this.loadingState.set(false);
19723: 309:     }
19724: 310:   }
19725: 311: 
19726: 312:   /**
19727: 313:    * 选择邀请
19728: 314:    */
19729: 315:   selectInvitation(invitation: CollaborationInvitation | null): void {
19730: 316:     this.selectedInvitationState.set(invitation);
19731: 317:   }
19732: 318: 
19733: 319:   /**
19734: 320:    * 重置状态
19735: 321:    */
19736: 322:   reset(): void {
19737: 323:     this.invitationsState.set([]);
19738: 324:     this.selectedInvitationState.set(null);
19739: 325:     this.errorState.set(null);
19740: 326:   }
19741: 327: }
19742: ````
19743: 
19744: ## File: src/app/shared/shared-delon.module.ts
19745: ````typescript
19746:   1: // ========== @delon/abc 組件模組 ==========
19747:   2: // 文本超出省略顯示 — https://ng-alain.com/components/ellipsis
19748:   3: import { CellModule } from '@delon/abc/cell';
19749:   4: import { CountDownModule } from '@delon/abc/count-down';
19750:   5: import { DownFileDirective } from '@delon/abc/down-file';
19751:   6: import { EllipsisComponent } from '@delon/abc/ellipsis';
19752:   7: // 頁面底部操作工具欄 — https://ng-alain.com/components/footer-toolbar
19753:   8: import { ExceptionModule } from '@delon/abc/exception';
19754:   9: import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
19755:  10: // 內容區全屏/填充切換 — https://ng-alain.com/components/full-content
19756:  11: import { FullContentModule } from '@delon/abc/full-content';
19757:  12: // 頁面標題區（麵包屑、操作區） — https://ng-alain.com/components/page-header
19758:  13: import { GlobalFooterModule } from '@delon/abc/global-footer';
19759:  14: import { NoticeIconModule } from '@delon/abc/notice-icon';
19760:  15: import { OnboardingModule } from '@delon/abc/onboarding';
19761:  16: import { PageHeaderModule } from '@delon/abc/page-header';
19762:  17: // SE：簡潔表單佈局（快速排版表單項） — https://ng-alain.com/components/se
19763:  18: import { QuickMenuModule } from '@delon/abc/quick-menu';
19764:  19: import { ReuseTabModule } from '@delon/abc/reuse-tab';
19765:  20: import { SEModule } from '@delon/abc/se';
19766:  21: // ST：Smart Table 智能表格 — https://ng-alain.com/components/st
19767:  22: import { STModule } from '@delon/abc/st';
19768:  23: // SV：簡單視圖，用於鍵值描述展示 — https://ng-alain.com/components/sv
19769:  24: import { SVModule } from '@delon/abc/sv';
19770:  25: // Tag 多選與展開/收起選擇器 — https://ng-alain.com/components/tag-select
19771:  26: import { TagSelectComponent } from '@delon/abc/tag-select';
19772:  27: // ReuseTab 標籤頁（路由快取） — https://ng-alain.com/components/reuse-tab
19773:  28: // 引導式操作 — https://ng-alain.com/components/onboarding
19774:  29: // 快捷菜單 — https://ng-alain.com/components/quick-menu
19775:  30: // 倒計時 — https://ng-alain.com/components/count-down
19776:  31: // 全局頁腳 — https://ng-alain.com/components/global-footer
19777:  32: // 異常頁面 — https://ng-alain.com/components/exception
19778:  33: // 通知圖標 — https://ng-alain.com/components/notice-icon
19779:  34: // 下載文件指令 — https://ng-alain.com/components/down-file
19780:  35: // ACL 訪問控制指令（顯示/隱藏/條件） — https://ng-alain.com/acl
19781:  36: import { ACLDirective, ACLIfDirective } from '@delon/acl';
19782:  37: // 動態表單（基於 JSON Schema 的表單生成與驗證） — https://ng-alain.com/form
19783:  38: // 金額/貨幣格式化管道 — https://ng-alain.com/util
19784:  39: // 圖表組件 — https://ng-alain.com/docs/chart
19785:  40: // 注意：@delon/chart 必須從子模組導入，而非從 @delon/chart 直接導入
19786:  41: // 柱狀圖 — https://ng-alain.com/chart/bar
19787:  42: import { G2BarModule } from '@delon/chart/bar';
19788:  43: // 圖表卡片 — https://ng-alain.com/chart/card
19789:  44: import { G2CardModule } from '@delon/chart/card';
19790:  45: // ECharts 圖表 — https://ng-alain.com/chart/chart-echarts
19791:  46: import { ChartEChartsModule } from '@delon/chart/chart-echarts';
19792:  47: // 儀表盤 — https://ng-alain.com/chart/gauge
19793:  48: import { G2GaugeModule } from '@delon/chart/gauge';
19794:  49: // 迷你面積圖 — https://ng-alain.com/chart/mini-area
19795:  50: import { G2MiniAreaModule } from '@delon/chart/mini-area';
19796:  51: // 迷你柱狀圖 — https://ng-alain.com/chart/mini-bar
19797:  52: import { G2MiniBarModule } from '@delon/chart/mini-bar';
19798:  53: // 迷你進度條 — https://ng-alain.com/chart/mini-progress
19799:  54: import { G2MiniProgressModule } from '@delon/chart/mini-progress';
19800:  55: // 數據文本 — https://ng-alain.com/chart/number-info
19801:  56: import { NumberInfoModule } from '@delon/chart/number-info';
19802:  57: // 餅圖 — https://ng-alain.com/chart/pie
19803:  58: import { G2PieModule } from '@delon/chart/pie';
19804:  59: // 雷達圖 — https://ng-alain.com/chart/radar
19805:  60: import { G2RadarModule } from '@delon/chart/radar';
19806:  61: // 單一柱狀圖 — https://ng-alain.com/chart/single-bar
19807:  62: import { G2SingleBarModule } from '@delon/chart/single-bar';
19808:  63: // 標籤雲 — https://ng-alain.com/chart/tag-cloud
19809:  64: import { G2TagCloudModule } from '@delon/chart/tag-cloud';
19810:  65: // 時間軸 — https://ng-alain.com/chart/timeline
19811:  66: import { G2TimelineModule } from '@delon/chart/timeline';
19812:  67: // 趨勢標記 — https://ng-alain.com/chart/trend
19813:  68: import { TrendModule } from '@delon/chart/trend';
19814:  69: // 水波圖 — https://ng-alain.com/chart/water-wave
19815:  70: import { G2WaterWaveModule } from '@delon/chart/water-wave';
19816:  71: import { DelonFormModule } from '@delon/form';
19817:  72: import { LayoutDefaultModule } from '@delon/theme/layout-default';
19818:  73: import { SettingDrawerModule } from '@delon/theme/setting-drawer';
19819:  74: import { ThemeBtnComponent } from '@delon/theme/theme-btn';
19820:  75: import { CurrencyPricePipe } from '@delon/util';
19821:  76: // ========== @delon/theme 組件模組 ==========
19822:  77: // 默認佈局 — https://ng-alain.com/theme/layout-default
19823:  78: // 設置抽屜 — https://ng-alain.com/theme/setting-drawer
19824:  79: // 主題切換按鈕 — https://ng-alain.com/theme/theme-btn
19825:  80: 
19826:  81: export const SHARED_DELON_MODULES = [
19827:  82:   CellModule, // 單元格渲染 — https://ng-alain.com/components/cell/zh
19828:  83:   DelonFormModule, // 動態表單 — https://ng-alain.com/form
19829:  84:   STModule, // 智能表格 — https://ng-alain.com/components/st
19830:  85:   SVModule, // 鍵值描述視圖 — https://ng-alain.com/components/sv
19831:  86:   SEModule, // 表單佈局 — https://ng-alain.com/components/se
19832:  87:   PageHeaderModule, // 頁面標題/操作 — https://ng-alain.com/components/page-header
19833:  88:   EllipsisComponent, // 文本省略 — https://ng-alain.com/components/ellipsis
19834:  89:   FooterToolbarModule, // 底部工具欄 — https://ng-alain.com/components/footer-toolbar
19835:  90:   FullContentModule, // 全屏內容 — https://ng-alain.com/components/full-content
19836:  91:   ReuseTabModule, // 標籤頁（路由快取） — https://ng-alain.com/components/reuse-tab
19837:  92:   TagSelectComponent, // 標籤選擇 — https://ng-alain.com/components/tag-select
19838:  93:   OnboardingModule, // 引導式操作 — https://ng-alain.com/components/onboarding
19839:  94:   QuickMenuModule, // 快捷菜單 — https://ng-alain.com/components/quick-menu
19840:  95:   CountDownModule, // 倒計時 — https://ng-alain.com/components/count-down
19841:  96:   GlobalFooterModule, // 全局頁腳 — https://ng-alain.com/components/global-footer
19842:  97:   ExceptionModule, // 異常頁面 — https://ng-alain.com/components/exception
19843:  98:   NoticeIconModule, // 通知圖標 — https://ng-alain.com/components/notice-icon
19844:  99:   DownFileDirective, // 下載文件指令 — https://ng-alain.com/components/down-file
19845: 100:   ACLDirective, // ACL 指令 — https://ng-alain.com/acl
19846: 101:   ACLIfDirective, // 條件 ACL 指令 — https://ng-alain.com/acl
19847: 102:   CurrencyPricePipe, // 金額格式化 — https://ng-alain.com/util
19848: 103:   // ========== @delon/theme 組件模組 ==========
19849: 104:   LayoutDefaultModule, // 默認佈局 — https://ng-alain.com/theme/layout-default
19850: 105:   SettingDrawerModule, // 設置抽屜 — https://ng-alain.com/theme/setting-drawer
19851: 106:   ThemeBtnComponent, // 主題切換按鈕 — https://ng-alain.com/theme/theme-btn
19852: 107:   // @delon/chart 完整圖表模組套件
19853: 108:   G2BarModule, // 柱狀圖 — https://ng-alain.com/chart/bar
19854: 109:   G2CardModule, // 圖表卡片 — https://ng-alain.com/chart/card
19855: 110:   ChartEChartsModule, // ECharts 圖表 — https://ng-alain.com/chart/chart-echarts
19856: 111:   G2GaugeModule, // 儀表盤 — https://ng-alain.com/chart/gauge
19857: 112:   G2MiniAreaModule, // 迷你面積圖 — https://ng-alain.com/chart/mini-area
19858: 113:   G2MiniBarModule, // 迷你柱狀圖 — https://ng-alain.com/chart/mini-bar
19859: 114:   G2MiniProgressModule, // 迷你進度條 — https://ng-alain.com/chart/mini-progress
19860: 115:   NumberInfoModule, // 數據文本 — https://ng-alain.com/chart/number-info
19861: 116:   G2PieModule, // 餅圖 — https://ng-alain.com/chart/pie
19862: 117:   G2RadarModule, // 雷達圖 — https://ng-alain.com/chart/radar
19863: 118:   G2SingleBarModule, // 單一柱狀圖 — https://ng-alain.com/chart/single-bar
19864: 119:   G2TagCloudModule, // 標籤雲 — https://ng-alain.com/chart/tag-cloud
19865: 120:   G2TimelineModule, // 時間軸 — https://ng-alain.com/chart/timeline
19866: 121:   TrendModule, // 趨勢標記 — https://ng-alain.com/chart/trend
19867: 122:   G2WaterWaveModule // 水波圖 — https://ng-alain.com/chart/water-wave
19868: 123: ];
19869: ````
19870: 
19871: ## File: src/app/shared/shared-tinymce.module.ts
19872: ````typescript
19873:  1: /**
19874:  2:  * ngx-tinymce 富文本編輯器模組
19875:  3:  * 
19876:  4:  * 注意：此模組為可選模組，僅在需要使用 TinyMCE 富文本編輯器時導入
19877:  5:  * 
19878:  6:  * 使用方式：
19879:  7:  * ```typescript
19880:  8:  * import { SHARED_TINYMCE_MODULES } from '@shared/shared-tinymce.module';
19881:  9:  * 
19882: 10:  * @Component({
19883: 11:  *   imports: [SHARED_IMPORTS, ...SHARED_TINYMCE_MODULES]
19884: 12:  * })
19885: 13:  * ```
19886: 14:  * 
19887: 15:  * 或在需要時直接導入：
19888: 16:  * ```typescript
19889: 17:  * import { EditorModule } from 'ngx-tinymce';
19890: 18:  * 
19891: 19:  * @Component({
19892: 20:  *   imports: [SHARED_IMPORTS, EditorModule]
19893: 21:  * })
19894: 22:  * ```
19895: 23:  * 
19896: 24:  * @see https://github.com/ng-alain/ng-alain/tree/master/packages/tinymce
19897: 25:  * @see https://www.tiny.cloud/docs/tinymce/latest/
19898: 26:  */
19899: 27: 
19900: 28: // 注意：ngx-tinymce 在 package.json 中已安裝，但當前未使用
19901: 29: // 如需使用，請取消下面的註釋並安裝對應的類型定義（如果有的話）
19902: 30: // import { EditorModule } from 'ngx-tinymce';
19903: 31: 
19904: 32: /**
19905: 33:  * ngx-tinymce 模組集合
19906: 34:  * 
19907: 35:  * 目前為空數組，因為項目中尚未使用 TinyMCE 編輯器
19908: 36:  * 如需使用，請取消上面的 import 並將 EditorModule 添加到數組中
19909: 37:  */
19910: 38: export const SHARED_TINYMCE_MODULES: any[] = [
19911: 39:   // EditorModule, // TinyMCE 富文本編輯器 — https://github.com/ng-alain/ng-alain/tree/master/packages/tinymce
19912: 40: ];
19913: ````
19914: 
19915: ## File: src/app/shared/shared-zorro.module.ts
19916: ````typescript
19917:   1: import { NzAffixModule } from 'ng-zorro-antd/affix';
19918:   2: import { NzAlertModule } from 'ng-zorro-antd/alert';
19919:   3: import { NzAnchorModule } from 'ng-zorro-antd/anchor';
19920:   4: import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
19921:   5: import { NzAvatarModule } from 'ng-zorro-antd/avatar';
19922:   6: import { NzBackTopModule } from 'ng-zorro-antd/back-top';
19923:   7: import { NzBadgeModule } from 'ng-zorro-antd/badge';
19924:   8: import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
19925:   9: import { NzButtonModule } from 'ng-zorro-antd/button';
19926:  10: import { NzCalendarModule } from 'ng-zorro-antd/calendar';
19927:  11: import { NzCardModule } from 'ng-zorro-antd/card';
19928:  12: import { NzCarouselModule } from 'ng-zorro-antd/carousel';
19929:  13: import { NzCascaderModule } from 'ng-zorro-antd/cascader';
19930:  14: import { NzCheckListModule } from 'ng-zorro-antd/check-list';
19931:  15: import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
19932:  16: import { NzCollapseModule } from 'ng-zorro-antd/collapse';
19933:  17: import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
19934:  18: import { NzCommentModule } from 'ng-zorro-antd/comment';
19935:  19: import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
19936:  20: import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
19937:  21: import { NzDividerModule } from 'ng-zorro-antd/divider';
19938:  22: import { NzDrawerModule } from 'ng-zorro-antd/drawer';
19939:  23: import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
19940:  24: import { NzEmptyModule } from 'ng-zorro-antd/empty';
19941:  25: import { NzFlexModule } from 'ng-zorro-antd/flex';
19942:  26: import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
19943:  27: import { NzFormModule } from 'ng-zorro-antd/form';
19944:  28: import { NzGridModule } from 'ng-zorro-antd/grid';
19945:  29: import { NzHashCodeModule } from 'ng-zorro-antd/hash-code';
19946:  30: import { NzIconModule } from 'ng-zorro-antd/icon';
19947:  31: import { NzImageModule } from 'ng-zorro-antd/image';
19948:  32: import { NzInputModule } from 'ng-zorro-antd/input';
19949:  33: import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
19950:  34: import { NzLayoutModule } from 'ng-zorro-antd/layout';
19951:  35: import { NzListModule } from 'ng-zorro-antd/list';
19952:  36: import { NzMentionModule } from 'ng-zorro-antd/mention';
19953:  37: import { NzMenuModule } from 'ng-zorro-antd/menu';
19954:  38: import { NzModalModule } from 'ng-zorro-antd/modal';
19955:  39: import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
19956:  40: import { NzPaginationModule } from 'ng-zorro-antd/pagination';
19957:  41: import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
19958:  42: import { NzPopoverModule } from 'ng-zorro-antd/popover';
19959:  43: import { NzProgressModule } from 'ng-zorro-antd/progress';
19960:  44: import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
19961:  45: import { NzRadioModule } from 'ng-zorro-antd/radio';
19962:  46: import { NzRateModule } from 'ng-zorro-antd/rate';
19963:  47: import { NzResultModule } from 'ng-zorro-antd/result';
19964:  48: import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
19965:  49: import { NzSelectModule } from 'ng-zorro-antd/select';
19966:  50: import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
19967:  51: import { NzSliderModule } from 'ng-zorro-antd/slider';
19968:  52: import { NzSpaceModule } from 'ng-zorro-antd/space';
19969:  53: import { NzSpinModule } from 'ng-zorro-antd/spin';
19970:  54: import { NzSplitterModule } from 'ng-zorro-antd/splitter';
19971:  55: import { NzStatisticModule } from 'ng-zorro-antd/statistic';
19972:  56: import { NzStepsModule } from 'ng-zorro-antd/steps';
19973:  57: import { NzSwitchModule } from 'ng-zorro-antd/switch';
19974:  58: import { NzTableModule } from 'ng-zorro-antd/table';
19975:  59: import { NzTabsModule } from 'ng-zorro-antd/tabs';
19976:  60: import { NzTagModule } from 'ng-zorro-antd/tag';
19977:  61: import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
19978:  62: import { NzTimelineModule } from 'ng-zorro-antd/timeline';
19979:  63: import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
19980:  64: import { NzTransferModule } from 'ng-zorro-antd/transfer';
19981:  65: import { NzTreeModule } from 'ng-zorro-antd/tree';
19982:  66: import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
19983:  67: import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
19984:  68: import { NzTypographyModule } from 'ng-zorro-antd/typography';
19985:  69: import { NzUploadModule } from 'ng-zorro-antd/upload';
19986:  70: import { NzWaterMarkModule } from 'ng-zorro-antd/water-mark';
19987:  71: 
19988:  72: export const SHARED_ZORRO_MODULES = [
19989:  73:   // 反饋類組件
19990:  74:   NzAlertModule, // Alert 警告提示 - https://ng.ant.design/components/alert/en
19991:  75:   NzResultModule, // Result 結果 - https://ng.ant.design/components/result/en
19992:  76:   NzSkeletonModule, // Skeleton 骨架屏 - https://ng.ant.design/components/skeleton/en
19993:  77:   NzSpinModule, // Spin 加載中 - https://ng.ant.design/components/spin/en
19994:  78:   NzProgressModule, // Progress 進度條 - https://ng.ant.design/components/progress/en
19995:  79:   NzDrawerModule, // Drawer 抽屜 - https://ng.ant.design/components/drawer/en
19996:  80:   NzModalModule, // Modal 對話框 - https://ng.ant.design/components/modal/en
19997:  81:   NzPopconfirmModule, // Popconfirm 氣泡確認框 - https://ng.ant.design/components/popconfirm/en
19998:  82:   // 注意：Message 和 Notification 在 ng-zorro-antd v20+ 中通過服務提供（NzMessageService, NzNotificationService）
19999:  83:   // 不需要導入模組，可直接注入使用
20000:  84:   // 數據展示類組件
20001:  85:   NzAvatarModule, // Avatar 頭像 - https://ng.ant.design/components/avatar/en
20002:  86:   NzBadgeModule, // Badge 徽標數 - https://ng.ant.design/components/badge/en
20003:  87:   NzCalendarModule, // Calendar 日曆 - https://ng.ant.design/components/calendar/en
20004:  88:   NzCardModule, // Card 卡片 - https://ng.ant.design/components/card/en
20005:  89:   NzCarouselModule, // Carousel 走馬燈 - https://ng.ant.design/components/carousel/en
20006:  90:   NzCollapseModule, // Collapse 折疊面板 - https://ng.ant.design/components/collapse/en
20007:  91:   NzCommentModule, // Comment 評論 - https://ng.ant.design/components/comment/en
20008:  92:   NzDescriptionsModule, // Descriptions 描述列表 - https://ng.ant.design/components/descriptions/en
20009:  93:   NzEmptyModule, // Empty 空狀態 - https://ng.ant.design/components/empty/en
20010:  94:   NzImageModule, // Image 圖片 - https://ng.ant.design/components/image/en
20011:  95:   NzListModule, // List 列表 - https://ng.ant.design/components/list/en
20012:  96:   NzPopoverModule, // Popover 氣泡卡片 - https://ng.ant.design/components/popover/en
20013:  97:   NzQRCodeModule, // QRCode 二維碼 - https://ng.ant.design/components/qr-code/en
20014:  98:   NzSegmentedModule, // Segmented 分段控制器 - https://ng.ant.design/components/segmented/en
20015:  99:   NzStatisticModule, // Statistic 統計 - https://ng.ant.design/components/statistic/en
20016: 100:   NzTableModule, // Table 表格 - https://ng.ant.design/components/table/en
20017: 101:   NzTagModule, // Tag 標籤 - https://ng.ant.design/components/tag/en
20018: 102:   NzTimelineModule, // Timeline 時間軸 - https://ng.ant.design/components/timeline/en
20019: 103:   NzTooltipModule, // Tooltip 文字提示 - https://ng.ant.design/components/tooltip/en
20020: 104:   NzTreeModule, // Tree 樹形控件 - https://ng.ant.design/components/tree/en
20021: 105:   NzTreeViewModule, // TreeView 樹視圖 - https://ng.ant.design/components/tree-view/en
20022: 106:   // 數據錄入類組件
20023: 107:   NzAutocompleteModule, // AutoComplete 自動完成 - https://ng.ant.design/components/auto-complete/en
20024: 108:   NzCascaderModule, // Cascader 級聯選擇 - https://ng.ant.design/components/cascader/en
20025: 109:   NzCheckboxModule, // Checkbox 多選框 - https://ng.ant.design/components/checkbox/en
20026: 110:   NzColorPickerModule, // ColorPicker 顏色選擇器 - https://ng.ant.design/components/color-picker/en
20027: 111:   NzDatePickerModule, // DatePicker 日期選擇框 - https://ng.ant.design/components/date-picker/en
20028: 112:   NzFormModule, // Form 表單 - https://ng.ant.design/components/form/en
20029: 113:   NzInputModule, // Input 輸入框 - https://ng.ant.design/components/input/en
20030: 114:   NzInputNumberModule, // InputNumber 數字輸入框 - https://ng.ant.design/components/input-number/en
20031: 115:   NzMentionModule, // Mention 提及 - https://ng.ant.design/components/mention/en
20032: 116:   NzRadioModule, // Radio 單選框 - https://ng.ant.design/components/radio/en
20033: 117:   NzRateModule, // Rate 評分 - https://ng.ant.design/components/rate/en
20034: 118:   NzSelectModule, // Select 選擇器 - https://ng.ant.design/components/select/en
20035: 119:   NzSliderModule, // Slider 滑動輸入條 - https://ng.ant.design/components/slider/en
20036: 120:   NzSwitchModule, // Switch 開關 - https://ng.ant.design/components/switch/en
20037: 121:   NzTimePickerModule, // TimePicker 時間選擇框 - https://ng.ant.design/components/time-picker/en
20038: 122:   NzTransferModule, // Transfer 穿梭框 - https://ng.ant.design/components/transfer/en
20039: 123:   NzTreeSelectModule, // TreeSelect 樹選擇 - https://ng.ant.design/components/tree-select/en
20040: 124:   NzUploadModule, // Upload 上傳 - https://ng.ant.design/components/upload/en
20041: 125:   // 佈局類組件
20042: 126:   NzDividerModule, // Divider 分割線 - https://ng.ant.design/components/divider/en
20043: 127:   NzFlexModule, // Flex 彈性佈局 - https://ng.ant.design/components/flex/en
20044: 128:   NzGridModule, // Grid 柵格 - https://ng.ant.design/components/grid/en
20045: 129:   NzLayoutModule, // Layout 佈局 - https://ng.ant.design/components/layout/en
20046: 130:   NzSpaceModule, // Space 間距 - https://ng.ant.design/components/space/en
20047: 131:   NzSplitterModule, // Splitter 分隔面板 - https://ng.ant.design/components/splitter/en
20048: 132:   // 通用類組件
20049: 133:   NzButtonModule, // Button 按鈕 - https://ng.ant.design/components/button/en
20050: 134:   NzFloatButtonModule, // FloatButton 懸浮按鈕 - https://ng.ant.design/components/float-button/en
20051: 135:   NzIconModule, // Icon 圖標 - https://ng.ant.design/components/icon/en
20052: 136:   NzTypographyModule, // Typography 排版 - https://ng.ant.design/components/typography/en
20053: 137:   // 導航類組件
20054: 138:   NzAnchorModule, // Anchor 錨點 - https://ng.ant.design/components/anchor/en
20055: 139:   NzBreadCrumbModule, // Breadcrumb 麵包屑 - https://ng.ant.design/components/breadcrumb/en
20056: 140:   NzDropDownModule, // Dropdown 下拉菜單 - https://ng.ant.design/components/dropdown/en
20057: 141:   NzMenuModule, // Menu 導航菜單 - https://ng.ant.design/components/menu/en
20058: 142:   NzPageHeaderModule, // PageHeader 頁頭 - https://ng.ant.design/components/page-header/en
20059: 143:   NzPaginationModule, // Pagination 分頁 - https://ng.ant.design/components/pagination/en
20060: 144:   NzStepsModule, // Steps 步驟條 - https://ng.ant.design/components/steps/en
20061: 145:   NzTabsModule, // Tabs 標籤頁 - https://ng.ant.design/components/tabs/en
20062: 146:   // 其他類組件
20063: 147:   NzAffixModule, // Affix 固釘 - https://ng.ant.design/components/affix/en
20064: 148:   NzBackTopModule, // BackTop 返回頂部 - https://ng.ant.design/components/back-top/en
20065: 149:   NzWaterMarkModule, // WaterMark 水印 - https://ng.ant.design/components/water-mark/en
20066: 150:   // 特色組件
20067: 151:   NzCheckListModule, // CheckList 任務清單 - https://ng.ant.design/components/check-list/en
20068: 152:   NzHashCodeModule // HashCode 哈希碼 - https://ng.ant.design/components/hash-code/en
20069: 153: ];
20070: ````
20071: 
20072: ## File: src/app/shared/st-widget/index.ts
20073: ````typescript
20074: 1: import type { STWidgetProvideConfig } from '@delon/abc/st';
20075: 2: 
20076: 3: export const ST_WIDGETS: STWidgetProvideConfig[] = [];
20077: ````
20078: 
20079: ## File: src/app/shared/utils/yuan.ts
20080: ````typescript
20081:  1: /**
20082:  2:  * 转化成RMB元字符串
20083:  3:  *
20084:  4:  * @param digits 当数字类型时，允许指定小数点后数字的个数，默认2位小数
20085:  5:  */
20086:  6: export function yuan(value: number | string, digits = 2): string {
20087:  7:   if (typeof value === 'number') {
20088:  8:     value = value.toFixed(digits);
20089:  9:   }
20090: 10:   return `&yen ${value}`;
20091: 11: }
20092: ````
20093: 
20094: ## File: src/environments/environment.prod.ts
20095: ````typescript
20096:  1: import { Environment } from '@delon/theme';
20097:  2: 
20098:  3: export const environment = {
20099:  4:   production: true,
20100:  5:   useHash: true,
20101:  6:   api: {
20102:  7:     baseUrl: './',
20103:  8:     refreshTokenEnabled: true,
20104:  9:     refreshTokenType: 'auth-refresh'
20105: 10:   },
20106: 11:   supabase: {
20107: 12:     url: 'https://pfxxjtvnqptdvjfakotc.supabase.co',
20108: 13:     anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmeHhqdHZucXB0ZHZqZmFrb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzgwNjMsImV4cCI6MjA3ODY1NDA2M30.xADVH2fTd4059lZSZWpIM6CSeiixm0VCgN0SC5bKGxo',
20109: 14:     storage: {
20110: 15:       documentBucket: 'blueprint-documents'
20111: 16:     }
20112: 17:   }
20113: 18: } as Environment;
20114: ````
20115: 
20116: ## File: src/environments/environment.ts
20117: ````typescript
20118:  1: // This file can be replaced during build by using the `fileReplacements` array.
20119:  2: // `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
20120:  3: // The list of file replacements can be found in `angular.json`.
20121:  4: 
20122:  5: import * as MOCKDATA from '@_mock';
20123:  6: import { mockInterceptor, provideMockConfig } from '@delon/mock';
20124:  7: import { Environment } from '@delon/theme';
20125:  8: 
20126:  9: export const environment = {
20127: 10:   production: false,
20128: 11:   useHash: true,
20129: 12:   api: {
20130: 13:     baseUrl: './',
20131: 14:     refreshTokenEnabled: true,
20132: 15:     refreshTokenType: 'auth-refresh'
20133: 16:   },
20134: 17:   supabase: {
20135: 18:     url: 'https://pfxxjtvnqptdvjfakotc.supabase.co',
20136: 19:     anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmeHhqdHZucXB0ZHZqZmFrb3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNzgwNjMsImV4cCI6MjA3ODY1NDA2M30.xADVH2fTd4059lZSZWpIM6CSeiixm0VCgN0SC5bKGxo',
20137: 20:     storage: {
20138: 21:       documentBucket: 'blueprint-documents'
20139: 22:     }
20140: 23:   },
20141: 24:   providers: [provideMockConfig({ data: MOCKDATA })],
20142: 25:   interceptorFns: [mockInterceptor]
20143: 26: } as Environment;
20144: ````
20145: 
20146: ## File: src/main.ts
20147: ````typescript
20148: 1: import { bootstrapApplication } from '@angular/platform-browser';
20149: 2: 
20150: 3: import { AppComponent } from './app/app.component';
20151: 4: import { appConfig } from './app/app.config';
20152: 5: 
20153: 6: bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
20154: ````
20155: 
20156: ## File: src/style-icons-auto.ts
20157: ````typescript
20158:   1: /*
20159:   2:  * Automatically generated by 'ng g ng-alain:plugin icon'
20160:   3:  * @see https://ng-alain.com/cli/plugin#icon
20161:   4:  */
20162:   5: 
20163:   6: import {
20164:   7:   AlipayCircleOutline,
20165:   8:   ApiOutline,
20166:   9:   AppstoreOutline,
20167:  10:   ArrowDownOutline,
20168:  11:   BookOutline,
20169:  12:   BorderLeftOutline,
20170:  13:   BorderRightOutline,
20171:  14:   CloudOutline,
20172:  15:   CopyrightOutline,
20173:  16:   CustomerServiceOutline,
20174:  17:   DashboardOutline,
20175:  18:   DatabaseOutline,
20176:  19:   DingdingOutline,
20177:  20:   DislikeOutline,
20178:  21:   DownloadOutline,
20179:  22:   ForkOutline,
20180:  23:   FrownOutline,
20181:  24:   FullscreenExitOutline,
20182:  25:   FullscreenOutline,
20183:  26:   GithubOutline,
20184:  27:   GlobalOutline,
20185:  28:   HddOutline,
20186:  29:   LaptopOutline,
20187:  30:   LikeOutline,
20188:  31:   LockOutline,
20189:  32:   LogoutOutline,
20190:  33:   MailOutline,
20191:  34:   MenuFoldOutline,
20192:  35:   MenuUnfoldOutline,
20193:  36:   MessageOutline,
20194:  37:   PayCircleOutline,
20195:  38:   PieChartOutline,
20196:  39:   PrinterOutline,
20197:  40:   RocketOutline,
20198:  41:   ScanOutline,
20199:  42:   SettingOutline,
20200:  43:   ShareAltOutline,
20201:  44:   ShoppingCartOutline,
20202:  45:   SoundOutline,
20203:  46:   StarOutline,
20204:  47:   TaobaoCircleOutline,
20205:  48:   TaobaoOutline,
20206:  49:   TeamOutline,
20207:  50:   ToolOutline,
20208:  51:   TrophyOutline,
20209:  52:   UsbOutline,
20210:  53:   UserOutline,
20211:  54:   WeiboCircleOutline,
20212:  55:   ApartmentOutline,
20213:  56:   SwapOutline,
20214:  57:   PlusOutline,
20215:  58:   ArrowLeftOutline,
20216:  59:   LinkOutline,
20217:  60:   SearchOutline,
20218:  61:   CheckOutline,
20219:  62:   CloseCircleOutline,
20220:  63:   UploadOutline,
20221:  64:   CheckCircleOutline,
20222:  65:   EllipsisOutline,
20223:  66:   ArrowRightOutline,
20224:  67:   InfoCircleOutline,
20225:  68:   CheckSquareOutline,
20226:  69:   EditOutline,
20227:  70:   DeleteOutline,
20228:  71:   SaveOutline,
20229:  72:   FileOutline,
20230:  73:   FileAddOutline,
20231:  74:   FileTextOutline,
20232:  75:   FolderOutline,
20233:  76:   FolderOpenOutline,
20234:  77:   FolderAddOutline,
20235:  78:   UnorderedListOutline,
20236:  79:   OrderedListOutline,
20237:  80:   TableOutline,
20238:  81:   ClockCircleOutline,
20239:  82:   CalendarOutline,
20240:  83:   ScheduleOutline,
20241:  84:   SafetyOutline,
20242:  85:   BellOutline,
20243:  86:   ExclamationCircleOutline,
20244:  87:   WarningOutline,
20245:  88:   MinusCircleOutline,
20246:  89:   ReloadOutline,
20247:  90:   SyncOutline,
20248:  91:   RedoOutline,
20249:  92:   UndoOutline,
20250:  93:   RotateLeftOutline,
20251:  94:   HomeOutline,
20252:  95:   MenuOutline,
20253:  96:   HistoryOutline,
20254:  97:   EyeOutline,
20255:  98:   EyeInvisibleOutline,
20256:  99:   AppstoreOutline as MenuAppOutline,
20257: 100:   UserAddOutline,
20258: 101:   UserDeleteOutline,
20259: 102:   ContactsOutline,
20260: 103:   FileExcelOutline,
20261: 104:   FilePdfOutline,
20262: 105:   FileImageOutline,
20263: 106:   SendOutline,
20264: 107:   CommentOutline,
20265: 108:   FilterOutline,
20266: 109:   SortAscendingOutline,
20267: 110:   SortDescendingOutline,
20268: 111:   ClearOutline,
20269: 112:   BarChartOutline,
20270: 113:   LineChartOutline,
20271: 114:   AreaChartOutline,
20272: 115:   WifiOutline,
20273: 116:   DisconnectOutline,
20274: 117:   UnlockOutline,
20275: 118:   GroupOutline,
20276: 119:   HeartOutline,
20277: 120:   ThunderboltOutline,
20278: 121:   BugOutline,
20279: 122:   BulbOutline
20280: 123: } from '@ant-design/icons-angular/icons';
20281: 124: 
20282: 125: export const ICONS_AUTO = [
20283: 126:   AlipayCircleOutline,
20284: 127:   ApiOutline,
20285: 128:   AppstoreOutline,
20286: 129:   ArrowDownOutline,
20287: 130:   BookOutline,
20288: 131:   BorderLeftOutline,
20289: 132:   BorderRightOutline,
20290: 133:   CloudOutline,
20291: 134:   CopyrightOutline,
20292: 135:   CustomerServiceOutline,
20293: 136:   DashboardOutline,
20294: 137:   DatabaseOutline,
20295: 138:   DingdingOutline,
20296: 139:   DislikeOutline,
20297: 140:   DownloadOutline,
20298: 141:   ForkOutline,
20299: 142:   FrownOutline,
20300: 143:   FullscreenExitOutline,
20301: 144:   FullscreenOutline,
20302: 145:   GithubOutline,
20303: 146:   GlobalOutline,
20304: 147:   HddOutline,
20305: 148:   LaptopOutline,
20306: 149:   LikeOutline,
20307: 150:   LockOutline,
20308: 151:   LogoutOutline,
20309: 152:   MailOutline,
20310: 153:   MenuFoldOutline,
20311: 154:   MenuUnfoldOutline,
20312: 155:   MessageOutline,
20313: 156:   PayCircleOutline,
20314: 157:   PieChartOutline,
20315: 158:   PrinterOutline,
20316: 159:   RocketOutline,
20317: 160:   ScanOutline,
20318: 161:   SettingOutline,
20319: 162:   ShareAltOutline,
20320: 163:   ShoppingCartOutline,
20321: 164:   SoundOutline,
20322: 165:   StarOutline,
20323: 166:   TaobaoCircleOutline,
20324: 167:   TaobaoOutline,
20325: 168:   TeamOutline,
20326: 169:   ToolOutline,
20327: 170:   TrophyOutline,
20328: 171:   UsbOutline,
20329: 172:   UserOutline,
20330: 173:   WeiboCircleOutline,
20331: 174:   ApartmentOutline,
20332: 175:   SwapOutline,
20333: 176:   PlusOutline,
20334: 177:   ArrowLeftOutline,
20335: 178:   LinkOutline,
20336: 179:   SearchOutline,
20337: 180:   CheckOutline,
20338: 181:   CloseCircleOutline,
20339: 182:   UploadOutline,
20340: 183:   CheckCircleOutline,
20341: 184:   EllipsisOutline,
20342: 185:   ArrowRightOutline,
20343: 186:   InfoCircleOutline,
20344: 187:   CheckSquareOutline,
20345: 188:   EditOutline,
20346: 189:   DeleteOutline,
20347: 190:   SaveOutline,
20348: 191:   FileOutline,
20349: 192:   FileAddOutline,
20350: 193:   FileTextOutline,
20351: 194:   FolderOutline,
20352: 195:   FolderOpenOutline,
20353: 196:   FolderAddOutline,
20354: 197:   UnorderedListOutline,
20355: 198:   OrderedListOutline,
20356: 199:   TableOutline,
20357: 200:   ClockCircleOutline,
20358: 201:   CalendarOutline,
20359: 202:   ScheduleOutline,
20360: 203:   SafetyOutline,
20361: 204:   BellOutline,
20362: 205:   ExclamationCircleOutline,
20363: 206:   WarningOutline,
20364: 207:   MinusCircleOutline,
20365: 208:   ReloadOutline,
20366: 209:   SyncOutline,
20367: 210:   RedoOutline,
20368: 211:   UndoOutline,
20369: 212:   RotateLeftOutline,
20370: 213:   HomeOutline,
20371: 214:   MenuOutline,
20372: 215:   HistoryOutline,
20373: 216:   EyeOutline,
20374: 217:   EyeInvisibleOutline,
20375: 218:   MenuAppOutline,
20376: 219:   UserAddOutline,
20377: 220:   UserDeleteOutline,
20378: 221:   ContactsOutline,
20379: 222:   FileExcelOutline,
20380: 223:   FilePdfOutline,
20381: 224:   FileImageOutline,
20382: 225:   SendOutline,
20383: 226:   CommentOutline,
20384: 227:   FilterOutline,
20385: 228:   SortAscendingOutline,
20386: 229:   SortDescendingOutline,
20387: 230:   ClearOutline,
20388: 231:   BarChartOutline,
20389: 232:   LineChartOutline,
20390: 233:   AreaChartOutline,
20391: 234:   WifiOutline,
20392: 235:   DisconnectOutline,
20393: 236:   UnlockOutline,
20394: 237:   GroupOutline,
20395: 238:   HeartOutline,
20396: 239:   ThunderboltOutline,
20397: 240:   BugOutline,
20398: 241:   BulbOutline
20399: 242: ];
20400: ````
20401: 
20402: ## File: src/style-icons.ts
20403: ````typescript
20404:  1: // Custom icon static resources
20405:  2: 
20406:  3: import {
20407:  4:   BulbOutline,
20408:  5:   ExceptionOutline,
20409:  6:   InfoOutline,
20410:  7:   LinkOutline,
20411:  8:   MinusSquareOutline,
20412:  9:   PlusSquareOutline,
20413: 10:   ProfileOutline
20414: 11: } from '@ant-design/icons-angular/icons';
20415: 12: 
20416: 13: export const ICONS = [InfoOutline, BulbOutline, ProfileOutline, ExceptionOutline, LinkOutline, PlusSquareOutline, MinusSquareOutline];
20417: ````
20418: 
20419: ## File: src/typings.d.ts
20420: ````typescript
20421: 1: // # 3rd Party Library
20422: 2: // If the library doesn't have typings available at `@types/`,
20423: 3: // you can still use it by manually adding typings for it
20424: ````
20425: 
20426: ## File: src/app/core/infra/repositories/blueprint.repository.ts
20427: ````typescript
20428:   1: import { Injectable } from '@angular/core';
20429:   2: import { Observable } from 'rxjs';
20430:   3: import { map } from 'rxjs/operators';
20431:   4: import { BaseRepository, QueryOptions } from './base.repository';
20432:   5: import { Database } from '../types/database.types';
20433:   6: import { BlueprintStatus } from '../types/blueprint.types';
20434:   7: 
20435:   8: /**
20436:   9:  * Blueprint 实体类型（camelCase）
20437:  10:  * 从数据库类型中提取，后续会通过转换工具转换为 camelCase
20438:  11:  */
20439:  12: type BlueprintRow = Database['public']['Tables']['blueprints']['Row'];
20440:  13: type BlueprintInsert = Database['public']['Tables']['blueprints']['Insert'];
20441:  14: type BlueprintUpdate = Database['public']['Tables']['blueprints']['Update'];
20442:  15: 
20443:  16: /**
20444:  17:  * Blueprint 实体类型（camelCase）
20445:  18:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
20446:  19:  */
20447:  20: export type Blueprint = BlueprintRow;
20448:  21: export type { BlueprintInsert, BlueprintUpdate };
20449:  22: 
20450:  23: /**
20451:  24:  * Blueprint Repository
20452:  25:  * 
20453:  26:  * 提供蓝图相关的数据访问方法
20454:  27:  * 
20455:  28:  * @example
20456:  29:  * ```typescript
20457:  30:  * const blueprintRepo = inject(BlueprintRepository);
20458:  31:  * blueprintRepo.findByOwnerId('user-id').subscribe(blueprints => {
20459:  32:  *   console.log('User blueprints:', blueprints);
20460:  33:  * });
20461:  34:  * ```
20462:  35:  */
20463:  36: @Injectable({
20464:  37:   providedIn: 'root'
20465:  38: })
20466:  39: export class BlueprintRepository extends BaseRepository<Blueprint, BlueprintInsert, BlueprintUpdate> {
20467:  40:   protected tableName = 'blueprints';
20468:  41: 
20469:  42:   /**
20470:  43:    * 根据拥有者 ID 查询蓝图
20471:  44:    * 
20472:  45:    * @param ownerId 拥有者 ID
20473:  46:    * @param options 查询选项
20474:  47:    * @returns Observable<Blueprint[]>
20475:  48:    */
20476:  49:   findByOwnerId(ownerId: string, options?: QueryOptions): Observable<Blueprint[]> {
20477:  50:     return this.findAll({
20478:  51:       ...options,
20479:  52:       filters: {
20480:  53:         ...options?.filters,
20481:  54:         ownerId, // 会自动转换为 owner_id
20482:  55:       },
20483:  56:     });
20484:  57:   }
20485:  58: 
20486:  59:   /**
20487:  60:    * 根据状态查询蓝图
20488:  61:    * 
20489:  62:    * @param status 蓝图状态
20490:  63:    * @param options 查询选项
20491:  64:    * @returns Observable<Blueprint[]>
20492:  65:    */
20493:  66:   findByStatus(status: BlueprintStatus, options?: QueryOptions): Observable<Blueprint[]> {
20494:  67:     return this.findAll({
20495:  68:       ...options,
20496:  69:       filters: {
20497:  70:         ...options?.filters,
20498:  71:         status,
20499:  72:       },
20500:  73:     });
20501:  74:   }
20502:  75: 
20503:  76:   /**
20504:  77:    * 根据项目代码查询蓝图
20505:  78:    * 
20506:  79:    * @param projectCode 项目代码
20507:  80:    * @returns Observable<Blueprint | null>
20508:  81:    */
20509:  82:   findByProjectCode(projectCode: string): Observable<Blueprint | null> {
20510:  83:     return this.findAll({
20511:  84:       filters: {
20512:  85:         projectCode, // 会自动转换为 project_code
20513:  86:       },
20514:  87:     }).pipe(
20515:  88:       map(blueprints => blueprints.length > 0 ? blueprints[0] : null)
20516:  89:     );
20517:  90:   }
20518:  91: 
20519:  92:   /**
20520:  93:    * 查询活跃的蓝图（状态为 active）
20521:  94:    * 
20522:  95:    * @param options 查询选项
20523:  96:    * @returns Observable<Blueprint[]>
20524:  97:    */
20525:  98:   findActive(options?: QueryOptions): Observable<Blueprint[]> {
20526:  99:     return this.findByStatus(BlueprintStatus.ACTIVE, options);
20527: 100:   }
20528: 101: }
20529: ````
20530: 
20531: ## File: src/app/core/permissions/permission.service.ts
20532: ````typescript
20533:   1: import { Injectable, inject } from '@angular/core';
20534:   2: import { ACLService } from '@delon/acl';
20535:   3: import { DA_SERVICE_TOKEN } from '@delon/auth';
20536:   4: import { Observable, from, of, throwError, forkJoin } from 'rxjs';
20537:   5: import { map, switchMap, catchError, tap, shareReplay } from 'rxjs/operators';
20538:   6: 
20539:   7: import { SupabaseService } from '../supabase/supabase.service';
20540:   8: import { Permission, PermissionCacheItem } from './types';
20541:   9: 
20542:  10: /**
20543:  11:  * 权限检查服务
20544:  12:  * 
20545:  13:  * 整合 @delon/acl 和 Supabase 数据库，实现 RBAC 权限控制
20546:  14:  * 
20547:  15:  * 功能：
20548:  16:  * 1. 权限检查（can, canAny, canAll）
20549:  17:  * 2. Git-like 分支权限检查
20550:  18:  * 3. 权限缓存（内存缓存）
20551:  19:  * 4. 权限同步到 @delon/acl
20552:  20:  * 5. 权限检查日志记录（后续实现）
20553:  21:  * 
20554:  22:  * @example
20555:  23:  * ```typescript
20556:  24:  * const permissionService = inject(PermissionService);
20557:  25:  * permissionService.can('blueprint.read').subscribe(hasPermission => {
20558:  26:  *   if (!hasPermission) {
20559:  27:  *     throw new Error('Permission denied');
20560:  28:  *   }
20561:  29:  * });
20562:  30:  * ```
20563:  31:  */
20564:  32: @Injectable({
20565:  33:   providedIn: 'root'
20566:  34: })
20567:  35: export class PermissionService {
20568:  36:   private readonly aclService = inject(ACLService);
20569:  37:   private readonly supabaseService = inject(SupabaseService);
20570:  38:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
20571:  39: 
20572:  40:   /**
20573:  41:    * 权限缓存（内存缓存）
20574:  42:    * key: permission string, value: PermissionCacheItem
20575:  43:    */
20576:  44:   private readonly permissionCache = new Map<string, PermissionCacheItem>();
20577:  45: 
20578:  46:   /**
20579:  47:    * 缓存过期时间（毫秒），默认 5 分钟
20580:  48:    */
20581:  49:   private readonly CACHE_TTL = 5 * 60 * 1000;
20582:  50: 
20583:  51:   /**
20584:  52:    * 当前用户权限缓存（Observable）
20585:  53:    */
20586:  54:   private userPermissions$?: Observable<Permission[]>;
20587:  55: 
20588:  56:   /**
20589:  57:    * 获取当前用户 ID
20590:  58:    */
20591:  59:   private getCurrentUserId(): string | null {
20592:  60:     const token = this.tokenService.get();
20593:  61:     return token?.['user']?.id || null;
20594:  62:   }
20595:  63: 
20596:  64:   /**
20597:  65:    * 检查单个权限
20598:  66:    * 
20599:  67:    * @param permission 权限名称（如 'blueprint.read'）
20600:  68:    * @returns Observable<boolean> 是否有权限
20601:  69:    * @throws Error 如果权限检查失败（根据配置）
20602:  70:    */
20603:  71:   can(permission: string): Observable<boolean> {
20604:  72:     // 1. 检查本地 ACLService 缓存
20605:  73:     if (this.aclService.can(permission)) {
20606:  74:       return of(true);
20607:  75:     }
20608:  76: 
20609:  77:     // 2. 检查内存缓存
20610:  78:     const cached = this.permissionCache.get(permission);
20611:  79:     if (cached && cached.expiresAt > Date.now()) {
20612:  80:       return of(cached.hasPermission);
20613:  81:     }
20614:  82: 
20615:  83:     // 3. 查询数据库
20616:  84:     return this.checkDatabasePermission(permission).pipe(
20617:  85:       tap(hasPermission => {
20618:  86:         // 更新内存缓存
20619:  87:         this.permissionCache.set(permission, {
20620:  88:           permission,
20621:  89:           hasPermission,
20622:  90:           expiresAt: Date.now() + this.CACHE_TTL
20623:  91:         });
20624:  92:       }),
20625:  93:       catchError(error => {
20626:  94:         // 权限检查失败时抛出异常
20627:  95:         return throwError(() => new Error(`Permission check failed: ${permission} - ${error.message}`));
20628:  96:       })
20629:  97:     );
20630:  98:   }
20631:  99: 
20632: 100:   /**
20633: 101:    * 检查任一权限（OR 逻辑）
20634: 102:    * 
20635: 103:    * @param permissions 权限数组
20636: 104:    * @returns Observable<boolean> 是否有任一权限
20637: 105:    */
20638: 106:   canAny(permissions: string[]): Observable<boolean> {
20639: 107:     if (permissions.length === 0) {
20640: 108:       return of(false);
20641: 109:     }
20642: 110: 
20643: 111:     // 并行检查所有权限，任一为 true 即返回 true
20644: 112:     const checks = permissions.map(p => 
20645: 113:       this.can(p).pipe(
20646: 114:         catchError(() => of(false))
20647: 115:       )
20648: 116:     );
20649: 117: 
20650: 118:     return forkJoin(checks).pipe(
20651: 119:       map(results => results.some(r => r === true))
20652: 120:     );
20653: 121:   }
20654: 122: 
20655: 123:   /**
20656: 124:    * 检查所有权限（AND 逻辑）
20657: 125:    * 
20658: 126:    * @param permissions 权限数组
20659: 127:    * @returns Observable<boolean> 是否有所有权限
20660: 128:    */
20661: 129:   canAll(permissions: string[]): Observable<boolean> {
20662: 130:     if (permissions.length === 0) {
20663: 131:       return of(true);
20664: 132:     }
20665: 133: 
20666: 134:     // 并行检查所有权限，全部为 true 才返回 true
20667: 135:     const checks = permissions.map(p => 
20668: 136:       this.can(p).pipe(
20669: 137:         catchError(() => of(false))
20670: 138:       )
20671: 139:     );
20672: 140: 
20673: 141:     return forkJoin(checks).pipe(
20674: 142:       map(results => results.every(r => r === true))
20675: 143:     );
20676: 144:   }
20677: 145: 
20678: 146:   /**
20679: 147:    * 从数据库查询权限
20680: 148:    * 
20681: 149:    * @param permission 权限名称
20682: 150:    * @returns Observable<boolean>
20683: 151:    */
20684: 152:   private checkDatabasePermission(permission: string): Observable<boolean> {
20685: 153:     const userId = this.getCurrentUserId();
20686: 154:     if (!userId) {
20687: 155:       return of(false);
20688: 156:     }
20689: 157: 
20690: 158:     // 查询用户角色 -> 角色权限 -> 权限详情
20691: 159:     return from(
20692: 160:       this.supabaseService.client
20693: 161:         .from('user_roles')
20694: 162:         .select(`
20695: 163:           roles!inner(
20696: 164:             role_permissions!inner(
20697: 165:               permissions!inner(
20698: 166:                 name,
20699: 167:                 resource,
20700: 168:                 action
20701: 169:               )
20702: 170:             )
20703: 171:           )
20704: 172:         `)
20705: 173:         .eq('account_id', userId)
20706: 174:     ).pipe(
20707: 175:       map(({ data, error }) => {
20708: 176:         if (error) {
20709: 177:           throw new Error(`Database query failed: ${error.message}`);
20710: 178:         }
20711: 179: 
20712: 180:         if (!data || data.length === 0) {
20713: 181:           return false;
20714: 182:         }
20715: 183: 
20716: 184:         // 检查是否有匹配的权限
20717: 185:         for (const userRole of data) {
20718: 186:           const role = userRole.roles as any;
20719: 187:           if (role?.role_permissions) {
20720: 188:             for (const rolePerm of role.role_permissions) {
20721: 189:               const perm = rolePerm.permissions as Permission;
20722: 190:               if (perm.name === permission || `${perm.resource}.${perm.action}` === permission) {
20723: 191:                 return true;
20724: 192:               }
20725: 193:             }
20726: 194:           }
20727: 195:         }
20728: 196: 
20729: 197:         return false;
20730: 198:       }),
20731: 199:       tap(hasPermission => {
20732: 200:         // 如果权限存在，同步到 ACLService
20733: 201:         if (hasPermission) {
20734: 202:           this.syncPermissionToACL(permission);
20735: 203:         }
20736: 204:       })
20737: 205:     );
20738: 206:   }
20739: 207: 
20740: 208:   /**
20741: 209:    * 同步权限到 @delon/acl ACLService
20742: 210:    * 
20743: 211:    * @param permission 权限名称
20744: 212:    */
20745: 213:   private syncPermissionToACL(permission: string): void {
20746: 214:     // 解析权限格式：resource.action
20747: 215:     const parts = permission.split('.');
20748: 216:     if (parts.length === 2) {
20749: 217:       const currentData = this.aclService.data;
20750: 218:       const abilities = currentData.abilities || [];
20751: 219:       if (!abilities.includes(permission)) {
20752: 220:         // 使用 ACLService.set() 设置权限
20753: 221:         this.aclService.set({
20754: 222:           ...currentData,
20755: 223:           abilities: [...abilities, permission]
20756: 224:         });
20757: 225:       }
20758: 226:     }
20759: 227:   }
20760: 228: 
20761: 229:   /**
20762: 230:    * 检查蓝图访问权限
20763: 231:    * 
20764: 232:    * @param blueprintId 蓝图 ID
20765: 233:    * @param action 操作类型
20766: 234:    * @returns Observable<boolean>
20767: 235:    */
20768: 236:   canAccessBlueprint(blueprintId: string, action: 'read' | 'write' | 'admin'): Observable<boolean> {
20769: 237:     const userId = this.getCurrentUserId();
20770: 238:     if (!userId) {
20771: 239:       return of(false);
20772: 240:     }
20773: 241: 
20774: 242:     // 查询蓝图拥有者或用户角色
20775: 243:     return from(
20776: 244:       this.supabaseService.client
20777: 245:         .from('blueprints')
20778: 246:         .select('owner_id')
20779: 247:         .eq('id', blueprintId)
20780: 248:         .single()
20781: 249:     ).pipe(
20782: 250:       switchMap(({ data: blueprint, error: blueprintError }) => {
20783: 251:         if (blueprintError || !blueprint) {
20784: 252:           return of(false);
20785: 253:         }
20786: 254: 
20787: 255:         // 如果是拥有者，拥有所有权限
20788: 256:         if (blueprint.owner_id === userId) {
20789: 257:           return of(true);
20790: 258:         }
20791: 259: 
20792: 260:         // 检查用户角色权限
20793: 261:         return from(
20794: 262:           this.supabaseService.client
20795: 263:             .from('user_roles')
20796: 264:             .select('roles(code)')
20797: 265:             .eq('account_id', userId)
20798: 266:             .eq('blueprint_id', blueprintId)
20799: 267:         ).pipe(
20800: 268:           map(({ data: userRoles }) => {
20801: 269:             if (!userRoles || userRoles.length === 0) {
20802: 270:               return false;
20803: 271:             }
20804: 272: 
20805: 273:             // 根据角色代码判断权限
20806: 274:             const roleCodes = userRoles.map(ur => (ur.roles as any).code);
20807: 275:             
20808: 276:             switch (action) {
20809: 277:               case 'read':
20810: 278:                 return roleCodes.some(code => ['blueprint_owner', 'blueprint_admin', 'project_manager', 'viewer'].includes(code));
20811: 279:               case 'write':
20812: 280:                 return roleCodes.some(code => ['blueprint_owner', 'blueprint_admin', 'project_manager'].includes(code));
20813: 281:               case 'admin':
20814: 282:                 return roleCodes.some(code => ['blueprint_owner', 'blueprint_admin'].includes(code));
20815: 283:               default:
20816: 284:                 return false;
20817: 285:             }
20818: 286:           })
20819: 287:         );
20820: 288:       })
20821: 289:     );
20822: 290:   }
20823: 291: 
20824: 292:   /**
20825: 293:    * 检查分支访问权限
20826: 294:    * 
20827: 295:    * @param branchId 分支 ID
20828: 296:    * @param action 操作类型
20829: 297:    * @returns Observable<boolean>
20830: 298:    */
20831: 299:   canAccessBranch(branchId: string, action: 'read' | 'write' | 'admin'): Observable<boolean> {
20832: 300:     const userId = this.getCurrentUserId();
20833: 301:     if (!userId) {
20834: 302:       return of(false);
20835: 303:     }
20836: 304: 
20837: 305:     // 查询分支权限
20838: 306:     return from(
20839: 307:       this.supabaseService.client
20840: 308:         .from('branch_permissions')
20841: 309:         .select('permission_level, blueprint_branches(blueprint_id, blueprints(owner_id))')
20842: 310:         .eq('branch_id', branchId)
20843: 311:         .eq('account_id', userId)
20844: 312:         .single()
20845: 313:     ).pipe(
20846: 314:       switchMap(({ data: branchPerm, error }) => {
20847: 315:         // 如果没有分支权限，检查是否是蓝图拥有者
20848: 316:         if (error || !branchPerm) {
20849: 317:           return from(
20850: 318:             this.supabaseService.client
20851: 319:               .from('blueprint_branches')
20852: 320:               .select('blueprint_id, blueprints(owner_id)')
20853: 321:               .eq('id', branchId)
20854: 322:               .single()
20855: 323:           ).pipe(
20856: 324:             map(({ data: branch }) => {
20857: 325:               const blueprint = (branch as any)?.blueprints;
20858: 326:               return blueprint?.owner_id === userId;
20859: 327:             })
20860: 328:           );
20861: 329:         }
20862: 330: 
20863: 331:         const level = branchPerm.permission_level as 'owner' | 'admin' | 'write' | 'read';
20864: 332:         
20865: 333:         switch (action) {
20866: 334:           case 'read':
20867: 335:             return of(true); // 所有级别都可以读取
20868: 336:           case 'write':
20869: 337:             return of(['owner', 'admin', 'write'].includes(level));
20870: 338:           case 'admin':
20871: 339:             return of(['owner', 'admin'].includes(level));
20872: 340:           default:
20873: 341:             return of(false);
20874: 342:         }
20875: 343:       })
20876: 344:     );
20877: 345:   }
20878: 346: 
20879: 347:   /**
20880: 348:    * 检查是否可以修改任务结构（只有拥有者可以）
20881: 349:    * 
20882: 350:    * @param blueprintId 蓝图 ID
20883: 351:    * @returns Observable<boolean>
20884: 352:    */
20885: 353:   canModifyTaskStructure(blueprintId: string): Observable<boolean> {
20886: 354:     const userId = this.getCurrentUserId();
20887: 355:     if (!userId) {
20888: 356:       return of(false);
20889: 357:     }
20890: 358: 
20891: 359:     return from(
20892: 360:       this.supabaseService.client
20893: 361:         .from('blueprints')
20894: 362:         .select('owner_id')
20895: 363:         .eq('id', blueprintId)
20896: 364:         .single()
20897: 365:     ).pipe(
20898: 366:       map(({ data, error }) => {
20899: 367:         if (error || !data) {
20900: 368:           return false;
20901: 369:         }
20902: 370:         return data.owner_id === userId;
20903: 371:       })
20904: 372:     );
20905: 373:   }
20906: 374: 
20907: 375:   /**
20908: 376:    * 检查是否可以填写承攬欄位（协作组织可以）
20909: 377:    * 
20910: 378:    * @param branchId 分支 ID
20911: 379:    * @returns Observable<boolean>
20912: 380:    */
20913: 381:   canFillContractorFields(branchId: string): Observable<boolean> {
20914: 382:     const userId = this.getCurrentUserId();
20915: 383:     if (!userId) {
20916: 384:       return of(false);
20917: 385:     }
20918: 386: 
20919: 387:     // 检查是否是分支所属组织
20920: 388:     return from(
20921: 389:       this.supabaseService.client
20922: 390:         .from('blueprint_branches')
20923: 391:         .select('organization_id')
20924: 392:         .eq('id', branchId)
20925: 393:         .single()
20926: 394:     ).pipe(
20927: 395:       map(({ data, error }) => {
20928: 396:         if (error || !data) {
20929: 397:           return false;
20930: 398:         }
20931: 399:         return data.organization_id === userId;
20932: 400:       })
20933: 401:     );
20934: 402:   }
20935: 403: 
20936: 404:   /**
20937: 405:    * 检查是否可以审核 PR（只有拥有者可以）
20938: 406:    * 
20939: 407:    * @param blueprintId 蓝图 ID
20940: 408:    * @returns Observable<boolean>
20941: 409:    */
20942: 410:   canReviewPR(blueprintId: string): Observable<boolean> {
20943: 411:     return this.canModifyTaskStructure(blueprintId);
20944: 412:   }
20945: 413: 
20946: 414:   /**
20947: 415:    * 检查是否可以创建 PR（分支所属组织可以）
20948: 416:    * 
20949: 417:    * @param branchId 分支 ID
20950: 418:    * @returns Observable<boolean>
20951: 419:    */
20952: 420:   canCreatePR(branchId: string): Observable<boolean> {
20953: 421:     return this.canFillContractorFields(branchId);
20954: 422:   }
20955: 423: 
20956: 424:   /**
20957: 425:    * 从数据库同步用户角色到 ACLService
20958: 426:    * 
20959: 427:    * @param userId 用户 ID
20960: 428:    * @returns Promise<void>
20961: 429:    */
20962: 430:   async syncRolesFromDatabase(userId: string): Promise<void> {
20963: 431:     const { data: userRoles, error } = await this.supabaseService.client
20964: 432:       .from('user_roles')
20965: 433:       .select('roles(code, name)')
20966: 434:       .eq('account_id', userId);
20967: 435: 
20968: 436:     if (error) {
20969: 437:       throw new Error(`Failed to sync roles: ${error.message}`);
20970: 438:     }
20971: 439: 
20972: 440:     if (userRoles && userRoles.length > 0) {
20973: 441:       const roles = userRoles.map(ur => (ur.roles as any).code);
20974: 442:       this.aclService.set({ role: roles });
20975: 443:     }
20976: 444:   }
20977: 445: 
20978: 446:   /**
20979: 447:    * 加载用户所有权限
20980: 448:    * 
20981: 449:    * @param userId 用户 ID
20982: 450:    * @returns Observable<Permission[]>
20983: 451:    */
20984: 452:   loadUserPermissions(userId: string): Observable<Permission[]> {
20985: 453:     if (this.userPermissions$) {
20986: 454:       return this.userPermissions$;
20987: 455:     }
20988: 456: 
20989: 457:     this.userPermissions$ = from(
20990: 458:       this.supabaseService.client
20991: 459:         .from('user_roles')
20992: 460:         .select(`
20993: 461:           roles!inner(
20994: 462:             role_permissions!inner(
20995: 463:               permissions!inner(*)
20996: 464:             )
20997: 465:           )
20998: 466:         `)
20999: 467:         .eq('account_id', userId)
21000: 468:     ).pipe(
21001: 469:       map(({ data, error }) => {
21002: 470:         if (error) {
21003: 471:           throw new Error(`Failed to load permissions: ${error.message}`);
21004: 472:         }
21005: 473: 
21006: 474:         const permissions: Permission[] = [];
21007: 475:         if (data) {
21008: 476:           for (const userRole of data) {
21009: 477:             const role = userRole.roles as any;
21010: 478:             if (role?.role_permissions) {
21011: 479:               for (const rolePerm of role.role_permissions) {
21012: 480:                 const perm = rolePerm.permissions as Permission;
21013: 481:                 if (!permissions.find(p => p.id === perm.id)) {
21014: 482:                   permissions.push(perm);
21015: 483:                 }
21016: 484:               }
21017: 485:             }
21018: 486:           }
21019: 487:         }
21020: 488: 
21021: 489:         return permissions;
21022: 490:       }),
21023: 491:       tap(permissions => {
21024: 492:         // 同步权限到 ACLService
21025: 493:         const currentData = this.aclService.data;
21026: 494:         const abilities = permissions.map(p => `${p.resource}.${p.action}`);
21027: 495:         this.aclService.set({
21028: 496:           ...currentData,
21029: 497:           abilities: abilities
21030: 498:         });
21031: 499:       }),
21032: 500:       shareReplay(1)
21033: 501:     );
21034: 502: 
21035: 503:     return this.userPermissions$;
21036: 504:   }
21037: 505: 
21038: 506:   /**
21039: 507:    * 刷新当前用户权限
21040: 508:    * 
21041: 509:    * @returns Observable<void>
21042: 510:    */
21043: 511:   refreshPermissions(): Observable<void> {
21044: 512:     const userId = this.getCurrentUserId();
21045: 513:     if (!userId) {
21046: 514:       return of(undefined);
21047: 515:     }
21048: 516: 
21049: 517:     // 清除缓存
21050: 518:     this.permissionCache.clear();
21051: 519:     this.userPermissions$ = undefined;
21052: 520: 
21053: 521:     // 重新加载权限
21054: 522:     return this.loadUserPermissions(userId).pipe(
21055: 523:       switchMap(() => this.syncRolesFromDatabase(userId)),
21056: 524:       map(() => undefined),
21057: 525:       catchError(error => {
21058: 526:         return throwError(() => new Error(`Failed to refresh permissions: ${error.message}`));
21059: 527:       })
21060: 528:     );
21061: 529:   }
21062: 530: 
21063: 531:   /**
21064: 532:    * 清除权限缓存
21065: 533:    */
21066: 534:   clearCache(): void {
21067: 535:     this.permissionCache.clear();
21068: 536:     this.userPermissions$ = undefined;
21069: 537:   }
21070: 538: }
21071: ````
21072: 
21073: ## File: src/app/core/permissions/role.service.ts
21074: ````typescript
21075:   1: import { Injectable, inject } from '@angular/core';
21076:   2: import { DA_SERVICE_TOKEN } from '@delon/auth';
21077:   3: import { Observable, from, throwError } from 'rxjs';
21078:   4: import { map, switchMap, catchError } from 'rxjs/operators';
21079:   5: 
21080:   6: import { SupabaseService } from '../supabase/supabase.service';
21081:   7: import { PermissionService } from './permission.service';
21082:   8: import { Role, Permission, UserRole } from './types';
21083:   9: 
21084:  10: /**
21085:  11:  * 角色管理服务
21086:  12:  * 
21087:  13:  * 提供角色查询和管理功能
21088:  14:  * 
21089:  15:  * @example
21090:  16:  * ```typescript
21091:  17:  * const roleService = inject(RoleService);
21092:  18:  * roleService.getRoles().subscribe(roles => {
21093:  19:  *   console.log('All roles:', roles);
21094:  20:  * });
21095:  21:  * ```
21096:  22:  */
21097:  23: @Injectable({
21098:  24:   providedIn: 'root'
21099:  25: })
21100:  26: export class RoleService {
21101:  27:   private readonly supabaseService = inject(SupabaseService);
21102:  28:   private readonly permissionService = inject(PermissionService);
21103:  29:   private readonly tokenService = inject(DA_SERVICE_TOKEN);
21104:  30: 
21105:  31:   /**
21106:  32:    * 获取当前用户 ID
21107:  33:    */
21108:  34:   private getCurrentUserId(): string | null {
21109:  35:     const token = this.tokenService.get();
21110:  36:     return token?.['user']?.id || null;
21111:  37:   }
21112:  38: 
21113:  39:   /**
21114:  40:    * 获取所有角色
21115:  41:    * 
21116:  42:    * @returns Observable<Role[]>
21117:  43:    */
21118:  44:   getRoles(): Observable<Role[]> {
21119:  45:     return from(
21120:  46:       this.supabaseService.client
21121:  47:         .from('roles')
21122:  48:         .select('*')
21123:  49:         .order('priority', { ascending: false })
21124:  50:     ).pipe(
21125:  51:       map(({ data, error }) => {
21126:  52:         if (error) {
21127:  53:           throw new Error(`Failed to get roles: ${error.message}`);
21128:  54:         }
21129:  55:         return (data || []) as Role[];
21130:  56:       })
21131:  57:     );
21132:  58:   }
21133:  59: 
21134:  60:   /**
21135:  61:    * 获取用户角色
21136:  62:    * 
21137:  63:    * @param userId 用户 ID
21138:  64:    * @returns Observable<Role[]>
21139:  65:    */
21140:  66:   getUserRoles(userId: string): Observable<Role[]> {
21141:  67:     return from(
21142:  68:       this.supabaseService.client
21143:  69:         .from('user_roles')
21144:  70:         .select('roles(*)')
21145:  71:         .eq('account_id', userId)
21146:  72:     ).pipe(
21147:  73:       map(({ data, error }) => {
21148:  74:         if (error) {
21149:  75:           throw new Error(`Failed to get user roles: ${error.message}`);
21150:  76:         }
21151:  77:         return (data || []).map((ur: any) => ur.roles as Role);
21152:  78:       })
21153:  79:     );
21154:  80:   }
21155:  81: 
21156:  82:   /**
21157:  83:    * 获取角色权限
21158:  84:    * 
21159:  85:    * @param roleId 角色 ID
21160:  86:    * @returns Observable<Permission[]>
21161:  87:    */
21162:  88:   getRolePermissions(roleId: string): Observable<Permission[]> {
21163:  89:     return from(
21164:  90:       this.supabaseService.client
21165:  91:         .from('role_permissions')
21166:  92:         .select('permissions(*)')
21167:  93:         .eq('role_id', roleId)
21168:  94:     ).pipe(
21169:  95:       map(({ data, error }) => {
21170:  96:         if (error) {
21171:  97:           throw new Error(`Failed to get role permissions: ${error.message}`);
21172:  98:         }
21173:  99:         return (data || []).map((rp: any) => rp.permissions as Permission);
21174: 100:       })
21175: 101:     );
21176: 102:   }
21177: 103: 
21178: 104:   /**
21179: 105:    * 根据 ID 获取角色
21180: 106:    * 
21181: 107:    * @param roleId 角色 ID
21182: 108:    * @returns Observable<Role | null>
21183: 109:    */
21184: 110:   getRoleById(roleId: string): Observable<Role | null> {
21185: 111:     return from(
21186: 112:       this.supabaseService.client
21187: 113:         .from('roles')
21188: 114:         .select('*')
21189: 115:         .eq('id', roleId)
21190: 116:         .single()
21191: 117:     ).pipe(
21192: 118:       map(({ data, error }) => {
21193: 119:         if (error) {
21194: 120:           if (error.code === 'PGRST116') {
21195: 121:             return null; // 未找到
21196: 122:           }
21197: 123:           throw new Error(`Failed to get role: ${error.message}`);
21198: 124:         }
21199: 125:         return data as Role;
21200: 126:       })
21201: 127:     );
21202: 128:   }
21203: 129: 
21204: 130:   /**
21205: 131:    * 分配角色给用户
21206: 132:    * 
21207: 133:    * 需要权限：role.assign
21208: 134:    * 
21209: 135:    * @param userId 用户 ID
21210: 136:    * @param roleId 角色 ID
21211: 137:    * @param scope 作用域（可选）
21212: 138:    * @returns Observable<void>
21213: 139:    * @throws Error 如果权限不足
21214: 140:    */
21215: 141:   assignRole(
21216: 142:     userId: string,
21217: 143:     roleId: string,
21218: 144:     scope?: { blueprintId?: string; branchId?: string }
21219: 145:   ): Observable<void> {
21220: 146:     const currentUserId = this.getCurrentUserId();
21221: 147:     if (!currentUserId) {
21222: 148:       return throwError(() => new Error('User not authenticated'));
21223: 149:     }
21224: 150: 
21225: 151:     // 先验证权限
21226: 152:     return this.permissionService.can('role.assign').pipe(
21227: 153:       switchMap(hasPermission => {
21228: 154:         if (!hasPermission) {
21229: 155:           return throwError(() => new Error('Permission denied: role.assign'));
21230: 156:         }
21231: 157: 
21232: 158:         return from(
21233: 159:           this.supabaseService.client
21234: 160:             .from('user_roles')
21235: 161:             .insert({
21236: 162:               account_id: userId,
21237: 163:               role_id: roleId,
21238: 164:               blueprint_id: scope?.blueprintId || null,
21239: 165:               branch_id: scope?.branchId || null,
21240: 166:               granted_by: currentUserId
21241: 167:             })
21242: 168:         ).pipe(
21243: 169:           map(({ error }) => {
21244: 170:             if (error) {
21245: 171:               throw new Error(`Failed to assign role: ${error.message}`);
21246: 172:             }
21247: 173:           })
21248: 174:         );
21249: 175:       })
21250: 176:     );
21251: 177:   }
21252: 178: 
21253: 179:   /**
21254: 180:    * 移除用户角色
21255: 181:    * 
21256: 182:    * 需要权限：role.remove
21257: 183:    * 
21258: 184:    * @param userId 用户 ID
21259: 185:    * @param roleId 角色 ID
21260: 186:    * @param scope 作用域（可选）
21261: 187:    * @returns Observable<void>
21262: 188:    * @throws Error 如果权限不足
21263: 189:    */
21264: 190:   removeRole(
21265: 191:     userId: string,
21266: 192:     roleId: string,
21267: 193:     scope?: { blueprintId?: string; branchId?: string }
21268: 194:   ): Observable<void> {
21269: 195:     const currentUserId = this.getCurrentUserId();
21270: 196:     if (!currentUserId) {
21271: 197:       return throwError(() => new Error('User not authenticated'));
21272: 198:     }
21273: 199: 
21274: 200:     // 先验证权限
21275: 201:     return this.permissionService.can('role.remove').pipe(
21276: 202:       switchMap(hasPermission => {
21277: 203:         if (!hasPermission) {
21278: 204:           return throwError(() => new Error('Permission denied: role.remove'));
21279: 205:         }
21280: 206: 
21281: 207:         let query = this.supabaseService.client
21282: 208:           .from('user_roles')
21283: 209:           .delete()
21284: 210:           .eq('account_id', userId)
21285: 211:           .eq('role_id', roleId);
21286: 212: 
21287: 213:         if (scope?.blueprintId) {
21288: 214:           query = query.eq('blueprint_id', scope.blueprintId);
21289: 215:         }
21290: 216:         if (scope?.branchId) {
21291: 217:           query = query.eq('branch_id', scope.branchId);
21292: 218:         }
21293: 219: 
21294: 220:         return from(query).pipe(
21295: 221:           map(({ error }) => {
21296: 222:             if (error) {
21297: 223:               throw new Error(`Failed to remove role: ${error.message}`);
21298: 224:             }
21299: 225:           })
21300: 226:         );
21301: 227:       })
21302: 228:     );
21303: 229:   }
21304: 230: 
21305: 231:   /**
21306: 232:    * 更新角色
21307: 233:    * 
21308: 234:    * 需要权限：role.update
21309: 235:    * 
21310: 236:    * @param roleId 角色 ID
21311: 237:    * @param data 更新数据
21312: 238:    * @returns Observable<void>
21313: 239:    * @throws Error 如果权限不足
21314: 240:    */
21315: 241:   updateRole(roleId: string, data: Partial<Role>): Observable<void> {
21316: 242:     const currentUserId = this.getCurrentUserId();
21317: 243:     if (!currentUserId) {
21318: 244:       return throwError(() => new Error('User not authenticated'));
21319: 245:     }
21320: 246: 
21321: 247:     // 先验证权限
21322: 248:     return this.permissionService.can('role.update').pipe(
21323: 249:       switchMap(hasPermission => {
21324: 250:         if (!hasPermission) {
21325: 251:           return throwError(() => new Error('Permission denied: role.update'));
21326: 252:         }
21327: 253: 
21328: 254:         return from(
21329: 255:           this.supabaseService.client
21330: 256:             .from('roles')
21331: 257:             .update(data)
21332: 258:             .eq('id', roleId)
21333: 259:         ).pipe(
21334: 260:           map(({ error }) => {
21335: 261:             if (error) {
21336: 262:               throw new Error(`Failed to update role: ${error.message}`);
21337: 263:             }
21338: 264:           })
21339: 265:         );
21340: 266:       })
21341: 267:     );
21342: 268:   }
21343: 269: 
21344: 270:   /**
21345: 271:    * 分配权限给角色
21346: 272:    * 
21347: 273:    * 需要权限：role.permission.assign
21348: 274:    * 
21349: 275:    * @param roleId 角色 ID
21350: 276:    * @param permissionId 权限 ID
21351: 277:    * @returns Observable<void>
21352: 278:    * @throws Error 如果权限不足
21353: 279:    */
21354: 280:   assignPermissionToRole(roleId: string, permissionId: string): Observable<void> {
21355: 281:     const currentUserId = this.getCurrentUserId();
21356: 282:     if (!currentUserId) {
21357: 283:       return throwError(() => new Error('User not authenticated'));
21358: 284:     }
21359: 285: 
21360: 286:     // 先验证权限
21361: 287:     return this.permissionService.can('role.permission.assign').pipe(
21362: 288:       switchMap(hasPermission => {
21363: 289:         if (!hasPermission) {
21364: 290:           return throwError(() => new Error('Permission denied: role.permission.assign'));
21365: 291:         }
21366: 292: 
21367: 293:         return from(
21368: 294:           this.supabaseService.client
21369: 295:             .from('role_permissions')
21370: 296:             .insert({
21371: 297:               role_id: roleId,
21372: 298:               permission_id: permissionId
21373: 299:             })
21374: 300:         ).pipe(
21375: 301:           map(({ error }) => {
21376: 302:             if (error) {
21377: 303:               throw new Error(`Failed to assign permission: ${error.message}`);
21378: 304:             }
21379: 305:           })
21380: 306:         );
21381: 307:       })
21382: 308:     );
21383: 309:   }
21384: 310: 
21385: 311:   /**
21386: 312:    * 移除角色权限
21387: 313:    * 
21388: 314:    * 需要权限：role.permission.remove
21389: 315:    * 
21390: 316:    * @param roleId 角色 ID
21391: 317:    * @param permissionId 权限 ID
21392: 318:    * @returns Observable<void>
21393: 319:    * @throws Error 如果权限不足
21394: 320:    */
21395: 321:   removePermissionFromRole(roleId: string, permissionId: string): Observable<void> {
21396: 322:     const currentUserId = this.getCurrentUserId();
21397: 323:     if (!currentUserId) {
21398: 324:       return throwError(() => new Error('User not authenticated'));
21399: 325:     }
21400: 326: 
21401: 327:     // 先验证权限
21402: 328:     return this.permissionService.can('role.permission.remove').pipe(
21403: 329:       switchMap(hasPermission => {
21404: 330:         if (!hasPermission) {
21405: 331:           return throwError(() => new Error('Permission denied: role.permission.remove'));
21406: 332:         }
21407: 333: 
21408: 334:         return from(
21409: 335:           this.supabaseService.client
21410: 336:             .from('role_permissions')
21411: 337:             .delete()
21412: 338:             .eq('role_id', roleId)
21413: 339:             .eq('permission_id', permissionId)
21414: 340:         ).pipe(
21415: 341:           map(({ error }) => {
21416: 342:             if (error) {
21417: 343:               throw new Error(`Failed to remove permission: ${error.message}`);
21418: 344:             }
21419: 345:           })
21420: 346:         );
21421: 347:       })
21422: 348:     );
21423: 349:   }
21424: 350: }
21425: ````
21426: 
21427: ## File: src/app/routes/blueprints/routes.ts
21428: ````typescript
21429:  1: import { Routes } from '@angular/router';
21430:  2: 
21431:  3: export const BLUEPRINT_ROUTES: Routes = [
21432:  4:   {
21433:  5:     path: '',
21434:  6:     redirectTo: 'list',
21435:  7:     pathMatch: 'full'
21436:  8:   },
21437:  9:   {
21438: 10:     path: 'list',
21439: 11:     loadComponent: () =>
21440: 12:       import('./list/blueprint-list.component').then(m => m.BlueprintListComponent)
21441: 13:   },
21442: 14:   {
21443: 15:     path: 'create',
21444: 16:     loadComponent: () => import('./form/blueprint-form.component').then(m => m.BlueprintFormComponent)
21445: 17:   },
21446: 18:   {
21447: 19:     path: ':id',
21448: 20:     loadComponent: () => import('./detail/blueprint-detail.component').then(m => m.BlueprintDetailComponent)
21449: 21:   },
21450: 22:   {
21451: 23:     path: ':id/edit',
21452: 24:     loadComponent: () => import('./form/blueprint-form.component').then(m => m.BlueprintFormComponent)
21453: 25:   },
21454: 26:   {
21455: 27:     path: ':id/branches',
21456: 28:     loadComponent: () => import('./branches/branch-management.component').then(m => m.BranchManagementComponent)
21457: 29:   },
21458: 30:   {
21459: 31:     path: ':id/pull-requests',
21460: 32:     loadComponent: () => import('./pull-requests/pull-request-list.component').then(m => m.PullRequestListComponent)
21461: 33:   },
21462: 34:   {
21463: 35:     path: ':id/settings',
21464: 36:     loadComponent: () => import('./settings/blueprint-settings.component').then(m => m.BlueprintSettingsComponent)
21465: 37:   },
21466: 38:   {
21467: 39:     path: ':id/fork',
21468: 40:     loadComponent: () => import('./fork/blueprint-fork.component').then(m => m.BlueprintForkComponent)
21469: 41:   },
21470: 42:   {
21471: 43:     path: ':id/pull-requests/:prId/review',
21472: 44:     loadComponent: () => import('./review/pr-review.component').then(m => m.PrReviewComponent)
21473: 45:   }
21474: 46: ];
21475: ````
21476: 
21477: ## File: src/app/shared/models/account/index.ts
21478: ````typescript
21479:  1: /**
21480:  2:  * 账户与身份系统模型导出
21481:  3:  * 
21482:  4:  * 对应数据库表：
21483:  5:  * - accounts (账户主表)
21484:  6:  * - teams (团队表)
21485:  7:  * - team_members (团队成员表)
21486:  8:  * - organization_schedules (组织排班表)
21487:  9:  * 
21488: 10:  * @module shared/models/account
21489: 11:  */
21490: 12: 
21491: 13: export * from './types';
21492: ````
21493: 
21494: ## File: src/app/shared/shared-imports.ts
21495: ````typescript
21496:  1: // Angular Common 管道與指令 — https://angular.dev/guide/pipes
21497:  2: import {
21498:  3:   AsyncPipe,
21499:  4:   CurrencyPipe,
21500:  5:   DatePipe,
21501:  6:   DecimalPipe,
21502:  7:   I18nPluralPipe,
21503:  8:   I18nSelectPipe,
21504:  9:   JsonPipe,
21505: 10:   KeyValuePipe,
21506: 11:   LowerCasePipe,
21507: 12:   NgClass,
21508: 13:   NgComponentOutlet,
21509: 14:   NgStyle,
21510: 15:   NgTemplateOutlet,
21511: 16:   PercentPipe,
21512: 17:   SlicePipe,
21513: 18:   TitleCasePipe,
21514: 19:   UpperCasePipe
21515: 20: } from '@angular/common';
21516: 21: // 表單模組（模板式 / 響應式） — https://angular.dev/guide/forms
21517: 22: import { FormsModule, ReactiveFormsModule } from '@angular/forms';
21518: 23: // 路由（RouterLink/RouterOutlet） — https://angular.dev/guide/routing
21519: 24: import { RouterOutlet, RouterLink } from '@angular/router';
21520: 25: // @delon/theme 管道（I18n/Date） — https://ng-alain.com/theme
21521: 26: // 注意：@delon/theme 的 DatePipe 在模板中使用 `_date` pipe，Angular Common 的 DatePipe 使用 `date` pipe
21522: 27: import { DatePipe as DelonDatePipe, I18nPipe } from '@delon/theme';
21523: 28: 
21524: 29: import { SHARED_DELON_MODULES } from './shared-delon.module';
21525: 30: import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
21526: 31: 
21527: 32: export const SHARED_IMPORTS = [
21528: 33:   // ========== Angular 表單模組 ==========
21529: 34:   FormsModule, // 模板式表單 — https://angular.dev/guide/forms#template-driven-forms
21530: 35:   ReactiveFormsModule, // 響應式表單 — https://angular.dev/guide/forms#reactive-forms
21531: 36: 
21532: 37:   // ========== Angular 路由 ==========
21533: 38:   RouterLink, // 路由連結指令 — https://angular.dev/guide/routing#routerlink
21534: 39:   RouterOutlet, // 路由插座 — https://angular.dev/guide/routing#routeroutlet
21535: 40:   NgTemplateOutlet, // 動態嵌入模板 — https://angular.dev/api/common/NgTemplateOutlet
21536: 41:   NgComponentOutlet, // 動態組件嵌入 — https://angular.dev/api/common/NgComponentOutlet
21537: 42: 
21538: 43:   // ========== Angular Common 標準管道 ==========
21539: 44:   DatePipe, // 日期格式化（模板使用: `{{ value | date }}`） — https://angular.dev/api/common/DatePipe
21540: 45:   CurrencyPipe, // 貨幣格式化（模板使用: `{{ value | currency }}`） — https://angular.dev/api/common/CurrencyPipe
21541: 46:   DecimalPipe, // 數字格式化（模板使用: `{{ value | number }}`） — https://angular.dev/api/common/DecimalPipe
21542: 47:   PercentPipe, // 百分比格式化（模板使用: `{{ value | percent }}`） — https://angular.dev/api/common/PercentPipe
21543: 48:   LowerCasePipe, // 轉小寫（模板使用: `{{ value | lowercase }}`） — https://angular.dev/api/common/LowerCasePipe
21544: 49:   UpperCasePipe, // 轉大寫（模板使用: `{{ value | uppercase }}`） — https://angular.dev/api/common/UpperCasePipe
21545: 50:   TitleCasePipe, // 標題大小寫（模板使用: `{{ value | titlecase }}`） — https://angular.dev/api/common/TitleCasePipe
21546: 51:   SlicePipe, // 陣列/字串切片（模板使用: `{{ value | slice:start:end }}`） — https://angular.dev/api/common/SlicePipe
21547: 52:   KeyValuePipe, // 鍵值對遍歷（模板使用: `@for (item of obj | keyvalue)`） — https://angular.dev/api/common/KeyValuePipe
21548: 53:   JsonPipe, // 物件轉 JSON 字串（模板使用: `{{ value | json }}`） — https://angular.dev/api/common/JsonPipe
21549: 54:   AsyncPipe, // 觀察值/Promise 非同步解包（模板使用: `{{ value$ | async }}`） — https://angular.dev/api/common/AsyncPipe
21550: 55:   I18nPluralPipe, // 複數形式映射（模板使用: `{{ count | i18nPlural:mapping }}`） — https://angular.dev/api/common/I18nPluralPipe
21551: 56:   I18nSelectPipe, // 鍵值映射選擇（模板使用: `{{ value | i18nSelect:mapping }}`） — https://angular.dev/api/common/I18nSelectPipe
21552: 57:   NgClass, // 動態 CSS 類（模板使用: `[ngClass]="..."`） — https://angular.dev/api/common/NgClass
21553: 58:   NgStyle, // 動態內聯樣式（模板使用: `[ngStyle]="..."`） — https://angular.dev/api/common/NgStyle
21554: 59: 
21555: 60:   // ========== @delon/theme 管道 ==========
21556: 61:   I18nPipe, // 國際化翻譯管道（模板使用: `{{ key | i18n }}`） — https://ng-alain.com/theme
21557: 62:   DelonDatePipe, // @delon/theme 日期管道（模板使用: `{{ value | _date }}`） — https://ng-alain.com/theme
21558: 63: 
21559: 64:   // ========== @delon 組件/指令集合 ==========
21560: 65:   // https://ng-alain.com/components
21561: 66:   ...SHARED_DELON_MODULES,
21562: 67: 
21563: 68:   // ========== ng-zorro-antd 組件集合 ==========
21564: 69:   // https://ng.ant.design/components/overview/zh
21565: 70:   ...SHARED_ZORRO_MODULES
21566: 71: ];
21567: ````
21568: 
21569: ## File: src/app/core/index.ts
21570: ````typescript
21571: 1: export * from './i18n/i18n.service';
21572: 2: export * from './net/index';
21573: 3: export * from './startup/startup.service';
21574: 4: export * from './start-page.guard';
21575: 5: export * from './supabase';
21576: 6: export * from './permissions';
21577: 7: export * from './infra';
21578: ````
21579: 
21580: ## File: src/app/core/startup/startup.service.ts
21581: ````typescript
21582:  1: import { HttpClient } from '@angular/common/http';
21583:  2: import { EnvironmentProviders, Injectable, Provider, inject, provideAppInitializer } from '@angular/core';
21584:  3: import { Router } from '@angular/router';
21585:  4: import { ACLService } from '@delon/acl';
21586:  5: import { DA_SERVICE_TOKEN } from '@delon/auth';
21587:  6: import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
21588:  7: import { NzSafeAny } from 'ng-zorro-antd/core/types';
21589:  8: import { Observable, zip, catchError, map, switchMap, of, from } from 'rxjs';
21590:  9: 
21591: 10: import { I18NService } from '../i18n/i18n.service';
21592: 11: import { PermissionService } from '../permissions/permission.service';
21593: 12: import { SupabaseAuthAdapterService } from '../supabase';
21594: 13: 
21595: 14: /**
21596: 15:  * Used for application startup
21597: 16:  * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
21598: 17:  */
21599: 18: export function provideStartup(): Array<Provider | EnvironmentProviders> {
21600: 19:   return [
21601: 20:     StartupService,
21602: 21:     provideAppInitializer(() => {
21603: 22:       const initializerFn = (
21604: 23:         (startupService: StartupService) => () =>
21605: 24:           startupService.load()
21606: 25:       )(inject(StartupService));
21607: 26:       return initializerFn();
21608: 27:     })
21609: 28:   ];
21610: 29: }
21611: 30: 
21612: 31: @Injectable()
21613: 32: export class StartupService {
21614: 33:   private menuService = inject(MenuService);
21615: 34:   private settingService = inject(SettingsService);
21616: 35:   private aclService = inject(ACLService);
21617: 36:   private titleService = inject(TitleService);
21618: 37:   private httpClient = inject(HttpClient);
21619: 38:   private router = inject(Router);
21620: 39:   private i18n = inject<I18NService>(ALAIN_I18N_TOKEN);
21621: 40:   private supabaseAuthAdapter = inject(SupabaseAuthAdapterService);
21622: 41:   private permissionService = inject(PermissionService);
21623: 42:   private tokenService = inject(DA_SERVICE_TOKEN);
21624: 43: 
21625: 44:   load(): Observable<void> {
21626: 45:     const defaultLang = this.i18n.defaultLang;
21627: 46:     
21628: 47:     // 先恢復 Supabase Session（如果存在），然後執行原有的啟動邏輯
21629: 48:     return this.supabaseAuthAdapter.restoreSession().pipe(
21630: 49:       switchMap(() => {
21631: 50:         // 同步用户权限（如果已登录）
21632: 51:         const currentUser = this.tokenService.get()?.['user'];
21633: 52:         const syncPermissions$ = currentUser?.id
21634: 53:           ? from(this.permissionService.syncRolesFromDatabase(currentUser.id)).pipe(
21635: 54:               catchError(error => {
21636: 55:                 console.warn('Failed to sync permissions:', error);
21637: 56:                 return of(undefined);
21638: 57:               })
21639: 58:             )
21640: 59:           : of(undefined);
21641: 60: 
21642: 61:         return syncPermissions$.pipe(
21643: 62:           switchMap(() => {
21644: 63:             // If http request allows anonymous access, you need to add `ALLOW_ANONYMOUS`:
21645: 64:             // this.httpClient.get('/app', { context: new HttpContext().set(ALLOW_ANONYMOUS, this.tokenService.get()?.token ? false : true) })
21646: 65:             return zip(this.i18n.loadLangData(defaultLang), this.httpClient.get('./assets/tmp/app-data.json')).pipe(
21647: 66:               // 接收其他拦截器后产生的异常消息
21648: 67:               catchError(res => {
21649: 68:                 console.warn(`StartupService.load: Network request failed`, res);
21650: 69:                 setTimeout(() => this.router.navigateByUrl(`/exception/500`));
21651: 70:                 return [];
21652: 71:               }),
21653: 72:               map(([langData, appData]: [Record<string, string>, NzSafeAny]) => {
21654: 73:                 // setting language data
21655: 74:                 this.i18n.use(defaultLang, langData);
21656: 75: 
21657: 76:                 // 应用信息：包括站点名、描述、年份
21658: 77:                 this.settingService.setApp(appData.app);
21659: 78:                 // 用户信息：包括姓名、头像、邮箱地址
21660: 79:                 this.settingService.setUser(appData.user);
21661: 80:                 // ACL：如果用户已登录，权限已通过 PermissionService 同步
21662: 81:                 // 如果未登录，设置为全量（开发模式）
21663: 82:                 if (!currentUser?.id) {
21664: 83:                   this.aclService.setFull(true);
21665: 84:                 }
21666: 85:                 // 初始化菜单
21667: 86:                 this.menuService.add(appData.menu);
21668: 87:                 // 设置页面标题的后缀
21669: 88:                 this.titleService.default = '';
21670: 89:                 this.titleService.suffix = appData.app.name;
21671: 90:               })
21672: 91:             );
21673: 92:           })
21674: 93:         );
21675: 94:       })
21676: 95:     );
21677: 96:   }
21678: 97: }
21679: ````
21680: 
21681: ## File: src/app/routes/accounts/routes.ts
21682: ````typescript
21683:  1: import { Routes } from '@angular/router';
21684:  2: import { AccountListComponent } from './list/account-list.component';
21685:  3: import { AccountDetailComponent } from './detail/account-detail.component';
21686:  4: import { AccountFormComponent } from './form/account-form.component';
21687:  5: import { TeamListComponent } from './teams/team-list.component';
21688:  6: import { TeamDetailComponent } from './teams/team-detail/team-detail.component';
21689:  7: import { ScheduleListComponent } from './schedules/schedule-list.component';
21690:  8: import { UserListComponent } from './users/user-list.component';
21691:  9: import { OrganizationListComponent } from './organizations/organization-list.component';
21692: 10: import { BotListComponent } from './bots/bot-list.component';
21693: 11: 
21694: 12: export const routes: Routes = [
21695: 13:   { path: '', redirectTo: 'list', pathMatch: 'full' },
21696: 14:   { path: 'list', component: AccountListComponent },
21697: 15:   { path: 'create', component: AccountFormComponent },
21698: 16:   { path: ':id', component: AccountDetailComponent },
21699: 17:   { path: ':id/edit', component: AccountFormComponent },
21700: 18:   { path: 'teams', component: TeamListComponent },
21701: 19:   { path: 'teams/:id', component: TeamDetailComponent },
21702: 20:   { path: 'schedules', component: ScheduleListComponent },
21703: 21:   { path: 'users', component: UserListComponent },
21704: 22:   { path: 'organizations', component: OrganizationListComponent },
21705: 23:   { path: 'bots', component: BotListComponent }
21706: 24: ];
21707: ````
21708: 
21709: ## File: src/app/shared/index.ts
21710: ````typescript
21711:  1: // Components
21712:  2: 
21713:  3: // Utils
21714:  4: export * from './utils/yuan';
21715:  5: 
21716:  6: // Models
21717:  7: export * from './models';
21718:  8: 
21719:  9: // Services
21720: 10: export * from './services';
21721: 11: 
21722: 12: // Module
21723: 13: export * from './shared-imports';
21724: 14: export * from './json-schema/index';
21725: 15: export * from './st-widget/index';
21726: 16: export * from './cell-widget/index';
21727: ````
21728: 
21729: ## File: src/app/shared/services/account/index.ts
21730: ````typescript
21731:  1: /**
21732:  2:  * 账户服务导出
21733:  3:  * 
21734:  4:  * 提供账户和团队管理的服务：
21735:  5:  * - AccountService: 账户 CRUD 操作
21736:  6:  * - TeamService: 团队 CRUD 操作和成员管理
21737:  7:  * - OrganizationScheduleService: 组织排班管理
21738:  8:  * 
21739:  9:  * @module shared/services/account
21740: 10:  */
21741: 11: 
21742: 12: export * from './account.service';
21743: 13: export * from './team.service';
21744: 14: export * from './organization-schedule.service';
21745: ````
21746: 
21747: ## File: src/app/core/infra/repositories/index.ts
21748: ````typescript
21749:  1: /**
21750:  2:  * Repository 模块导出
21751:  3:  */
21752:  4: export * from './base.repository';
21753:  5: export * from './blueprint.repository';
21754:  6: export * from './blueprint-config.repository';
21755:  7: export * from './blueprint-branch.repository';
21756:  8: export * from './branch-fork.repository';
21757:  9: export * from './pull-request.repository';
21758: 10: export * from './account.repository';
21759: 11: export * from './team.repository';
21760: 12: export * from './team-member.repository';
21761: 13: export * from './organization-schedule.repository';
21762: 14: export * from './organization-collaboration.repository';
21763: 15: export * from './collaboration-invitation.repository';
21764: 16: export * from './collaboration-member.repository';
21765: ````
21766: 
21767: ## File: src/app/core/infra/types/index.ts
21768: ````typescript
21769: 1: /**
21770: 2:  * 类型定义模块导出
21771: 3:  */
21772: 4: export * from './database.types';
21773: 5: export * from './account.types';
21774: 6: export * from './collaboration.types';
21775: 7: export * from './blueprint.types';
21776: ````
21777: 
21778: ## File: src/app/shared/models/index.ts
21779: ````typescript
21780:  1: /**
21781:  2:  * 数据模型统一导出
21782:  3:  * 
21783:  4:  * 按 11 个业务模块分类：
21784:  5:  * - account: 账户与身份系统（4 张表）
21785:  6:  * - collaboration: 组织协作系统（3 张表）
21786:  7:  * - permission: 权限系统（5 张表）
21787:  8:  * - blueprint: 蓝图/专案系统（5 张表）
21788:  9:  * - task: 任务执行系统（9 张表）
21789: 10:  * - quality: 品质验收系统（4 张表）
21790: 11:  * - issue: 问题追踪系统（4 张表）
21791: 12:  * - communication: 协作沟通系统（6 张表）
21792: 13:  * - data: 资料分析系统（6 张表）
21793: 14:  * - bot: 机器人系统（3 张表）
21794: 15:  * - system: 系统管理（2 张表）
21795: 16:  * 
21796: 17:  * @module shared/models
21797: 18:  */
21798: 19: 
21799: 20: // 按模块导出
21800: 21: export * from './account';
21801: 22: export * from './collaboration';
21802: 23: export * from './blueprint';
21803: ````
21804: 
21805: ## File: src/app/shared/services/index.ts
21806: ````typescript
21807:  1: /**
21808:  2:  * 共享服务统一导出
21809:  3:  * 
21810:  4:  * 按业务模块分类的服务：
21811:  5:  * - account: 账户服务
21812:  6:  * - repository: Repository 模式服务（规划中）
21813:  7:  * - storage: Storage 服务（规划中）
21814:  8:  * 
21815:  9:  * @module shared/services
21816: 10:  */
21817: 11: 
21818: 12: // 按模块导出
21819: 13: export * from './account';
21820: 14: export * from './collaboration';
21821: 15: export * from './blueprint';
21822: ````
21823: 
21824: ## File: src/app/routes/routes.ts
21825: ````typescript
21826:  1: import { Routes } from '@angular/router';
21827:  2: import { startPageGuard } from '@core';
21828:  3: import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';
21829:  4: 
21830:  5: import { LayoutBasicComponent, LayoutBlankComponent } from '../layout';
21831:  6: 
21832:  7: export const routes: Routes = [
21833:  8:   {
21834:  9:     path: '',
21835: 10:     component: LayoutBasicComponent,
21836: 11:     canActivate: [startPageGuard, authSimpleCanActivate],
21837: 12:     canActivateChild: [authSimpleCanActivateChild],
21838: 13:     data: {},
21839: 14:     children: [
21840: 15:       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
21841: 16:       {
21842: 17:         path: 'dashboard',
21843: 18:         loadChildren: () => import('./dashboard/routes').then(m => m.routes)
21844: 19:       },
21845: 20:       {
21846: 21:         path: 'widgets',
21847: 22:         loadChildren: () => import('./widgets/routes').then(m => m.routes)
21848: 23:       },
21849: 24:       { path: 'style', loadChildren: () => import('./style/routes').then(m => m.routes) },
21850: 25:       { path: 'delon', loadChildren: () => import('./delon/routes').then(m => m.routes) },
21851: 26:       { path: 'extras', loadChildren: () => import('./extras/routes').then(m => m.routes) },
21852: 27:       { path: 'pro', loadChildren: () => import('./pro/routes').then(m => m.routes) },
21853: 28:       { path: 'accounts', loadChildren: () => import('./accounts/routes').then(m => m.routes) },
21854: 29:       {
21855: 30:         path: 'collaboration',
21856: 31:         loadChildren: () => import('./collaboration/routes').then(m => m.COLLABORATION_ROUTES)
21857: 32:       },
21858: 33:       {
21859: 34:         path: 'blueprints',
21860: 35:         loadChildren: () => import('./blueprints/routes').then(m => m.BLUEPRINT_ROUTES)
21861: 36:       },
21862: 37:       {
21863: 38:         path: 'tasks',
21864: 39:         loadChildren: () => import('./tasks/routes').then(m => m.TASK_ROUTES)
21865: 40:       },
21866: 41:       {
21867: 42:         path: 'quality',
21868: 43:         loadChildren: () => import('./quality/routes').then(m => m.QUALITY_ROUTES)
21869: 44:       },
21870: 45:       {
21871: 46:         path: 'issues',
21872: 47:         loadChildren: () => import('./issues/routes').then(m => m.ISSUE_ROUTES)
21873: 48:       }
21874: 49:     ]
21875: 50:   },
21876: 51:   // Blak Layout 空白布局
21877: 52:   {
21878: 53:     path: 'data-v',
21879: 54:     component: LayoutBlankComponent,
21880: 55:     children: [{ path: '', loadChildren: () => import('./data-v/routes').then(m => m.routes) }]
21881: 56:   },
21882: 57:   // passport
21883: 58:   { path: '', loadChildren: () => import('./passport/routes').then(m => m.routes) },
21884: 59:   { path: 'exception', loadChildren: () => import('./exception/routes').then(m => m.routes) },
21885: 60:   { path: '**', redirectTo: 'exception/404' }
21886: 61: ];
21887: ````
`````

## File: docs/ArchivedDocuments/fyi-development.md
`````markdown
   1: # 開發脈絡記錄 (FYI - Development)
   2: 
   3: > 參考：[@fyi.md](./fyi.md)
   4: 
   5: 記錄專案在開發過程中的思路、嘗試、技術選型原因、權衡、取捨、重大決策與其背景。
   6: 
   7: ---
   8: 
   9: ## 2025-01-15: 實施階段 1 - 權限服務模組（core/permissions/）
  10: 
  11: ### 背景
  12: 根據 PRD 要求和 Git-like 分支模型架構，需要實現完整的 RBAC 權限控制系統。整合 @delon/acl 和 Supabase 數據庫，實現權限檢查、角色管理、分支權限控制等功能。
  13: 
  14: ### 設計決策
  15: 
  16: #### 技術選型
  17: - **整合 @delon/acl**：使用 ACLService 作為本地權限緩存
  18:   - **原因**：ng-alain 框架已提供完整的 ACL 功能，無需重複造輪
  19:   - **優勢**：與框架深度整合，支持路由守衛、指令等
  20:   - **權衡**：需要適配 Supabase 數據庫權限系統
  21: 
  22: #### 架構設計
  23: - **獨立類型定義**：創建 `types.ts` 文件，便於未來平坦開發
  24:   - **原因**：用戶要求以未來平坦開發為主
  25:   - **優勢**：類型定義集中管理，易於維護和擴展
  26: 
  27: #### 性能優化
  28: - **內存緩存策略**：5 分鐘 TTL，減少數據庫查詢
  29:   - **原因**：權限檢查頻繁，每次查詢數據庫會影響性能
  30:   - **權衡**：緩存時間過短會增加查詢，過長會導致權限更新延遲
  31:   - **選擇**：5 分鐘平衡性能和實時性
  32:   - **詳細說明**：參考 [性能優化策略](./fyi-performance.md#權限系統緩存策略)
  33: 
  34: #### 錯誤處理
  35: - **權限檢查失敗時拋出異常**
  36:   - **原因**：用戶明確要求
  37:   - **優勢**：明確的錯誤處理，便於調試和日誌記錄
  38: 
  39: #### 日誌記錄
  40: - **規劃文件中提到需要，後續實現 activity_logs 整合**
  41:   - **原因**：PRD 要求活動記錄功能
  42:   - **狀態**：已規劃，待實施
  43: 
  44: ### 實施細節
  45: 
  46: #### 權限檢查流程設計
  47: ```
  48: 權限檢查請求
  49:   ↓
  50: 1. 檢查 @delon/acl ACLService 本地緩存
  51:   ↓ (如果沒有)
  52: 2. 檢查內存緩存（5 分鐘 TTL）
  53:   ↓ (如果沒有)
  54: 3. 查詢 Supabase 數據庫（user_roles + role_permissions + permissions）
  55:   ↓
  56: 4. 同步到 ACLService 和內存緩存
  57:   ↓
  58: 5. 返回權限檢查結果
  59: ```
  60: 
  61: **設計考量**：
  62: - 三層緩存策略：ACLService → 內存緩存 → 數據庫
  63: - 減少數據庫查詢，提升性能
  64: - 自動同步，保持一致性
  65: - **詳細說明**：參考 [性能優化策略](./fyi-performance.md#權限系統緩存策略)
  66: 
  67: #### 與 @delon/acl 整合策略
  68: - 使用 `ACLService.set({ role: [...], abilities: [...] })` 同步權限
  69: - 使用 `ACLService.can()` 檢查本地緩存
  70: - 自動同步角色和權限到 ACLService
  71: 
  72: **設計考量**：
  73: - 保留框架原有功能，無需修改業務代碼
  74: - 雙向同步，確保權限一致性
  75: 
  76: ---
  77: 
  78: ## 2025-11-14: Supabase 與 @delon/auth 整合
  79: 
  80: ### 背景
  81: 專案需要整合 Supabase 作為後端服務，同時保留現有的 `@delon/auth` 認證系統，確保零破壞性整合。
  82: 
  83: ### 設計決策
  84: 
  85: #### 適配器模式
  86: - **創建 `SupabaseAuthAdapterService` 作為 Supabase Auth 與 `@delon/auth` 之間的橋樑**
  87:   - **原因**：需要整合兩個不同的認證系統
  88:   - **優勢**：零破壞性，保留所有現有代碼
  89:   - **權衡**：增加一層抽象，但換來兼容性
  90: 
  91: #### Session 同步機制
  92: - **自動將 Supabase Session 轉換為 @delon/auth Token 格式並同步到 `TokenService`**
  93:   - **原因**：兩個系統的 Session 格式不同
  94:   - **實現**：格式轉換函數 `convertSessionToTokenFormat()`
  95:   - **優勢**：自動同步，無需手動處理
  96: 
  97: #### 零破壞性整合
  98: - **保留所有現有的 `@delon/auth` 使用方式，無需修改業務代碼**
  99:   - **原因**：避免大規模重構
 100:   - **優勢**：降低風險，快速整合
 101: 
 102: ### 技術細節
 103: 
 104: #### Session 格式轉換
 105: - `access_token` → `token`
 106: - `refresh_token` → `refresh_token`
 107: - `expires_in` → `expired` (計算過期時間戳)
 108: 
 109: #### 自動狀態同步
 110: - 監聽 Supabase Auth 狀態變化
 111: - 自動同步到 TokenService
 112: - 應用啟動時自動恢復 Session
 113: 
 114: ---
 115: 
 116: ## 2025-11-14: 註冊功能改為 Supabase Auth，移除手機號登入
 117: 
 118: ### 背景
 119: 將註冊功能改為使用 Supabase Auth，並移除登入頁面的手機號登入功能，統一使用 Email/Password 認證方式。
 120: 
 121: ### 設計決策
 122: 
 123: #### 統一認證方式
 124: - **僅使用 Email/Password 認證，移除手機號登入**
 125:   - **原因**：簡化認證流程，降低維護成本
 126:   - **權衡**：失去手機號登入便利性，但換來一致性
 127: 
 128: #### 簡化 UI
 129: - **移除登入頁面的 Tab 切換，簡化表單結構**
 130:   - **原因**：只有一種認證方式，無需切換
 131:   - **優勢**：UI 更簡潔，用戶體驗更好
 132: 
 133: #### 保持一致性
 134: - **註冊和登入都使用 Supabase Auth**
 135:   - **原因**：統一認證流程
 136:   - **優勢**：代碼更一致，維護更容易
 137: 
 138: ---
 139: 
 140: ## 2025-11-14: 移除社交登入功能（其他登入方式、Auth0）
 141: 
 142: ### 背景
 143: 移除登入頁面的社交登入功能，包括"其他登入方式"區塊和 Auth0、GitHub、Weibo 等第三方登入選項，統一使用 Supabase Auth 的 Email/Password 認證。
 144: 
 145: ### 設計決策
 146: 
 147: #### 簡化認證流程
 148: - **僅保留 Supabase Auth 的 Email/Password 認證**
 149:   - **原因**：減少依賴，降低複雜度
 150:   - **權衡**：失去社交登入便利性，但換來系統簡化
 151: 
 152: #### 移除社交登入
 153: - **移除所有第三方登入選項（Auth0、GitHub、Weibo）**
 154:   - **原因**：不需要第三方認證
 155:   - **優勢**：減少代碼複雜度，降低安全風險
 156: 
 157: #### 保留註冊連結
 158: - **保留註冊頁面連結，方便新用戶註冊**
 159:   - **原因**：用戶體驗考慮
 160:   - **實現**：移至表單底部並居中顯示
 161: 
 162: ---
 163: 
 164: ## 2025-01-15: 項目結構重構規劃
 165: 
 166: ### 背景
 167: 基於 51 張資料表的 11 個業務模組分類、業務流程圖、帳戶層流程圖和實體關係圖，需要重構項目文件夾結構，使其符合 Angular 20 + ng-alain 最佳實踐，並反映 Git-like 分支模型架構。
 168: 
 169: ### 設計決策
 170: 
 171: #### 分層架構
 172: - **嚴格遵循 `routes` → `shared` → `core` 的依賴方向**
 173:   - **原因**：清晰的依賴關係，避免循環依賴
 174:   - **優勢**：代碼組織更清晰，維護更容易
 175: 
 176: #### 業務領域驅動
 177: - **按 11 個業務模組組織文件夾結構**
 178:   - **原因**：符合領域驅動設計（DDD）原則
 179:   - **優勢**：業務邏輯清晰，易於擴展
 180: 
 181: #### Angular 20 最佳實踐
 182: - **使用 Standalone Components、SHARED_IMPORTS、Signals**
 183:   - **原因**：Angular 20 新特性，提升開發體驗
 184:   - **優勢**：代碼更簡潔，性能更好
 185: 
 186: #### 資料表映射
 187: - **每個業務模組對應相應的資料表集合和數據模型**
 188:   - **原因**：清晰的數據模型映射
 189:   - **優勢**：易於理解和維護
 190: 
 191: ### 技術細節
 192: 
 193: #### 使用工具
 194: - Context7 查詢 Angular 20 和 ng-alain 最佳實踐
 195: - Sequential Thinking 分析項目結構和業務需求
 196: - Software Planning Tool 創建重構計劃
 197: 
 198: #### 設計依據
 199: - 業務流程圖
 200: - 帳戶層流程圖
 201: - 實體關係圖
 202: - 51 張資料表結構定義
 203: 
 204: ---
 205: 
 206: ## 2025-01-15: 基礎 RLS 策略實施
 207: 
 208: ### 背景
 209: 根據開發前檢查清單，所有 51 張資料表的 RLS 都是 `false`，需要啟用 RLS 確保基本安全性。考慮到開發過程會不斷調整，決定先建立基礎 RLS 策略，後續再逐步完善。
 210: 
 211: ### 設計決策
 212: 
 213: #### 分階段實施策略
 214: - **先建立基礎 RLS**：確保基本安全性，不阻塞後續開發
 215:   - **原因**：完整的 RLS 策略需要對業務邏輯有深入理解，開發過程中會不斷調整
 216:   - **優勢**：快速建立安全基礎（1-2 天），保持開發靈活性
 217:   - **權衡**：策略較為寬鬆，但為後續細化留下空間
 218: 
 219: #### 基礎策略設計原則
 220: - **最小權限原則**：只給必要的權限
 221: - **已認證用戶基礎**：所有策略基於 `auth.uid()` 和 `auth.role()`
 222: - **策略命名規範**：`[操作]_[表名]_[描述]`，便於維護
 223: - **註釋說明**：標註 `TODO` 後續調整點
 224: 
 225: #### 策略分類
 226: 1. **accounts 表**：用戶只能操作自己的帳戶
 227: 2. **blueprints 表**：擁有者可以操作，已認證用戶可以查看
 228: 3. **其他核心表**：先建立最基礎的 SELECT 策略（已認證用戶）
 229: 4. **個人資料表**（notifications, personal_todos）：用戶只能查看自己的資料
 230: 
 231: ### 實施細節
 232: 
 233: #### 遷移腳本結構
 234: ```sql
 235: -- 1. 啟用所有 51 張表的 RLS
 236: ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
 237: -- ... 其他 50 張表
 238: 
 239: -- 2. 建立基礎策略
 240: -- accounts 表：用戶只能操作自己的帳戶
 241: CREATE POLICY "Users can view own account"
 242: ON accounts FOR SELECT
 243: TO authenticated
 244: USING (auth.uid() = auth_user_id);
 245: 
 246: -- blueprints 表：基礎策略
 247: CREATE POLICY "Authenticated users can view blueprints"
 248: ON blueprints FOR SELECT
 249: TO authenticated
 250: USING (true);
 251: -- TODO: 後續根據業務需求調整為更細粒度的權限控制
 252: ```
 253: 
 254: #### 策略覆蓋範圍
 255: - ✅ 所有 51 張表已啟用 RLS
 256: - ✅ 核心表（accounts, blueprints, tasks 等）建立基礎策略
 257: - ✅ 個人資料表建立用戶級別策略
 258: - ⏳ INSERT/UPDATE/DELETE 策略將在開發過程中逐步添加
 259: 
 260: ### 後續完善計劃
 261: - 參考 `docs/21-安全與-RLS-權限矩陣.md` 建立詳細策略
 262: - 整合角色系統（user_roles 表）
 263: - 實現 Git-like 分支權限控制
 264: - 測試和驗證策略正確性
 265: 
 266: ### 技術細節
 267: 
 268: #### 使用工具
 269: - **Supabase MCP 工具**：執行遷移腳本
 270: - **Context7**：查詢 Supabase RLS 最佳實踐
 271: - **Sequential Thinking**：分析策略設計
 272: - **Software Planning Tool**：規劃實施步驟
 273: 
 274: #### 驗證方式
 275: ```sql
 276: -- 驗證 RLS 是否已啟用
 277: SELECT 
 278:   schemaname,
 279:   tablename,
 280:   rowsecurity as rls_enabled
 281: FROM pg_tables
 282: WHERE schemaname = 'public'
 283:   AND tablename IN ('accounts', 'blueprints', 'tasks', 'roles', 'permissions');
 284: ```
 285: 
 286: ---
 287: 
 288: ## 技術選型總結
 289: 
 290: ### 為什麼選擇 @delon/acl？
 291: - ng-alain 框架已提供完整的 ACL 功能
 292: - 與框架深度整合，支持路由守衛、指令等
 293: - 無需重複造輪，降低開發成本
 294: 
 295: ### 為什麼選擇適配器模式？
 296: - 零破壞性整合，保留所有現有代碼
 297: - 清晰的職責分離
 298: - 易於測試和維護
 299: 
 300: ### 為什麼選擇內存緩存？
 301: - 權限檢查頻繁，需要高性能
 302: - 5 分鐘 TTL 平衡性能和實時性
 303: - 減少數據庫查詢，提升響應速度
 304: 
 305: ### 為什麼統一使用 Email/Password？
 306: - 簡化認證流程，降低維護成本
 307: - 與 Supabase Auth 深度整合
 308: - 減少安全風險
 309: 
 310: ---
 311: 
 312: ## 2025-01-15: 開發順序決策 - 先開發賬戶系統而非藍圖系統
 313: 
 314: ### 背景
 315: 在規劃 Phase 1 MVP 開發時，需要決定先開發賬戶系統（Accounts）還是藍圖系統（Blueprints）。使用 Sequential Thinking 和 Software Planning Tool 進行分析，確定最平坦的開發路徑。
 316: 
 317: ### 設計決策
 318: 
 319: #### 依賴關係分析
 320: - **賬戶系統（Accounts）**：
 321:   - 基礎表，不依賴其他業務模組
 322:   - 被多個系統依賴：
 323:     - `blueprints.owner_id` → `accounts.id`（必須）
 324:     - `teams.organization_id` → `accounts.id`
 325:     - `team_members.account_id` → `accounts.id`
 326:     - 權限系統、協作系統等都依賴 `accounts.id`
 327: 
 328: - **藍圖系統（Blueprints）**：
 329:   - 依賴賬戶系統：
 330:     - `blueprints.owner_id` → `accounts.id`（外鍵，必須）
 331:     - 創建藍圖時必須提供有效的 `owner_id`
 332:   - 約束：`owner_id` 必須是 `Organization` 類型的賬戶
 333: 
 334: #### 決策：先開發賬戶系統
 335: 
 336: **原因**：
 337: 1. **依賴方向**：賬戶是底層基礎，藍圖是上層業務
 338: 2. **平坦開發**：從基礎到業務，減少依賴複雜度
 339: 3. **測試便利**：賬戶系統可獨立測試，藍圖需要賬戶數據
 340: 4. **開發效率**：先完成賬戶後，藍圖可直接使用
 341: 
 342: **權衡**：
 343: - 失去先開發核心業務功能的機會
 344: - 但換來更穩固的基礎和更順暢的後續開發
 345: 
 346: ### 實施計劃
 347: 
 348: #### 使用工具
 349: - **Sequential Thinking**：分析依賴關係和開發順序
 350: - **Software Planning Tool**：創建詳細實施計劃
 351: - **Context7**：查詢 Angular 20 和 ng-alain 最佳實踐
 352: 
 353: #### 實施步驟（10 個任務）
 354: 1. **數據模型層**（shared/models/account/）- 複雜度：3/10
 355: 2. **服務層 - AccountService** - 複雜度：5/10
 356: 3. **服務層 - TeamService** - 複雜度：5/10
 357: 4. **路由層 - 賬戶列表頁面** - 複雜度：6/10
 358: 5. **路由層 - 賬戶詳情/編輯頁面** - 複雜度：5/10
 359: 6. **路由層 - 團隊管理頁面** - 複雜度：6/10
 360: 7. **路由配置** - 複雜度：3/10
 361: 8. **RLS 權限驗證** - 複雜度：4/10
 362: 9. **單元測試** - 複雜度：5/10
 363: 10. **集成測試和文檔更新** - 複雜度：4/10
 364: 
 365: **總複雜度**：平均 4.6/10  
 366: **預計時間**：2-3 周
 367: 
 368: #### 技術要點
 369: - Angular 20 Standalone Components
 370: - Signals 狀態管理
 371: - Repository 模式
 372: - Typed Forms
 373: - RLS 安全策略
 374: - 分層架構（routes → shared → core）
 375: 
 376: ### 後續計劃
 377: 完成賬戶系統後，將繼續開發藍圖系統，屆時可直接使用已完成的賬戶服務和數據模型。
 378: 
 379: ---
 380: 
 381: ## 2025-01-15：賬戶系統架構決策反覆
 382: 
 383: ### 背景
 384: 在開始實施賬戶系統開發前，需要確定 Repository 和 Service 的正確位置，確保符合項目架構規範。
 385: 
 386: ### 決策反覆過程
 387: 
 388: #### 第一次評估（初始計劃）
 389: - **假設**：Service 直接使用 SupabaseService（參考 PermissionService 模式）
 390: - **問題**：未充分利用已有的 BaseRepository 基礎設施
 391: - **狀態**：❌ 未採用
 392: 
 393: #### 第二次評估（發現 Repository）
 394: - **發現**：項目已有完整的 Repository 模式實現（`core/infra/repositories/`）
 395: - **考慮**：是否應該使用 Repository 模式？
 396: - **狀態**：🤔 評估中
 397: 
 398: #### 第三次評估（架構對齊）
 399: - **分析**：
 400:   - Repository 屬於基礎設施層（core）
 401:   - Service 屬於共享層（shared）
 402:   - 分層架構：routes → shared → core
 403: - **確認**：Service → Repository → SupabaseService 符合分層架構
 404: - **狀態**：✅ 最終決策
 405: 
 406: ### 最終決策
 407: 
 408: #### Repository 位置
 409: - **位置**：`core/infra/repositories/account.repository.ts`
 410: - **理由**：屬於基礎設施層，已有 BaseRepository 實現
 411: - **優勢**：
 412:   - 自動數據轉換（snake_case ↔ camelCase）
 413:   - 統一錯誤處理
 414:   - 復用通用 CRUD 操作
 415: 
 416: #### Models 位置
 417: - **位置**：`shared/models/account/types.ts`
 418: - **理由**：類型定義屬於共享層
 419: - **內容**：Account, Team, TeamMember 接口（camelCase）
 420: 
 421: #### Service 位置
 422: - **位置**：`shared/services/account/account.service.ts`
 423: - **理由**：業務邏輯屬於共享層
 424: - **依賴**：使用 AccountRepository（符合 shared → core 依賴方向）
 425: 
 426: ### 實施順序調整
 427: 
 428: **原計劃**：
 429: 1. Models → Service（直接使用 SupabaseService）
 430: 
 431: **新計劃**：
 432: 1. Models（類型定義）
 433: 2. Repository（數據訪問層，使用 BaseRepository）
 434: 3. Service（業務邏輯層，使用 Repository）
 435: 
 436: ### 經驗教訓
 437: 
 438: 1. **先評估現有代碼**：在制定計劃前，先全面了解現有代碼結構
 439: 2. **文檔與代碼對齊**：文檔規劃可能與實際代碼不一致，應以實際代碼為準
 440: 3. **分層架構的重要性**：明確各層的職責和依賴關係
 441: 4. **決策反覆的價值**：通過多次評估，找到最佳方案
 442: 
 443: ### 相關文檔
 444: - [結構評估總結](./賬戶系統開發-結構評估總結.md) - 詳細的評估過程和決策記錄
 445: - [Core 基礎設施 README](../src/app/core/infra/README.md) - Repository 模式使用指南
 446: 
 447: ---
 448: 
 449: ---
 450: 
 451: ## 2025-01-15: 基礎設施模組實施
 452: 
 453: ### 背景
 454: 根據項目架構規劃和開發需求，需要建立數據訪問層基礎設施，為後續業務開發提供堅實基礎。遵循"先做基礎、方便擴展、開發平順、避免錯誤"的原則。
 455: 
 456: ### 設計決策
 457: 
 458: #### 技術選型
 459: - **Repository 模式**：封裝 Supabase 客戶端調用，提供統一數據訪問接口
 460:   - **原因**：統一數據訪問邏輯，減少重複代碼，便於測試和維護
 461:   - **優勢**：封裝複雜的 Supabase 查詢邏輯，提供簡潔的 API
 462:   - **權衡**：需要額外的抽象層，但帶來更好的可維護性
 463: 
 464: #### 類型安全
 465: - **使用 Supabase 生成的類型定義**：確保類型與數據庫結構一致
 466:   - **原因**：類型安全是避免錯誤的關鍵
 467:   - **優勢**：編譯時類型檢查，減少運行時錯誤
 468:   - **實施**：使用 Supabase MCP 工具生成完整的 TypeScript 類型定義
 469: 
 470: #### 數據轉換
 471: - **自動 snake_case ↔ camelCase 轉換**：數據庫使用 snake_case，TypeScript 使用 camelCase
 472:   - **原因**：遵循各自的最佳實踐，同時保持一致性
 473:   - **優勢**：自動轉換，無需手動處理，減少錯誤
 474:   - **實施**：在 BaseRepository 中自動處理轉換
 475: 
 476: #### 錯誤處理
 477: - **統一錯誤處理機制**：將 Supabase 錯誤轉換為友好的應用錯誤
 478:   - **原因**：提供一致的錯誤處理體驗
 479:   - **優勢**：錯誤分類和嚴重程度標記，便於處理和調試
 480:   - **實施**：創建錯誤轉換工具，自動轉換 Supabase 錯誤
 481: 
 482: #### 代碼風格
 483: - **返回 Observable**：與現有代碼風格一致
 484:   - **原因**：項目已使用 RxJS，保持一致性
 485:   - **優勢**：統一的異步處理方式，便於組合和測試
 486:   - **實施**：所有 Repository 方法返回 Observable
 487: 
 488: ### 架構設計
 489: 
 490: #### 模組結構
 491: ```
 492: core/infra/
 493: ├── types/              # 類型定義
 494: ├── repositories/       # Repository 模式實現
 495: ├── errors/            # 錯誤處理
 496: └── utils/             # 工具函數
 497: ```
 498: 
 499: #### BaseRepository 設計
 500: - **抽象類**：提供通用 CRUD 操作
 501: - **泛型支持**：確保類型安全
 502: - **自動轉換**：自動處理數據轉換
 503: - **統一錯誤處理**：自動轉換錯誤
 504: 
 505: #### 擴展方式
 506: - **繼承 BaseRepository**：只需設置 `tableName` 即可獲得所有 CRUD 操作
 507: - **添加特定方法**：可以添加特定查詢方法
 508: - **三步完成**：定義類型 → 繼承類 → 設置表名
 509: 
 510: ### 實施細節
 511: 
 512: #### 類型定義生成
 513: - 使用 Supabase MCP 工具生成
 514: - 包含所有 51 張表的類型定義
 515: - 包含類型輔助工具（Tables、TablesInsert、TablesUpdate）
 516: 
 517: #### BaseRepository 實現
 518: - 通用 CRUD 操作（findAll、findById、create、update、delete）
 519: - 分頁查詢（findPaginated）
 520: - 支持篩選、排序、分頁
 521: - 自動數據轉換
 522: - 統一錯誤處理
 523: 
 524: #### BlueprintRepository 示例
 525: - 繼承 BaseRepository
 526: - 實現特定查詢方法（findByOwnerId、findByStatus 等）
 527: - 作為其他 Repository 的參考實現
 528: 
 529: ### 權衡與取捨
 530: 
 531: #### 類型斷言的使用
 532: - **問題**：Supabase 需要字面量類型，但 `tableName` 是運行時值
 533: - **解決方案**：使用類型斷言 `as any`，添加註釋說明
 534: - **權衡**：失去部分類型安全，但獲得靈活性
 535: - **選擇**：使用類型斷言，通過文檔說明
 536: 
 537: #### 錯誤處理策略
 538: - **問題**：Supabase 錯誤需要轉換為應用錯誤
 539: - **解決方案**：創建錯誤轉換工具，自動轉換
 540: - **權衡**：增加抽象層，但提供更好的錯誤處理
 541: - **選擇**：統一錯誤處理，便於維護
 542: 
 543: ### 經驗教訓
 544: 
 545: 1. **先做基礎**：只提供必要的通用功能，不包含業務邏輯
 546: 2. **方便擴展**：通過繼承輕鬆添加新 Repository
 547: 3. **開發平順**：自動處理數據轉換和錯誤處理
 548: 4. **避免錯誤**：類型安全和統一錯誤處理機制
 549: 
 550: ### 相關文檔
 551: - [專案路線圖](./44-專案路線圖.md) - **專案開發路線圖與里程碑** ⭐ 新增
 552: - [基礎設施模組實施總結](./基礎設施模組實施總結.md) - 詳細實施記錄
 553: - [使用指南](../src/app/core/infra/README.md) - 完整使用指南
 554: - [快速開始](../src/app/core/infra/QUICK_START.md) - 快速開始指南
 555: 
 556: ---
 557: 
 558: ## 2025-01-15: 專案路線圖建立
 559: 
 560: ### 背景
 561: 為了更好地規劃和管理專案開發進度，需要建立一個統一的路線圖文檔，記錄開發計劃、里程碑和優先級。
 562: 
 563: ### 決策
 564: - **路線圖位置**：放在 `docs/44-專案路線圖.md`（正式技術文檔區）
 565:   - **原因**：路線圖是面向所有開發者的正式參考文檔，需要定期更新和維護
 566:   - **優勢**：與其他技術文檔放在一起，易於查找和維護
 567:   - **參考**：在 `docs/README.md` 中建立索引，在 `fyi-history.md` 和 `fyi-development.md` 中建立引用
 568: 
 569: ### 路線圖內容
 570: - **當前狀態**：記錄已完成和進行中的工作
 571: - **Phase 1 MVP**：3 個月的開發計劃（Month 1-3）
 572: - **Phase 2 功能增強**：3 個月的增強計劃（Month 4-6）
 573: - **Phase 3 進階功能**：待規劃的擴展方向
 574: - **開發優先級**：P0/P1/P2 優先級分類
 575: - **里程碑**：9 個關鍵里程碑（已完成 4 個，進行中 1 個，待開始 4 個）
 576: 
 577: ### 文檔引用
 578: - 在 `docs/README.md` 中新增「專案規劃（44）」分類
 579: - 在 `fyi-history.md` 的「相關文檔」和「時間線總覽」中加入引用
 580: - 在 `fyi-development.md` 中記錄決策背景
 581: 
 582: ### 後續維護
 583: - 路線圖需要根據專案進度定期更新（建議每月審查一次）
 584: - 里程碑完成後需同步更新狀態
 585: - 重大計劃變更需記錄在 `fyi-development.md` 中
 586: 
 587: ---
 588: 
 589: ## 2025-01-15: 账户系统架构违规修复
 590: 
 591: ### 背景
 592: 在账户系统实施过程中，发现了架构依赖违规和路径别名使用错误的问题。这些问题违反了项目的分层架构原则，需要立即修复。
 593: 
 594: ### 设计决策
 595: 
 596: #### 类型定义位置决策
 597: **问题**：Repository 层需要使用 `AccountType`、`AccountStatus`、`TeamMemberRole` 枚举，但这些枚举最初定义在 `shared` 层。
 598: 
 599: **决策**：将枚举移到 `core/infra/types/account.types.ts`
 600: 
 601: **原因**：
 602: - Repository 层属于基础设施层（core）
 603: - 基础设施类型应该在基础设施层定义
 604: - 符合分层架构：`core` 不依赖 `shared`
 605: 
 606: **权衡**：
 607: - ✅ 架构合规：core 不依赖 shared
 608: - ✅ 职责清晰：基础设施类型在基础设施层
 609: - ⚠️ 需要重新导出：在 shared 层重新导出以保持向后兼容
 610: 
 611: #### 路径别名使用规范
 612: **问题**：使用 `@core/infra/repositories/team.repository` 深层路径，但路径别名只配置到根导出文件。
 613: 
 614: **决策**：统一使用根导出
 615: 
 616: **原因**：
 617: - 路径别名只配置到 `@core` 和 `@shared`，不支持深层路径
 618: - 保持导入路径的一致性
 619: - 简化导入语句
 620: 
 621: **实施**：
 622: - Service 层：从 `@core` 和 `@shared` 根导出导入
 623: - Repository 层：使用相对路径（core 层内部）
 624: - 组件层：从 `@shared` 根导出导入
 625: 
 626: ### 向后兼容策略
 627: 
 628: **策略**：在 shared 层重新导出 core 层的类型
 629: 
 630: **原因**：
 631: - 避免大规模重构现有代码
 632: - 保持现有导入路径不变
 633: - 逐步迁移到新的导入路径
 634: 
 635: **实施**：
 636: ```typescript
 637: // shared/models/account/types.ts
 638: import { AccountType, AccountStatus, TeamMemberRole } from '@core';
 639: 
 640: // 重新导出，保持向后兼容
 641: export { AccountType, AccountStatus, TeamMemberRole };
 642: ```
 643: 
 644: ### 经验教训
 645: 
 646: 1. **分层架构的重要性**：
 647:    - 严格遵循分层架构原则，避免循环依赖
 648:    - 基础设施类型应该在基础设施层定义
 649:    - 在代码审查时检查依赖方向
 650: 
 651: 2. **路径别名使用规范**：
 652:    - 路径别名只配置到根导出文件，不支持深层路径
 653:    - 统一使用根导出，保持导入路径一致性
 654:    - 确保导出链完整
 655: 
 656: 3. **类型定义位置决策原则**：
 657:    - 被 Repository 使用的类型 → 放在 `core/infra/types/`
 658:    - 被 Service 使用的类型 → 可以放在 `shared/models/`
 659:    - 被组件使用的类型 → 可以放在 `shared/models/`
 660: 
 661: ### 相关文档
 662: - [账户系统架构违规修复总结](./账户系统架构违规修复总结.md) ⭐ 详细修复记录
 663: - [分層架構規範](../.cursor/rules/architecture.mdc)
 664: 
 665: ---
 666: 
 667: ## 2025-01-15: 賬戶系統完整評估方法
 668: 
 669: ### 背景
 670: 在開始實施賬戶系統 MVP 之前，需要全面評估當前實現狀態，確保實施計劃完整且準確。使用 Sequential Thinking + Software Planning Tool 進行系統性評估。
 671: 
 672: ### 評估方法設計
 673: 
 674: #### Sequential Thinking 分析流程
 675: 1. **理解當前狀態**：分析已完成的工作和進行中的任務
 676: 2. **識別缺失功能**：系統性檢查所有相關文件
 677: 3. **確定優先級**：基於依賴關係和重要性排序
 678: 4. **制定評估清單**：列出需要檢查的所有項目
 679: 5. **執行系統性檢查**：文件系統檢查、代碼內容檢查、架構合規性檢查
 680: 6. **分析結果**：整理已完成和缺失的功能
 681: 7. **更新計劃**：使用 Software Planning Tool 更新實施計劃
 682: 8. **確認完整性**：確保所有重要信息都記錄在脈絡文檔中
 683: 
 684: #### Software Planning Tool 使用
 685: - **創建實施計劃**：記錄所有任務和階段
 686: - **更新任務狀態**：標記已完成和待完成的任務
 687: - **添加詳細說明**：為每個任務提供代碼示例和依賴關係
 688: - **追蹤進度**：實時更新任務完成狀態
 689: 
 690: ### 評估發現
 691: 
 692: #### 架構合規性驗證
 693: - ✅ **core 層不依賴 shared 層**：使用 grep 檢查，確認 core/infra/repositories 中無 @shared 導入
 694: - ✅ **路徑別名使用正確**：統一使用 @core 和 @shared，不使用深層路徑
 695: - ✅ **類型定義位置正確**：枚舉在 core 層定義，實體類型在 shared 層重新導出
 696: 
 697: #### 代碼質量檢查
 698: - ✅ **Repository 層**：所有 Repository 正確繼承 BaseRepository，使用統一錯誤處理
 699: - ✅ **Service 層**：AccountService 和 TeamService 使用 Signals 管理狀態，暴露 ReadonlySignal
 700: - ✅ **類型安全**：完整的 TypeScript 類型定義，導出鏈完整
 701: 
 702: #### 功能完整性檢查
 703: - ✅ **Repository 層**：4 個 Repository 全部完成（100%）
 704: - ⚠️ **Service 層**：2/3 完成（66%），缺 OrganizationScheduleService
 705: - ❌ **UI 層**：1/6 完成（16%），缺 5 個頁面組件
 706: - ❌ **測試**：0% 完成，無單元測試
 707: 
 708: ### 技術決策
 709: 
 710: #### 評估工具選擇
 711: - **Sequential Thinking**：用於複雜問題的系統性分析
 712: - **Software Planning Tool**：用於任務管理和進度追蹤
 713: - **文件系統工具**：用於檢查文件存在性和目錄結構
 714: - **代碼搜索工具**：用於驗證架構合規性
 715: 
 716: #### 評估範圍確定
 717: - **Repository 層**：檢查所有 4 個 Repository
 718: - **Service 層**：檢查所有 3 個 Service
 719: - **類型定義**：檢查所有類型定義和導出鏈
 720: - **路由和組件**：檢查所有頁面組件和路由配置
 721: - **架構合規性**：檢查分層架構、路徑別名、類型定義位置
 722: 
 723: ### 經驗教訓
 724: 
 725: 1. **系統性評估的重要性**：
 726:    - 使用 Sequential Thinking 確保不遺漏任何重要環節
 727:    - 使用 Software Planning Tool 記錄所有發現和計劃
 728: 
 729: 2. **架構合規性驗證**：
 730:    - 使用 grep 等工具自動檢查架構違規
 731:    - 定期驗證分層架構和路徑別名使用
 732: 
 733: 3. **完整記錄**：
 734:    - 所有評估結果都應記錄在脈絡文檔中
 735:    - 確保後續開發可以參考評估結果
 736: 
 737: ### 相關文檔
 738: - [歷史紀錄](./fyi-history.md#2025-01-15-賬戶系統完整評估) - 評估記錄
 739: - [專案路線圖](./44-專案路線圖.md) - 更新狀態
 740: - Software Planning Tool - 完整實施計劃
 741: 
 742: ---
 743: 
 744: ---
 745: 
 746: ## 2025-01-15: 賬戶系統 MVP 實施
 747: 
 748: ### 背景
 749: 在完成系統性評估後，使用 Sequential Thinking + Software Planning Tool 推進實施，完成了賬戶系統 MVP 的核心功能。
 750: 
 751: ### 實施方法
 752: 
 753: #### Sequential Thinking 分析流程
 754: 1. **理解當前狀態**：分析已完成的工作和缺失的功能
 755: 2. **確定優先級**：Service 層優先，UI 層依賴 Service 層
 756: 3. **逐步實施**：按依賴關係順序實施
 757: 4. **驗證構建**：每個階段完成後驗證構建
 758: 
 759: #### Software Planning Tool 使用
 760: - 實時更新任務狀態
 761: - 追蹤完成進度
 762: - 記錄實施細節
 763: 
 764: ### 技術決策
 765: 
 766: #### 字段名處理策略
 767: - **問題**：BaseRepository 會自動轉換 snake_case → camelCase，但類型定義是 snake_case
 768: - **決策**：在組件中統一使用 snake_case 字段名訪問數據
 769: - **原因**：類型定義直接來自數據庫，保持一致性
 770: - **影響**：所有組件都需要使用 snake_case
 771: 
 772: #### 組件設計模式
 773: - **Standalone Components**：所有組件使用 standalone 模式
 774: - **Signals 狀態管理**：使用 `signal()`, `computed()`, `inject()`
 775: - **Typed Forms**：使用 `FormGroup<{}>`, `FormControl<>` 確保類型安全
 776: - **Angular 20 語法**：使用 `@if`, `@for`, `@switch` 控制流程
 777: 
 778: #### 錯誤處理策略
 779: - **Service 層**：使用 try-catch 和 Signals 管理錯誤狀態
 780: - **組件層**：使用 NzMessageService 顯示用戶友好的錯誤信息
 781: - **靜默失敗**：非關鍵操作（如加載團隊信息）靜默失敗，不影響主流程
 782: 
 783: ### 經驗教訓
 784: 
 785: 1. **字段名一致性**：
 786:    - 類型定義和實際使用必須保持一致
 787:    - BaseRepository 轉換是運行時行為，類型檢查是編譯時
 788: 
 789: 2. **構建驗證**：
 790:    - 每個階段完成後立即驗證構建
 791:    - 及早發現和修復問題
 792: 
 793: 3. **代碼規範**：
 794:    - 嚴格遵循項目規範（SHARED_IMPORTS, Signals, Typed Forms）
 795:    - 保持代碼風格一致性
 796: 
 797: ### 相關文檔
 798: - [實施完成總結](./账户系统MVP实施完成总结.md) ⭐ 詳細記錄
 799: - [歷史紀錄](./fyi-history.md#2025-01-15-賬戶系統-mvp-實施完成) - 實施記錄
 800: - [專案路線圖](./44-專案路線圖.md) - 更新狀態
 801: 
 802: ---
 803: 
 804: ## 2025-01-15: 賬戶系統 RLS 策略驗證和完善
 805: 
 806: ### 背景
 807: 根據安全規範和架構要求，需要為賬戶系統的 4 張表（accounts, teams, team_members, organization_schedules）建立完整的 RLS 策略，確保數據訪問權限正確。
 808: 
 809: ### 設計決策
 810: 
 811: #### RLS 策略設計原則
 812: - **最小權限原則**：用戶只能訪問自己或所屬組織的數據
 813: - **角色分離**：團隊負責人和組織管理員有額外權限
 814: - **操作分離**：SELECT、INSERT、UPDATE、DELETE 分別控制
 815: 
 816: #### 策略實施方式
 817: - 使用 Supabase MCP 工具進行遷移
 818: - 先刪除舊策略（如果存在），再創建新策略
 819: - 所有策略使用 `{public}` 角色（適用於所有認證用戶）
 820: 
 821: ### 實施細節
 822: 
 823: #### accounts 表策略
 824: - **SELECT**：用戶可查看自己的賬戶或所屬的組織賬戶
 825: - **INSERT**：用戶可創建自己的賬戶
 826: - **UPDATE**：用戶可更新自己的賬戶，組織管理員可更新組織賬戶
 827: 
 828: #### teams 表策略
 829: - **SELECT**：組織成員可查看組織的團隊
 830: - **INSERT**：組織管理員可創建團隊
 831: - **UPDATE**：團隊負責人可更新團隊
 832: - **DELETE**：組織管理員可刪除團隊
 833: 
 834: #### team_members 表策略
 835: - **SELECT**：團隊成員可查看成員列表
 836: - **INSERT**：團隊負責人可添加成員
 837: - **UPDATE**：團隊負責人可更新成員角色
 838: - **DELETE**：團隊負責人可移除成員，或成員可自己退出
 839: 
 840: #### organization_schedules 表策略
 841: - **SELECT**：組織成員可查看排班
 842: - **INSERT**：組織管理員可創建排班
 843: - **UPDATE**：組織管理員可更新排班
 844: - **DELETE**：組織管理員可刪除排班
 845: 
 846: ### 驗證結果
 847: - ✅ 共創建 15 個 RLS 策略
 848: - ✅ 覆蓋所有操作類型（SELECT/INSERT/UPDATE/DELETE）
 849: - ✅ 構建驗證通過
 850: 
 851: ---
 852: 
 853: ## 2025-01-15: 組織協作系統 - 數據模型和 Repository 層實施
 854: 
 855: ### 背景
 856: 根據項目路線圖，組織協作系統是繼賬戶系統之後的第二個模組。需要完成數據模型層和 Repository 層開發，為後續 Service 層和 UI 層開發奠定基礎。
 857: 
 858: ### 設計決策
 859: 
 860: #### 分層架構遵循
 861: - **Core 層**：定義枚舉類型（CollaborationType, CollaborationStatus, InvitationStatus）
 862: - **Shared 層**：定義數據模型類型（OrganizationCollaboration, CollaborationInvitation, CollaborationMember）
 863: - **Repository 層**：繼承 BaseRepository，提供業務查詢方法
 864: 
 865: #### 代碼風格一致性
 866: - 參考賬戶系統的實現方式
 867: - 使用相同的命名規範和代碼結構
 868: - 遵循 Angular 20 最佳實踐
 869: 
 870: ### 實施細節
 871: 
 872: #### 類型定義（Core 層）
 873: - **CollaborationType**：contractor/subcontractor/consultant/partner
 874: - **CollaborationStatus**：pending/active/suspended/ended
 875: - **InvitationStatus**：pending/accepted/rejected/expired
 876: 
 877: #### Repository 實現
 878: - **OrganizationCollaborationRepository**：6 個查詢方法
 879:   - findByBlueprintId, findByOwnerOrgId, findByCollaboratorOrgId
 880:   - findByCollaborationType, findByStatus
 881: - **CollaborationInvitationRepository**：6 個查詢方法
 882:   - findByBlueprintId, findByFromOrgId, findByToOrgId
 883:   - findByStatus, findExpired, findPending
 884: - **CollaborationMemberRepository**：3 個查詢方法
 885:   - findByCollaborationId, findByAccountId, findByRole
 886: 
 887: ### 驗證結果
 888: - ✅ 無 Lint 錯誤
 889: - ✅ 類型檢查通過
 890: - ✅ 構建驗證通過（`yarn build` 成功）
 891: 
 892: ### 相關文檔
 893: - [實施完成總結](./组织协作系统-数据模型和Repository层实施总结.md) ⭐ 詳細記錄
 894: - [歷史紀錄](./fyi-history.md#2025-01-15-組織協作系統-數據模型和-repository-層實施) - 實施記錄
 895: - [專案路線圖](./44-專案路線圖.md) - 更新狀態
 896: 
 897: ---
 898: 
 899: ## 2025-01-15: accounts 表 RLS 遞歸問題修復
 900: 
 901: ### 背景
 902: 在驗證 accounts 表查詢功能時，發現查詢返回 500 錯誤，錯誤信息為 `"infinite recursion detected in policy for relation \"accounts\""`。這是 RLS 策略設計問題，需要修復。
 903: 
 904: ### 技術選型
 905: 
 906: #### 解決方案選擇
 907: - **方案**：使用 SECURITY DEFINER 函數
 908: - **來源**：Supabase 官方文檔推薦方法
 909: - **參考**：[Row Level Security 文檔](https://supabase.com/docs/guides/database/postgres/row-level-security#use-security-definer-functions)
 910: 
 911: #### 為什麼選擇 SECURITY DEFINER 函數？
 912: 1. **官方推薦**：Supabase 官方文檔明確推薦此方法處理 RLS 遞歸問題
 913: 2. **標準做法**：這是 PostgreSQL 處理 RLS 遞歸的標準方法
 914: 3. **安全性**：函數以創建者權限執行，可以繞過 RLS 檢查，但通過 `set search_path = ''` 防止注入攻擊
 915: 4. **性能**：避免重複的 RLS 檢查，提高查詢性能
 916: 
 917: ### 設計決策
 918: 
 919: #### private schema 設計
 920: - **位置**：創建 `private` schema 存放安全函數
 921: - **原因**：private schema 不應該在 "Exposed schemas" 中，確保安全性
 922: - **優勢**：函數不會被外部直接訪問，只能通過 RLS 策略調用
 923: 
 924: #### SECURITY DEFINER 函數設計
 925: - **函數命名**：`is_user_org_member`, `is_user_org_admin`
 926: - **參數設計**：明確的參數類型（UUID），避免類型轉換
 927: - **安全措施**：使用 `set search_path = ''` 防止 search_path 注入攻擊
 928: - **性能優化**：在 RLS 策略中使用 `(select private.function_name())` 包裝，確保函數只執行一次
 929: 
 930: #### RLS 策略更新
 931: - **策略更新方式**：先刪除舊策略，再創建新策略
 932: - **策略表達式**：使用 `(select private.function_name())` 包裝函數調用
 933: - **向後兼容**：保持策略的邏輯不變，只是實現方式改變
 934: 
 935: ### 權衡與取捨
 936: 
 937: #### 安全性 vs 性能
 938: - **選擇**：使用 SECURITY DEFINER 函數，以創建者權限執行
 939: - **權衡**：函數具有較高權限，但通過 `set search_path = ''` 和放在 private schema 中確保安全
 940: - **結果**：既解決了遞歸問題，又保證了安全性
 941: 
 942: #### 策略複雜度 vs 可維護性
 943: - **選擇**：將複雜的權限檢查邏輯提取到函數中
 944: - **權衡**：策略變得更簡潔，但需要維護額外的函數
 945: - **結果**：策略更易讀，函數可以重用
 946: 
 947: ### 實施細節
 948: 
 949: #### 函數實現
 950: ```sql
 951: -- 檢查用戶是否是組織成員
 952: create or replace function private.is_user_org_member(
 953:   org_account_id UUID, 
 954:   user_auth_id UUID
 955: )
 956: returns boolean
 957: language plpgsql
 958: security definer
 959: set search_path = ''
 960: as $$
 961: begin
 962:   return exists (
 963:     select 1
 964:     from public.team_members tm
 965:     join public.teams t on tm.team_id = t.id
 966:     join public.accounts a on tm.account_id = a.id
 967:     where t.organization_id = org_account_id
 968:       and a.auth_user_id = user_auth_id
 969:   );
 970: end;
 971: $$;
 972: ```
 973: 
 974: #### 策略更新
 975: ```sql
 976: -- 更新 SELECT 策略
 977: create policy "Users can view own account or organization accounts they belong"
 978: on accounts for select
 979: to authenticated
 980: using (
 981:   (select auth.uid()) = auth_user_id
 982:   OR (
 983:     type = 'Organization'
 984:     AND (select private.is_user_org_member(id, auth.uid()))
 985:   )
 986: );
 987: ```
 988: 
 989: ### 經驗總結
 990: 
 991: #### 成功經驗
 992: 1. **參考官方文檔**：查閱 Supabase 官方文檔找到標準解決方案
 993: 2. **問題診斷**：正確識別問題根源（RLS 策略遞歸）
 994: 3. **驗證方法**：使用 MCP 工具進行端到端驗證
 995: 
 996: #### 教訓
 997: 1. **不要復原正確的修復**：如果修復方案是正確的（符合官方最佳實踐），不應該復原
 998: 2. **區分問題和解決方案**：
 999:    - **問題 1**：註冊時沒有創建 account 記錄（已通過觸發器解決）
1000:    - **問題 2**：accounts 表的 RLS 策略有遞歸問題（需要 SECURITY DEFINER 函數解決）
1001: 3. **兩個問題是獨立的**：即使 account 記錄已創建，RLS 策略的遞歸問題仍然存在
1002: 
1003: ### 相關文檔
1004: - [工作總結-完整流程-accounts-RLS修復-2025-01-15.md](./工作總結-完整流程-accounts-RLS修復-2025-01-15.md) ⭐ 詳細記錄
1005: - [Supabase-RLS遞歸問題處理方法.md](./Supabase-RLS遞歸問題處理方法.md) ⭐ 官方方法
1006: - [工作總結-修復失敗原因分析-2025-01-15.md](./工作總結-修復失敗原因分析-2025-01-15.md) ⭐ 問題分析
1007: 
1008: ---
1009: 
1010: **最後更新**：2025-01-15  
1011: **維護者**：開發團隊
`````

## File: docs/ArchivedDocuments/fyi-history.md
`````markdown
  1: # 歷史紀錄 (FYI - History)
  2: 
  3: > 參考：[@fyi.md](./fyi.md)
  4: 
  5: 記錄專案的時間線：版本演進、重大改動、里程碑紀錄、技術重構歷史等。
  6: 
  7: ---
  8: 
  9: ## 📅 時間線總覽
 10: 
 11: ### 2025-01-15
 12: - ✅ 實施階段 1 - 權限服務模組（core/permissions/）
 13: - ✅ 文檔一致性更新 v2.0
 14: - ✅ 基礎 RLS 策略實施（51 張表）
 15: - ✅ 開發順序決策 - 先開發賬戶系統（使用 Sequential Thinking + Software Planning Tool）
 16: - ✅ 基礎設施模組實施（core/infra/）- Repository 模式、類型定義、錯誤處理、數據轉換
 17: - ✅ 賬戶系統實施（9 個任務）- 數據模型層、Repository 層、Service 層、路由層
 18: - ✅ 賬戶系統架構違規修復 - 修復 core 依賴 shared 的架構違規，修復路徑別名使用錯誤
 19: - ⏳ 規劃階段 - 賬戶系統後續完善（詳情、編輯、創建頁面）
 20: - ✅ 專案路線圖建立（[44-專案路線圖.md](./44-專案路線圖.md)）- 記錄開發計劃與里程碑
 21: - ✅ **賬戶系統完整評估**（2025-01-15）- 使用 Sequential Thinking + Software Planning Tool 完成系統性評估，識別已完成和缺失功能，更新實施計劃
 22: - ✅ **賬戶系統 MVP 實施完成**（2025-01-15）- 完成 Service 層、UI 層和路由配置，所有核心功能已實現，構建通過
 23: - ✅ **賬戶系統 RLS 策略驗證和完善**（2025-01-15）- 使用 Supabase MCP 工具驗證和完善 4 張表的 RLS 策略（accounts, teams, team_members, organization_schedules），共創建 15 個策略，構建驗證通過
 24: - ✅ **組織協作系統 - 數據模型和 Repository 層實施**（2025-01-15）- 完成組織協作系統的數據模型層和 Repository 層開發，包括 3 個 Repository（OrganizationCollaborationRepository, CollaborationInvitationRepository, CollaborationMemberRepository），構建驗證通過
 25: - ✅ **組織協作系統 - Service 層和 UI 層實施**（2025-01-15）- 完成組織協作系統的 Service 層（CollaborationService, InvitationService）和核心 UI 層（CollaborationListComponent）開發，構建驗證通過
 26: - ✅ **accounts 表 RLS 遞歸問題修復**（2025-01-15）- 使用 Supabase 官方推薦的 SECURITY DEFINER 函數方法修復 accounts 表 RLS 策略遞歸問題，創建 2 個輔助函數，更新 SELECT 和 UPDATE 策略，驗證修復成功
 27: 
 28: ### 2025-11-14
 29: - ✅ Supabase 與 @delon/auth 整合
 30: - ✅ 註冊功能改為 Supabase Auth，移除手機號登入
 31: - ✅ 移除社交登入功能（其他登入方式、Auth0）
 32: - ✅ 項目結構重構規劃
 33: - ✅ **全站路由骨架鋪設**（2025-11-14）
 34:   - ✅ 依據 `app-data.json` 建立 communication、analytics、documents、bots、system 等 5 大模組的路由與頁面骨架（共 28 個 Standalone Components）
 35:   - ✅ 所有頁面採用 `page-header + nz-card + nz-alert + nz-empty` 模板，確保一致的 NG-ALAIN 體驗與可訪問性提示
 36:   - ✅ 更新 `src/app/routes/routes.ts`，主框架可導航至所有菜單節點，不再出現 404
 37:   - ✅ 更新 `docs/路由页面创建总结-2025-01-15.md`，同步紀錄骨架狀態
 38:   - ⚠️ `yarn lint` 仍受舊有 ESLint `project/projectService` 設定衝突阻塞，待後續調整
 39: - ✅ **藍圖系統完整實施**（2025-11-14）
 40:   - ✅ 數據模型層設計（5 個類型定義、4 個枚舉）
 41:   - ✅ Repository 層實施（5 個 Repository，20+ 個查詢方法）
 42:   - ✅ Service 層實施（3 個 Service，Git-like 分支邏輯）
 43:   - ✅ UI 層實施（5 個頁面組件）
 44:   - ✅ RLS 權限驗證（5 張表，20 個策略）
 45:   - ✅ 構建驗證通過
 46: 
 47: ---
 48: 
 49: ## 🏷️ 版本演進
 50: 
 51: ### v20.1.0 (當前版本)
 52: - **技術棧**：Angular 20.3.x + NG-ZORRO 20.3.x + NG-ALAIN 20.0.x + Supabase
 53: - **包管理器**：Yarn 4.9.2
 54: - **狀態**：開發中
 55: 
 56: ---
 57: 
 58: ## 🎯 里程碑紀錄
 59: 
 60: ### 里程碑 1：核心架構建立 (2025-01-15)
 61: - ✅ 完成 Git-like 分支模型架構設計
 62: - ✅ 完成 51 張資料表結構定義
 63: - ✅ 完成文檔體系建立
 64: 
 65: ### 里程碑 2：權限系統實施 (2025-01-15)
 66: - ✅ 完成 RBAC 權限控制系統
 67: - ✅ 整合 @delon/acl 和 Supabase
 68: - ✅ 實現 Git-like 分支權限控制
 69: 
 70: ### 里程碑 3：認證系統整合 (2025-11-14)
 71: - ✅ 完成 Supabase Auth 與 @delon/auth 整合
 72: - ✅ 實現零破壞性適配器模式
 73: - ✅ 完成 Session 同步機制
 74: 
 75: ### 里程碑 4：開發順序規劃 (2025-01-15)
 76: - ✅ 使用 Sequential Thinking 分析依賴關係
 77: - ✅ 決策先開發賬戶系統（基礎層）而非藍圖系統（業務層）
 78: - ✅ 使用 Software Planning Tool 創建賬戶系統實施計劃
 79: - ⏳ 待實施：賬戶系統開發（10 個任務）
 80: 
 81: ### 里程碑 5：基礎設施模組建立 (2025-01-15)
 82: - ✅ 完成 TypeScript 類型定義生成（51 張表）
 83: - ✅ 建立統一錯誤處理機制
 84: - ✅ 建立數據轉換工具（snake_case ↔ camelCase）
 85: - ✅ 建立基礎 Repository 類（BaseRepository）
 86: - ✅ 建立 BlueprintRepository 示例
 87: - ✅ 完成模組導出和文檔編寫
 88: - ✅ 構建驗證通過
 89: 
 90: ### 里程碑 5.1：賬戶系統完整評估 (2025-01-15)
 91: - ✅ 使用 Sequential Thinking 進行系統性分析
 92: - ✅ 使用 Software Planning Tool 創建完整實施計劃
 93: - ✅ 完成 Repository 層評估（100% 完成）
 94: - ✅ 完成類型定義評估（100% 完成，架構合規）
 95: - ✅ 完成 Service 層評估（66% 完成，缺 OrganizationScheduleService）
 96: - ✅ 完成路由和組件評估（16% 完成，缺 5 個頁面組件）
 97: - ✅ 完成架構合規性驗證（100% 合規）
 98: - ✅ 識別測試覆蓋缺失（0% 完成）
 99: - ✅ 更新實施計劃（12 個任務，分 6 個階段）
100: 
101: ### 里程碑 5.2：賬戶系統 MVP 實施完成 (2025-01-15)
102: - ✅ 創建 OrganizationScheduleService（Service 層 100% 完成）
103: - ✅ 創建 AccountDetailComponent（賬戶詳情頁面）
104: - ✅ 創建 AccountFormComponent（賬戶創建/編輯表單）
105: - ✅ 創建 TeamListComponent（團隊列表頁面）
106: - ✅ 創建 TeamDetailComponent（團隊詳情頁面）
107: - ✅ 創建 ScheduleListComponent（排班列表頁面）
108: - ✅ 完善路由配置（所有路由已配置）
109: - ✅ 修復構建錯誤（字段名匹配問題）
110: - ✅ 構建驗證通過（`yarn build` 成功）
111: - ✅ 總體進度：約 85% 完成（核心功能已實現）
112: 
113: ### 里程碑 5.3：賬戶系統 RLS 策略驗證和完善 (2025-01-15)
114: - ✅ 使用 Supabase MCP 工具檢查當前 RLS 狀態
115: - ✅ 完善 accounts 表 RLS 策略（支持組織成員訪問組織賬戶）
116: - ✅ 創建 teams 表 RLS 策略（4 個策略：SELECT/INSERT/UPDATE/DELETE）
117: - ✅ 創建 team_members 表 RLS 策略（4 個策略）
118: - ✅ 創建 organization_schedules 表 RLS 策略（4 個策略）
119: - ✅ 共創建 15 個 RLS 策略，覆蓋所有操作類型
120: - ✅ 構建驗證通過（`yarn build` 成功）
121: - ✅ 詳細記錄：→ [组织协作系统-数据模型和Repository层实施总结.md](./组织协作系统-数据模型和Repository层实施总结.md)
122: 
123: ### 里程碑 5.4：組織協作系統 - 數據模型和 Repository 層實施 (2025-01-15)
124: - ✅ 創建 Core 層類型定義（collaboration.types.ts）- 3 個枚舉
125: - ✅ 創建 Shared 層數據模型（collaboration/types.ts）- 3 個類型定義
126: - ✅ 創建 OrganizationCollaborationRepository（6 個查詢方法）
127: - ✅ 創建 CollaborationInvitationRepository（6 個查詢方法）
128: - ✅ 創建 CollaborationMemberRepository（3 個查詢方法）
129: - ✅ 更新模組導出文件（types/index.ts, repositories/index.ts, models/index.ts）
130: - ✅ 構建驗證通過（`yarn build` 成功）
131: - ✅ 詳細記錄：→ [组织协作系统-数据模型和Repository层实施总结.md](./组织协作系统-数据模型和Repository层实施总结.md)
132: 
133: ---
134: 
135: ## 🔄 重大改動
136: 
137: ### 2025-01-15: 實施階段 1 - 權限服務模組
138: 
139: #### 背景
140: 根據 PRD 要求和 Git-like 分支模型架構，需要實現完整的 RBAC 權限控制系統。
141: 
142: #### 實施內容
143: - ✅ 創建 `core/permissions/` 模組
144:   - `types.ts` - 權限相關類型定義
145:   - `permission.service.ts` - 權限檢查服務
146:   - `role.service.ts` - 角色管理服務
147: - ✅ 整合 @delon/acl 作為本地權限緩存
148: - ✅ 實現內存緩存策略（5 分鐘 TTL）
149: - ✅ 實現 Git-like 分支權限檢查方法
150: - ✅ 整合到 `startup.service.ts` 自動同步權限
151: 
152: #### 技術決策
153: - 使用適配器模式整合 @delon/acl
154: - 內存緩存 + ACLService 雙層緩存策略
155: - 完整的 TypeScript 類型定義
156: 
157: #### 影響範圍
158: - `core/permissions/` - 新增模組
159: - `core/startup/startup.service.ts` - 整合權限同步
160: - `core/index.ts` - 導出權限服務
161: 
162: #### 驗證結果
163: - ✅ 編譯成功：所有檔案通過 TypeScript 編譯
164: - ✅ 無 Lint 錯誤：所有檔案通過 ESLint 檢查
165: - ✅ 類型安全：完整的 TypeScript 類型支持
166: 
167: ---
168: 
169: ### 2025-11-14: Supabase 與 @delon/auth 整合
170: 
171: #### 背景
172: 專案需要整合 Supabase 作為後端服務，同時保留現有的 `@delon/auth` 認證系統。
173: 
174: #### 實施內容
175: - ✅ 創建 `core/supabase/` 模組
176:   - `supabase.service.ts` - Supabase 客戶端服務
177:   - `supabase-auth-adapter.service.ts` - 認證適配器服務
178: - ✅ 實現適配器模式，零破壞性整合
179: - ✅ 實現 Session 自動同步機制
180: - ✅ 配置 Session 持久化和自動刷新
181: 
182: #### 技術決策
183: - 使用適配器模式橋接 Supabase Auth 與 @delon/auth
184: - 自動將 Supabase Session 轉換為 @delon/auth Token 格式
185: - 保留所有現有的 @delon/auth 使用方式
186: 
187: #### 影響範圍
188: - `core/supabase/` - 新增模組
189: - `core/startup/startup.service.ts` - 整合 Supabase 初始化
190: - `app.config.ts` - 配置 Supabase 服務
191: - `routes/passport/login/login.component.ts` - 使用 Supabase 登入
192: 
193: #### 驗證結果
194: - ✅ 編譯成功：`yarn build` 通過
195: - ✅ 無 Lint 錯誤：所有檔案通過 ESLint 檢查
196: - ✅ 類型安全：完整的 TypeScript 類型支持
197: 
198: ---
199: 
200: ### 2025-11-14: 註冊功能改為 Supabase Auth，移除手機號登入
201: 
202: #### 背景
203: 將註冊功能改為使用 Supabase Auth，並移除登入頁面的手機號登入功能，統一使用 Email/Password 認證方式。
204: 
205: #### 實施內容
206: - ✅ 修改 `routes/passport/register/register.component.ts`
207:   - 移除手機號、驗證碼欄位
208:   - 使用 `SupabaseAuthAdapterService.signUp()`
209: - ✅ 修改 `routes/passport/login/login.component.ts`
210:   - 移除 Tab 切換邏輯
211:   - 簡化為單一 Email/Password 登入表單
212: - ✅ 更新 UI，移除手機號登入相關元素
213: 
214: #### 影響範圍
215: - `routes/passport/register/` - 註冊組件
216: - `routes/passport/login/` - 登入組件
217: 
218: #### 驗證結果
219: - ✅ 編譯成功：`yarn build` 通過
220: - ✅ 無 Lint 錯誤：所有檔案通過 ESLint 檢查
221: - ✅ UI 簡化：登入頁面更加簡潔
222: 
223: ---
224: 
225: ### 2025-11-14: 移除社交登入功能
226: 
227: #### 背景
228: 移除登入頁面的社交登入功能，包括"其他登入方式"區塊和 Auth0、GitHub、Weibo 等第三方登入選項。
229: 
230: #### 實施內容
231: - ✅ 移除 `SocialService` 相關代碼
232: - ✅ 移除社交登入 UI 元素
233: - ✅ 保留註冊連結
234: 
235: #### 影響範圍
236: - `routes/passport/login/` - 登入組件
237: 
238: #### 驗證結果
239: - ✅ 編譯成功：`yarn build` 通過
240: - ✅ 無 Lint 錯誤：所有檔案通過 ESLint 檢查
241: - ✅ UI 簡化：登入頁面更加簡潔
242: 
243: ---
244: 
245: ### 2025-01-15: 項目結構重構規劃
246: 
247: #### 背景
248: 基於 51 張資料表的 11 個業務模組分類，需要重構項目文件夾結構。
249: 
250: #### 實施內容
251: - ✅ 創建 `docs/04-重構後結構樹.md`
252:   - 完整的項目文件夾結構樹文檔
253:   - 51 張資料表映射到 11 個業務模組
254:   - 業務模組與 Routes 路徑的對應關係
255: 
256: #### 影響範圍
257: - 文檔體系建立
258: - 為後續重構提供藍圖
259: 
260: ---
261: 
262: ### 2025-01-15: 基礎 RLS 策略實施
263: 
264: #### 背景
265: 根據開發前檢查清單，所有 51 張資料表的 RLS 都是 `false`，需要啟用 RLS 確保基本安全性。考慮到開發過程會不斷調整，決定先建立基礎 RLS 策略。
266: 
267: #### 實施內容
268: - ✅ 為所有 51 張表啟用 RLS
269: - ✅ 建立基礎策略：
270:   - accounts 表：用戶只能操作自己的帳戶
271:   - blueprints 表：擁有者可以操作，已認證用戶可以查看
272:   - 其他核心表：基礎 SELECT 策略（已認證用戶）
273:   - 個人資料表：用戶級別策略
274: - ✅ 使用 Supabase MCP 工具執行遷移
275: - ✅ 驗證 RLS 已正確啟用
276: 
277: #### 技術決策
278: - 分階段實施：先建立基礎策略，後續逐步完善
279: - 策略命名規範：`[操作]_[表名]_[描述]`
280: - 註釋說明：標註 `TODO` 後續調整點
281: 
282: #### 影響範圍
283: - 所有 51 張資料表
284: - 資料庫安全性基礎建立
285: 
286: #### 驗證結果
287: - ✅ 遷移成功執行
288: - ✅ RLS 已正確啟用（驗證 accounts, blueprints, tasks, roles, permissions 表）
289: - ✅ 基礎策略已建立
290: 
291: #### 後續計劃
292: - 根據業務需求逐步完善策略
293: - 整合角色系統（user_roles 表）
294: - 實現 Git-like 分支權限控制
295: - 參考 `docs/21-安全與-RLS-權限矩陣.md` 建立詳細策略
296: 
297: ---
298: 
299: ## 🔧 技術重構歷史
300: 
301: ### 架構重構：Git-like 分支模型
302: - **時間**：2025-01-15
303: - **原因**：需要實現類似 Git 的分支管理機制
304: - **影響**：整個系統架構設計
305: - **結果**：完成 51 張資料表結構定義，11 個模組劃分
306: 
307: ### 權限系統重構：RBAC 實施
308: - **時間**：2025-01-15
309: - **原因**：需要完整的權限控制系統
310: - **影響**：所有需要權限驗證的功能
311: - **結果**：完成權限服務模組，整合 @delon/acl
312: 
313: ### 認證系統重構：Supabase 整合
314: - **時間**：2025-11-14
315: - **原因**：需要 Supabase 作為後端服務
316: - **影響**：認證流程
317: - **結果**：完成適配器模式整合，零破壞性遷移
318: 
319: ### UI 簡化：統一認證方式
320: - **時間**：2025-11-14
321: - **原因**：簡化認證流程，降低維護成本
322: - **影響**：登入/註冊頁面
323: - **結果**：統一使用 Email/Password 認證
324: 
325: ---
326: 
327: ## ✅ 已完成事項
328: 
329: ### 核心模組
330: - [x] 權限服務模組（core/permissions/）
331:   - [x] 權限檢查服務
332:   - [x] 角色管理服務
333:   - [x] 類型定義
334:   - [x] 與 @delon/acl 整合
335:   - [x] 內存緩存策略
336:   - [x] Git-like 分支權限檢查
337: 
338: - [x] Supabase 整合（core/supabase/）
339:   - [x] Supabase 客戶端服務
340:   - [x] 認證適配器服務
341:   - [x] Session 同步機制
342:   - [x] 零破壞性整合
343: 
344: - [x] 基礎 RLS 策略實施
345:   - [x] 所有 51 張表啟用 RLS
346:   - [x] 核心表基礎策略建立
347:   - [x] 個人資料表用戶級別策略
348: 
349: ### 文檔體系
350: - [x] 核心架構文檔
351:   - [x] PRD 文檔
352:   - [x] 完整架構流程圖
353:   - [x] 架構審查報告
354:   - [x] 完整 SQL 表結構定義（51 張表）
355: 
356: - [x] 開發文檔
357:   - [x] 開發作業指引
358:   - [x] 專案結構說明
359:   - [x] 資料模型對照表
360:   - [x] 狀態枚舉值定義
361:   - [x] SHARED_IMPORTS 使用指南
362: 
363: - [x] 規範文檔
364:   - [x] 代碼質量規範
365:   - [x] 測試規範
366:   - [x] 安全規範
367:   - [x] 性能優化規範
368: 
369: ### 開發工具
370: - [x] ESLint 配置
371: - [x] Stylelint 配置
372: - [x] Prettier 配置
373: - [x] Husky Git Hooks
374: - [x] lint-staged 配置
375: - [x] TypeScript 嚴格模式
376: 
377: ---
378: 
379: ## 📝 待完成事項
380: 
381: ### 核心模組
382: - [ ] **賬戶系統開發**（Phase 1 MVP - 優先）
383:   - [x] 基礎目錄結構創建（shared/models/, shared/services/）
384:   - [x] 架構決策確認（Repository 位置、Service 位置）
385:   - [ ] 數據模型層（shared/models/account/types.ts）
386:   - [ ] Repository 層（core/infra/repositories/account.repository.ts）
387:   - [ ] 服務層 - AccountService（shared/services/account/）
388:   - [ ] 服務層 - TeamService（shared/services/account/）
389:   - [ ] 路由層 - 賬戶列表/詳情/編輯頁面
390:   - [ ] 路由層 - 團隊管理頁面
391:   - [ ] 路由配置
392:   - [ ] RLS 權限驗證
393:   - [ ] 單元測試（目標 80% 覆蓋率）
394:   - [ ] 集成測試和文檔更新
395: - [ ] 完善 RLS 策略（根據業務需求逐步細化）
396: - [ ] 權限守衛（core/guards/permission.guard.ts）
397: - [ ] 活動記錄整合（activity_logs）
398: - [ ] 權限管理 UI（角色管理、權限分配）
399: 
400: ### 測試
401: - [ ] 權限服務單元測試（目標 80% 覆蓋率）
402: - [ ] Supabase 服務單元測試
403: - [ ] E2E 測試
404: 
405: ### 文檔
406: - [ ] API 接口詳細文檔完善
407: - [ ] 部署指南更新
408: - [ ] 性能優化指南更新
409: 
410: ---
411: 
412: ## 📚 相關文檔
413: 
414: - [專案路線圖](./44-專案路線圖.md) - **專案開發路線圖與里程碑** ⭐ 新增
415: - [開發脈絡記錄](./fyi-development.md) - 詳細的開發決策記錄
416: - [架構說明](./fyi-architecture.md) - 系統架構設計
417: - [上下文](./fyi-context.md) - Domain 用語和業務背景
418: - [PRD 文檔](./PRD.md) - 產品需求文檔
419: - [完整架構流程圖](./27-完整架構流程圖.mermaid.md) - 系統架構圖
420: - [架構審查報告](./28-架構審查報告.md) - 架構設計說明
421: 
422: ---
423: 
424: ---
425: 
426: ## 2025-01-15：賬戶系統架構評估與基礎結構創建
427: 
428: ### 完成工作
429: - ✅ 代碼結構評估（BaseRepository、數據轉換工具、錯誤處理）
430: - ✅ 基礎目錄結構創建（shared/models/, shared/services/）
431: - ✅ 架構決策重新評估（Repository 和 Service 位置確認）
432: - ✅ 實施計劃調整（採用 Repository 模式）
433: 
434: ### 關鍵決策
435: - **Repository 位置**：`core/infra/repositories/`（基礎設施層）
436: - **Service 位置**：`shared/services/account/`（共享層，使用 Repository）
437: - **Models 位置**：`shared/models/account/`（共享層）
438: 
439: ### 決策反覆過程
440: 經過三次評估，最終確定採用 Repository 模式，充分利用現有基礎設施。詳細過程見 [開發脈絡記錄](./fyi-development.md#2025-01-15賬戶系統架構決策反覆)。
441: 
442: ### 相關文檔
443: - [結構評估總結](./賬戶系統開發-結構評估總結.md) - 詳細的評估過程和決策記錄
444: 
445: ---
446: 
447: ## 2025-01-15: 賬戶系統架構違規修復
448: 
449: ### 背景
450: 在賬戶系統實施過程中，發現了架構依賴違規和路徑別名使用錯誤的問題。這些問題違反了項目的分層架構原則，需要立即修復。
451: 
452: ### 問題描述
453: 1. **架構依賴違規**：
454:    - `core/infra/repositories/account.repository.ts` 導入 `@shared` 的 `AccountType` 和 `AccountStatus`
455:    - `core/infra/repositories/team-member.repository.ts` 導入 `@shared` 的 `TeamMemberRole`
456:    - 違反了分層架構：`routes → shared → core`，`core` 不應該依賴 `shared`
457: 
458: 2. **路徑別名使用錯誤**：
459:    - 使用 `@core/infra/repositories/team.repository` 深層路徑
460:    - 路徑別名只配置到 `@core` 和 `@shared`，不支持深層路徑
461:    - 導致 TypeScript 編譯錯誤
462: 
463: ### 修復方案
464: 1. **將枚舉類型移到 core 層**：
465:    - 創建 `core/infra/types/account.types.ts`
466:    - 將 `AccountType`、`AccountStatus`、`TeamMemberRole` 移到 core 層
467:    - Repository 層使用相對路徑導入
468: 
469: 2. **修復路徑別名使用**：
470:    - 統一使用根導出：`import { TeamRepository } from '@core'`
471:    - core 層內部使用相對路徑
472:    - 確保所有類型都從根導出文件導出
473: 
474: 3. **保持向後兼容**：
475:    - 在 `shared/models/account/types.ts` 重新導出 core 層的類型
476:    - 現有代碼無需修改
477: 
478: ### 修復結果
479: - ✅ 架構合規：core 不依賴 shared
480: - ✅ 路徑別名：所有導入使用根導出
481: - ✅ 類型安全：無類型錯誤
482: - ✅ Lint 檢查：無錯誤
483: - ✅ 向後兼容：現有代碼無需修改
484: 
485: ### 相關文檔
486: - [賬戶系統架構違規修復總結](./賬戶系統架構違規修復總結.md) ⭐ 詳細修復記錄
487: - [問題與挑戰記錄](./fyi-challenges.md#2025-01-15-賬戶系統架構違規修復)
488: - [開發脈絡記錄](./fyi-development.md#2025-01-15-賬戶系統架構違規修復)
489: 
490: ---
491: 
492: ## 2025-01-15: 賬戶系統 MVP 實施完成
493: 
494: ### 背景
495: 在完成系統性評估後，使用 Sequential Thinking + Software Planning Tool 推進實施，完成了賬戶系統 MVP 的核心功能。
496: 
497: ### 實施內容
498: 
499: #### Service 層完成
500: - ✅ **OrganizationScheduleService**：創建完整的排班管理服務
501:   - 使用 Signals 管理狀態
502:   - 提供 CRUD 和查詢方法
503:   - 暴露 ReadonlySignal 給組件
504: 
505: #### UI 層完成
506: - ✅ **AccountDetailComponent**：賬戶詳情頁面
507:   - 顯示基本信息、團隊信息、排班信息
508:   - 支持編輯和刪除操作
509:   
510: - ✅ **AccountFormComponent**：賬戶創建/編輯表單
511:   - 支持創建和編輯兩種模式
512:   - 完整的表單驗證
513:   - 使用 Typed Forms 確保類型安全
514: 
515: - ✅ **TeamListComponent**：團隊列表頁面
516:   - 使用 st 表格組件
517:   - 支持 CRUD 操作
518: 
519: - ✅ **TeamDetailComponent**：團隊詳情頁面
520:   - 顯示團隊信息和成員列表
521:   - 支持成員管理和角色變更
522: 
523: - ✅ **ScheduleListComponent**：排班列表頁面
524:   - 顯示排班列表
525:   - 支持刪除操作
526: 
527: #### 路由配置完成
528: - ✅ 配置所有路由：列表、詳情、創建、編輯、團隊、排班
529: 
530: ### 技術決策
531: 
532: #### 字段名處理
533: - 使用 `snake_case` 字段名（`created_at`, `updated_at` 等）
534: - BaseRepository 會自動進行轉換，但類型定義使用原始格式
535: - 組件中統一使用 snake_case 訪問數據
536: 
537: #### 代碼規範
538: - 嚴格遵循 Angular 20 語法（@if, @for, @switch）
539: - 使用 Signals 進行狀態管理
540: - 使用 Typed Forms 確保類型安全
541: - 使用 SHARED_IMPORTS 保持一致性
542: 
543: ### 修復的問題
544: 
545: #### 構建錯誤
546: - **問題**：字段名不匹配（`createdAt` vs `created_at`）
547: - **原因**：類型定義使用 snake_case，但組件使用了 camelCase
548: - **解決**：統一使用 snake_case 字段名訪問數據
549: - **影響**：所有組件文件（6 個文件）
550: 
551: ### 實施結果
552: 
553: #### 完成度統計
554: - ✅ Repository 層：100% 完成（4/4）
555: - ✅ Service 層：100% 完成（3/3）
556: - ✅ UI 層：100% 完成（6/6 核心組件）
557: - ✅ 路由配置：100% 完成
558: - ⚠️ 測試：0% 完成（待後續實施）
559: - ⚠️ RLS 驗證：待驗證
560: 
561: #### 構建驗證
562: - ✅ 所有文件通過 TypeScript 編譯
563: - ✅ 無 lint 錯誤
564: - ✅ 構建成功（`yarn build`）
565: - ⚠️ Bundle 大小警告（3.45 MB，超過 2 MB 預算，屬正常範圍）
566: 
567: ### 影響範圍
568: - 新增文件：7 個
569: - 更新文件：2 個
570: - 總代碼行數：約 1500+ 行
571: 
572: ### 相關文檔
573: - [實施完成總結](./账户系统MVP实施完成总结.md) ⭐ 詳細記錄
574: - [專案路線圖](./44-專案路線圖.md) - 更新狀態
575: - Software Planning Tool - 任務完成狀態
576: 
577: ---
578: 
579: ## 2025-01-15: accounts 表 RLS 遞歸問題修復
580: 
581: ### 背景
582: 在驗證 accounts 表查詢功能時，發現查詢返回 500 錯誤：`"infinite recursion detected in policy for relation \"accounts\""`。這是因為 accounts 表的 RLS 策略中直接查詢 accounts 表，形成循環查詢。
583: 
584: ### 問題診斷
585: 
586: #### 問題根源
587: accounts 表的 SELECT 策略中存在遞歸查詢：
588: ```sql
589: -- 原始策略（有問題）
590: tm.account_id = (
591:   SELECT accounts_1.id
592:   FROM accounts accounts_1  -- ⚠️ 觸發 RLS 檢查，形成遞歸
593:   WHERE accounts_1.auth_user_id = auth.uid()
594: )
595: ```
596: 
597: **遞歸鏈**：
598: - 查詢 `accounts` 表 → 觸發 RLS 策略檢查
599: - 策略中又查詢 `accounts` 表 → 再次觸發 RLS 策略檢查
600: - 無限循環 → 遞歸錯誤
601: 
602: #### 修復過程
603: 1. **第一次修復**：創建了 SECURITY DEFINER 函數，但後來被復原
604: 2. **問題重新發現**：重新驗證時發現問題仍然存在
605: 3. **參考官方文檔**：查閱 Supabase 官方文檔，確認使用 SECURITY DEFINER 函數是標準解決方案
606: 4. **重新實施修復**：創建 private schema 和 SECURITY DEFINER 函數，更新 RLS 策略
607: 
608: ### 實施細節
609: 
610: #### 創建 SECURITY DEFINER 函數
611: - **`private.is_user_org_member`**：檢查用戶是否是組織成員
612: - **`private.is_user_org_admin`**：檢查用戶是否是組織管理員
613: 
614: #### 更新 RLS 策略
615: - 刪除舊的 SELECT 和 UPDATE 策略
616: - 創建新策略使用 SECURITY DEFINER 函數
617: 
618: ### 驗證結果
619: - ✅ 修復前：`GET /rest/v1/accounts?select=*` → 500 Internal Server Error
620: - ✅ 修復後：`GET /rest/v1/accounts?select=*` → 200 OK
621: - ✅ 成功返回用戶的 account 記錄
622: - ✅ 頁面正常顯示數據
623: - ✅ 響應時間：4ms（性能良好）
624: 
625: ### 相關文檔
626: - [工作總結-完整流程-accounts-RLS修復-2025-01-15.md](./工作總結-完整流程-accounts-RLS修復-2025-01-15.md) ⭐ 詳細記錄
627: - [Supabase-RLS遞歸問題處理方法.md](./Supabase-RLS遞歸問題處理方法.md) ⭐ 官方方法
628: - [工作總結-修復失敗原因分析-2025-01-15.md](./工作總結-修復失敗原因分析-2025-01-15.md) ⭐ 問題分析
629: - [工作總結-accounts-RLS修復完成-2025-01-15.md](./工作總結-accounts-RLS修復完成-2025-01-15.md) ⭐ 修復記錄
630: - [工作總結-最終驗證-accounts-RLS修復-2025-01-15.md](./工作總結-最終驗證-accounts-RLS修復-2025-01-15.md) ⭐ 驗證記錄
631: 
632: ---
633: 
634: **最後更新**：2025-01-15  
635: **維護者**：開發團隊
`````

## File: docs/ArchivedDocuments/README.md
`````markdown
  1: # 文檔歸檔區 (Documentation Archive)
  2: 
  3: > **目的**：存放歷史文檔、已完成的工作總結、過期的版本變體，以及臨時分析報告
  4: 
  5: **最後更新**：2025-11-15  
  6: **總文檔數**：61 個歸檔文檔
  7: 
  8: ---
  9: 
 10: ## 📚 歸檔文檔分類
 11: 
 12: ### 1. 📊 架構圖變體（Diagram Variants）
 13: 
 14: 這些是主要架構圖的早期版本或不同佈局版本，已被標準版本取代：
 15: 
 16: - `12-實體關係圖.mermaid-自適應.md` - ER圖自適應佈局版本
 17: - `13-帳戶層流程圖.mermaid-1.md` - 帳戶層流程圖變體版本
 18: - `14-業務流程圖.mermaid-自適應.md` - 業務流程圖自適應佈局版本
 19: - `14-業務流程圖-落地計畫.md` - 業務流程圖實施計畫
 20: 
 21: **使用建議**：參考標準版本（docs/根目錄下的對應文檔）即可。這些變體版本僅供歷史參考。
 22: 
 23: ---
 24: 
 25: ### 2. 📝 工作總結與測試報告（Work Summaries & Test Reports）
 26: 
 27: 完成的開發工作總結，記錄了各個功能模塊的實施過程：
 28: 
 29: #### 2025-11-14 系列
 30: - `工作總結-組織協作系統測試與文檔-2025-11-14.md`
 31: - `工作總結-藍圖系統-RLS權限驗證-2025-11-14.md`
 32: - `工作總結-藍圖系統-Repository層實施-2025-11-14.md`
 33: - `工作總結-藍圖系統-Service層實施-2025-11-14.md`
 34: - `工作總結-藍圖系統-UI層實施-2025-11-14.md`
 35: - `工作總結-藍圖系統完整實施-2025-11-14.md`
 36: - `工作總結-藍圖系統完整實施總結-Markdown.md`
 37: - `工作總結-藍圖系統數據模型層設計-2025-11-14.md`
 38: - `工作總結-賬戶系統-RLS驗證和完善-2025-11-14.md`
 39: - `工作總結-賬戶系統測試與文檔-2025-11-14.md`
 40: - `工作總結-開發工作流程執行-2025-11-14.md`
 41: 
 42: #### 2025-01-15 系列
 43: - `工作總結-2025-01-15-Bot與組織功能完善.md`
 44: - `工作總結-2025-01-15.md`
 45: - `工作總結-RLS修改復原-2025-01-15.md`
 46: - `工作總結-RLS功能測試-2025-01-15.md`
 47: - `工作總結-RLS功能測試完成-2025-01-15.md`
 48: - `工作總結-accounts-RLS修復完成-2025-01-15.md`
 49: - `工作總結-修復失敗原因分析-2025-01-15.md`
 50: - `工作總結-完整工作流程執行-2025-01-15.md`
 51: - `工作總結-完整流程-accounts-RLS修復-2025-01-15.md`
 52: - `工作總結-完整總結-2025-01-15.md`
 53: - `工作總結-完整開發工作流程執行-2025-01-15.md`
 54: - `工作總結-完整開發工作流程執行-2025-01-15-v2.md`
 55: - `工作總結-最終驗證-accounts-RLS修復-2025-01-15.md`
 56: - `工作總結-組織協作系統-RLS驗證-2025-01-15.md`
 57: - `工作總結-自動創建Account機制-2025-01-15.md`
 58: - `工作總結-重新驗證-2025-01-15.md`
 59: 
 60: #### 其他實施總結
 61: - `基础设施模块实施总结.md`
 62: - `基礎-RLS-策略實施總結.md`
 63: - `组织协作系统-Service层和UI层实施总结.md`
 64: - `组织协作系统-数据模型和Repository层实施总结.md`
 65: - `账户系统MVP实施完成总结.md`
 66: - `账户系统开发-结构评估总结.md`
 67: - `账户系统架构违规修复总结.md`
 68: - `路由页面创建总结-2025-01-15.md`
 69: 
 70: **價值**：這些文檔記錄了系統演進的詳細過程，對於了解決策背景和問題解決思路很有幫助。
 71: 
 72: ---
 73: 
 74: ### 3. 📋 策略與分析報告（Strategy & Analysis Reports）
 75: 
 76: 臨時的推進策略和問題分析文檔：
 77: 
 78: - `任务模块推进策略-2025-01-15.md` - 任務模塊推進策略
 79: - `專案推進策略分析-2025-01-15.md` - 專案推進策略分析
 80: - `质量模块推进策略-2025-01-15.md` - 質量模塊推進策略
 81: - `蓝图设计实施计划-2025-01-15.md` - 藍圖設計實施計畫
 82: - `蓝图设计问题分析-2025-01-15.md` - 藍圖設計問題分析
 83: - `開發中模組狀態檢查報告-2025-01-15.md` - 開發中模塊狀態檢查報告
 84: - `路線圖實施推進方案.md` - 路線圖實施推進方案
 85: - `工作總結-項目結構重構規劃.md` - 專案結構重構規劃
 86: 
 87: **用途**：這些是特定時期的策略文檔，已完成或整合到主要文檔中。
 88: 
 89: ---
 90: 
 91: ### 4. 🔍 FYI 歷史版本（FYI Historical Versions）
 92: 
 93: 早期的 FYI 文檔版本，已被根目錄下的最新版本取代：
 94: 
 95: - `fyi.md` - FYI 主索引（舊版）
 96: - `fyi-architecture.md` - 架構說明（舊版）
 97: - `fyi-background.md` - 專案背景（舊版）
 98: - `fyi-challenges.md` - 挑戰說明（舊版）
 99: - `fyi-codebase.md` - 代碼庫說明（舊版）
100: - `fyi-context.md` - 上下文說明（舊版）
101: - `fyi-development.md` - 開發脈絡（舊版，2025-11-14前的完整版）
102: - `fyi-history.md` - 歷史記錄（舊版）
103: - `fyi-notes.md` - 筆記（舊版）
104: - `fyi-performance.md` - 效能說明（舊版）
105: 
106: **參考最新版本**：請查看 `docs/fyi-*.md`（根目錄）獲取最新內容。
107: 
108: ---
109: 
110: ### 5. 📖 其他歷史文檔（Other Historical Documents）
111: 
112: - `02-專案結構樹-差異報告.md` - 專案結構差異報告
113: - `02-專案結構樹-路徑對應檢查.md` - 路徑對應檢查報告
114: - `31-開發前檢查清單-archive.md` - 開發前檢查清單（舊版）
115: - `Supabase-RLS遞歸問題處理方法.md` - RLS 遞歸問題處理
116: 
117: ---
118: 
119: ## 🔄 歸檔原則
120: 
121: 文檔被歸檔的原因通常包括：
122: 
123: 1. **已完成的工作總結** - 記錄特定時期的開發工作，已整合到主要文檔
124: 2. **過期的版本變體** - 被標準版本取代的早期或替代版本
125: 3. **臨時分析報告** - 已完成分析，結論已整合到主要文檔
126: 4. **歷史記錄** - 保留供參考，但不再是當前文檔的一部分
127: 
128: ---
129: 
130: ## 📚 如何使用歸檔文檔
131: 
132: ### 查找歷史決策
133: 如果需要了解某個功能的實施細節或決策背景：
134: 1. 查看對應日期的工作總結文檔
135: 2. 搜索特定關鍵字（如 "RLS"、"藍圖系統"、"帳戶"）
136: 
137: ### 了解演進歷史
138: 如果需要了解系統如何演進到當前狀態：
139: 1. 按日期順序閱讀工作總結
140: 2. 參考實施總結文檔了解各模塊的完整實施過程
141: 
142: ### 參考早期設計
143: 如果需要了解早期設計思路：
144: 1. 查看策略與分析報告
145: 2. 參考架構圖的變體版本
146: 
147: ---
148: 
149: ## ⚠️ 注意事項
150: 
151: 1. **不是當前文檔** - 歸檔文檔可能包含過時的信息，請優先參考根目錄下的最新文檔
152: 2. **僅供參考** - 歸檔文檔主要用於歷史參考和了解演進過程
153: 3. **不要修改** - 歸檔文檔應保持原樣，不應再進行更新
154: 
155: ---
156: 
157: ## 🔗 相關資源
158: 
159: - **當前文檔索引**：[docs/README.md](../README.md)
160: - **文檔清單**：[docs/documentation-inventory.md](../documentation-inventory.md)
161: - **專案脈絡**：[docs/fyi.md](../fyi.md)
162: 
163: ---
164: 
165: **維護者**：開發團隊  
166: **下次審查**：2025-12-15（季度審查，確認是否需要進一步歸檔或清理）
`````

## File: docs/ArchivedDocuments/Repository创建计划.md
`````markdown
  1: # Repository 创建计划
  2: 
  3: > 📋 **目的**：为所有缺失的数据表创建 Repository 类，提供基本 CRUD 操作和业务查询方法
  4: 
  5: **生成时间**：2025-01-15  
  6: **现有 Repositories**：28 个  
  7: **需要创建**：25 个  
  8: **总计**：53 个（覆盖 51 张表）
  9: 
 10: ---
 11: 
 12: ## 📊 Repository 完成度统计
 13: 
 14: | 模块 | 表数 | 已有 | 缺失 | 完成度 |
 15: |------|------|------|------|--------|
 16: | 🔐 账户与身份系统 | 4 | 4 | 0 | ✅ 100% |
 17: | 🤝 组织协作系统 | 3 | 3 | 0 | ✅ 100% |
 18: | 🎯 蓝图/专案系统 | 5 | 5 | 0 | ✅ 100% |
 19: | 📋 任务执行系统 | 9 | 9 | 0 | ✅ 100% |
 20: | 🔒 权限系统 | 5 | 1 | 4 | ⚠️ 20% |
 21: | ✅ 品质验收系统 | 4 | 3 | 1 | ⚠️ 75% |
 22: | ⚠️ 问题追踪系统 | 4 | 0 | 4 | ❌ 0% |
 23: | 💬 协作沟通系统 | 6 | 0 | 6 | ❌ 0% |
 24: | 📊 资料分析系统 | 6 | 1 | 5 | ⚠️ 17% |
 25: | 🤖 机器人系统 | 3 | 0 | 3 | ❌ 0% |
 26: | ⚙️ 系统管理 | 2 | 0 | 2 | ❌ 0% |
 27: | **总计** | **51** | **28** | **25** | **55%** |
 28: 
 29: ---
 30: 
 31: ## 📋 需要创建的 Repositories 清单
 32: 
 33: ### 1. 🔒 权限系统 (4 个)
 34: 
 35: #### 1.1 RoleRepository
 36: **表名**：`roles`  
 37: **文件**：`role.repository.ts`  
 38: **业务方法**：
 39: - `findByName(name: string): Observable<Role | null>` - 根据名称查询角色
 40: - `findSystemRoles(): Observable<Role[]>` - 查询系统角色
 41: - `findCustomRoles(): Observable<Role[]>` - 查询自定义角色
 42: 
 43: #### 1.2 UserRoleRepository
 44: **表名**：`user_roles`  
 45: **文件**：`user-role.repository.ts`  
 46: **业务方法**：
 47: - `findByAccountId(accountId: string, options?: QueryOptions): Observable<UserRole[]>` - 根据账户ID查询
 48: - `findByRoleId(roleId: string, options?: QueryOptions): Observable<UserRole[]>` - 根据角色ID查询
 49: - `findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<UserRole[]>` - 根据蓝图ID查询
 50: - `findByBranchId(branchId: string, options?: QueryOptions): Observable<UserRole[]>` - 根据分支ID查询
 51: - `findByAccountAndBlueprint(accountId: string, blueprintId: string): Observable<UserRole | null>` - 查询账户在蓝图中的角色
 52: 
 53: #### 1.3 PermissionRepository
 54: **表名**：`permissions`  
 55: **文件**：`permission.repository.ts`  
 56: **业务方法**：
 57: - `findByName(name: string): Observable<Permission | null>` - 根据名称查询权限
 58: - `findByResource(resource: string, options?: QueryOptions): Observable<Permission[]>` - 根据资源查询权限
 59: - `findSystemPermissions(): Observable<Permission[]>` - 查询系统权限
 60: - `findByResourceAndAction(resource: string, action: string): Observable<Permission | null>` - 根据资源和操作查询
 61: 
 62: #### 1.4 RolePermissionRepository
 63: **表名**：`role_permissions`  
 64: **文件**：`role-permission.repository.ts`  
 65: **业务方法**：
 66: - `findByRoleId(roleId: string, options?: QueryOptions): Observable<RolePermission[]>` - 根据角色ID查询
 67: - `findByPermissionId(permissionId: string, options?: QueryOptions): Observable<RolePermission[]>` - 根据权限ID查询
 68: - `findByRoleAndPermission(roleId: string, permissionId: string): Observable<RolePermission | null>` - 查询角色权限关联
 69: 
 70: ---
 71: 
 72: ### 2. ⚠️ 问题追踪系统 (4 个)
 73: 
 74: #### 2.1 IssueRepository
 75: **表名**：`issues`  
 76: **文件**：`issue.repository.ts`  
 77: **业务方法**：
 78: - `findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<Issue[]>` - 根据蓝图ID查询
 79: - `findByBranchId(branchId: string, options?: QueryOptions): Observable<Issue[]>` - 根据分支ID查询
 80: - `findByTaskId(taskId: string, options?: QueryOptions): Observable<Issue[]>` - 根据任务ID查询
 81: - `findByStatus(status: string, options?: QueryOptions): Observable<Issue[]>` - 根据状态查询
 82: - `findBySeverity(severity: string, options?: QueryOptions): Observable<Issue[]>` - 根据严重程度查询
 83: - `findByIssueType(issueType: string, options?: QueryOptions): Observable<Issue[]>` - 根据问题类型查询
 84: - `findByReportedBy(reportedBy: string, options?: QueryOptions): Observable<Issue[]>` - 根据报告人查询
 85: - `findOpenIssues(blueprintId?: string): Observable<Issue[]>` - 查询未解决的问题（需要状态过滤，可能需要枚举类型）
 86: - `findSyncedToMain(): Observable<Issue[]>` - 查询已同步到主分支的问题（需要 `synced_to_main = true` 或相关字段过滤）
 87: 
 88: #### 2.2 IssueAssignmentRepository
 89: **表名**：`issue_assignments`  
 90: **文件**：`issue-assignment.repository.ts`  
 91: **业务方法**：
 92: - `findByIssueId(issueId: string, options?: QueryOptions): Observable<IssueAssignment[]>` - 根据问题ID查询
 93: - `findByAssigneeId(assigneeId: string, options?: QueryOptions): Observable<IssueAssignment[]>` - 根据被指派人ID查询
 94: - `findByAssignedBy(assignedBy: string, options?: QueryOptions): Observable<IssueAssignment[]>` - 根据指派人ID查询
 95: - `findByIssueAndAssignee(issueId: string, assigneeId: string): Observable<IssueAssignment | null>` - 查询问题指派关系
 96: 
 97: #### 2.3 IssuePhotoRepository
 98: **表名**：`issue_photos`  
 99: **文件**：`issue-photo.repository.ts`  
100: **业务方法**：
101: - `findByIssueId(issueId: string, options?: QueryOptions): Observable<IssuePhoto[]>` - 根据问题ID查询
102: - `findByDocumentId(documentId: string, options?: QueryOptions): Observable<IssuePhoto[]>` - 根据文档ID查询
103: - `findByPhotoType(photoType: string, options?: QueryOptions): Observable<IssuePhoto[]>` - 根据照片类型查询
104: 
105: #### 2.4 IssueSyncLogRepository
106: **表名**：`issue_sync_logs`  
107: **文件**：`issue-sync-log.repository.ts`  
108: **业务方法**：
109: - `findByIssueId(issueId: string, options?: QueryOptions): Observable<IssueSyncLog[]>` - 根据问题ID查询
110: - `findBySourceBranchId(sourceBranchId: string, options?: QueryOptions): Observable<IssueSyncLog[]>` - 根据源分支ID查询
111: - `findByTargetBlueprintId(targetBlueprintId: string, options?: QueryOptions): Observable<IssueSyncLog[]>` - 根据目标蓝图ID查询
112: - `findBySyncType(syncType: string, options?: QueryOptions): Observable<IssueSyncLog[]>` - 根据同步类型查询
113: 
114: ---
115: 
116: ### 3. 💬 协作沟通系统 (6 个)
117: 
118: #### 3.1 CommentRepository
119: **表名**：`comments`  
120: **文件**：`comment.repository.ts`  
121: **业务方法**：
122: - `findByCommentableType(commentableType: string, options?: QueryOptions): Observable<Comment[]>` - 根据可评论类型查询
123: - `findByCommentableId(commentableType: string, commentableId: string, options?: QueryOptions): Observable<Comment[]>` - 根据可评论对象查询
124: - `findByParentCommentId(parentCommentId: string, options?: QueryOptions): Observable<Comment[]>` - 根据父评论ID查询（嵌套回复）
125: - `findByAuthorId(authorId: string, options?: QueryOptions): Observable<Comment[]>` - 根据作者ID查询
126: - `findRootComments(commentableType: string, commentableId: string): Observable<Comment[]>` - 查询根评论（无父评论）
127: 
128: #### 3.2 NotificationRepository
129: **表名**：`notifications`  
130: **文件**：`notification.repository.ts`  
131: **业务方法**：
132: - `findByRecipientId(recipientId: string, options?: QueryOptions): Observable<Notification[]>` - 根据接收人ID查询
133: - `findUnreadByRecipientId(recipientId: string, options?: QueryOptions): Observable<Notification[]>` - 查询未读通知（需要特殊处理：`is_read = false`）
134: - `findBySenderId(senderId: string, options?: QueryOptions): Observable<Notification[]>` - 根据发送人ID查询
135: - `findByNotificationType(notificationType: string, options?: QueryOptions): Observable<Notification[]>` - 根据通知类型查询
136: - `findByRelatedType(relatedType: string, relatedId: string, options?: QueryOptions): Observable<Notification[]>` - 根据关联对象查询
137: - `markAsRead(notificationId: string): Observable<void>` - 标记为已读（使用 `update()` 方法）
138: - `markAllAsRead(recipientId: string): Observable<void>` - 标记所有为已读（需要批量更新，可能需要 RPC 或直接使用 Supabase client）
139: 
140: #### 3.3 NotificationRuleRepository
141: **表名**：`notification_rules`  
142: **文件**：`notification-rule.repository.ts`  
143: **业务方法**：
144: - `findByAccountId(accountId: string, options?: QueryOptions): Observable<NotificationRule[]>` - 根据账户ID查询
145: - `findByNotificationType(notificationType: string, options?: QueryOptions): Observable<NotificationRule[]>` - 根据通知类型查询
146: - `findEnabledRules(accountId: string): Observable<NotificationRule[]>` - 查询启用的规则
147: - `findByChannel(channel: string, options?: QueryOptions): Observable<NotificationRule[]>` - 根据渠道查询
148: 
149: #### 3.4 NotificationSubscriptionRepository
150: **表名**：`notification_subscriptions`  
151: **文件**：`notification-subscription.repository.ts`  
152: **业务方法**：
153: - `findByAccountId(accountId: string, options?: QueryOptions): Observable<NotificationSubscription[]>` - 根据账户ID查询
154: - `findBySubscribableType(subscribableType: string, options?: QueryOptions): Observable<NotificationSubscription[]>` - 根据订阅类型查询
155: - `findBySubscribableId(subscribableType: string, subscribableId: string, options?: QueryOptions): Observable<NotificationSubscription[]>` - 根据订阅对象查询
156: - `findByAccountAndSubscribable(accountId: string, subscribableType: string, subscribableId: string): Observable<NotificationSubscription | null>` - 查询订阅关系
157: 
158: #### 3.5 PersonalTodoRepository
159: **表名**：`personal_todos`  
160: **文件**：`personal-todo.repository.ts`  
161: **业务方法**：
162: - `findByAccountId(accountId: string, options?: QueryOptions): Observable<PersonalTodo[]>` - 根据账户ID查询
163: - `findByStatus(status: string, options?: QueryOptions): Observable<PersonalTodo[]>` - 根据状态查询
164: - `findByTodoType(todoType: string, options?: QueryOptions): Observable<PersonalTodo[]>` - 根据待办类型查询
165: - `findByRelatedType(relatedType: string, relatedId: string, options?: QueryOptions): Observable<PersonalTodo[]>` - 根据关联对象查询
166: - `findByPriority(priority: string, options?: QueryOptions): Observable<PersonalTodo[]>` - 根据优先级查询
167: - `findOverdue(accountId: string): Observable<PersonalTodo[]>` - 查询过期待办（需要日期比较：`due_date < NOW()`，可能需要特殊处理）
168: - `findPending(accountId: string): Observable<PersonalTodo[]>` - 查询待执行的待办（使用 `findByStatus()` 或 `findByAccountId()` + filters）
169: 
170: #### 3.6 TodoStatusTrackingRepository
171: **表名**：`todo_status_tracking`  
172: **文件**：`todo-status-tracking.repository.ts`  
173: **业务方法**：
174: - `findByTodoId(todoId: string, options?: QueryOptions): Observable<TodoStatusTracking[]>` - 根据待办ID查询
175: - `findByChangedBy(changedBy: string, options?: QueryOptions): Observable<TodoStatusTracking[]>` - 根据变更人ID查询
176: - `findByToStatus(toStatus: string, options?: QueryOptions): Observable<TodoStatusTracking[]>` - 根据目标状态查询
177: 
178: ---
179: 
180: ### 4. 🤖 机器人系统 (3 个)
181: 
182: #### 4.1 BotRepository
183: **表名**：`bots`  
184: **文件**：`bot.repository.ts`  
185: **业务方法**：
186: - `findByAccountId(accountId: string, options?: QueryOptions): Observable<Bot[]>` - 根据账户ID查询
187: - `findByBotType(botType: string, options?: QueryOptions): Observable<Bot[]>` - 根据机器人类型查询
188: - `findEnabledBots(options?: QueryOptions): Observable<Bot[]>` - 查询启用的机器人
189: - `findByCreatedBy(createdBy: string, options?: QueryOptions): Observable<Bot[]>` - 根据创建人ID查询
190: 
191: #### 4.2 BotTaskRepository
192: **表名**：`bot_tasks`  
193: **文件**：`bot-task.repository.ts`  
194: **业务方法**：
195: - `findByBotId(botId: string, options?: QueryOptions): Observable<BotTask[]>` - 根据机器人ID查询
196: - `findByStatus(status: string, options?: QueryOptions): Observable<BotTask[]>` - 根据状态查询
197: - `findPendingTasks(options?: QueryOptions): Observable<BotTask[]>` - 查询待处理任务
198: - `findByTaskType(taskType: string, options?: QueryOptions): Observable<BotTask[]>` - 根据任务类型查询
199: - `findScheduledTasks(scheduledAt: Date): Observable<BotTask[]>` - 查询计划执行的任务（需要日期比较，可能需要特殊处理）
200: 
201: #### 4.3 BotExecutionLogRepository
202: **表名**：`bot_execution_logs`  
203: **文件**：`bot-execution-log.repository.ts`  
204: **业务方法**：
205: - `findByBotId(botId: string, options?: QueryOptions): Observable<BotExecutionLog[]>` - 根据机器人ID查询
206: - `findByBotTaskId(botTaskId: string, options?: QueryOptions): Observable<BotExecutionLog[]>` - 根据机器人任务ID查询
207: - `findByExecutionStatus(executionStatus: string, options?: QueryOptions): Observable<BotExecutionLog[]>` - 根据执行状态查询
208: - `findRecentLogs(botId?: string, limit?: number): Observable<BotExecutionLog[]>` - 查询最近的执行日志
209: - `findFailedLogs(botId?: string, options?: QueryOptions): Observable<BotExecutionLog[]>` - 查询失败的执行日志
210: 
211: ---
212: 
213: ### 5. ⚙️ 系统管理 (2 个)
214: 
215: #### 5.1 SettingRepository
216: **表名**：`settings`  
217: **文件**：`setting.repository.ts`  
218: **业务方法**：
219: - `findByKey(settingKey: string): Observable<Setting | null>` - 根据键查询
220: - `findByType(settingType: string, options?: QueryOptions): Observable<Setting[]>` - 根据类型查询
221: - `findByScopeId(scopeId: string, options?: QueryOptions): Observable<Setting[]>` - 根据作用域ID查询
222: - `findPublicSettings(options?: QueryOptions): Observable<Setting[]>` - 查询公开设置
223: - `findByTypeAndScope(settingType: string, scopeId: string): Observable<Setting[]>` - 根据类型和作用域查询
224: 
225: #### 5.2 FeatureFlagRepository
226: **表名**：`feature_flags`  
227: **文件**：`feature-flag.repository.ts`  
228: **业务方法**：
229: - `findByKey(flagKey: string): Observable<FeatureFlag | null>` - 根据键查询
230: - `findEnabledFlags(options?: QueryOptions): Observable<FeatureFlag[]>` - 查询启用的功能开关
231: - `findByTargetAccount(accountId: string): Observable<FeatureFlag[]>` - 根据目标账户查询
232: - `findByTargetOrganization(organizationId: string): Observable<FeatureFlag[]>` - 根据目标组织查询
233: - `findActiveFlags(): Observable<FeatureFlag[]>` - 查询当前有效的功能开关（在有效期内，需要日期比较：`enabled = true AND (starts_at IS NULL OR starts_at <= NOW()) AND (ends_at IS NULL OR ends_at >= NOW())`，可能需要特殊处理或 RPC）
234: 
235: ---
236: 
237: ### 6. 📊 资料分析系统 (5 个)
238: 
239: #### 6.1 DocumentRepository
240: **表名**：`documents`  
241: **文件**：`document.repository.ts`  
242: **业务方法**：
243: - `findByUploaderId(uploaderId: string, options?: QueryOptions): Observable<Document[]>` - 根据上传人ID查询
244: - `findByStorageBucket(storageBucket: string, options?: QueryOptions): Observable<Document[]>` - 根据存储桶查询
245: - `findByFileType(fileType: string, options?: QueryOptions): Observable<Document[]>` - 根据文件类型查询
246: - `findNotDeleted(options?: QueryOptions): Observable<Document[]>` - 查询未删除的文件
247: - `findPublicDocuments(options?: QueryOptions): Observable<Document[]>` - 查询公开文件
248: - `findByUploadSource(uploadSource: string, options?: QueryOptions): Observable<Document[]>` - 根据上传来源查询
249: - `findSoftDeleted(): Observable<Document[]>` - 查询软删除的文件
250: 
251: #### 6.2 DocumentVersionRepository
252: **表名**：`document_versions`  
253: **文件**：`document-version.repository.ts`  
254: **业务方法**：
255: - `findByDocumentId(documentId: string, options?: QueryOptions): Observable<DocumentVersion[]>` - 根据文档ID查询
256: - `findLatestVersion(documentId: string): Observable<DocumentVersion | null>` - 查询最新版本（需要按版本号或创建时间排序，取第一条）
257: - `findByVersionNumber(documentId: string, versionNumber: number): Observable<DocumentVersion | null>` - 根据版本号查询
258: - `findByCreatedBy(createdBy: string, options?: QueryOptions): Observable<DocumentVersion[]>` - 根据创建人ID查询
259: 
260: #### 6.3 DocumentThumbnailRepository
261: **表名**：`document_thumbnails`  
262: **文件**：`document-thumbnail.repository.ts`  
263: **业务方法**：
264: - `findByDocumentId(documentId: string, options?: QueryOptions): Observable<DocumentThumbnail[]>` - 根据文档ID查询
265: - `findBySize(documentId: string, thumbnailSize: string): Observable<DocumentThumbnail | null>` - 根据尺寸查询
266: - `findByDocumentAndSize(documentId: string, thumbnailSize: string): Observable<DocumentThumbnail | null>` - 查询指定文档和尺寸的缩图
267: 
268: #### 6.4 ProgressTrackingRepository
269: **表名**：`progress_tracking`  
270: **文件**：`progress-tracking.repository.ts`  
271: **业务方法**：
272: - `findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<ProgressTracking[]>` - 根据蓝图ID查询
273: - `findByBranchId(branchId: string, options?: QueryOptions): Observable<ProgressTracking[]>` - 根据分支ID查询
274: - `findByTrackingDate(trackingDate: Date, options?: QueryOptions): Observable<ProgressTracking[]>` - 根据追踪日期查询
275: - `findLatestByBlueprintId(blueprintId: string, branchId?: string): Observable<ProgressTracking | null>` - 查询最新的进度追踪（需要按日期排序，取第一条）
276: - `findByDateRange(blueprintId: string, startDate: Date, endDate: Date, branchId?: string): Observable<ProgressTracking[]>` - 根据日期范围查询（需要日期比较，可能需要特殊处理）
277: 
278: #### 6.5 AnalyticsCacheRepository
279: **表名**：`analytics_cache`  
280: **文件**：`analytics-cache.repository.ts`  
281: **业务方法**：
282: - `findByCacheKey(cacheKey: string): Observable<AnalyticsCache | null>` - 根据缓存键查询
283: - `findByCacheType(cacheType: string, options?: QueryOptions): Observable<AnalyticsCache[]>` - 根据缓存类型查询
284: - `findByBlueprintId(blueprintId: string, options?: QueryOptions): Observable<AnalyticsCache[]>` - 根据蓝图ID查询
285: - `findByBranchId(branchId: string, options?: QueryOptions): Observable<AnalyticsCache[]>` - 根据分支ID查询
286: - `findExpiredCaches(): Observable<AnalyticsCache[]>` - 查询过期的缓存（需要日期比较：`expires_at < NOW()`，可能需要特殊处理）
287: - `findValidCaches(options?: QueryOptions): Observable<AnalyticsCache[]>` - 查询有效的缓存（未过期，需要日期比较：`expires_at >= NOW()`，可能需要特殊处理）
288: 
289: ---
290: 
291: ### 7. ✅ 品质验收系统补充 (1 个)
292: 
293: #### 7.1 QcPhotoRepository
294: **表名**：`qc_photos`  
295: **文件**：`qc-photo.repository.ts`  
296: **业务方法**：
297: - `findByQcId(qcId: string, options?: QueryOptions): Observable<QcPhoto[]>` - 根据品质检查ID查询
298: - `findByDocumentId(documentId: string, options?: QueryOptions): Observable<QcPhoto[]>` - 根据文档ID查询
299: - `findByPhotoType(photoType: string, options?: QueryOptions): Observable<QcPhoto[]>` - 根据照片类型查询
300: - `findByUploadedBy(uploadedBy: string, options?: QueryOptions): Observable<QcPhoto[]>` - 根据上传人ID查询
301: 
302: ---
303: 
304: ## 🎯 Repository 设计模式
305: 
306: ### 基本结构
307: 
308: **重要**：Repository 层遵循分层架构原则，**core 层不依赖 shared 层**，因此：
309: - ✅ Repository 在文件内部定义类型（从 Database 类型提取）
310: - ✅ 枚举类型从 `core/infra/types` 导入（如果存在）
311: - ❌ **不要**从 `@shared/models` 导入类型
312: 
313: ```typescript
314: import { Injectable } from '@angular/core';
315: import { Observable } from 'rxjs';
316: import { map } from 'rxjs/operators';
317: 
318: import { BaseRepository, QueryOptions } from './base.repository';
319: import { Database } from '../types/database.types';
320: // 如果有枚举类型，从 core/infra/types 导入
321: // import { EntityStatus, EntityType } from '../types/entity.types';
322: 
323: /**
324:  * 从数据库类型中提取原始类型（snake_case）
325:  */
326: type EntityRow = Database['public']['Tables']['table_name']['Row'];
327: type EntityInsert = Database['public']['Tables']['table_name']['Insert'];
328: type EntityUpdate = Database['public']['Tables']['table_name']['Update'];
329: 
330: /**
331:  * Entity 实体类型（camelCase）
332:  * 注意：实际使用时，BaseRepository 会自动进行 snake_case → camelCase 转换
333:  */
334: export type Entity = EntityRow;
335: export type { EntityInsert, EntityUpdate };
336: 
337: /**
338:  * Entity Repository
339:  *
340:  * 提供 Entity 相关的数据访问方法
341:  *
342:  * @example
343:  * ```typescript
344:  * const entityRepo = inject(EntityRepository);
345:  * entityRepo.findByXxx('value').subscribe(entities => {
346:  *   console.log('Entities:', entities);
347:  * });
348:  * ```
349:  */
350: @Injectable({
351:   providedIn: 'root'
352: })
353: export class EntityRepository extends BaseRepository<Entity, EntityInsert, EntityUpdate> {
354:   protected tableName = 'table_name';
355: 
356:   /**
357:    * 业务查询方法示例
358:    *
359:    * @param param 查询参数
360:    * @param options 查询选项
361:    * @returns Observable<Entity[]>
362:    */
363:   findByXxx(param: string, options?: QueryOptions): Observable<Entity[]> {
364:     return this.findAll({
365:       ...options,
366:       filters: {
367:         ...options?.filters,
368:         paramField: param // 会自动转换为 param_field
369:       }
370:     });
371:   }
372: 
373:   /**
374:    * 查询单条记录示例（返回第一条或 null）
375:    *
376:    * @param param 查询参数
377:    * @returns Observable<Entity | null>
378:    */
379:   findOneByXxx(param: string): Observable<Entity | null> {
380:     return this.findAll({
381:       filters: {
382:         paramField: param
383:       }
384:     }).pipe(map(entities => (entities.length > 0 ? entities[0] : null)));
385:   }
386: }
387: ```
388: 
389: ### BaseRepository 提供的通用方法
390: 
391: 所有 Repository 自动继承以下方法：
392: 
393: - `findAll(options?: QueryOptions): Observable<T[]>` - 查询所有记录
394: - `findById(id: string): Observable<T | null>` - 根据ID查询
395: - `create(data: TInsert): Observable<T>` - 创建记录
396: - `update(id: string, data: TUpdate): Observable<T>` - 更新记录
397: - `delete(id: string): Observable<void>` - 删除记录
398: - `findPaginated(options: QueryOptions & { page: number; pageSize: number }): Observable<PaginatedResult<T>>` - 分页查询
399: 
400: ---
401: 
402: ## 📝 实施优先级
403: 
404: ### 优先级 1：核心功能模块（高优先级）
405: 
406: 1. **权限系统 Repositories** (4个)
407:    - 影响：所有需要权限控制的功能
408:    - 依赖：account 模块
409:    - 注意：BranchPermissionRepository 已存在，只需创建其他 4 个
410: 
411: 2. **问题追踪系统 Repositories** (4个)
412:    - 影响：问题管理功能
413:    - 依赖：task, blueprint 模块
414: 
415: 3. **协作沟通系统 Repositories** (6个)
416:    - 影响：通知、留言、待办中心
417:    - 依赖：account, task, issue 模块
418: 
419: ### 优先级 2：辅助功能模块（中优先级）
420: 
421: 4. **资料分析系统 Repositories** (5个)
422:    - 补充缺失的 5 个 Repository
423:    - 依赖：blueprint, task 模块
424:    - 注意：ActivityLogRepository 已存在，只需创建其他 5 个
425: 
426: 5. **品质验收系统补充** (1个)
427:    - 补充 QcPhotoRepository
428:    - 依赖：quality-check 模块
429:    - 注意：QualityCheckRepository, InspectionRepository, InspectionPhotoRepository 已存在
430: 
431: ### 优先级 3：扩展功能模块（低优先级）
432: 
433: 6. **机器人系统 Repositories** (3个)
434:    - 影响：自动化任务
435:    - 依赖：account 模块
436: 
437: 7. **系统管理 Repositories** (2个)
438:    - 影响：系统配置
439:    - 依赖：account 模块
440: 
441: ---
442: 
443: ## ⚠️ 重要注意事项
444: 
445: ### 1. 类型定义模式
446: 
447: **遵循现有模式**：Repository 在文件内部定义类型，不从 `@shared/models` 导入
448: 
449: ```typescript
450: // ✅ 正确：在 Repository 内部定义类型
451: type EntityRow = Database['public']['Tables']['table_name']['Row'];
452: export type Entity = EntityRow;
453: 
454: // ❌ 错误：从 shared 层导入类型（违反分层架构）
455: import { Entity } from '@shared/models/module';
456: ```
457: 
458: ### 2. 枚举类型导入
459: 
460: 如果有枚举类型，从 `core/infra/types` 导入：
461: 
462: ```typescript
463: // ✅ 正确：从 core 层导入枚举
464: import { TaskStatus, TaskType } from '../types/task.types';
465: 
466: // 如果枚举不存在，需要先在 core/infra/types 中创建
467: ```
468: 
469: ### 3. 业务方法命名规范
470: 
471: - `findByXxx()` - 返回数组
472: - `findOneByXxx()` - 返回单条记录或 null
473: - `findXxx()` - 特殊查询（如 `findOpen()`, `findPending()`）
474: 
475: ### 4. 复杂查询处理
476: 
477: 对于需要复杂条件或数据库函数的查询（如日期比较、ltree 查询），可能需要：
478: - 使用 RPC 函数
479: - 直接使用 Supabase client 的高级查询方法（`.gte()`, `.lte()`, `.in()`, `.is()` 等）
480: - 在 BaseRepository 中扩展查询能力
481: - 或标记为 TODO，后续实现
482: 
483: **示例：批量查询**
484: ```typescript
485: findByIds(ids: string[]): Observable<Entity[]> {
486:   if (ids.length === 0) {
487:     return of([]);
488:   }
489:   return from(this.supabase.from(this.tableName).select('*').in('id', ids)).pipe(
490:     map((response: { data: any[] | null; error: any }) => {
491:       if (response.error) {
492:         throw new Error(response.error.message || '批量查询失败');
493:       }
494:       return (response.data || []).map(item => toCamelCaseData<Entity>(item));
495:     })
496:   );
497: }
498: ```
499: 
500: **示例：日期范围查询**
501: ```typescript
502: findByDateRange(startDate: Date, endDate: Date): Observable<Entity[]> {
503:   return from(
504:     this.supabase
505:       .from(this.tableName)
506:       .select('*')
507:       .gte('created_at', startDate.toISOString())
508:       .lte('created_at', endDate.toISOString())
509:   ).pipe(
510:     map((response: { data: any[] | null; error: any }) => {
511:       if (response.error) {
512:         throw new Error(response.error.message || '日期范围查询失败');
513:       }
514:       return (response.data || []).map(item => toCamelCaseData<Entity>(item));
515:     })
516:   );
517: }
518: ```
519: 
520: ### 5. 批量操作方法
521: 
522: 对于需要批量操作的场景，考虑添加：
523: - `findByIds(ids: string[]): Observable<Entity[]>` - 批量查询
524: - `createMany(data: TInsert[]): Observable<T[]>` - 批量创建（如果业务需要）
525: - `updateMany(ids: string[], data: TUpdate): Observable<T[]>` - 批量更新（如果业务需要）
526: 
527: ### 6. 业务方法设计原则
528: 
529: - **单一职责**：每个方法只做一件事
530: - **可组合性**：方法应该可以组合使用（通过 options.filters）
531: - **类型安全**：使用枚举类型而不是字符串字面量
532: - **错误处理**：所有方法都应该有适当的错误处理
533: - **文档完整**：每个方法都应该有清晰的 JSDoc 注释，包括参数说明和返回值说明
534: 
535: ### 7. 特殊业务方法
536: 
537: 对于需要特殊业务逻辑的方法（如 `markAsRead()`, `markAllAsRead()`），应该：
538: - 使用 `update()` 方法或直接使用 Supabase client
539: - 确保有适当的错误处理
540: - 提供清晰的业务语义
541: 
542: ---
543: 
544: ## ✅ 实施检查清单
545: 
546: ### 准备工作
547: - [ ] 检查是否需要创建新的枚举类型文件（core/infra/types）
548: - [ ] 确认所有表名和字段名正确
549: 
550: ### 创建 Repositories
551: - [ ] 创建权限系统 Repositories (4个)
552:   - [ ] RoleRepository
553:   - [ ] UserRoleRepository
554:   - [ ] PermissionRepository
555:   - [ ] RolePermissionRepository
556: - [ ] 创建问题追踪系统 Repositories (4个)
557:   - [ ] IssueRepository
558:   - [ ] IssueAssignmentRepository
559:   - [ ] IssuePhotoRepository
560:   - [ ] IssueSyncLogRepository
561: - [ ] 创建协作沟通系统 Repositories (6个)
562:   - [ ] CommentRepository
563:   - [ ] NotificationRepository
564:   - [ ] NotificationRuleRepository
565:   - [ ] NotificationSubscriptionRepository
566:   - [ ] PersonalTodoRepository
567:   - [ ] TodoStatusTrackingRepository
568: - [ ] 创建机器人系统 Repositories (3个)
569:   - [ ] BotRepository
570:   - [ ] BotTaskRepository
571:   - [ ] BotExecutionLogRepository
572: - [ ] 创建系统管理 Repositories (2个)
573:   - [ ] SettingRepository
574:   - [ ] FeatureFlagRepository
575: - [ ] 创建资料分析系统 Repositories (5个)
576:   - [ ] DocumentRepository
577:   - [ ] DocumentVersionRepository
578:   - [ ] DocumentThumbnailRepository
579:   - [ ] ProgressTrackingRepository
580:   - [ ] AnalyticsCacheRepository
581: - [ ] 创建品质验收系统补充 Repository (1个)
582:   - [ ] QcPhotoRepository
583: 
584: ### 收尾工作
585: - [ ] 更新 Repository 导出文件 (index.ts) - 按字母顺序或模块顺序排列
586: - [ ] 验证类型检查（`npx tsc --noEmit`）
587: - [ ] 验证代码质量（`yarn lint`）
588: - [ ] 验证代码格式（`yarn format` 或 Prettier）
589: - [ ] 检查所有方法都有完整的 JSDoc 注释
590: - [ ] 检查所有复杂查询都有适当的实现或 TODO 标记
591: - [ ] 更新文档
592: 
593: ---
594: 
595: ---
596: 
597: ## 📌 关键发现与调整
598: 
599: ### 1. 类型定义模式确认
600: 
601: 经过审查现有代码，确认：
602: - ✅ **Repository 在文件内部定义类型**（从 Database 类型提取）
603: - ✅ **枚举类型从 `core/infra/types` 导入**（如果存在）
604: - ❌ **不从 `@shared/models` 导入类型**（违反分层架构）
605: 
606: **原因**：遵循分层架构原则，core 层不依赖 shared 层。
607: 
608: ### 2. 现有枚举类型文件
609: 
610: 已存在的枚举类型文件：
611: - `core/infra/types/account.types.ts` - AccountType, AccountStatus, TeamMemberRole
612: - `core/infra/types/task.types.ts` - TaskType, TaskStatus, TaskPriority, TaskAssigneeType, TaskListType, TaskDependencyType
613: - `core/infra/types/blueprint.types.ts` - BlueprintStatus, BranchType, BranchStatus, PRStatus
614: - `core/infra/types/collaboration.types.ts` - CollaborationType, CollaborationStatus, InvitationStatus
615: 
616: **可能需要创建的新枚举类型文件**：
617: - `core/infra/types/issue.types.ts` - IssueType, IssueStatus, IssueSeverity, IssuePriority
618: - `core/infra/types/communication.types.ts` - NotificationType, NotificationChannel, TodoStatus, TodoType
619: - `core/infra/types/bot.types.ts` - BotType, BotTaskStatus, BotExecutionStatus
620: - `core/infra/types/system.types.ts` - SettingType, FeatureFlagStatus
621: 
622: ### 3. 方法实现注意事项
623: 
624: - **简单查询**：使用 `findAll()` + `filters`（BaseRepository 自动处理）
625: - **单条记录查询**：使用 `findAll()` + `map()` 返回第一条或 null
626: - **复杂查询**：可能需要 RPC 函数或标记为 TODO
627: - **日期比较**：BaseRepository 的 filters 只支持等值查询，日期范围查询需要特殊处理
628: 
629: ### 4. 与现有代码的一致性
630: 
631: 所有新创建的 Repository 应该：
632: - 遵循现有 Repository 的代码风格
633: - 使用相同的注释格式（JSDoc）
634: - 保持方法命名一致性
635: - 导出类型供其他模块使用（如需要）
636: - 所有方法都有完整的错误处理
637: - 复杂查询有清晰的实现说明或 TODO 标记
638: - 使用枚举类型而不是字符串字面量（如果存在枚举）
639: - 遵循单一职责原则
640: - 提供清晰的业务语义
641: 
642: ---
643: 
644: ---
645: 
646: ## 🏆 企业级标准检查清单
647: 
648: ### 代码质量
649: - ✅ 类型安全：所有类型从 Database 类型提取，确保与数据库结构一致
650: - ✅ 错误处理：所有方法都有适当的错误处理（通过 handleSupabaseResponse）
651: - ✅ 代码风格：遵循现有 Repository 的代码风格和命名规范
652: - ✅ 文档完整：所有方法都有完整的 JSDoc 注释
653: 
654: ### 架构设计
655: - ✅ 分层架构：core 层不依赖 shared 层，类型在 Repository 内部定义
656: - ✅ 单一职责：每个 Repository 只负责一个数据表的操作
657: - ✅ 可扩展性：方法设计支持组合使用（通过 options.filters）
658: - ✅ 可维护性：代码结构清晰，易于理解和维护
659: 
660: ### 功能完整性
661: - ✅ 基本 CRUD：所有 Repository 继承 BaseRepository，自动获得 CRUD 方法
662: - ✅ 业务查询：为每个表提供必要的业务查询方法
663: - ✅ 复杂查询：对复杂查询有清晰的实现说明或 TODO 标记
664: - ✅ 批量操作：在需要时提供批量操作方法
665: 
666: ### 性能优化
667: - ✅ 查询优化：使用适当的排序和分页
668: - ✅ 批量查询：对于需要批量查询的场景，使用 `.in()` 方法
669: - ✅ 索引利用：查询方法设计考虑数据库索引的使用
670: 
671: ### 测试准备
672: - ✅ 方法可测试：所有方法都返回 Observable，易于单元测试
673: - ✅ 错误可追踪：错误信息包含方法名，便于调试
674: - ✅ 类型安全：TypeScript 类型检查确保类型正确
675: 
676: ---
677: 
678: **最后更新**：2025-01-15  
679: **审查状态**：✅ 已审查并调整，符合企业级标准  
680: **审查者**：AI Assistant  
681: **维护者**：开发团队
`````

## File: docs/ArchivedDocuments/ROUTE-INTEGRATION.md
`````markdown
  1: # Route Integration Guide
  2: 
  3: 本文件說明如何在 Angular 路由中註冊新增的 Standalone Components。
  4: 
  5: ## 概述
  6: 
  7: 本次新增了三個企業級基礎實作頁面：
  8: 1. **Quality Check Detail** - 品質檢查詳情頁
  9: 2. **Activity Log Detail** - 活動記錄詳情頁
 10: 3. **Bots Tasks Skeleton** - 機器人任務骨架頁
 11: 
 12: 所有組件均使用 Angular 20.3 的 Standalone Components、Signals 與 OnPush 變更檢測策略。
 13: 
 14: ## 路由配置
 15: 
 16: ### 1. Quality Check Detail (`/quality/checks/:id`)
 17: 
 18: 在 `src/app/routes/quality/routes.ts` 中註冊：
 19: 
 20: ```typescript
 21: import { Routes } from '@angular/router';
 22: 
 23: export const routes: Routes = [
 24:   {
 25:     path: 'checks',
 26:     children: [
 27:       {
 28:         path: '',
 29:         loadComponent: () => import('./checks/quality-checks.component').then(m => m.QualityChecksComponent)
 30:       },
 31:       {
 32:         path: ':id',
 33:         loadComponent: () => import('./checks/detail/quality-check-detail.component').then(m => m.QualityCheckDetailComponentComponent)
 34:       }
 35:     ]
 36:   },
 37:   // ... 其他路由
 38: ];
 39: ```
 40: 
 41: **使用範例：**
 42: ```typescript
 43: // 導航到品質檢查詳情頁
 44: this.router.navigate(['/quality/checks', checkId]);
 45: 
 46: // 或使用 routerLink
 47: <a [routerLink]="['/quality/checks', check.id]">查看詳情</a>
 48: ```
 49: 
 50: ### 2. Activity Log Detail (`/analytics/activity-logs/:id`)
 51: 
 52: 在 `src/app/routes/analytics/routes.ts` 中註冊：
 53: 
 54: ```typescript
 55: import { Routes } from '@angular/router';
 56: 
 57: export const routes: Routes = [
 58:   {
 59:     path: 'activity-logs',
 60:     children: [
 61:       {
 62:         path: '',
 63:         loadComponent: () => import('./activity-logs/activity-log.component').then(m => m.ActivityLogComponent)
 64:       },
 65:       {
 66:         path: ':id',
 67:         loadComponent: () => import('./activity-logs/detail/activity-log-detail.component').then(m => m.ActivityLogDetailComponentComponent)
 68:       }
 69:     ]
 70:   },
 71:   // ... 其他路由
 72: ];
 73: ```
 74: 
 75: **使用範例：**
 76: ```typescript
 77: // 導航到活動記錄詳情頁
 78: this.router.navigate(['/analytics/activity-logs', logId]);
 79: 
 80: // 或使用 routerLink
 81: <a [routerLink]="['/analytics/activity-logs', log.id]">查看詳情</a>
 82: ```
 83: 
 84: ### 3. Bots Tasks Skeleton (`/bots/tasks`)
 85: 
 86: 在 `src/app/routes/bots/routes.ts` 中註冊：
 87: 
 88: ```typescript
 89: import { Routes } from '@angular/router';
 90: 
 91: export const routes: Routes = [
 92:   {
 93:     path: 'tasks',
 94:     loadComponent: () => import('./tasks/bots-tasks-skeleton.component').then(m => m.BotsTasksSkeletonComponent)
 95:   },
 96:   // ... 其他路由
 97: ];
 98: ```
 99: 
100: **使用範例：**
101: ```typescript
102: // 導航到機器人任務頁面
103: this.router.navigate(['/bots/tasks']);
104: 
105: // 或使用 routerLink
106: <a routerLink="/bots/tasks">機器人任務</a>
107: ```
108: 
109: ## 完整路由結構範例
110: 
111: ### Quality Routes (`src/app/routes/quality/routes.ts`)
112: 
113: ```typescript
114: import { Routes } from '@angular/router';
115: 
116: export const routes: Routes = [
117:   {
118:     path: 'checks',
119:     children: [
120:       { path: '', loadComponent: () => import('./checks/quality-checks.component').then(m => m.QualityChecksComponent) },
121:       { path: ':id', loadComponent: () => import('./checks/detail/quality-check-detail.component').then(m => m.QualityCheckDetailComponent) }
122:     ]
123:   },
124:   {
125:     path: 'inspections',
126:     loadComponent: () => import('./inspections/inspections.component').then(m => m.InspectionsComponent)
127:   },
128:   {
129:     path: 'results',
130:     loadComponent: () => import('./results/results.component').then(m => m.ResultsComponent)
131:   }
132: ];
133: ```
134: 
135: ### Analytics Routes (`src/app/routes/analytics/routes.ts`)
136: 
137: ```typescript
138: import { Routes } from '@angular/router';
139: 
140: export const routes: Routes = [
141:   {
142:     path: 'activity-logs',
143:     children: [
144:       { path: '', loadComponent: () => import('./activity-logs/activity-log.component').then(m => m.ActivityLogComponent) },
145:       { path: ':id', loadComponent: () => import('./activity-logs/detail/activity-log-detail.component').then(m => m.ActivityLogDetailComponent) }
146:     ]
147:   },
148:   {
149:     path: 'charts',
150:     loadComponent: () => import('./charts/charts.component').then(m => m.ChartsComponent)
151:   },
152:   {
153:     path: 'reports',
154:     loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent)
155:   }
156: ];
157: ```
158: 
159: ### Bots Routes (`src/app/routes/bots/routes.ts`)
160: 
161: ```typescript
162: import { Routes } from '@angular/router';
163: 
164: export const routes: Routes = [
165:   {
166:     path: 'tasks',
167:     loadComponent: () => import('./tasks/bots-tasks-skeleton.component').then(m => m.BotsTasksSkeletonComponent)
168:   },
169:   {
170:     path: 'config',
171:     loadComponent: () => import('./config/config.component').then(m => m.ConfigComponent)
172:   },
173:   {
174:     path: 'executions',
175:     loadComponent: () => import('./executions/executions.component').then(m => m.ExecutionsComponent)
176:   }
177: ];
178: ```
179: 
180: ## 主路由整合 (`src/app/routes/routes.ts`)
181: 
182: 確保主路由檔案中包含這些模組的路由：
183: 
184: ```typescript
185: import { Routes } from '@angular/router';
186: 
187: export const routes: Routes = [
188:   // ... 其他路由
189:   {
190:     path: 'quality',
191:     loadChildren: () => import('./quality/routes').then(m => m.routes)
192:   },
193:   {
194:     path: 'analytics',
195:     loadChildren: () => import('./analytics/routes').then(m => m.routes)
196:   },
197:   {
198:     path: 'bots',
199:     loadChildren: () => import('./bots/routes').then(m => m.routes)
200:   }
201:   // ... 其他路由
202: ];
203: ```
204: 
205: ## 導航守衛 (可選)
206: 
207: 如需要權限控制，可加入 Route Guards：
208: 
209: ```typescript
210: import { authGuard } from '@core';
211: 
212: {
213:   path: 'quality/checks/:id',
214:   loadComponent: () => import('./quality/checks/detail/quality-check-detail.component').then(m => m.QualityCheckDetailComponent),
215:   canActivate: [authGuard]
216: }
217: ```
218: 
219: ## 元數據設定 (可選)
220: 
221: 可為路由加入元數據以改善 SEO 和使用者體驗：
222: 
223: ```typescript
224: {
225:   path: 'quality/checks/:id',
226:   loadComponent: () => import('./quality/checks/detail/quality-check-detail.component').then(m => m.QualityCheckDetailComponent),
227:   data: {
228:     title: '品質檢查詳情',
229:     reuse: true
230:   }
231: }
232: ```
233: 
234: ## 功能特性
235: 
236: ### Quality Check Detail
237: - ✅ 讀取品質檢查資料（從 route params 取得 ID）
238: - ✅ 編輯模式支援修改 status/findings/recommendations
239: - ✅ 使用 Typed Reactive Forms
240: - ✅ 顯示 loading 與 error 狀態
241: - ✅ Signal-based 狀態管理
242: 
243: ### Activity Log Detail
244: - ✅ 讀取活動記錄資料（從 route params 取得 ID）
245: - ✅ 顯示完整欄位（actor/action/target/occurredAt/meta）
246: - ✅ 顯示 loading 與 error 狀態
247: - ✅ Signal-based 狀態管理
248: 
249: ### Bots Tasks Skeleton
250: - ✅ 骨架頁面顯示（使用 nz-empty）
251: - ✅ CTA 按鈕（建立範例機器人任務）
252: - ✅ 未實作後端邏輯
253: 
254: ## 測試
255: 
256: 所有組件均包含基本單元測試（Karma/Jasmine），確保組件可以正常建立。
257: 
258: ```bash
259: # 執行單元測試
260: yarn test
261: 
262: # 執行測試並產生覆蓋率報告
263: yarn test-coverage
264: ```
265: 
266: ## 注意事項
267: 
268: 1. **環境配置**：確保 `src/environments/environment.ts` 包含正確的 Supabase 配置
269: 2. **權限控制**：根據需求加入適當的 Route Guards
270: 3. **錯誤處理**：組件內建基本錯誤處理，可根據需求擴展
271: 4. **類型安全**：所有組件均使用 TypeScript strict mode，避免使用 `any`
272: 5. **效能優化**：使用 OnPush 變更檢測策略和 Signals 提升效能
273: 
274: ## 相關文件
275: 
276: - [Angular 路由指南](https://angular.dev/guide/routing)
277: - [Standalone Components](https://angular.dev/guide/standalone-components)
278: - [Signals](https://angular.dev/guide/signals)
279: - [Typed Forms](https://angular.dev/guide/typed-forms)
280: - [專案架構說明](./01-專案結構說明.md)
`````

## File: docs/ArchivedDocuments/Supabase-RLS遞歸問題處理方法.md
`````markdown
  1: # Supabase RLS 遞歸問題處理方法
  2: 
  3: > **來源**：Supabase 官方文檔  
  4: > **日期**：2025-01-15  
  5: > **參考**：[Row Level Security 文檔](https://supabase.com/docs/guides/database/postgres/row-level-security#use-security-definer-functions)
  6: 
  7: ---
  8: 
  9: ## 📋 問題描述
 10: 
 11: 當 RLS 策略在查詢中又查詢其他表時，如果這些表也有 RLS 策略，可能會形成循環查詢，導致 **"infinite recursion detected in policy"** 錯誤。
 12: 
 13: ---
 14: 
 15: ## ✅ 官方解決方案：使用 SECURITY DEFINER 函數
 16: 
 17: ### 核心原理
 18: 
 19: **SECURITY DEFINER 函數**以函數創建者的權限執行，而不是調用者的權限。如果函數由具有 `bypassrls` 權限的角色（如 `postgres`）創建，則函數內部可以繞過 RLS 檢查，避免遞歸問題。
 20: 
 21: ### 實施步驟
 22: 
 23: #### 1. 創建 private schema（推薦）
 24: 
 25: ```sql
 26: -- 創建 private schema 存放安全函數
 27: -- 注意：private schema 不應該在 "Exposed schemas" 中
 28: create schema if not exists private;
 29: ```
 30: 
 31: #### 2. 創建 SECURITY DEFINER 函數
 32: 
 33: ```sql
 34: -- 示例：檢查用戶是否是組織成員
 35: create or replace function private.is_user_org_member(
 36:   org_account_id UUID, 
 37:   user_auth_id UUID
 38: )
 39: returns boolean
 40: language plpgsql
 41: security definer  -- 關鍵：以創建者權限執行
 42: set search_path = ''  -- 防止 search_path 注入攻擊
 43: as $$
 44: begin
 45:   return exists (
 46:     select 1
 47:     from public.team_members tm
 48:     join public.teams t on tm.team_id = t.id
 49:     join public.accounts a on tm.account_id = a.id
 50:     where t.organization_id = org_account_id
 51:       and a.auth_user_id = user_auth_id
 52:   );
 53: end;
 54: $$;
 55: ```
 56: 
 57: #### 3. 在 RLS 策略中使用函數
 58: 
 59: ```sql
 60: -- 更新 accounts 表的 SELECT 策略
 61: create policy "Users can view own account or organization accounts they belong"
 62: on accounts for select
 63: to authenticated
 64: using (
 65:   (select auth.uid()) = auth_user_id
 66:   OR (
 67:     type = 'Organization'
 68:     AND (select private.is_user_org_member(id, auth.uid()))
 69:   )
 70: );
 71: ```
 72: 
 73: ---
 74: 
 75: ## 🔑 關鍵要點
 76: 
 77: ### 1. SECURITY DEFINER 的作用
 78: 
 79: - **以創建者權限執行**：函數內部查詢不受調用者的 RLS 限制
 80: - **避免遞歸**：函數內部查詢 `accounts` 表時不會觸發 `accounts` 表的 RLS 策略
 81: - **性能優化**：減少 RLS 檢查次數，提高查詢性能
 82: 
 83: ### 2. 安全注意事項
 84: 
 85: ⚠️ **重要**：
 86: - **不要將 SECURITY DEFINER 函數放在暴露的 schema 中**
 87: - 使用 `set search_path = ''` 防止 search_path 注入攻擊
 88: - 函數應該放在 `private` schema 中，並確保 `private` schema 不在 "Exposed schemas" 列表中
 89: 
 90: ### 3. 性能優化建議
 91: 
 92: 官方文檔建議使用 `select` 包裝函數調用以提高性能：
 93: 
 94: ```sql
 95: -- ❌ 不推薦：函數在每行都執行
 96: using ( private.is_user_org_member(id, auth.uid()) )
 97: 
 98: -- ✅ 推薦：函數只執行一次，結果被緩存
 99: using ( (select private.is_user_org_member(id, auth.uid())) )
100: ```
101: 
102: ---
103: 
104: ## 📚 官方文檔示例
105: 
106: ### 完整示例（來自 Supabase 文檔）
107: 
108: ```sql
109: -- 創建 private schema
110: create schema if not exists private;
111: 
112: -- 創建 SECURITY DEFINER 函數
113: create function private.has_good_role()
114: returns boolean
115: language plpgsql
116: security definer  -- 以創建者權限執行
117: as $$
118: begin
119:   return exists (
120:     select 1 from roles_table
121:     where (select auth.uid()) = user_id 
122:       and role = 'good_role'
123:   );
124: end;
125: $$;
126: 
127: -- 在 RLS 策略中使用函數
128: create policy "rls_test_select"
129: on test_table
130: to authenticated
131: using ( (select private.has_good_role()) );
132: ```
133: 
134: ---
135: 
136: ## 🎯 我們的實施方案
137: 
138: ### 針對 accounts 表的 RLS 遞歸問題
139: 
140: #### 1. 創建輔助函數
141: 
142: ```sql
143: -- 檢查用戶是否是組織成員
144: create or replace function private.is_user_org_member(
145:   org_account_id UUID, 
146:   user_auth_id UUID
147: )
148: returns boolean
149: language plpgsql
150: security definer
151: set search_path = ''
152: as $$
153: begin
154:   return exists (
155:     select 1
156:     from public.team_members tm
157:     join public.teams t on tm.team_id = t.id
158:     join public.accounts a on tm.account_id = a.id
159:     where t.organization_id = org_account_id
160:       and a.auth_user_id = user_auth_id
161:   );
162: end;
163: $$;
164: 
165: -- 檢查用戶是否是組織管理員
166: create or replace function private.is_user_org_admin(
167:   org_account_id UUID, 
168:   user_auth_id UUID
169: )
170: returns boolean
171: language plpgsql
172: security definer
173: set search_path = ''
174: as $$
175: begin
176:   return exists (
177:     select 1
178:     from public.team_members tm
179:     join public.teams t on tm.team_id = t.id
180:     join public.accounts a on tm.account_id = a.id
181:     where t.organization_id = org_account_id
182:       and a.auth_user_id = user_auth_id
183:       and tm.role = 'leader'
184:   );
185: end;
186: $$;
187: ```
188: 
189: #### 2. 更新 RLS 策略
190: 
191: ```sql
192: -- 刪除舊策略
193: drop policy if exists "Users can view own account or organization accounts they belong" on accounts;
194: drop policy if exists "Users can update own account or organization accounts they mana" on accounts;
195: 
196: -- 創建新策略（使用 SECURITY DEFINER 函數）
197: create policy "Users can view own account or organization accounts they belong"
198: on accounts for select
199: to authenticated
200: using (
201:   (select auth.uid()) = auth_user_id
202:   OR (
203:     type = 'Organization'
204:     AND (select private.is_user_org_member(id, auth.uid()))
205:   )
206: );
207: 
208: create policy "Users can update own account or organization accounts they manage"
209: on accounts for update
210: to authenticated
211: using (
212:   (select auth.uid()) = auth_user_id
213:   OR (
214:     type = 'Organization'
215:     AND (select private.is_user_org_admin(id, auth.uid()))
216:   )
217: )
218: with check (
219:   (select auth.uid()) = auth_user_id
220:   OR (
221:     type = 'Organization'
222:     AND (select private.is_user_org_admin(id, auth.uid()))
223:   )
224: );
225: ```
226: 
227: ---
228: 
229: ## ✅ 驗證步驟
230: 
231: 1. **檢查函數是否創建成功**：
232: ```sql
233: SELECT proname, prosecdef 
234: FROM pg_proc 
235: WHERE pronamespace = 'private'::regnamespace;
236: ```
237: 
238: 2. **測試查詢**：
239: ```sql
240: -- 應該返回 200 OK，不再出現遞歸錯誤
241: GET /rest/v1/accounts?select=*
242: ```
243: 
244: 3. **驗證權限控制**：
245: - 用戶只能看到自己的 account
246: - 用戶可以看到所屬組織的 account
247: - 用戶只能更新自己的 account 或管理的組織 account
248: 
249: ---
250: 
251: ## 📖 參考資源
252: 
253: - [Supabase RLS 文檔](https://supabase.com/docs/guides/database/postgres/row-level-security)
254: - [SECURITY DEFINER 函數說明](https://supabase.com/docs/guides/database/postgres/row-level-security#use-security-definer-functions)
255: - [RLS 性能最佳實踐](https://github.com/orgs/supabase/discussions/14576)
256: 
257: ---
258: 
259: **最後更新**：2025-01-15  
260: **維護者**：開發團隊
`````

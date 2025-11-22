import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchType, BranchStatus, BranchContextService } from '@core';
import { SHARED_IMPORTS, BranchService, BlueprintService, AccountService, BranchPermissionService, BranchPermissionLevel, AuthStateService } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-branch-detail',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './branch-detail.html',
  styleUrl: './branch-detail.less'
})
export class BranchDetailComponent implements OnInit {
  branchService = inject(BranchService);
  blueprintService = inject(BlueprintService);
  accountService = inject(AccountService);
  branchPermissionService = inject(BranchPermissionService);
  branchContext = inject(BranchContextService);
  authState = inject(AuthStateService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  message = inject(NzMessageService);

  branchId = signal<string | null>(null);
  loading = signal<boolean>(false);
  switching = signal<boolean>(false);

  // 導出枚舉供模板使用
  BranchType = BranchType;
  BranchStatus = BranchStatus;
  BranchPermissionLevel = BranchPermissionLevel;

  // 使用 computed 獲取分支和相關信息
  branch = computed(() => this.branchService.selectedBranch());
  blueprint = computed(() => this.blueprintService.selectedBlueprint());

  // 組織信息
  organization = computed(() => {
    const branch = this.branch();
    if (!branch) return null;
    return this.accountService.accounts().find(a => a.id === branch.organization_id) || null;
  });

  // 當前用戶 ID
  currentUserId = computed(() => this.authState.user()?.id || null);

  // 當前用戶權限
  currentUserPermission = computed(() => {
    const branch = this.branch();
    const userId = this.currentUserId();
    if (!branch || !userId) return null;
    
    // 從權限服務中查找當前用戶的權限
    const permissions = this.branchPermissionService.permissions();
    return permissions.find(p => p.user_id === userId) || null;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    const shouldSwitch = this.route.snapshot.queryParamMap.get('switch') === 'true';

    if (!id) {
      this.message.error('分支ID不存在');
      this.router.navigate(['/blueprints']);
      return;
    }

    this.branchId.set(id);
    this.loadBranch(id);

    // 如果需要切換分支，自動執行切換
    if (shouldSwitch) {
      this.switchToBranch();
    }
  }

  async loadBranch(id: string): Promise<void> {
    this.loading.set(true);
    try {
      const branch = await this.branchService.loadBranchById(id);
      if (branch) {
        this.branchService.selectBranch(branch);

        // 加載藍圖信息
        if (branch.blueprint_id) {
          await this.blueprintService.loadBlueprintById(branch.blueprint_id);
        }

        // 加載組織信息
        if (branch.organization_id) {
          await this.accountService.loadAccountById(branch.organization_id);
        }

        // 加載分支權限
        await this.branchPermissionService.loadPermissionsByBranchId(id);
      }
    } catch (error) {
      this.message.error('加載分支詳情失敗');
      console.error('Load branch error:', error);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * 切換到當前分支
   */
  async switchToBranch(): Promise<void> {
    const branch = this.branch();
    if (!branch) {
      this.message.error('分支不存在');
      return;
    }

    this.switching.set(true);
    try {
      // 設置當前分支到全局上下文
      this.branchContext.setCurrentBranch(branch);

      // 導航到藍圖主頁面，並設置當前分支參數
      if (branch.blueprint_id) {
        this.router.navigate(['/blueprints', branch.blueprint_id], {
          queryParams: { branchId: branch.id }
        });
        this.message.success(`已切換到分支：${branch.branch_name}`);
      }
    } catch (error) {
      this.message.error('切換分支失敗');
      console.error('Switch branch error:', error);
    } finally {
      this.switching.set(false);
    }
  }

  /**
   * 返回分支列表
   */
  goBack(): void {
    const branch = this.branch();
    if (branch?.blueprint_id) {
      this.router.navigate(['/blueprints', branch.blueprint_id, 'branches']);
    } else {
      this.router.navigate(['/blueprints']);
    }
  }

  /**
   * 獲取分支類型標籤
   */
  getBranchTypeLabel(type: string | null): string {
    if (!type) return '未知';
    const labels: Record<string, string> = {
      contractor: '承攬商',
      subcontractor: '次承攬商',
      consultant: '顧問'
    };
    return labels[type] || type;
  }

  /**
   * 獲取分支狀態標籤
   */
  getBranchStatusLabel(status: string | null): string {
    if (!status) return '未知';
    const labels: Record<string, string> = {
      active: '活躍',
      merged: '已合併',
      closed: '已關閉',
      archived: '已歸檔'
    };
    return labels[status] || status;
  }

  /**
   * 獲取分支狀態顏色
   */
  getBranchStatusColor(status: string | null): string {
    if (!status) return 'default';
    const colors: Record<string, string> = {
      active: 'success',
      merged: 'blue',
      closed: 'default',
      archived: 'orange'
    };
    return colors[status] || 'default';
  }

  /**
   * 獲取賬戶名稱
   */
  getAccountName(accountId: string): string | null {
    const account = this.accountService.accounts().find(a => a.id === accountId);
    return account?.name || null;
  }
}

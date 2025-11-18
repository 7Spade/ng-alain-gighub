import { Pipe, PipeTransform } from '@angular/core';

/**
 * Role Pipe
 *
 * 格式化角色值为人类可读的文本
 * 使用 Angular 20 独立管道模式
 *
 * 支持的角色类型：
 * - Organization: owner, admin, member
 * - Team: leader, member
 * - Permission: read, write, admin, owner
 * - Branch: viewer, contributor, approver, admin
 *
 * @example
 * ```html
 * <!-- 基本使用 -->
 * <span>{{ 'admin' | role }}</span>
 * <!-- 输出: 管理员 -->
 *
 * <!-- 指定类型 -->
 * <span>{{ 'leader' | role:'team' }}</span>
 * <!-- 输出: 团队负责人 -->
 *
 * <!-- 在列表中使用 -->
 * <nz-tag *ngFor="let role of userRoles">
 *   {{ role | role:'organization' }}
 * </nz-tag>
 * ```
 */
@Pipe({
  name: 'role',
  standalone: true
})
export class RolePipe implements PipeTransform {
  private readonly roleMap: Record<string, Record<string, string>> = {
    organization: {
      owner: '拥有者',
      admin: '管理员',
      member: '成员'
    },
    team: {
      leader: '团队负责人',
      member: '团队成员'
    },
    permission: {
      read: '只读',
      write: '读写',
      admin: '管理员',
      owner: '拥有者'
    },
    branch: {
      viewer: '查看者',
      contributor: '贡献者',
      approver: '审批者',
      admin: '管理员'
    },
    default: {
      owner: '拥有者',
      admin: '管理员',
      member: '成员',
      user: '用户',
      guest: '访客',
      viewer: '查看者',
      editor: '编辑者',
      contributor: '贡献者',
      approver: '审批者',
      leader: '负责人',
      manager: '管理者'
    }
  };

  transform(value: string | null | undefined, type: string = 'default'): string {
    if (!value) return '';

    const normalizedValue = value.toLowerCase();
    const typeMap = this.roleMap[type] || this.roleMap.default;
    
    return typeMap[normalizedValue] || value;
  }
}

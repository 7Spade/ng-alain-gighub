import { Routes } from '@angular/router';

export const SYSTEM_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'settings',
    pathMatch: 'full'
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/system-settings.component').then(m => m.SystemSettingsComponent)
  },
  {
    path: 'settings/personal',
    loadComponent: () => import('./settings/personal/personal-settings.component').then(m => m.PersonalSettingsComponent)
  },
  {
    path: 'settings/project',
    loadComponent: () => import('./settings/project/project-settings.component').then(m => m.ProjectSettingsComponent)
  },
  {
    path: 'settings/global',
    loadComponent: () => import('./settings/global/global-settings.component').then(m => m.GlobalSettingsComponent)
  },
  {
    path: 'feature-flags',
    loadComponent: () => import('./feature-flags/feature-flag.component').then(m => m.FeatureFlagComponent)
  },
  {
    path: 'roles',
    loadComponent: () => import('./roles/role-management.component').then(m => m.RoleManagementComponent)
  },
  {
    path: 'permissions',
    loadComponent: () => import('./permissions/permission-assignment.component').then(m => m.PermissionAssignmentComponent)
  },
  {
    path: 'permission-matrix',
    loadComponent: () => import('./permission-matrix/permission-matrix.component').then(m => m.PermissionMatrixComponent)
  },
  {
    path: 'branch-permissions',
    loadComponent: () => import('./branch-permissions/branch-permission.component').then(m => m.BranchPermissionComponent)
  },
  {
    path: 'weather-api',
    loadComponent: () => import('./weather-api/weather-api.component').then(m => m.WeatherApiComponent)
  },
  {
    path: 'activity-logs',
    loadComponent: () => import('./activity-logs/system-activity-log.component').then(m => m.SystemActivityLogComponent)
  },
  {
    path: 'backup',
    loadComponent: () => import('./backup/backup').then(m => m.Backup)
  }
];

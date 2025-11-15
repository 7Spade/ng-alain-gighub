import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./list/list.component').then(m => m.BlueprintListComponent),
    data: { title: '藍圖列表' }
  },
  {
    path: 'new',
    loadComponent: () => import('./create/create.component').then(m => m.BlueprintCreateComponent),
    data: { title: '創建藍圖' }
  },
  {
    path: ':slug',
    loadChildren: () => import('./detail/detail.routes').then(m => m.routes),
    data: { title: '藍圖詳情' }
  },
  {
    path: ':org/:slug',
    loadChildren: () => import('./detail/detail.routes').then(m => m.routes),
    data: { title: '藍圖詳情' }
  }
];

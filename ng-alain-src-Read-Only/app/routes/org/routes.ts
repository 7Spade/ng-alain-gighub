import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    path: ':slug',
    loadChildren: () => import('./organization.routes').then(m => m.routes),
    data: { title: '組織詳情' }
  }
];

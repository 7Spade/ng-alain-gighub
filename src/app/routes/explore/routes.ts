import { Routes } from '@angular/router';

export const EXPLORE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./explore.component').then(m => m.ExploreComponent),
    data: { title: '探索', titleI18n: 'menu.explore' }
  }
];

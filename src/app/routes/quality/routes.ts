import { Routes } from '@angular/router';

export const QUALITY_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'checks',
    pathMatch: 'full'
  },
  {
    path: 'checks',
    loadComponent: () => import('./checks/quality-checks.component').then(m => m.QualityChecksComponent)
  },
  {
    path: 'checks/:id',
    loadComponent: () => import('./checks/detail/quality-check-detail.component').then(m => m.QualityCheckDetailComponent)
  },
  {
    path: 'submit',
    loadComponent: () => import('./submit/quality-submit.component').then(m => m.QualitySubmitComponent)
  },
  {
    path: 'inspections',
    loadComponent: () => import('./inspections/quality-inspections.component').then(m => m.QualityInspectionsComponent)
  },
  {
    path: 'inspections/detail',
    loadComponent: () => import('./inspections/detail/quality-inspection-detail').then(m => m.QualityInspectionDetailComponent)
  },
  {
    path: 'photos',
    loadComponent: () => import('./photos/quality-photos.component').then(m => m.QualityPhotosComponent)
  },
  {
    path: 'results',
    loadComponent: () => import('./results/quality-results.component').then(m => m.QualityResultsComponent)
  }
];

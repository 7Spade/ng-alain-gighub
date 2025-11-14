import { Routes } from '@angular/router';

export const DOCUMENT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./list/document-list.component').then(m => m.DocumentListComponent)
  },
  {
    path: 'upload',
    loadComponent: () => import('./upload/document-upload.component').then(m => m.DocumentUploadComponent)
  },
  {
    path: 'browser',
    loadComponent: () =>
      import('./browser/document-browser.component').then(m => m.DocumentBrowserComponent)
  },
  {
    path: 'preview',
    loadComponent: () =>
      import('./preview/document-preview.component').then(m => m.DocumentPreviewComponent)
  },
  {
    path: 'drawings',
    loadComponent: () =>
      import('./drawings/drawing-viewer.component').then(m => m.DrawingViewerComponent)
  },
  {
    path: 'metadata',
    loadComponent: () =>
      import('./metadata/document-metadata.component').then(m => m.DocumentMetadataComponent)
  },
  {
    path: 'versions',
    loadComponent: () =>
      import('./versions/document-version.component').then(m => m.DocumentVersionComponent)
  },
  {
    path: 'permissions',
    loadComponent: () =>
      import('./permissions/document-permission.component').then(m => m.DocumentPermissionComponent)
  }
];



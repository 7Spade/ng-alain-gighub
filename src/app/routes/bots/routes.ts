import { Routes } from '@angular/router';

export const BOT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./list/bot-list.component').then(m => m.BotListComponent)
  },
  {
    path: 'config',
    loadComponent: () => import('./config/bot-config.component').then(m => m.BotConfigComponent)
  },
  {
    path: 'executions',
    loadComponent: () =>
      import('./executions/bot-execution.component').then(m => m.BotExecutionComponent)
  }
];



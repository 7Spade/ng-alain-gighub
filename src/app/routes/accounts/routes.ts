import { Routes } from '@angular/router';
import { AccountListComponent } from './list/account-list.component';
import { AccountDetailComponent } from './detail/account-detail.component';
import { AccountFormComponent } from './form/account-form.component';
import { TeamListComponent } from './teams/team-list.component';
import { TeamDetailComponent } from './teams/team-detail/team-detail.component';
import { ScheduleListComponent } from './schedules/schedule-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: AccountListComponent },
  { path: 'create', component: AccountFormComponent },
  { path: ':id', component: AccountDetailComponent },
  { path: ':id/edit', component: AccountFormComponent },
  { path: 'teams', component: TeamListComponent },
  { path: 'teams/:id', component: TeamDetailComponent },
  { path: 'schedules', component: ScheduleListComponent }
];


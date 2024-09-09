import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TasksComponent } from './tasks/tasks.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full', title: 'Login'},
  { path: 'login', component: LoginComponent, title: 'Login'},
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard'},
  { path: 'tasks', component: TasksComponent, title: 'Tasks'}
];

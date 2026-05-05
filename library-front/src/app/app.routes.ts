import { Routes } from '@angular/router';
import { BooksComponent } from './pages/books/books.component';
import { UsersComponent } from './pages/users/users.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmpruntsComponent } from './pages/emprunts/emprunts.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'books', component: BooksComponent },
  { path: 'users', component: UsersComponent },
  { path: 'emprunts', component: EmpruntsComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];

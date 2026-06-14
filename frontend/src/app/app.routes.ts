import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/homeComponent';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'carte', loadComponent: () => import('./pages/map/mapComponent').then(m => m.MapComponent) },
  { path: 'bornes', loadComponent: () => import('./pages/stations/stationsComponent').then(m => m.StationsComponent) },
  { path: 'a-propos', loadComponent: () => import('./pages/about/aboutComponent').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contactComponent').then(m => m.ContactComponent) },
  { path: 'connexion', loadComponent: () => import('./pages/login/loginComponent').then(m => m.LoginComponent) },
  { path: 'inscription', loadComponent: () => import('./pages/register/registerComponent').then(m => m.RegisterComponent) },
  {   path : 'admin/dashboard',    loadComponent : () => import('./components/admin/admin-dashboard.component/admin-dashboard.component').then(m => m.AdminDashboardComponent)  },
  {   path : 'conducteur/dashboard',    loadComponent : () => import('./components/conducteur/conducteur-dashboard.component/conducteur-dashboard.component').then(m => m.ConducteurDashboardComponent)  },
  
  { path: '**', redirectTo: '' }


];
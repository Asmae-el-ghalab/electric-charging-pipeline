import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/homeComponent';
import { AuthGuard } from '../app/guards/auth-guard';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bornes', loadComponent: () => import('./pages/stations/stationsComponent').then(m => m.StationsComponent) },
  
  // ✅ AJOUTEZ CETTE LIGNE POUR LES DÉTAILS D'UNE BORNE
  { path: 'borne/:id', loadComponent: () => import('./pages/stations/stationsComponent').then(m => m.StationsComponent) },
  
  // Ou si vous voulez un composant dédié
  // { path: 'borne/:id', loadComponent: () => import('./pages/borne-detail/borne-detail.component').then(m => m.BorneDetailComponent) },
  
  { path: 'a-propos', loadComponent: () => import('./pages/about/aboutComponent').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contactComponent').then(m => m.ContactComponent) },
  { path: 'connexion', loadComponent: () => import('./pages/login/loginComponent').then(m => m.LoginComponent) },
  { path: 'inscription', loadComponent: () => import('./pages/register/registerComponent').then(m => m.RegisterComponent) },
  { path: 'admin/dashboard', loadComponent: () => import('./components/admin/admin-dashboard.component/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'conducteur/dashboard', loadComponent: () => import('./components/conducteur/conducteur-dashboard.component/conducteur-dashboard.component').then(m => m.ConducteurDashboardComponent) },
  { path: 'carte', loadComponent: () => import('./pages/map/mapComponent').then(m => m.MapComponent) },
    { 
    path: 'sessions/:id', 
    loadComponent: () => import('./pages/session/session.component/session.component').then(m => m.SessionComponent),
    canActivate: [AuthGuard]
  },
  { path: 'borne-detail/:id', loadComponent: () => import('./pages/borne-detail/borne-detail').then(m => m.BorneDetailComponent) },
  { path: '**', redirectTo: '' }
];
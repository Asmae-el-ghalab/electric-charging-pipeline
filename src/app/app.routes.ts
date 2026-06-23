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
  
  { path: 'conducteur/dashboard', loadComponent: () => import('./components/conducteur/conducteur-dashboard.component/conducteur-dashboard.component').then(m => m.ConducteurDashboardComponent) },
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin/admin-layout.component/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
      path: '',
      loadComponent: () =>
        import('./components/admin/admin-statistics.component/admin-statistics.component')
          .then(m => m.AdminStatisticsComponent)
    },
      { path: 'dashboard', loadComponent: () => import('./components/admin/admin-dashboard.component/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'utilisateurs', loadComponent: () => import('./components/admin/admin-utilisateurs.component/admin-utilisateurs.component').then(m => m.AdminUtilisateursComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
  path: 'signalements',
  loadComponent: () =>
    import('./components/admin/admin-signalements.component/admin-signalements.component')
      .then(m => m.AdminSignalementsComponent)
}

    ]
  },
  { path: 'carte', loadComponent: () => import('./pages/map/mapComponent').then(m => m.MapComponent) },
    { 
    path: 'sessions/:id', 
    loadComponent: () => import('./pages/session/session.component/session.component').then(m => m.SessionComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
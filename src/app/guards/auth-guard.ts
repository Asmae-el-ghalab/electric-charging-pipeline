// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isLoggedIn()) {
      console.log('🚫 Utilisateur non connecté, redirection vers connexion');
      this.router.navigate(['/connexion']);
      return false;
    }

    // ✅ VÉRIFICATION : Si l'utilisateur est bloqué
    if (this.authService.isBlocked()) {
      console.log('🚫 Utilisateur bloqué, accès refusé');
      alert('❌ Votre compte a été bloqué par un administrateur.');
      this.authService.logout();
      this.router.navigate(['/connexion']);
      return false;
    }

    console.log('✅ Accès autorisé pour:', this.authService.getUserName());
    return true;
  }
}
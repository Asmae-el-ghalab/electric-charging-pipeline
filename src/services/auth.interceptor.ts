import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token
    const token = this.authService.getToken();
    
    // Clone the request and add the authorization header
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    // Handle the response
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // ✅ VÉRIFICATION : Si l'utilisateur est bloqué (403)
        if (error.status === 403) {
          console.log('🚫 Accès refusé (403) - Vérification du blocage...');
          
          // Vérifier si l'utilisateur est bloqué
          if (this.authService.isBlocked()) {
            console.log('🚫 Utilisateur bloqué, déconnexion...');
            alert('❌ Votre compte a été bloqué par un administrateur.');
            this.authService.logout();
            this.router.navigate(['/connexion']);
            return throwError(() => error);
          }
          
          // Si l'utilisateur n'est pas bloqué mais a un token invalide
          this.authService.logout();
          this.router.navigate(['/connexion']);
          return throwError(() => error);
        }
        
        // Si token invalide ou expiré (401)
        if (error.status === 401) {
          console.log('🔑 Token invalide ou expiré, déconnexion...');
          this.authService.logout();
          this.router.navigate(['/connexion']);
        }
        
        return throwError(() => error);
      })
    );
  }
}
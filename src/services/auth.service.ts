// src/app/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  success?: boolean;
  token: string;
  role: string;
  nom: string;
  email: string;
  id?: number;
  message?: string;
  error?: string;
}

export interface RegisterRequest {
  nom: string;
  email: string;
  motDePasse: string;
  vehicule?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    nom: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('📤 Envoi de la requête login:', credentials);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('📥 Réponse reçue:', response);
          
          if (response.token && !response.error && this.isBrowser()) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', response.role);
            localStorage.setItem('userName', response.nom);
            localStorage.setItem('userEmail', response.email);
            if (response.id) {
              localStorage.setItem('userId', response.id.toString());
            }
            console.log('✅ Données stockées avec succès');
          } else if (response.error) {
            console.error('❌ Erreur dans la réponse:', response.error);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    console.log('📤 Envoi de la requête d\'inscription:', userData);
    
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          console.log('✅ Réponse reçue:', response);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.clear();
    }
    this.router.navigate(['/connexion']);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    const token = localStorage.getItem('token');
    return !!token;
  }

  getUserRole(): string {
    if (!this.isBrowser()) return '';
    const role = localStorage.getItem('userRole');
    return role || '';
  }

  getUserName(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem('userName') || '';
  }

  getUserEmail(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem('userEmail') || '';
  }

  getUserId(): number {
    if (!this.isBrowser()) return 0;
    const id = localStorage.getItem('userId');
    return id ? parseInt(id) : 0;
  }

  getToken(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem('token') || '';
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'ADMIN';
  }

  isConducteur(): boolean {
    const role = this.getUserRole();
    return role === 'CONDUCTEUR';
  }

  isPassager(): boolean {
    const role = this.getUserRole();
    return role === 'PASSAGER';
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
      console.error('Erreur client:', errorMessage);
    } else {
      if (error.error && error.error.error) {
        errorMessage = error.error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Code ${error.status}: ${error.message}`;
      }
      console.error('Erreur serveur:', errorMessage);
    }
    
    return throwError(() => ({ error: errorMessage, status: error.status }));
  }
}
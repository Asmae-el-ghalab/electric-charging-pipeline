// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
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
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('📤 Envoi de la requête login:', credentials);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('📥 Réponse reçue:', response);
          
          if (response.token && !response.error) {
            // Stocker les données utilisateur
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', response.role);
            localStorage.setItem('userName', response.nom);
            localStorage.setItem('userEmail', response.email);
            if (response.id) {
              localStorage.setItem('userId', response.id.toString());
            }
            
            console.log('✅ Données stockées avec succès');
            console.log('📦 Rôle stocké:', response.role);
          } else if (response.error) {
            console.error('❌ Erreur dans la réponse:', response.error);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          console.log('Inscription réussie:', response);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getUserRole(): string {
    const role = localStorage.getItem('userRole');
    console.log('🔍 Rôle récupéré du storage:', role);
    return role || '';
  }

  getUserName(): string {
    return localStorage.getItem('userName') || '';
  }

  getUserEmail(): string {
    return localStorage.getItem('userEmail') || '';
  }

  getUserId(): number {
    const id = localStorage.getItem('userId');
    return id ? parseInt(id) : 0;
  }

  getToken(): string {
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
      // Erreur côté client
      errorMessage = error.error.message;
      console.error('Erreur client:', errorMessage);
    } else {
      // Erreur côté serveur
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
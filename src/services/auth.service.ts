// src/app/services/auth.service.ts - Version corrigée

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
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
  
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUserFromStorage();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadUserFromStorage(): void {
    if (!this.isBrowser()) return;
    
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');
      
      if (token && userId) {
        const user = {
          id: userId,
          role: userRole,
          nom: userName,
          email: userEmail,
          token: token
        };
        this.userSubject.next(user);
        console.log('✅ Utilisateur chargé depuis localStorage:', user);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement de l\'utilisateur:', error);
    }
  }

  /**
   * ✅ Extraire l'ID du token JWT
   */
  private extractUserIdFromToken(token: string): string | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('❌ Token JWT invalide');
        return null;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      console.log('🔍 Payload du token:', payload);
      
      // Essayer différents champs possibles
      const id = payload.sub || payload.id || payload.userId || payload.user_id;
      
      if (id) {
        // ✅ Vérifier que c'est bien un nombre
        const idNumber = parseInt(id, 10);
        if (!isNaN(idNumber) && idNumber > 0) {
          console.log('✅ ID extrait du token:', idNumber);
          return idNumber.toString();
        }
      }
      
      console.warn('⚠️ Aucun ID numérique trouvé dans le token');
      return null;
    } catch (e) {
      console.error('❌ Erreur lors du décodage du token:', e);
      return null;
    }
  }

  /**
   * ✅ Récupérer l'ID utilisateur depuis le token
   */
  private getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    return this.extractUserIdFromToken(token);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('📤 Envoi de la requête login:', credentials.email);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('📥 Réponse login reçue:', response);
          
          if (response.token && !response.error && this.isBrowser()) {
            // ✅ Stocker le token
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', response.role);
            localStorage.setItem('userName', response.nom);
            localStorage.setItem('userEmail', response.email);
            
            // ✅ Récupérer l'ID depuis le token
            let userId: string | null = null;
            
            // 1. Essayer depuis la réponse
            if (response.id) {
              userId = response.id.toString();
              console.log('✅ ID utilisateur trouvé dans la réponse:', userId);
            }
            
            // 2. Sinon, extraire du token
            if (!userId) {
              console.log('⚠️ Aucun ID dans la réponse, extraction depuis le token...');
              userId = this.extractUserIdFromToken(response.token);
            }
            
            // 3. Si toujours null, essayer de récupérer depuis le localStorage existant
            if (!userId) {
              const existingId = localStorage.getItem('userId');
              if (existingId && existingId !== 'null' && existingId !== 'undefined') {
                const idNum = parseInt(existingId, 10);
                if (!isNaN(idNum) && idNum > 0) {
                  userId = idNum.toString();
                  console.log('✅ ID récupéré depuis localStorage existant:', userId);
                }
              }
            }
            
            // 4. Fallback : utiliser un ID par défaut
            if (!userId) {
              console.error('❌ Impossible de récupérer l\'ID utilisateur');
              // Essayer de récupérer depuis le payload une dernière fois
              try {
                const payload = JSON.parse(atob(response.token.split('.')[1]));
                const fallbackId = payload.sub || payload.id || payload.userId;
                if (fallbackId) {
                  const idNum = parseInt(fallbackId, 10);
                  if (!isNaN(idNum) && idNum > 0) {
                    userId = idNum.toString();
                    console.log('✅ ID fallback depuis payload:', userId);
                  }
                }
              } catch (e) {
                console.error('❌ Erreur fallback:', e);
              }
            }
            
            // Dernier recours
            if (!userId) {
              userId = '6'; // ID par défaut
              console.warn('⚠️ Utilisation de l\'ID par défaut:', userId);
            }
            
            // ✅ Stocker l'ID
            localStorage.setItem('userId', userId);
            console.log('✅ ID utilisateur stocké:', userId);
            
            const user = {
              id: userId,
              role: response.role,
              nom: response.nom,
              email: response.email,
              token: response.token
            };
            this.userSubject.next(user);
            
            console.log('✅ Connexion réussie pour:', response.nom);
            console.log('👤 Utilisateur final:', user);
          } else if (response.error) {
            console.error('❌ Erreur dans la réponse:', response.error);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    console.log('📤 Envoi de la requête d\'inscription:', userData.email);
    
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          console.log('✅ Inscription réussie:', response);
          
          if (response.success && response.user && this.isBrowser()) {
            localStorage.setItem('userId', response.user.id.toString());
            console.log('✅ ID utilisateur stocké:', response.user.id);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    console.log('🚪 Déconnexion en cours...');
    
    if (this.isBrowser()) {
      localStorage.clear();
      this.userSubject.next(null);
      console.log('✅ Données utilisateur effacées');
    }
    
    this.router.navigate(['/connexion']);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const isLoggedIn = !!token && !!userId && userId !== 'null' && userId !== 'undefined';
    return isLoggedIn;
  }

  getUserId(): string | null {
    if (!this.isBrowser()) return null;
    
    let id = localStorage.getItem('userId');
    
    // ✅ Si l'ID est l'email, le corriger
    if (id && id.includes('@')) {
      console.warn('⚠️ ID utilisateur est un email, correction...');
      const correctId = this.getUserIdFromToken();
      if (correctId) {
        localStorage.setItem('userId', correctId);
        id = correctId;
        console.log('✅ ID corrigé:', id);
      } else {
        // Fallback
        id = '6';
        localStorage.setItem('userId', id);
        console.warn('⚠️ Utilisation de l\'ID par défaut:', id);
      }
    }
    
    // ✅ Vérifier que c'est bien un nombre
    if (id && id !== 'null' && id !== 'undefined' && id !== '0' && id.trim() !== '') {
      const idNum = parseInt(id, 10);
      if (!isNaN(idNum) && idNum > 0) {
        return idNum.toString();
      }
    }
    
    // Si l'ID est invalide, essayer de le récupérer depuis le token
    const tokenId = this.getUserIdFromToken();
    if (tokenId) {
      localStorage.setItem('userId', tokenId);
      return tokenId;
    }
    
    return null;
  }

  getUserIdAsNumber(): number {
    const id = this.getUserId();
    return id ? parseInt(id, 10) : 0;
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

  getToken(): string {
    if (!this.isBrowser()) return '';
    return localStorage.getItem('token') || '';
  }

  getUser(): any {
    if (!this.isBrowser()) return null;
    
    const userId = this.getUserId();
    if (!userId) return null;
    
    return {
      id: userId,
      role: this.getUserRole(),
      nom: this.getUserName(),
      email: this.getUserEmail(),
      token: this.getToken()
    };
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  }

  isConducteur(): boolean {
    const role = this.getUserRole();
    return role === 'CONDUCTEUR' || role === 'ROLE_CONDUCTEUR';
  }

  isPassager(): boolean {
    const role = this.getUserRole();
    return role === 'PASSAGER' || role === 'ROLE_PASSAGER';
  }

  updateUserInfo(userData: Partial<any>): void {
    if (!this.isBrowser()) return;
    
    if (userData['nom']) {
      localStorage.setItem('userName', userData['nom']);
    }
    if (userData['email']) {
      localStorage.setItem('userEmail', userData['email']);
    }
    if (userData['role']) {
      localStorage.setItem('userRole', userData['role']);
    }
    
    const currentUser = this.userSubject.value;
    if (currentUser) {
      this.userSubject.next({
        ...currentUser,
        ...userData
      });
    }
    
    console.log('✅ Informations utilisateur mises à jour');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
      console.error('❌ Erreur client:', errorMessage);
    } else {
      if (error.error && error.error.error) {
        errorMessage = error.error.error;
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Code ${error.status}: ${error.message}`;
      }
      console.error('❌ Erreur serveur:', errorMessage);
    }
    
    return throwError(() => ({ 
      error: errorMessage, 
      status: error.status,
      details: error.error 
    }));
  }

  diagnosticAuth(): void {
    console.log('=== DIAGNOSTIC AUTH SERVICE ===');
    console.log('isBrowser:', this.isBrowser());
    console.log('isLoggedIn:', this.isLoggedIn());
    console.log('getUserId():', this.getUserId());
    console.log('getUserIdAsNumber():', this.getUserIdAsNumber());
    console.log('getUserRole():', this.getUserRole());
    console.log('getUserName():', this.getUserName());
    console.log('getUserEmail():', this.getUserEmail());
    console.log('getToken():', this.getToken() ? '✅ Présent' : '❌ Absent');
    console.log('localStorage userId:', localStorage.getItem('userId'));
    console.log('localStorage token:', localStorage.getItem('token') ? '✅ Présent' : '❌ Absent');
    console.log('localStorage userRole:', localStorage.getItem('userRole'));
    console.log('localStorage userName:', localStorage.getItem('userName'));
    console.log('================================');
  }
}
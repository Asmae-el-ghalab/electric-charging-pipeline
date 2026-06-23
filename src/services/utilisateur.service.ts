import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../app/models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:8081/api/utilisateurs';

  constructor(private http: HttpClient) {}

  // Récupérer tous les utilisateurs
  getUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl);
  }

  // Récupérer un utilisateur par ID
  getUtilisateurById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les statistiques
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  // Bloquer un utilisateur
  bloquerUtilisateur(id: number): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${id}/bloquer`, {});
  }

  // Débloquer un utilisateur
  debloquerUtilisateur(id: number): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${id}/debloquer`, {});
  }

  // Supprimer un utilisateur
  supprimerUtilisateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Promouvoir en admin
  promouvoirAdmin(id: number): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${id}/promouvoir`, {});
  }

  // Rétrograder de admin
  retrograderAdmin(id: number): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${id}/retrograder`, {});
  }

  // Rechercher des utilisateurs
  rechercherUtilisateurs(term: string): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/recherche?term=${term}`);
  }

  // Filtrer par rôle
  filtrerParRole(role: string): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/filtre/role?role=${role}`);
  }

  // ==================== ✅ NOUVELLES MÉTHODES POUR LE BLOCAGE ====================

  /**
   * ✅ Vérifier si un utilisateur est bloqué
   */
  isUtilisateurBloque(id: number): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.getUtilisateurById(id).subscribe({
        next: (user) => {
          observer.next(user.estBloque || false);
          observer.complete();
        },
        error: (err) => {
          console.error('Erreur lors de la vérification du blocage:', err);
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  /**
   * ✅ Mettre à jour le statut de blocage
   */
  updateBlockedStatus(id: number, estBloque: boolean): Observable<Utilisateur> {
    if (estBloque) {
      return this.bloquerUtilisateur(id);
    } else {
      return this.debloquerUtilisateur(id);
    }
  }

  /**
   * ✅ Vérifier si l'utilisateur actuel est bloqué
   */
  isCurrentUserBlocked(): boolean {
    // Cette méthode est maintenant dans AuthService
    // On la garde ici pour compatibilité
    const estBloque = localStorage.getItem('estBloque');
    return estBloque === 'true';
  }

  /**
   * ✅ Bloquer un utilisateur et mettre à jour le localStorage
   */
  bloquerEtMettreAJour(id: number): Observable<Utilisateur> {
    return new Observable<Utilisateur>((observer) => {
      this.bloquerUtilisateur(id).subscribe({
        next: (user) => {
          // Si c'est l'utilisateur actuel, mettre à jour le localStorage
          const currentUserId = localStorage.getItem('userId');
          if (currentUserId && parseInt(currentUserId) === id) {
            localStorage.setItem('estBloque', 'true');
            console.log('✅ Statut bloqué mis à jour dans localStorage');
          }
          observer.next(user);
          observer.complete();
        },
        error: (err) => {
          console.error('Erreur lors du blocage:', err);
          observer.error(err);
        }
      });
    });
  }

  /**
   * ✅ Débloquer un utilisateur et mettre à jour le localStorage
   */
  debloquerEtMettreAJour(id: number): Observable<Utilisateur> {
    return new Observable<Utilisateur>((observer) => {
      this.debloquerUtilisateur(id).subscribe({
        next: (user) => {
          // Si c'est l'utilisateur actuel, mettre à jour le localStorage
          const currentUserId = localStorage.getItem('userId');
          if (currentUserId && parseInt(currentUserId) === id) {
            localStorage.setItem('estBloque', 'false');
            console.log('✅ Statut débloqué mis à jour dans localStorage');
          }
          observer.next(user);
          observer.complete();
        },
        error: (err) => {
          console.error('Erreur lors du déblocage:', err);
          observer.error(err);
        }
      });
    });
  }
}
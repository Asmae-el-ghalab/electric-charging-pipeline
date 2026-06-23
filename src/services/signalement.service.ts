import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface Signalement {
  id: number;
  type: string;
  description: string;
  dateSignalement: string;
  statut: string;

  conducteurId: number;
  borneId: number;
}
@Injectable({
  providedIn: 'root'
})
export class SignalementService {
  private apiUrl = 'http://localhost:8081/api/signalements';
  
  constructor(private http: HttpClient) {}
  
  /**
   * Récupérer tous les signalements
   * Puis filtrer par conducteur côté frontend
   */
 getSignalementsByConducteur(conducteurId: number): Observable<Signalement[]> {
  return this.http.get<Signalement[]>(this.apiUrl).pipe(
    map(signalements =>
      signalements.filter(s => s.conducteurId === conducteurId)
    )
  );
}
  
  /**
   * Créer un nouveau signalement
   */
  createSignalement(signalement: {
    conducteurId: number;
    borneId: number;
    type: string;
    description: string;
  }): Observable<Signalement> {
    const data = {
      conducteurId: signalement.conducteurId.toString(),
      borneId: signalement.borneId.toString(),
      type: signalement.type,
      description: signalement.description
    };
    
    return this.http.post<Signalement>(this.apiUrl, data).pipe(
      tap(newSignalement => console.log('✅ Signalement créé:', newSignalement)),
      catchError(error => {
        console.error('❌ Erreur création signalement:', error);
        throw error;
      })
    );
  }
  
  /**
   * Récupérer tous les signalements (non filtrés)
   */
  getAllSignalements(): Observable<Signalement[]> {
    return this.http.get<Signalement[]>(this.apiUrl).pipe(
      tap(signalements => console.log(`📋 ${signalements.length} signalements au total`)),
      catchError(error => {
        console.error('❌ Erreur chargement signalements:', error);
        return of([]);
      })
    );
  }
  
  /**
   * Récupérer un signalement par son ID
   */
  getSignalementById(id: number): Observable<Signalement> {
    return this.http.get<Signalement>(`${this.apiUrl}/${id}`).pipe(
      tap(signalement => console.log(`📋 Signalement #${id} chargé`)),
      catchError(error => {
        console.error(`❌ Erreur chargement signalement #${id}:`, error);
        throw error;
      })
    );
  }
}
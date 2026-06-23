// src/app/services/stations.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map, timeout } from 'rxjs/operators';

// ============================================================
// INTERFACES
// ============================================================

export interface Connection {
  id: number;
  stationId: number;
  connectionType: string;
  powerKw: number;
  quantity: number;
  voltage: number | null;
  amps: number | null;
  level: string;
  currentType: string;
}

export interface Borne {
  id: number;
  uuid?: string;
  title?: string;
  address: string;
  city?: string;
  province?: string;
  postcode?: string;
  latitude: number;
  longitude: number;
  status: 'Operational' | 'Maintenance' | 'OutOfService' | 'Planned';
  operator?: string;
  operatorWebsite?: string;
  usageCost?: string;
  isOperational?: boolean;
  isOccupied?: boolean;
  sessionId?: number | null;
  power?: number;
  connectorType?: string;
  createdAt?: string;
  updatedAt?: string;
  connections?: Connection[];
}

export interface SessionRecharge {
  id: number;
  borneId: number;
  conducteurId: string;
  dateDebut: Date;
  dateFin?: Date;
  duree?: number;
  consommation?: number;
  montantTotal?: number;
   status: 'ACTIVE' | 'TERMINEE' | 'ANNULEE' | 'PAUSED' | 'PENDING' | 'ERROR';
  createdAt?: Date;
  debut: string;
  borneNom?: string;
  villeDepart?: string;
  villeArrivee?: string;
  vehicule?: string;
  distanceKm?: number;
}

export interface PageResponse {
  content: Borne[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface Trajet {
  id: number;
  conducteurId: number;
  borneId: number;
  borneNom?: string;
  dateDebut: string | Date;
  dateFin?: string | Date;
  dureeMinutes?: number;
  consommationKwh?: number;
  coutTotal?: number;
  distanceKm?: number;
  status: 'TERMINE' | 'ANNULE' | 'EN_COURS';
  villeDepart?: string;
  villeArrivee?: string;
  vehicule?: string;
}

export interface StationFilters {
  status?: string;
  city?: string;
  operator?: string;
  minPower?: number;
  maxPower?: number;
  connectionType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StationsService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {
    console.log('🏗️ StationsService construit');
    console.log('📍 API URL:', this.apiUrl);
  }

  // ========== GESTION DES BORNES ==========

  /**
   * Récupère toutes les bornes avec pagination
   * Utilise l'API /api/bornes
   */
  getAllBornes(page: number = 0, size: number = 20): Observable<PageResponse> {
    console.log(`📡 getAllBornes() - Page: ${page}, Size: ${size}`);
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    const url = `${this.apiUrl}/bornes`;
    console.log(`📍 URL: ${url}?${params.toString()}`);
    
    return this.http.get<PageResponse>(url, { params }).pipe(
      timeout(10000),
      tap(response => {
        console.log(`✅ getAllBornes() - Réponse reçue: ${response.content?.length || 0} bornes`);
        console.log(`📊 Total: ${response.totalElements}, Pages: ${response.totalPages}`);
        
        if (response.content && response.content.length > 0) {
          const firstBorne = response.content[0];
          console.log(`🔌 Connections de la première borne: ${firstBorne.connections?.length || 0}`);
          if (firstBorne.connections && firstBorne.connections.length > 0) {
            console.log(`📋 Types de connecteurs: ${firstBorne.connections.map(c => c.connectionType).join(', ')}`);
          }
        }
      }),
      catchError((err) => {
        console.error('❌ getAllBornes() - Erreur:', err);
        console.error('📋 Status:', err.status);
        console.error('📋 Message:', err.message);
        return throwError(() => err);
      })
    );
  }

  /**
   * Récupère une borne par son ID
   * Utilise l'API /api/bornes/{id}
   */
  getBorneById(id: number): Observable<Borne> {
    console.log(`📡 getBorneById() - ID: ${id}`);
    const url = `${this.apiUrl}/bornes/${id}`;
    console.log(`📍 URL: ${url}`);
    
    return this.http.get<Borne>(url).pipe(
      timeout(5000),
      tap(borne => {
        console.log(`✅ getBorneById() - Borne trouvée: ${borne.title} (ID: ${borne.id})`);
        console.log(`📊 Status: ${borne.status}, Occupée: ${borne.isOccupied}`);
        console.log(`🔌 Connections: ${borne.connections?.length || 0}`);
      }),
      catchError((err) => {
        console.error(`❌ getBorneById(${id}) - Erreur:`, err);
        console.error('📋 Status:', err.status);
        console.error('📋 Message:', err.message);
        return throwError(() => err);
      })
    );
  }

  /**
   * Filtre les bornes
   * Utilise l'API /api/bornes/filter
   */
  filterBornes(status?: string, city?: string, operator?: string): Observable<Borne[]> {
    console.log(`📡 filterBornes() - Status: ${status || 'Tous'}, City: ${city || 'Toutes'}, Operator: ${operator || 'Tous'}`);
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (city) params = params.set('city', city);
    if (operator) params = params.set('operator', operator);
    const url = `${this.apiUrl}/bornes/filter`;
    console.log(`📍 URL: ${url}?${params.toString()}`);
    
    return this.http.get<Borne[]>(url, { params }).pipe(
      timeout(10000),
      tap(bornes => {
        console.log(`✅ filterBornes() - ${bornes.length} bornes trouvées`);
      }),
      catchError((err) => {
        console.error('❌ filterBornes() - Erreur:', err);
        return of([]);
      })
    );
  }

  // ========== GESTION DES CONNECTIONS ==========

  /**
   * Récupère les connections d'une borne
   * Utilise l'API /api/bornes/{id}/connections
   */
  getStationConnections(borneId: number): Observable<Connection[]> {
    console.log(`📡 getStationConnections() - Borne ID: ${borneId}`);
    const url = `${this.apiUrl}/bornes/${borneId}/connections`;
    console.log(`📍 URL: ${url}`);
    
    return this.http.get<Connection[]>(url).pipe(
      timeout(5000),
      tap(connections => {
        console.log(`✅ getStationConnections() - ${connections.length} connections trouvées`);
        if (connections.length > 0) {
          console.log(`📋 Types: ${connections.map(c => c.connectionType).join(', ')}`);
          console.log(`⚡ Puissances: ${connections.map(c => c.powerKw).join(', ')} kW`);
        }
      }),
      catchError((err) => {
        console.error(`❌ getStationConnections(${borneId}) - Erreur:`, err);
        console.log('📋 Status:', err.status);
        console.log('📋 Message:', err.message);
        // Fallback: essayer de récupérer les connections depuis la borne
        return this.getBorneById(borneId).pipe(
          map(borne => borne.connections || []),
          catchError(() => of([]))
        );
      })
    );
  }

  /**
   * Récupère les connections d'une borne (alias)
   */
  getBorneConnections(borneId: number): Observable<Connection[]> {
    return this.getStationConnections(borneId);
  }

  // ========== MÉTHODES UTILITAIRES POUR LES CONNECTIONS ==========

  /**
   * Formate les connections pour l'affichage
   */
  formatConnections(connections: Connection[]): string {
    if (!connections || connections.length === 0) {
      return 'Aucun connecteur';
    }
    
    return connections.map(conn => {
      const parts = [
        conn.connectionType,
        `${conn.powerKw}kW`,
        conn.quantity > 1 ? `x${conn.quantity}` : '',
        conn.currentType || ''
      ].filter(Boolean);
      return parts.join(' ');
    }).join(' | ');
  }

  /**
   * Récupère les types de connecteurs uniques
   */
  getUniqueConnectionTypes(connections: Connection[]): string[] {
    if (!connections || connections.length === 0) {
      return [];
    }
    return [...new Set(connections.map(c => c.connectionType))];
  }

  /**
   * Calcule la puissance maximale
   */
  getMaxPowerFromConnections(connections: Connection[]): number {
    if (!connections || connections.length === 0) {
      return 0;
    }
    return Math.max(...connections.map(c => c.powerKw || 0));
  }

  /**
   * Récupère le nombre total de connecteurs
   */
  getTotalConnectors(connections: Connection[]): number {
    if (!connections || connections.length === 0) {
      return 0;
    }
    return connections.reduce((sum, c) => sum + (c.quantity || 0), 0);
  }

  /**
   * Récupère les connecteurs DC
   */
  getDCConnections(connections: Connection[]): Connection[] {
    if (!connections) return [];
    return connections.filter(c => c.currentType === 'DC');
  }

  /**
   * Récupère les connecteurs AC
   */
  getACConnections(connections: Connection[]): Connection[] {
    if (!connections) return [];
    return connections.filter(c => c.currentType === 'AC (Three-Phase)');
  }

  // ========== GESTION DE LA DISPONIBILITÉ ==========

  /**
   * Vérifie la disponibilité d'une borne
   * Utilise l'API /api/bornes/{id}/disponibilite
   */
  verifierDisponibilite(borneId: number): Observable<{ disponible: boolean; message?: string }> {
    console.log(`📡 verifierDisponibilite() - Borne ID: ${borneId}`);
    const url = `${this.apiUrl}/bornes/${borneId}/disponibilite`;
    console.log(`📍 URL: ${url}`);
    
    return this.http.get<{ disponible: boolean; message?: string }>(url).pipe(
      timeout(5000),
      tap(response => {
        console.log(`✅ verifierDisponibilite() - Disponible: ${response.disponible}`);
        console.log(`📊 Message: ${response.message || 'Aucun message'}`);
      }),
      catchError((err) => {
        console.error(`❌ verifierDisponibilite(${borneId}) - Erreur:`, err);
        console.error('📋 Status:', err.status);
        console.error('📋 Message:', err.message);
        return of({ disponible: false, message: 'Erreur de vérification' });
      })
    );
  }

  // ========== GESTION DES SESSIONS DE RECHARGE ==========

  /**
   * Démarre une recharge
   * Utilise l'API /api/sessions/recharge
   */
  demarrerRecharge(borneId: number, conducteurId: string): Observable<SessionRecharge> {
    console.log(`📡 demarrerRecharge() - Borne: ${borneId}, Conducteur: ${conducteurId}`);
    const sessionData = { borneId, conducteurId, dateDebut: new Date() };
    const url = `${this.apiUrl}/sessions/recharge`;
    console.log(`📍 URL: ${url}`);
    console.log(`📦 Body:`, sessionData);
    
    return this.http.post<SessionRecharge>(url, sessionData).pipe(
      timeout(10000),
      tap(session => {
        console.log(`✅ demarrerRecharge() - Session créée: ID ${session.id}`);
        console.log(`📊 Status: ${session.status}, Borne: ${session.borneId}`);
      }),
      catchError((err) => {
        console.error(`❌ demarrerRecharge(${borneId}) - Erreur:`, err);
        console.error('📋 Status:', err.status);
        console.error('📋 Message:', err.message);
        console.error('📋 Error:', err.error);
        return throwError(() => err);
      })
    );
  }

  /**
   * Termine une recharge
   * Utilise l'API /api/sessions/{id}/terminer
   */
  terminerRecharge(sessionId: number): Observable<SessionRecharge> {
    console.log(`📡 terminerRecharge() - Session ID: ${sessionId}`);
    const url = `${this.apiUrl}/sessions/${sessionId}/terminer`;
    console.log(`📍 URL: ${url}`);
    
    return this.http.put<SessionRecharge>(url, {}).pipe(
      timeout(10000),
      tap(session => {
        console.log(`✅ terminerRecharge() - Session terminée: ID ${session.id}`);
        console.log(`📊 Status: ${session.status}`);
        if (session.consommation) {
          console.log(`⚡ Consommation: ${session.consommation} kWh`);
        }
        if (session.montantTotal) {
          console.log(`💰 Montant: ${session.montantTotal} €`);
        }
      }),
      catchError((err) => {
        console.error(`❌ terminerRecharge(${sessionId}) - Erreur:`, err);
        console.error('📋 Status:', err.status);
        console.error('📋 Message:', err.message);
        return throwError(() => err);
      })
    );
  }

  /**
   * Annule une session
   * Utilise l'API /api/sessions/{id}/annuler
   */
  annulerSession(sessionId: number): Observable<SessionRecharge> {
    console.log(`📡 annulerSession() - Session ID: ${sessionId}`);
    const url = `${this.apiUrl}/sessions/${sessionId}/annuler`;
    console.log(`📍 URL: ${url}`);
    
    return this.http.put<SessionRecharge>(url, {}).pipe(
      timeout(5000),
      tap(session => {
        console.log(`✅ annulerSession() - Session annulée: ID ${session.id}`);
        console.log(`📊 Status: ${session.status}`);
      }),
      catchError((err) => {
        console.error(`❌ annulerSession(${sessionId}) - Erreur:`, err);
        console.error('📋 Status:', err.status);
        console.error('📋 Message:', err.message);
        return throwError(() => err);
      })
    );
  }

  /**
   * Met en pause une session
   * Utilise l'API /api/sessions/{id}/pause
   */
  pauserSession(sessionId: number): Observable<SessionRecharge> {
    console.log(`📡 pauserSession() - Session ID: ${sessionId}`);
    const url = `${this.apiUrl}/sessions/${sessionId}/pause`;
    console.log(`📍 URL: ${url}`);
    
    return this.http.put<SessionRecharge>(url, {}).pipe(
      timeout(5000),
      tap(session => {
        console.log(`✅ pauserSession() - Session en pause: ID ${session.id}`);
        console.log(`📊 Status: ${session.status}`);
      }),
      catchError((err) => {
        console.error(`❌ pauserSession(${sessionId}) - Erreur:`, err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Reprend une session
   * Utilise l'API /api/sessions/{id}/reprendre
   */
  reprendreSession(sessionId: number): Observable<SessionRecharge> {
    console.log(`📡 reprendreSession() - Session ID: ${sessionId}`);
    const url = `${this.apiUrl}/sessions/${sessionId}/reprendre`;
    console.log(`📍 URL: ${url}`);
    
    return this.http.put<SessionRecharge>(url, {}).pipe(
      timeout(5000),
      tap(session => {
        console.log(`✅ reprendreSession() - Session reprise: ID ${session.id}`);
        console.log(`📊 Status: ${session.status}`);
      }),
      catchError((err) => {
        console.error(`❌ reprendreSession(${sessionId}) - Erreur:`, err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Récupère une session par son ID
   * Utilise l'API /api/sessions/{id}
   */
  getSessionById(sessionId: number): Observable<SessionRecharge> {
    console.log(`📡 getSessionById() - Session ID: ${sessionId}`);
    const url = `${this.apiUrl}/sessions/${sessionId}`;
    console.log(`📍 URL: ${url}`);
    
    return this.http.get<SessionRecharge>(url).pipe(
      timeout(5000),
      tap(session => {
        console.log(`✅ getSessionById() - Session trouvée: ID ${session.id}`);
        console.log(`📊 Status: ${session.status}, Borne: ${session.borneId}`);
        console.log(`📊 Date début: ${session.dateDebut}`);
        console.log(`📊 Conducteur: ${session.conducteurId}`);
      }),
      catchError((err) => {
        console.error(`❌ getSessionById(${sessionId}) - Erreur:`, err);
        console.error('📋 Status:', err.status);
        console.error('📋 Message:', err.message);
        console.error('📋 Error:', err.error);
        return throwError(() => err);
      })
    );
  }

  /**
   * Récupère la session active d'un conducteur
   * Utilise l'API /api/sessions/conducteur/{id}/active
   */
  getSessionActive(conducteurId: string): Observable<SessionRecharge | null> {
    console.log(`📡 getSessionActive() - Conducteur: ${conducteurId}`);
    const url = `${this.apiUrl}/sessions/conducteur/${conducteurId}/active`;
    console.log(`📍 URL: ${url}`);
    
    return this.http.get<SessionRecharge | null>(url).pipe(
      timeout(5000),
      tap(session => {
        if (session) {
          console.log(`✅ getSessionActive() - Session active trouvée: ID ${session.id}`);
          console.log(`📊 Status: ${session.status}, Borne: ${session.borneId}`);
        } else {
          console.log('✅ getSessionActive() - Aucune session active');
        }
      }),
      catchError((err) => {
        console.error(`❌ getSessionActive(${conducteurId}) - Erreur:`, err);
        console.error('📋 Status:', err.status);
        console.error('📋 Message:', err.message);
        return of(null);
      })
    );
  }

  /**
   * Récupère la session active d'une borne
   * Utilise l'API /api/sessions/borne/{id}/active
   */
  getSessionActiveParBorne(borneId: number): Observable<SessionRecharge | null> {
    console.log(`📡 getSessionActiveParBorne() - Borne: ${borneId}`);
    const url = `${this.apiUrl}/sessions/borne/${borneId}/active`;
    console.log(`📍 URL: ${url}`);
    
    return this.http.get<SessionRecharge | null>(url).pipe(
      timeout(5000),
      tap(session => {
        if (session) {
          console.log(`✅ getSessionActiveParBorne() - Session active trouvée: ID ${session.id}`);
        } else {
          console.log(`✅ getSessionActiveParBorne() - Aucune session active pour borne ${borneId}`);
        }
      }),
      catchError((err) => {
        console.error(`❌ getSessionActiveParBorne(${borneId}) - Erreur:`, err);
        return of(null);
      })
    );
  }

  /**
   * Récupère l'historique des sessions d'un conducteur
   * Utilise l'API /api/sessions/conducteur/{id}/historique
   */
  getHistoriqueSessions(conducteurId: string): Observable<SessionRecharge[]> {
    console.log(`📡 getHistoriqueSessions() - Conducteur: ${conducteurId}`);
    const url = `${this.apiUrl}/sessions/conducteur/${conducteurId}/historique`;
    console.log(`📍 URL: ${url}`);
    
    return this.http.get<SessionRecharge[]>(url).pipe(
      timeout(10000),
      tap(sessions => {
        console.log(`✅ getHistoriqueSessions() - ${sessions.length} sessions trouvées`);
        const actives = sessions.filter(s => s.status === 'ACTIVE').length;
        const terminees = sessions.filter(s => s.status === 'TERMINEE').length;
        const annulees = sessions.filter(s => s.status === 'ANNULEE').length;
        console.log(`📊 Répartition: Active: ${actives}, Terminées: ${terminees}, Annulées: ${annulees}`);
      }),
      catchError((err) => {
        console.error(`❌ getHistoriqueSessions(${conducteurId}) - Erreur:`, err);
        return of([]);
      })
    );
  }

  // ========== GESTION DES TRAJETS ==========

  /**
   * Récupère les trajets d'un conducteur
   */
  getTrajetsByConducteur(conducteurId: number): Observable<Trajet[]> {
    console.log(`📡 getTrajetsByConducteur() - Conducteur: ${conducteurId}`);
    const url = `${this.apiUrl}/sessions/conducteur/${conducteurId}/historique`;
    console.log(`📍 URL: ${url}`);
    
    return this.http.get<any[]>(url).pipe(
      timeout(10000),
      map(sessions => {
        console.log(`📊 ${sessions.length} sessions récupérées`);
        
        return sessions.map(session => {
          let status: 'TERMINE' | 'ANNULE' | 'EN_COURS' = 'TERMINE';
          if (session.status === 'ACTIVE') {
            status = 'EN_COURS';
          } else if (session.status === 'ANNULEE') {
            status = 'ANNULE';
          }
          
          return {
            id: session.id,
            conducteurId: Number(session.conducteurId),
            borneId: Number(session.borneId),
            borneNom: session.borneNom || `Borne #${session.borneId}`,
            dateDebut: session.dateDebut || new Date(),
            dateFin: session.dateFin || undefined,
            dureeMinutes: session.duree || 0,
            consommationKwh: session.consommation || 0,
            coutTotal: session.montantTotal || 0,
            distanceKm: session.distanceKm || (session.duree ? Math.round(session.duree * 0.8 * 10) / 10 : 0),
            status: status,
            villeDepart: session.villeDepart || '',
            villeArrivee: session.villeArrivee || '',
            vehicule: session.vehicule || 'Non renseigné'
          } as Trajet;
        });
      }),
      catchError((err) => {
        console.error('❌ Erreur getTrajetsByConducteur:', err);
        return of([]);
      })
    );
  }

  /**
   * Récupère les statistiques des trajets
   */
  getTrajetsStats(conducteurId: number): Observable<any> {
    console.log(`📡 getTrajetsStats() - Conducteur: ${conducteurId}`);
    
    return this.getTrajetsByConducteur(conducteurId).pipe(
      map(trajets => {
        const total = trajets.length;
        const termines = trajets.filter(t => t.status === 'TERMINE').length;
        const enCours = trajets.filter(t => t.status === 'EN_COURS').length;
        const annules = trajets.filter(t => t.status === 'ANNULE').length;
        const distanceTotale = trajets.reduce((sum, t) => sum + (t.distanceKm || 0), 0);
        const coutTotal = trajets.reduce((sum, t) => sum + (t.coutTotal || 0), 0);
        const dureeTotale = trajets.reduce((sum, t) => sum + (t.dureeMinutes || 0), 0);
        const consommationTotale = trajets.reduce((sum, t) => sum + (t.consommationKwh || 0), 0);
        
        return {
          total,
          termines,
          enCours,
          annules,
          distanceTotale: Math.round(distanceTotale * 10) / 10,
          coutTotal: Math.round(coutTotal * 100) / 100,
          dureeTotale,
          consommationTotale: Math.round(consommationTotale * 10) / 10
        };
      })
    );
  }

  /**
   * Récupère un trajet par son ID
   */
  getTrajetById(sessionId: number): Observable<Trajet | null> {
    console.log(`📡 getTrajetById() - Session ID: ${sessionId}`);
    
    return this.getSessionById(sessionId).pipe(
      map(session => {
        if (!session) return null;
        
        let status: 'TERMINE' | 'ANNULE' | 'EN_COURS' = 'TERMINE';
        if (session.status === 'ACTIVE') {
          status = 'EN_COURS';
        } else if (session.status === 'ANNULEE') {
          status = 'ANNULE';
        }
        
        return {
          id: session.id,
          conducteurId: Number(session.conducteurId),
          borneId: Number(session.borneId),
          borneNom: session.borneNom || `Borne #${session.borneId}`,
          dateDebut: session.dateDebut || new Date(),
          dateFin: session.dateFin || undefined,
          dureeMinutes: session.duree || 0,
          consommationKwh: session.consommation || 0,
          coutTotal: session.montantTotal || 0,
          distanceKm: session.distanceKm || (session.duree ? Math.round(session.duree * 0.8 * 10) / 10 : 0),
          status: status,
          villeDepart: session.villeDepart || '',
          villeArrivee: session.villeArrivee || '',
          vehicule: session.vehicule || 'Non renseigné'
        } as Trajet;
      }),
      catchError((err) => {
        console.error(`❌ getTrajetById(${sessionId}) - Erreur:`, err);
        return of(null);
      })
    );
  }

  /**
   * Récupère les trajets par statut
   */
  getTrajetsByStatus(conducteurId: number, status: string): Observable<Trajet[]> {
    console.log(`📡 getTrajetsByStatus() - Conducteur: ${conducteurId}, Status: ${status}`);
    return this.getTrajetsByConducteur(conducteurId).pipe(
      map(trajets => trajets.filter(t => t.status === status))
    );
  }

  /**
   * Récupère les trajets par date
   */
  getTrajetsByDate(conducteurId: number, date: string): Observable<Trajet[]> {
    console.log(`📡 getTrajetsByDate() - Conducteur: ${conducteurId}, Date: ${date}`);
    const dateFilter = new Date(date);
    
    return this.getTrajetsByConducteur(conducteurId).pipe(
      map(trajets => trajets.filter(t => {
        const trajetDate = new Date(t.dateDebut);
        return trajetDate.toDateString() === dateFilter.toDateString();
      }))
    );
  }
}
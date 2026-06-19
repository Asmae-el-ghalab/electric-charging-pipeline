// src/app/pages/stations/stationsComponent.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { StationsService, Borne, SessionRecharge } from '../../../services/stations.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { Subject, interval, takeUntil, switchMap, catchError, of, timeout, finalize, debounceTime, distinctUntilChanged } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbarComponent';

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './stationsComponent.html',
  styleUrl: './stationsComponent.css'
})
export class StationsComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // Données
  bornes: Borne[] = [];
  filteredBornes: Borne[] = [];
  sessionActive: SessionRecharge | null = null;
  userId: string | null = null;
  
  // États
  loading = false;
  loadingAction = false;
  isRefreshing = false;
  sessionVerifiee = false;
  showFilters = false;
  selectedBorneId: number | null = null;
  lastUpdate: Date | null = null;
  
  // Filtres
  filterStatus = '';
  filterCity = '';
  filterOperator = '';
  
  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;
  
  // Données filtres
  villes: string[] = [];
  operateurs: string[] = [];
  statusList = ['Operational', 'Maintenance', 'OutOfService', 'Planned'];
  
  // Observables
  private destroy$ = new Subject<void>();
  private refreshInterval = 30000; // 30 secondes
  
  constructor(
    private stationsService: StationsService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    console.log('🏗️ StationsComponent construit');
  }
  
  ngOnInit(): void {
    console.log('🚀 StationsComponent initialisé');
    this.userId = this.authService.getUserId();
    console.log('👤 ID utilisateur récupéré:', this.userId);
    
    // Chargement initial des données
    this.loadBornes();
    
    // Configuration du rafraîchissement automatique
    this.setupAutoRefresh();
  }
  
  ngAfterViewInit(): void {
    console.log('👁️ AfterViewInit - Vérification de la session active');
    setTimeout(() => {
      this.verifierSessionActive();
    }, 500);
  }
  
  ngOnDestroy(): void {
    console.log('🧹 StationsComponent détruit');
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // ============================================================
  // RÉCUPÉRATION DES DONNÉES
  // ============================================================
  
  /**
   * Charge les bornes depuis l'API
   */
  loadBornes(): void {
    this.loading = true;
    console.log('📡 Chargement des bornes - Page:', this.currentPage, 'Taille:', this.pageSize);
    
    this.stationsService.getAllBornes(this.currentPage, this.pageSize)
      .pipe(
        timeout(10000),
        catchError((err) => {
          console.error('❌ Erreur chargement des bornes:', err);
          this.notificationService.error('Erreur lors du chargement des bornes');
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
          this.lastUpdate = new Date();
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (!response) {
            console.warn('⚠️ Réponse vide');
            this.bornes = [];
            this.filteredBornes = [];
            return;
          }
          
          console.log('✅ Réponse reçue:', response);
          console.log('📊 Nombre de bornes:', response.content?.length || 0);
          
          // Traitement des données
          this.bornes = (response.content || []).map((borne: Borne) => ({
            ...borne,
            isOccupied: borne.isOccupied === true,
            sessionId: borne.sessionId || undefined
          }));
          
          this.filteredBornes = [...this.bornes];
          this.totalPages = response.totalPages || 0;
          this.totalElements = response.totalElements || 0;
          
          // Extraction des filtres
          this.extractFilters();
          
          // Application des filtres si actifs
          if (this.filterStatus || this.filterCity || this.filterOperator) {
            this.applyFilters();
          }
          
          // Mise à jour de la session active
          this.updateSessionState();
          
          console.log('✅ Bornes chargées avec succès');
        }
      });
  }
  
  /**
   * Rafraîchit les données manuellement
   */
   isScrolled = false;  // ✅ Ajouter cette propriété
  menuOpen = false;    // ✅ Ajouter pour le menu mobile
  
  // ... reste du code ...
  
  // ✅ Ajouter la méthode pour le menu mobile
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  
  // ✅ Ajouter la méthode pour gérer le scroll
 
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
  refreshData(): void {
    if (this.isRefreshing || this.loading) return;
    
    console.log('🔄 Rafraîchissement manuel des données');
    this.isRefreshing = true;
    
    this.stationsService.getAllBornes(this.currentPage, this.pageSize)
      .pipe(
        timeout(10000),
        catchError((err) => {
          console.error('❌ Erreur rafraîchissement:', err);
          this.notificationService.error('Erreur lors du rafraîchissement');
          return of(null);
        }),
        finalize(() => {
          this.isRefreshing = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.updateBornesState(response);
            this.lastUpdate = new Date();
            this.notificationService.success('Données mises à jour');
          }
        }
      });
  }
  
  /**
   * Configuration du rafraîchissement automatique
   */
  private setupAutoRefresh(): void {
    interval(this.refreshInterval)
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100),
        distinctUntilChanged(),
        switchMap(() => {
          if (this.loading || this.loadingAction) {
            return of(null);
          }
          this.isRefreshing = true;
          return this.stationsService.getAllBornes(this.currentPage, this.pageSize).pipe(
            timeout(5000),
            catchError((err) => {
              console.error('❌ Erreur rafraîchissement auto:', err);
              return of(null);
            }),
            finalize(() => {
              this.isRefreshing = false;
            })
          );
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.updateBornesState(response);
            this.lastUpdate = new Date();
          }
        },
        error: (err) => {
          console.error('❌ Erreur dans le flux de rafraîchissement:', err);
        }
      });
  }
  
  /**
   * Met à jour l'état des bornes
   */
  private updateBornesState(response: any): void {
    if (!response || !response.content || !Array.isArray(response.content)) {
      console.warn('⚠️ Réponse invalide pour la mise à jour des bornes');
      return;
    }

    const borneMap = new Map<number, Borne>();
    response.content.forEach((borne: Borne) => {
      if (borne && borne.id) {
        borneMap.set(borne.id, borne);
      }
    });
    
    let hasChanges = false;
    
    this.bornes.forEach(borne => {
      if (!borne || !borne.id) return;
      
      const borneMaj = borneMap.get(borne.id);
      if (borneMaj) {
        const newOccupied = 'isOccupied' in borneMaj ? borneMaj.isOccupied === true : false;
        const newSessionId = 'sessionId' in borneMaj ? borneMaj.sessionId || undefined : undefined;
        const newStatus = 'status' in borneMaj ? borneMaj.status : borne.status;
        
        if (borne.isOccupied !== newOccupied || 
            borne.sessionId !== newSessionId || 
            borne.status !== newStatus) {
          console.log(`🔄 Changement détecté pour borne ${borne.id}:`, {
            occupé: newOccupied,
            session: newSessionId,
            statut: newStatus
          });
          borne.isOccupied = newOccupied;
          borne.sessionId = newSessionId;
          borne.status = newStatus;
          hasChanges = true;
        }
      }
    });
    
    if (hasChanges) {
      console.log('✅ Changements appliqués, mise à jour des filtres');
      this.applyFilters();
      this.updateSessionState();
      this.cdr.detectChanges();
    }
  }
  
  // ============================================================
  // GESTION DE LA SESSION
  // ============================================================
  
  /**
   * Vérifie si une session active existe
   */
  verifierSessionActive(): void {
    console.log('🔍 Vérification session active...');
    
    if (!this.userId) {
      console.log('⚠️ Aucun utilisateur connecté (userId est null)');
      this.sessionVerifiee = true;
      this.cdr.detectChanges();
      return;
    }
    
    console.log('👤 ID utilisateur pour la session:', this.userId);
    
    this.stationsService.getSessionActive(this.userId)
      .pipe(
        timeout(5000),
        catchError((err) => {
          console.error('❌ Erreur vérification session:', err);
          return of(null);
        })
      )
      .subscribe({
        next: (session: any) => {
          console.log('📱 Session active reçue:', session);
          
          let sessionData = session;
          if (Array.isArray(session)) {
            console.log('⚠️ Session reçue sous forme de tableau');
            sessionData = session.length > 0 ? session[0] : null;
          }
          
          this.handleSessionResponse(sessionData);
          this.sessionVerifiee = true;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Erreur vérification session:', err);
          this.sessionActive = null;
          this.sessionVerifiee = true;
          this.cdr.detectChanges();
        }
      });
  }
  
  /**
   * Traite la réponse de la session
   */
  private handleSessionResponse(sessionData: any): void {
    if (sessionData) {
      this.sessionActive = sessionData;
      
      // Mise à jour de la borne correspondante
      const borne = this.bornes.find(b => b.id === sessionData.borneId);
      if (borne) {
        console.log('📍 Borne trouvée pour la session:', borne.id, borne.title);
        borne.isOccupied = true;
        borne.sessionId = sessionData.id;
        this.applyFilters();
      } else {
        console.log('⚠️ Borne non trouvée pour la session');
        // Rechargement si la borne n'est pas dans la liste
        if (this.bornes.length === 0) {
          this.loadBornes();
        }
      }
      
      this.notificationService.info('Vous avez une recharge en cours');
    } else {
      console.log('✅ Aucune session active');
      this.sessionActive = null;
    }
  }
  
  /**
   * Met à jour l'état des sessions
   */
  private updateSessionState(): void {
    if (this.sessionActive) {
      const borne = this.bornes.find(b => b.id === this.sessionActive?.borneId);
      if (borne) {
        borne.isOccupied = true;
        borne.sessionId = this.sessionActive.id;
        this.applyFilters();
      }
    }
  }
  
  // ============================================================
  // FILTRES
  // ============================================================
  
  /**
   * Extrait les valeurs uniques pour les filtres
   */
  extractFilters(): void {
    console.log('🔍 Extraction des filtres...');
    const villesSet = new Set<string>();
    const operateursSet = new Set<string>();
    
    this.bornes.forEach(borne => {
      if (borne.city && borne.city.trim() && borne.city !== 'NULL' && borne.city !== 'null') {
        villesSet.add(borne.city);
      }
      if (borne.operator && borne.operator.trim() && 
          borne.operator !== '(Unknown Operator)' && 
          borne.operator !== 'NULL' && 
          borne.operator !== 'null') {
        operateursSet.add(borne.operator);
      }
    });
    
    this.villes = Array.from(villesSet).sort();
    this.operateurs = Array.from(operateursSet).sort();
    
    console.log(`🏙️ ${this.villes.length} villes, ${this.operateurs.length} opérateurs`);
  }
  
  /**
   * Applique les filtres
   */
  applyFilters(): void {
    let resultats = [...this.bornes];
    
    if (this.filterStatus) {
      resultats = resultats.filter(borne => 
        borne.status && borne.status.toLowerCase() === this.filterStatus.toLowerCase()
      );
    }
    
    if (this.filterCity) {
      resultats = resultats.filter(borne => 
        borne.city && borne.city.toLowerCase() === this.filterCity.toLowerCase()
      );
    }
    
    if (this.filterOperator) {
      resultats = resultats.filter(borne => 
        borne.operator && borne.operator.toLowerCase() === this.filterOperator.toLowerCase()
      );
    }
    
    this.filteredBornes = resultats;
    console.log(`📊 ${resultats.length} bornes affichées après filtrage`);
    this.cdr.detectChanges();
  }
  
  /**
   * Réinitialise les filtres
   */
  resetFilters(): void {
    console.log('🔄 Réinitialisation des filtres');
    this.filterStatus = '';
    this.filterCity = '';
    this.filterOperator = '';
    this.filteredBornes = [...this.bornes];
    this.cdr.detectChanges();
    this.notificationService.info('Filtres réinitialisés');
  }
  
  /**
   * Bascule l'affichage des filtres
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  /**
   * Gère le changement de filtre
   */
  onFilterChange(): void {
    this.applyFilters();
  }
  
  // ============================================================
  // PAGINATION
  // ============================================================
  
  /**
   * Page précédente
   */
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadBornes();
    }
  }
  
  /**
   * Page suivante
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadBornes();
    }
  }
  
  /**
   * Va à une page spécifique
   */
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadBornes();
    }
  }
  
  /**
   * Génère les numéros de page
   */
  getPages(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const current = this.currentPage;
    
    if (total <= 7) {
      for (let i = 0; i < total; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(0, current - 2);
      let end = Math.min(total, start + 5);
      
      if (end - start < 5) {
        start = Math.max(0, end - 5);
      }
      
      if (start > 0) {
        pages.push(0);
        if (start > 1) pages.push(-1);
      }
      
      for (let i = start; i < end; i++) {
        pages.push(i);
      }
      
      if (end < total) {
        if (end < total - 1) pages.push(-1);
        pages.push(total - 1);
      }
    }
    
    return pages;
  }
  
  // ============================================================
  // MÉTHODES UTILITAIRES
  // ============================================================
  
  /**
   * Obtient la classe CSS pour le statut
   */
  getStatusClass(status: string | undefined): string {
    if (!status) return 'status-planned';
    switch(status.toLowerCase()) {
      case 'operational': return 'status-operational';
      case 'maintenance': return 'status-maintenance';
      case 'outofservice':
      case 'out_of_service': return 'status-outofservice';
      default: return 'status-planned';
    }
  }
  
  /**
   * Obtient le texte du statut
   */
  getStatusText(status: string | undefined): string {
    if (!status) return 'Statut inconnu';
    switch(status.toLowerCase()) {
      case 'operational': return 'Opérationnelle';
      case 'maintenance': return 'En maintenance';
      case 'outofservice':
      case 'out_of_service': return 'Hors service';
      case 'planned': return 'Planifiée';
      default: return status;
    }
  }
  
  /**
   * Obtient le nom de l'opérateur
   */
  getOperatorName(operator: string | undefined | null): string {
    if (!operator || operator === '(Unknown Operator)' || operator === 'NULL' || operator === 'null') {
      return 'Opérateur inconnu';
    }
    return operator;
  }
  
  /**
   * Vérifie si une borne est disponible
   */
  estDisponible(borne: Borne): boolean {
    return borne.status === 'Operational' && 
           borne.isOccupied !== true && 
           !borne.sessionId;
  }
  
  /**
   * Vérifie si l'utilisateur a une session active sur la borne
   */
  estSessionUtilisateur(borne: Borne): boolean {
    return this.sessionActive !== null && 
           this.sessionActive.borneId === borne.id &&
           borne.isOccupied === true &&
           borne.sessionId === this.sessionActive.id;
  }
  
  /**
   * Calcule la durée de la session
   */
  getSessionDuration(debut: string): string {
    if (!debut) return '--:--';
    
    try {
      const start = new Date(debut);
      const now = new Date();
      const diffMs = now.getTime() - start.getTime();
      
      if (diffMs < 0) return '--:--';
      
      const diffMins = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMins / 60);
      const minutes = diffMins % 60;
      
      if (hours === 0) {
        return `${minutes}m`;
      }
      
      return `${hours}h${minutes.toString().padStart(2, '0')}`;
    } catch (e) {
      return '--:--';
    }
  }
  
  // ============================================================
  // ACTIONS UTILISATEUR
  // ============================================================
  
  /**
   * Démarre une recharge
   */
  demarrerRecharge(borne: Borne): void {
    console.log(`🚀 Tentative de démarrage recharge - Borne ${borne.id}`);
    
    if (!this.estDisponible(borne)) {
      this.notificationService.warning('Cette borne n\'est pas disponible');
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.notificationService.warning('Veuillez vous connecter');
      this.router.navigate(['/connexion']);
      return;
    }

    let userId = this.userId;
    if (!userId) {
      userId = this.authService.getUserId();
      if (userId) {
        this.userId = userId;
      }
    }

    if (!userId) {
      console.error('❌ ID utilisateur non trouvé');
      this.notificationService.error('Identifiant conducteur non trouvé. Veuillez vous reconnecter.');
      this.router.navigate(['/connexion']);
      return;
    }

    if (this.sessionActive) {
      this.notificationService.warning(
        'Vous avez déjà une recharge en cours. Terminez-la avant d\'en démarrer une nouvelle.'
      );
      return;
    }

    this.selectedBorneId = borne.id;
    this.loadingAction = true;

    this.stationsService.verifierDisponibilite(borne.id)
      .pipe(
        timeout(5000),
        catchError((err) => {
          console.error('❌ Erreur vérification disponibilité:', err);
          return of({ disponible: false, message: 'Erreur de connexion au serveur' });
        })
      )
      .subscribe({
        next: (response) => {
          if (response.disponible) {
            this.confirmerDemarrage(borne, userId!);
          } else {
            this.loadingAction = false;
            this.selectedBorneId = null;
            this.notificationService.error(
              response.message || 'Cette borne est déjà utilisée',
              'Borne occupée'
            );
            this.loadBornes();
          }
        },
        error: (err) => {
          this.loadingAction = false;
          this.selectedBorneId = null;
          this.notificationService.error('Erreur lors de la vérification de la borne');
        }
      });
  }
  
  /**
   * Confirme et démarre la recharge
   */
  private confirmerDemarrage(borne: Borne, conducteurId: string): void {
    this.loadingAction = true;
    
    console.log(`📤 Envoi demande démarrage recharge - Borne ${borne.id}, Conducteur ${conducteurId}`);
    
    this.stationsService.demarrerRecharge(borne.id, conducteurId)
      .pipe(
        timeout(10000),
        catchError((err) => {
          console.error('❌ Erreur démarrage recharge:', err);
          let message = 'Erreur lors du démarrage de la recharge';
          
          if (err.status === 409) {
            message = 'Cette borne est déjà utilisée par un autre conducteur';
          } else if (err.status === 400) {
            message = err.error?.message || 'Données invalides';
          } else if (err.status === 401) {
            message = 'Session expirée, veuillez vous reconnecter';
            this.router.navigate(['/connexion']);
          } else if (err.status === 403) {
            message = 'Vous n\'avez pas les droits pour effectuer cette action';
          } else if (err.status === 500) {
            message = 'Erreur serveur, veuillez réessayer plus tard';
          }
          
          this.notificationService.error(message);
          return of(null);
        }),
        finalize(() => {
          this.loadingAction = false;
          this.selectedBorneId = null;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (session) => {
          if (!session) {
            console.error('❌ Session null reçue');
            return;
          }
          
          console.log('✅ Session démarrée avec succès:', session);
          
          borne.isOccupied = true;
          borne.sessionId = session.id;
          this.sessionActive = session;
          this.applyFilters();
          
          this.notificationService.success('Recharge démarrée avec succès !');
          
          this.router.navigate(['/sessions', session.id]).then(success => {
            if (!success) {
              window.location.href = `/sessions/${session.id}`;
            }
          }).catch(() => {
            window.location.href = `/sessions/${session.id}`;
          });
          
          this.cdr.detectChanges();
        }
      });
  }
  
  /**
   * Arrête une recharge
   */
  arreterRecharge(borne: Borne): void {
    console.log(`🛑 Tentative arrêt recharge - Borne ${borne.id}`);
    
    if (!this.estSessionUtilisateur(borne)) {
      this.notificationService.warning('Vous ne pouvez pas arrêter cette recharge');
      return;
    }

    if (!borne.sessionId) {
      this.notificationService.warning('Aucune session active sur cette borne');
      return;
    }

    if (!confirm('Voulez-vous vraiment arrêter cette recharge ?')) {
      return;
    }

    this.loadingAction = true;
    this.selectedBorneId = borne.id;

    this.stationsService.terminerRecharge(borne.sessionId)
      .pipe(
        timeout(10000),
        catchError((err) => {
          console.error('❌ Erreur arrêt recharge:', err);
          this.notificationService.error('Erreur lors de l\'arrêt de la recharge');
          return of(null);
        }),
        finalize(() => {
          this.loadingAction = false;
          this.selectedBorneId = null;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (session) => {
          if (!session) return;
          
          console.log('✅ Session terminée avec succès:', session);
          
          borne.isOccupied = false;
          borne.sessionId = undefined;
          this.sessionActive = null;
          this.applyFilters();
          
          this.notificationService.success('Recharge terminée avec succès !');
          this.router.navigate(['/stations']);
          this.cdr.detectChanges();
        }
      });
  }
  
  /**
   * Voir les détails d'une session
   */
  voirSession(sessionId: number): void {
    console.log(`👁️ Voir session ${sessionId}`);
    this.router.navigate(['/sessions', sessionId]).catch(() => {
      window.location.href = `/sessions/${sessionId}`;
    });
  }
  
  /**
   * Voir les détails d'une borne
   */
  goToBorneDetail(id: number): void {
    console.log(`👁️ Voir détails borne ${id}`);
    this.router.navigate(['/borne', id]);
  }
  
  /**
   * Ouvre Google Maps
   */
  openMaps(latitude: number, longitude: number): void {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
    } else {
      this.notificationService.warning('Coordonnées non disponibles pour cette borne');
    }
  }
  
  // ============================================================
  // MÉTHODE DE TEST
  // ============================================================
  
  /**
   * Test de navigation (pour débogage)
   */
  testNavigation(): void {
    console.log('🧪 Test de navigation vers session 999');
    this.router.navigate(['/sessions', 999]);
  }
}
// src/app/pages/stations/stationsComponent.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { StationsService, Borne, SessionRecharge, Connection } from '../../../services/stations.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
import { Subject, interval, takeUntil, switchMap, catchError, of, timeout, finalize, debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbarComponent';

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,NavbarComponent],
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
  
  // Navbar
  isScrolled = false;
  menuOpen = false;
  
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
    this.checkUserAuthentication();
    this.loadBornes();
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
  // NAVBAR
  // ============================================================
  
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }
  
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  // ============================================================
  // AUTHENTIFICATION
  // ============================================================
  
  private checkUserAuthentication(): void {
    this.userId = this.authService.getUserId();
    console.log('👤 ID utilisateur récupéré:', this.userId);
    
    if (!this.userId) {
      console.log('⚠️ Utilisateur non connecté, redirection vers la page de connexion');
      this.notificationService.warning('Veuillez vous connecter pour accéder aux bornes');
      this.router.navigate(['/connexion']);
      return;
    }
    
    if (this.userId) {
      console.log('✅ Utilisateur connecté, vérification de la session active');
      this.verifierSessionActive();
    }
  }

  // ============================================================
  // RÉCUPÉRATION DES DONNÉES
  // ============================================================
  
  loadBornes(): void {
    if (!this.userId) {
      console.warn('⚠️ Utilisateur non connecté, chargement des bornes annulé');
      this.router.navigate(['/connexion']);
      return;
    }
    
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
          this.bornes = (response.content || []).map((station: any) => ({
            ...station,
            isOccupied: station.isOccupied === true,
            sessionId: station.sessionId !== undefined && station.sessionId !== null ? station.sessionId : null,
            connections: station.connections || []
          }));
          
          // Charger les connections pour chaque borne
          this.loadConnectionsForBornes();
          
          this.filteredBornes = [...this.bornes];
          this.totalPages = response.totalPages || 0;
          this.totalElements = response.totalElements || 0;
          
          this.extractFilters();
          
          if (this.filterStatus || this.filterCity || this.filterOperator) {
            this.applyFilters();
          }
          
          this.updateSessionState();
          
          console.log('✅ Bornes chargées avec succès');
        }
      });
  }
  
  /**
   * Charge les connections pour chaque borne
   */
  loadConnectionsForBornes(): void {
    if (!this.bornes || this.bornes.length === 0) {
      return;
    }
    
    console.log('🔄 Chargement des connections pour', this.bornes.length, 'bornes');
    
    const observables = this.bornes.map(borne => 
      this.stationsService.getStationConnections(borne.id).pipe(
        catchError(err => {
          console.error(`❌ Erreur chargement connections pour borne ${borne.id}:`, err);
          return of([]);
        })
      )
    );
    
    forkJoin(observables).subscribe({
      next: (allConnections) => {
        allConnections.forEach((connections, index) => {
          if (this.bornes[index]) {
            this.bornes[index].connections = connections;
            console.log(`✅ Connections chargées pour borne ${this.bornes[index].id}: ${connections.length}`);
          }
        });
        this.applyFilters();
        this.cdr.detectChanges();
        console.log('✅ Toutes les connections chargées');
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des connections:', err);
      }
    });
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
  
  private updateBornesState(response: any): void {
    if (!response || !response.content || !Array.isArray(response.content)) {
      console.warn('⚠️ Réponse invalide pour la mise à jour des bornes');
      return;
    }

    const borneMap = new Map<number, Borne>();
    response.content.forEach((station: any) => {
      if (station && station.id) {
        const sessionId = station.sessionId !== undefined && station.sessionId !== null ? station.sessionId : null;
        borneMap.set(station.id, {
          ...station,
          sessionId: sessionId,
          connections: station.connections || []
        });
      }
    });
    
    let hasChanges = false;
    
    this.bornes.forEach(borne => {
      if (!borne || !borne.id) return;
      
      const borneMaj = borneMap.get(borne.id);
      if (borneMaj) {
        const newOccupied = 'isOccupied' in borneMaj ? borneMaj.isOccupied === true : false;
        const newSessionId = 'sessionId' in borneMaj ? (borneMaj.sessionId !== undefined ? borneMaj.sessionId : null) : null;
        const newStatus = 'status' in borneMaj ? borneMaj.status : borne.status;
        const newConnections = 'connections' in borneMaj ? borneMaj.connections || [] : borne.connections || [];
        
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
          borne.connections = newConnections;
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
  
  private handleSessionResponse(sessionData: any): void {
    if (sessionData) {
      this.sessionActive = sessionData;
      
      const borne = this.bornes.find(b => b.id === sessionData.borneId);
      if (borne) {
        console.log('📍 Borne trouvée pour la session:', borne.id, borne.title);
        borne.isOccupied = true;
        borne.sessionId = sessionData.id || null;
        this.applyFilters();
      } else {
        console.log('⚠️ Borne non trouvée pour la session');
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
  
  private updateSessionState(): void {
    if (this.sessionActive) {
      const borne = this.bornes.find(b => b.id === this.sessionActive?.borneId);
      if (borne) {
        borne.isOccupied = true;
        borne.sessionId = this.sessionActive.id || null;
        this.applyFilters();
      }
    }
  }
  
  // ============================================================
  // FILTRES
  // ============================================================
  
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
  
  resetFilters(): void {
    console.log('🔄 Réinitialisation des filtres');
    this.filterStatus = '';
    this.filterCity = '';
    this.filterOperator = '';
    this.filteredBornes = [...this.bornes];
    this.cdr.detectChanges();
    this.notificationService.info('Filtres réinitialisés');
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  
  onFilterChange(): void {
    this.applyFilters();
  }
  
  // ============================================================
  // PAGINATION
  // ============================================================
  
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadBornes();
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadBornes();
    }
  }
  
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadBornes();
    }
  }
  
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
  // MÉTHODES UTILITAIRES POUR LES CONNECTIONS
  // ============================================================
  
  /**
   * Récupère les types de connecteurs
   */
  getConnectionTypes(borne: Borne): string {
    if (!borne.connections || borne.connections.length === 0) {
      return 'Non disponible';
    }
    
    const types = borne.connections.map(conn => conn.connectionType);
    const uniqueTypes = [...new Set(types)];
    return uniqueTypes.join(', ');
  }
  
  /**
   * Récupère la puissance maximale
   */
  getMaxPower(borne: Borne): string {
    if (!borne.connections || borne.connections.length === 0) {
      return borne.power ? `${borne.power} kW` : 'N/A';
    }
    
    const maxPower = Math.max(...borne.connections.map(conn => conn.powerKw || 0));
    return `${maxPower} kW`;
  }
  
  /**
   * Récupère les détails complets des connecteurs
   */
  getConnectionDetails(borne: Borne): string {
    if (!borne.connections || borne.connections.length === 0) {
      return 'Aucun connecteur disponible';
    }
    
    return borne.connections.map(conn => {
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
   * Récupère le nombre total de connecteurs
   */
  getTotalConnectors(borne: Borne): number {
    if (!borne.connections || borne.connections.length === 0) {
      return 0;
    }
    return borne.connections.reduce((sum, conn) => sum + (conn.quantity || 0), 0);
  }
  
  /**
   * Vérifie si la borne a un type de connecteur spécifique
   */
  hasConnectionType(borne: Borne, type: string): boolean {
    if (!borne.connections) return false;
    return borne.connections.some(conn => 
      conn.connectionType.toLowerCase().includes(type.toLowerCase())
    );
  }
  
  /**
   * Récupère les connecteurs DC
   */
  getDCConnections(borne: Borne): Connection[] {
    if (!borne.connections) return [];
    return borne.connections.filter(conn => conn.currentType === 'DC');
  }
  
  /**
   * Récupère les connecteurs AC
   */
  getACConnections(borne: Borne): Connection[] {
    if (!borne.connections) return [];
    return borne.connections.filter(conn => conn.currentType === 'AC (Three-Phase)');
  }
  
  /**
   * Formate les connections pour l'affichage
   */
  formatConnections(borne: Borne): string {
    if (!borne.connections || borne.connections.length === 0) {
      return 'Aucun connecteur';
    }
    
    return borne.connections.map(conn => {
      const parts = [
        conn.connectionType,
        `${conn.powerKw}kW`,
        conn.quantity > 1 ? `x${conn.quantity}` : ''
      ].filter(Boolean);
      return parts.join(' ');
    }).join(' | ');
  }

  /**
   * Récupère les types de connecteurs pour l'affichage en badge
   */
  getConnectionBadges(borne: Borne): string[] {
    if (!borne.connections || borne.connections.length === 0) {
      return ['Aucun'];
    }
    
    return borne.connections.map(conn => {
      let label = conn.connectionType;
      if (conn.powerKw) {
        label += ` ${conn.powerKw}kW`;
      }
      return label;
    });
  }

  /**
   * Récupère la puissance totale disponible
   */
  getTotalPower(borne: Borne): string {
    if (!borne.connections || borne.connections.length === 0) {
      return '0 kW';
    }
    
    const total = borne.connections.reduce((sum, conn) => sum + (conn.powerKw || 0), 0);
    return `${total} kW`;
  }

  /**
   * Vérifie si la borne a des connecteurs DC
   */
  hasDCConnector(borne: Borne): boolean {
    return borne.connections?.some(conn => conn.currentType === 'DC') || false;
  }

  /**
   * Vérifie si la borne a des connecteurs AC
   */
  hasACConnector(borne: Borne): boolean {
    return borne.connections?.some(conn => conn.currentType === 'AC (Three-Phase)') || false;
  }
  
  // ============================================================
  // MÉTHODES UTILITAIRES
  // ============================================================
  
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
  
  getOperatorName(operator: string | undefined | null): string {
    if (!operator || operator === '(Unknown Operator)' || operator === 'NULL' || operator === 'null') {
      return 'Opérateur inconnu';
    }
    return operator;
  }
  
  estDisponible(borne: Borne): boolean {
    return borne.status === 'Operational' && 
           borne.isOccupied !== true && 
           !borne.sessionId;
  }
  
  estSessionUtilisateur(borne: Borne): boolean {
    return this.sessionActive !== null && 
           this.sessionActive.borneId === borne.id &&
           borne.isOccupied === true &&
           borne.sessionId === this.sessionActive.id;
  }
  
  getSessionDuration(debut: string | null | undefined): string {
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
          borne.sessionId = session.id || null;
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
          borne.sessionId = null;
          this.sessionActive = null;
          this.applyFilters();
          
          this.notificationService.success('Recharge terminée avec succès !');
          this.router.navigate(['/stations']);
          this.cdr.detectChanges();
        }
      });
  }
  
  voirSession(sessionId: number): void {
    console.log(`👁️ Voir session ${sessionId}`);
    this.router.navigate(['/sessions', sessionId]).catch(() => {
      window.location.href = `/sessions/${sessionId}`;
    });
  }
  
  goToBorneDetail(id: number): void {
    console.log(`👁️ Voir détails borne ${id}`);
    this.router.navigate(['/borne-detail', id]);
  }
  
  openMaps(latitude: number, longitude: number): void {
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
    } else {
      this.notificationService.warning('Coordonnées non disponibles pour cette borne');
    }
  }
  
  testNavigation(): void {
    console.log('🧪 Test de navigation vers session 999');
    this.router.navigate(['/sessions', 999]);
  }
}
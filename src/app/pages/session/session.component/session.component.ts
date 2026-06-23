// src/app/pages/session/session.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StationsService, SessionRecharge, Borne, Connection } from '../../../../services/stations.service';
import { AuthService } from '../../../../services/auth.service';
import { NotificationService } from '../../../../services/notification.service';
import { catchError, throwError, delay, take, concatMap, of, retryWhen } from 'rxjs';
import { NavbarComponent } from '../../../components/navbar/navbarComponent';

// ✅ Définir l'enum avec toutes les valeurs possibles
export enum SessionStatus {
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINEE',
  CANCELLED = 'ANNULEE',
  PAUSED = 'PAUSED',
  PENDING = 'PENDING',
  ERROR = 'ERROR'
}

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit, OnDestroy {

  session: SessionRecharge | null = null;
  borne: Borne | null = null;
  connections: Connection[] = [];
  loading = true;
  error = false;
  sessionId: number | null = null;

  // Auth
  isLoggedIn = false;
  userName: string = '';
  userRole: string = '';
  userId: number | null = null;
  showTerminateModal = false;
  showCancelModal = false;

  // Métriques
  tempsEcoule = 0;
  progression = 0;
  energieEstimee = 0;
  coutEstime = 0;
  dureeMaximale = 120;
  puissance = 50;
  tarifKWh = 0.30;
  seuilsAtteints = new Set<number>();

  // WebSocket
  private webSocket: WebSocket | null = null;
  private refreshInterval: any;
  private menuOpen = false;
  isFullScreen = false;
  isOffline = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stationsService: StationsService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('🏗️ SessionComponent construit');
  }

  ngOnInit(): void {
    console.log('🚀 SessionComponent initialisé');
    
    this.checkAuthStatus();
    this.detecterConnexion();
    
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('📋 Paramètre ID reçu:', id);
      
      if (id && !isNaN(Number(id))) {
        this.sessionId = parseInt(id);
        this.chargerSession(this.sessionId);
      } else {
        this.notificationService.error('ID de session invalide');
        this.retour();
      }
    });
  }

  ngOnDestroy(): void {
    console.log('🧹 SessionComponent détruit');
    this.cleanupResources();
  }

  // ============================================================
  // NETTOYAGE
  // ============================================================

  private cleanupResources(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    
    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }
  }

  closeModal(): void {
    this.showTerminateModal = false;
    this.showCancelModal = false;
  }

  // ============================================================
  // AUTHENTIFICATION
  // ============================================================

  checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = this.authService.getUserName() || 'Utilisateur';
      this.userRole = this.authService.getUserRole() || '';
      const userId = this.authService.getUserId();
      this.userId = userId !== null ? Number(userId) : null;
      console.log('👤 Utilisateur connecté:', this.userName, 'Rôle:', this.userRole);
    } else {
      console.log('👤 Utilisateur non connecté');
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = '';
    this.userRole = '';
    this.userId = null;
    this.notificationService.success('Déconnexion réussie');
    this.router.navigate(['/']);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      navLinks.classList.toggle('active');
    }
  }

  // ============================================================
  // CONNEXION RÉSEAU
  // ============================================================

  private detecterConnexion(): void {
    window.addEventListener('online', () => {
      this.isOffline = false;
      this.notificationService.success('Connexion rétablie');
      if (this.session?.status === SessionStatus.ACTIVE && this.sessionId) {
        this.chargerSession(this.sessionId);
      }
    });
    
    window.addEventListener('offline', () => {
      this.isOffline = true;
      this.notificationService.warning('Connexion perdue', 'Les données peuvent ne pas être à jour');
    });
  }

  // ============================================================
  // CHARGEMENT DES DONNÉES
  // ============================================================

  chargerSession(sessionId: number): void {
    console.log('📡 Chargement de la session...');
    this.loading = true;
    this.error = false;
    
    this.stationsService.getSessionById(sessionId)
      .pipe(
        retryWhen((errors: any) => errors.pipe(
          delay(1000),
          take(3),
          concatMap((error: any, index: number) => {
            if (index === 2) {
              return throwError(() => error);
            }
            return of(error);
          })
        )),
        catchError((err) => {
          console.error('❌ Erreur chargement session:', err);
          
          if (err.status === 404) {
            this.notificationService.error('Session non trouvée');
          } else if (err.status === 401) {
            this.notificationService.error('Vous devez être connecté');
            this.router.navigate(['/connexion']);
          } else if (err.status === 403) {
            this.notificationService.error('Vous n\'êtes pas autorisé à voir cette session');
          } else if (this.isOffline) {
            this.notificationService.warning('Mode hors ligne', 'Vérifiez votre connexion');
          } else {
            this.notificationService.error('Erreur lors du chargement de la session');
          }
          
          this.loading = false;
          this.error = true;
          this.cdr.detectChanges();
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (session: SessionRecharge) => {
          console.log('✅ Session reçue:', session);
          
          if (!this.verifierAutorisation(session)) {
            this.notificationService.error('Vous n\'êtes pas autorisé à voir cette session');
            this.retour();
            return;
          }
          
          this.session = session;
          this.loading = false;
          this.cdr.detectChanges();
          
          if (this.session?.borneId) {
            this.chargerBorne(this.session.borneId);
            this.chargerConnections(this.session.borneId);
          }

          if (this.session?.status === SessionStatus.ACTIVE) {
            this.demarrerSuivi();
          }
        }
      });
  }

  chargerBorne(borneId: number): void {
    console.log('📡 Chargement de la borne:', borneId);
    this.stationsService.getBorneById(borneId)
      .pipe(
        catchError((err) => {
          console.error('❌ Erreur chargement borne:', err);
          this.notificationService.warning('Impossible de charger les détails de la borne');
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (borne: Borne) => {
          console.log('✅ Borne chargée:', borne);
          this.borne = borne;
          
          if (borne.connections && borne.connections.length > 0) {
            const maxPower = Math.max(...borne.connections.map(c => c.powerKw || 0));
            this.puissance = maxPower;
            console.log('⚡ Puissance max des connections:', this.puissance);
          } else if (borne.power) {
            this.puissance = borne.power;
            console.log('⚡ Puissance de la borne:', this.puissance);
          }
          
          this.cdr.detectChanges();
        }
      });
  }

  chargerConnections(borneId: number): void {
    console.log('📡 Chargement des connections pour la borne:', borneId);
    this.stationsService.getStationConnections(borneId)
      .pipe(
        catchError((err) => {
          console.error('❌ Erreur chargement connections:', err);
          this.connections = [];
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (connections: Connection[]) => {
          console.log('✅ Connections chargées:', connections.length);
          this.connections = connections;
          if (this.borne) {
            this.borne.connections = connections;
          }
          this.cdr.detectChanges();
        }
      });
  }

  // ============================================================
  // PERMISSIONS
  // ============================================================

  private verifierAutorisation(session: SessionRecharge): boolean {
    if (!this.isLoggedIn) return false;
    
    const userId = this.authService.getUserId();
    if (userId === null || userId === undefined) return false;
    
    const userIdNumber = Number(userId);
    const conducteurIdNumber = Number(session.conducteurId);
    
    if (conducteurIdNumber === userIdNumber) return true;
    
    const role = this.authService.getUserRole();
    return role === 'ADMIN' || role === 'OPERATOR';
  }

  // ============================================================
  // SUIVI EN TEMPS RÉEL
  // ============================================================

  demarrerSuivi(): void {
    if (!this.session) return;
    console.log('🔄 Démarrage du suivi en temps réel');
    
    this.setupWebSocket();
    
    this.calculerMetriques();
    this.refreshInterval = setInterval(() => {
      this.calculerMetriques();
      this.cdr.detectChanges();
    }, 5000);
  }

  private setupWebSocket(): void {
    if (!this.session) return;
    
    try {
      const wsUrl = `wss://api.rechargemaroc.com/sessions/${this.session.id}/live`;
      this.webSocket = new WebSocket(wsUrl);
      
      this.webSocket.onopen = () => {
        console.log('✅ WebSocket connecté');
        if (this.refreshInterval) {
          clearInterval(this.refreshInterval);
        }
      };
      
      this.webSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'SESSION_UPDATE' && data.session) {
            this.session = data.session;
            this.calculerMetriques();
            this.verifierSeuils(this.progression);
            this.cdr.detectChanges();
          }
        } catch (error) {
          console.error('Erreur parsing WebSocket:', error);
        }
      };
      
      this.webSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.webSocket = null;
        if (!this.refreshInterval) {
          this.demarrerSuivi();
        }
      };
      
      this.webSocket.onclose = () => {
        console.log('WebSocket déconnecté');
        this.webSocket = null;
      };
    } catch (error) {
      console.error('Erreur WebSocket:', error);
      this.webSocket = null;
    }
  }

  calculerMetriques(): void {
    if (!this.session || !this.session.dateDebut) return;

    const debut = new Date(this.session.dateDebut);
    const maintenant = new Date();
    const diffMinutes = Math.floor((maintenant.getTime() - debut.getTime()) / 60000);

    this.tempsEcoule = diffMinutes;
    this.progression = Math.min(100, (diffMinutes / this.dureeMaximale) * 100);
    
    const puissanceReelle = this.puissance || 50;
    this.energieEstimee = (diffMinutes / 60) * puissanceReelle;
    this.coutEstime = this.energieEstimee * this.tarifKWh;

    this.verifierSeuils(this.progression);

    if (diffMinutes >= this.dureeMaximale && this.session?.status === SessionStatus.ACTIVE) {
      this.terminerSessionAuto();
    }
  }

  private verifierSeuils(progression: number): void {
    const seuils = [25, 50, 75, 90, 95, 100];
    const seuilAtteint = seuils.find(s => progression >= s && !this.seuilsAtteints.has(s));
    
    if (seuilAtteint) {
      this.seuilsAtteints.add(seuilAtteint);
      
      if (seuilAtteint === 100) {
        this.notificationService.success('🎉 Recharge terminée !');
      } else if (seuilAtteint === 95) {
        this.notificationService.info('⚡ Recharge presque terminée (95%)');
      } else if (seuilAtteint === 90) {
        this.notificationService.info(`⚡ Recharge à ${seuilAtteint}%`);
      } else if (seuilAtteint === 25) {
        this.notificationService.info(`⚡ Recharge à ${seuilAtteint}%`);
      }
    }
  }

  // ============================================================
  // MÉTHODES UTILITAIRES
  // ============================================================

  getMaxPowerFromConnections(): string {
    if (!this.connections || this.connections.length === 0) {
      return this.borne?.power ? `${this.borne.power}` : 'N/A';
    }
    const maxPower = Math.max(...this.connections.map(c => c.powerKw || 0));
    return `${maxPower}`;
  }

  getTotalConnectors(): number {
    if (!this.connections) return 0;
    return this.connections.reduce((sum, conn) => sum + (conn.quantity || 0), 0);
  }

  getConnectionTypes(): string {
    if (!this.connections || this.connections.length === 0) {
      return 'Aucun connecteur';
    }
    const types = this.connections.map(conn => conn.connectionType);
    const uniqueTypes = [...new Set(types)];
    return uniqueTypes.join(', ');
  }

  getOperatorName(operator: string | undefined | null): string {
    if (!operator || operator === '(Unknown Operator)' || operator === 'NULL') {
      return 'Opérateur inconnu';
    }
    return operator;
  }

  getStatusText(status: string | undefined): string {
    if (!status) return 'Inconnu';
    switch(status) {
      case SessionStatus.ACTIVE: return '🔵 En cours';
      case SessionStatus.TERMINATED: return '✅ Terminée';
      case SessionStatus.CANCELLED: return '❌ Annulée';
      case SessionStatus.PAUSED: return '⏸️ En pause';
      case SessionStatus.PENDING: return '⏳ En attente';
      case SessionStatus.ERROR: return '⚠️ Erreur';
      default: return status;
    }
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    switch(status) {
      case SessionStatus.ACTIVE: return 'active';
      case SessionStatus.TERMINATED: return 'terminated';
      case SessionStatus.CANCELLED: return 'cancelled';
      case SessionStatus.PAUSED: return 'paused';
      case SessionStatus.PENDING: return 'pending';
      case SessionStatus.ERROR: return 'error';
      default: return '';
    }
  }

  isStatusActive(): boolean {
    return this.session?.status === SessionStatus.ACTIVE;
  }

  isStatusTerminated(): boolean {
    return this.session?.status === SessionStatus.TERMINATED;
  }

  isStatusCancelled(): boolean {
    return this.session?.status === SessionStatus.CANCELLED;
  }

  isStatusPaused(): boolean {
    return this.session?.status === SessionStatus.PAUSED;
  }

  isStatusFinished(): boolean {
    return this.isStatusTerminated() || this.isStatusCancelled();
  }

  // ============================================================
  // PLEIN ÉCRAN
  // ============================================================

  toggleFullScreen(): void {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        console.error('Erreur plein écran:', err);
        this.notificationService.warning('Impossible de passer en plein écran');
      });
      this.isFullScreen = true;
    } else {
      document.exitFullscreen();
      this.isFullScreen = false;
    }
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  terminerSessionAuto(): void {
    if (!this.session) return;
    console.log('⏰ Temps de recharge maximum atteint');
    this.notificationService.warning('Temps de recharge maximum atteint', 'Arrêt automatique');
    this.terminerSession();
  }

  terminerSession(): void {
    if (!this.session) return;
    
    if (this.session.status !== SessionStatus.ACTIVE) {
      this.notificationService.warning('Cette session n\'est pas active');
      return;
    }

    // La confirmation est déjà gérée par le modal
    // Plus besoin de confirm() ici

    this.loading = true;
    this.stationsService.terminerRecharge(this.session.id)
      .pipe(
        catchError((err) => {
          console.error('❌ Erreur terminaison:', err);
          this.loading = false;
          this.showTerminateModal = false;
          this.cdr.detectChanges();
          this.notificationService.error('Erreur lors de la terminaison');
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (session: SessionRecharge) => {
          console.log('✅ Session terminée:', session);
          this.session = session;
          this.loading = false;
          this.cleanupResources();
          this.showTerminateModal = false;
          this.cdr.detectChanges();
          this.notificationService.success('Recharge terminée avec succès !');
          setTimeout(() => this.retour(), 2000);
        }
      });
  }

  annulerSession(): void {
    if (!this.session) return;
    
    if (this.session.status !== SessionStatus.ACTIVE) {
      this.notificationService.warning('Cette session n\'est pas active');
      return;
    }

    // La confirmation est déjà gérée par le modal
    // Plus besoin de confirm() ici

    this.loading = true;
    this.stationsService.annulerSession(this.session.id)
      .pipe(
        catchError((err) => {
          console.error('❌ Erreur annulation:', err);
          this.loading = false;
          this.showCancelModal = false;
          this.cdr.detectChanges();
          this.notificationService.error('Erreur lors de l\'annulation');
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (session: SessionRecharge) => {
          console.log('✅ Session annulée:', session);
          this.session = session;
          this.loading = false;
          this.cleanupResources();
          this.showCancelModal = false;
          this.cdr.detectChanges();
          this.notificationService.info('Recharge annulée');
          setTimeout(() => this.retour(), 2000);
        }
      });
  }

  pauserSession(): void {
    if (!this.session || this.session.status !== SessionStatus.ACTIVE) {
      this.notificationService.warning('Impossible de mettre en pause');
      return;
    }
    
    this.loading = true;
    this.stationsService.pauserSession(this.session.id)
      .pipe(
        catchError((err) => {
          console.error('❌ Erreur pause:', err);
          this.loading = false;
          this.cdr.detectChanges();
          this.notificationService.error('Erreur lors de la mise en pause');
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (session: SessionRecharge) => {
          console.log('✅ Session en pause:', session);
          this.session = session;
          this.loading = false;
          this.cdr.detectChanges();
          this.notificationService.info('⏸️ Recharge mise en pause');
        }
      });
  }

  reprendreSession(): void {
    if (!this.session || !this.isStatusPaused()) {
      this.notificationService.warning('Impossible de reprendre');
      return;
    }
    
    this.loading = true;
    this.stationsService.reprendreSession(this.session.id)
      .pipe(
        catchError((err) => {
          console.error('❌ Erreur reprise:', err);
          this.loading = false;
          this.cdr.detectChanges();
          this.notificationService.error('Erreur lors de la reprise');
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (session: SessionRecharge) => {
          console.log('✅ Session reprise:', session);
          this.session = session;
          this.loading = false;
          this.cdr.detectChanges();
          this.notificationService.success('▶️ Recharge reprise');
          this.demarrerSuivi();
        }
      });
  }

  retour(): void {
    console.log('⬅️ Retour vers /stations');
    this.cleanupResources();
    this.router.navigate(['/stations']);
  }
}
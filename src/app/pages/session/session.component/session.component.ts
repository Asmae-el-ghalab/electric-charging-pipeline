// src/app/pages/session/session.component.ts

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StationsService, SessionRecharge, Borne } from '../../../../services/stations.service';
import { AuthService } from '../../../../services/auth.service';
import { NotificationService } from '../../../../services/notification.service';
// src/app/pages/session/session.component.ts
// Version corrigée avec gestion d'erreur complète
// src/app/pages/session/session.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';  // ✅ Ajouter ChangeDetectorRef
// src/app/pages/session/session.component.ts


@Component({
  selector: 'app-session',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Bandeau test -->
    <div style="background: #4a90d9; color: white; padding: 10px; text-align: center; font-weight: bold; margin: 10px; border-radius: 5px;">
      🚀 SESSION COMPOSANT - Version finale
    </div>

    <!-- Loading -->
    <div *ngIf="loading" style="text-align:center; padding:50px; background:#f5f5f5; border-radius: 10px; margin: 20px;">
      <h2>⏳ Chargement de la session...</h2>
      <div style="width:50px; height:50px; border:5px solid #f3f3f3; border-top:5px solid #4a90d9; border-radius:50%; animation: spin 1s linear infinite; margin:20px auto;"></div>
      <p style="color:#666;">ID: {{ sessionId }}</p>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>

    <!-- Contenu principal -->
    <div *ngIf="!loading && session" style="padding:20px; max-width:800px; margin:0 auto; font-family:Arial, sans-serif;">
      <!-- Statut -->
      <div style="background: #e8f5e9; padding: 10px 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #4caf50;">
        <strong>✅ Statut:</strong> 
        <span style="color: #2e7d32; font-weight: bold;">
          {{ session.status === 'ACTIVE' ? 'En cours' : session.status }}
        </span>
      </div>

      <h1 style="color:#1a1a2e; border-bottom:2px solid #eee; padding-bottom:15px;">
        🔋 Session de Recharge #{{ session.id }}
      </h1>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f5f7fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <div><strong>ID Session:</strong> #{{ session.id }}</div>
        <div><strong>Conducteur:</strong> {{ session.conducteurId }}</div>
        <div><strong>Date début:</strong> {{ session.dateDebut | date:'dd/MM/yyyy HH:mm' }}</div>
        <div><strong>Borne ID:</strong> {{ session.borneId }}</div>
      </div>

      <!-- Borne -->
      <div *ngIf="borne" style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h3 style="margin-top:0;">📍 Borne: {{ borne.title || 'Borne #' + borne.id }}</h3>
        <p style="margin:5px 0;">{{ borne.address }}{{ borne.city ? ', ' + borne.city : '' }}</p>
        <p style="margin:5px 0;"><strong>Opérateur:</strong> {{ getOperatorName(borne.operator) }}</p>
        <p style="margin:5px 0;"><strong>Puissance:</strong> {{ borne.power || 'N/A' }} kW</p>
      </div>

      <!-- Suivi -->
      <div *ngIf="session.status === 'ACTIVE'" style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h3 style="margin-top:0;">📊 Suivi en temps réel</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
          <div style="background:white; padding:10px; border-radius:5px; text-align:center;">
            <div style="font-size:12px; color:#888;">Temps écoulé</div>
            <div style="font-size:20px; font-weight:bold; color:#1a1a2e;">{{ tempsEcoule }} min</div>
          </div>
          <div style="background:white; padding:10px; border-radius:5px; text-align:center;">
            <div style="font-size:12px; color:#888;">Énergie</div>
            <div style="font-size:20px; font-weight:bold; color:#1a1a2e;">{{ energieEstimee | number:'1.1-1' }} kWh</div>
          </div>
          <div style="background:white; padding:10px; border-radius:5px; text-align:center;">
            <div style="font-size:12px; color:#888;">Coût</div>
            <div style="font-size:20px; font-weight:bold; color:#1a1a2e;">{{ coutEstime | currency:'EUR' }}</div>
          </div>
        </div>
        
        <div style="margin-top:15px;">
          <div style="display:flex; justify-content:space-between; font-size:12px; color:#888;">
            <span>Début</span>
            <span>{{ progression | number:'1.0-0' }}%</span>
            <span>Fin</span>
          </div>
          <div style="background: #e0e0e0; height: 10px; border-radius: 5px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #4caf50, #8bc34a); height: 100%; width: {{ progression }}%; transition: width 0.5s;"></div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div *ngIf="session.status === 'ACTIVE'" style="display: flex; gap: 10px; margin: 20px 0; flex-wrap: wrap;">
        <button (click)="terminerSession()" [disabled]="loading" style="padding: 12px 25px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: bold;">
          ⛔ Terminer
        </button>
        <button (click)="annulerSession()" [disabled]="loading" style="padding: 12px 25px; background: #ff9800; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: bold;">
          ❌ Annuler
        </button>
      </div>

      <!-- Résumé -->
      <div *ngIf="session.status === 'TERMINEE' || session.status === 'ANNULEE'" 
           style="padding:15px; border-radius:8px; margin:15px 0;"
           [ngStyle]="{'background': session.status === 'TERMINEE' ? '#e8f5e9' : '#ffebee', 'border': '2px solid ' + (session.status === 'TERMINEE' ? '#4caf50' : '#f44336')}">
        <h3 style="margin-top:0;">{{ session.status === 'TERMINEE' ? '✅ Recharge terminée' : '❌ Recharge annulée' }}</h3>
        <p *ngIf="session.status === 'TERMINEE'">
          Durée: {{ session.duree }} min | 
          Énergie: {{ session.consommation | number:'1.1-1' }} kWh | 
          Montant: {{ session.montantTotal | currency:'EUR' }}
        </p>
      </div>

      <button (click)="retour()" style="padding: 10px 20px; background: #4a90d9; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
        ⬅️ Retour aux bornes
      </button>
    </div>

    <!-- DEBUG -->
    <div style="background: #f5f5f5; padding: 15px; margin: 20px; border-radius: 8px; border: 2px solid #ccc;">
      <h4 style="margin: 0 0 10px 0;">🔍 DEBUG</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 13px;">
        <div><strong>Loading:</strong> <span [style.color]="loading ? 'red' : 'green'">{{ loading }}</span></div>
        <div><strong>Error:</strong> <span [style.color]="error ? 'red' : 'green'">{{ error }}</span></div>
        <div><strong>Session:</strong> <span [style.color]="session ? 'green' : 'red'">{{ session ? '✅ Chargée' : '❌ Null' }}</span></div>
        <div><strong>Borne:</strong> <span [style.color]="borne ? 'green' : 'red'">{{ borne ? '✅ Chargée' : '❌ Null' }}</span></div>
        <div><strong>Session ID:</strong> {{ session?.id }}</div>
        <div><strong>Status:</strong> {{ session?.status }}</div>
        <div><strong>SessionId (param):</strong> {{ sessionId }}</div>
      </div>
    </div>
  `,
  styles: [`
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e0e0e0;
      border-top: 4px solid #4a90d9;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 20px auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class SessionComponent implements OnInit, OnDestroy {

  session: SessionRecharge | null = null;
  borne: Borne | null = null;
  loading = true;
  error = false;

  tempsEcoule = 0;
  tempsRestant = 0;
  energieEstimee = 0;
  coutEstime = 0;
  progression = 0;
  dureeMaximale = 120;
  puissance = 50;
  tarifKWh = 0.30;

  sessionId: number | null = null;

  private refreshInterval: any;

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
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('📋 Paramètre ID reçu:', id);
      if (id) {
        this.sessionId = parseInt(id);
        console.log('📱 Chargement de la session ID:', this.sessionId);
        this.chargerSession(this.sessionId);
      } else {
        console.error('❌ ID de session non trouvé dans les paramètres');
        this.notificationService.error('ID de session non trouvé');
        this.retour();
      }
    });
  }

  ngOnDestroy(): void {
    console.log('🧹 SessionComponent détruit');
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  chargerSession(sessionId: number): void {
    console.log('📡 Chargement de la session...');
    this.loading = true;
    this.error = false;
    
    this.stationsService.getSessionById(sessionId).subscribe({
      next: (session) => {
        console.log('✅ Session reçue du serveur:', session);
        
        if (session) {
          this.session = session;
          console.log('📊 Session ID:', this.session.id);
          console.log('📊 Session Status:', this.session.status);
        } else {
          console.warn('⚠️ Session est null ou undefined');
          this.error = true;
        }
        
        this.loading = false;
        console.log('📊 Loading status:', this.loading);
        
        // ✅ FORCER LA DÉTECTION
        this.cdr.detectChanges();
        
        if (this.session?.borneId) {
          console.log('🔍 Chargement de la borne:', this.session.borneId);
          this.chargerBorne(this.session.borneId);
        }

        if (this.session?.status === 'ACTIVE') {
          console.log('🔄 Session active, démarrage du suivi');
          this.demarrerSuivi();
        }
      },
      error: (err) => {
        console.error('❌ Erreur chargement session:', err);
        this.loading = false;
        this.error = true;
        this.cdr.detectChanges();
        this.notificationService.error('Impossible de charger la session');
      }
    });
  }

  chargerBorne(borneId: number): void {
    console.log('📡 Chargement de la borne:', borneId);
    this.stationsService.getBorneById(borneId).subscribe({
      next: (borne) => {
        console.log('✅ Borne chargée:', borne);
        this.borne = borne;
        if (borne.power) {
          this.puissance = borne.power;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur chargement borne:', err);
        this.notificationService.warning('Impossible de charger les détails de la borne');
      }
    });
  }

  demarrerSuivi(): void {
    if (!this.session) return;
    console.log('🔄 Démarrage du suivi en temps réel');
    this.calculerMetriques();
    this.refreshInterval = setInterval(() => {
      console.log('⏰ Mise à jour des métriques...');
      this.calculerMetriques();
      this.cdr.detectChanges();
    }, 5000);
  }

  calculerMetriques(): void {
    if (!this.session || !this.session.dateDebut) return;

    const debut = new Date(this.session.dateDebut);
    const maintenant = new Date();
    const diffMinutes = Math.floor((maintenant.getTime() - debut.getTime()) / 60000);

    this.tempsEcoule = diffMinutes;
    this.tempsRestant = Math.max(0, this.dureeMaximale - diffMinutes);
    this.progression = Math.min(100, (diffMinutes / this.dureeMaximale) * 100);
    this.energieEstimee = (diffMinutes / 60) * this.puissance;
    this.coutEstime = this.energieEstimee * this.tarifKWh;

    if (diffMinutes >= this.dureeMaximale && this.session?.status === 'ACTIVE') {
      this.terminerSessionAuto();
    }
  }

  terminerSessionAuto(): void {
    if (!this.session) return;
    console.log('⏰ Temps de recharge maximum atteint');
    this.notificationService.warning('Temps de recharge maximum atteint', 'Arrêt automatique');
    this.terminerSession();
  }

  terminerSession(): void {
    if (!this.session) return;
    if (this.session.status !== 'ACTIVE') {
      this.notificationService.warning('Cette session n\'est pas active');
      return;
    }
    if (!confirm('Voulez-vous vraiment terminer cette recharge ?')) {
      return;
    }

    this.loading = true;
    this.stationsService.terminerRecharge(this.session.id).subscribe({
      next: (session) => {
        console.log('✅ Session terminée:', session);
        this.session = session;
        this.loading = false;
        if (this.refreshInterval) {
          clearInterval(this.refreshInterval);
        }
        this.cdr.detectChanges();
        this.notificationService.success('Recharge terminée avec succès !');
      },
      error: (err) => {
        console.error('❌ Erreur terminaison:', err);
        this.loading = false;
        this.cdr.detectChanges();
        this.notificationService.error('Erreur lors de la terminaison');
      }
    });
  }

  annulerSession(): void {
    if (!this.session) return;
    if (this.session.status !== 'ACTIVE') {
      this.notificationService.warning('Cette session n\'est pas active');
      return;
    }
    if (!confirm('Voulez-vous vraiment annuler cette recharge ?')) {
      return;
    }

    this.loading = true;
    this.stationsService.annulerSession(this.session.id).subscribe({
      next: (session) => {
        console.log('✅ Session annulée:', session);
        this.session = session;
        this.loading = false;
        if (this.refreshInterval) {
          clearInterval(this.refreshInterval);
        }
        this.cdr.detectChanges();
        this.notificationService.info('Recharge annulée');
      },
      error: (err) => {
        console.error('❌ Erreur annulation:', err);
        this.loading = false;
        this.cdr.detectChanges();
        this.notificationService.error('Erreur lors de l\'annulation');
      }
    });
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    switch(status) {
      case 'Operational': return 'status-operational';
      case 'Maintenance': return 'status-maintenance';
      case 'OutOfService': return 'status-outofservice';
      default: return 'status-planned';
    }
  }

  getStatusText(status: string | undefined): string {
    if (!status) return 'Statut inconnu';
    switch(status) {
      case 'Operational': return 'Opérationnelle';
      case 'Maintenance': return 'En maintenance';
      case 'OutOfService': return 'Hors service';
      case 'Planned': return 'Planifiée';
      default: return status;
    }
  }

  getOperatorName(operator: string | undefined | null): string {
    if (!operator || operator === '(Unknown Operator)' || operator === 'NULL') {
      return 'Opérateur inconnu';
    }
    return operator;
  }

  retour(): void {
    console.log('⬅️ Retour vers /bornes');
    this.router.navigate(['/bornes']);
  }

  recharger(): void {
    console.log('🔄 Rechargement de la session');
    if (this.sessionId) {
      this.chargerSession(this.sessionId);
    }
  }
}
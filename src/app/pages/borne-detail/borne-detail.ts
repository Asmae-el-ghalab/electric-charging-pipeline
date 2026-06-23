// src/app/pages/borne-detail/borne-detail.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { StationsService, Borne, Connection } from '../../../services/stations.service';
import { NotificationService } from '../../../services/notification.service';
import { NavbarComponent } from '../../components/navbar/navbarComponent';

@Component({
  selector: 'app-borne-detail',
  standalone: true,
  imports: [CommonModule, RouterModule,NavbarComponent],
  templateUrl: './borne-detail.html',
  styleUrl: './borne-detail.css'
})
export class BorneDetailComponent implements OnInit {
  
  borne: Borne | null = null;
  connections: Connection[] = [];
  loading = true;
  error = false;
  borneId: number = 0;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stationsService: StationsService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef  // ✅ Injection du ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.borneId = +params['id'];
      if (this.borneId) {
        this.loadBorneDetails();
      }
    });
  }
  
  loadBorneDetails(): void {
    this.loading = true;
    this.error = false;
    
    // Charger la borne
    this.stationsService.getBorneById(this.borneId).subscribe({
      next: (borne) => {
        this.borne = borne;
        console.log('✅ Borne chargée:', borne.title);
        // Charger les connections
        this.loadConnections();
      },
      error: (err) => {
        console.error('❌ Erreur chargement borne:', err);
        this.error = true;
        this.loading = false;
        this.notificationService.error('Erreur lors du chargement des détails');
      }
    });
  }
  
  loadConnections(): void {
    console.log('📡 Chargement des connections pour la borne', this.borneId);
    
    this.stationsService.getStationConnections(this.borneId).subscribe({
      next: (connections) => {
        console.log('✅ Connections reçues:', connections.length);
        this.connections = connections;
        
        // Mettre à jour la borne avec les connections
        if (this.borne) {
          this.borne.connections = connections;
          console.log('✅ Borne mise à jour avec les connections');
        }
        
        this.loading = false;
        this.cdr.detectChanges(); // ✅ Forcer la détection des changements
      },
      error: (err) => {
        console.error('❌ Erreur chargement connections:', err);
        this.connections = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
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
  
  getMaxPower(): string {
    if (!this.borne?.connections || this.borne.connections.length === 0) {
      return this.borne?.power ? `${this.borne.power} kW` : 'N/A';
    }
    const maxPower = Math.max(...this.borne.connections.map(conn => conn.powerKw || 0));
    return `${maxPower} kW`;
  }
  
  getTotalConnectors(): number {
    if (!this.borne?.connections) return 0;
    return this.borne.connections.reduce((sum, conn) => sum + (conn.quantity || 0), 0);
  }
  
  hasDCConnector(): boolean {
    return this.borne?.connections?.some(conn => conn.currentType === 'DC') || false;
  }
  
  hasACConnector(): boolean {
    return this.borne?.connections?.some(conn => conn.currentType === 'AC (Three-Phase)') || false;
  }
  
  getLevelColor(level: string): string {
    if (!level) return '#f1f3f5';
    if (level.includes('Level 3') || level.includes('High')) {
      return '#dbeafe';
    }
    if (level.includes('Level 2') || level.includes('Medium')) {
      return '#fce7f3';
    }
    if (level.includes('Level 1') || level.includes('Low')) {
      return '#fef3c7';
    }
    return '#f1f3f5';
  }
  
  getLevelText(level: string): string {
    if (!level) return '';
    if (level.includes('Level 3')) return '⚡ Rapide';
    if (level.includes('Level 2')) return '🔋 Standard';
    if (level.includes('Level 1')) return '🔌 Lente';
    return level;
  }
  
  getLevelIcon(level: string): string {
    if (!level) return 'fa-signal';
    if (level.includes('Level 3')) return 'fa-bolt';
    if (level.includes('Level 2')) return 'fa-charging-station';
    if (level.includes('Level 1')) return 'fa-plug';
    return 'fa-signal';
  }
  
  openMaps(): void {
    if (this.borne?.latitude && this.borne?.longitude) {
      window.open(`https://www.google.com/maps?q=${this.borne.latitude},${this.borne.longitude}`, '_blank');
    }
  }
  
  goBack(): void {
    this.router.navigate(['/bornes']);
  }
  
  getUsageCost(): string {
    if (!this.borne?.usageCost) return 'Gratuit';
    return this.borne.usageCost;
  }
}
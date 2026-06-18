// src/app/components/conducteur/conducteur-dashboard.component.ts
import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { StationsService, Trajet } from '../../../../services/stations.service';

interface Conducteur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateInscription: Date;
  permis: string;
  adresse: string;
  photoProfil?: string;
}

interface Vehicule {
  id: number;
  marque: string;
  modele: string;
  immatriculation: string;
  couleur: string;
  annee: number;
  typeCarburant: string;
  estPrincipal: boolean;
}

interface Signalement {
  id: number;
  type: 'PANNE' | 'PROBLEME_FACTURATION' | 'AUTRE';
  description: string;
  dateSignalement: string | Date;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'RESOLU' | 'REJETE';
  conducteur: { id: number };
  borne: { id: number };
}

@Component({
  selector: 'app-conducteur-dashboard',
  standalone: true,
  templateUrl: './conducteur-dashboard.component.html',
  styleUrls: ['./conducteur-dashboard.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ConducteurDashboardComponent implements OnInit {
  
  private apiUrl = 'http://localhost:8081/api';
  conducteurId: number = 0;
  
  // ========== PROFIL ==========
  conducteur: Conducteur | null = null;
  profilEdit: any = {};
  editMode = false;
  
  // ========== VEHICULES ==========
  vehicules: Vehicule[] = [];
  nouveauVehicule = {
    marque: '',
    modele: '',
    immatriculation: '',
    couleur: '',
    annee: new Date().getFullYear(),
    typeCarburant: 'ELECTRIQUE'
  };
  
  // ========== SIGNALEMENTS ==========
  signalements: Signalement[] = [];
  signalementsFiltres: Signalement[] = [];
  filtreStatut: string = '';
  showSignalementForm = false;
  submitted = false;
  isSubmitting = false;
  nouveauSignalement = {
    borneId: null as number | null,
    type: 'PANNE' as 'PANNE' | 'PROBLEME_FACTURATION' | 'AUTRE',
    description: ''
  };
  showModalDetails: boolean = false;
  signalementSelectionne: Signalement | null = null;
  
  // ========== TRAJETS ==========
  trajets: Trajet[] = [];
  trajetsFiltres: Trajet[] = [];
  loadingTrajets = false;
  filtreTrajetStatus: string = '';
  filtreTrajetDate: string = '';
  
  // Statistiques trajets
  statsTrajetsTotal = 0;
  statsTrajetsTermines = 0;
  statsTrajetsEnCours = 0;
  statsTrajetsDistanceTotale = 0;
  statsTrajetsCoutTotal = 0;
  
  // ========== STATISTIQUES SIGNALEMENTS ==========
  statsTotal: number = 0;
  statsEnAttente: number = 0;
  statsEnCours: number = 0;
  statsResolus: number = 0;
  statsRejetes: number = 0;
  
  // ========== LOADING ==========
  loading = {
    profil: false,
    vehicules: false,
    signalements: false
  };
  
  // ========== TABS ==========
  activeTab: 'dashboard' | 'vehicules' | 'signalements' | 'profil' | 'trajets' = 'signalements';
  
  // ========== NOTIFICATIONS ==========
  notificationMessage: string = '';
  notificationType: 'success' | 'error' | 'info' | 'warning' = 'info';
  showNotification: boolean = false;
  notificationQueue: { message: string; type: string }[] = [];
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private stationsService: StationsService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  
  ngOnInit(): void {
    if (!this.isBrowser()) return;
    
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (!this.authService.isConducteur()) {
      this.router.navigate(['/accueil']);
      return;
    }
    
    this.conducteurId = this.authService.getUserId();
    
    if (this.conducteurId === 0) {
      const token = this.authService.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.conducteurId = payload.id || payload.userId || 6;
        } catch (e) {}
      }
    }
    
    if (this.conducteurId === 0) {
      this.conducteurId = 6;
    }
    
    this.chargerToutesLesDonnees();
  }
  
  // ========== CHARGEMENT DES DONNÉES ==========
  
  chargerToutesLesDonnees(): void {
    this.chargerProfil();
    this.chargerVehicules();
    this.chargerSignalements();
    this.chargerTrajets();
  }
  
  // ========== PROFIL ==========
  
  chargerProfil(): void {
    this.loading.profil = true;
    this.http.get<Conducteur>(`${this.apiUrl}/conducteur/profil/${this.conducteurId}`).subscribe({
      next: (data) => {
        this.conducteur = data;
        this.profilEdit = { ...data };
        this.loading.profil = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur profil:', err);
        this.loading.profil = false;
        this.showMessage('Erreur chargement du profil', 'error');
        this.cdr.detectChanges();
      }
    });
  }
  
  activerEditMode(): void {
    this.editMode = true;
    this.profilEdit = { ...this.conducteur };
    this.cdr.detectChanges();
    this.showMessage('✏️ Mode édition activé', 'info');
  }
  
  annulerEdit(): void {
    this.editMode = false;
    this.profilEdit = { ...this.conducteur };
    this.cdr.detectChanges();
    this.showMessage('📋 Modifications annulées', 'info');
  }
  
  sauvegarderProfil(): void {
    this.http.put<Conducteur>(`${this.apiUrl}/conducteur/profil/${this.conducteurId}`, this.profilEdit).subscribe({
      next: (data) => {
        this.conducteur = data;
        this.editMode = false;
        this.showMessage('✅ Profil mis à jour', 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.showMessage('❌ Erreur mise à jour', 'error');
      }
    });
  }
  
  // ========== VEHICULES ==========
  
  chargerVehicules(): void {
    this.loading.vehicules = true;
    this.http.get<Vehicule[]>(`${this.apiUrl}/conducteur/vehicules/${this.conducteurId}`).subscribe({
      next: (data) => {
        this.vehicules = data;
        this.loading.vehicules = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur véhicules:', err);
        this.loading.vehicules = false;
        this.showMessage('Erreur chargement des véhicules', 'error');
        this.cdr.detectChanges();
      }
    });
  }
  
  ajouterVehicule(): void {
    if (!this.nouveauVehicule.marque || !this.nouveauVehicule.modele || !this.nouveauVehicule.immatriculation) {
      this.showMessage('⚠️ Veuillez remplir tous les champs', 'warning');
      return;
    }
    
    this.http.post<Vehicule>(`${this.apiUrl}/conducteur/vehicules/${this.conducteurId}`, this.nouveauVehicule).subscribe({
      next: (data) => {
        this.vehicules.push(data);
        this.nouveauVehicule = {
          marque: '',
          modele: '',
          immatriculation: '',
          couleur: '',
          annee: new Date().getFullYear(),
          typeCarburant: 'ELECTRIQUE'
        };
        this.showMessage(`✅ Véhicule ajouté`, 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.showMessage('❌ Erreur ajout véhicule', 'error');
      }
    });
  }
  
  supprimerVehicule(id: number): void {
    if (!confirm('⚠️ Supprimer ce véhicule ?')) return;
    
    this.http.delete(`${this.apiUrl}/conducteur/vehicules/${id}`).subscribe({
      next: () => {
        this.vehicules = this.vehicules.filter(v => v.id !== id);
        this.showMessage('✅ Véhicule supprimé', 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.showMessage('❌ Erreur suppression', 'error');
      }
    });
  }
  
  definirVehiculePrincipal(id: number): void {
    this.vehicules.forEach(v => v.estPrincipal = v.id === id);
    this.showMessage('✅ Véhicule principal défini', 'success');
    this.cdr.detectChanges();
  }
  
  // ========== SIGNALEMENTS ==========
  
  chargerSignalements(): void {
    this.loading.signalements = true;
    this.cdr.detectChanges();
    
    this.http.get<Signalement[]>(`${this.apiUrl}/signalements`).subscribe({
      next: (data) => {
        this.signalements = data.filter(s => s.conducteur?.id === this.conducteurId);
        this.signalementsFiltres = [...this.signalements];
        this.updateStats();
        this.loading.signalements = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur chargement signalements:', err);
        this.loading.signalements = false;
        this.signalements = [];
        this.signalementsFiltres = [];
        this.updateStats();
        this.cdr.detectChanges();
        this.showMessage('❌ Erreur chargement des signalements', 'error');
      }
    });
  }
  
  private updateStats(): void {
    this.statsTotal = this.signalements.length;
    this.statsEnAttente = this.signalements.filter(s => s.statut === 'EN_ATTENTE').length;
    this.statsEnCours = this.signalements.filter(s => s.statut === 'EN_COURS').length;
    this.statsResolus = this.signalements.filter(s => s.statut === 'RESOLU').length;
    this.statsRejetes = this.signalements.filter(s => s.statut === 'REJETE').length;
  }
  
  appliquerFiltres(): void {
    if (!this.filtreStatut) {
      this.signalementsFiltres = [...this.signalements];
    } else {
      this.signalementsFiltres = this.signalements.filter(
        s => s.statut === this.filtreStatut
      );
    }
    this.cdr.detectChanges();
  }
  
  ouvrirFormulaireSignalement(): void {
    this.submitted = false;
    this.isSubmitting = false;
    this.showSignalementForm = true;
    this.nouveauSignalement = {
      borneId: null,
      type: 'PANNE',
      description: ''
    };
    this.cdr.detectChanges();
  }
  
  fermerFormulaireSignalement(): void {
    this.showSignalementForm = false;
    this.submitted = false;
    this.isSubmitting = false;
    this.cdr.detectChanges();
  }
  
  signalerBorne(): void {
    this.submitted = true;
    this.cdr.detectChanges();
    
    if (!this.nouveauSignalement.borneId) {
      this.showMessage('⚠️ Veuillez entrer l\'ID de la borne', 'warning');
      return;
    }
    
    if (!this.nouveauSignalement.description || this.nouveauSignalement.description.trim().length < 10) {
      this.showMessage('⚠️ La description doit contenir au moins 10 caractères', 'warning');
      return;
    }
    
    if (this.isSubmitting) {
      this.showMessage('⏳ Envoi en cours...', 'info');
      return;
    }
    
    this.isSubmitting = true;
    this.loading.signalements = true;
    this.cdr.detectChanges();
    
    const signalementData = {
      conducteurId: this.conducteurId.toString(),
      borneId: this.nouveauSignalement.borneId.toString(),
      type: this.nouveauSignalement.type,
      description: this.nouveauSignalement.description.trim()
    };
    
    this.http.post<Signalement>(`${this.apiUrl}/signalements`, signalementData).subscribe({
      next: (signalement) => {
        this.signalements.unshift(signalement);
        this.signalementsFiltres = [...this.signalements];
        this.updateStats();
        this.fermerFormulaireSignalement();
        this.showMessage(`✅ Signalement envoyé avec succès !`, 'success');
        this.loading.signalements = false;
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        this.loading.signalements = false;
        this.isSubmitting = false;
        this.cdr.detectChanges();
        this.showMessage('❌ Erreur lors de l\'envoi', 'error');
      }
    });
  }
  
  voirDetailsSignalement(signalement: Signalement): void {
    this.signalementSelectionne = signalement;
    this.showModalDetails = true;
    this.cdr.detectChanges();
  }
  
  fermerModalDetails(): void {
    this.showModalDetails = false;
    this.signalementSelectionne = null;
    this.cdr.detectChanges();
  }
  
  // ========== TRAJETS ==========
  
  chargerTrajets(): void {
    this.loadingTrajets = true;
    this.cdr.detectChanges();
    
    this.stationsService.getTrajetsByConducteur(this.conducteurId).subscribe({
      next: (data) => {
        this.trajets = data;
        this.trajetsFiltres = [...this.trajets];
        this.updateTrajetsStats();
        this.loadingTrajets = false;
        this.cdr.detectChanges();
        
        console.log(`✅ ${this.trajets.length} trajets chargés`);
        if (this.trajets.length === 0) {
          this.showMessage('📭 Aucun trajet trouvé', 'info');
        }
      },
      error: (err) => {
        console.error('❌ Erreur chargement trajets:', err);
        this.loadingTrajets = false;
        this.trajets = [];
        this.trajetsFiltres = [];
        this.cdr.detectChanges();
        this.showMessage('❌ Erreur chargement des trajets', 'error');
      }
    });
  }
  
  private updateTrajetsStats(): void {
    this.statsTrajetsTotal = this.trajets.length;
    this.statsTrajetsTermines = this.trajets.filter(t => t.status === 'TERMINE').length;
    this.statsTrajetsEnCours = this.trajets.filter(t => t.status === 'EN_COURS').length;
    this.statsTrajetsDistanceTotale = this.trajets.reduce((sum, t) => sum + (t.distanceKm || 0), 0);
    this.statsTrajetsCoutTotal = this.trajets.reduce((sum, t) => sum + (t.coutTotal || 0), 0);
  }
  
  appliquerFiltresTrajets(): void {
    let resultats = [...this.trajets];
    
    if (this.filtreTrajetStatus) {
      resultats = resultats.filter(t => t.status === this.filtreTrajetStatus);
    }
    
    if (this.filtreTrajetDate) {
      const dateFilter = new Date(this.filtreTrajetDate);
      resultats = resultats.filter(t => {
        const dateTrajet = new Date(t.dateDebut);
        return dateTrajet.toDateString() === dateFilter.toDateString();
      });
    }
    
    this.trajetsFiltres = resultats;
    this.cdr.detectChanges();
  }
  
  // ========== UTILITAIRES ==========
  
  getStatusTrajetClass(status: string): string {
    switch(status) {
      case 'TERMINE': return 'badge-success';
      case 'EN_COURS': return 'badge-info';
      case 'ANNULE': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
  
  getStatusTrajetTexte(status: string): string {
    switch(status) {
      case 'TERMINE': return '✅ Terminé';
      case 'EN_COURS': return '🔄 En cours';
      case 'ANNULE': return '❌ Annulé';
      default: return status;
    }
  }
  
  getStatutTraitementClass(statut: string): string {
    switch(statut) {
      case 'EN_ATTENTE': return 'badge-warning';
      case 'EN_COURS': return 'badge-info';
      case 'RESOLU': return 'badge-success';
      case 'REJETE': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
  
  getStatutTraitementTexte(statut: string): string {
    switch(statut) {
      case 'EN_ATTENTE': return '📋 En attente';
      case 'EN_COURS': return '🔄 En cours';
      case 'RESOLU': return '✅ Résolu';
      case 'REJETE': return '❌ Rejeté';
      default: return statut;
    }
  }
  
  getTypeSignalementTexte(type: string): string {
    switch(type) {
      case 'PANNE': return '🔧 Panne technique';
      case 'PROBLEME_FACTURATION': return '💰 Problème de facturation';
      case 'AUTRE': return '📝 Autre problème';
      default: return type;
    }
  }
  
  formaterDuree(minutes: number): string {
    if (!minutes) return 'N/A';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  }
  
  formatDateTime(date: string | Date): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // ========== TABS ==========
  
  setActiveTab(tab: 'dashboard' | 'vehicules' | 'signalements' | 'profil' | 'trajets'): void {
    this.activeTab = tab;
    if (tab === 'signalements') {
      this.chargerSignalements();
    }
    if (tab === 'trajets') {
      this.chargerTrajets();
    }
    this.cdr.detectChanges();
  }
  
  getHeaderTitle(): string {
    switch(this.activeTab) {
      case 'vehicules': return '🚗 Mes véhicules';
      case 'signalements': return '⚠️ Mes signalements';
      case 'profil': return '👤 Mon profil';
      case 'trajets': return '🗺️ Mes trajets';
      default: return '📊 Dashboard';
    }
  }
  
  refreshData(): void {
    this.showMessage('🔄 Actualisation...', 'info');
    this.chargerToutesLesDonnees();
  }
  
  logout(): void {
    this.authService.logout();
  }
  
  // ========== NOTIFICATIONS ==========
  
  showMessage(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    this.notificationQueue.push({ message, type });
    this.processNotificationQueue();
  }
  
  private processNotificationQueue(): void {
    if (this.showNotification || this.notificationQueue.length === 0) return;
    
    const next = this.notificationQueue.shift();
    if (next) {
      this.notificationMessage = next.message;
      this.notificationType = next.type as any;
      this.showNotification = true;
      this.cdr.detectChanges();
      
      let duration = 4000;
      if (next.type === 'error') duration = 6000;
      if (next.type === 'success') duration = 3000;
      
      setTimeout(() => {
        this.showNotification = false;
        this.cdr.detectChanges();
        setTimeout(() => this.processNotificationQueue(), 300);
      }, duration);
    }
  }
}
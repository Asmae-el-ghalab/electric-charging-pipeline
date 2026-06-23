// src/app/components/conducteur/conducteur-dashboard.component.ts
import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { StationsService, Trajet } from '../../../../services/stations.service';

// Interface correspondant à la table utilisateur
interface Conducteur {
  id: number;
  date_inscription: string;
  email: string;
  mot_de_passe: string;
  nom: string;
  role: string;
  dtype: string;
  vehicule: string;
  derniere_connexion: string;
  niveau_acces: string;
  est_bloque: boolean;
  type_prise: string;
  type_utilisateur: string;
}

// ✅ Interface Signalement corrigée avec propriétés supplémentaires
interface Signalement {
  id: number;
  type: 'PANNE' | 'VANDALISME' | 'INDISPONIBLE' | 'AUTRE';
  description: string;
  dateSignalement: string | Date;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'RESOLU' | 'REJETE';
  conducteur: { id: number };
  borne: { id: number };
  // Propriétés optionnelles pour la compatibilité
  borneId?: number;
  conducteurId?: number;
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
  
  conducteurId: string | null = null;
  conducteurIdNumber: number = 0;

  // ========== PROFIL ==========
  conducteur: Conducteur | null = null;
  profilEdit: any = {};
  editMode = false;
  profilCree = false;
  
  // ========== SIGNALEMENTS ==========
  signalements: Signalement[] = [];
  signalementsFiltres: Signalement[] = [];
  filtreStatut: string = '';
  showSignalementForm = false;
  submitted = false;
  isSubmitting = false;
  nouveauSignalement = {
    borneId: null as number | null,
    type: 'PANNE' as 'PANNE' | 'VANDALISME' | 'INDISPONIBLE' | 'AUTRE',
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
    signalements: false
  };
  
  // ========== TABS ==========
  activeTab: 'dashboard' | 'signalements' | 'profil' | 'trajets' = 'profil';
  
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
    
    // Diagnostic
    this.authService.diagnosticAuth();
    
    if (!this.authService.isLoggedIn()) {
      console.warn('⚠️ Non connecté, redirection vers login');
      this.router.navigate(['/login']);
      return;
    }
    
    if (!this.authService.isConducteur()) {
      console.warn('⚠️ Pas conducteur, redirection vers accueil');
      this.router.navigate(['/accueil']);
      return;
    }
    
    // ✅ Récupérer l'ID depuis le service (corrigé)
    this.conducteurId = this.authService.getUserId();
    this.conducteurIdNumber = this.authService.getUserIdAsNumber();
    
    console.log('📊 Conducteur ID (string):', this.conducteurId);
    console.log('📊 Conducteur ID (number):', this.conducteurIdNumber);
    
    // ✅ Vérifier que l'ID est valide
    if (!this.conducteurId || this.conducteurId === 'null' || this.conducteurId === 'undefined' || this.conducteurId === '0') {
      console.warn('⚠️ ID invalide, tentative de récupération...');
      
      // Essayer depuis le token
      const token = this.authService.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const id = payload.id || payload.userId || payload.sub;
          if (id) {
            const idNum = parseInt(id, 10);
            if (!isNaN(idNum) && idNum > 0) {
              this.conducteurId = idNum.toString();
              this.conducteurIdNumber = idNum;
              // Mettre à jour le localStorage
              localStorage.setItem('userId', this.conducteurId);
              console.log('✅ ID récupéré depuis le token:', this.conducteurId);
            }
          }
        } catch (e) {
          console.error('❌ Erreur décodage token:', e);
        }
      }
    }
    
    // ✅ Dernier recours
    if (!this.conducteurId || this.conducteurId === 'null' || this.conducteurId === 'undefined' || this.conducteurId === '0') {
      // Utiliser l'email comme ID de secours
      const email = this.authService.getUserEmail();
      if (email) {
        // Générer un ID numérique à partir de l'email
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
          hash = ((hash << 5) - hash) + email.charCodeAt(i);
          hash = hash & hash;
        }
        const generatedId = Math.abs(hash) % 1000 + 1;
        this.conducteurId = generatedId.toString();
        this.conducteurIdNumber = generatedId;
        localStorage.setItem('userId', this.conducteurId);
        console.log('🆔 ID généré depuis l\'email:', this.conducteurId);
      } else {
        console.warn('⚠️ Aucun ID trouvé, utilisation de l\'ID 6 par défaut');
        this.conducteurId = '6';
        this.conducteurIdNumber = 6;
        localStorage.setItem('userId', this.conducteurId);
      }
    }
    
    this.chargerToutesLesDonnees();
  }
  
  // ========== CHARGEMENT DES DONNÉES ==========
  
  chargerToutesLesDonnees(): void {
    if (!this.conducteurId) {
      console.error('❌ Impossible de charger les données: conducteurId est null');
      return;
    }
    this.chargerProfil();
    this.chargerSignalements();
    this.chargerTrajets();
  }
  
  // ========== PROFIL ==========
  
  chargerProfil(): void {
    if (!this.conducteurId) {
      console.error('❌ ID conducteur manquant');
      this.showMessage('❌ ID conducteur manquant', 'error');
      return;
    }
    
    this.loading.profil = true;
    this.cdr.detectChanges();
    
    const url = `${this.apiUrl}/conducteur/profil/${this.conducteurId}`;
    console.log('📡 Chargement profil depuis:', url);
    
    this.http.get<Conducteur>(url).subscribe({
      next: (data) => {
        console.log('📥 Réponse du serveur:', data);
        
        if (data) {
          this.conducteur = data;
          this.profilEdit = { ...data };
          this.profilCree = true;
          this.showMessage('✅ Profil chargé avec succès', 'success');
        } else {
          console.warn('⚠️ Serveur a retourné null, création d\'un profil par défaut');
          this.creerProfilParDefaut();
        }
        
        this.loading.profil = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur chargement profil:', err);
        this.loading.profil = false;
        
        if (err.status === 404) {
          console.warn('⚠️ Profil non trouvé (404), création d\'un profil par défaut');
          this.creerProfilParDefaut();
        } else {
          this.showMessage('❌ Erreur chargement du profil', 'error');
        }
        
        this.cdr.detectChanges();
      }
    });
  }
  
  creerProfilParDefaut(): void {
    // Récupérer les informations de l'utilisateur
    const nom = this.authService.getUserName() || 'Conducteur';
    const email = this.authService.getUserEmail() || 'conducteur@example.com';
    
    const defaultProfil: Conducteur = {
      id: this.conducteurIdNumber || 6,
      date_inscription: new Date().toISOString(),
      email: email,
      mot_de_passe: '',
      nom: nom,
      role: 'CONDUCTEUR',
      dtype: 'Conducteur',
      vehicule: 'Non renseigné',
      derniere_connexion: new Date().toISOString(),
      niveau_acces: 'MOYEN',
      est_bloque: false,
      type_prise: 'TYPE_2',
      type_utilisateur: 'PARTICULIER'
    };
    
    this.conducteur = defaultProfil;
    this.profilEdit = { ...defaultProfil };
    this.profilCree = false;
    this.loading.profil = false;
    this.cdr.detectChanges();
    
    this.showMessage('⚠️ Profil par défaut créé. Veuillez mettre à jour vos informations.', 'warning');
    
    // Ouvrir le mode édition après un court délai
    setTimeout(() => {
      this.editMode = true;
      this.cdr.detectChanges();
    }, 1500);
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
    if (!this.conducteurId) {
      this.showMessage('❌ ID conducteur manquant', 'error');
      return;
    }
    
    this.isSubmitting = true;
    this.cdr.detectChanges();
    
    const profilData = {
      id: this.conducteurIdNumber,
      nom: this.profilEdit.nom,
      email: this.profilEdit.email,
      type_prise: this.profilEdit.type_prise,
      vehicule: this.profilEdit.vehicule,
      niveau_acces: this.profilEdit.niveau_acces,
      role: 'CONDUCTEUR',
      dtype: 'Conducteur',
      type_utilisateur: this.profilEdit.type_utilisateur || 'PARTICULIER',
      est_bloque: false
    };
    
    console.log('📤 Sauvegarde profil:', profilData);
    
    // ✅ Essayer d'abord PUT (mise à jour)
    this.http.put<Conducteur>(`${this.apiUrl}/conducteur/profil/${this.conducteurId}`, profilData).subscribe({
      next: (data) => {
        console.log('✅ Profil mis à jour (PUT):', data);
        this.conducteur = data;
        this.editMode = false;
        this.isSubmitting = false;
        this.profilCree = true;
        this.cdr.detectChanges();
        this.showMessage('✅ Profil mis à jour avec succès', 'success');
      },
      error: (err) => {
        console.error('❌ Erreur PUT:', err);
        
        // ✅ Si PUT échoue, essayer POST (création)
        if (err.status === 404 || err.status === 400) {
          console.log('🔄 Tentative de création avec POST...');
          this.http.post<Conducteur>(`${this.apiUrl}/conducteur`, profilData).subscribe({
            next: (data) => {
              console.log('✅ Profil créé (POST):', data);
              this.conducteur = data;
              this.editMode = false;
              this.isSubmitting = false;
              this.profilCree = true;
              this.cdr.detectChanges();
              this.showMessage('✅ Profil créé avec succès', 'success');
            },
            error: (err2) => {
              console.error('❌ Erreur POST:', err2);
              this.isSubmitting = false;
              this.cdr.detectChanges();
              this.showMessage('❌ Erreur lors de la sauvegarde du profil', 'error');
            }
          });
        } else {
          this.isSubmitting = false;
          this.cdr.detectChanges();
          this.showMessage('❌ Erreur lors de la sauvegarde du profil', 'error');
        }
      }
    });
  }
  
  // ========== SIGNALEMENTS ==========
  
  // ✅ Méthode de normalisation corrigée
  private normaliserSignalement(data: any): Signalement {
    return {
      id: data.id,
      type: data.type,
      description: data.description,
      dateSignalement: data.dateSignalement,
      statut: data.statut,
      conducteur: { id: data.conducteurId || data.conducteur?.id || 0 },
      borne: { id: data.borneId || data.borne?.id || 0 },
      // Propriétés optionnelles pour compatibilité
      borneId: data.borneId || data.borne?.id || 0,
      conducteurId: data.conducteurId || data.conducteur?.id || 0
    };
  }
  
  chargerSignalements(): void {
    if (!this.conducteurIdNumber) {
      console.warn('⚠️ ID conducteur invalide pour charger les signalements');
      this.signalements = [];
      this.signalementsFiltres = [];
      this.updateStats();
      this.cdr.detectChanges();
      return;
    }
    
    this.loading.signalements = true;
    this.cdr.detectChanges();
    
    this.http.get<Signalement[]>(`${this.apiUrl}/signalements`).subscribe({
      next: (data) => {
        this.signalements = data.filter(s => s.conducteur?.id === this.conducteurIdNumber);
        this.signalementsFiltres = [...this.signalements];
        this.updateStats();
        this.loading.signalements = false;
        this.cdr.detectChanges();
        console.log(`✅ ${this.signalements.length} signalements chargés`);
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
    
    // ✅ Vérifier l'ID conducteur
    if (!this.conducteurIdNumber || this.conducteurIdNumber <= 0) {
      this.showMessage('❌ Conducteur non identifié. Veuillez vous reconnecter.', 'error');
      return;
    }
    
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
      conducteurId: this.conducteurIdNumber,
      borneId: this.nouveauSignalement.borneId,
      type: this.nouveauSignalement.type,
      description: this.nouveauSignalement.description.trim()
    };
    
    console.log('📤 Envoi signalement:', signalementData);
    
    this.http.post<Signalement>(`${this.apiUrl}/signalements`, signalementData).subscribe({
      next: (signalement) => {
        // ✅ Normaliser le signalement reçu
        const normalized = this.normaliserSignalement(signalement);
        this.signalements.unshift(normalized);
        this.signalementsFiltres = [...this.signalements];
        this.updateStats();
        this.fermerFormulaireSignalement();
        this.showMessage(`✅ Signalement envoyé avec succès !`, 'success');
        this.loading.signalements = false;
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Erreur envoi signalement:', err);
        this.loading.signalements = false;
        this.isSubmitting = false;
        this.cdr.detectChanges();
        
        let errorMsg = '❌ Erreur lors de l\'envoi';
        if (err.status === 400) {
          errorMsg = '❌ Données invalides. Vérifiez les informations saisies.';
        } else if (err.status === 404) {
          errorMsg = '❌ Borne ou conducteur non trouvé.';
        } else if (err.status === 409) {
          errorMsg = '❌ Un signalement pour cette borne existe déjà.';
        } else if (err.status === 500) {
          errorMsg = '❌ Erreur serveur. Vérifiez que le conducteur existe.';
        }
        this.showMessage(errorMsg, 'error');
      }
    });
  }
  
  voirDetailsSignalement(signalement: Signalement): void {
    // ✅ S'assurer que borneId est disponible
    if (!signalement.borneId && signalement.borne?.id) {
      (signalement as any).borneId = signalement.borne.id;
    }
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
    if (!this.conducteurIdNumber || this.conducteurIdNumber <= 0) {
      console.warn('⚠️ ID conducteur invalide pour charger les trajets');
      this.trajets = [];
      this.trajetsFiltres = [];
      this.loadingTrajets = false;
      this.cdr.detectChanges();
      return;
    }
    
    this.loadingTrajets = true;
    this.cdr.detectChanges();
    
    this.stationsService.getTrajetsByConducteur(this.conducteurIdNumber).subscribe({
      next: (data) => {
        this.trajets = data || [];
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
      default: return status || 'Inconnu';
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
      default: return statut || 'Inconnu';
    }
  }
  
  getTypeSignalementTexte(type: string): string {
    switch(type) {
      case 'PANNE': return '🔧 Panne technique';
      case 'VANDALISME': return '🚫 Vandalisme';
      case 'INDISPONIBLE': return '⛔ Indisponible';
      case 'AUTRE': return '📝 Autre problème';
      default: return type || 'Inconnu';
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
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'Date invalide';
      return d.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Date invalide';
    }
  }
  
  // ========== TABS ==========
  
  setActiveTab(tab: 'dashboard' | 'signalements' | 'profil' | 'trajets'): void {
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
// src/app/pages/stations/stationsComponent.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { StationsService, Borne, SessionRecharge } from '../../../services/stations.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './stationsComponent.html',
  styleUrl: './stationsComponent.css'
})
export class StationsComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // Liste des bornes
  bornes: Borne[] = [];
  filteredBornes: Borne[] = [];
  loading = false;
  loadingAction = false;
  
  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;
  
  // Filtres
  showFilters = false;
  filterStatus = '';
  filterCity = '';
  filterOperator = '';
  
  villes: string[] = [];
  operateurs: string[] = [];
  statusList = ['Operational', 'Maintenance', 'OutOfService', 'Planned'];
  
  // Rafraîchissement
  refreshInterval: any;
  selectedBorneId: number | null = null;
  
  // Session active de l'utilisateur
  sessionActive: SessionRecharge | null = null;
  sessionVerifiee = false;
  
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
    this.loadBornes();
    
    // Rafraîchir l'état des bornes toutes les 30 secondes
    this.refreshInterval = setInterval(() => {
      console.log('🔄 Rafraîchissement automatique des bornes');
      this.rafraichirEtatBornes();
    }, 30000);
  }
  
  ngAfterViewInit(): void {
    console.log('👁️ AfterViewInit - Vérification de la session active');
    setTimeout(() => {
      this.verifierSessionActive();
    }, 100);
  }
  
  ngOnDestroy(): void {
    console.log('🧹 StationsComponent détruit');
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
  
  /**
   * Vérifier si l'utilisateur a une session active
   */
  verifierSessionActive(): void {
    console.log('🔍 Vérification session active...');
    const userId = this.authService.getUserId();
    console.log('👤 ID utilisateur:', userId);
    
    if (!userId) {
      console.log('⚠️ Aucun utilisateur connecté');
      this.sessionVerifiee = true;
      return;
    }
    
    const conducteurId = userId.toString();
    console.log('🔑 Conducteur ID:', conducteurId);
    
    this.stationsService.getSessionActive(conducteurId).subscribe({
      next: (session: any) => {
        console.log('📱 Session active reçue:', session);
        
        // ✅ Gérer le cas où la réponse est un tableau
        let sessionData = session;
        if (Array.isArray(session)) {
          console.log('⚠️ Session reçue sous forme de tableau');
          sessionData = session.length > 0 ? session[0] : null;
        }
        
        setTimeout(() => {
          if (sessionData) {
            this.sessionActive = sessionData;
            // Marquer la borne comme occupée
            const borne = this.bornes.find(b => b.id === sessionData.borneId);
            if (borne) {
              console.log('📍 Borne trouvée:', borne.id, borne.title);
              borne.isOccupied = true;
              borne.sessionId = sessionData.id;
            } else {
              console.log('⚠️ Borne non trouvée pour la session');
            }
            this.notificationService.info('Vous avez une recharge en cours');
          } else {
            console.log('✅ Aucune session active');
            this.sessionActive = null;
          }
          this.sessionVerifiee = true;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('❌ Erreur vérification session:', err);
        setTimeout(() => {
          this.sessionActive = null;
          this.sessionVerifiee = true;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }
  
  /**
   * Charger les bornes
   */
  loadBornes(): void {
    this.loading = true;
    console.log('📡 Chargement des bornes - Page:', this.currentPage, 'Taille:', this.pageSize);
    
    this.stationsService.getAllBornes(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('✅ Réponse reçue:', response);
        console.log('📊 Nombre de bornes:', response.content?.length || 0);
        console.log('📄 Total pages:', response.totalPages);
        console.log('📄 Total éléments:', response.totalElements);
        
        // ✅ Normaliser les données : isOccupied false par défaut
        this.bornes = (response.content || []).map(borne => ({
          ...borne,
          isOccupied: borne.isOccupied === true,
          sessionId: borne.sessionId || undefined
        }));
        
        this.filteredBornes = [...this.bornes];
        this.totalPages = response.totalPages || 0;
        this.totalElements = response.totalElements || 0;
        this.extractFilters();
        this.loading = false;
        
        // ✅ Vérifier la session après chargement des bornes
        if (this.sessionVerifiee && this.sessionActive) {
          const borne = this.bornes.find(b => b.id === this.sessionActive?.borneId);
          if (borne) {
            borne.isOccupied = true;
            borne.sessionId = this.sessionActive.id;
          }
        }
        
        // ✅ Log pour déboguer
        if (this.bornes.length > 0) {
          const premiere = this.bornes[0];
          console.log('🔍 Première borne:', {
            id: premiere.id,
            status: premiere.status,
            isOccupied: premiere.isOccupied,
            sessionId: premiere.sessionId,
            estDisponible: this.estDisponible(premiere)
          });
        }
        
        this.cdr.detectChanges();
        console.log('✅ Bornes chargées avec succès');
      },
      error: (err) => {
        console.error('❌ Erreur chargement des bornes:', err);
        this.loading = false;
        this.notificationService.error('Erreur lors du chargement des bornes');
        this.cdr.detectChanges();
      }
    });
  }
  
  /**
   * Rafraîchir l'état des bornes
   */
  rafraichirEtatBornes(): void {
    if (this.loading) {
      console.log('⏳ Chargement en cours, rafraîchissement ignoré');
      return;
    }
    
    console.log('🔄 Rafraîchissement état des bornes...');
    
    this.stationsService.getAllBornes(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const borneMap = new Map(response.content.map(b => [b.id, b]));
        let hasChanges = false;
        
        this.bornes.forEach(borne => {
          const borneMaj = borneMap.get(borne.id);
          if (borneMaj) {
            const newOccupied = borneMaj.isOccupied === true;
            const newSessionId = borneMaj.sessionId || undefined;
            
            if (borne.isOccupied !== newOccupied || borne.sessionId !== newSessionId) {
              console.log(`🔄 Changement détecté pour borne ${borne.id}: occupé=${newOccupied}, session=${newSessionId}`);
              borne.isOccupied = newOccupied;
              borne.sessionId = newSessionId;
              hasChanges = true;
            }
          }
        });
        
        if (hasChanges) {
          console.log('✅ Changements appliqués, mise à jour des filtres');
          this.applyFilters();
          this.cdr.detectChanges();
        } else {
          console.log('✅ Aucun changement détecté');
        }
      },
      error: (err) => {
        console.error('❌ Erreur rafraîchissement:', err);
      }
    });
  }
  
  /**
   * Extraire les filtres disponibles
   */
  extractFilters(): void {
    console.log('🔍 Extraction des filtres...');
    const villesSet = new Set<string>();
    const operateursSet = new Set<string>();
    
    this.bornes.forEach(borne => {
      if (borne.city && borne.city.trim() && borne.city !== 'NULL') {
        villesSet.add(borne.city);
      }
      if (borne.operator && borne.operator.trim() && 
          borne.operator !== '(Unknown Operator)' && 
          borne.operator !== 'NULL') {
        operateursSet.add(borne.operator);
      }
    });
    
    this.villes = Array.from(villesSet).sort();
    this.operateurs = Array.from(operateursSet).sort();
    
    console.log('📊 Filtres extraits:', {
      villes: this.villes.length,
      villesList: this.villes,
      operateurs: this.operateurs.length,
      operateursList: this.operateurs
    });
  }
  
  /**
   * Appliquer les filtres
   */
  applyFilters(): void {
    console.log('🔍 Application des filtres:', {
      status: this.filterStatus || 'Tous',
      city: this.filterCity || 'Toutes',
      operator: this.filterOperator || 'Tous'
    });
    
    let resultats = [...this.bornes];
    
    if (this.filterStatus && this.filterStatus !== '') {
      const before = resultats.length;
      resultats = resultats.filter(borne => borne.status === this.filterStatus);
      console.log(`📌 Filtre statut "${this.filterStatus}": ${before} → ${resultats.length}`);
    }
    
    if (this.filterCity && this.filterCity !== '') {
      const before = resultats.length;
      resultats = resultats.filter(borne => 
        borne.city && borne.city.toLowerCase() === this.filterCity.toLowerCase()
      );
      console.log(`📌 Filtre ville "${this.filterCity}": ${before} → ${resultats.length}`);
    }
    
    if (this.filterOperator && this.filterOperator !== '') {
      const before = resultats.length;
      resultats = resultats.filter(borne => 
        borne.operator && borne.operator.toLowerCase() === this.filterOperator.toLowerCase()
      );
      console.log(`📌 Filtre opérateur "${this.filterOperator}": ${before} → ${resultats.length}`);
    }
    
    this.filteredBornes = resultats;
    console.log(`📊 Résultat final: ${resultats.length} bornes affichées`);
    this.cdr.detectChanges();
  }
  
  /**
   * Réinitialiser les filtres
   */
  resetFilters(): void {
    console.log('🔄 Réinitialisation des filtres');
    this.filterStatus = '';
    this.filterCity = '';
    this.filterOperator = '';
    this.filteredBornes = [...this.bornes];
    this.cdr.detectChanges();
    console.log(`✅ Filtres réinitialisés, ${this.filteredBornes.length} bornes affichées`);
  }
  
  /**
   * Basculer l'affichage des filtres
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    console.log(`🔽 Filtres ${this.showFilters ? 'affichés' : 'masqués'}`);
  }
  
  /**
   * Pagination - Page précédente
   */
  previousPage(): void {
    if (this.currentPage > 0) {
      console.log(`⬅️ Page précédente: ${this.currentPage} → ${this.currentPage - 1}`);
      this.currentPage--;
      this.loadBornes();
    } else {
      console.log('⏹️ Déjà à la première page');
    }
  }
  
  /**
   * Pagination - Page suivante
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      console.log(`➡️ Page suivante: ${this.currentPage} → ${this.currentPage + 1}`);
      this.currentPage++;
      this.loadBornes();
    } else {
      console.log('⏹️ Déjà à la dernière page');
    }
  }
  
  /**
   * Pagination - Aller à une page spécifique
   */
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      console.log(`🎯 Aller à la page: ${page}`);
      this.currentPage = page;
      this.loadBornes();
    } else {
      console.log(`⏹️ Page ${page} invalide (0-${this.totalPages - 1})`);
    }
  }
  
  /**
   * Obtenir la liste des pages à afficher
   */
  getPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    console.log(`📄 Pages affichées: ${pages.join(', ')}`);
    return pages;
  }
  
  /**
   * Obtenir la classe CSS pour le statut
   */
  getStatusClass(status: string | undefined): string {
    if (!status) return 'status-planned';
    switch(status) {
      case 'Operational': return 'status-operational';
      case 'Maintenance': return 'status-maintenance';
      case 'OutOfService': return 'status-outofservice';
      default: return 'status-planned';
    }
  }
  
  /**
   * Obtenir le texte du statut
   */
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
  
  /**
   * Obtenir le nom de l'opérateur
   */
  getOperatorName(operator: string | undefined | null): string {
    if (!operator || operator === '(Unknown Operator)' || operator === 'NULL' || operator === 'null') {
      return 'Opérateur inconnu';
    }
    return operator;
  }
  
  /**
   * Obtenir le coût d'utilisation
   */
  getUsageCost(cost: string | undefined | null): string {
    if (!cost || cost === 'Non disponible' || cost === '0' || cost === 'Free') {
      return 'Gratuit';
    }
    return cost;
  }
  
  /**
   * ✅ Vérifier si une borne est disponible (CORRIGÉ)
   */
  estDisponible(borne: Borne): boolean {
    // Vérifier le statut
    if (borne.status !== 'Operational') {
      return false;
    }
    
    // ✅ Vérifier isOccupied (gérer undefined/null)
    const isOccupied = borne.isOccupied === true;
    if (isOccupied) {
      return false;
    }
    
    // ✅ Vérifier sessionId (gérer undefined/null)
    const hasSession = borne.sessionId !== undefined && borne.sessionId !== null;
    if (hasSession) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Vérifier si c'est la session de l'utilisateur
   */
  estSessionUtilisateur(borne: Borne): boolean {
    const estMaSession = this.sessionActive !== null && 
                        this.sessionActive.borneId === borne.id &&
                        borne.isOccupied === true;
    if (estMaSession) {
      console.log(`✅ Borne ${borne.id} est ma session active`);
    }
    return estMaSession;
  }
  
  /**
   * Démarrer une recharge
   */
  demarrerRecharge(borne: Borne): void {
    console.log(`🚀 Tentative de démarrage recharge - Borne ${borne.id} (${borne.title})`);
    
    if (!this.estDisponible(borne)) {
      console.warn(`⚠️ Borne ${borne.id} non disponible`);
      this.notificationService.warning('Cette borne n\'est pas disponible');
      return;
    }

    if (!this.authService.isLoggedIn()) {
      console.warn('⚠️ Utilisateur non connecté');
      this.notificationService.warning('Veuillez vous connecter pour démarrer une recharge');
      this.router.navigate(['/connexion']);
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('❌ ID utilisateur non trouvé');
      this.notificationService.error('Identifiant conducteur non trouvé');
      return;
    }
    
    const conducteurId = userId.toString();
    console.log(`👤 Conducteur ID: ${conducteurId}`);

    if (this.sessionActive) {
      console.warn('⚠️ Session active déjà présente:', this.sessionActive);
      this.notificationService.warning(
        'Vous avez déjà une recharge en cours. Terminez-la avant d\'en démarrer une nouvelle.'
      );
      return;
    }

    this.selectedBorneId = borne.id;
    this.loadingAction = true;

    console.log(`🔍 Vérification disponibilité serveur pour borne ${borne.id}`);
    this.stationsService.verifierDisponibilite(borne.id).subscribe({
      next: (response) => {
        console.log(`📡 Réponse disponibilité:`, response);
        if (response.disponible) {
          console.log('✅ Borne disponible, confirmation du démarrage');
          this.confirmerDemarrage(borne, conducteurId);
        } else {
          console.warn('⚠️ Borne non disponible côté serveur:', response.message);
          this.loadingAction = false;
          this.selectedBorneId = null;
          this.notificationService.error(
            response.message || 'Cette borne est déjà utilisée',
            'Borne occupée'
          );
          this.rafraichirEtatBornes();
        }
      },
      error: (err) => {
        console.error('❌ Erreur vérification disponibilité:', err);
        this.loadingAction = false;
        this.selectedBorneId = null;
        this.notificationService.error('Erreur lors de la vérification de la borne');
      }
    });
  }

  /**
   * Confirmer le démarrage de la recharge
   */
  private confirmerDemarrage(borne: Borne, conducteurId: string): void {
    console.log(`📤 Envoi demande démarrage recharge - Borne ${borne.id}, Conducteur ${conducteurId}`);
    
    this.stationsService.demarrerRecharge(borne.id, conducteurId).subscribe({
      next: (session) => {
        console.log('✅ Session démarrée avec succès:', session);
        console.log(`🔑 Session ID: ${session.id}`);
        console.log(`📍 URL cible: /sessions/${session.id}`);
        
        this.loadingAction = false;
        this.selectedBorneId = null;
        
        // Mettre à jour l'état local
        borne.isOccupied = true;
        borne.sessionId = session.id;
        this.sessionActive = session;
        this.applyFilters();
        
        this.notificationService.success('Recharge démarrée avec succès !');
        
        console.log(`🚀 Navigation vers /sessions/${session.id}`);
        this.router.navigate(['/sessions', session.id]).then(success => {
          console.log(`📊 Résultat navigation: ${success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
          if (!success) {
            console.error('❌ Échec de navigation, tentative avec window.location');
            window.location.href = `/sessions/${session.id}`;
          }
        }).catch(err => {
          console.error('❌ Erreur de navigation:', err);
          window.location.href = `/sessions/${session.id}`;
        });
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur démarrage recharge:', err);
        console.error('📋 Détails erreur:', {
          status: err.status,
          message: err.message,
          error: err.error
        });
        
        this.loadingAction = false;
        this.selectedBorneId = null;
        
        let message = 'Erreur lors du démarrage de la recharge';
        if (err.status === 409) {
          message = 'Cette borne est déjà utilisée par un autre conducteur';
          this.rafraichirEtatBornes();
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
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Arrêter une recharge
   */
  arreterRecharge(borne: Borne): void {
    console.log(`🛑 Tentative arrêt recharge - Borne ${borne.id}`);
    
    if (!this.estSessionUtilisateur(borne)) {
      console.warn(`⚠️ Tentative d'arrêt d'une session qui n'appartient pas à l'utilisateur`);
      this.notificationService.warning('Vous ne pouvez pas arrêter cette recharge');
      return;
    }

    if (!borne.sessionId) {
      console.warn('⚠️ Aucun sessionId trouvé pour cette borne');
      this.notificationService.warning('Aucune session active sur cette borne');
      return;
    }

    if (!confirm('Voulez-vous vraiment arrêter cette recharge ?')) {
      console.log('❌ Arrêt annulé par l\'utilisateur');
      return;
    }

    this.loadingAction = true;
    this.selectedBorneId = borne.id;

    console.log(`📤 Envoi demande terminaison session ${borne.sessionId}`);
    this.stationsService.terminerRecharge(borne.sessionId).subscribe({
      next: (session) => {
        console.log('✅ Session terminée avec succès:', session);
        this.loadingAction = false;
        this.selectedBorneId = null;
        
        borne.isOccupied = false;
        borne.sessionId = undefined;
        this.sessionActive = null;
        this.applyFilters();
        
        this.notificationService.success('Recharge terminée avec succès !');
        this.cdr.detectChanges();
        
        console.log('🚀 Redirection vers /bornes');
        this.router.navigate(['/bornes']);
      },
      error: (err) => {
        console.error('❌ Erreur arrêt recharge:', err);
        this.loadingAction = false;
        this.selectedBorneId = null;
        this.notificationService.error('Erreur lors de l\'arrêt de la recharge');
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Voir les détails d'une session
   */
  voirSession(sessionId: number): void {
    console.log(`👁️ Voir session ${sessionId}`);
    console.log(`📍 Navigation vers /sessions/${sessionId}`);
    
    this.router.navigate(['/sessions', sessionId]).then(success => {
      console.log(`📊 Résultat navigation vers session: ${success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
      if (!success) {
        console.error('❌ Échec de navigation, fallback');
        window.location.href = `/sessions/${sessionId}`;
      }
    }).catch(err => {
      console.error('❌ Erreur navigation:', err);
      window.location.href = `/sessions/${sessionId}`;
    });
  }
  
  /**
   * Navigation vers les détails d'une borne
   */
  goToBorneDetail(id: number): void {
    console.log(`👁️ Voir détails borne ${id}`);
    this.router.navigate(['/borne', id]);
  }
  
  /**
   * Ouvrir dans Google Maps
   */
  openMaps(latitude: number, longitude: number): void {
    console.log(`🗺️ Ouvrir Maps: ${latitude}, ${longitude}`);
    if (latitude && longitude) {
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
    } else {
      console.warn('⚠️ Coordonnées manquantes');
    }
  }
  
  /**
   * Appliquer les filtres lors du changement
   */
  onFilterChange(): void {
    console.log('🔄 Changement de filtre détecté');
    this.applyFilters();
  }

  /**
   * Méthode pour tester la navigation
   */
  testNavigation(): void {
    console.log('🧪 Test de navigation vers session 999');
    this.router.navigate(['/sessions', 999]).then(success => {
      console.log(`🧪 Test navigation: ${success ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);
    });
  }
}
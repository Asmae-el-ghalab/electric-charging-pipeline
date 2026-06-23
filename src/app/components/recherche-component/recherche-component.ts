// recherche-component.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { timeout, retry, catchError } from 'rxjs/operators';
import { of, TimeoutError } from 'rxjs';


interface Borne {
  id: number;
  title?: string;
  address: string;
  city?: string;
  province?: string;
  latitude: number;
  longitude: number;
  status: 'Operational' | 'Maintenance' | 'OutOfService' | 'Planned';
  operator?: string;
  usageCost?: string;
  isOccupied?: boolean;
  power?: number;
}

interface PageResponse {
  content: Borne[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Component({
  selector: 'app-recherche-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recherche-component.html',
  styleUrls: ['./recherche-component.css']
})
export class RechercheComponent implements OnInit {
  bornes: Borne[] = [];
  filteredBornes: Borne[] = [];
  isLoading = true;
  loadingError = false;
  errorMessage = '';
  searchTerm = '';
  statusFilter = '';
  operationalCount = 0;
  
  // Pagination
  currentPage = 0;
  pageSize = 9;
  totalPages = 0;
  totalElements = 0;
  
  statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'Operational', label: '✅ Opérationnelle' },
    { value: 'Maintenance', label: '🔧 En maintenance' },
    { value: 'OutOfService', label: '❌ Hors service' },
    { value: 'Planned', label: '📅 Planifiée' }
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBornesFromServer();
  }
// Ajoutez cette méthode dans votre classe RechercheComponent
learnMore(): void {
  // Vous pouvez soit rediriger vers une page "à propos"
  this.router.navigate(['/a-propos']);
  
  // Ou ouvrir une modale/alert
  // alert('ChargeMap Maroc - La première plateforme dédiée aux bornes de recharge au Maroc');
}
  // Chargement uniquement depuis l'API
  private loadBornesFromServer(): void {
    console.log('🌐 Chargement depuis le serveur...');
    this.isLoading = true;
    this.loadingError = false;
    
    this.http.get<PageResponse>('http://localhost:8081/api/bornes?page=0&size=100')
      .pipe(
        timeout(10000),
        retry(2)
      )
      .subscribe({
        next: (response: PageResponse) => {
          console.log('✅ Données chargées avec succès', response);
          if (response && response.content) {
            this.bornes = response.content;
            this.filteredBornes = [...this.bornes];
            this.operationalCount = this.bornes.filter(b => b.status === 'Operational').length;
            this.totalElements = response.totalElements;
            this.totalPages = response.totalPages;
            this.updatePagination();
            this.isLoading = false;
            this.loadingError = false;
          }
        },
        error: (error: any) => {
          console.error('❌ Erreur chargement:', error);
          this.isLoading = false;
          this.loadingError = true;
          
          if (error instanceof TimeoutError) {
            this.errorMessage = '⏱️ Délai dépassé. Le serveur met trop de temps à répondre.';
          } else if (error.status === 0) {
            this.errorMessage = '❌ Serveur indisponible. Vérifiez que le backend est démarré sur http://localhost:8081';
          } else if (error.status === 404) {
            this.errorMessage = '❌ API non trouvée. Vérifiez l\'URL du backend.';
          } else if (error.status === 500) {
            this.errorMessage = '❌ Erreur serveur. Veuillez réessayer plus tard.';
          } else {
            this.errorMessage = `❌ Erreur: ${error.message || 'Connexion impossible'}`;
          }
        }
      });
  }

  retryConnection(): void {
    this.loadBornesFromServer();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredBornes.length / this.pageSize);
    this.currentPage = 0;
  }

  get paginatedBornes(): Borne[] {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredBornes.slice(start, end);
  }

  filterStations(): void {
    let filtered = [...this.bornes];
    
    if (this.statusFilter) {
      filtered = filtered.filter(b => b.status === this.statusFilter);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        (b.title?.toLowerCase().includes(term)) ||
        (b.city?.toLowerCase().includes(term)) ||
        (b.operator?.toLowerCase().includes(term)) ||
        (b.address?.toLowerCase().includes(term))
      );
    }
    
    this.filteredBornes = filtered;
    this.updatePagination();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterStations();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.filteredBornes = [...this.bornes];
    this.updatePagination();
  }

  // Pagination
  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  getPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Utilitaires
  getStatusClass(status: string): string {
    switch(status) {
      case 'Operational': return 'status-operational';
      case 'Maintenance': return 'status-maintenance';
      case 'OutOfService': return 'status-outofservice';
      default: return 'status-planned';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'Operational': return '✅ Opérationnelle';
      case 'Maintenance': return '🔧 En maintenance';
      case 'OutOfService': return '❌ Hors service';
      case 'Planned': return '📅 Planifiée';
      default: return 'Statut inconnu';
    }
  }

  getOperatorName(operator: string | undefined | null): string {
    if (!operator || operator === '(Unknown Operator)' || operator === 'NULL') {
      return 'Opérateur inconnu';
    }
    return operator;
  }

  getUsageCost(cost: string | undefined | null): string {
    if (!cost || cost === 'Non disponible' || cost === '0' || cost === 'Free') {
      return 'Gratuit';
    }
    return cost;
  }

  estDisponible(borne: Borne): boolean {
    return borne.status === 'Operational' && !borne.isOccupied;
  }

  goToBorneDetail(id: number): void {
    this.router.navigate(['/bornes', id]);
  }

  openMaps(latitude: number, longitude: number): void {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
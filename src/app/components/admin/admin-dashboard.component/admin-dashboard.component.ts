import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { BorneService } from '../../../../services/borne.service';
import { Borne } from '../../../models/borne.model';
import { FormsModule } from '@angular/forms';
import { Connection } from '../../../models/connection.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class AdminDashboardComponent implements OnInit {

  adminName: string = '';
  selectedCity: string = '';
  selectedStatus: string = '';
  selectedOperator: string = '';
  currentDate: Date = new Date();

  // 🔥 STATS RÉELLES (calculées)
  stats = {
    totalBornes: 0,
    disponibles: 0,
    maintenance: 0,
    horsService: 0
  };

  // 🔥 LISTE RÉELLE
  bornes: Borne[] = [];
  filteredBornes: Borne[] = [];

  searchText: string = '';

  cities: string[] = [];

  operators: string[] = [];

  // Pagination
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  paginatedBornes: Borne[] = [];

  // Connexions
  selectedBorne: Borne | null = null;
  connections: Connection[] = [];
  showConnectionsModal = false;
  showEditConnectionModal = false;
  editingConnection: any = {
    id: 0,
    connectionType: '',
    powerKw: 0,
    quantity: 0,
    voltage: 0,
    level: '',
    currentType: ''
  };
 showAddConnectionModal = false;

newConnection: any = {
  stationId: null,
  connectionType: '',
  powerKw: 0,
  quantity: 1,
  voltage: 0,
  amps: 0,
  level: '',
  currentType: ''
};
  // Formulaire Borne
  showForm = false;
  isEditMode = false; 
  savingBorne = false;
 newBorne: Borne = this.createEmptyBorne();
  createEmptyBorne(): Borne {
  return {
    id: undefined as any,
    uuid: '',
    title: '',
    address: '',
    city: '',
    province: '',
    postcode: '',
    latitude: 0,
    longitude: 0,
    operator: '',
    operatorWebsite: '',
    status: 'Operational',
    isOperational: true,
    usageCost: ''
  };
}
  constructor(
    private authService: AuthService,
    private borneService: BorneService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.checkAdminAccess();
    this.adminName = this.authService.getUserName();
    this.loadBornes();
  }

  checkAdminAccess(): void {
    if (!this.authService.isLoggedIn() || !this.authService.isAdmin()) {
      this.router.navigate(['/connexion']);
    }
  }

  // ==================== CHARGEMENT ====================
   loadBornes(): void {
  this.borneService.getBornes(0, 1000).subscribe({
    next: (res: any) => {
      const data = Array.isArray(res) ? res : (res.content || []);

      this.bornes = data;
      this.filteredBornes = [...this.bornes];

      this.cities = [...new Set(
        this.bornes
          .map(b => b.city)
          .filter(city => city)
      )];

      this.operators = [...new Set(
        this.bornes
          .map(b => b.operator)
          .filter(op => op)
      )];

      this.calculateStats();
      this.currentPage = 1;
      this.updatePagination();

      console.log('Bornes chargées:', this.bornes.length);
    },
    error: (err) => {
      console.error('Erreur chargement bornes', err);
    }
  });
} 
normalizeStatus(status: string | null | undefined): string {
  return (status || '')
    .toLowerCase()
    .replace(/_/g, '')
    .replace(/\s/g, '');
}

getStatusLabel(status: string | null | undefined): string {
  switch (this.normalizeStatus(status)) {
    case 'operational':
      return 'Opérationnelle';
    case 'maintenance':
      return 'En maintenance';
    case 'outofservice':
      return 'Hors service';
    default:
      return status || '-';
  }
}

getStatusClass(status: string | null | undefined): string {
  switch (this.normalizeStatus(status)) {
    case 'operational':
      return 'status-operational';
    case 'maintenance':
      return 'status-maintenance';
    case 'outofservice':
      return 'status-out';
    default:
      return '';
  }
}

  // ==================== STATISTIQUES ====================
  calculateStats(): void {
  this.stats.totalBornes = this.bornes.length;

  this.stats.disponibles = this.bornes.filter(
    b => this.normalizeStatus(b.status) === 'operational'
  ).length;

  this.stats.maintenance = this.bornes.filter(
    b => this.normalizeStatus(b.status) === 'maintenance'
  ).length;

  this.stats.horsService = this.bornes.filter(
    b => this.normalizeStatus(b.status) === 'outofservice'
  ).length;
}
  // ==================== PAGINATION ====================
 updatePagination(): void {
  this.totalPages = Math.max(
    1,
    Math.ceil(this.filteredBornes.length / this.pageSize)
  );

  if (this.currentPage > this.totalPages) {
    this.currentPage = this.totalPages;
  }

  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;

  this.paginatedBornes = this.filteredBornes.slice(start, end);
}

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // ==================== FILTRES ====================
  applyFilters(): void {
    this.filteredBornes = this.bornes.filter(borne => {
      const matchSearch =
        !this.searchText ||
        borne.title.toLowerCase().includes(this.searchText.toLowerCase());

      const matchCity =
        !this.selectedCity ||
        borne.city === this.selectedCity;

      const matchOperator =
        !this.selectedOperator ||
        borne.operator === this.selectedOperator;

      return matchSearch && matchCity && matchOperator;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  filterBornes(): void {
    this.borneService.filterBornes(
      this.selectedStatus,
      this.selectedCity,
      this.selectedOperator
    ).subscribe({
      next: (data) => {
        this.bornes = data;
        this.calculateStats();
        this.applyFilters();
      },
      error: (err) => console.error(err)
    });
  }

  // ==================== CRUD BORNES ====================
  deleteBorne(id: number): void {
    if (!confirm('Supprimer cette borne ?')) return;

    this.borneService.deleteBorne(id).subscribe({
      next: () => {
        this.bornes = this.bornes.filter(b => b.id !== id);
        this.calculateStats();
        this.filteredBornes = [...this.bornes];
        this.updatePagination();
      },
      error: (err) => console.error(err)
    });
  }
  openAddForm(): void {
  this.newBorne = this.createEmptyBorne();
  this.isEditMode = false;
  this.showForm = true;
}
  editBorne(borne: Borne): void {
    this.newBorne = { ...borne };
    this.showForm = true;
    this.isEditMode = true;
  }

   resetForm(): void {
  this.showForm = false;
  this.isEditMode = false;
  this.newBorne = this.createEmptyBorne();
}

   saveBorne(): void {
  if (this.savingBorne) return;

  this.savingBorne = true;

  const payload: any = {
    title: this.newBorne.title?.trim(),
    address: this.newBorne.address?.trim(),
    city: this.newBorne.city?.trim(),
    province: this.newBorne.province?.trim(),
    postcode: this.newBorne.postcode || '',
    latitude: Number(this.newBorne.latitude) || 0,
    longitude: Number(this.newBorne.longitude) || 0,
    operator: this.newBorne.operator?.trim(),
    operatorWebsite: this.newBorne.operatorWebsite || '',
    status: this.newBorne.status || 'Operational',
    isOperational: (this.newBorne.status || 'Operational') === 'Operational',
    usageCost: this.newBorne.usageCost || '',
    uuid: this.newBorne.uuid || crypto.randomUUID(),
    connectorType: (this.newBorne as any).connectorType || '',
    power: Number((this.newBorne as any).power) || 0,
    isOccupied: false
  };

  console.log('Payload borne envoyé:', JSON.stringify(payload));

  const request$ = this.isEditMode
    ? this.borneService.updateBorne(this.newBorne.id, payload)
    : this.borneService.addBorne(payload);

  request$
    .pipe(finalize(() => this.savingBorne = false))
    .subscribe({
      next: (saved) => {
        console.log('Borne enregistrée:', saved);
        this.loadBornes();
        this.resetForm();
      },
      error: (err) => {
        console.error('Erreur enregistrement borne', err);
        console.error('Erreur backend:', err.error);
        alert('Erreur ajout borne: ' + JSON.stringify(err.error));
      }
    });
}
  // ==================== CONNEXIONS ====================
  openConnections(borne: Borne): void {
    this.selectedBorne = borne;

    this.borneService.getConnectionsByBorne(borne.id)
      .subscribe({
        next: (data) => {
          this.connections = data;
          this.showConnectionsModal = true;
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  closeConnectionsModal(): void {
    this.showConnectionsModal = false;
    this.connections = [];
    this.selectedBorne = null;
  }

  // Ouvrir le formulaire d'édition
  openEditConnection(connection: Connection, event: Event): void {
    event.stopPropagation();
    this.editingConnection = {
      id: connection.id || 0,
      connectionType: connection.connectionType || '',
      powerKw: connection.powerKw || 0,
      quantity: connection.quantity || 0,
      voltage: connection.voltage || 0,
      amps: connection.amps || 0,
      level: connection.level || '',
      currentType: connection.currentType || ''
    };
    this.showEditConnectionModal = true;
  }

  // Fermer le formulaire d'édition
  closeEditConnectionModal(): void {
    this.showEditConnectionModal = false;
    this.editingConnection = {
      id: 0,
      connectionType: '',
      powerKw: 0,
      quantity: 0,
      voltage: 0,
      level: '',
      currentType: ''
    };
  }

  // Sauvegarder les modifications
  saveConnection(): void {
    if (this.editingConnection && this.editingConnection.id) {
      this.borneService.updateConnection(this.editingConnection.id, this.editingConnection)
        .subscribe({
          next: (updated) => {
            // Recharger la liste des connexions
            if (this.selectedBorne) {
              this.borneService.getConnectionsByBorne(this.selectedBorne.id)
                .subscribe({
                  next: (data) => {
                    this.connections = data;
                    this.closeEditConnectionModal();
                    alert('✅ Connexion modifiée avec succès !');
                  },
                  error: (err) => console.error('Erreur rechargement', err)
                });
            }
          },
          error: (err) => {
            console.error('Erreur modification', err);
            alert('❌ Erreur lors de la modification');
          }
        });
    }
  }

  // Supprimer une connexion
  deleteConnection(connectionId: number, event: Event): void {
    event.stopPropagation();

    if (confirm('Êtes-vous sûr de vouloir supprimer cette connexion ?')) {
      this.borneService.deleteConnection(connectionId)
        .subscribe({
          next: () => {
            // Recharger la liste
            if (this.selectedBorne) {
              this.borneService.getConnectionsByBorne(this.selectedBorne.id)
                .subscribe({
                  next: (data) => {
                    this.connections = data;
                    alert('✅ Connexion supprimée avec succès !');
                  },
                  error: (err) => console.error('Erreur rechargement', err)
                });
            }
          },
          error: (err) => {
            console.error('Erreur suppression', err);
            alert('❌ Erreur lors de la suppression');
          }
        });
    }
  }
  openAddConnection(): void {
  if (!this.selectedBorne) return;

  this.newConnection = {
    stationId: this.selectedBorne.id,
    connectionType: '',
    powerKw: 0,
    quantity: 1,
    voltage: 0,
    amps: 0,
    level: '',
    currentType: ''
  };

  this.showAddConnectionModal = true;
}

closeAddConnectionModal(): void {
  this.showAddConnectionModal = false;
}

saveNewConnection(): void {
  if (!this.selectedBorne) return;

  const payload = {
    ...this.newConnection,
    stationId: this.selectedBorne.id,
    powerKw: Number(this.newConnection.powerKw) || 0,
    quantity: Number(this.newConnection.quantity) || 1,
    voltage: Number(this.newConnection.voltage) || 0,
    amps: Number(this.newConnection.amps) || 0
  };

  this.borneService.addConnection(payload).subscribe({
    next: () => {
      this.borneService.getConnectionsByBorne(this.selectedBorne!.id).subscribe({
        next: (data) => {
          this.connections = data;
          this.closeAddConnectionModal();
        },
        error: (err) => console.error('Erreur rechargement connexions', err)
      });
    },
    error: (err) => {
      console.error('Erreur ajout connexion', err);
      console.error('Erreur backend:', err.error);
    }
  });
} 
    refreshBornes(): void {
  this.currentPage = 1;

  // Remplace loadBornes() par le nom de ta méthode
  // qui récupère les bornes depuis ton backend.
  this.loadBornes();
}
  // ==================== LOGOUT ====================
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/connexion']);
  }
}
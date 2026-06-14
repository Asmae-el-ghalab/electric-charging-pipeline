// src/app/components/conducteur/conducteur-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conducteur-dashboard',
  standalone: true,
  templateUrl: './conducteur-dashboard.component.html',
  styleUrls: ['./conducteur-dashboard.component.css'],
  imports: [CommonModule, RouterModule, FormsModule]
})
export class ConducteurDashboardComponent implements OnInit {
  conducteurName: string = '';
  conducteurVehicule: string = '';
  stats = {
    totalTrajets: 0,
    totalPassagers: 0,
    revenusMois: 0,
    evaluation: 0
  };

  trajets: any[] = [];
  reservations: any[] = [];
  showAddTrajet = false;
  
  newTrajet = {
    depart: '',
    destination: '',
    date: '',
    heure: '',
    prix: 0,
    placesDisponibles: 4
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkConducteurAccess();
    this.conducteurName = this.authService.getUserName();
    this.loadStats();
    this.loadTrajets();
    this.loadReservations();
  }

  checkConducteurAccess(): void {
    if (!this.authService.isLoggedIn() || !this.authService.isConducteur()) {
      this.router.navigate(['/login']);
    }
  }

  loadStats(): void {
    this.stats = {
      totalTrajets: 23,
      totalPassagers: 45,
      revenusMois: 1250,
      evaluation: 4.8
    };
  }

  loadTrajets(): void {
    this.trajets = [
      { 
        id: 1, 
        depart: 'Casablanca', 
        destination: 'Rabat', 
        date: '2024-01-20', 
        heure: '08:00',
        prix: 50,
        placesDisponibles: 3,
        statut: 'ACTIF'
      },
      {
        id: 2,
        depart: 'Rabat',
        destination: 'Tanger',
        date: '2024-01-21',
        heure: '14:00',
        prix: 120,
        placesDisponibles: 4,
        statut: 'ACTIF'
      }
    ];
  }

  loadReservations(): void {
    this.reservations = [
      {
        id: 1,
        passager: 'Marie Curie',
        depart: 'Casablanca',
        destination: 'Rabat',
        date: '2024-01-20',
        places: 2,
        montant: 100,
        statut: 'CONFIRMEE'
      }
    ];
  }

  ajouterTrajet(): void {
    console.log('Nouveau trajet:', this.newTrajet);
    // Appel API pour ajouter le trajet
    this.showAddTrajet = false;
    this.newTrajet = {
      depart: '',
      destination: '',
      date: '',
      heure: '',
      prix: 0,
      placesDisponibles: 4
    };
    this.loadTrajets();
  }

  annulerTrajet(id: number): void {
    if (confirm('Voulez-vous vraiment annuler ce trajet ?')) {
      console.log('Annulation du trajet:', id);
      // Appel API pour annuler
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
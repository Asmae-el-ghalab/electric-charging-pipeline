// src/app/components/admin/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, RouterModule]
})
export class AdminDashboardComponent implements OnInit {
  adminName: string = '';
    currentDate: Date = new Date(); 
  stats = {
    totalUsers: 0,
    totalConducteurs: 0,
    totalPassagers: 0,
    totalStations: 0,
    totalReservations: 0,
    revenusMois: 0
  };

  recentUsers: any[] = [];
  recentReservations: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.adminName = this.authService.getUserName();
    this.loadStats();
    this.loadRecentUsers();
    this.loadRecentReservations();
  }

  checkAdminAccess(): void {
    if (!this.authService.isLoggedIn() || !this.authService.isAdmin()) {
      this.router.navigate(['/login']);
    }
  }

  loadStats(): void {
    // Appeler votre API pour charger les statistiques
    this.stats = {
      totalUsers: 150,
      totalConducteurs: 45,
      totalPassagers: 105,
      totalStations: 12,
      totalReservations: 342,
      revenusMois: 12500
    };
  }

  loadRecentUsers(): void {
    // Appeler votre API pour les utilisateurs récents
    this.recentUsers = [
      { id: 1, nom: 'Jean Dupont', email: 'jean@email.com', role: 'CONDUCTEUR', date: '2024-01-15' },
      { id: 2, nom: 'Marie Curie', email: 'marie@email.com', role: 'PASSAGER', date: '2024-01-14' },
      { id: 3, nom: 'Paul Martin', email: 'paul@email.com', role: 'CONDUCTEUR', date: '2024-01-13' }
    ];
  }

  loadRecentReservations(): void {
    // Appeler votre API pour les réservations récentes
    this.recentReservations = [
      { id: 1, user: 'Jean Dupont', station: 'Station Centre', date: '2024-01-15', montant: 45.00 },
      { id: 2, user: 'Marie Curie', station: 'Station Nord', date: '2024-01-14', montant: 32.50 }
    ];
  }

  logout(): void {
    this.authService.logout();
  }
}
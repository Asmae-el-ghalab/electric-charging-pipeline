import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../../../services/utilisateur.service';
import { AuthService } from '../../../../services/auth.service'; // ✅ AJOUT
import { Utilisateur } from '../../../models/utilisateur.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-utilisateurs.component.html',
  styleUrls: ['./admin-utilisateurs.component.css']
})
export class AdminUtilisateursComponent implements OnInit {
  utilisateurs: Utilisateur[] = [];
  filteredUtilisateurs: Utilisateur[] = [];
  selectedUtilisateur: Utilisateur | null = null;
  loading = false;
  searchTerm = '';
  filterRole = 'Tous les rôles';
  filterStatus = 'Tous les statuts';

  stats = {
    total: 0,
    actifs: 0,
    bloques: 0,
    admins: 0,
    conducteurs: 0
  };

  constructor(
    private utilisateurService: UtilisateurService,
    private authService: AuthService // ✅ AJOUT
  ) {}

  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  loadUtilisateurs(): void {
    this.loading = true;
    this.utilisateurService.getUtilisateurs().subscribe({
      next: (data) => {
        this.utilisateurs = data;
        this.filteredUtilisateurs = data;
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs', err);
        this.loading = false;
        this.showNotification('❌ Erreur lors du chargement des utilisateurs', 'error');
      }
    });
  }

  calculateStats(): void {
    this.stats.total = this.utilisateurs.length;
    this.stats.actifs = this.utilisateurs.filter(u => !u.estBloque).length;
    this.stats.bloques = this.utilisateurs.filter(u => u.estBloque).length;
    this.stats.admins = this.utilisateurs.filter(u => u.role === 'ADMIN').length;
    this.stats.conducteurs = this.utilisateurs.filter(u => u.role === 'CONDUCTEUR').length;
  }

  applyFilters(): void {
    this.filteredUtilisateurs = this.utilisateurs.filter(user => {
      const matchesSearch = !this.searchTerm ||
        user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = this.filterRole === 'Tous les rôles' ||
        user.role === this.filterRole;

      const matchesStatus = this.filterStatus === 'Tous les statuts' ||
        (this.filterStatus === 'Actif' && !user.estBloque) ||
        (this.filterStatus === 'Bloqué' && user.estBloque) ||
        (this.filterStatus === 'Inactif' && this.isInactif(user));

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  isInactif(user: Utilisateur): boolean {
    const lastConnexion = new Date(user.derniereConnexion);
    const daysSince = (Date.now() - lastConnexion.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince > 30 && !user.estBloque;
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onFilterRole(event: Event): void {
    this.filterRole = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onFilterStatus(event: Event): void {
    this.filterStatus = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  selectUtilisateur(user: Utilisateur): void {
    this.selectedUtilisateur = user;
  }

  clearSelection(): void {
    this.selectedUtilisateur = null;
  }

  // ==================== ✅ TOGGLE BLOQUER MODIFIÉ AVEC AUTH SERVICE ====================
  toggleBloquer(user: Utilisateur): void {
    if (user.estBloque) {
      // ✅ Débloquer - Utilise la nouvelle méthode
      this.utilisateurService.debloquerUtilisateur(user.id).subscribe({
        next: (updated) => {
          user.estBloque = false;
          this.calculateStats();
          if (this.selectedUtilisateur?.id === user.id) {
            this.selectedUtilisateur = updated;
          }
          // ✅ Mettre à jour le statut dans AuthService si c'est l'utilisateur connecté
          this.authService.updateBlockedStatus(false);
          this.showNotification('✅ Utilisateur débloqué avec succès !', 'success');
        },
        error: (err) => {
          console.error('Erreur déblocage', err);
          this.showNotification('❌ Erreur lors du déblocage', 'error');
        }
      });
    } else {
      // ✅ Bloquer - Utilise la nouvelle méthode
      if (confirm(`Êtes-vous sûr de vouloir bloquer ${user.nom} ?`)) {
        this.utilisateurService.bloquerUtilisateur(user.id).subscribe({
          next: (updated) => {
            user.estBloque = true;
            this.calculateStats();
            if (this.selectedUtilisateur?.id === user.id) {
              this.selectedUtilisateur = updated;
            }
            // ✅ Mettre à jour le statut dans AuthService si c'est l'utilisateur connecté
            this.authService.updateBlockedStatus(true);
            this.showNotification('✅ Utilisateur bloqué avec succès !', 'success');
          },
          error: (err) => {
            console.error('Erreur blocage', err);
            this.showNotification('❌ Erreur lors du blocage', 'error');
          }
        });
      }
    }
  }

  supprimerUtilisateur(user: Utilisateur): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement ${user.nom} ?`)) {
      this.utilisateurService.supprimerUtilisateur(user.id).subscribe({
        next: () => {
          this.utilisateurs = this.utilisateurs.filter(u => u.id !== user.id);
          this.applyFilters();
          this.calculateStats();
          if (this.selectedUtilisateur?.id === user.id) {
            this.clearSelection();
          }
          this.showNotification('✅ Utilisateur supprimé avec succès !', 'success');
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          this.showNotification('❌ Erreur lors de la suppression', 'error');
        }
      });
    }
  }

  promouvoirAdmin(user: Utilisateur): void {
    if (confirm(`Promouvoir ${user.nom} en administrateur ?`)) {
      this.utilisateurService.promouvoirAdmin(user.id).subscribe({
        next: (updated) => {
          user.role = 'ADMIN';
          this.calculateStats();
          if (this.selectedUtilisateur?.id === user.id) {
            this.selectedUtilisateur = updated;
          }
          this.showNotification('✅ Utilisateur promu administrateur !', 'success');
        },
        error: (err) => {
          console.error('Erreur promotion', err);
          this.showNotification('❌ Erreur lors de la promotion', 'error');
        }
      });
    }
  }

  retrograderAdmin(user: Utilisateur): void {
    if (confirm(`Rétrograder ${user.nom} de administrateur ?`)) {
      this.utilisateurService.retrograderAdmin(user.id).subscribe({
        next: (updated) => {
          user.role = 'CONDUCTEUR';
          this.calculateStats();
          if (this.selectedUtilisateur?.id === user.id) {
            this.selectedUtilisateur = updated;
          }
          this.showNotification('✅ Utilisateur rétrogradé avec succès !', 'success');
        },
        error: (err) => {
          console.error('Erreur rétrogradation', err);
          this.showNotification('❌ Erreur lors de la rétrogradation', 'error');
        }
      });
    }
  }

  // ==================== ✅ NOTIFICATION STYLISÉE ====================
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    const colors = {
      success: '#22c55e',
      error: '#ef4444',
      info: '#3b82f6'
    };

    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      background: ${colors[type]};
      max-width: 400px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ==================== UTILITAIRES ====================
  getRoleClass(role: string): string {
    const classes: { [key: string]: string } = {
      'ADMIN': 'r-admin',
      'CONDUCTEUR': 'r-user',
      'VISITEUR': 'r-visitor'
    };
    return classes[role] || '';
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'ADMIN': 'Administrateur',
      'CONDUCTEUR': 'Conducteur',
      'VISITEUR': 'Visiteur'
    };
    return labels[role] || role;
  }

  getStatusClass(user: Utilisateur): string {
    if (user.estBloque) return 's-blocked';
    if (this.isInactif(user)) return 's-inactive';
    return 's-active';
  }

  getStatusLabel(user: Utilisateur): string {
    if (user.estBloque) return 'Bloqué';
    if (this.isInactif(user)) return 'Inactif';
    return 'Actif';
  }

  getStatusIcon(user: Utilisateur): string {
    if (user.estBloque) return '🔒';
    if (this.isInactif(user)) return '💤';
    return '🟢';
  }

  getInitials(nom: string): string {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getAvatarColor(nom: string): string {
    const colors = [
      '#E1F5EE', '#E6F1FB', '#EEEDFE', '#FAEEDA', '#FCEBEB', '#F1EFE8'
    ];
    let hash = 0;
    for (let i = 0; i < nom.length; i++) {
      hash = nom.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  getAvatarTextColor(nom: string): string {
    const colors = [
      '#085041', '#0C447C', '#3C3489', '#633806', '#791F1F', '#5F5E5A'
    ];
    let hash = 0;
    for (let i = 0; i < nom.length; i++) {
      hash = nom.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  formatDate(date: Date): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatDateFull(date: Date): string {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
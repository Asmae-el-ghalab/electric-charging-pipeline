import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface Borne {
  id: number;
  title: string;
  address: string;
  city: string;
  operator: string;
  status: string;
  isOperational: boolean;
  latitude: number;
  longitude: number;
  usageCost?: string;
  disponibiliteTempsReel?: string;
  derniereMajDisponibilite?: string;
  sourceData?: string;
}

@Component({
  selector: 'app-recherche-component',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
<div class="app-container">

  <section class="search-section">
    <div class="search-box">
      <h2 class="search-title">🔍 Trouver une borne de recharge</h2>
      <div class="search-form">
        <input type="text" class="search-input" placeholder="📍 Ville" [(ngModel)]="searchCity">
        <button class="search-btn" (click)="searchStations()">Rechercher</button>
        <button class="reset-btn" (click)="resetFilters()">Réinitialiser</button>
      </div>
    </div>
  </section>

  <div *ngIf="isLoading" class="loading">⏳ Chargement...</div>
  <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>

  <p *ngIf="!isLoading" class="result-count">{{ filteredBornes.length }} borne(s) trouvée(s)</p>

  <div class="stations-grid">
    <div *ngFor="let borne of filteredBornes" class="station-card">
      <h3>{{ borne.title }}</h3>
      <p class="city">📍 {{ borne.city }}</p>
      <p class="operator">🏢 {{ borne.operator }}</p>
      <p class="cost">💰 {{ borne.usageCost }}</p>

      <span [ngClass]="{
        'badge-disponible': borne.disponibiliteTempsReel === 'Disponible',
        'badge-occupe': borne.disponibiliteTempsReel === 'Occupé',
        'badge-hors': borne.disponibiliteTempsReel === 'Hors service',
        'badge-inconnu': borne.disponibiliteTempsReel === 'Inconnu'
      }">
        {{ borne.disponibiliteTempsReel || 'Inconnu' }}
      </span>

      <p class="maj">🕒 Mis à jour : {{ borne.derniereMajDisponibilite | date:'dd/MM/yyyy HH:mm' }}</p>

      <button class="detail-btn" (click)="showBorneDetails(borne)">Voir détails</button>
    </div>
  </div>

</div>`,
  styles: [`
    .app-container { padding: 20px; font-family: Arial, sans-serif; }
    .search-box { background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
    .search-title { margin-bottom: 12px; color: #333; }
    .search-form { display: flex; gap: 10px; flex-wrap: wrap; }
    .search-input { padding: 10px; border: 1px solid #ccc; border-radius: 8px; flex: 1; min-width: 200px; }
    .search-btn { padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer; }
    .reset-btn { padding: 10px 20px; background: #9E9E9E; color: white; border: none; border-radius: 8px; cursor: pointer; }
    .result-count { color: #666; margin-bottom: 10px; }
    .loading { text-align: center; padding: 20px; font-size: 18px; }
    .error { color: red; padding: 10px; }
    .stations-grid { display: flex; gap: 16px; flex-wrap: wrap; }
    .station-card { border: 1px solid #ddd; padding: 16px; border-radius: 12px; width: 280px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
    .station-card h3 { margin: 0 0 8px 0; font-size: 15px; color: #222; }
    .city, .operator, .cost, .maj { margin: 4px 0; font-size: 13px; color: #555; }
    .badge-disponible { background: #4CAF50; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; display: inline-block; margin: 8px 0; }
    .badge-occupe { background: #FF9800; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; display: inline-block; margin: 8px 0; }
    .badge-hors { background: #F44336; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; display: inline-block; margin: 8px 0; }
    .badge-inconnu { background: #9E9E9E; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; display: inline-block; margin: 8px 0; }
    .detail-btn { margin-top: 10px; padding: 8px 16px; background: #3F51B5; color: white; border: none; border-radius: 8px; cursor: pointer; width: 100%; }
  `]
})
export class RechercheComponent implements OnInit {
  bornes: Borne[] = [];
  filteredBornes: Borne[] = [];
  isLoading = false;
  errorMessage = '';
  searchCity = '';

  private apiUrl = 'http://localhost:8080/api/bornes';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBornes();
  }

  loadBornes(): void {
    this.isLoading = true;
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        this.bornes = data.content;
        this.filteredBornes = data.content;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de contacter le backend Spring Boot sur http://localhost:8080';
        this.isLoading = false;
      }
    });
  }

  searchStations(): void {
    if (!this.searchCity.trim()) {
      this.filteredBornes = this.bornes;
      return;
    }
    this.filteredBornes = this.bornes.filter(b =>
      b.city?.toLowerCase().includes(this.searchCity.toLowerCase())
    );
  }

  resetFilters(): void {
    this.searchCity = '';
    this.filteredBornes = this.bornes;
  }

  showBorneDetails(borne: Borne): void {
    alert(`📍 ${borne.title}\nVille : ${borne.city}\nAdresse : ${borne.address}\nOpérateur : ${borne.operator}\nStatut : ${borne.status}\nDisponibilité : ${borne.disponibiliteTempsReel}\nCoût : ${borne.usageCost}`);
  }
}
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

interface Signalement {
  id: number;
  conducteurId: number;
  borneId: number;
  type: string;
  description: string;
  statut: string;
  dateSignalement: string;
}

@Component({
  selector: 'app-admin-signalements',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './admin-signalements.component.html',
  styleUrls: ['./admin-signalements.component.css']
})
export class AdminSignalementsComponent implements OnInit {

  signalements: Signalement[] = [];
  loading = false;

  private apiUrl = 'http://localhost:8081/api/signalements';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSignalements();
  }

  loadSignalements(): void {
    this.loading = true;

    this.http.get<Signalement[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.signalements = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement signalements', err);
        this.loading = false;
      }
    });
  }

  updateStatut(id: number, statut: string): void {
    this.http.put(`${this.apiUrl}/${id}/traiter?statut=${statut}`, {})
      .subscribe({
        next: () => this.loadSignalements(),
        error: (err) => console.error(err)
      });
  } 
  get enAttente(): Signalement[] {
  return this.signalements.filter(s => s.statut === 'EN_ATTENTE');
}

get enCours(): Signalement[] {
  return this.signalements.filter(s => s.statut === 'EN_COURS');
}

get resolus(): Signalement[] {
  return this.signalements.filter(s => s.statut === 'RESOLU');
}

get rejetes(): Signalement[] {
  return this.signalements.filter(s => s.statut === 'REJETE');
}

getStatutLabel(statut: string): string {
  switch (statut) {
    case 'EN_ATTENTE':
      return 'En attente';
    case 'EN_COURS':
      return 'En cours';
    case 'RESOLU':
      return 'Résolu';
    case 'REJETE':
      return 'Rejeté';
    default:
      return statut;
  }
}

getTypeIcon(type: string): string {
  const value = type?.toLowerCase() || '';

  if (value.includes('hors') || value.includes('service')) return '🔌';
  if (value.includes('adresse') || value.includes('localisation')) return '📍';
  if (value.includes('prise')) return '⚡';
  if (value.includes('prix')) return '💰';

  return '⚠️';
} 

}
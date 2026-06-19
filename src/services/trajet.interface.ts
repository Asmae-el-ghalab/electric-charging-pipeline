// src/app/interfaces/trajet.interface.ts
export interface Trajet {
  id: number;
  conducteurId: number;
  borneId: number;
  borneNom?: string;
  dateDebut: string;
  dateFin?: string;
  dureeMinutes?: number;
  consommationKwh?: number;
  coutTotal?: number;
  distanceKm?: number;
  status: 'TERMINE' | 'ANNULE' | 'EN_COURS';
  villeDepart?: string;
  villeArrivee?: string;
  vehicule?: string;
  
}
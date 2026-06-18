import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConducteurService {
  private apiUrl = 'http://localhost:8081/api/conducteur';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getProfil(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/profil/${id}`, { headers: this.getHeaders() });
  }

  updateProfil(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profil/${id}`, data, { headers: this.getHeaders() });
  }

  getMesStatistiques(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistiques/${id}`, { headers: this.getHeaders() });
  }

  getMesTrajets(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trajets/${id}`, { headers: this.getHeaders() });
  }

  getTrajetDetail(conducteurId: number, trajetId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/trajets/${conducteurId}/${trajetId}`, { headers: this.getHeaders() });
  }

  getMesVehicules(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vehicules/${id}`, { headers: this.getHeaders() });
  }

  addVehicule(conducteurId: number, vehicule: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/vehicules/${conducteurId}`, vehicule, { headers: this.getHeaders() });
  }

  deleteVehicule(vehiculeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vehicules/${vehiculeId}`, { headers: this.getHeaders() });
  }

  getMesNotifications(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications/${id}`, { headers: this.getHeaders() });
  }

  marquerNotificationLue(notificationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/${notificationId}/lire`, {}, { headers: this.getHeaders() });
  }
}
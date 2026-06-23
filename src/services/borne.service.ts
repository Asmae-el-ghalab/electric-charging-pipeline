import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Borne } from '../app/models/borne.model';
import { Connection } from '../app/models/connection.model';

@Injectable({
  providedIn: 'root'
})
export class BorneService {

 private apiUrl = 'http://localhost:8081/api/bornes';

  constructor(private http: HttpClient) {}

  // Liste paginée
  getBornes(page: number = 0, size: number = 20): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}?page=${page}&size=${size}`
    );
  }

  // Une borne
  getBorneById(id: number): Observable<Borne> {
    return this.http.get<Borne>(
      `${this.apiUrl}/${id}`
    );
  }

  // Ajouter
  addBorne(borne: Borne): Observable<Borne> {
    return this.http.post<Borne>(
      this.apiUrl,
      borne
    );
  }

  // Modifier uniquement le statut
  updateStatus(id: number, status: string): Observable<Borne> {
    return this.http.put<Borne>(
      `${this.apiUrl}/${id}/status?status=${status}`,
      {}
    );
  }

  // Supprimer
  deleteBorne(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  // Filtre
  filterBornes(
    status?: string,
    city?: string,
    operator?: string
  ): Observable<Borne[]> {

    let url = `${this.apiUrl}/filter?`;

    if (status) {
      url += `status=${status}&`;
    }

    if (city) {
      url += `city=${city}&`;
    }

    if (operator) {
      url += `operator=${operator}`;
    }

    return this.http.get<Borne[]>(url);

  }
 updateBorne(id: number, borne: Borne): Observable<Borne> {
  return this.http.put<Borne>(
    `${this.apiUrl}/${id}`,
    borne
  );
}
getConnectionsByBorne(id: number): Observable<Connection[]> {

  return this.http.get<Connection[]>(
    `http://localhost:8081/api/connections/station/${id}`
  );

}
// Modifier une connexion - AVEC LOGS
updateConnection(id: number, connection: any): Observable<any> {
  const url = `http://localhost:8081/api/connections/${id}`;
  console.log('🔵 updateConnection appelé');
  console.log('📍 URL:', url);
  console.log('📤 Données envoyées:', connection);
  return this.http.put(url, connection);
}

// Supprimer une connexion - AVEC LOGS
deleteConnection(id: number): Observable<void> {
  const url = `http://localhost:8081/api/connections/${id}`;
  console.log('🔴 deleteConnection appelé');
  console.log('📍 URL:', url);
  return this.http.delete<void>(url);
}
}
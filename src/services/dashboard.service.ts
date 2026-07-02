import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private api = 'http://localhost:8081/api';

  getDashboardData() {
    return forkJoin({

      users: this.http.get<any>(`${this.api}/utilisateurs/stats`),

      bornes: this.http.get<any>(`${this.api}/bornes/stats`),

      signalements: this.http.get<any[]>(`${this.api}/signalements`)

    });

  }

}
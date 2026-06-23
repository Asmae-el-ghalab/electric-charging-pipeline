import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-statistics.component.html',
})
export class AdminStatisticsComponent {

  totalUsers = 0;
  totalSignalements = 0;
  totalBornes = 0;

  constructor(private http: HttpClient) {
    this.loadStats();
  }

  loadStats() {
    // USERS
    this.http.get<any[]>('http://localhost:8081/api/utilisateurs')
      .subscribe(res => this.totalUsers = res.length);

    // SIGNALEMENTS
    this.http.get<any[]>('http://localhost:8081/api/signalements')
      .subscribe(res => this.totalSignalements = res.length);

    // BORNES
    this.http.get<any[]>('http://localhost:8081/api/bornes')
      .subscribe(res => this.totalBornes = res.length);
  }
}

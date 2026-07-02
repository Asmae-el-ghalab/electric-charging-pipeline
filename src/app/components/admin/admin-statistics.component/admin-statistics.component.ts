import {
  Component,
  AfterViewInit,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';
import { HttpClient } from '@angular/common/http';

import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Legend,
  Tooltip
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Legend,
  Tooltip
);

@Component({
  selector: 'app-admin-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-statistics.component.html',
  styleUrls: ['./admin-statistics.component.css']
})
export class AdminStatisticsComponent implements OnInit, AfterViewInit {

  api = 'http://localhost:8081/api';

  // ==========================
  // CARDS
  // ==========================

  totalUsers = 0;
  totalBornes = 0;
  totalSignalements = 0;
  totalDisponibles = 0;

  admins = 0;
  conducteurs = 0;
  bloques = 0;

  // ==========================
  // SIGNAL
  // ==========================

  enAttente = 0;
  resolus = 0;
  rejetes = 0;

  maintenance = 0;
  occupied = 0;
  outService = 0;

  // ==========================
  // TABLES
  // ==========================

  derniersUtilisateurs: any[] = [];
  derniersSignalements: any[] = [];
@ViewChild('signalementChart')
signalementChart!: ElementRef<HTMLCanvasElement>;

@ViewChild('bornesChart')
bornesChart!: ElementRef<HTMLCanvasElement>;

private signalChart?: Chart;
private borneChart?: Chart;
  constructor(
  private http: HttpClient,
  @Inject(PLATFORM_ID)
  private platformId: Object
) {}

  ngOnInit(): void {

    this.loadUsers();

    this.loadBornes();

    this.loadSignalements();

  }

  ngAfterViewInit(): void {

 

}

  //===================================================

  loadUsers() {

    this.http
      .get<any>(`${this.api}/utilisateurs/stats`)
      .subscribe(stats => {

        this.totalUsers = stats.total;
        this.admins = stats.admins;
        this.conducteurs = stats.conducteurs;
        this.bloques = stats.bloques;

      });

    this.http
      .get<any[]>(`${this.api}/utilisateurs`)
      .subscribe(users => {

        this.derniersUtilisateurs = users
          .sort((a, b) => b.id - a.id)
          .slice(0, 5);

      });

  }

  //===================================================

  loadBornes() {

    this.http
      .get<any>(`${this.api}/bornes/stats`)
      .subscribe(stats=>{

   this.totalBornes=stats.total;
   this.totalDisponibles=stats.available;
   this.maintenance=stats.maintenance;
   this.occupied=stats.occupied;
   this.outService=stats.outOfService;

   if(isPlatformBrowser(this.platformId)){
      this.createBornesChart();
   }

});

  }

  //===================================================

  loadSignalements() {

    this.http
      .get<any[]>(`${this.api}/signalements`)
      .subscribe(data => {

    this.totalSignalements = data.length;

    this.derniersSignalements = data
      .sort((a,b)=>b.id-a.id)
      .slice(0,5);

    this.enAttente =
      data.filter(x=>x.statut=="EN_ATTENTE").length;

    this.resolus =
      data.filter(x=>x.statut=="RESOLU").length;

    this.rejetes =
      data.filter(x=>x.statut=="REJETE").length;

    if(isPlatformBrowser(this.platformId)){
        this.createSignalementChart();
    }

});

  }

  //===================================================

  createSignalementChart() {

    if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  if (!this.signalementChart) {
    return;
  }

  if (this.signalChart) {
    this.signalChart.destroy();
  }

  const canvas = this.signalementChart.nativeElement;
  console.log(
  this.enAttente,
  this.resolus,
  this.rejetes
); 
  console.log(
  'Signalements :',
  this.enAttente,
  this.resolus,
  this.rejetes
);
   this.signalChart = new Chart(canvas,{

      type: 'bar',

      data: {

        labels: ['En attente', 'Résolus', 'Rejetés'],

        datasets: [

          {

            label: 'Signalements',

            data: [

              this.enAttente,

              this.resolus,

              this.rejetes

            ],

            backgroundColor: [

             '#f59e0b',
  '#00ACC1',
  '#ef4444'

            ],

            borderRadius: 8

          }

        ]

      },

      options: {

        responsive: true,

        plugins: {

          legend: {

            display: false

          }

        }

      }

    });

  }

  //===================================================

  createBornesChart() {

    if (!isPlatformBrowser(this.platformId)) {
  return;
}

if (!this.bornesChart) {
  return;
}

if (this.borneChart) {
  this.borneChart.destroy();
}

const canvas = this.bornesChart.nativeElement;

    if (!canvas) return; 
    console.log(
  'Bornes :',
  this.totalDisponibles,
  this.occupied,
  this.maintenance,
  this.outService
);

 this.borneChart = new Chart(canvas,{

      type: 'doughnut',

      data: {
         labels: ['Disponibles', 'Occupées', 'Maintenance', 'HS'],

        datasets: [

          {

            data: [

              this.totalDisponibles,

              this.occupied,

              this.maintenance,

              this.outService

            ],

            backgroundColor: [

                '#00ACC1',
  '#007C91',
  '#f59e0b',
  '#ef4444'

            ], 
            borderColor: '#ffffff',
borderWidth: 3

          }

        ]

      },

      options: {

        responsive: true

      }

    });

  }

}
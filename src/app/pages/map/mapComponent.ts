import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { timeout, catchError, retry } from 'rxjs/operators';
import { of, TimeoutError } from 'rxjs';
import { NavbarComponent } from '../../components/navbar/navbarComponent';
import { RouterModule } from '@angular/router';
declare var L: any;

interface Borne {
  id: number;
  title?: string;
  address: string;
  city?: string;
  province?: string;
  latitude: number;
  longitude: number;
  status: 'Operational' | 'Maintenance' | 'OutOfService' | 'Planned';
  operator?: string;
  usageCost?: string;
  isOccupied?: boolean;
  power?: number;
}

interface PageResponse {
  content: Borne[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,NavbarComponent], // ✅ Ajouter RouterModule ici
  templateUrl: './mapComponent.html',
  styleUrl: './mapComponent.css'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: any;
  private markers: any[] = [];
  private userMarker: any;
  private mapInitialized = false;
  
  bornes: Borne[] = [];
  filteredBornes: Borne[] = [];
  loading = true;
  loadingError = false;
  errorMessage = '';
  searchTerm = '';
  statusFilter = '';
  operationalCount = 0;
  userPosition: { lat: number; lng: number } | null = null;
  showScrollTop = false;
  retryCount = 0;
  maxRetries = 2;
  loadingProgress = 0;
  
  statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'Operational', label: '✅ Opérationnelle' },
    { value: 'Maintenance', label: '🔧 En maintenance' },
    { value: 'OutOfService', label: '❌ Hors service' },
    { value: 'Planned', label: '📅 Planifiée' }
  ];
  isScrolled = false;  // ✅ Ajouter cette propriété
  menuOpen = false;    // ✅ Ajouter pour le menu mobile
  
  // ... reste du code ...
  
  // ✅ Ajouter la méthode pour le menu mobile
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  
  // ✅ Ajouter la méthode pour gérer le scroll
 
 
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Charger directement les données de démo pour un affichage immédiat
    this.loadDemoData();
    // Puis tenter de charger les vraies données en arrière-plan
    this.loadBornesFromServer();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initMap();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.map && isPlatformBrowser(this.platformId)) {
      this.map.remove();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.showScrollTop = window.scrollY > 300;
    }
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  private initMap(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      setTimeout(() => this.initMap(), 500);
      return;
    }
    
    if (this.mapInitialized) return;
    
    import('leaflet').then(module => {
      const L = module.default;
      
      // Fix des icônes Leaflet
      const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
      const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
      const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
      const iconDefault = L.icon({
        iconRetinaUrl, iconUrl, shadowUrl,
        iconSize: [25, 41], iconAnchor: [12, 41],
        popupAnchor: [1, -34], tooltipAnchor: [16, -28], shadowSize: [41, 41]
      });
      L.Marker.prototype.options.icon = iconDefault;
      
      this.map = L.map('map').setView([31.7917, -7.0926], 6);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & CartoDB',
        subdomains: 'abcd',
        maxZoom: 19,
        minZoom: 3
      }).addTo(this.map);
      
      this.mapInitialized = true;
      console.log('✅ Carte initialisée');
      
      if (this.filteredBornes.length > 0) {
        setTimeout(() => this.addMarkers(), 100);
      }
    }).catch(err => console.error('Erreur chargement Leaflet:', err));
  }

  // Chargement des données de démonstration (affichage immédiat)
  private loadDemoData(): void {
    console.log('📦 Chargement des données de démonstration (affichage immédiat)');
    
    this.bornes = [
      { id: 1, title: 'Borne Casablanca', address: 'Boulevard Mohammed V', city: 'Casablanca', province: 'Casablanca-Settat', latitude: 33.5731, longitude: -7.5898, status: 'Operational', operator: 'Fastvolt', usageCost: 'Gratuit', isOccupied: false, power: 50 },
      { id: 2, title: 'Borne Rabat', address: 'Avenue Mohammed VI', city: 'Rabat', province: 'Rabat-Salé-Kénitra', latitude: 34.0209, longitude: -6.8416, status: 'Operational', operator: 'Kilowatt', usageCost: 'Gratuit', isOccupied: true, power: 150 },
      { id: 3, title: 'Borne Marrakech', address: 'Zone industrielle', city: 'Marrakech', province: 'Marrakech-Safi', latitude: 31.6295, longitude: -7.9811, status: 'Maintenance', operator: 'TotalEnergies', usageCost: '2€/h', isOccupied: false, power: 22 },
      { id: 4, title: 'Borne Tanger', address: 'Route de Tétouan', city: 'Tanger', province: 'Tanger-Tétouan-Al Hoceïma', latitude: 35.7595, longitude: -5.8340, status: 'Operational', operator: 'Afriquia', usageCost: 'Gratuit', isOccupied: false, power: 100 },
      { id: 5, title: 'Borne Fès', address: 'Avenue des FAR', city: 'Fès', province: 'Fès-Meknès', latitude: 34.0181, longitude: -5.0078, status: 'OutOfService', operator: 'Fastvolt', usageCost: 'Gratuit', isOccupied: false, power: 50 },
      { id: 6, title: 'Borne Agadir', address: 'Boulevard du 20 Août', city: 'Agadir', province: 'Souss-Massa', latitude: 30.4278, longitude: -9.5981, status: 'Operational', operator: 'Afriquia', usageCost: 'Gratuit', isOccupied: false, power: 75 },
      { id: 7, title: 'Borne Meknès', address: 'Route de Fès', city: 'Meknès', province: 'Fès-Meknès', latitude: 33.8935, longitude: -5.5547, status: 'Operational', operator: 'Kilowatt', usageCost: 'Gratuit', isOccupied: false, power: 50 },
      { id: 8, title: 'Borne Oujda', address: 'Boulevard Mohammed VI', city: 'Oujda', province: 'Oriental', latitude: 34.6869, longitude: -1.9114, status: 'Operational', operator: 'Fastvolt', usageCost: 'Gratuit', isOccupied: false, power: 100 }
    ];
    
    this.filteredBornes = [...this.bornes];
    this.operationalCount = this.bornes.filter(b => b.status === 'Operational').length;
    this.loading = false;
    this.cdr.detectChanges();
    
    if (this.mapInitialized) {
      setTimeout(() => this.addMarkers(), 100);
    }
  }

  // Chargement depuis le serveur en arrière-plan
  private loadBornesFromServer(): void {
    console.log('🌐 Tentative de chargement depuis le serveur...');
    
    this.http.get<PageResponse>('http://localhost:8081/api/bornes?page=0&size=100')
      .pipe(
        timeout(5000), // Timeout après 5 secondes
        retry(1) // Une seule tentative de réessai
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Données serveur chargées avec succès');
          if (response && response.content && response.content.length > 0) {
            this.bornes = response.content;
            this.filteredBornes = [...this.bornes];
            this.operationalCount = this.bornes.filter(b => b.status === 'Operational').length;
            this.loadingError = false;
            this.cdr.detectChanges();
            
            if (this.mapInitialized) {
              this.addMarkers();
            }
            
            this.showTemporaryMessage('✅ Données actualisées depuis le serveur', 'success');
          }
        },
        error: (err: HttpErrorResponse | TimeoutError) => {
          console.warn('⚠️ Impossible de charger depuis le serveur, utilisation des données démo');
          
          // Vérifier si c'est une erreur de timeout
          if (err instanceof TimeoutError) {
            this.errorMessage = '⏱️ Délai dépassé. Le serveur met trop de temps à répondre.';
          } else if (err.status === 0) {
            this.errorMessage = '❌ Serveur indisponible. Vérifiez que le backend est démarré sur http://localhost:8081';
          } else if (err.status === 404) {
            this.errorMessage = '❌ API non trouvée. Vérifiez l\'URL du backend.';
          } else {
            this.errorMessage = `❌ Erreur: ${err.message || 'Connexion impossible'}`;
          }
          
          this.loadingError = true;
          this.cdr.detectChanges();
          
          // Afficher un message temporaire puis le cacher après 5 secondes
          setTimeout(() => {
            this.loadingError = false;
            this.cdr.detectChanges();
          }, 5000);
        }
      });
  }

  // Message temporaire
  private showTemporaryMessage(message: string, type: string): void {
    const msgDiv = document.createElement('div');
    msgDiv.className = `temp-message ${type}`;
    msgDiv.innerHTML = message;
    msgDiv.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      z-index: 2000;
      font-size: 14px;
      animation: fadeOut 3s ease forwards;
    `;
    document.body.appendChild(msgDiv);
    setTimeout(() => msgDiv.remove(), 3000);
  }

  private addMarkers(): void {
    if (!this.map || !this.mapInitialized || !isPlatformBrowser(this.platformId)) return;
    
    import('leaflet').then(module => {
      const L = module.default;
      
      // Supprimer les anciens marqueurs
      this.markers.forEach(marker => {
        if (marker) marker.remove();
      });
      this.markers = [];

      this.filteredBornes.forEach(borne => {
        if (borne.latitude && borne.longitude) {
          const marker = L.circleMarker([borne.latitude, borne.longitude], {
            radius: 10,
            fillColor: this.getMarkerColor(borne.status),
            color: 'white',
            weight: 2,
            fillOpacity: 0.85
          }).addTo(this.map);
          
          marker.bindPopup(this.getPopupContent(borne));
          this.markers.push(marker);
        }
      });

      if (this.markers.length > 0) {
        try {
          const group = L.featureGroup(this.markers);
          this.map.fitBounds(group.getBounds().pad(0.1));
        } catch (error) {
          this.map.setView([31.7917, -7.0926], 6);
        }
      }
      
      console.log(`📌 ${this.markers.length} marqueurs ajoutés sur la carte`);
    });
  }

  private getMarkerColor(status: string): string {
    switch(status) {
      case 'Operational': return '#27ae60';
      case 'Maintenance': return '#f39c12';
      case 'OutOfService': return '#e74c3c';
      default: return '#3498db';
    }
  }

  private getPopupContent(borne: Borne): string {
    const statusText = this.getStatusText(borne.status);
    const statusColor = this.getStatusColor(borne.status);
    
    return `
      <div style="min-width:220px; font-family: 'Segoe UI', sans-serif;">
        <h4 style="margin:0 0 10px; color:#2c3e50; border-bottom:2px solid #667eea; padding-bottom:5px;">
          ${borne.title || 'Borne #' + borne.id}
        </h4>
        <div style="margin-bottom:8px;">
          <span style="display:inline-block; width:70px; font-weight:bold;">📍 Adresse:</span>
          <span style="color:#555;">${borne.address}</span>
        </div>
        <div style="margin-bottom:8px;">
          <span style="display:inline-block; width:70px; font-weight:bold;">🏙️ Ville:</span>
          <span style="color:#555;">${borne.city || 'N/C'}</span>
        </div>
        <div style="margin-bottom:8px;">
          <span style="display:inline-block; width:70px; font-weight:bold;">🏢 Opérateur:</span>
          <span style="color:#555;">${borne.operator || 'Inconnu'}</span>
        </div>
        <div style="margin-bottom:8px;">
          <span style="display:inline-block; width:70px; font-weight:bold;">⚡ Puissance:</span>
          <span style="color:#555;">${borne.power || 'N/C'} kW</span>
        </div>
        <div style="margin-bottom:12px;">
          <span style="display:inline-block; width:70px; font-weight:bold;">💰 Tarif:</span>
          <span style="color:${borne.usageCost === 'Gratuit' ? '#27ae60' : '#e74c3c'}; font-weight:bold;">
            ${borne.usageCost === 'Gratuit' ? 'Gratuit' : (borne.usageCost || 'N/C')}
          </span>
        </div>
        <div style="margin-bottom:12px; padding:5px 8px; background:${statusColor}; border-radius:5px; text-align:center;">
          <span style="color:white; font-size:12px;">${statusText}</span>
        </div>
        <button onclick="window.location.href='/bornes/${borne.id}'" 
                style="width:100%; padding:8px; background:linear-gradient(135deg, #667eea, #764ba2); color:white; border:none; border-radius:8px; cursor:pointer; font-size:12px; transition:transform 0.2s;">
          🔍 Voir les détails
        </button>
      </div>
    `;
  }

  private getStatusText(status: string): string {
    switch(status) {
      case 'Operational': return '✅ Opérationnelle';
      case 'Maintenance': return '🔧 En maintenance';
      case 'OutOfService': return '❌ Hors service';
      default: return '📅 Planifiée';
    }
  }

  private getStatusColor(status: string): string {
    switch(status) {
      case 'Operational': return '#27ae60';
      case 'Maintenance': return '#f39c12';
      case 'OutOfService': return '#e74c3c';
      default: return '#3498db';
    }
  }

  filterMarkers(): void {
    let filtered = [...this.bornes];
    
    if (this.statusFilter) {
      filtered = filtered.filter(b => b.status === this.statusFilter);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        (b.title?.toLowerCase().includes(term)) ||
        (b.city?.toLowerCase().includes(term)) ||
        (b.operator?.toLowerCase().includes(term)) ||
        (b.address?.toLowerCase().includes(term))
      );
    }
    
    this.filteredBornes = filtered;
    this.addMarkers();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterMarkers();
  }

  locateUser(): void {
    if (!isPlatformBrowser(this.platformId) || !navigator.geolocation) {
      alert('Géolocalisation non supportée par votre navigateur');
      return;
    }
    
    const loadingMsg = document.createElement('div');
    loadingMsg.textContent = '📍 Recherche de votre position...';
    loadingMsg.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#667eea;color:white;padding:10px 20px;border-radius:8px;z-index:2000';
    document.body.appendChild(loadingMsg);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadingMsg.remove();
        const { latitude, longitude } = position.coords;
        this.userPosition = { lat: latitude, lng: longitude };
        
        if (this.map) {
          this.map.setView([latitude, longitude], 14);
          
          if (this.userMarker) this.userMarker.remove();
          
          import('leaflet').then(module => {
            const L = module.default;
            this.userMarker = L.marker([latitude, longitude], {
              icon: L.divIcon({ 
                html: '<div style="font-size:28px;">📍</div>', 
                iconSize: [28, 28],
                className: 'user-marker'
              })
            }).addTo(this.map).bindPopup('📍 Vous êtes ici').openPopup();
          });
        }
      },
      (error) => {
        loadingMsg.remove();
        console.error('Erreur géolocalisation:', error);
        let message = 'Impossible de vous localiser. ';
        if (error.code === 1) message += 'Veuillez autoriser la géolocalisation.';
        else if (error.code === 2) message += 'Position indisponible.';
        else if (error.code === 3) message += 'Délai dépassé.';
        alert(message);
      }
    );
  }

  getDistanceToNearest(): string {
    if (!this.userPosition || this.filteredBornes.length === 0) return '0';
    
    let minDistance = Infinity;
    this.filteredBornes.forEach(borne => {
      if (borne.latitude && borne.longitude) {
        const distance = this.calculateDistance(
          this.userPosition!.lat, this.userPosition!.lng,
          borne.latitude, borne.longitude
        );
        if (distance < minDistance) minDistance = distance;
      }
    });
    
    return minDistance === Infinity ? '0' : (Math.round(minDistance * 10) / 10).toString();
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  refresh(): void {
    this.loadBornesFromServer();
    this.showTemporaryMessage('🔄 Actualisation des données...', 'info');
  }

  retryConnection(): void {
    this.loadingError = false;
    this.loadBornesFromServer();
  }

  useDemoData(): void {
    this.loadingError = false;
    this.loadDemoData();
  }
}
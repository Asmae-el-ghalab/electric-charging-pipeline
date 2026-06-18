// heroComponent.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [], // Ajoutez RouterLink si vous utilisez la version avec routerLink
  templateUrl: './heroComponent.html',
  styleUrls: ['./heroComponent.css']
})
export class HeroComponent {
  imagePath = 'assets/img/close-up-electric-car-charging.jpg';
  
  constructor(private router: Router) {}
  
  onNavigateToMap(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/carte']);
  }
  
  onNavigateToSignup(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/inscription']);
  }
  
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://cdn-icons-png.flaticon.com/512/2815/2815428.png';
  }
}
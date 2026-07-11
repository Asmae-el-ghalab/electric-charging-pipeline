import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbarComponent';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule,NavbarComponent],
  templateUrl: './aboutComponent.html',
  styleUrl: './aboutComponent.css',
})
export class AboutComponent implements OnInit {
  private isBrowser: boolean;
  isScrolled = false;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  equipe = [
    {
      nom: 'Karim Benjelloun',
      role: 'Fondateur & CEO',
      bio: 'Expert en mobilité durable avec plus de 10 ans d\'expérience dans le secteur automobile.',
      photo: 'assets/img/peronne1.jpg',
      linkedin: 'https://linkedin.com/in/karim',
      twitter: 'https://twitter.com/karim'
    },
    {
      nom: 'Sara El Fassi',
      role: 'Directrice Technique',
      bio: 'Ingénieur passionné par les nouvelles technologies et l\'innovation verte.',
      photo: '/assets/img/peronne2.jpg',
      linkedin: 'https://linkedin.com/in/sara',
      twitter: 'https://twitter.com/sara'
    },
    {
      nom: 'Mohamed Amrani',
      role: 'Responsable Développement',
      bio: 'Spécialiste en infrastructure de recharge et énergies renouvelables.',
      photo: 'assets/img/peronne3.jpg',
      linkedin: 'https://linkedin.com/in/mohamed',
      twitter: 'https://twitter.com/mohamed'
    },
    {
      nom: 'Leila Benali',
      role: 'Chef de Projet',
      bio: 'Experte en coordination et déploiement de bornes de recharge au Maroc.',
      photo: 'assets/images/equipe/leila.jpg',
      linkedin: 'https://linkedin.com/in/leila',
      twitter: 'https://twitter.com/leila'
    }
  ];

  ngOnInit() {
    if (this.isBrowser) {
      this.animateNumbers();
    }
  }

  animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const target = parseInt(element.dataset['count'] || '0');
          this.counterAnimation(element, target);
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
  }

  counterAnimation(element: HTMLElement, target: number) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toString() + (target === 98 ? '%' : '+');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toString();
      }
    }, 20);
  }

  typesPrises = [
    { nom: 'Type 2 (Mennekes)', puissance: 'AC · jusqu\'à 22 kW',
      icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><circle cx="32" cy="32" r="28"/><circle cx="20" cy="24" r="3"/><circle cx="44" cy="24" r="3"/><circle cx="16" cy="38" r="3"/><circle cx="32" cy="42" r="3"/><circle cx="48" cy="38" r="3"/></svg>' },
    { nom: 'Combo CCS', puissance: 'DC · jusqu\'à 350 kW',
      icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><rect x="10" y="10" width="44" height="30" rx="6"/><circle cx="24" cy="50" r="6"/><circle cx="40" cy="50" r="6"/></svg>' },
    { nom: 'CHAdeMO', puissance: 'DC · jusqu\'à 100 kW',
      icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><circle cx="32" cy="32" r="26"/><circle cx="32" cy="20" r="3"/><circle cx="20" cy="32" r="3"/><circle cx="44" cy="32" r="3"/><circle cx="32" cy="44" r="3"/></svg>' },
    { nom: 'Prise domestique', puissance: 'AC · jusqu\'à 3.7 kW',
      icon: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3"><rect x="8" y="8" width="48" height="48" rx="10"/><circle cx="24" cy="32" r="3"/><circle cx="40" cy="32" r="3"/></svg>' }
  ];

  vehicules = [
    { marque: 'Dacia Spring', autonomie: '230 km', photo: 'assets/img/slide1.jpg' },
    { marque: 'Renault Zoe', autonomie: '395 km', photo: 'assets/img/slide6.jpg' },
    { marque: 'Tesla Model 3', autonomie: '491 km', photo: 'assets/img/slide8.jpg' },
    { marque: 'Hyundai Kona Electric', autonomie: '484 km', photo: 'assets/img/slide4.jpg' },
    { marque: 'BYD Atto 3', autonomie: '420 km', photo: 'assets/img/slide5.jpg' }
  ]; 
    @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
}
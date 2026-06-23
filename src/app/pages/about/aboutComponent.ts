import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbarComponent';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule,NavbarComponent],
  templateUrl: './aboutComponent.html',
  styleUrl: './aboutComponent.css',
})
export class AboutComponent implements OnInit {
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
    this.animateNumbers();
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
}
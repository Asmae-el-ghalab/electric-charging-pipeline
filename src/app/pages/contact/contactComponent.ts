// src/app/pages/contact/contactComponent.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbarComponent';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,NavbarComponent],
  templateUrl: './contactComponent.html',
  styleUrl: './contactComponent.css'
})
export class ContactComponent implements OnInit {
  contactData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;

  faqs = [
    {
      question: 'Comment trouver une borne de recharge près de chez moi ?',
      answer: 'Utilisez notre carte interactive pour localiser toutes les bornes de recharge disponibles près de votre position. Vous pouvez également filtrer par ville, opérateur ou type de connecteur.',
      open: false
    },
    {
      question: 'Comment fonctionne le système de recharge ?',
      answer: 'Notre plateforme vous permet de trouver une borne disponible, de vérifier sa disponibilité en temps réel, et de démarrer une session de recharge directement depuis l\'application.',
      open: false
    },
    {
      question: 'Quels sont les tarifs de recharge ?',
      answer: 'Les tarifs varient selon les opérateurs et les types de bornes. Vous pouvez consulter les prix directement sur la fiche de chaque borne. Certaines bornes sont gratuites.',
      open: false
    },
    {
      question: 'Comment signaler une borne en panne ?',
      answer: 'Vous pouvez signaler une borne en panne en utilisant le formulaire de contact ou directement depuis la fiche de la borne. Notre équipe interviendra rapidement.',
      open: false
    },
    {
      question: 'Est-ce que RechargeMaroc est disponible dans toutes les villes du Maroc ?',
      answer: 'Nous couvrons actuellement 12 villes principales au Maroc, et nous travaillons à étendre notre réseau. Consultez notre carte pour voir les villes disponibles.',
      open: false
    }
  ];

  ngOnInit() {
    // Initialisation si nécessaire
  }

  toggleFaq(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }

  onSubmit() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    // Simuler l'envoi du formulaire
    console.log('Données du formulaire:', this.contactData);
    
    setTimeout(() => {
      this.isSubmitting = false;
      alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      this.resetForm();
    }, 2000);
  }

  resetForm() {
    this.contactData = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
  }
}
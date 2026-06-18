import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbarComponent';
import { HeroComponent } from '../../components/hero/heroComponent'
import { RechercheComponent } from '../../components/recherche-component/recherche-component';
import { ContactComponent } from '../contact/contactComponent';
import { Footer } from '../../components/footer/footer';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, HeroComponent, RechercheComponent, ContactComponent, Footer],  // ← IMPORTANT: Ajouter ici
  templateUrl: './homeComponent.html',
  styleUrls: ['./homeComponent.css']
})
export class HomeComponent{}
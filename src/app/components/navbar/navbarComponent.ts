import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,  // Add this if not already present
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbarComponent.html',
  styleUrl: './navbarComponent.css',
})
export class NavbarComponent {}
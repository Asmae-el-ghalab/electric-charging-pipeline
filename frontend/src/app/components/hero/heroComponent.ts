import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './heroComponent.html',
  styleUrls: ['./heroComponent.css']
})
export class HeroComponent {
 imagePath = 'assets/img/close-up-electric-car-charging.jpg';
}
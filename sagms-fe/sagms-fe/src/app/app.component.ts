import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArtworksComponent } from './artworks.component';
import { ExhibitionsComponent } from './exhibitions.component';
import { NavComponent } from './nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    ArtworksComponent,
    ExhibitionsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Smart Art Gallery';
}

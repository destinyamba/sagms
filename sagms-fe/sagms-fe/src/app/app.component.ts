import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArtworksComponent } from './components/artworks/artworks.component';
import { ExhibitionsComponent } from './components/exhibitions/exhibitions.component';
import { NavComponent } from './components/navigation/nav.component';

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

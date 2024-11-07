import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArtworksComponent } from './artworks.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ArtworksComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Smart Art Gallery';
}

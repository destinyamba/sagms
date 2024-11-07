import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'artworks',
  standalone: true,
  imports: [RouterOutlet],
  providers: [DataService],
  templateUrl: './artworks.component.html',
  styleUrl: './artworks.component.css',
})
export class ArtworksComponent {
  title = 'Artworks';
  artworks_list: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.artworks_list = this.dataService.getArtworks();
  }
}

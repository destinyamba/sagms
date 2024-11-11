import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './artwork.detail.component.html',
  styleUrl: './artwork.detail.component.css',
})
export class ArtworkDetailComponent implements OnInit {
  artwork: any;
  artworkImageUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const artworkId = this.route.snapshot.paramMap.get('id');
    this.getArtwork(artworkId!);
  }

  getArtwork(id: string): void {
    this.dataService.getArtworkById(id).subscribe({
      next: (data) => {
        if (data) {
          this.artwork = data;
          this.artworkImageUrl =
            data.images && data.images ? data.images : 'Image not found';
        } else {
          console.error('Artwork not found for ID:', id);
        }
      },
      error: (error) => console.error('Error fetching artwork data:', error),
    });
  }
}

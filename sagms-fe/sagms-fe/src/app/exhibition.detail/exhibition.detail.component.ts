import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import { Artwork, Exhibition } from '../../types';

@Component({
  selector: 'exhibition-detail',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './exhibition.detail.component.html',
  styleUrl: './exhibition.detail.component.css',
})
export class ExhibitionDetailComponent implements OnInit {
  exhibition: Exhibition | null = null;
  artworkImages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const exhibitionId = this.route.snapshot.paramMap.get('id') || '';
    this.dataService.getExhibitionById(exhibitionId).subscribe({
      next: (exhibition) => {
        this.exhibition = exhibition;
        this.loadArtworkImages();
      },
      error: (error) => {
        console.error('Error fetching exhibition details:', error);
      },
    });
  }

  loadArtworkImages(): void {
    // Use forkJoin to fetch all artwork images for this exhibition
    if (this.exhibition?.artworks) {
      // Check if exhibition is not null
      const artworkRequests = this.exhibition.artworks.map((artworkId) =>
        this.dataService.getArtworkById(artworkId).pipe(
          map((artwork: Artwork) => artwork.images[0]) // Get the first image from the artwork
        )
      );

      // Fetch all artwork images in parallel
      forkJoin(artworkRequests).subscribe({
        next: (images) => {
          this.artworkImages = images; // Populate the image array for the carousel
        },
        error: (error) => {
          console.error('Error fetching artwork images:', error);
        },
      });
    }
  }
}

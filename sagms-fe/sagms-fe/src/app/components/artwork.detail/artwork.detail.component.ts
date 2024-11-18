import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { Pagination } from '../pagination/pagination.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Pagination],
  templateUrl: './artwork.detail.component.html',
  styleUrl: './artwork.detail.component.css',
})
export class ArtworkDetailComponent implements OnInit {
  artwork: any;
  artworkImageUrl: string = '';
  reviews: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  totalReviews: number = 0;
  pageNumbers: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const artworkId = this.route.snapshot.paramMap.get('id');
    if (artworkId) {
      this.getArtwork(artworkId!);
      this.getArtworkReviews(artworkId, this.currentPage);
    }
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

  getArtworkReviews(artworkId: string, page: number): void {
    this.dataService.getArtworkReviews(artworkId, page).subscribe({
      next: (data) => {
        this.reviews = data.reviews;
        this.currentPage = data.page;
        this.pageSize = data.pageSize;
        this.totalPages = data.totalPages;
        this.totalReviews = data.totalReviews;
        this.pageNumbers = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
      },
      error: (error) => console.error('Error fetching artwork reviews:', error),
    });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchPage();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchPage();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchPage();
    }
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    sessionStorage['currentPage'] = this.currentPage;
    this.getArtworkReviews(this.artwork._id, newPage);
  }

  fetchPage(): void {
    const artworkId = this.route.snapshot.paramMap.get('id');
    if (artworkId) {
      this.getArtworkReviews(artworkId, this.currentPage);
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { Pagination } from '../pagination/pagination.component';
import { ReviewsModalComponent } from '../reviews-modal/reviews.modal.component';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Pagination, ReviewsModalComponent],
  templateUrl: './artwork.detail.component.html',
  styleUrl: './artwork.detail.component.css',
})
export class ArtworkDetailComponent implements OnInit {
  @ViewChild(ReviewsModalComponent) modalComponent!: ReviewsModalComponent;
  artwork: any;
  artworkImageUrl: string = '';
  reviews: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  totalReviews: number = 0;
  pageNumbers: number[] = [];
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const artworkId = this.route.snapshot.paramMap.get('id');
    if (artworkId) {
      this.getArtworkReviews(artworkId, this.currentPage);
      this.getArtwork(artworkId!);
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
    this.isLoading = true;
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
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching artwork reviews:', error),
          (this.isLoading = false);
      },
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

  isReviewsEmpty(): boolean {
    return !this.isLoading && this.totalReviews === 0;
  }

  openArtworkReviewModal() {
    this.modalComponent.openModal();
  }

  reloadReviews(): void {
    if (this.artwork) {
      this.getArtworkReviews(this.artwork._id, this.currentPage);
    }
  }

  isAdminUser() {
    return this.authService.getUserRole() === 'ADMIN';
  }

  deleteReview(review: any) {
    this.dataService
      .deleteArtworkReview(this.artwork._id, review._id)
      .subscribe({
        next: () => {
          this.getArtworkReviews(this.artwork._id, this.currentPage);
        },
        error: (error) => {
          console.error('Delete failed', error);
          alert('Failed to delete artwork');
        },
      });
  }
}

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

  /**
   * This function is used to get the artwork details from the API.
   * @param id
   */
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

  /**
   * This function is used to get the reviews for the artwork from the API.
   * @param artworkId
   * @param page
   */
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

  /**
   * This function is used to navigate to the previous page of artworks or reviews.
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchPage();
    }
  }

  /**
   * This function is used to navigate to the next page of artworks or reviews.
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchPage();
    }
  }

  /**
   * This function navigates to a specific page.
   * @param page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchPage();
    }
  }

  /**
   * This function is used to fetch the reviews for the current page.
   * @param newPage
   */
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    sessionStorage['currentPage'] = this.currentPage;
    this.getArtworkReviews(this.artwork._id, newPage);
  }

  /**
   * This function is used to fetch the reviews for the current artwork.
   */
  fetchPage(): void {
    const artworkId = this.route.snapshot.paramMap.get('id');
    if (artworkId) {
      this.getArtworkReviews(artworkId, this.currentPage);
    }
  }

  /**
   * This function is to check if there are any reviews for the artwork.
   * @returns
   */
  isReviewsEmpty(): boolean {
    return !this.isLoading && this.totalReviews === 0;
  }

  /**
   * This function is to open the review form.
   */
  openArtworkReviewModal() {
    this.modalComponent.openModal();
  }

  /**
   * This reloads the reviews for the artwork after being added.
   */
  reloadReviews(): void {
    if (this.artwork) {
      this.getArtworkReviews(this.artwork._id, this.currentPage);
    }
  }

  /**
   * This is to check if a user is an admin.
   * @returns
   */
  isAdminUser() {
    return this.authService.getUserRole() === 'ADMIN';
  }

  /**
   * This deletes a review.
   * @param review
   */
  deleteReview(review: any) {
    this.isLoading = true;
    this.dataService
      .deleteArtworkReview(this.artwork._id, review._id)
      .subscribe({
        next: () => {
          this.getArtworkReviews(this.artwork._id, this.currentPage);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Delete failed', error);
          alert('Failed to delete artwork');
        },
      });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import { Artwork, Exhibition } from '../../../types';
import { DataService } from '../../data.service';
import { Pagination } from '../pagination/pagination.component';
import { ReviewsModalComponent } from '../reviews-modal/reviews.modal.component';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'exhibition-detail',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Pagination, ReviewsModalComponent],
  templateUrl: './exhibition.detail.component.html',
  styleUrl: './exhibition.detail.component.css',
})
export class ExhibitionDetailComponent implements OnInit {
  @ViewChild(ReviewsModalComponent) modalComponent!: ReviewsModalComponent;

  exhibition: Exhibition | null = null;
  artworkImages: string[] = [];
  reviews: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  totalReviews: number = 0;
  pageNumbers: number[] = [];
  isLoading: boolean = true;

  /**
   * This function is called when the component is initialized.
   * @param route
   * @param dataService
   * @param authService
   */
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService
  ) {}

  /**
   * This function is called when the component is initialized.
   */
  ngOnInit(): void {
    const exhibitionId = this.route.snapshot.paramMap.get('id') || '';
    this.dataService.getExhibitionById(exhibitionId).subscribe({
      next: (exhibition) => {
        this.exhibition = exhibition;
        this.getExhibitionReviews(exhibitionId, this.currentPage);
        this.loadArtworkImages();
      },
      error: (error) => {
        console.error('Error fetching exhibition details:', error);
      },
    });
  }

  /**
   * This function loads the artwork images for the exhibition.
   */
  loadArtworkImages(): void {
    // Use forkJoin to fetch all artwork images for this exhibition
    if (this.exhibition?.artworks) {
      // Check if exhibition is not null
      const artworkRequests = this.exhibition.artworks.map((artworkId) =>
        this.dataService.getArtworkById(artworkId).pipe(
          map((artwork: Artwork) => artwork.images) // Get the first image from the artwork
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

  /**
   * This function gets the reviews for the exhibition.
   * @param exhibitionId
   * @param page
   */
  getExhibitionReviews(exhibitionId: string, page: number): void {
    this.isLoading = true;
    this.dataService.getExhibitionReviews(exhibitionId, page).subscribe({
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
      error: (error) =>
        console.error('Error fetching exhibition reviews:', error),
    });
  }

  /**
   * This navigates to a specific page.
   * @param page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchPage();
    }
  }

  /**
   * This function fetches the reviews for the current page.
   * @param newPage
   */
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    sessionStorage['currentPage'] = this.currentPage;
    this.getExhibitionReviews(this.exhibition!._id, newPage);
  }

  /**
   * This function fetches the reviews for the current page.
   */
  fetchPage(): void {
    const exhibitionId = this.route.snapshot.paramMap.get('id');
    if (exhibitionId) {
      this.getExhibitionReviews(exhibitionId, this.currentPage);
    }
  }

  /**
   * This checks if an exhibition has any reviews.
   * @returns
   */
  isReviewsEmpty(): boolean {
    return !this.isLoading && this.totalReviews === 0;
  }

  /**
   * This opens the review form.
   */
  openExhibitionReviewModal() {
    this.modalComponent.openModal();
  }

  /**
   * This function is called when the exhibition review form is submitted.
   */
  reloadReviews(): void {
    if (this.exhibition) {
      this.getExhibitionReviews(this.exhibition._id, this.currentPage);
    }
  }

  /**
   * This checks if a user is an admin.
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
    this.dataService
      .deleteExhibitionReview(this.exhibition?._id ?? '', review._id)
      .subscribe({
        next: () => {
          this.getExhibitionReviews(
            this.exhibition?._id ?? '',
            this.currentPage
          );
        },
        error: (error) => {
          console.error('Delete failed', error);
          alert('Failed to delete exhibition');
        },
      });
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Pagination } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../data.service';
import { AuthService } from '../../auth.service';
declare const bootstrap: any;

@Component({
  selector: 'reviews-modal',
  standalone: true,
  imports: [CommonModule, Pagination, FormsModule],
  templateUrl: './reviews.modal.component.html',
  styleUrl: './reviews.modal.component.css',
})
export class ReviewsModalComponent {
  @Input() artworkId!: string;
  modalId!: string;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  handleSubmit() {
    const reviewContent = (
      document.getElementById('reviewContent') as HTMLTextAreaElement
    ).value;
    const reviewRating = +(
      document.getElementById('reviewRating') as HTMLInputElement
    ).value;

    if (!reviewContent || reviewRating < 1 || reviewRating > 5) {
      console.error('Invalid review content or rating');
      return;
    }

    const reviewData = {
      content: reviewContent,
      rating: reviewRating,
    };

    this.addReview(reviewData);
  }

  openModal() {
    this.modalId = 'reviewModal';
    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  addReview(data: any) {
    const reviewerId = this.authService.getUserId() ?? '';
    const reviewData = { ...data, artworkId: this.artworkId };
    this.dataService
      .addArtworkReview(reviewerId, this.artworkId, reviewData)
      .subscribe({
        next: () => this.closeModal(),
        error: (err) => {
          console.error('Error submitting artwork review', err);
        },
      });
  }

  closeModal() {
    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  }
}

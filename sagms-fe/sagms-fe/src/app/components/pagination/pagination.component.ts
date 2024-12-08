import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  standalone: true,
  imports: [NgClass, NgFor, CommonModule],
})
export class Pagination {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();
  private readonly maxPagesToShow = 5;

  /**
   * This function is used to get the pages to be shown in the pagination component.
   */
  get pages(): number[] {
    if (this.totalPages <= this.maxPagesToShow) {
      // Show all pages if the total is less than or equal to maxPagesToShow
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    const halfRange = Math.floor(this.maxPagesToShow / 2);
    let start = Math.max(this.currentPage - halfRange, 1);
    let end = Math.min(this.currentPage + halfRange, this.totalPages);

    // Adjust range if near the beginning or end
    if (end - start + 1 < this.maxPagesToShow) {
      if (start === 1) {
        end = Math.min(this.maxPagesToShow, this.totalPages);
      } else if (end === this.totalPages) {
        start = Math.max(this.totalPages - this.maxPagesToShow + 1, 1);
      }
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  /**
   * This function is used to handle the page change event.
   */
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  /**
   * This function is used to handle the page change event.
   */
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  /**
   * This function is used to handle the page change event.
   * @param page
   */
  changePage(page: number): void {
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}

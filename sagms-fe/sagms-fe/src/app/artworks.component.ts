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
  page: number = 1;
  totalPages: number = 0;
  pageNumbers: number[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadArtworks();
  }

  loadArtworks() {
    this.artworks_list = this.dataService.getArtworks(this.page);
    this.totalPages = Math.ceil(
      this.dataService.getTotalArtworks() / this.dataService.pageSize
    );
    this.generatePageNumbers();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadArtworks();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadArtworks();
    }
  }

  goToPage(page: number) {
    this.page = page;
    this.loadArtworks();
  }

  generatePageNumbers() {
    const maxPagesToShow = 5; // Show max 5 page numbers (adjust as needed)
    const halfRange = Math.floor(maxPagesToShow / 2);
    let start = Math.max(this.page - halfRange, 1);
    let end = Math.min(this.page + halfRange, this.totalPages);

    // Adjust start and end if there are fewer than maxPagesToShow pages available
    if (end - start < maxPagesToShow - 1) {
      if (start === 1) {
        end = Math.min(maxPagesToShow, this.totalPages);
      } else if (end === this.totalPages) {
        start = Math.max(1, this.totalPages - maxPagesToShow + 1);
      }
    }

    this.pageNumbers = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  }
}

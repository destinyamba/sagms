import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DimensionRange, dimensionRanges } from '../../types';

@Component({
  selector: 'artworks',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, FormsModule],
  providers: [DataService],
  templateUrl: './artworks.component.html',
  styleUrl: './artworks.component.css',
})
export class ArtworksComponent {
  title = 'Artworks';
  artworks_data: any;
  page: number = 1;
  totalPages: number = 0;
  pageNumbers: number[] = [];
  pageSize: number = 12;
  searchTerm: string = '';
  selectedDimensionRange: DimensionRange | null = null;
  dimensionRanges = dimensionRanges;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }
    this.loadArtworks();
  }

  loadArtworks() {
    const trimmedSearchTerm = this.searchTerm.trim();

    if (trimmedSearchTerm) {
      this.handleSearchArtworks(trimmedSearchTerm);
    } else if (this.selectedDimensionRange) {
      this.handleDimensionFilter();
    } else {
      this.handleLoadAllArtworks();
    }
  }

  onDimensionFilterChange() {
    this.page = 1;
    this.loadArtworks();
  }

  private handleDimensionFilter() {
    if (!this.selectedDimensionRange) return;

    const filterBody = {
      height: {
        min: this.selectedDimensionRange.height.min,
        max: this.selectedDimensionRange.height.max,
      },
      width: {
        min: this.selectedDimensionRange.width.min,
        max: this.selectedDimensionRange.width.max,
      },
    };

    this.dataService
      .filterArtworksByDimension(filterBody.height, filterBody.width, this.page)
      .subscribe((response) => {
        this.artworks_data = response.artworks;
        this.totalPages = response.totalPages;
        this.updateWithRatings();
        this.generatePageNumbers();
      });
  }

  private handleSearchArtworks(searchTerm: string) {
    this.dataService
      .searchArtworks(searchTerm, this.page)
      .subscribe((response) => {
        this.artworks_data = response.artworks;
        this.totalPages = response.totalPages;
        this.updateWithRatings();
        this.generatePageNumbers();
      });
  }

  private handleLoadAllArtworks() {
    this.dataService.getArtworks(this.page).subscribe((response) => {
      this.artworks_data = response.artworks;
      this.totalPages = response.totalPages;
      this.updateWithRatings();
      this.generatePageNumbers();
    });
  }

  private updateWithRatings() {
    this.dataService.getAvgArtworksRating(this.page).subscribe((ratings) => {
      this.artworks_data = this.artworks_data.map(
        (artwork: { _id: string }) => ({
          ...artwork,
          average_rating:
            ratings.find((r) => r._id === artwork._id)?.average_rating || 0,
        })
      );
    });
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      sessionStorage['page'] = this.page;
      this.loadArtworks();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      sessionStorage['page'] = this.page;
      this.loadArtworks();
    }
  }

  goToPage(page: number) {
    this.page = page;
    sessionStorage['page'] = this.page;
    this.loadArtworks();
  }

  generatePageNumbers() {
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);
    let start = Math.max(this.page - halfRange, 1);
    let end = Math.min(this.page + halfRange, this.totalPages);

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

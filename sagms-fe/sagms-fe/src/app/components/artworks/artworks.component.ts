import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DimensionRange, dimensionRanges } from '../../../types';
import { Pagination } from '../pagination/pagination.component';
import { AddItemModalComponent } from '../modals/modal.component';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'artworks',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    FormsModule,
    Pagination,
    FormsModule,
    AddItemModalComponent,
  ],
  providers: [DataService, Pagination],
  templateUrl: './artworks.component.html',
  styleUrl: './artworks.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ArtworksComponent {
  @ViewChild(AddItemModalComponent) modalComponent!: AddItemModalComponent;
  title = 'Artworks';
  artworks_data: any;
  page: number = 1;
  totalPages: number = 0;
  pageNumbers: number[] = [];
  pageSize: number = 12;
  searchTerm: string = '';
  selectedDimensionRange: DimensionRange | null = null;
  dimensionRanges = dimensionRanges;
  showModal: boolean = false;

  artworkFields = [
    { id: 'artworkTitle', label: 'Title', type: 'text', key: 'title' },
    {
      id: 'artworkDescription',
      label: 'Description',
      type: 'textarea',
      key: 'description',
    },
    { id: 'artworkCategory', label: 'Category', type: 'text', key: 'category' },
    {
      id: 'artworkMaterials',
      label: 'Materials',
      type: 'text',
      key: 'materials',
    },
    {
      id: 'artworkHeight',
      label: 'Height (cm)',
      type: 'number',
      key: 'height_cm',
    },
    {
      id: 'artworkWidth',
      label: 'Width (cm)',
      type: 'number',
      key: 'width_cm',
    },
    {
      id: 'artworkProvenance',
      label: 'Provenance',
      type: 'text',
      key: 'provenance',
    },
    { id: 'artworkImages', label: 'Image URLs', type: 'text', key: 'images' },
  ];

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }
    this.loadArtworks();
  }

  /**
   * This loads artworks from the data service and assigns them to the artworks array.
   */
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

  /**
   * This is called to change the dimension filter.
   */
  onDimensionFilterChange() {
    this.page = 1;
    this.loadArtworks();
  }

  /**
   * This is called to change the dimension filter.
   * @returns
   */
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

  /**
   * This is called to change the search term.
   * @param searchTerm
   */
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

  /**
   * This is called to load the artworks from the API.
   */
  private handleLoadAllArtworks() {
    this.dataService.getArtworks(this.page).subscribe((response) => {
      this.artworks_data = response.artworks;
      this.totalPages = response.totalPages;
      this.updateWithRatings();
      this.generatePageNumbers();
    });
  }

  /**
   * This is called to update the artworks data with ratings.
   */
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

  /**
   * This function generates the page numbers for the pagination.
   * @param page
   */
  goToPage(page: number) {
    this.page = page;
    sessionStorage['page'] = this.page;
    this.loadArtworks();
  }

  /**
   * This function is used to generate the page numbers for the pagination.
   */
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

  /**
   * This function is called when the user clicks on a page number.
   * @param newPage
   */
  onPageChange(newPage: number): void {
    this.page = newPage;
    sessionStorage['page'] = this.page;
    this.loadArtworks();
  }

  /**
   * This opens the form to create a new artwork.
   */
  openAddArtworkModal() {
    this.modalComponent.openModal('artwork');
  }

  /**
   * This opens the form to edit an artwork.
   */
  onModalClose() {
    this.showModal = false;
  }

  /**
   * This checks if a user is an artist.
   * @returns
   */
  isArtist() {
    return this.authService.getUserRole() === 'ARTIST';
  }
}

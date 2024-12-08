import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';
import { Pagination } from '../pagination/pagination.component';
import { AddItemModalComponent } from '../modals/modal.component';
import { AuthService } from '../../auth.service';
declare var bootstrap: any;

@Component({
  selector: 'exhibitions',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    Pagination,
    AddItemModalComponent,
  ],
  providers: [DataService],
  templateUrl: './exhibitions.component.html',
  styleUrl: './exhibitions.component.css',
})
export class ExhibitionsComponent implements AfterViewInit {
  @ViewChild(AddItemModalComponent) modalComponent!: AddItemModalComponent;
  title = 'Exhibitions';
  exhibitions_list: any;
  exhibitions_data: any;
  page: number = 1;
  totalPages: number = 0;
  pageNumbers: number[] = [];
  showModal: boolean = false;

  @ViewChild('carouselExhibition', { static: false })
  carouselElement!: ElementRef;
  /**
   * This function is called after the component has been initialized.
   * @param dataService
   * @param authService
   */
  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  /**
   * This function is called after the component has been initialized.
   */
  ngOnInit() {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }
    this.loadExhibitions();
  }

  /**
   * This function is called after the component has been initialized.
   */
  ngAfterViewInit() {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel: any) => {
      new bootstrap.Carousel(carousel);
    });
  }

  /**
   * This loads the exhibitions data from the server.
   */
  loadExhibitions() {
    this.dataService.getExhibitions(this.page).subscribe({
      next: (response) => {
        this.exhibitions_data = response;
        this.loadArtworksForExhibitions();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });

    this.dataService.getTotalExhibitions().subscribe((totalExhibitions) => {
      this.totalPages = Math.ceil(totalExhibitions / 12);
      this.generatePageNumbers();
    });
  }

  /**
   * This loads the images for the artworks in the exhibitions.
   */
  loadArtworksForExhibitions() {
    const artworkRequests = this.exhibitions_data.map((exhibition: any) => {
      // Fetch artwork data for each exhibition
      return forkJoin(
        exhibition.artworks.map((artworkId: string) =>
          this.dataService.getArtworkById(artworkId).pipe(
            map((artwork: any) => {
              const imageUrl = artwork.images;
              const cacheBustedImageUrl = `${imageUrl}?v=${Date.now()}`;
              return cacheBustedImageUrl;
            })
          )
        )
      ).pipe(
        map((images) => {
          return {
            ...exhibition,
            artworks_images: images, // Add images to the exhibition data
          };
        })
      );
    });

    forkJoin(artworkRequests).subscribe((exhibitionsWithImages) => {
      this.exhibitions_data = exhibitionsWithImages; // Update exhibitions data with images
    });
  }

  /**
   * This navigates to the previous page.
   */
  previousPage() {
    if (this.page > 1) {
      this.page--;
      sessionStorage['page'] = this.page;
      this.loadExhibitions();
    }
  }

  /**
   * This navigates to the next page.
   */
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      sessionStorage['page'] = this.page;
      this.loadExhibitions();
    }
  }

  /**
   * This navigates to a specific page.
   * @param page
   */
  goToPage(page: number) {
    this.page = page;
    this.loadExhibitions();
  }

  /**
   * This generates page numbers.
   */
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

  /**
   * This tracks the current page.
   * @param index
   * @param page
   * @returns
   */
  trackByPage(index: number, page: number): number {
    return page;
  }

  activeSlideIndex: number = 0;

  /**
   * This navigates the carousel.
   */
  prevSlide() {
    this.carouselElement.nativeElement.previousElementSibling.click();
  }

  /**
   * This navigates the carousel.
   */
  nextSlide() {
    this.carouselElement.nativeElement.nextElementSibling.click();
  }

  /**
   * This navigates the carousel.
   * @param event
   */
  onSlideChange(event: any) {
    this.activeSlideIndex = event.activeId;
  }

  /**
   * This tracks the exhibittion by ID.
   * @param index
   * @param exhibition
   * @returns
   */
  trackById(index: number, exhibition: any): string {
    return exhibition._id;
  }

  /**
   * This navigates to a page.
   * @param newPage
   */
  onPageChange(newPage: number): void {
    this.page = newPage;
    sessionStorage['page'] = this.page;
    this.loadExhibitions();
  }

  /**
   * This opens the form to add a new exhibition.
   */
  openAddExhibitionModal() {
    this.modalComponent.openModal('exhibition');
  }

  /**
   * This closes the form.
   */
  onModalClose() {
    this.showModal = false;
  }

  /**
   * This checks if a user is a curator.
   * @returns
   */
  isCurator() {
    return this.authService.getUserRole() === 'CURATOR';
  }
}

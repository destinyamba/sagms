import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../pagination/pagination.component';
import { AuthService } from '../../auth.service';
import { AddItemModalComponent } from '../modals/modal.component';
import { forkJoin, map } from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'curator-related-exhibitions',
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
  templateUrl: './curator.related.exhibitions.component.html',
  styleUrl: './curator.related.exhibitions.component.css',
})
export class CuratorRelatedExhibitionsComponent implements OnInit {
  @ViewChild(AddItemModalComponent) modalComponent!: AddItemModalComponent;
  exhibition: any;
  page: number = 1;
  exhibitions_data: any;
  pageSize: number = 12;
  totalPages: number = 0;
  pageNumbers: number[] = [];
  activeSlideIndex: number = 0;

  @ViewChild('carouselExhibition', { static: false })
  carouselElement!: ElementRef;
  /**
   * This function is called when the component is initialized.
   * @param dataService
   * @param authService
   */
  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  /**
   * This function is called when the component is initialized.
   */
  ngOnInit() {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }
    this.getExhibitions();
  }

  /**
   * This function is called to enable the arworks carousel work.
   */
  ngAfterViewInit() {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel: any) => {
      new bootstrap.Carousel(carousel);
    });
  }

  /**
   * This function is called to load all artwork images for exhibitions data.
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
   * This function is called to get all exhibitions data.
   */
  getExhibitions() {
    const curatorId = this.authService.getUserId() ?? '';

    this.dataService
      .getCuratorRelatedExhibitions(curatorId)
      .subscribe((response) => {
        this.exhibitions_data = response.exhibitions;
        this.loadArtworksForExhibitions();
        this.totalPages = response.totalPages;
        this.generatePageNumbers();
      });
  }

  /**
   * This is used to generate page numbers for exhibitions data.
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
   * This function is used to go to a specific page.
   * @param page
   */
  goToPage(page: number) {
    this.page = page;
    sessionStorage['page'] = this.page;
    this.getExhibitions();
  }

  /**
   * This is used to track exhibition by ID.
   * @param exhibition
   * @returns
   */
  trackByExhibitionId(exhibition: any): string {
    return exhibition._id;
  }

  /**
   * This is used to delete an exhibition.
   * @param exhibition
   */
  deleteExhibition(exhibition: any) {
    this.dataService.deleteExhibition(exhibition._id).subscribe({
      next: () => {
        this.getExhibitions();
      },
      error: (error) => {
        console.error('Delete failed', error);
        alert('Failed to delete artwork');
      },
    });
  }

  /**
   * This is used to get the exhibition details.
   * @param exhibition
   */
  openEditExhibitionModal(exhibition: any) {
    const editableExhibition = {
      ...exhibition,
      _id: exhibition._id,
      title: exhibition.title,
      description: exhibition.description,
      provenance: exhibition.provenance,
      artworks: exhibition.artworks ? exhibition.artworks.join(', ') : '',
    };

    this.modalComponent.openModal('exhibition', editableExhibition);
  }

  /**
   * This opens to add a new exhibition.
   */
  openAddExhibitionModal() {
    this.modalComponent.openModal('exhibition');
  }

  /**
   * This loads exhibitions after adding an exhibition.
   */
  reloadExhibitions(): void {
    this.getExhibitions();
  }
}

import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../pagination/pagination.component';
import { AuthService } from '../../auth.service';
import { AddItemModalComponent } from '../modals/modal.component';
declare var bootstrap: any;

@Component({
  selector: 'artist-related-artworks',
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
  templateUrl: './artist.related.artworks.component.html',
  styleUrl: './artist.related.artworks.component.css',
})
export class ArtistRelatedArtworksComponent {
  @ViewChild(AddItemModalComponent) modalComponent!: AddItemModalComponent;
  artwork: any;
  page: number = 1;
  artworks_data: any;
  pageSize: number = 12;
  totalPages: number = 0;
  pageNumbers: number[] = [];

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }
    this.getArtworks();
  }

  /**
   * This is to load all artworks related to the artist.
   */
  getArtworks() {
    const artistId = this.authService.getUserId() ?? '';

    this.dataService
      .getArtistRelatedArtworks(artistId)
      .subscribe((response) => {
        this.artworks_data = response.artworks;
        this.totalPages = response.totalPages;
        this.generatePageNumbers();
      });
  }

  /**
   * This is to generate page numbers for pagination.
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
   * This is to handle page change.
   * @param page
   */
  goToPage(page: number) {
    this.page = page;
    sessionStorage['page'] = this.page;
    this.getArtworks();
  }

  /**
   * This is to track artwork by ID.
   * @param artwork
   * @returns
   */
  trackByArtworkId(artwork: any): string {
    return artwork._id;
  }

  /**
   * This is to delete an artwork.
   * Only the artist can delete their own artworks.
   * @param artwork
   */
  deleteArtwork(artwork: any) {
    const artistId = this.authService.getUserId() ?? '';
    this.dataService.deleteArtwork(artistId, artwork._id).subscribe({
      next: () => {
        this.getArtworks();
      },
      error: (error) => {
        console.error('Delete failed', error);
        alert('Failed to delete artwork');
      },
    });
  }

  /**
   * This is to open the edit artwork modal.
   * @param artwork
   */
  openEditArtworkModal(artwork: any) {
    this.modalComponent.openModal('artwork', artwork);
    this.getArtworks();
  }

  /**
   * This is to update an artwork.
   * Only the artist can update their own artworks.
   * @param data
   */
  updateArtwork(data: any) {
    const artistId = this.authService.getUserId() ?? '';
    const updatedArtwork = {
      ...data,
      materials: data.materials
        ? data.materials.split(',').map((m: string) => m.trim())
        : [],
    };

    this.dataService
      .editArtwork(artistId, updatedArtwork._id, updatedArtwork)
      .subscribe({
        next: () => {
          this.getArtworks();
          const modalElement = document.getElementById('editArtworkModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
          }
        },
        error: (err) => {
          console.error('Failed to update artwork', err);
          alert('Failed to update artwork');
        },
      });
  }
}

import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../data.service';
import { AuthService } from '../../auth.service';
declare const bootstrap: any;

@Component({
  selector: 'add-item-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddItemModalComponent {
  modalId!: string;
  modalTitle!: string;
  formFields!: any[];
  formData: any = {};

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  // Open the modal and configure it
  openModal(type: string) {
    if (type === 'artwork') {
      this.modalId = 'addArtworkModal';
      this.modalTitle = 'Add Artwork';
      this.formFields = [
        { id: 'artworkTitle', label: 'Title', name: 'title', type: 'text' },
        {
          id: 'artworkDescription',
          label: 'Description',
          name: 'description',
          type: 'textarea',
        },
        {
          id: 'artworkCategory',
          label: 'Category',
          name: 'category',
          type: 'text',
        },
        {
          name: 'materials',
        },
        {
          type: 'row',
          fields: [
            {
              id: 'artworkHeight',
              label: 'Height (cm)',
              name: 'height_cm',
              type: 'number',
            },
            {
              id: 'artworkWidth',
              label: 'Width (cm)',
              name: 'width_cm',
              type: 'number',
            },
          ],
        },
        {
          id: 'artworkProvenance',
          label: 'Provenance',
          name: 'provenance',
          type: 'text',
        },
        {
          id: 'artworkImages',
          label: 'Image URLs',
          name: 'images',
          type: 'text',
        },
      ];
      this.formData = {};
    } else if (type === 'exhibition') {
      this.modalId = 'addExhibitionModal';
      this.modalTitle = 'Add Exhibition';
      this.formFields = [
        { id: 'exhibitionTitle', label: 'Title', name: 'title', type: 'text' },
        {
          id: 'exhibitionDescription',
          label: 'Description',
          name: 'description',
          type: 'textarea',
        },
        {
          id: 'exhibitionProvenance',
          label: 'Provenance',
          name: 'provenance',
          type: 'text',
        },
        {
          id: 'artworks',
          label: 'Artworks',
          name: 'artworks',
          type: 'text',
        },
      ];
      this.formData = {};
    }

    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Submit the form data based on the modal type
  submitData() {
    const data = this.formData;

    if (this.modalId === 'addArtworkModal') {
      this.submitArtwork(data);
    } else if (this.modalId === 'addExhibitionModal') {
      this.submitExhibition(data);
    }
  }

  submitArtwork(data: any) {
    const artistId = this.authService.getUserId() ?? '';
    const artworkData = {
      ...data,
      materials: data.materials
        ? data.materials.split(',').map((material: string) => material.trim())
        : [],
    };
    this.dataService.addArtwork(artistId, artworkData).subscribe({
      next: () => {
        const modalElement = document.getElementById(this.modalId);
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        }
      },
      error: (err) => {
        console.error('Error creating artwork:', err);
      },
    });
  }

  submitExhibition(data: any) {
    const exhibitionData = { ...data };
    // this.dataService.addExhibition(exhibitionData).subscribe({
    //   next: (response) => {
    //     console.log('Exhibition created successfully:', response);
    //   },
    //   error: (err) => {
    //     console.error('Error creating exhibition:', err);
    //   },
    // });
  }
}

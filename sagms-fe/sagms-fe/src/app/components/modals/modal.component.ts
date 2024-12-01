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
  exhibitions_data: any;
  pageSize: number = 12;
  totalPages: number = 0;
  isEditMode: boolean = false;
  isEditExhibition: boolean = false;
  itemIdToEdit: string | null = null;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  openModal(type: string, itemData?: any) {
    const uniqueSuffix = '_' + Math.random().toString(36).substr(2, 9);
    if (type === 'artwork') {
      this.isEditMode = !!itemData;
      this.modalId = 'addArtworkModal';
      this.modalTitle = this.isEditMode ? 'Edit Artwork' : 'Add Artwork';
      this.formFields = [
        {
          id: 'artworkTitle' + uniqueSuffix,
          label: 'Title',
          name: 'title',
          type: 'text',
        },
        {
          id: 'artworkDescription' + uniqueSuffix,
          label: 'Description',
          name: 'description',
          type: 'textarea',
        },
        {
          id: 'artworkCategory' + uniqueSuffix,
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
              id: 'artworkHeight' + uniqueSuffix,
              label: 'Height (cm)',
              name: 'height_cm',
              type: 'number',
            },
            {
              id: 'artworkWidth' + uniqueSuffix,
              label: 'Width (cm)',
              name: 'width_cm',
              type: 'number',
            },
          ],
        },
        {
          id: 'artworkProvenance' + uniqueSuffix,
          label: 'Provenance',
          name: 'provenance',
          type: 'text',
        },
        {
          id: 'artworkImages' + uniqueSuffix,
          label: 'Image URLs',
          name: 'images',
          type: 'text',
        },
      ];

      this.formData = this.isEditMode ? { ...itemData } : {};
      this.itemIdToEdit = this.isEditMode ? itemData.id : null;
    } else if (type === 'exhibition') {
      this.isEditExhibition = !!itemData;
      this.modalId = 'addExhibitionModal';
      this.modalTitle = this.isEditExhibition
        ? 'Edit Exhibition'
        : 'Add Exhibition';
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
      this.formData = this.isEditExhibition ? { ...itemData } : {};
      this.itemIdToEdit = this.isEditExhibition ? itemData.id : null;
    }

    const modalElement = document.getElementById(this.modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  submitData() {
    if (this.isEditMode) {
      this.updateArtwork(this.formData);
    } else if (this.isEditExhibition) {
      this.updateExhibition(this.formData);
    } else {
      if (this.modalId === 'addArtworkModal') {
        this.submitArtwork(this.formData);
      } else if (this.modalId === 'addExhibitionModal') {
        this.submitExhibition(this.formData);
      }
    }
  }

  updateArtwork(data: any) {
    const artistId = this.authService.getUserId() ?? '';
    const updatedData = {
      title: data.title,
      description: data.description,
      category: data.category,
      materials: Array.isArray(data.materials)
        ? data.materials.map((material: string) => material.trim())
        : [],
      height_cm: data.height_cm,
      width_cm: data.width_cm,
      provenance: data.provenance,
      images: data.images,
    };

    this.dataService.editArtwork(artistId, data._id, updatedData).subscribe({
      next: () => {
        const modalElement = document.getElementById(this.modalId);
        if (modalElement) {
          let modal = bootstrap.Modal.getInstance(modalElement);
          if (!modal) {
            modal = new bootstrap.Modal(modalElement);
          }
          modal.hide();
        }
      },
      error: (err) => console.error('Error updating artwork:', err),
    });
  }

  submitArtwork(data: any) {
    const artistId = this.authService.getUserId() ?? '';
    const artworkData = {
      ...data,
      materials: data.materials
        ? data.materials.split(', ').map((material: string) => material.trim())
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
    const curatorId = this.authService.getUserId() ?? '';
    const exhibitionData = {
      ...data,
      artworks: data.artworks
        ? data.artworks.split(', ').map((artworks: string) => artworks.trim())
        : [],
    };
    this.dataService.createExhibition(exhibitionData, curatorId).subscribe({
      next: () => {
        const modalElement = document.getElementById(this.modalId);
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
        }
      },
      error: (err) => {
        console.error('Error creating exhibition:', err);
      },
    });
  }

  updateExhibition(data: any) {
    const curatorId = this.authService.getUserId() ?? '';
    const updatedData = {
      title: data.title,
      description: data.description,
      artworks: Array.isArray(data.artworks)
        ? data.artworks.map((artwork: string) => artwork.trim())
        : [],
      provenance: data.provenance,
    };

    this.dataService
      .editExhibition(curatorId, data._id, updatedData)
      .subscribe({
        next: () => {
          const modalElement = document.getElementById(this.modalId);
          if (modalElement) {
            let modal = bootstrap.Modal.getInstance(modalElement);
            if (!modal) {
              modal = new bootstrap.Modal(modalElement);
            }
            modal.hide();
          }
        },
        error: (err) => console.error('Error updating exhibition:', err),
      });
  }
}

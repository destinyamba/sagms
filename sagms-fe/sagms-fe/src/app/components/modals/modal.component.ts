import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  NgZone,
  Output,
} from '@angular/core';
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
  isLoading: boolean = true;
  @Output() exhibitionAdded = new EventEmitter<void>();

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
   * This function opens the modal to add and update artworks and exhibitions.
   * @param type
   * @param itemData
   */
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

  /**
   * This function is called when the user clicks the "Save" button.
   */
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

  /**
   * This function is called to update an artwork.
   * @param data
   */
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

  /**
   * This function is called to edit an artwork.
   * @param data
   */
  submitArtwork(data: any) {
    this.isLoading = true;
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
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error creating artwork:', err);
      },
    });
  }

  /**
   * This function is called to create an exhibition.
   * @param data
   */
  submitExhibition(data: any) {
    this.isLoading = false;
    const curatorId = this.authService.getUserId() ?? '';
    const exhibitionData = {
      ...data,
      artworks: data.artworks
        ? data.artworks.split(', ').map((artworks: string) => artworks.trim())
        : [],
    };
    this.dataService.createExhibition(exhibitionData, curatorId).subscribe({
      next: () => {
        this.exhibitionAdded.emit();
        this.isLoading = true;
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

  /**
   * This function is called to edit an exhibition.
   * @param data
   */
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
          this.exhibitionAdded.emit();
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

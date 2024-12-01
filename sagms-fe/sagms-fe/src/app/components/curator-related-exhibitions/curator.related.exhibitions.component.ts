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
export class CuratorRelatedExhibitionsComponent {
  @ViewChild(AddItemModalComponent) modalComponent!: AddItemModalComponent;
  exhibition: any;
  page: number = 1;
  exhibitions_data: any;
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
    this.getExhibitions();
  }

  getExhibitions() {
    const curatorId = this.authService.getUserId() ?? '';

    this.dataService
      .getCuratorRelatedExhibitions(curatorId)
      .subscribe((response) => {
        this.exhibitions_data = response.exhibitions;
        this.totalPages = response.totalPages;
        this.generatePageNumbers();
      });
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

  goToPage(page: number) {
    this.page = page;
    sessionStorage['page'] = this.page;
    this.getExhibitions();
  }

  trackByExhibitionId(exhibition: any): string {
    return exhibition._id;
  }

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

  openEditExhibitionModal(exhibition: any) {
    this.modalComponent.openModal('exhibition', exhibition);
    this.getExhibitions();
  }

  openAddExhibitionModal() {
    this.modalComponent.openModal('exhibition');
  }
}

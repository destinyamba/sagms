import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'exhibitions',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  providers: [DataService],
  templateUrl: './exhibitions.component.html',
  styleUrl: './exhibitions.component.css',
})
export class ExhibitionsComponent {
  title = 'Exhibitions';
  exhibitions_list: any;
  page: number = 1;
  totalPages: number = 0;
  pageNumbers: number[] = [];

  images = [
    'https://i.imgur.com/Od0WSWI.jpg',
    'https://i.imgur.com/ZoKq66D.jpg',
    'https://i.imgur.com/PU29L0p.jpg',
  ];

  @ViewChild('carouselExhibition', { static: false })
  carouselElement!: ElementRef;
  constructor(private dataService: DataService) {}

  ngOnInit() {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }
    this.loadExhibitions();
  }

  loadExhibitions() {
    this.exhibitions_list = this.dataService.getExhibitions(this.page);
    this.totalPages = Math.ceil(
      this.dataService.getTotalExhibitions() / this.dataService.pageSize
    );
    this.generatePageNumbers();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      sessionStorage['page'] = this.page;
      this.loadExhibitions();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      sessionStorage['page'] = this.page;
      this.loadExhibitions();
    }
  }

  goToPage(page: number) {
    this.page = page;
    this.loadExhibitions();
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

  trackByPage(index: number, page: number): number {
    return page;
  }

  activeSlideIndex: number = 0;

  prevSlide() {
    this.carouselElement.nativeElement.previousElementSibling.click();
  }

  nextSlide() {
    this.carouselElement.nativeElement.nextElementSibling.click();
  }

  onSlideChange(event: any) {
    this.activeSlideIndex = event.activeId;
  }
}

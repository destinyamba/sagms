import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'exhibitions',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  providers: [DataService],
  templateUrl: './exhibitions.component.html',
  styleUrl: './exhibitions.component.css',
})
export class ExhibitionsComponent implements AfterViewInit {
  title = 'Exhibitions';
  exhibitions_list: any;
  exhibitions_data: any;
  page: number = 1;
  totalPages: number = 0;
  pageNumbers: number[] = [];

  @ViewChild('carouselExhibition', { static: false })
  carouselElement!: ElementRef;
  constructor(private dataService: DataService) {}

  ngOnInit() {
    if (sessionStorage['page']) {
      this.page = Number(sessionStorage['page']);
    }
    this.loadExhibitions();
  }

  ngAfterViewInit() {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel: any) => {
      new bootstrap.Carousel(carousel);
    });
  }

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

  trackById(index: number, exhibition: any): string {
    return exhibition._id;
  }
}

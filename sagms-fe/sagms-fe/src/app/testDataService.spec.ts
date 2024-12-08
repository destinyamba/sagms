import { Component } from '@angular/core';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'testDataService',
  standalone: true,
  providers: [DataService],
  imports: [CommonModule],
  templateUrl: 'testDataService.component.html',
})
export class TestDataServiceComponent {
  testOutput: string[] = [];
  firstBusinessList: any[] = [];
  secondBusinessList: any[] = [];
  constructor(
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.testArtworksFetched();
    this.testPagesOfBusinesses();
    this.testGetArtworkReviews();
  }

  private testArtworksFetched() {
    this.dataService.getArtworks(1).subscribe({
      next: (response: any) => {
        const artworks = response.artworks || response;
        if (
          Array.isArray(artworks) &&
          artworks.length === this.dataService.pageSize
        ) {
          this.testOutput.push('Page of businesses fetched... PASS');
        } else {
          this.testOutput.push('Page of businesses fetched... FAIL');
        }
      },
      error: (error: any) =>
        console.error('Error fetching artworks for test', error),
    });
  }

  private testPagesOfBusinesses() {
    this.dataService.getArtworks(1).subscribe({
      next: (response: any) => {
        this.firstBusinessList = response.artworks;
        this.dataService.getArtworks(2).subscribe({
          next: (response: any) => {
            this.secondBusinessList = response.artworks;
            if (
              this.firstBusinessList[0]['_id'] !=
              this.secondBusinessList[0]['_id']
            ) {
              this.testOutput.push(
                'Different pages of businesses fetched... PASS'
              );
            } else {
              this.testOutput.push(
                'Different pages of businesses fetched... FAIL'
              );
            }
          },
          error: (error: any) =>
            console.error('Error fetching artworks for test', error),
        });
      },
      error: (error: any) => {
        console.error('API error:', error);
        this.testOutput.push('Page of businesses fetched... FAIL');
      },
    });
  }

  private testGetArtworkReviews() {
    this.dataService
      .getArtworkReviews('67112847eaf172ac8eb0f952', 1)
      .subscribe({
        next: (response: any) => {
          if (Array.isArray(response.reviews)) {
            this.testOutput.push('Fetch reviews of Artwork... PASS');
          } else {
            this.testOutput.push('Fetch reviews of Artwork... FAIL');
          }
        },
        error: (error: any) => {
          console.error('Error fetching artwork reviews:', error);
        },
      });
  }
}

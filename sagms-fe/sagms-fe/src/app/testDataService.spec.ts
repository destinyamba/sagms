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
  firstArtworkList: any[] = [];
  secondArtworkList: any[] = [];
  firstExhibitionList: any[] = [];
  secondExhibitionList: any[] = [];
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.testArtworksFetched();
    this.testExhibitionsFetched();
    this.testPagesOfArtworks();
    this.testPagesOfExhibitions();
    this.testGetArtworkReviews();
    this.testGetExhibitionReviews();
    this.testGetArtwork();
    this.testGetExhibition();
  }

  private testArtworksFetched() {
    this.dataService.getArtworks(1).subscribe({
      next: (response: any) => {
        const artworks = response.artworks || response;
        if (
          Array.isArray(artworks) &&
          artworks.length === this.dataService.pageSize
        ) {
          this.testOutput.push('Page of artworks fetched... PASS');
        } else {
          this.testOutput.push('Page of artworks fetched... FAIL');
        }
      },
      error: (error: any) =>
        console.error('Error fetching artworks for test', error),
    });
  }

  private testExhibitionsFetched() {
    this.dataService.getExhibitions(1).subscribe({
      next: (response: any) => {
        const exhibitions = response.exhibitions || response;
        if (
          Array.isArray(exhibitions) &&
          exhibitions.length === this.dataService.pageSize
        ) {
          this.testOutput.push('Page of exhibitions fetched... PASS');
        } else {
          this.testOutput.push('Page of exhibitions fetched... FAIL');
        }
      },
      error: (error: any) =>
        console.error('Error fetching exhibitions for test', error),
    });
  }

  private testPagesOfArtworks() {
    this.dataService.getArtworks(1).subscribe({
      next: (response: any) => {
        this.firstArtworkList = response.artworks;
        this.dataService.getArtworks(2).subscribe({
          next: (response: any) => {
            this.secondArtworkList = response.artworks;
            if (
              this.firstArtworkList[0]['_id'] !=
              this.secondArtworkList[0]['_id']
            ) {
              this.testOutput.push(
                'Different pages of artworks fetched... PASS'
              );
            } else {
              this.testOutput.push(
                'Different pages of artworks fetched... FAIL'
              );
            }
          },
          error: (error: any) =>
            console.error('Error fetching artworks for test', error),
        });
      },
      error: (error: any) => {
        console.error('API error:', error);
        this.testOutput.push('Page of artworks fetched... FAIL');
      },
    });
  }

  private testPagesOfExhibitions() {
    this.dataService.getExhibitions(1).subscribe({
      next: (response: any) => {
        this.firstExhibitionList = response;
        this.dataService.getExhibitions(2).subscribe({
          next: (response: any) => {
            this.secondExhibitionList = response;
            if (
              this.firstExhibitionList[0]['_id'] !=
              this.secondExhibitionList[0]['_id']
            ) {
              this.testOutput.push(
                'Different pages of exhibitions fetched... PASS'
              );
            } else {
              this.testOutput.push(
                'Different pages of exhibitions fetched... FAIL'
              );
            }
          },
          error: (error: any) =>
            console.error('Error fetching exhibitions for test', error),
        });
      },
      error: (error: any) => {
        console.error('API error:', error);
        this.testOutput.push('Page of exhibitions fetched... FAIL');
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

  private testGetExhibitionReviews() {
    this.dataService
      .getExhibitionReviews('6720086a4614f216533d0532', 1)
      .subscribe({
        next: (response: any) => {
          if (Array.isArray(response.reviews)) {
            this.testOutput.push('Fetch reviews of Exhibition... PASS');
          } else {
            this.testOutput.push('Fetch reviews of Exhibition... FAIL');
          }
        },
        error: (error: any) => {
          console.error('Error fetching exhibition reviews:', error);
        },
      });
  }

  private testGetArtwork() {
    this.dataService.getArtworkById('67112847eaf172ac8eb0f952').subscribe({
      next: (response: any) => {
        if (response.title === 'Luminescence of Solitude') {
          this.testOutput.push('Fetch artwork by ID... PASS');
        } else {
          this.testOutput.push('Fetch artwork by ID... FAIL');
        }
      },
    });
  }
  private testGetExhibition() {
    this.dataService.getExhibitionById('6720086a4614f216533d0532').subscribe({
      next: (response: any) => {
        if (response.title === 'The Power of Color') {
          this.testOutput.push('Fetch exhibition by ID... PASS');
        } else {
          this.testOutput.push('Fetch exhibition by ID... FAIL');
        }
      },
    });
  }
}

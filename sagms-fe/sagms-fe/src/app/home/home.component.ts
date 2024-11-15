import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Exhibition, TopExhibition } from '../../types';
import { DataService } from '../data.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [DatePipe],
})
export class HomeComponent implements OnInit {
  recentExhibitions: Exhibition[] = [];
  topExhibitions: TopExhibition[] = [];
  totalExhibitions: number = 0;
  monthlyVisitors: number = 0;
  activeArtists: number = 0;
  artworkImage: string = '';

  constructor(private datePipe: DatePipe, private dataService: DataService) {}

  ngOnInit() {
    this.loadTopExhibitions();
    this.loadMostRecentExhibitions();
  }

  private loadTopExhibitions() {
    this.dataService.getTopRatedtExhibitions().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data)) {
          // Map each exhibition to include its image by fetching additional details
          this.topExhibitions = data.map((exhibition) => ({
            ...exhibition,
            image: '', // Placeholder for the artwork image
          }));

          // Fetch detailed data for each exhibition to get the artwork image
          this.topExhibitions.forEach((exhibition, index) => {
            this.dataService
              .getExhibitionById(exhibition.exhibition_id)
              .subscribe(
                (exhibitionData) => {
                  const firstArtworkId = exhibitionData.artworks[0];
                  this.dataService.getArtworkById(firstArtworkId).subscribe(
                    (artworkData) => {
                      this.topExhibitions[index].image = artworkData.images;
                    },
                    (error) =>
                      console.error(
                        `Error fetching artwork for exhibition ${exhibition.exhibition_id}`,
                        error
                      )
                  );
                },
                (error) =>
                  console.error(
                    `Error fetching details for exhibition ${exhibition.exhibition_id}`,
                    error
                  )
              );
          });
        }
      },
      error: (error: any) =>
        console.error('Error fetching top exhibitions', error),
    });
  }

  private loadMostRecentExhibitions() {
    this.dataService.getMostRecentExhibitions().subscribe({
      next: (exhibitions: any) => {
        if (exhibitions.length > 0) {
          this.recentExhibitions = []; // Initialize as an empty array

          exhibitions.forEach((exhibition: any) => {
            // Fetch the full exhibition details by ID
            this.dataService.getExhibitionById(exhibition._id).subscribe(
              (exhibitionData) => {
                this.recentExhibitions.push(exhibitionData); // Add each exhibition to the array

                // Get the first artwork ID and fetch the artwork image for each exhibition
                const firstArtworkId = exhibitionData.artworks[0];
                this.dataService.getArtworkById(firstArtworkId).subscribe(
                  (artworkData) => {
                    exhibitionData.artworkImage = artworkData.images; // Assign the image to each exhibition
                  },
                  (error) => console.error('Error fetching artwork data', error)
                );
              },
              (error) => console.error('Error fetching exhibition data', error)
            );
          });
        }
      },
      error: (error: any) => console.error('Error fetching exhibitions', error),
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
}

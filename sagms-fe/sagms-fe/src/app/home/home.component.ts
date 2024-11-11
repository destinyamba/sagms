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
            image: ''  // Placeholder for the artwork image
          }));
  
          // Fetch detailed data for each exhibition to get the artwork image
          this.topExhibitions.forEach((exhibition, index) => {
            this.dataService.getExhibitionById(exhibition.exhibition_id).subscribe(
              (exhibitionData) => {
                const firstArtworkId = exhibitionData.artworks[0];
                this.dataService.getArtworkById(firstArtworkId).subscribe(
                  (artworkData) => {
                    this.topExhibitions[index].image = artworkData.images[0];
                  },
                  (error) => console.error(`Error fetching artwork for exhibition ${exhibition.exhibition_id}`, error)
                );
              },
              (error) => console.error(`Error fetching details for exhibition ${exhibition.exhibition_id}`, error)
            );
          });
        }
      },
      error: (error: any) => console.error('Error fetching top exhibitions', error),
    });
  }
  

  private loadMostRecentExhibitions() {
    this.dataService.getMostRecentExhibitions().subscribe({
      next: (exhibitions: any) => {
        if (exhibitions.length > 0) {
          const recentExhibitionId = exhibitions[0]._id;

          // Fetch the full exhibition details by ID
          this.dataService.getExhibitionById(recentExhibitionId).subscribe(
            (exhibitionData) => {
              this.recentExhibitions = [exhibitionData]; // Wrap in array

              // Get the first artwork ID and fetch the artwork image
              const firstArtworkId = exhibitionData.artworks[0];
              this.dataService.getArtworkById(firstArtworkId).subscribe(
                (artworkData) => {
                  this.artworkImage = artworkData.images[0];
                },
                (error) => console.error('Error fetching artwork data', error)
              );
            },
            (error) => console.error('Error fetching exhibition data', error)
          );
        }
      },
      error: (error: any) => console.error('Error fetching exhibitions', error),
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
}

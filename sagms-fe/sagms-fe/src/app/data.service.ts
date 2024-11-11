import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1.0';
  pageSize = 12;

  constructor(private http: HttpClient) {}

  // ARTWORKS

  getArtworks(page: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/artworks?pn=${page}&ps=12`);
  }

  getArtworkById(id: string): Observable<any> {
    const artwork = this.http.get<any>(`${this.apiUrl}/artworks/${id}`);
    return artwork ? artwork : throwError(() => new Error('Artwork not found'));
  }

  getTotalArtworks(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalArtworks`);
  }

  getAvgArtworksRating(page: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/artworks/average_rating?ps=12&pn=${page}`
    );
  }

  // EXHIBITIONS

  getExhibitions(page: number) {
    return this.http.get(`${this.apiUrl}/exhibitions?pn=${page}&ps=12`);
  }

  getExhibitionById(id: string): Observable<any> {
    const exhibition = this.http.get(`${this.apiUrl}/exhibitions/${id}`);
    return exhibition
      ? exhibition
      : throwError(() => new Error('Exhibition not found'));
  }

  getTotalExhibitions() {
    return this.http.get<number>(`${this.apiUrl}/totalExhibitions`);
  }

  getMostRecentExhibitions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/exhibitions/most-recent`);
  }

  getTopRatedtExhibitions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/exhibitions/top-rated`);
  }
}

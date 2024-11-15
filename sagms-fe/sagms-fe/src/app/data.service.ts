import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ReviewsResponse } from '../types';

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

  searchArtworks(title: string, page: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/artworks/search?title=${title}&pn=${page}&ps=12`
    );
  }

  filterArtworksByDimension(
    heightRange: { min: number; max: number },
    widthRange: { min: number; max: number },
    page: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('ps', '12')
      .set('pn', page.toString())
      .set('height_min', heightRange.min.toString())
      .set('height_max', heightRange.max.toString())
      .set('width_min', widthRange.min.toString())
      .set('width_max', widthRange.max.toString());

    return this.http.get<any>(
      `${this.apiUrl}/artworks/filter/dimensions?ps=12&pn=${page}`,
      { params }
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

  // ARTWORK REVIEWS

  getArtworkReviews(
    artwork_id: string,
    page: number
  ): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(
      `${this.apiUrl}/reviews/artwork/${artwork_id}?ps=5&pn=${page}`
    );
  }

  // EXHIBITION REVIEWS

  getExhibitionReviews(
    exhibition_id: string,
    page: number
  ): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(
      `${this.apiUrl}/reviews/exhibition/${exhibition_id}?ps=5&pn=${page}`
    );
  }
}

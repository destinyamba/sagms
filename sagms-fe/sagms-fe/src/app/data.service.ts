import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ReviewsResponse } from '../types';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://127.0.0.1:5000/api/v1.0';
  pageSize = 12;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // ARTWORKS

  getArtworks(page: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/artworks?pn=${page}&ps=12`);
  }

  getArtworkById(id: string): Observable<any> {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });
    const artwork = this.http.get<any>(`${this.apiUrl}/artworks/${id}`, {
      headers,
    });
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

  addArtwork(artistId: string, artworkData: any): Observable<any> {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Token is missing. User might not be authenticated.');
    }
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(
      `${this.apiUrl}/artworks/${artistId}`,
      artworkData,
      { headers }
    );
  }

  // edit an artwork
  editArtwork(
    artistId: string,
    artworkId: string,
    artworkData: any
  ): Observable<any> {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });

    return this.http.put<any>(
      `${this.apiUrl}/artworks/${artistId}/${artworkId}`,
      artworkData,
      { headers }
    );
  }

  deleteArtwork(artistId: string, artworkId: string) {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('Token is missing. User might not be authenticated.');
    }
    const headers = new HttpHeaders({
      'x-access-token': token,
      'Content-Type': 'application/json',
    });
    return this.http.delete<any>(
      `${this.apiUrl}/artworks/${artistId}/${artworkId}`,
      { headers }
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

  getArtistRelatedArtworks(artistId: string) {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });

    return this.http.get<any>(`${this.apiUrl}/artworks/related/${artistId}`, {
      headers,
    });
  }

  // EXHIBITIONS

  getExhibitions(page: number) {
    return this.http.get(`${this.apiUrl}/exhibitions?pn=${page}&ps=12`);
  }

  getExhibitionById(id: string): Observable<any> {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });
    const exhibition = this.http.get(`${this.apiUrl}/exhibitions/${id}`, {
      headers,
    });
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

  getCuratorRelatedExhibitions(curatorId: string) {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });

    return this.http.get<any>(
      `${this.apiUrl}/exhibitions/related/${curatorId}`,
      {
        headers,
      }
    );
  }

  createExhibition(exhibition: any, curatorId: string): Observable<any> {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });
    return this.http.post(
      `${this.apiUrl}/exhibitions/${curatorId}`,
      exhibition,
      {
        headers,
      }
    );
  }

  deleteExhibition(exhibitionId: string): Observable<any> {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });
    return this.http.delete(`${this.apiUrl}/exhibitions/${exhibitionId}`, {
      headers,
    });
  }
  // update exhibition

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

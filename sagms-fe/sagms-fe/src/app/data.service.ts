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

  /**
   * This initialises when the service is created.
   * @param http
   * @param authService
   */
  constructor(private http: HttpClient, private authService: AuthService) {}

  // ARTWORKS

  /**
   * Fetches a paginated list of artworks.
   * @param page - The page number.
   * @returns Observable containing the list of artworks.
   */
  getArtworks(page: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/artworks?pn=${page}&ps=12`);
  }

  /**
   * Fetches a specific artwork by its ID.
   * @param id - The artwork ID.
   * @returns Observable containing the artwork details or an error if not found.
   */
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

  /**
   * Fetches the total number of artworks.
   * @returns Observable containing the total artworks count.
   */
  getTotalArtworks(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/totalArtworks`);
  }

  /**
   * Fetches the average ratings of artworks for a specific page.
   * @param page - The page number.
   * @returns Observable containing an array of average ratings.
   */
  getAvgArtworksRating(page: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/artworks/average_rating?ps=12&pn=${page}`
    );
  }

  /**
   * Searches artworks by title with pagination.
   * @param title - The artwork title to search for.
   * @param page - The page number.
   * @returns Observable containing the search results.
   */
  searchArtworks(title: string, page: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/artworks/search?title=${title}&pn=${page}&ps=12`
    );
  }

  /**
   * Adds a new artwork.
   * @param artistId - The artist ID.
   * @param artworkData - The data of the artwork to add.
   * @returns Observable containing the response from the server.
   */
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

  /**
   * This edits the artwork.
   * @param artistId
   * @param artworkId
   * @param artworkData
   * @returns
   */
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

  /**
   * This deletes the artwork.
   * @param artistId
   * @param artworkId
   * @returns
   */
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

  /**
   * This filters artworks by dimensions.
   * @param heightRange
   * @param widthRange
   * @param page
   * @returns
   */
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

  /**
   * This gets artworks related to a specific artist.
   * @param artistId
   * @returns
   */
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

  /**
   * Fetches a paginated list of exhibition.
   * @param page - The page number.
   * @returns Observable containing the list of exhibition.
   */
  getExhibitions(page: number) {
    return this.http.get(`${this.apiUrl}/exhibitions?pn=${page}&ps=12`);
  }

  /**
   * Fetches a specific exhibition by its ID.
   * @param id - The exhibition ID.
   * @returns Observable containing the exhibition details or an error if not found.
   */
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

  /**
   * Fetches the total number of exhibitions.
   * @returns Observable containing the total exhibitions count.
   */
  getTotalExhibitions() {
    return this.http.get<number>(`${this.apiUrl}/totalExhibitions`);
  }

  /**
   * This gets the most recent exhibitions.
   * @returns
   */
  getMostRecentExhibitions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/exhibitions/most-recent`);
  }

  /**
   * This gets exhibtiions created by a curator.
   * @returns
   */
  getTopRatedtExhibitions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/exhibitions/top-rated`);
  }

  /**
   * This gets the exhibitions created by a curator.
   * @param curatorId
   * @returns
   */
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

  /**
   * This creates and exhibition.
   * @param exhibition
   * @param curatorId
   * @returns
   */
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

  /**
   * This deletes an exhibition.
   * @param exhibitionId
   * @returns
   */
  deleteExhibition(exhibitionId: string): Observable<any> {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });
    return this.http.delete(`${this.apiUrl}/exhibitions/${exhibitionId}`, {
      headers,
    });
  }

  /**
   * This edits an exhibition.
   * @param curatorId
   * @param exhibitionId
   * @param exhibitionData
   * @returns
   */
  editExhibition(
    curatorId: string,
    exhibitionId: string,
    exhibitionData: any
  ): Observable<any> {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });

    return this.http.put<any>(
      `${this.apiUrl}/exhibitions/${curatorId}/${exhibitionId}`,
      exhibitionData,
      { headers }
    );
  }

  // ARTWORK REVIEWS

  /**
   * This is used to get artwork reviews.
   * @param artwork_id
   * @param page
   * @returns
   */
  getArtworkReviews(
    artwork_id: string,
    page: number
  ): Observable<ReviewsResponse> {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });
    return this.http.get<ReviewsResponse>(
      `${this.apiUrl}/reviews/artwork/${artwork_id}?ps=5&pn=${page}`,
      { headers }
    );
  }

  /**
   * This function is used to create a new review for an artwork.
   * @param reviewerId
   * @param artworkId
   * @param reviewData
   * @returns
   */
  addArtworkReview(reviewerId: string, artworkId: string, reviewData: any) {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });
    return this.http.post(
      `${this.apiUrl}/reviews/artwork/${reviewerId}/${artworkId}`,
      reviewData,
      { headers }
    );
  }

  /**
   * This function is used to delete an artwork review.
   * @param artworkId
   * @param reviewId
   * @returns
   */
  deleteArtworkReview(artworkId: string, reviewId: string) {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });
    return this.http.delete(
      `${this.apiUrl}/reviews/artwork/${artworkId}/${reviewId}`,
      { headers }
    );
  }

  // EXHIBITION REVIEWS

  /**
   * This function retrieves exhibition reviews.
   * @param exhibition_id
   * @param page
   * @returns
   */
  getExhibitionReviews(
    exhibition_id: string,
    page: number
  ): Observable<ReviewsResponse> {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });
    return this.http.get<ReviewsResponse>(
      `${this.apiUrl}/reviews/exhibition/${exhibition_id}?ps=5&pn=${page}`,
      { headers }
    );
  }

  /**
   * This function adds a new exhibition review.
   * @param reviewerId
   * @param exhibitionId
   * @param reviewData
   * @returns
   */
  addExhibitionReview(
    reviewerId: string,
    exhibitionId: string,
    reviewData: any
  ) {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });
    return this.http.post(
      `${this.apiUrl}/reviews/exhibition/${reviewerId}/${exhibitionId}`,
      reviewData,
      { headers }
    );
  }

  /**
   * This deletes an exhibition review.
   * @param exhibitionId
   * @param reviewId
   * @returns
   */
  deleteExhibitionReview(exhibitionId: string, reviewId: string) {
    const token = this.authService.getToken() ?? '';
    const headers = new HttpHeaders({
      'x-access-token': token,
    });
    return this.http.delete(
      `${this.apiUrl}/reviews/exhibition/${exhibitionId}/${reviewId}`,
      { headers }
    );
  }
}

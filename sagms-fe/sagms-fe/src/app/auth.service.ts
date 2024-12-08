import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  private tokenKey = 'app_token';
  private apiUrl = 'http://127.0.0.1:5000/api/v1.0';
  private loggedIn = false;
  private logoutTimer: any;

  /**
   * This function initialises when the component loads.
   * @param http 
   */
  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.currentUserSubject.next(this.decodeToken(token));
      this.loggedIn = true;
      this.scheduleLogout(token);
    } else if (token) {
      this.logout();
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    const expirationTime = decoded.exp * 1000;
    return Date.now() > expirationTime;
  }

  // Schedule automatic logout when token expires
  scheduleLogout(token: string): void {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return;
    }
    const expirationTime = decoded.exp * 1000;
    const timeUntilExpiry = expirationTime - Date.now();

    if (timeUntilExpiry > 0) {
      this.logoutTimer = setTimeout(() => this.logout(), timeUntilExpiry);
    }
  }

  /**
   * This function is used to set the token from local storage.
   * @param username 
   * @param password 
   * @returns 
   */
  login(username: string, password: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/login`, {
        headers: {
          Authorization: 'Basic ' + btoa(`${username}:${password}`),
        },
      })
      .pipe(
        tap((response) => {
          if (response.token) {
            this.setToken(response.token);
            this.currentUserSubject.next(this.decodeToken(response.token));
            this.loggedIn = true;
            this.scheduleLogout(response.token);
          }
        })
      );
  }

  /**
   * This creates a user.
   * Only an admin can create a user.
   * @param userData 
   * @returns 
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, {
      headers: {
        'x-access-token': this.getToken() || '',
      },
    });
  }

  /**
   * This removes the token from local storage.
   */
  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  /**
   * This function is used to set the token from local storage.
   * @param token 
   */
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * This function is used to get the token from local storage.
   * @returns 
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * This function is used to remove the token.
   */
  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * This is used to decode the token.
   * @param token 
   * @returns 
   */
  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }

  /**
   * This function is used to get the user ID.
   * @returns 
   */
  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded ? decoded.user_id : null;
    }
    return null;
  }

  /**
   * This is used to get user role.
   * @returns 
   */
  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded ? decoded.role : null;
    }
    return null;
  }

  /**
   * This is used to check if the user is authenticated.
   * @returns 
   */
  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  /**
   * This is used to get the current user.
   * @returns 
   */
  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  /**
   * This is used to check if the user is an admin.
   * @returns 
   */
  isAdmin(): boolean {
    return this.loggedIn && this.getUserRole() === 'ADMIN';
  }
}

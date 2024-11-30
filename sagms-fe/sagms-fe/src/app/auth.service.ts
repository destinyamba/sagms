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

  constructor(private http: HttpClient) {
    // Check if token exists on service initialization
    const token = this.getToken();
    if (token) {
      this.currentUserSubject.next(this.decodeToken(token));
      this.loggedIn = true;
    }
  }

  // Login method
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
          }
        })
      );
  }

  // Register method (for admin to create users)
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData, {
      headers: {
        'x-access-token': this.getToken() || '',
      },
    });
  }

  // Logout method
  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  // Token management methods
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // Decode JWT token to get user info
  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded ? decoded.user_id : null;
    }
    return null;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded ? decoded.role : null;
    }
    return null;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  // Get current user
  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.loggedIn && this.getUserRole() === 'ADMIN';
  }
}

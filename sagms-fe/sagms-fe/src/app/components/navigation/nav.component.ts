import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Auth0ButtonComponent } from '../auth0Button/auth0Button.component';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'navigation',
  standalone: true,
  imports: [RouterOutlet, RouterModule, Auth0ButtonComponent, CommonModule],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  /**
   * This is a placeholder for the navigation component.
   * @param authService
   * @param router
   */
  constructor(public authService: AuthService, private router: Router) {}

  /**
   * This function is called when the user clicks on the logout button.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * This function is called to check if a user is an artist user.
   * @returns
   */
  isArtist() {
    return this.authService.getUserRole() === 'ARTIST';
  }

  /**
   * This function is called to check if a user is an curator user.
   * @returns
   */
  isCurator() {
    return this.authService.getUserRole() === 'CURATOR';
  }
}

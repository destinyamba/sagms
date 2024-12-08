import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'auth0-user-profile',
  templateUrl: 'auth0user.component.html',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
})
export class Auth0UserProfileComponent {
  /**
   * This component displays the user's profile information.
   * @param auth
   */
  constructor(public auth: AuthService) {}
}

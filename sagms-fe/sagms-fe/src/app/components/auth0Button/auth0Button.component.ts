import { AsyncPipe, CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'auth0-button',
  standalone: true,
  templateUrl: './auth0Button.component.html',
  imports: [AsyncPipe, CommonModule],
  providers: [Router],
})
export class Auth0ButtonComponent {
  /**
   * This component is used to render the Auth0 button.
   * @param document
   * @param auth
   * @param router
   */
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    public router: Router
  ) {}
}

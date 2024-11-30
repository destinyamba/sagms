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
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    public router: Router
  ) {}
}

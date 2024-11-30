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
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

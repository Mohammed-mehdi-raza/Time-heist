import { Component, EventEmitter, Output, inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private readonly router: Router) {}
   showLogoutDialog = false;

  @Output() logoutRequested = new EventEmitter<void>();

  private readonly authService = inject(AuthService);

  play(): void {
    this.router.navigate(['/game']);
  }

  howToPlay(): void {
    this.router.navigate(['/howToPlay']);
  }

  aboutUs(): void {
    this.router.navigate(['/about-us']);
  }

  profile(): void {
     this.router.navigate(['/profile']);
  }

  logout(): void {
    this.showLogoutDialog = true;
  }

  cancelLogout(): void {
    this.showLogoutDialog = false;
  }

  confirmLogout(): void {
    this.showLogoutDialog = false;
    this.authService.logout();
    this.logoutRequested.emit();
  }
}

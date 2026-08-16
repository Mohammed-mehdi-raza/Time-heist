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

  @Output() logoutRequested = new EventEmitter<void>();

  private readonly authService = inject(AuthService);

  play(): void {
    console.log('Play clicked');
    this.router.navigate(['/game']);
  }

  howToPlay(): void {
    console.log('How to Play clicked');
  }

  aboutUs(): void {
    console.log('About Us clicked');
  }

  profile(): void {
    console.log('Profile clicked');
  }

  logout(): void {
    this.authService.logout();
    this.logoutRequested.emit();
  }
}

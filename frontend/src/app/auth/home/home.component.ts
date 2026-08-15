import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  play(): void {
    console.log('Play clicked');
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
    console.log('Logout clicked');
  }

}

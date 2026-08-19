import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-auth-parent',
  standalone: true,
  imports: [LoginComponent, RegisterComponent, HomeComponent],
  templateUrl: './auth-parent.component.html',
  styleUrl: './auth-parent.component.scss'
})
export class AuthParentComponent implements OnInit {
  private readonly authService = inject(AuthService);

  flag: 'login' | 'register' | 'home' = 'login';

  ngOnInit(): void {
    this.flag = this.authService.isLoggedIn() ? 'home' : 'login';
  }

  switchToLogin(): void {
    this.flag = 'login';
  }

  switchToRegister(): void {
    this.flag = 'register';
  }

  switchToHome(): void {
    this.flag = 'home';
  }

  logoutFromHome(): void {
    this.authService.logout();
    this.flag = 'login';
  }
}


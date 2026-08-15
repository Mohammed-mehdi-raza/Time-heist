import { Component } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-auth-parent',
  standalone: true,
  imports: [LoginComponent, RegisterComponent],
  templateUrl: './auth-parent.component.html',
  styleUrl: './auth-parent.component.scss'
})
export class AuthParentComponent {
  flag: 'login' | 'register' = 'login';

  switchToLogin(): void {
    this.flag = 'login';
  }

  switchToRegister(): void {
    this.flag = 'register';
  }
}


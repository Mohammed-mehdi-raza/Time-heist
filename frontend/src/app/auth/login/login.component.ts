import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Output() registerRequested = new EventEmitter<void>();
  @Output() loggedIn = new EventEmitter<void>();

  private formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  switchToRegister(): void {
    this.registerRequested.emit();
  }

  isSubmitting = false;
  errorMessage = '';

  loginForm = this.formBuilder.nonNullable.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]
  });

  get username() {
    return this.loginForm.controls.username;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  login(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.loggedIn.emit();
      },
      error: error => {
        this.isSubmitting = false;
        this.errorMessage =
          error.error?.message ||
          error.error?.data?.message ||
          'Invalid username or password';
      }
    });
  }
}

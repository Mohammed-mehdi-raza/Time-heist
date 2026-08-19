import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @Output() loginRequested = new EventEmitter<void>();

  private formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  switchToLogin(): void {
    this.loginRequested.emit();
  }

  isSubmitting = false;

  registerForm = this.formBuilder.nonNullable.group(
    {
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50)
        ]
      ]
    }
  );

  get username() {
    return this.registerForm.controls.username;
  }

  get email() {
    return this.registerForm.controls.email;
  }

  get password() {
    return this.registerForm.controls.password;
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const request = this.registerForm.getRawValue();

    this.isSubmitting = true;

    this.authService.register(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.success('Registration successful! Redirecting to login...');
        this.registerForm.reset();

        setTimeout(() => {
          this.loginRequested.emit();
        }, 1200);
      },
      error: error => {
        this.isSubmitting = false;
        const errorMessage =
          error.error?.message || 'Registration failed';
        this.toastService.error(errorMessage);
      }
    });
  }
}

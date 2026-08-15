import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
  // private authService = inject(AuthService);

  switchToLogin(): void {
    this.loginRequested.emit();
  }

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  registerForm = this.formBuilder.nonNullable.group(
    {
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
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

  get name() {
    return this.registerForm.controls.name;
  }

  get email() {
    return this.registerForm.controls.email;
  }

  get password() {
    return this.registerForm.controls.password;
  }

  

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { ...request } =
      this.registerForm.getRawValue();

    this.isSubmitting = true;

    // this.authService.register(request).subscribe({
    //   next: () => {
    //     this.isSubmitting = false;
    //     this.successMessage =
    //       'Registration successful. Redirecting to login...';

    //     setTimeout(() => {
    //       this.router.navigate(['/login']);
    //     }, 1200);
    //   },
    //   error: error => {
    //     this.isSubmitting = false;
    //     this.errorMessage =
    //       error.error?.message || 'Registration failed';
    //   }
    // });
  }
}

import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Output() registerRequested = new EventEmitter<void>();

  private formBuilder = inject(FormBuilder);
  // private authService = inject(AuthService);

  switchToRegister(): void {
    this.registerRequested.emit();
  }

  isSubmitting = false;
  errorMessage = '';

  loginForm = this.formBuilder.nonNullable.group({
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
        Validators.minLength(6)
      ]
    ]
  });

  get email() {
    return this.loginForm.controls.email;
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

    // this.authService.login(this.loginForm.getRawValue()).subscribe({
    //   next: () => {
    //     this.isSubmitting = false;
    //     this.router.navigate(['/home']);
    //   },
    //   error: error => {
    //     this.isSubmitting = false;
    //     this.errorMessage =
    //       error.error?.message || 'Invalid email or password';
    //   }
    // });
  }
}

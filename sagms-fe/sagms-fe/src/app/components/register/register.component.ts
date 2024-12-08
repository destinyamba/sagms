import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class RegisterComponent {
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  /**
   * This is the form group for the registration form.
   */
  registerForm: FormGroup<{
    username: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    role: FormControl<string | null>;
    biography: FormControl<string | null>;
  }>;

  /**
   * This is the constructor for the RegisterComponent.
   * @param fb
   * @param authService
   */
  constructor(private fb: FormBuilder, private authService: AuthService) {
    // Initialize form
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['USER', Validators.required],
      biography: [''],
    });

    // Handle role changes
    this.registerForm.get('role')!.valueChanges.subscribe((role) => {
      const biographyControl = this.registerForm.get('biography')!;
      if (role === 'ARTIST') {
        biographyControl.setValidators(Validators.required);
      } else {
        biographyControl.clearValidators();
      }
      biographyControl.updateValueAndValidity();
    });
  }

  /**
   * This is the submit function for the registration form.
   * @returns
   */
  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Prepare form value
    const formValue = { ...this.registerForm.value };

    // Remove biography if not an artist
    if (formValue.role !== 'ARTIST') {
      delete formValue.biography;
    }

    // Submit the form
    this.authService.register(formValue).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'User registered successfully';
        this.registerForm.reset({ role: 'USER' });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed';
      },
    });
  }
}

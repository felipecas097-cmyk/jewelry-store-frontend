import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpAuth } from '../../../core/services/http-auth';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formData!: FormGroup;
  loginErrorMessage = '';
  showPassword = false;
  constructor(
    private httpAuth: HttpAuth,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.formData = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.loginErrorMessage = '';
    if (this.formData.valid) {
      this.httpAuth.login(this.formData.value).subscribe({
        next: (data: any) => {
          if (data.token && data.user) {
            // Login exitoso — navegar al dashboard (los guards manejan el acceso)
            this.formData.reset();
            this.router.navigate(['/dashboard']);
          } else if (data.msg) {
            // El backend devuelve 200 con { msg: '...' } cuando falla
            this.loginErrorMessage = data.msg;
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          console.error('Error de red:', error);
          this.loginErrorMessage = 'Error de conexión. Intenta de nuevo.';
          this.cdr.detectChanges();
        },
      });
    }
  }
}

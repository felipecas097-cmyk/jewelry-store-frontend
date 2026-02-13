import { Component } from '@angular/core';
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
  constructor(
    private httpAuth: HttpAuth,
    private router: Router,
  ) {
    this.formData = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      console.log(this.formData.value);

      this.httpAuth.login(this.formData.value).subscribe({
        next: (data) => {
          console.log('Login next callback - data:', data);
          console.log('data.token:', data.token);
          console.log('data.user:', data.user);
          if (data.token && data.user) {
            this.httpAuth.saveLocalStorageData(data.user, data.token);
            console.log('Datos guardados, redirigiendo a /dashboard...');
            this.formData.reset();
            this.router.navigate(['/dashboard']);
          } else {
            console.log('Condición falló - token o user es falsy');
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      console.log('Formulario no válido');
    }
  }
}

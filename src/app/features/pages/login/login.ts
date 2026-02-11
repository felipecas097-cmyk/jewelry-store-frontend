import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpAuth } from '../../../core/services/http-auth';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formData!: FormGroup;
  constructor(private httpAuth: HttpAuth) {
    this.formData = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required])
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      console.log(this.formData.value);

    this.httpAuth.login(this.formData.value).subscribe( {

      next: (data) => {
        console.log('Login successful:', data);

        localStorage.setItem('token', data.token);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
      complete: () => {
        console.log('Login request completed');
      }
    });
  } else {
      console.log('Formulario no válido');
    };
  }
}

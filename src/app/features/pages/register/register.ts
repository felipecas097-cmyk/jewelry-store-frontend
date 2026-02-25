import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpAuth } from '../../../core/services/http-auth';
// import { map, Observable } from 'rxjs';
// import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register implements OnInit {
  formData!: FormGroup;
  showPassword = false;

  constructor(
    private httpAuth: HttpAuth,
    private route: ActivatedRoute,
  ) {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [
        Validators.required /*Validators.NO SE COMO PONER QUE SI O SI SEA EN MINUSCULAS CON FUNCIONES TRAIDAS POR ANGULAR*/,
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      // TODO validar que el password tenga al menos una mayuscula, una minuscula, un numero y un caracter especial
      role: new FormControl('registered', [Validators.required]),
      userStatus: new FormControl(true, []),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['email']) {
        this.formData.patchValue({ email: params['email'] });
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.formData.valid) {
      this.httpAuth.register(this.formData.value).subscribe({
        next: (data) => {
          console.log('Usuario creado:', data);
          this.formData.reset();
        },
        error: (error) => {
          console.error('Error al crear el usuario:', error);
        },
        complete: () => {
          console.log('Solicitud completada');
        },
      });
    } else {
      console.log('Formulario no válido');
    }

    //Aquí puedes manejar el envío del formulario, por ejemplo, enviarlo a un servidor
  }
}

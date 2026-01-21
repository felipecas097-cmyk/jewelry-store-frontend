import { ChangeDetectionStrategy, Component, /*OnInit*/ } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpUser } from '../../../../core/services/http-users';
// import { map, Observable } from 'rxjs';
// import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-new-form',
  imports: [ReactiveFormsModule, /*AsyncPipe*/],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserNewForm {

  formData!: FormGroup

  constructor(
    private httpUser: HttpUser
  ){
    this.formData = new FormGroup({
      name: new FormControl('',[Validators.required]),
      username: new FormControl('',[Validators.required,/*Validators.NO SE COMO PONER QUE SI O SI SEA EN MINUSCULAS CON FUNCIONES TRAIDAS POR ANGULAR*/]),
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(6)]),
      // TODO validar que el password tenga al menos una mayuscula, una minuscula, un numero y un caracter especial
      role: new FormControl('registered',[Validators.required]),
      userStatus: new FormControl(true,[])
    });
  }

    onSubmit() {
      this.httpUser.createUser(this.formData.value).subscribe( {

        next: (data) => {
          console.log('Usuario creado:', data);
          this.formData.reset();
        },
        error: (error) => {
          console.error('Error al crear el usuario:', error);
        },
        complete: () => {
          console.log('Solicitud completada');
        }
      }); 

      //Aquí puedes manejar el envío del formulario, por ejemplo, enviarlo a un servidor
    }

      // ngOnChanges(): void {
  //   // Lógica a ejecutar cuando cambian las propiedades vinculadas a datos
  //   console.log('ngOnChanges')
  // }
  // ngOnDestroy(): void {
  //   // Lógica a ejecutar cuando se destruye el componente
  //   console.log('ngOnDestroy')
  // }
  // ngDoCheck(): void {
  //   // Lógica a ejecutar en cada ciclo de detección de cambios
  //   console.log('ngDoCheck')
  // }
  // ngAfterContentInit(): void {
  //   // Lógica a ejecutar después de inicializar el contenido del componente
  //   console.log('ngAfterContentInit')
  // }
  // ngAfterContentChecked(): void {
  //   // Lógica a ejecutar después de verificar el contenido del componente
  //   console.log('ngAfterContentChecked')
  // }
  // ngAfterViewInit(): void {
  //   // Lógica a ejecutar después de inicializar las vistas del componente
  //   console.log('ngAfterViewInit')
  // }
  // ngAfterViewChecked(): void {
  //   // Lógica a ejecutar después de verificar las vistas del componente
  //   console.log('ngAfterViewChecked')
  // }
}

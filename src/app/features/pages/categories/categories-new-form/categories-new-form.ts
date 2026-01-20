import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCategory } from '../../../../core/services/http-category';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-categories-new-form',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './categories-new-form.html',
  styleUrl: './categories-new-form.css',
})
export class CategoriesNewForm {
  categories: any[] = [];

  formData!: FormGroup

  constructor( private httpCategory: HttpCategory ) {
    this.formData = new FormGroup({
      name: new FormControl ('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl ('',[Validators.required,Validators.minLength(10)]),
      parent: new FormControl (''),
      isActive: new FormControl (true),
    });
  }

  onSubmit(){
    console.log(this.formData.value);
  }
  // Life Cicle Hooks
  ngOnInit(): void {
    // Lógica a ejecutar al inicializar el componente, solicita de datos, etc.
    // console.log('ngOnInit');
    this.httpCategory.getAllCategories().subscribe({
      next: (data) => {
        console.log(data)
        this.categories = data.categorys;
      },
      error: ( err ) => {
        console.error( err )
      },
      complete: () => {
        console.log('¡Solicitud completada!');
      },
    });
  }
  ngOnChanges(): void {
    // Lógica a ejecutar cuando cambian las propiedades vinculadas a datos
    console.log('ngOnChanges')
  }
  ngOnDestroy(): void {
    // Lógica a ejecutar cuando se destruye el componente
    console.log('ngOnDestroy')
  }
  ngDoCheck(): void {
    // Lógica a ejecutar en cada ciclo de detección de cambios
    console.log('ngDoCheck')
  }
  ngAfterContentInit(): void {
    // Lógica a ejecutar después de inicializar el contenido del componente
    console.log('ngAfterContentInit')
  }
  ngAfterContentChecked(): void {
    // Lógica a ejecutar después de verificar el contenido del componente
    console.log('ngAfterContentChecked')
  }
  ngAfterViewInit(): void {
    // Lógica a ejecutar después de inicializar las vistas del componente
    console.log('ngAfterViewInit')
  }
  ngAfterViewChecked(): void {
    // Lógica a ejecutar después de verificar las vistas del componente
    console.log('ngAfterViewChecked')
  }
}



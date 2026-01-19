import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpCategory } from '../../../../core/services/http-category';

@Component({
  selector: 'app-categories-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './categories-new-form.html',
  styleUrl: './categories-new-form.css',
})
export class CategoriesNewForm {
   edad: number = 0;   // Inferencia

  formData!: FormGroup

  constructor( private httpCategory: HttpCategory ) {
    this.formData = new FormGroup({
      name: new FormControl (''),
      description: new FormControl (''),
      parent: new FormControl (''),
      isActive: new FormControl (''),

    });
  }

  onSubmit(){
    console.log(this.formData.value);
  }
  // Life Cicle Hooks
  ngOnInit(): void {
    // Lógica a ejecutar al inicializar el componente, solicita de datos, etc.
    // console.log('ngOnInit');
    this.httpCategory.getAllCategories().subscribe( data => {
      console.log(data);
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



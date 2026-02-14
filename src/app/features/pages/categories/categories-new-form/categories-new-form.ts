import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCategory } from '../../../../core/services/http-category';
import { map, Observable } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-categories-new-form',
  imports: [ReactiveFormsModule, /*JsonPipe*/AsyncPipe],
  templateUrl: './categories-new-form.html',
  styleUrl: './categories-new-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesNewForm {
  categories!: Observable<any[]>;
  types: string[] = []

  formData!: FormGroup

  constructor( 
    private httpCategory: HttpCategory ) {
    this.formData = new FormGroup({
      name: new FormControl ('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl ('',[Validators.required,Validators.minLength(10)]),
      parent: new FormControl (''),
      isActive: new FormControl (true),
    });
  }

  onSubmit(){
    if (this.formData.invalid) {
      console.log('Formulario inválido');
      return;
    }
    
    console.log('Enviando categoría:', this.formData.value);
    
    this.httpCategory.createCategory(this.formData.value).subscribe({
      next: (response) => {
        console.log('Categoría creada exitosamente:', response);
        this.formData.reset({ isActive: true });
        // Recargar la lista de categorías
        this.categories = this.httpCategory.getAllCategories().pipe(
          map((data) => data.categorys)
        );
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
      }
    });
  }
  // Life Cicle Hooks
  ngOnInit(): void {
    // Lógica a ejecutar al inicializar el componente, solicita de datos, etc.
    // console.log('ngOnInit');
    this.categories = this.httpCategory.getAllCategories().pipe(
      map((data)=> data.categorys)
    )
    ;
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



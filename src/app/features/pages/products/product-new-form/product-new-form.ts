import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCategory } from '../../../../core/services/http-category';
import { HttpProduct } from '../../../../core/services/http-product';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
// import { validate } from '@angular/forms/signals';
@Component({
  selector: 'app-product-new-form',
  imports: [ReactiveFormsModule,AsyncPipe],
  templateUrl: './product-new-form.html',
  styleUrl: './product-new-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductNewForm implements OnInit { // eso del implements OnInit es idea de la IA, insiste en que debe ser usado

  categories!: Observable<any[]>;
  types: string[] = []

  formData!: FormGroup

  constructor(
    private httpCategory: HttpCategory,
    private httpProduct: HttpProduct
  ) {
    this.formData = new FormGroup({
      name: new FormControl('',[Validators.required]),
      category: new FormControl('',[]),
      description: new FormControl('',[]),
      price: new FormControl(0,[Validators.required,Validators.min(1),Validators.pattern("^[0-9]*$")]),
      stock: new FormControl(0,[Validators.required,Validators.min(1),Validators.pattern("^[0-9]*$")]),
      material: new FormControl('',[]),
      purity: new FormControl('',[]),
      color: new FormControl('',[]),
      weigthGrams: new FormControl(0, [Validators.required,Validators.min(1),Validators.pattern("^[0-9]*$")]),
      size: new FormControl('',[]),

      urlImage : new FormControl('',[]),
      
      gemstoneStatus: new FormControl(null,[]),
      gemstone: new FormControl('',[]),
      gemstoneCarats: new FormControl('',[]),


      certificateStatus: new FormControl(null,[]),
      certificate: new FormControl('',[]),
      certificateNumber: new FormControl('',[]),

      productStatus: new FormControl(false,[]),
    });
  }

  numberFilter(event: KeyboardEvent): void {
    const numberAllowed = /^[0-9.]$/;
    if (!numberAllowed.test(event.key)) {
      event.preventDefault();
    }
  }

  onSubmit() {
    // if (this.formData.valid) {
      console.log(this.formData.valid);
      this.httpProduct.createProduct(this.formData.value).subscribe( {

        next: (data) => {
          console.log('Producto creado:', data);
          this.formData.reset();
        },
        error: (error) => {
          console.error('Error al crear el producto:', error);
        },
        complete: () => {
          console.log('Solicitud completada');
        }
      }); 

      //Aquí puedes manejar el envío del formulario, por ejemplo, enviarlo a un servidor
    }

  ngOnInit(): void {
    // Lógica a ejecutar al inicializar el componente, solicita de datos, etc. 
    // console.log('ngOnInit');
    this.categories = this.httpCategory.getAllCategories().pipe(
      map((data) => data.categorys)
    );
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
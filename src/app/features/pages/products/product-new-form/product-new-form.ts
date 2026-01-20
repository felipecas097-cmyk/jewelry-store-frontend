import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCategory } from '../../../../core/services/http-category';
import { HttpProduct } from '../../../../core/services/http-product.ts';

@Component({
  selector: 'app-product-new-form',
  imports: [ReactiveFormsModule,],
  templateUrl: './product-new-form.html',
  styleUrl: './product-new-form.css',
})
export class ProductNewForm {

categories: any[] = [];

formData!: FormGroup

constructor(private httpCategory: HttpCategory,
    private httpProduct: HttpProduct
) {
  this.formData = new FormGroup({
    name: new FormControl('',[Validators.required, Validators.minLength(3)]),
    urlImage : new FormControl(''),
    category: new FormControl(''),  
    description: new FormControl(''),
    price: new FormControl(''),
    stock: new FormControl(0),
    isActive: new FormControl(false),
    material: new FormControl(0),
    purity: new FormControl(''),
    color: new FormControl(''),
    weigthGrams: new FormControl(0),
    size: new FormControl(''),
    gemstone: new FormControl(''),
    gemstoneCarats: new FormControl(''),
    certificate: new FormControl(''),
    certificateNumber: new FormControl(''),
    certificateStatus: new FormControl(false),
    productStatus: new FormControl(false),
    gemstoneStatus: new FormControl(false)
  });
}

  onSubmit() {
    if (this.formData.valid) {
      console.log(this.formData.value);
      this.httpProduct.createProduct(this.formData.value).subscribe( {

        next: (data) => {
          console.log('Producto creado:', data);
        },
        error: (error) => {
          console.error('Error al crear el producto:', error);
        },
        complete: () => {
          console.log('Solicitud completada');
          this.formData.reset();
        }
      }); 

      // Aquí puedes manejar el envío del formulario, por ejemplo, enviarlo a un servidor
    }
  }

  ngOnInit(): void {
    // Lógica a ejecutar al inicializar el componente, solicita de datos, etc.
    // console.log('ngOnInit');
    this.httpCategory.getAllCategories().subscribe( {
      next: (data: any) => {
        this.categories = data.categorys;
        console.log('Categorías cargadas:', this.categories);
      },
      error: (error: any) => {
        console.error('Error al cargar las categorías:', error);
      },
      complete: () => {
        console.log('Solicitud de categorías completada');
      } 
      
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

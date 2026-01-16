import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpCategory } from '../../../../core/services/http-category';

@Component({
  selector: 'app-product-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-new-form.html',
  styleUrl: './product-new-form.css',
})
export class ProductNewForm {
formData!: FormGroup

constructor(private httpCategory: HttpCategory
) {
  this.formData = new FormGroup({
    name: new FormControl(''),
    urlImage : new FormControl(''),
    category: new FormControl(''),  
    description: new FormControl(''),
    price: new FormControl(''),
    stock: new FormControl(0),
    isActive: new FormControl(true),
    material: new FormControl(''),
    purity: new FormControl(''),
    color: new FormControl(''),
    weightGrams: new FormControl(''),
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
    console.log(this.formData.value);
  }

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

import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-new-form.html',
  styleUrl: './product-new-form.css',
})
export class ProductNewForm {
formData!: FormGroup

constructor() {
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

  ngOnInit(): void{
    console.log('ngOnInit')
  }

  ngOnChanges(): void{
    console.log('ngOnChanges')
  }

  ngOnDestroy(): void{
    console.log('ngOnDestroy')
  }




















}

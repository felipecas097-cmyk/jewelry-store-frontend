import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HttpProduct } from '../../../core/services/http-products.ts';

@Component({
  selector: 'app-collections-new-form',
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe],
  templateUrl: './collections-new-form.html',
  styleUrl: './collections-new-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionsNewForm {
  formData!: FormGroup;

  public products: Observable <{}> =new Observable <{}>();

  private refreshProductsTrigger$: BehaviorSubject <void> = new
  BehaviorSubject <void>(undefined);

  constructor(  
    private httpProducts: HttpProduct
  ) {
    this.formData = new FormGroup({
      name: new FormControl ('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl ('',[Validators.required,Validators.minLength(10)]),
      products: new FormArray([]),
      isActive: new FormControl (true),
    });
  }


 ngOnInit(): void {
  
  this.products = this.refreshProductsTrigger$.pipe (
    switchMap(() => this.httpProducts.getProductsGroupedByCategory()  ),
    map(data =>
      Object.entries(data).map(([key, value]) => ({ key, value }))
    )
  )

 }

 get productsArray(): FormArray {
  return this.formData.get('products') as FormArray;
}

onCheckboxChange(event: any, productId: string) {

  if (event.target.checked) {
    this.productsArray.push(new FormControl(productId));
  } else {

    const index = this.productsArray.controls
      .findIndex(x => x.value === productId);

    this.productsArray.removeAt(index);
  }

}

 onSubmit () {
  console.log(this.formData.value)
 }

}
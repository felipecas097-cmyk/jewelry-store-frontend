import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-categories-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './categories-new-form.html',
  styleUrl: './categories-new-form.css',
})
export class CategoriesNewForm {
  formData!: FormGroup

  constructor() {
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

}

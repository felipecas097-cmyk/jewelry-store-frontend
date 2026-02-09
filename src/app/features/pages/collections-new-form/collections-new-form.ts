import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpCollections } from '../../../core/services/http-collections';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-collections-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './collections-new-form.html',
  styleUrl: './collections-new-form.css',
})
export class CollectionsNewForm {
collections!: Observable<any[]>;
  types: string[] = []

  formData!: FormGroup

  constructor( 
    private httpCollections: HttpCollections ) {
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
    
    this.httpCollections.createCollection(this.formData.value).subscribe({
      next: (response) => {
        console.log('Categoría creada exitosamente:', response);
        this.formData.reset({ isActive: true });
        // Recargar la lista de categorías
        this.collections = this.httpCollections.getAllCollections().pipe(
          map((data) => data.collections)
        );
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
      }
    });
  }
}

 ngOnInit(): void {}


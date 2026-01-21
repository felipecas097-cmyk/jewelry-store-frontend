import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpProduct {
  constructor( private http: HttpClient ) {}

  createProduct(productData: any) {
    // Lógica para crear un nuevo producto
    // console.log(productData);
    return this.http.post('http://localhost:3000/api/v1/product', productData);
  }
}

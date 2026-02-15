import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpProduct {
  constructor(private http: HttpClient) {}

  createProduct(productData: any) {
    // Lógica para crear un nuevo producto
    // console.log(productData);
    return this.http.post('http://localhost:3000/api/v1/product', productData);
  }

  getAllProducts() {
    return this.http.get<any>('http://localhost:3000/api/v1/product').pipe(
      tap((data) => console.log('Products API response:', data)),
      map((data) => data.products || data),
    );
  }

  getProductsGroupedByCategory() {
    return this.http.get<any>('http://localhost:3000/api/v1/product/category').pipe(
      tap((data) => console.log(data)),
      map((data) => data.products),
    );
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class HttpProduct {
  private apiUrl = `${environment.apiUrl}/product`;

  constructor(private http: HttpClient) {}

  // Unified method to get products, optionally filtered by params (e.g. category)
  getProducts(params?: { category?: string }): Observable<Product[]> {
    let httpParams = new HttpParams();
    if (params?.category) {
      httpParams = httpParams.set('category', params.category);
    }

    return this.http
      .get<any>(this.apiUrl, { params: httpParams })
      .pipe(map((data) => data.products || data || []));
  }

  // Helper for creation
  createProduct(productData: any): Observable<any> {
    return this.http.post(this.apiUrl, productData);
  }

  // Specialized grouping endpoint (used in Collections Edit)
  getProductsGroupedByCategory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category`).pipe(map((data) => data.products || data));
  }

  // Get a single product by ID
  getProductById(id: string): Observable<Product> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((data) => data.productFound || data));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class HttpProduct {
  private apiUrl = 'http://localhost:3000/api/products'; // Adjust if port represents differently

  constructor(private http: HttpClient) {}

  // Fetch all products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Fetch products by category ID
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    // Assuming backend supports filtering by category query param or has a specific endpoint
    // If backend is generic: GET /products?category=ID
    return this.http.get<Product[]>(`${this.apiUrl}?category=${categoryId}`);
  }
}

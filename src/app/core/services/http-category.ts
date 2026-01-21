import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

interface Category {
  _id?: string;
  name: string;
  description: string;
  parent?: string | null;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpCategory {
  private apiUrl = 'http://localhost:3000/api/v1/category';

  constructor( private http: HttpClient ) {}

  getAllCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: Omit<Category, '_id'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
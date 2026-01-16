import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpCategory {

  constructor(private http: HttpClient) {}

  getAllCategories() {
    return this.http.get('http://localhost:3000/api/v1/categories');
  }
  
}

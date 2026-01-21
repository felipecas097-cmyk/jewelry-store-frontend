import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpUser {
  constructor( private http: HttpClient ) {}

  createUser(userData: any) {
    // Lógica para crear un nuevo usuario
    // console.log(userData);
    return this.http.post('http://localhost:3000/api/v1/user', userData);
  }
}
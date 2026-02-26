import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpUser {
  constructor(private http: HttpClient) {}

  createUser(userData: any) {
    // Lógica para crear un nuevo usuario
    // console.log(userData);
    return this.http.post(`${environment.apiUrl}/user`, userData);
  }
}

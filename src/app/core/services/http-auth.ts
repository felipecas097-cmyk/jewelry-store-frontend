import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpAuth {

  constructor(
    private http: HttpClient
  ){}
    register(credentials: {
      username: string,
      email: string,
      password: string}) {

        return this.http.post('http://localhost:3000/api/v1/auth/register', credentials);
    }

    login(credentials: {
      email: string,
      password: string}) {
        return this.http.post<{user: any,token: string}>('http://localhost:3000/api/v1/auth/login', credentials);
    }

}

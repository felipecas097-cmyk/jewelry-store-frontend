import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpProduct {
  private http = inject(HttpClient);

  // constructor( private http: HttpClient ) {}
}
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpProduct {
  private http = inject(HttpClient);

  getProductsGroupedByCategory() {
    return this.http.get<any>('http://localhost:3000/api/v1/product/category').pipe(
      tap( data => console.log( data ) ),
      map( data => data.products )
    )
  }
}
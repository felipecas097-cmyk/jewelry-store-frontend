import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HttpCollections {
   constructor (private httpClient: HttpClient) {}
  
  getAllCollection() {
    return this.httpClient.get <any> ( 'http://localhost:3000/api/v1/collection')
    .pipe(
      tap( data => console.log (data) ),
      map ( data => {
        return data.collections;
      }),
      catchError(error => of([]))
    );
  }  
}

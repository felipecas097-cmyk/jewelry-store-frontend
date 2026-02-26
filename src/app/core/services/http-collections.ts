import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class HttpCollections {
  constructor(private httpClient: HttpClient) {}

  getAllCollection() {
    return this.httpClient.get<any>(`${environment.apiUrl}/collection`).pipe(
      tap((data) => console.log(data)),
      map((data) => {
        return data.collections;
      }),
      catchError((error) => of([])),
    );
  }
}

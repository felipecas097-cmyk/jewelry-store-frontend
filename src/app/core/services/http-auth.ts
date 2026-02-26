import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HttpAuth {
  private currentUser = new BehaviorSubject<any | null>(null);
  private currentToken = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUser.asObservable();
  public currentToken$ = this.currentToken.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.getLocalStorageData();
  }
  register(credentials: { username: string; email: string; password: string }) {
    return this.http.post(`${environment.apiUrl}/auth/register`, credentials);
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((data) => {
        if (data.token && data.user) {
          this.currentToken.next(data.token);
          this.currentUser.next(data.user);
          this.saveLocalStorageData(data.user, data.token);
        }
      }),
    );
  }

  saveLocalStorageData(user: any, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentToken.next(token);
    this.currentUser.next(user);
  }

  getLocalStorageData() {
    const token = localStorage.getItem('token');
    this.currentToken.next(token ? token : null);

    const user = localStorage.getItem('user');
    this.currentUser.next(user ? JSON.parse(user) : null);

    return { token, user };
  }

  clearLocalStorageData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentToken.next(null);
    this.currentUser.next(null);
  }

  logout() {
    this.clearLocalStorageData();
    this.router.navigate(['/login']);
  }

  checkAuthStatus(): Observable<boolean> {
    const { token } = this.getLocalStorageData();
    if (!token) {
      this.clearLocalStorageData();
      return of(false);
    }

    return this.http.get<any>(`${environment.apiUrl}/auth/renew-token`).pipe(
      map((resp) => {
        if (!resp.token && !resp.user) {
          return false;
        }
        this.saveLocalStorageData(resp.user, resp.token);
        return true;
      }),
      catchError((error) => {
        console.error(`Error al renovar el token: ${error}`);
        return of(false);
      }),
    );
  }
}

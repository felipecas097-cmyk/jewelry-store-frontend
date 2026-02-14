import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    return this.http.post('http://localhost:3000/api/v1/auth/register', credentials);
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>('http://localhost:3000/api/v1/auth/login', credentials).pipe(
      tap((data) => {
        if (data.token && data.user) {
          this.currentToken.next(data.token);
          this.currentUser.next(data.user);
          this.saveLocalStorageData(data.user, data.token);
          if (data.user.role === 'admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        }
      }),
    );
  }

  saveLocalStorageData(user: any, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
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

    const headers = new HttpHeaders().set('X-Token', token);

    return this.http.get<any>('http://localhost:3000/api/v1/auth/renew-token', { headers }).pipe(
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

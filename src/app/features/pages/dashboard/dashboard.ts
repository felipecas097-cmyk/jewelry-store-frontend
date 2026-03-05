import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpAuth } from '../../../core/services/http-auth';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  user: any = null;

  get isAdmin(): boolean {
    // user.roles siempre es un array: ['registered', 'cliente'] mínimo
    return this.user?.roles?.includes('admin') ?? false;
  }

  constructor(private httpAuth: HttpAuth) {
    this.httpAuth.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.httpAuth.logout();
  }
}

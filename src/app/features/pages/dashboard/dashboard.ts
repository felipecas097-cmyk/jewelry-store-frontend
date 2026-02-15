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
    if (!this.user) return false;
    // Support both old 'role' (string) and new 'roles' (array) format
    if (this.user.roles && Array.isArray(this.user.roles)) {
      return this.user.roles.includes('admin');
    }
    return this.user.role === 'admin';
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

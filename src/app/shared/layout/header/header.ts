import { Component, HostListener, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpAuth } from '../../../core/services/http-auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  showSearch = false;
  searchQuery = '';
  user: any = null;
  showUserDropdown = false;

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      this.searchQuery = '';
    }
  }

  search() {
    if (this.searchQuery.trim()) {
      console.log('Buscando:', this.searchQuery);
      // TODO: Implementar lógica de búsqueda
    }
  }

  constructor(
    private httpAuth: HttpAuth,
    private router: Router,
    private elementRef: ElementRef,
  ) {
    this.httpAuth.currentUser$.subscribe((user) => {
      this.user = user;
    });
  }

  onUserIconClick() {
    if (this.user) {
      this.showUserDropdown = !this.showUserDropdown;
    } else {
      this.router.navigate(['/login']);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const wrapper = this.elementRef.nativeElement.querySelector('.user-icon-wrapper');
    if (wrapper && !wrapper.contains(event.target)) {
      this.showUserDropdown = false;
    }
  }

  onLogout() {
    this.showUserDropdown = false;
    this.httpAuth.logout();
    this.router.navigate(['/login']);
  }
}

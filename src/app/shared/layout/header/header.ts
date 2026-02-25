import {
  Component,
  HostListener,
  ElementRef,
  ChangeDetectorRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpAuth } from '../../../core/services/http-auth';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnDestroy {
  showSearch = false;
  searchQuery = '';
  user: any = null;
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();
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
    this.httpAuth.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

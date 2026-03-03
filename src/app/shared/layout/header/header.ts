/**
 * ============================================================
 * HEADER — Componente del Header Principal
 * ============================================================
 *
 * Este componente maneja:
 * 1. El logo y navegación principal (categorías)
 * 2. La barra de búsqueda global (busca productos por nombre)
 * 3. Dropdown de perfil de usuario (con estilos premium)
 * 4. Iconos de favoritos y carrito (con badge de conteo)
 * 5. Botón para ir al Dashboard (solo visible para admins)
 */
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
import { HttpCart } from '../../../core/services/http-cart';
import { HttpProduct } from '../../../core/services/http-product';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../../core/models/product.interface';

import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule, DecimalPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnDestroy {
  showSearch = false;
  searchQuery = '';
  user: any = null;
  /** Resultados de la búsqueda en tiempo real */
  searchResults: Product[] = [];
  /** Flag para saber si se está buscando */
  isSearching = false;
  /** Flag para saber si el usuario es admin */
  isAdmin = false;

  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();
  showUserDropdown = false;
  cartCount = 0;

  /**
   * toggleSearch — Abre/cierra la barra de búsqueda.
   * Al abrir, limpia la query y los resultados anteriores.
   */
  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      this.searchQuery = '';
      this.searchResults = [];
    }
  }

  /**
   * search — Busca productos cuyo nombre contenga la query.
   *
   * ¿CÓMO FUNCIONA?
   * 1. Obtiene TODOS los productos del backend (sin filtro de categoría)
   * 2. Filtra en el frontend los que contengan el texto buscado
   * 3. Los muestra como resultados debajo de la barra de búsqueda
   * 4. Al hacer clic en un resultado, navega al detalle del producto
   *
   * Esto permite buscar libremente SIN restricción de categoría.
   */
  search() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;

    // Obtener TODOS los productos (sin filtro de categoría)
    this.httpProduct.getProducts().subscribe({
      next: (products) => {
        // Filtrar por nombre que contenga la búsqueda (case-insensitive)
        this.searchResults = products.filter((p) => p.name.toLowerCase().includes(query));
        this.isSearching = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.searchResults = [];
        this.isSearching = false;
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * goToProduct — Navega a la página de detalle del producto seleccionado.
   * Cierra la barra de búsqueda después de navegar.
   */
  goToProduct(productId: string) {
    this.showSearch = false;
    this.searchResults = [];
    this.searchQuery = '';
    this.router.navigate(['/product', productId]);
  }

  constructor(
    private httpAuth: HttpAuth,
    private httpCart: HttpCart,
    private httpProduct: HttpProduct,
    private router: Router,
    private elementRef: ElementRef,
  ) {
    // Suscribir al estado de usuario
    this.httpAuth.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;
      // Verificar si es admin para mostrar el botón de Dashboard
      if (user?.roles && Array.isArray(user.roles)) {
        this.isAdmin = user.roles.includes('admin');
      } else {
        this.isAdmin = user?.role === 'admin';
      }
      // Si hay usuario logueado, cargar el conteo del carrito
      if (user) {
        this.httpCart.getCart().subscribe();
      }
    });
    // Suscribir al conteo de items del carrito
    this.httpCart.cartCount$.pipe(takeUntil(this.destroy$)).subscribe((count) => {
      this.cartCount = count;
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

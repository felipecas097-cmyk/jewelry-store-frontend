/**
 * ============================================================
 * FAVORITES PAGE - Página de Lista de Favoritos
 * ============================================================
 *
 * Muestra todos los productos que el usuario ha marcado como favoritos.
 * Usa el componente app-product-card para mostrarlos en un grid reutilizable.
 */
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpFavorite } from '../../../core/services/http-favorite';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, ProductCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  favorites: any = null;
  loading = true;

  constructor(private httpFavorite: HttpFavorite) {}

  ngOnInit() {
    this.loadFavorites();
  }

  private loadFavorites() {
    this.httpFavorite.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites = favorites;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  /** Quitar un producto de favoritos y recargar la lista */
  removeFavorite(productId: string) {
    this.httpFavorite.removeFavorite(productId).subscribe({
      next: (favorites) => {
        this.favorites = favorites;
      },
    });
  }
}

/**
 * ============================================================
 * HTTP FAVORITE - Servicio de Lista de Favoritos (Wishlist)
 * ============================================================
 *
 * ¿QUÉ HACE?
 * Se comunica con el backend en /api/v1/favorite para:
 *   - Obtener la lista de favoritos del usuario
 *   - Agregar un producto a favoritos
 *   - Eliminar un producto de favoritos
 *   - Vaciar toda la lista
 *
 * También mantiene un Set local de IDs de productos favoritos
 * para que la UI pueda verificar rápidamente si un producto
 * ya está en favoritos (sin hacer otra petición al backend).
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpFavorite {
  private apiUrl = `${environment.apiUrl}/favorite`;

  // Set de IDs de productos favoritos (para verificaciones rápidas en la UI)
  private favoriteIdsSubject = new BehaviorSubject<Set<string>>(new Set());
  public favoriteIds$ = this.favoriteIdsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Actualiza el Set local de IDs de favoritos.
   * Extrae los IDs del array de products que devuelve el backend.
   */
  private updateFavoriteIds(favorites: any) {
    const products = favorites?.products || [];
    // Los products pueden ser objetos populados o solo IDs (strings)
    const ids = new Set<string>(products.map((p: any) => (typeof p === 'string' ? p : p._id)));
    this.favoriteIdsSubject.next(ids);
  }

  /**
   * Verifica si un producto está en la lista de favoritos (localmente).
   * No hace petición al backend, usa el Set en memoria.
   */
  isFavorite(productId: string): boolean {
    return this.favoriteIdsSubject.value.has(productId);
  }

  /**
   * GET /api/v1/favorite
   * Obtiene toda la lista de favoritos del usuario.
   */
  getFavorites(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((data) => data.favorites),
      tap((favorites) => this.updateFavoriteIds(favorites)),
    );
  }

  /**
   * POST /api/v1/favorite
   * Agrega un producto a la lista de favoritos.
   * El backend no duplica si ya existe.
   */
  addFavorite(productId: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { productId }).pipe(
      map((data) => data.favorites),
      tap((favorites) => this.updateFavoriteIds(favorites)),
    );
  }

  /**
   * DELETE /api/v1/favorite/:productId
   * Elimina un producto de la lista de favoritos.
   */
  removeFavorite(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${productId}`).pipe(
      map((data) => data.favorites),
      tap((favorites) => this.updateFavoriteIds(favorites)),
    );
  }

  /**
   * DELETE /api/v1/favorite
   * Vacía toda la lista de favoritos.
   */
  clearFavorites(): Observable<any> {
    return this.http.delete<any>(this.apiUrl).pipe(
      map((data) => data.favorites),
      tap((favorites) => this.updateFavoriteIds(favorites)),
    );
  }
}

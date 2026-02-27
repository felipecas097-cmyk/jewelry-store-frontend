/**
 * ============================================================
 * HTTP CART - Servicio de Carrito de Compras
 * ============================================================
 *
 * ¿QUÉ HACE?
 * Se comunica con el backend en /api/v1/cart para:
 *   - Obtener el carrito del usuario
 *   - Agregar productos al carrito
 *   - Actualizar cantidades
 *   - Eliminar productos
 *   - Vaciar el carrito completo
 *
 * IMPORTANTE:
 * - Requiere que el usuario esté autenticado (rol 'cliente')
 * - El interceptor auth.interceptor.ts agrega el token automáticamente
 * - Emite el conteo de items via cartCount$ para que el header muestre el badge
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpCart {
  private apiUrl = `${environment.apiUrl}/cart`;

  // BehaviorSubject que emite la cantidad de items en el carrito
  // El header se suscribe a esto para mostrar el badge con el número
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Actualiza el conteo de items del carrito.
   * Se llama internamente después de cada operación exitosa.
   */
  private updateCartCount(cart: any) {
    const count = cart?.items?.length || 0;
    this.cartCountSubject.next(count);
  }

  /**
   * GET /api/v1/cart
   * Obtiene el carrito completo del usuario autenticado.
   */
  getCart(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((data) => data.cart),
      tap((cart) => this.updateCartCount(cart)),
    );
  }

  /**
   * POST /api/v1/cart
   * Agrega un producto al carrito.
   * @param productId - ID de MongoDB del producto
   * @param quantity - Cantidad a agregar (default: 1)
   */
  addToCart(productId: string, quantity: number = 1): Observable<any> {
    return this.http.post<any>(this.apiUrl, { productId, quantity }).pipe(
      map((data) => data.cart),
      tap((cart) => this.updateCartCount(cart)),
    );
  }

  /**
   * PATCH /api/v1/cart/:productId
   * Actualiza la cantidad de un producto en el carrito.
   */
  updateQuantity(productId: string, quantity: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${productId}`, { quantity }).pipe(
      map((data) => data.cart),
      tap((cart) => this.updateCartCount(cart)),
    );
  }

  /**
   * DELETE /api/v1/cart/:productId
   * Elimina un producto específico del carrito.
   */
  removeFromCart(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${productId}`).pipe(
      map((data) => data.cart),
      tap((cart) => this.updateCartCount(cart)),
    );
  }

  /**
   * DELETE /api/v1/cart
   * Vacía completamente el carrito.
   */
  clearCart(): Observable<any> {
    return this.http.delete<any>(this.apiUrl).pipe(
      map((data) => data.cart),
      tap((cart) => this.updateCartCount(cart)),
    );
  }
}

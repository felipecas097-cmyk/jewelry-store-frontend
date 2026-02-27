/**
 * ============================================================
 * CART PAGE - Página del Carrito de Compras
 * ============================================================
 *
 * Muestra todos los productos que el usuario ha agregado al carrito.
 * Permite: ajustar cantidades (+/-), eliminar items, vaciar el carrito,
 * y ver el total acumulado.
 */
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpCart } from '../../../core/services/http-cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cart: any = null;
  loading = true;

  constructor(private httpCart: HttpCart) {}

  ngOnInit() {
    this.loadCart();
  }

  /** Carga el carrito desde el backend */
  private loadCart() {
    this.httpCart.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  /** Calcula el precio total de todos los items del carrito */
  get total(): number {
    if (!this.cart?.items?.length) return 0;
    return this.cart.items.reduce((sum: number, item: any) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }

  /** Formatea un número a pesos colombianos */
  formatPrice(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }

  /** Incrementar cantidad de un producto */
  increaseQuantity(item: any) {
    const newQty = item.quantity + 1;
    this.httpCart.updateQuantity(item.product._id, newQty).subscribe({
      next: (cart) => (this.cart = cart),
    });
  }

  /** Decrementar cantidad (mínimo 1) */
  decreaseQuantity(item: any) {
    if (item.quantity <= 1) return;
    const newQty = item.quantity - 1;
    this.httpCart.updateQuantity(item.product._id, newQty).subscribe({
      next: (cart) => (this.cart = cart),
    });
  }

  /** Eliminar un producto del carrito */
  removeItem(productId: string) {
    this.httpCart.removeFromCart(productId).subscribe({
      next: (cart) => (this.cart = cart),
    });
  }

  /** Vaciar todo el carrito */
  clearAll() {
    this.httpCart.clearCart().subscribe({
      next: (cart) => (this.cart = cart),
    });
  }
}

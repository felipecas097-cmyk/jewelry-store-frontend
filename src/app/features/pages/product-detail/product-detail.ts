/**
 * ============================================================
 * PRODUCT DETAIL - Componente de Detalle de Producto
 * ============================================================
 *
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Este es el "cerebro" de la página de detalle de un producto.
 * Cuando un usuario hace clic en una product-card, Angular lee
 * el ID del producto desde la URL (ej: /product/abc123) y este
 * componente se encarga de:
 *   1. Pedir los datos del producto al backend
 *   2. Formatear el precio en pesos colombianos
 *   3. Mostrar/ocultar secciones acordeón (descripción, características, etc.)
 *   4. Detectar si el usuario está logueado para mostrar/ocultar botones
 *   5. Agregar al carrito (llama al backend de cart)
 *   6. Agregar/quitar de favoritos (llama al backend de favorite)
 */

// Importaciones de Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
// Servicios que hablan con el backend
import { HttpProduct } from '../../../core/services/http-product';
import { HttpAuth } from '../../../core/services/http-auth';
import { HttpCart } from '../../../core/services/http-cart';
import { HttpFavorite } from '../../../core/services/http-favorite';
// Interfaz y RxJS
import { Product } from '../../../core/models/product.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit, OnDestroy {
  // ============================================================
  // PROPIEDADES
  // ============================================================
  product: Product | null = null;
  user: any = null;
  loading = true;
  activeSection: string | null = null;

  // Estado de favoritos: ¿este producto está en la lista del usuario?
  isFavorited = false;

  // Mensajes de feedback para el usuario
  cartMessage: string | null = null;
  favMessage: string | null = null;

  // Patrón takeUntil para limpiar suscripciones
  private destroy$ = new Subject<void>();

  // ============================================================
  // CONSTRUCTOR — Angular inyecta los servicios automáticamente
  // ============================================================
  constructor(
    private route: ActivatedRoute,
    private httpProduct: HttpProduct,
    private httpAuth: HttpAuth,
    private httpCart: HttpCart,
    private httpFavorite: HttpFavorite,
  ) {}

  // ============================================================
  // ngOnInit() — Se ejecuta al cargar el componente
  // ============================================================
  ngOnInit() {
    // Suscribirse al estado de autenticación
    this.httpAuth.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;
      // Si el usuario está logueado, cargar sus favoritos
      // para saber si este producto ya está marcado
      if (user && this.product) {
        this.checkIfFavorited();
      }
    });

    // Leer el :id de la URL y pedir el producto al backend
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.httpProduct.getProductById(id).subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
          // Si hay un usuario logueado, verificar si ya es favorito
          if (this.user) {
            this.checkIfFavorited();
          }
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================
  // GETTERS — Propiedades calculadas para el HTML
  // ============================================================

  /** Formatea precio: 454900 → "$ 454.900" */
  get formattedPrice(): string {
    if (!this.product) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(this.product.price);
  }

  /** Convierte código de material a nombre legible: "oro" → "Oro" */
  get materialLabel(): string {
    if (!this.product) return '';
    const labels: Record<string, string> = {
      oro: 'Oro',
      plata: 'Plata',
      acero: 'Acero',
      otro: 'Otro',
    };
    return labels[this.product.material] || this.product.material;
  }

  /** Texto descriptivo del stock */
  get stockLabel(): string {
    if (!this.product) return '';
    if (this.product.stock <= 0) return 'Agotado';
    if (this.product.stock <= 5) return `¡Últimas ${this.product.stock} unidades!`;
    return 'Disponible';
  }

  /** Clase CSS para el color del indicador de stock */
  get stockClass(): string {
    if (!this.product) return '';
    if (this.product.stock <= 0) return 'out-of-stock';
    if (this.product.stock <= 5) return 'low-stock';
    return 'in-stock';
  }

  // ============================================================
  // MÉTODOS
  // ============================================================

  /** Abre/cierra secciones del acordeón */
  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
  }

  /**
   * Verifica si el producto actual está en la lista de favoritos del usuario.
   * Usa el servicio HttpFavorite que mantiene un Set local de IDs favoritos.
   */
  private checkIfFavorited() {
    if (!this.product) return;
    // Cargar los favoritos para actualizar el Set interno
    this.httpFavorite.getFavorites().subscribe({
      next: () => {
        this.isFavorited = this.httpFavorite.isFavorite(this.product!._id);
      },
      error: () => {}, // Si falla, simplemente no marcamos como favorito
    });
  }

  /**
   * AÑADIR AL CARRITO
   * Llama al backend POST /api/v1/cart con { productId, quantity: 1 }
   * Muestra un mensaje de confirmación temporal.
   */
  onAddToCart() {
    if (!this.user || !this.product) return;

    this.httpCart.addToCart(this.product._id, 1).subscribe({
      next: () => {
        this.cartMessage = '¡Añadido al carrito! ✓';
        // El mensaje desaparece después de 3 segundos
        setTimeout(() => (this.cartMessage = null), 3000);
      },
      error: () => {
        this.cartMessage = 'Error al añadir al carrito';
        setTimeout(() => (this.cartMessage = null), 3000);
      },
    });
  }

  /**
   * TOGGLE FAVORITOS
   * Si ya es favorito → lo quita (DELETE /api/v1/favorite/:productId)
   * Si no es favorito → lo agrega (POST /api/v1/favorite)
   * El ícono del corazón cambia en tiempo real.
   */
  onToggleFavorite() {
    if (!this.user || !this.product) return;

    if (this.isFavorited) {
      // QUITAR de favoritos
      this.httpFavorite.removeFavorite(this.product._id).subscribe({
        next: () => {
          this.isFavorited = false;
          this.favMessage = 'Eliminado de favoritos';
          setTimeout(() => (this.favMessage = null), 3000);
        },
        error: () => {
          this.favMessage = 'Error al eliminar de favoritos';
          setTimeout(() => (this.favMessage = null), 3000);
        },
      });
    } else {
      // AGREGAR a favoritos
      this.httpFavorite.addFavorite(this.product._id).subscribe({
        next: () => {
          this.isFavorited = true;
          this.favMessage = '¡Añadido a favoritos! ♥';
          setTimeout(() => (this.favMessage = null), 3000);
        },
        error: () => {
          this.favMessage = 'Error al añadir a favoritos';
          setTimeout(() => (this.favMessage = null), 3000);
        },
      });
    }
  }
}

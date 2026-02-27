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
 *   4. Detectar si el usuario está logueado (para futuros botones de carrito/favoritos)
 *
 * PASO A PASO DE CÓMO FUNCIONA:
 *   1. Angular detecta que la URL es "/product/algún-id"
 *   2. El Router carga este componente (porque lo registramos en app.routes.ts)
 *   3. ngOnInit() se ejecuta automáticamente al cargar
 *   4. Leemos el ":id" de la URL con ActivatedRoute
 *   5. Llamamos a httpProduct.getProductById(id) para pedir los datos al backend
 *   6. Cuando llegan los datos, los guardamos en this.product
 *   7. El HTML se actualiza automáticamente porque Angular detecta el cambio
 */

// Paso 1: Importar las herramientas necesarias de Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
// ActivatedRoute: nos permite leer parámetros de la URL (como :id)
// RouterLink: nos permite usar [routerLink] en el HTML para navegar
import { ActivatedRoute, RouterLink } from '@angular/router';
// Nuestro servicio que habla con el backend de productos
import { HttpProduct } from '../../../core/services/http-product';
// Servicio de autenticación para saber si hay un usuario logueado
import { HttpAuth } from '../../../core/services/http-auth';
// La interfaz que define la "forma" de un producto (name, price, etc.)
import { Product } from '../../../core/models/product.interface';
// Subject y takeUntil: patrón para limpiar suscripciones y evitar fugas de memoria
import { Subject, takeUntil } from 'rxjs';

// Paso 2: Decorador @Component — le dice a Angular cómo tratar esta clase
@Component({
  selector: 'app-product-detail', // Nombre de la etiqueta HTML: <app-product-detail>
  standalone: true, // Componente independiente (no necesita un NgModule)
  imports: [RouterLink], // Módulos que usa el HTML de este componente
  templateUrl: './product-detail.html', // Archivo HTML con la vista
  styleUrl: './product-detail.css', // Archivo CSS con los estilos
})
export class ProductDetail implements OnInit, OnDestroy {
  // ============================================================
  // PROPIEDADES — Los "datos" que este componente maneja
  // ============================================================

  // El producto que estamos mostrando (null hasta que el backend responda)
  product: Product | null = null;

  // El usuario actual (null si no está logueado)
  user: any = null;

  // Bandera de carga: true mientras esperamos respuesta del backend
  loading = true;

  // Controla cuál sección del acordeón está abierta ('description', 'characteristics', etc.)
  activeSection: string | null = null;

  // Subject para limpiar suscripciones al destruir el componente (evita fugas de memoria)
  // Esto es el patrón "takeUntil" que ya usamos en el Header y Footer
  private destroy$ = new Subject<void>();

  // ============================================================
  // CONSTRUCTOR — Angular inyecta automáticamente estos servicios
  // ============================================================
  constructor(
    private route: ActivatedRoute, // Para leer el :id de la URL
    private httpProduct: HttpProduct, // Para pedir datos del producto al backend
    private httpAuth: HttpAuth, // Para saber si el usuario está logueado
  ) {}

  // ============================================================
  // ngOnInit() — Se ejecuta UNA VEZ cuando Angular crea el componente
  // ============================================================
  ngOnInit() {
    // Paso 3: Nos suscribimos al estado de autenticación
    // Esto es reactivo: si el usuario se loguea o desloguea, se actualiza automáticamente
    this.httpAuth.currentUser$
      .pipe(takeUntil(this.destroy$)) // Se auto-cancela cuando el componente se destruye
      .subscribe((user) => (this.user = user));

    // Paso 4: Leemos el parámetro ":id" de la URL
    // Si la URL es "/product/abc123", id será "abc123"
    const id = this.route.snapshot.paramMap.get('id');

    // Paso 5: Si hay un ID válido, pedimos el producto al backend
    if (id) {
      this.httpProduct.getProductById(id).subscribe({
        // Paso 6: Si el backend responde con éxito, guardamos el producto
        next: (product) => {
          this.product = product; // Angular actualizará el HTML automáticamente
          this.loading = false; // Quitamos el spinner de carga
        },
        // Si hay un error (producto no existe, backend caído, etc.)
        error: () => {
          this.loading = false; // Quitamos el spinner y mostramos "No encontrado"
        },
      });
    }
  }

  // ============================================================
  // ngOnDestroy() — Se ejecuta cuando Angular destruye el componente
  // (por ejemplo, cuando el usuario navega a otra página)
  // ============================================================
  ngOnDestroy() {
    // Emitimos un valor para que todas las suscripciones con takeUntil() se cancelen
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================
  // GETTERS — Propiedades calculadas que el HTML usa directamente
  // ============================================================

  /**
   * Formatea el precio numérico a formato colombiano.
   * Ejemplo: 454900 → "$ 454.900"
   * Intl.NumberFormat es una API nativa del navegador (no necesita librería externa)
   */
  get formattedPrice(): string {
    if (!this.product) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', // Formato de moneda
      currency: 'COP', // Pesos colombianos
      minimumFractionDigits: 0, // Sin decimales (no queremos "$ 454.900,00")
    }).format(this.product.price);
  }

  /**
   * Convierte el código de material del backend a un nombre legible.
   * El backend guarda "oro", "plata", etc. en minúsculas.
   * Este getter lo convierte a "Oro", "Plata" para mostrarlo bonito en la UI.
   */
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

  /**
   * Devuelve un texto descriptivo según el stock disponible.
   * - 0 unidades → "Agotado"
   * - 1-5 unidades → "¡Últimas X unidades!" (crea urgencia en el cliente)
   * - 6+ unidades → "Disponible"
   */
  get stockLabel(): string {
    if (!this.product) return '';
    if (this.product.stock <= 0) return 'Agotado';
    if (this.product.stock <= 5) return `¡Últimas ${this.product.stock} unidades!`;
    return 'Disponible';
  }

  /**
   * Devuelve una clase CSS según el stock, para pintar el indicador de color:
   * - "out-of-stock" → rojo
   * - "low-stock" → naranja
   * - "in-stock" → verde
   */
  get stockClass(): string {
    if (!this.product) return '';
    if (this.product.stock <= 0) return 'out-of-stock';
    if (this.product.stock <= 5) return 'low-stock';
    return 'in-stock';
  }

  // ============================================================
  // MÉTODOS — Funciones que el HTML llama cuando el usuario interactúa
  // ============================================================

  /**
   * Abre o cierra una sección del acordeón.
   * Si la sección ya está abierta, la cierra (pone null).
   * Si está cerrada, la abre (pone el nombre de la sección).
   * Esto se llama desde los botones en el HTML: (click)="toggleSection('description')"
   */
  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
  }

  /**
   * TODO: Lógica del carrito de compras.
   * Por ahora solo imprime en consola. Cuando implementemos el carrito
   * en el backend, aquí llamaremos al servicio correspondiente.
   */
  onAddToCart() {
    console.log('Add to cart:', this.product?._id);
  }

  /**
   * TODO: Lógica de favoritos.
   * Igual que el carrito, por ahora es solo visual.
   */
  onAddToFavorites() {
    console.log('Add to favorites:', this.product?._id);
  }
}

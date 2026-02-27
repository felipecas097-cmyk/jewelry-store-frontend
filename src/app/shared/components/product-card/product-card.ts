/**
 * ============================================================
 * PRODUCT CARD - Componente reutilizable de tarjeta de producto
 * ============================================================
 *
 * ¿QUÉ HACE ESTE COMPONENTE?
 * Es una "tarjeta" visual que muestra un producto en miniatura
 * (imagen, nombre, precio, categoría). Se usa en las páginas de
 * categoría como Rings, Necklaces, etc.
 *
 * ¿CÓMO SE USA?
 * Desde el HTML de otro componente (ej: rings.html):
 *   <app-product-card
 *     [name]="product.name"
 *     [price]="product.price"
 *     [image]="product.urlImage"
 *     [category]="product.category"
 *     [isNew]="product.isNew"
 *     [productId]="product._id"    ← NUEVO: para navegar a /product/:id
 *   />
 *
 * ¿QUÉ ES @Input()?
 * Es un decorador que permite recibir datos DESDE el componente padre.
 * Piénsalo como un "parámetro" del componente.
 * El padre dice [name]="product.name", y aquí lo recibimos con @Input() name.
 *
 * ¿QUÉ CAMBIÓ RECIENTEMENTE?
 * 1. Se agregó @Input() productId para recibir el _id del producto
 * 2. Se importó RouterLink para poder hacer [routerLink] en el HTML
 * 3. El HTML ahora envuelve toda la card en un <a> que navega a /product/:id
 */
import { Component, Input } from '@angular/core';
// RouterLink: directiva de Angular que permite usar [routerLink] en el template
// para navegar entre páginas sin recargar (navegación SPA)
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card', // Se usa como: <app-product-card ... />
  imports: [RouterLink], // Declaramos que el HTML usa routerLink
  templateUrl: './product-card.html', // Archivo con la estructura HTML
  styleUrl: './product-card.css', // Archivo con los estilos CSS
})
export class ProductCard {
  // Datos que recibe desde el componente padre con @Input()
  @Input() name: string = ''; // Nombre del producto
  @Input() price: number = 0; // Precio numérico
  @Input() image: string = ''; // URL de la imagen
  @Input() category: string = ''; // Nombre de la categoría
  @Input() isNew: boolean = false; // Si es nuevo (muestra badge "NUEVO")
  @Input() productId: string = ''; // ID de MongoDB, para navegar al detalle

  /**
   * Getter que formatea el precio a formato colombiano.
   * Se usa en el HTML como {{ formattedPrice }}
   * Ejemplo: 454900 → "$ 454.900"
   */
  get formattedPrice(): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(this.price);
  }
}

/**
 * ============================================================
 * HTTP PRODUCT - Servicio de comunicación con el backend de Productos
 * ============================================================
 *
 * ¿QUÉ ES UN SERVICIO EN ANGULAR?
 * Es una clase que contiene lógica reutilizable (como hacer peticiones HTTP).
 * Los componentes NO hablan directamente con el backend. En su lugar,
 * llaman a métodos de este servicio, y este servicio se encarga de
 * hacer la petición HTTP y devolver los datos.
 *
 * Componente → Servicio → Backend (HTTP) → MongoDB
 *
 * ¿POR QUÉ?
 * - Si la URL del backend cambia, solo la cambiamos aquí (en apiUrl)
 * - Varios componentes pueden reutilizar el mismo método
 * - Separación de responsabilidades (el componente solo muestra datos)
 *
 * ¿QUÉ ES @Injectable({ providedIn: 'root' })?
 * Le dice a Angular que este servicio es un "singleton": solo existe
 * UNA instancia en toda la aplicación. Todos los componentes que lo
 * inyecten reciben la MISMA instancia.
 */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
// environment contiene la URL base del backend (localhost en dev, IP de AWS en prod)
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
// Interfaz que define la "forma" del objeto producto (tipado TypeScript)
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class HttpProduct {
  // URL base para TODOS los endpoints de productos
  // En desarrollo: http://localhost:3000/api/v1/product
  // En producción: http://18.220.176.111:3000/api/v1/product
  private apiUrl = `${environment.apiUrl}/product`;

  // Angular inyecta HttpClient automáticamente (el que hace las peticiones HTTP)
  constructor(private http: HttpClient) {}

  /**
   * Obtener TODOS los productos, con filtro opcional por categoría.
   *
   * Usado por: Rings, Necklaces, Bracelets, Earrings (las páginas de categoría)
   *
   * Ejemplo sin filtro: GET /api/v1/product → devuelve todos los productos
   * Ejemplo con filtro:  GET /api/v1/product?category=Rings → solo anillos
   */
  getProducts(params?: { category?: string }): Observable<Product[]> {
    // HttpParams construye la query string (?category=Rings)
    let httpParams = new HttpParams();
    if (params?.category) {
      httpParams = httpParams.set('category', params.category);
    }

    return (
      this.http
        .get<any>(this.apiUrl, { params: httpParams })
        // El backend envuelve la respuesta en { products: [...] }
        // Con .pipe(map()) extraemos solo el array de productos
        .pipe(map((data) => data.products || data || []))
    );
  }

  /**
   * Crear un producto nuevo (solo para admins desde el dashboard)
   */
  createProduct(productData: any): Observable<any> {
    return this.http.post(this.apiUrl, productData);
  }

  /**
   * Obtener productos agrupados por categoría (usado en Collections Edit)
   */
  getProductsGroupedByCategory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category`).pipe(map((data) => data.products || data));
  }

  /**
   * Obtener UN solo producto por su ID de MongoDB.
   *
   * ¿CÓMO FUNCIONA?
   * 1. Recibe el ID del producto como parámetro (ej: "abc123")
   * 2. Hace un GET a: http://localhost:3000/api/v1/product/abc123
   * 3. El backend responde con { productFound: { name, price, ... } }
   * 4. Usamos .pipe(map()) para extraer solo el objeto del producto
   *    (sin la envoltura "productFound")
   * 5. Devuelve un Observable<Product> que el componente consume con .subscribe()
   *
   * Usado por: ProductDetail (la página de detalle de un producto)
   */
  getProductById(id: string): Observable<Product> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((data) => data.productFound || data));
  }
}

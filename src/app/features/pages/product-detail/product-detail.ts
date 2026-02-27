import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpProduct } from '../../../core/services/http-product';
import { HttpAuth } from '../../../core/services/http-auth';
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
  product: Product | null = null;
  user: any = null;
  loading = true;
  activeSection: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private httpProduct: HttpProduct,
    private httpAuth: HttpAuth,
  ) {}

  ngOnInit() {
    // Track auth state
    this.httpAuth.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => (this.user = user));

    // Fetch product by route param
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.httpProduct.getProductById(id).subscribe({
        next: (product) => {
          this.product = product;
          this.loading = false;
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

  get formattedPrice(): string {
    if (!this.product) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(this.product.price);
  }

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

  get stockLabel(): string {
    if (!this.product) return '';
    if (this.product.stock <= 0) return 'Agotado';
    if (this.product.stock <= 5) return `¡Últimas ${this.product.stock} unidades!`;
    return 'Disponible';
  }

  get stockClass(): string {
    if (!this.product) return '';
    if (this.product.stock <= 0) return 'out-of-stock';
    if (this.product.stock <= 5) return 'low-stock';
    return 'in-stock';
  }

  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
  }

  onAddToCart() {
    // TODO: Implement cart logic
    console.log('Add to cart:', this.product?._id);
  }

  onAddToFavorites() {
    // TODO: Implement favorites logic
    console.log('Add to favorites:', this.product?._id);
  }
}

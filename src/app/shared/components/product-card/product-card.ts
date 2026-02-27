import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() name: string = '';
  @Input() price: number = 0;
  @Input() image: string = '';
  @Input() category: string = '';
  @Input() isNew: boolean = false;
  @Input() productId: string = '';

  get formattedPrice(): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(this.price);
  }
}

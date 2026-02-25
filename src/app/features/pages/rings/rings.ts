import { Component, OnInit } from '@angular/core';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { HttpProduct } from '../../../core/services/http-product';
import { Product } from '../../../core/models/product.interface';

@Component({
  selector: 'app-rings',
  imports: [ProductCard],
  templateUrl: './rings.html',
  styleUrls: ['./rings.css', '../../../shared/styles/category-page.css'],
})
export class Rings implements OnInit {
  activeFilter = 'Todos';
  subcategories = [
    'Todos',
    'Anillos de boda',
    'Anillos solitario',
    'Anillos de compromiso',
    'Anillos casuales',
  ];

  // Raw products from API
  products: Product[] = [];
  // Mapped products for display card
  displayProducts: any[] = [];

  private categoryId = '698d3ea655831f0aaa2c6d1b';

  constructor(private httpProduct: HttpProduct) {}

  ngOnInit(): void {
    this.httpProduct.getProducts({ category: this.categoryId }).subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.mapProducts();
      },
      error: (err) => console.error('Error fetching rings:', err),
    });
  }

  mapProducts() {
    this.displayProducts = this.products.map((p) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      // Fallback image if urlImage is missing or null
      image: p.urlImage ,
      category: 'Rings', // We know this page is for Rings
      description: p.description,
      isNew: false, // Could implement logic here
    }));
  }

  get filteredProducts() {
    if (this.activeFilter === 'Todos') return this.displayProducts;

    const filterKey = this.activeFilter.replace('Anillos ', '').replace('de ', '').toLowerCase();

    return this.displayProducts.filter((p) => {
      // Check if description or name contains the filter keyword
      const descriptionMatch = p.description
        ? p.description.toLowerCase().includes(filterKey)
        : false;
      const nameMatch = p.name.toLowerCase().includes(filterKey);
      return descriptionMatch || nameMatch;
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }
}

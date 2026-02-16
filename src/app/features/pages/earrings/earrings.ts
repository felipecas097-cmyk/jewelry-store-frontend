import { Component, OnInit } from '@angular/core';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { HttpProduct } from '../../../core/services/http-product';
import { Product } from '../../../core/models/product.interface';

@Component({
  selector: 'app-earrings',
  imports: [ProductCard],
  templateUrl: './earrings.html',
  styleUrls: ['./earrings.css', '../../../shared/styles/category-page.css'],
})
export class Earrings implements OnInit {
  activeFilter = 'Todos';

  subcategories = ['Todos', 'Aretes largos', 'Argollas', 'Studs', 'Ear cuffs'];

  products: Product[] = [];
  displayProducts: any[] = [];

  private categoryId = '698d3eb955831f0aaa2c6d1d'; // Earrings ID

  constructor(private httpProduct: HttpProduct) {}

  ngOnInit(): void {
    this.httpProduct.getProducts({ category: this.categoryId }).subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.mapProducts();
      },
      error: (err) => console.error('Error fetching earrings:', err),
    });
  }

  mapProducts() {
    this.displayProducts = this.products.map((p) => ({
      name: p.name,
      price: p.price,
      image: p.urlImage || 'https://picsum.photos/seed/ear_default/400/530',
      category: 'Earrings',
      description: p.description,
      isNew: false,
    }));
  }

  get filteredProducts() {
    if (this.activeFilter === 'Todos') return this.displayProducts;

    // Filter logic
    const filterKey = this.activeFilter.replace('Aretes ', '').toLowerCase();

    return this.displayProducts.filter((p) => {
      const descriptionMatch = p.description
        ? p.description.toLowerCase().includes(filterKey)
        : false;
      const nameMatch = p.name.toLowerCase().includes(filterKey);
      // Direct match for Ear cuffs, Argollas, Studs
      const categoryMatch = p.description
        ? p.description.toLowerCase().includes(this.activeFilter.toLowerCase())
        : false;

      return descriptionMatch || nameMatch || categoryMatch;
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }
}

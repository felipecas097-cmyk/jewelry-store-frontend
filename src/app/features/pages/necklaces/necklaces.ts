import { Component, OnInit } from '@angular/core';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { HttpProduct } from '../../../core/services/http-product';
import { Product } from '../../../core/models/product.interface';

@Component({
  selector: 'app-necklaces',
  imports: [ProductCard],
  templateUrl: './necklaces.html',
  styleUrls: ['./necklaces.css', '../../../shared/styles/category-page.css'],
})
export class Necklaces implements OnInit {
  activeFilter = 'Todos';

  subcategories = ['Todos', 'Gargantillas', 'Colgantes', 'Cadenas', 'Collares largos'];

  products: Product[] = [];
  displayProducts: any[] = [];

  private categoryId = '698d3ecc55831f0aaa2c6d1f'; // Necklaces ID

  constructor(private httpProduct: HttpProduct) {}

  ngOnInit(): void {
    this.httpProduct.getProductsByCategory(this.categoryId).subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.mapProducts();
      },
      error: (err) => console.error('Error fetching necklaces:', err),
    });
  }

  mapProducts() {
    this.displayProducts = this.products.map((p) => ({
      name: p.name,
      price: p.price,
      image: p.urlImage || 'https://picsum.photos/seed/neck_default/400/530',
      category: 'Necklaces',
      description: p.description,
      isNew: false,
    }));
  }

  get filteredProducts() {
    if (this.activeFilter === 'Todos') return this.displayProducts;

    // Filter logic: Check if name or description contains the subcategory keyword
    const filterKey = this.activeFilter.replace('Collares ', '').toLowerCase();

    return this.displayProducts.filter((p) => {
      const descriptionMatch = p.description
        ? p.description.toLowerCase().includes(filterKey)
        : false;
      const nameMatch = p.name.toLowerCase().includes(filterKey);
      // Also check category for 'Gargantillas', 'Cadenas', etc directly
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

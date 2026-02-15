import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpProduct } from '../../../../core/services/http-product';
import { HttpCategory } from '../../../../core/services/http-category';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-product-edit-form',
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './product-edit-form.html',
  styleUrl: './product-edit-form.css',
})
export class ProductEditForm implements OnInit, OnDestroy {
  formData!: FormGroup;
  categories!: Observable<any[]>;
  loading = false;
  error: string | null = null;
  productId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private httpProduct: HttpProduct,
    private httpCategory: HttpCategory,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required]),
      category: new FormControl('', []),
      description: new FormControl('', []),
      price: new FormControl(0, [Validators.required, Validators.min(1)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)]),
      material: new FormControl('', []),
      purity: new FormControl('', []),
      color: new FormControl('', []),
      weigthGrams: new FormControl(0, [Validators.required, Validators.min(0)]),
      size: new FormControl('', []),
      urlImage: new FormControl('', []),
      gemstoneStatus: new FormControl(null, []),
      gemstone: new FormControl('', []),
      gemstoneCarats: new FormControl('', []),
      certificateStatus: new FormControl(null, []),
      certificate: new FormControl('', []),
      certificateNumber: new FormControl('', []),
      productStatus: new FormControl(false, []),
    });
  }

  ngOnInit(): void {
    this.categories = this.httpCategory.getAllCategories();

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.productId = params['id'];
      if (!this.productId) {
        this.error = 'Selecciona un producto desde la lista de productos para editarlo';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  numberFilter(event: KeyboardEvent): void {
    const numberAllowed = /^[0-9.]$/;
    if (!numberAllowed.test(event.key)) {
      event.preventDefault();
    }
  }

  onSubmit(): void {
    if (this.formData.invalid || !this.productId) {
      this.error = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.error = null;

    console.log('Updating product:', this.productId, this.formData.value);
    // TODO: Add updateProduct method to HttpProduct service
    alert('Producto actualizado (funcionalidad pendiente de backend)');
    this.loading = false;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpCollections } from '../../../../core/services/http-collections';
import { HttpProduct } from '../../../../core/services/http-product';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, switchMap, map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-collections-edit-form',
  imports: [ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './collections-edit-form.html',
  styleUrl: './collections-edit-form.css',
})
export class CollectionsEditForm implements OnInit, OnDestroy {
  formData!: FormGroup;
  loading = false;
  error: string | null = null;
  collectionId: string | null = null;
  public products: Observable<any> = new Observable<any>();
  private refreshProductsTrigger$ = new BehaviorSubject<void>(undefined);
  private destroy$ = new Subject<void>();

  constructor(
    private httpCollections: HttpCollections,
    private httpProduct: HttpProduct,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      products: new FormArray([]),
      isActive: new FormControl(true),
    });
  }

  ngOnInit(): void {
    this.products = this.refreshProductsTrigger$.pipe(
      switchMap(() => this.httpProduct.getProductsGroupedByCategory()),
      map((data) => Object.entries(data).map(([key, value]) => ({ key, value }))),
    );

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.collectionId = params['id'];
      if (!this.collectionId) {
        this.error = 'ID de colección no proporcionado';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get productsArray(): FormArray {
    return this.formData.get('products') as FormArray;
  }

  onCheckboxChange(event: any, productId: string) {
    if (event.target.checked) {
      this.productsArray.push(new FormControl(productId));
    } else {
      const index = this.productsArray.controls.findIndex((x) => x.value === productId);
      this.productsArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.formData.invalid || !this.collectionId) {
      this.error = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.error = null;

    console.log('Updating collection:', this.collectionId, this.formData.value);
    // TODO: Add updateCollection method to HttpCollections service
    alert('Colección actualizada (funcionalidad pendiente de backend)');
    this.loading = false;
  }
}

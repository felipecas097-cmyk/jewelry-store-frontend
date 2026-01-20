import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpCategory } from '../../../../core/services/http-category';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Category {
  _id?: string;
  name: string;
  description: string;
  parent?: string | null;
  isActive: boolean;
}

@Component({
  selector: 'app-categories-edit-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './categories-edit-form.html',
  styleUrl: './categories-edit-form.css',
})
export class CategoriesEditForm implements OnInit, OnDestroy {
  formData!: FormGroup;
  categories: Category[] = [];
  loading = false;
  error: string | null = null;
  categoryId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private httpCategory: HttpCategory,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', Validators.required),
      parent: new FormControl(null),
      isActive: new FormControl(true),
    });
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.categoryId = params['id'];
      if (this.categoryId) {
        this.loadCategory(this.categoryId);
        this.loadCategories();
      } else {
        this.error = 'ID de categoría no proporcionado';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategory(id: string): void {
    this.loading = true;
    this.httpCategory
      .getCategoryById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.formData.patchValue({
            name: data.name,
            description: data.description,
            parent: data.parent || null,
            isActive: data.isActive,
          });
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading category:', err);
          this.error = 'Error al cargar la categoría';
          this.loading = false;
        },
      });
  }

  loadCategories(): void {
    this.httpCategory
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          // Exclude current category from parent options
          //Sthis.categories = data.filter((cat) => cat._id !== this.categoryId);
        },
        error: (err) => {
          console.error('Error loading categories:', err);
        },
      });
  }

  onSubmit(): void {
    if (this.formData.invalid || !this.categoryId) {
      this.error = 'Por favor completa todos los campos requeridos';
      return;
    }

    this.loading = true;
    this.error = null;

    const updatedCategory: Category = {
      _id: this.categoryId,
      name: this.formData.value.name,
      description: this.formData.value.description,
      parent: this.formData.value.parent || null,
      isActive: this.formData.value.isActive,
    };

    this.httpCategory
      .updateCategory(this.categoryId, updatedCategory)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading = false;
          alert('Categoría actualizada exitosamente');
          this.router.navigate(['/dashboard/categories']);
        },
        error: (err) => {
          this.loading = false;
          console.error('Error updating category:', err);
          this.error = 'Error al actualizar la categoría';
        },
      });
  }
}

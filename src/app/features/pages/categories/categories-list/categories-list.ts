import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpCategory } from '../../../../core/services/http-category';
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
  selector: 'app-categories-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.css',
})
export class CategoriesList implements OnInit, OnDestroy {
  categories: Category[] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private httpCategory: HttpCategory) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;
    
    this.httpCategory
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.categories = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading categories:', err);
          this.error = 'Error al cargar las categorías';
          this.loading = false;
        },
      });
  }

  deleteCategory(id: string | undefined): void {
    if (!id) return;
    
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      return;
    }

    this.httpCategory
      .deleteCategory(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.categories = this.categories.filter((cat) => cat._id !== id);
          alert('Categoría eliminada exitosamente');
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          this.error = 'Error al eliminar la categoría';
        },
      });
  }
}

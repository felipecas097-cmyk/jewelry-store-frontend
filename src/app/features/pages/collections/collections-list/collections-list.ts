import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpCollections } from '../../../../core/services/http-collections';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Collection {
  _id?: string;
  name: string;
  description: string;
  products?: string[];
  isActive: boolean;
}

@Component({
  selector: 'app-collections-list',
  imports: [RouterModule],
  templateUrl: './collections-list.html',
  styleUrl: './collections-list.css',
})
export class CollectionsList implements OnInit, OnDestroy {
  collections: Collection[] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private httpCollections: HttpCollections,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCollections();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCollections(): void {
    this.loading = true;
    this.error = null;

    this.httpCollections
      .getAllCollection()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Collection[]) => {
          this.collections = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error loading collections:', err);
          this.error = 'Error al cargar las colecciones';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  deleteCollection(id: string | undefined): void {
    if (!id) return;

    if (!confirm('¿Estás seguro de que deseas eliminar esta colección?')) {
      return;
    }

    // TODO: Add deleteCollection method to HttpCollections service
    console.log('Delete collection:', id);
    this.collections = this.collections.filter((col) => col._id !== id);
    this.cdr.detectChanges();
  }
}

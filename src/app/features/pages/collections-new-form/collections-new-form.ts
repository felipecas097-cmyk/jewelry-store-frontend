import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpCollections } from '../../../core/services/http-collections';
import { map, switchMap } from 'rxjs/operators';





@Component({
  selector: 'app-collections-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './collections-new-form.html',
  styleUrl: './collections-new-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionsNewForm {
  formData!: FormGroup;

  public collections: Observable <any[]> = new Observable <any[]>(); 

  private refreshCollectionsTrigger$: BehaviorSubject <void> = new 
  BehaviorSubject<void>(undefined);
  

  constructor( 
    private httpCollections: HttpCollections ) {
    this.formData = new FormGroup({
      name: new FormControl ('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl ('',[Validators.required,Validators.minLength(10)]),
      isActive: new FormControl (true),
    });
  }


 ngOnInit(): void {
  this.collections = this.refreshCollectionsTrigger$.pipe(
    switchMap( () => this.httpCollections.getAllCollection() )
  )
 }
}
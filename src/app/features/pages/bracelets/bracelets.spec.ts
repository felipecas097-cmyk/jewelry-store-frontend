import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bracelets } from './bracelets';

describe('Bracelets', () => {
  let component: Bracelets;
  let fixture: ComponentFixture<Bracelets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bracelets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bracelets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

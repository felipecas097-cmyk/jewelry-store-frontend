import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rings } from './rings';

describe('Rings', () => {
  let component: Rings;
  let fixture: ComponentFixture<Rings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Necklaces } from './necklaces';

describe('Necklaces', () => {
  let component: Necklaces;
  let fixture: ComponentFixture<Necklaces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Necklaces]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Necklaces);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

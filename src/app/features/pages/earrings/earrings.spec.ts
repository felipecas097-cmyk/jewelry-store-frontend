import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Earrings } from './earrings';

describe('Earrings', () => {
  let component: Earrings;
  let fixture: ComponentFixture<Earrings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Earrings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Earrings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

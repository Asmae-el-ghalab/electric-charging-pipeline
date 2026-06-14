import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheComponent } from './recherche-component';

describe('RechercheComponent', () => {
  let component: RechercheComponent;
  let fixture: ComponentFixture<RechercheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechercheComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RechercheComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

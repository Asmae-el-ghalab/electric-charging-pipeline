import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConducteurDashboardComponent } from './conducteur-dashboard.component';

describe('ConducteurDashboardComponent', () => {
  let component: ConducteurDashboardComponent;
  let fixture: ComponentFixture<ConducteurDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConducteurDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConducteurDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

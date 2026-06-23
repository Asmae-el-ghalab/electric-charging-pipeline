import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSignalementsComponent } from './admin-signalements.component';

describe('AdminSignalementsComponent', () => {
  let component: AdminSignalementsComponent;
  let fixture: ComponentFixture<AdminSignalementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSignalementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSignalementsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionDashboard } from './consumption-dashboard';

describe('ConsumptionDashboard', () => {
  let component: ConsumptionDashboard;
  let fixture: ComponentFixture<ConsumptionDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumptionDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumptionDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

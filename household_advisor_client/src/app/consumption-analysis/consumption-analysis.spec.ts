import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionAnalysis } from './consumption-analysis';

describe('ConsumptionAnalysis', () => {
  let component: ConsumptionAnalysis;
  let fixture: ComponentFixture<ConsumptionAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumptionAnalysis],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumptionAnalysis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

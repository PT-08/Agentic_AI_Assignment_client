import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarRoi } from './solar-roi';

describe('SolarRoi', () => {
  let component: SolarRoi;
  let fixture: ComponentFixture<SolarRoi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolarRoi],
    }).compileComponents();

    fixture = TestBed.createComponent(SolarRoi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

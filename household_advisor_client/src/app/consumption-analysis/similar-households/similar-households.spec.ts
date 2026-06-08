import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarHouseholds } from './similar-households';

describe('SimilarHouseholds', () => {
  let component: SimilarHouseholds;
  let fixture: ComponentFixture<SimilarHouseholds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimilarHouseholds],
    }).compileComponents();

    fixture = TestBed.createComponent(SimilarHouseholds);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

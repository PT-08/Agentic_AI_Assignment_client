import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileData } from './profile-data';

describe('ProfileData', () => {
  let component: ProfileData;
  let fixture: ComponentFixture<ProfileData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileData],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

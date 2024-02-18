import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnGoingReferralComponent } from './on-going-referral.component';

describe('OnGoingReferralComponent', () => {
  let component: OnGoingReferralComponent;
  let fixture: ComponentFixture<OnGoingReferralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnGoingReferralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnGoingReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

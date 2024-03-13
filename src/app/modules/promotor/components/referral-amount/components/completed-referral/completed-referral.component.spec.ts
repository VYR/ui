import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedReferralComponent } from './completed-referral.component';

describe('CompletedReferralComponent', () => {
  let component: CompletedReferralComponent;
  let fixture: ComponentFixture<CompletedReferralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedReferralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

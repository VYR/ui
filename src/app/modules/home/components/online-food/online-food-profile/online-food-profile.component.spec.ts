import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineFoodProfileComponent } from './online-food-profile.component';

describe('OnlineFoodProfileComponent', () => {
  let component: OnlineFoodProfileComponent;
  let fixture: ComponentFixture<OnlineFoodProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineFoodProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineFoodProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

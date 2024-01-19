import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineFoodImageSelectionComponent } from './online-food-image-selection.component';

describe('OnlineFoodImageSelectionComponent', () => {
  let component: OnlineFoodImageSelectionComponent;
  let fixture: ComponentFixture<OnlineFoodImageSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineFoodImageSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineFoodImageSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineFoodSettingsComponent } from './online-food-settings.component';

describe('OnlineFoodSettingsComponent', () => {
  let component: OnlineFoodSettingsComponent;
  let fixture: ComponentFixture<OnlineFoodSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineFoodSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineFoodSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

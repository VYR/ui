import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsUserDetailsComponent } from './sgs-user-details.component';

describe('SgsUserDetailsComponent', () => {
  let component: SgsUserDetailsComponent;
  let fixture: ComponentFixture<SgsUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsUserDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

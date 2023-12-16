import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsUserComponent } from './sgs-user.component';

describe('SgsUserComponent', () => {
  let component: SgsUserComponent;
  let fixture: ComponentFixture<SgsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

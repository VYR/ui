import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsProfileComponent } from './sgs-profile.component';

describe('SgsProfileComponent', () => {
  let component: SgsProfileComponent;
  let fixture: ComponentFixture<SgsProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

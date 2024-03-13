import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsDetailsComponent } from './sgs-details.component';

describe('SgsDetailsComponent', () => {
  let component: SgsDetailsComponent;
  let fixture: ComponentFixture<SgsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsRefferalsComponent } from './sgs-refferals.component';

describe('SgsRefferalsComponent', () => {
  let component: SgsRefferalsComponent;
  let fixture: ComponentFixture<SgsRefferalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsRefferalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsRefferalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsReportsComponent } from './sgs-reports.component';

describe('SgsReportsComponent', () => {
  let component: SgsReportsComponent;
  let fixture: ComponentFixture<SgsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

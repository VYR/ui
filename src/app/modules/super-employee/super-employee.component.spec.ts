import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperEmployeeComponent } from './super-employee.component';

describe('SuperEmployeeComponent', () => {
  let component: SuperEmployeeComponent;
  let fixture: ComponentFixture<SuperEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperEmployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

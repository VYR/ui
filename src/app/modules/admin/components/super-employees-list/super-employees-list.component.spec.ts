import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperEmployeesListComponent } from './super-employees-list.component';

describe('SuperEmployeesListComponent', () => {
  let component: SuperEmployeesListComponent;
  let fixture: ComponentFixture<SuperEmployeesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperEmployeesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperEmployeesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsEmployeesComponent } from './sgs-employees.component';

describe('SgsEmployeesComponent', () => {
  let component: SgsEmployeesComponent;
  let fixture: ComponentFixture<SgsEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsEmployeesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

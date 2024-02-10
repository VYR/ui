import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeNamesComponent } from './scheme-names.component';

describe('SchemeNamesComponent', () => {
  let component: SchemeNamesComponent;
  let fixture: ComponentFixture<SchemeNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeNamesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemeNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

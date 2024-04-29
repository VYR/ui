import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EamcetExamComponent } from './eamcet-exam.component';

describe('EamcetExamComponent', () => {
  let component: EamcetExamComponent;
  let fixture: ComponentFixture<EamcetExamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EamcetExamComponent]
    });
    fixture = TestBed.createComponent(EamcetExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

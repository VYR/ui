import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JntuOnlineExamComponent } from './jntu-online-exam.component';

describe('JntuOnlineExamComponent', () => {
  let component: JntuOnlineExamComponent;
  let fixture: ComponentFixture<JntuOnlineExamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JntuOnlineExamComponent]
    });
    fixture = TestBed.createComponent(JntuOnlineExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

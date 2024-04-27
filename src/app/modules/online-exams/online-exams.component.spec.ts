import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineExamsComponent } from './online-exams.component';

describe('OnlineExamsComponent', () => {
  let component: OnlineExamsComponent;
  let fixture: ComponentFixture<OnlineExamsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineExamsComponent]
    });
    fixture = TestBed.createComponent(OnlineExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

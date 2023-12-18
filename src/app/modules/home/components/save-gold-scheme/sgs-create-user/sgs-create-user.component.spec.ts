import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsCreateUserComponent } from './sgs-create-user.component';

describe('SgsCreateUserComponent', () => {
  let component: SgsCreateUserComponent;
  let fixture: ComponentFixture<SgsCreateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsCreateUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

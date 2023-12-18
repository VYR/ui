import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsUsersComponent } from './sgs-users.component';

describe('SgsUsersComponent', () => {
  let component: SgsUsersComponent;
  let fixture: ComponentFixture<SgsUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

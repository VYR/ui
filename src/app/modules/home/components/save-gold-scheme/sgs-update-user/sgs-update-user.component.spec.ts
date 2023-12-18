import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsUpdateUserComponent } from './sgs-update-user.component';

describe('SgsUpdateUserComponent', () => {
  let component: SgsUpdateUserComponent;
  let fixture: ComponentFixture<SgsUpdateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsUpdateUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsUpdateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

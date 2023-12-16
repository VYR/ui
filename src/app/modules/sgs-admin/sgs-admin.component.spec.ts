import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsAdminComponent } from './sgs-admin.component';

describe('SgsAdminComponent', () => {
  let component: SgsAdminComponent;
  let fixture: ComponentFixture<SgsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

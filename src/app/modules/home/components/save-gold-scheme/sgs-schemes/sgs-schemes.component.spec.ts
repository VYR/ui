import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsSchemesComponent } from './sgs-schemes.component';

describe('SgsSchemesComponent', () => {
  let component: SgsSchemesComponent;
  let fixture: ComponentFixture<SgsSchemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsSchemesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsSchemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

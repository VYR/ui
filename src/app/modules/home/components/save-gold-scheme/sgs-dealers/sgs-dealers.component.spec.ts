import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsDealersComponent } from './sgs-dealers.component';

describe('SgsDealersComponent', () => {
  let component: SgsDealersComponent;
  let fixture: ComponentFixture<SgsDealersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsDealersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsDealersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

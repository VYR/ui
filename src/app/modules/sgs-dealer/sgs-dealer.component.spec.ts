import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsDealerComponent } from './sgs-dealer.component';

describe('SgsDealerComponent', () => {
  let component: SgsDealerComponent;
  let fixture: ComponentFixture<SgsDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsDealerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

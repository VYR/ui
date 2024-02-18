import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsSchemeDetailsComponent } from './sgs-scheme-details.component';

describe('SgsSchemeDetailsComponent', () => {
  let component: SgsSchemeDetailsComponent;
  let fixture: ComponentFixture<SgsSchemeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsSchemeDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsSchemeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsSchemeGroupComponent } from './sgs-scheme-group.component';

describe('SgsSchemeGroupComponent', () => {
  let component: SgsSchemeGroupComponent;
  let fixture: ComponentFixture<SgsSchemeGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsSchemeGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsSchemeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

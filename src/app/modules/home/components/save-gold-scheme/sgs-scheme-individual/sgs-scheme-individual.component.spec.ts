import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsSchemeIndividualComponent } from './sgs-scheme-individual.component';

describe('SgsSchemeIndividualComponent', () => {
  let component: SgsSchemeIndividualComponent;
  let fixture: ComponentFixture<SgsSchemeIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsSchemeIndividualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsSchemeIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgsSettingsComponent } from './sgs-settings.component';

describe('SgsSettingsComponent', () => {
  let component: SgsSettingsComponent;
  let fixture: ComponentFixture<SgsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SgsSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

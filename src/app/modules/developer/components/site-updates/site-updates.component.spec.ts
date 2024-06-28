import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteUpdatesComponent } from './site-updates.component';

describe('SiteUpdatesComponent', () => {
  let component: SiteUpdatesComponent;
  let fixture: ComponentFixture<SiteUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteUpdatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

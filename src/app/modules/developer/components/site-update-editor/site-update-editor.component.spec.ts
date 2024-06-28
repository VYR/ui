import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteUpdateEditorComponent } from './site-update-editor.component';

describe('SiteUpdateEditorComponent', () => {
  let component: SiteUpdateEditorComponent;
  let fixture: ComponentFixture<SiteUpdateEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteUpdateEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteUpdateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

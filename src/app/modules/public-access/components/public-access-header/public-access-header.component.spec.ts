import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAccessHeaderComponent } from './public-access-header.component';

describe('PublicAccessHeaderComponent', () => {
  let component: PublicAccessHeaderComponent;
  let fixture: ComponentFixture<PublicAccessHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicAccessHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicAccessHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

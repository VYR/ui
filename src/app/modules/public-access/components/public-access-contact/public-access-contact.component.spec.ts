import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAccessContactComponent } from './public-access-contact.component';

describe('PublicAccessContactComponent', () => {
  let component: PublicAccessContactComponent;
  let fixture: ComponentFixture<PublicAccessContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicAccessContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicAccessContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

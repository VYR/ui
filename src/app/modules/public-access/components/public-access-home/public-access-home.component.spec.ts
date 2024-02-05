import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAccessHomeComponent } from './public-access-home.component';

describe('PublicAccessHomeComponent', () => {
  let component: PublicAccessHomeComponent;
  let fixture: ComponentFixture<PublicAccessHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicAccessHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicAccessHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAccessComponent } from './public-access.component';

describe('PublicAccessComponent', () => {
  let component: PublicAccessComponent;
  let fixture: ComponentFixture<PublicAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicAccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

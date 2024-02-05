import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAccessAboutComponent } from './public-access-about.component';

describe('PublicAccessAboutComponent', () => {
  let component: PublicAccessAboutComponent;
  let fixture: ComponentFixture<PublicAccessAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicAccessAboutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicAccessAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

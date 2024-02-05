import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicAccessFooterComponent } from './public-access-footer.component';

describe('PublicAccessFooterComponent', () => {
  let component: PublicAccessFooterComponent;
  let fixture: ComponentFixture<PublicAccessFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicAccessFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicAccessFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

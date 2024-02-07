import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeMemberComponent } from './scheme-member.component';

describe('SchemeMemberComponent', () => {
  let component: SchemeMemberComponent;
  let fixture: ComponentFixture<SchemeMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeMemberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemeMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

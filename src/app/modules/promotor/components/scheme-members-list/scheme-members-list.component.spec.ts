import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeMembersListComponent } from './scheme-members-list.component';

describe('SchemeMembersListComponent', () => {
  let component: SchemeMembersListComponent;
  let fixture: ComponentFixture<SchemeMembersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeMembersListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemeMembersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

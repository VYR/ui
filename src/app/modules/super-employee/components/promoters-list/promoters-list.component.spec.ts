import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotersListComponent } from './promoters-list.component';

describe('PromotersListComponent', () => {
  let component: PromotersListComponent;
  let fixture: ComponentFixture<PromotersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotersListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

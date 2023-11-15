import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPopupDetailsComponent } from './card-popup-details.component';

describe('CardPopupDetailsComponent', () => {
    let component: CardPopupDetailsComponent;
    let fixture: ComponentFixture<CardPopupDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CardPopupDetailsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CardPopupDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

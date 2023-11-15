import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRatePopupComponent } from './exchange-rate-popup.component';

describe('ExchangeRatePopupComponent', () => {
    let component: ExchangeRatePopupComponent;
    let fixture: ComponentFixture<ExchangeRatePopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExchangeRatePopupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ExchangeRatePopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

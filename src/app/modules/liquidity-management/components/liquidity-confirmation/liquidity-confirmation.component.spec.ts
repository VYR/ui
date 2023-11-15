import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidityConfirmationComponent } from './liquidity-confirmation.component';

describe('LiquidityConfirmationComponent', () => {
    let component: LiquidityConfirmationComponent;
    let fixture: ComponentFixture<LiquidityConfirmationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LiquidityConfirmationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LiquidityConfirmationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

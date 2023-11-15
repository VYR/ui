import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceConfirmationComponent } from './balance-confirmation.component';

describe('BalanceConfirmationComponent', () => {
    let component: BalanceConfirmationComponent;
    let fixture: ComponentFixture<BalanceConfirmationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BalanceConfirmationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BalanceConfirmationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

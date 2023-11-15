import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SweepBalanceComponent } from './sweep-balance.component';

describe('SweepBalanceComponent', () => {
    let component: SweepBalanceComponent;
    let fixture: ComponentFixture<SweepBalanceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SweepBalanceComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SweepBalanceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

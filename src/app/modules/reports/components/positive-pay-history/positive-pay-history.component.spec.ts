import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositivePayHistoryComponent } from './positive-pay-history.component';

describe('PositivePayHistoryComponent', () => {
    let component: PositivePayHistoryComponent;
    let fixture: ComponentFixture<PositivePayHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PositivePayHistoryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PositivePayHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

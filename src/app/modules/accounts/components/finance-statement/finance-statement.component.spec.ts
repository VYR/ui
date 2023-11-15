import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceStatementComponent } from './finance-statement.component';

describe('FinanceStatementComponent', () => {
    let component: FinanceStatementComponent;
    let fixture: ComponentFixture<FinanceStatementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FinanceStatementComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FinanceStatementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

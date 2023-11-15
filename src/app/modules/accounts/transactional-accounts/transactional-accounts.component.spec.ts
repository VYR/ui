import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionalAccountsComponent } from './transactional-accounts.component';

describe('TransactionalAccountsComponent', () => {
    let component: TransactionalAccountsComponent;
    let fixture: ComponentFixture<TransactionalAccountsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TransactionalAccountsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TransactionalAccountsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

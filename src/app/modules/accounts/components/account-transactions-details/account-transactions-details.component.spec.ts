import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransationsDetailsComponent } from './account-transactions-details.component';

describe('AccountTransationsDetailsComponent', () => {
    let component: AccountTransationsDetailsComponent;
    let fixture: ComponentFixture<AccountTransationsDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccountTransationsDetailsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AccountTransationsDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

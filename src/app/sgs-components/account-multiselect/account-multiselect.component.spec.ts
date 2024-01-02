import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMultiselectComponent } from './account-multiselect.component';

describe('AccountMultiselectComponent', () => {
    let component: AccountMultiselectComponent;
    let fixture: ComponentFixture<AccountMultiselectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AccountMultiselectComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AccountMultiselectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryDialogDetailsComponent } from './beneficiary-dialog-details.component';

describe('BeneficiaryDialogDetailsComponent', () => {
    let component: BeneficiaryDialogDetailsComponent;
    let fixture: ComponentFixture<BeneficiaryDialogDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BeneficiaryDialogDetailsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BeneficiaryDialogDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

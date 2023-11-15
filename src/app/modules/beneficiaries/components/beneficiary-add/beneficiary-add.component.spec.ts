import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryAddComponent } from './beneficiary-add.component';

describe('BeneficiaryAddComponent', () => {
    let component: BeneficiaryAddComponent;
    let fixture: ComponentFixture<BeneficiaryAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BeneficiaryAddComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BeneficiaryAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

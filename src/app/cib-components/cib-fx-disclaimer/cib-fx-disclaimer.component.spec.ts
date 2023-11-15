import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibFxDisclaimerComponent } from './cib-fx-disclaimer.component';

describe('CibFxDisclaimerComponent', () => {
    let component: CibFxDisclaimerComponent;
    let fixture: ComponentFixture<CibFxDisclaimerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CibFxDisclaimerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CibFxDisclaimerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

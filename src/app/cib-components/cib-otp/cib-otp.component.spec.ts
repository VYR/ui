import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibOtpComponent } from './cib-otp.component';

describe('CibOtpComponent', () => {
    let component: CibOtpComponent;
    let fixture: ComponentFixture<CibOtpComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CibOtpComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CibOtpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

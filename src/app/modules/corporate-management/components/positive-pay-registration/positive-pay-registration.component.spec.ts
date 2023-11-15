import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositivePayRegistrationComponent } from './positive-pay-registration.component';

describe('PositivePayRegistrationComponent', () => {
    let component: PositivePayRegistrationComponent;
    let fixture: ComponentFixture<PositivePayRegistrationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PositivePayRegistrationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PositivePayRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

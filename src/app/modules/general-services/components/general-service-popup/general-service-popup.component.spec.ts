import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralServicePopupComponent } from './general-service-popup.component';

describe('GeneralServicePopupComponent', () => {
    let component: GeneralServicePopupComponent;
    let fixture: ComponentFixture<GeneralServicePopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GeneralServicePopupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GeneralServicePopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

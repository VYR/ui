import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgInquiryComponent } from './bg-inquiry.component';

describe('BgInquiryComponent', () => {
    let component: BgInquiryComponent;
    let fixture: ComponentFixture<BgInquiryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BgInquiryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BgInquiryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

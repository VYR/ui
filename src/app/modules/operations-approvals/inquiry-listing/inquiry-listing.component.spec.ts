import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryListingComponent } from './inquiry-listing.component';

describe('InquiryListingComponent', () => {
    let component: InquiryListingComponent;
    let fixture: ComponentFixture<InquiryListingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InquiryListingComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(InquiryListingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

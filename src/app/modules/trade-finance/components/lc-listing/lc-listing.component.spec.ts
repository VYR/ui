import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcListingComponent } from './lc-listing.component';

describe('LcListingComponent', () => {
    let component: LcListingComponent;
    let fixture: ComponentFixture<LcListingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LcListingComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LcListingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

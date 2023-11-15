import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadSummaryComponent } from './bulk-upload-summary.component';

describe('BulkUploadSummaryComponent', () => {
    let component: BulkUploadSummaryComponent;
    let fixture: ComponentFixture<BulkUploadSummaryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BulkUploadSummaryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BulkUploadSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

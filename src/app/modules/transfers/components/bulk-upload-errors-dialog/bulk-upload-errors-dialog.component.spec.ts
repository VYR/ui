import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadErrorsDialogComponent } from './bulk-upload-errors-dialog.component';

describe('BulkUploadErrorsDialogComponent', () => {
    let component: BulkUploadErrorsDialogComponent;
    let fixture: ComponentFixture<BulkUploadErrorsDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BulkUploadErrorsDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BulkUploadErrorsDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

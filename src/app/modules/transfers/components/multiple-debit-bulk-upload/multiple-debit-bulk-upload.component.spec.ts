import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleDebitBulkUploadComponent } from './multiple-debit-bulk-upload.component';

describe('MultipleDebitBulkUploadComponent', () => {
    let component: MultipleDebitBulkUploadComponent;
    let fixture: ComponentFixture<MultipleDebitBulkUploadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MultipleDebitBulkUploadComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MultipleDebitBulkUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

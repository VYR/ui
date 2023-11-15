import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkTransferDraftsComponent } from './bulk-transfer-drafts.component';

describe('BulkTransferDraftsComponent', () => {
    let component: BulkTransferDraftsComponent;
    let fixture: ComponentFixture<BulkTransferDraftsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BulkTransferDraftsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BulkTransferDraftsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

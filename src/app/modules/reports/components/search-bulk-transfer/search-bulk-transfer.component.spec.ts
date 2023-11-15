import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBulkTransferComponent } from './search-bulk-transfer.component';

describe('SearchBulkTransferComponent', () => {
    let component: SearchBulkTransferComponent;
    let fixture: ComponentFixture<SearchBulkTransferComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchBulkTransferComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchBulkTransferComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

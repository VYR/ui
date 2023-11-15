import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDataTableComponent } from './bulk-data-table.component';

describe('BulkDataTableComponent', () => {
    let component: BulkDataTableComponent;
    let fixture: ComponentFixture<BulkDataTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BulkDataTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BulkDataTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

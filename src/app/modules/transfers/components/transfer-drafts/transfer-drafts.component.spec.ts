import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferDraftsComponent } from './transfer-drafts.component';

describe('TransferDraftsComponent', () => {
    let component: TransferDraftsComponent;
    let fixture: ComponentFixture<TransferDraftsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TransferDraftsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TransferDraftsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

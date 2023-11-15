import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcDocumentsArrivalNoticeComponent } from './lc-documents-arrival-notice.component';

describe('LcDocumentsArrivalNoticeComponent', () => {
    let component: LcDocumentsArrivalNoticeComponent;
    let fixture: ComponentFixture<LcDocumentsArrivalNoticeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LcDocumentsArrivalNoticeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LcDocumentsArrivalNoticeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

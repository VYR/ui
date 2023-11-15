import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMultipleTransferPreviewComponent } from './single-multiple-transfer-preview.component';

describe('SingleMultipleTransferPreviewComponent', () => {
    let component: SingleMultipleTransferPreviewComponent;
    let fixture: ComponentFixture<SingleMultipleTransferPreviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SingleMultipleTransferPreviewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SingleMultipleTransferPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

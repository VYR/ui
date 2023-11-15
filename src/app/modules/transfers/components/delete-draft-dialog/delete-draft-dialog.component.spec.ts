import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDraftDialogComponent } from './delete-draft-dialog.component';

describe('DeleteDraftDialogComponent', () => {
    let component: DeleteDraftDialogComponent;
    let fixture: ComponentFixture<DeleteDraftDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeleteDraftDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DeleteDraftDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

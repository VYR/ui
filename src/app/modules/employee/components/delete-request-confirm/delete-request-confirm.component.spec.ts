import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRequestConfirmComponent } from './delete-request-confirm.component';

describe('DeleteRequestConfirmComponent', () => {
    let component: DeleteRequestConfirmComponent;
    let fixture: ComponentFixture<DeleteRequestConfirmComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeleteRequestConfirmComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DeleteRequestConfirmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

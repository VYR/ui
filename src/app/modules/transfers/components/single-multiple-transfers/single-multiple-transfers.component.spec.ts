import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMultipleTransfersComponent } from './single-multiple-transfers.component';

describe('SingleMultipleTransfersComponent', () => {
    let component: SingleMultipleTransfersComponent;
    let fixture: ComponentFixture<SingleMultipleTransfersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SingleMultipleTransfersComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SingleMultipleTransfersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

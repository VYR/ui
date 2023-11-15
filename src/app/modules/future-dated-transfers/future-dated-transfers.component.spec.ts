import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureDatedTransfersComponent } from './future-dated-transfers.component';

describe('FutureDatedTransfersComponent', () => {
    let component: FutureDatedTransfersComponent;
    let fixture: ComponentFixture<FutureDatedTransfersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FutureDatedTransfersComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FutureDatedTransfersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

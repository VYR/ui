import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferInfoComponent } from './transfer-info.component';

describe('TransferInfoComponent', () => {
    let component: TransferInfoComponent;
    let fixture: ComponentFixture<TransferInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TransferInfoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TransferInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

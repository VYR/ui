import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferHeaderInfoComponent } from './transfer-header-info.component';

describe('TransferHeaderInfoComponent', () => {
    let component: TransferHeaderInfoComponent;
    let fixture: ComponentFixture<TransferHeaderInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TransferHeaderInfoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TransferHeaderInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

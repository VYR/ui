import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManualTransfersComponent } from './manual-transfers.component';

describe('ManualTransfersComponent', () => {
    let component: ManualTransfersComponent;
    let fixture: ComponentFixture<ManualTransfersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ManualTransfersComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ManualTransfersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

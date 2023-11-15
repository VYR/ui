import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFutureTransfersComponent } from './create-future-transfers.component';

describe('CreateFutureTransfersComponent', () => {
    let component: CreateFutureTransfersComponent;
    let fixture: ComponentFixture<CreateFutureTransfersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateFutureTransfersComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateFutureTransfersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBlockingDialogComponent } from './card-blocking-dialog.component';

describe('CardBlockingDialogComponent', () => {
    let component: CardBlockingDialogComponent;
    let fixture: ComponentFixture<CardBlockingDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CardBlockingDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CardBlockingDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

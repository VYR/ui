import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SweepHistoryComponent } from './sweep-history.component';

describe('SweepHistoryComponent', () => {
    let component: SweepHistoryComponent;
    let fixture: ComponentFixture<SweepHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SweepHistoryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SweepHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

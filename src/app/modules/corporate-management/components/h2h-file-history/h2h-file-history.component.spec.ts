import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H2hFileHistoryComponent } from './h2h-file-history.component';

describe('H2hFileHistoryComponent', () => {
    let component: H2hFileHistoryComponent;
    let fixture: ComponentFixture<H2hFileHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [H2hFileHistoryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(H2hFileHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

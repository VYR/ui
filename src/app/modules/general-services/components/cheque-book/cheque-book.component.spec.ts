import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookComponent } from './cheque-book.component';

describe('ChequeBookComponent', () => {
    let component: ChequeBookComponent;
    let fixture: ComponentFixture<ChequeBookComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChequeBookComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChequeBookComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

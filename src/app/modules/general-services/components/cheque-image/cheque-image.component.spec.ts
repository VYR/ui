import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeImageComponent } from './cheque-image.component';

describe('ChequeImageComponent', () => {
    let component: ChequeImageComponent;
    let fixture: ComponentFixture<ChequeImageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChequeImageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChequeImageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

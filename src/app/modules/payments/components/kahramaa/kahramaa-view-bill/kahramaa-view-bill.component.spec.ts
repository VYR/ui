import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KahramaaViewBillComponent } from './kahramaa-view-bill.component';

describe('KahramaaViewBillComponent', () => {
    let component: KahramaaViewBillComponent;
    let fixture: ComponentFixture<KahramaaViewBillComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [KahramaaViewBillComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(KahramaaViewBillComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

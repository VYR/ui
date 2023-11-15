import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdcComponent } from './pdc.component';

describe('PdcComponent', () => {
    let component: PdcComponent;
    let fixture: ComponentFixture<PdcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PdcComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PdcComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

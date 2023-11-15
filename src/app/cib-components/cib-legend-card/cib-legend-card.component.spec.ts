import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibLegendCardComponent } from './cib-legend-card.component';

describe('CibLegendCardComponent', () => {
    let component: CibLegendCardComponent;
    let fixture: ComponentFixture<CibLegendCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CibLegendCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CibLegendCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

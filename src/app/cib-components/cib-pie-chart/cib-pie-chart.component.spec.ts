import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibPieChartComponent } from './cib-pie-chart.component';

describe('CibPieChartComponent', () => {
    let component: CibPieChartComponent;
    let fixture: ComponentFixture<CibPieChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CibPieChartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CibPieChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibBarChartComponent } from './cib-bar-chart.component';

describe('CibBarChartComponent', () => {
    let component: CibBarChartComponent;
    let fixture: ComponentFixture<CibBarChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CibBarChartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CibBarChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

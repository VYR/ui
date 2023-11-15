import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportLcComponent } from './export-lc.component';

describe('ExportLcComponent', () => {
    let component: ExportLcComponent;
    let fixture: ComponentFixture<ExportLcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExportLcComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ExportLcComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

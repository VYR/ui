import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibTableComponent } from './cib-table.component';

describe('CibTableComponent', () => {
    let component: CibTableComponent;
    let fixture: ComponentFixture<CibTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CibTableComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CibTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgStatusViewComponent } from './bg-status-view.component';

describe('LcStatusViewComponent', () => {
    let component: BgStatusViewComponent;
    let fixture: ComponentFixture<BgStatusViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BgStatusViewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BgStatusViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

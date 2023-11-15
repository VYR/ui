import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgStatusComponent } from './bg-status.component';

describe('BgStatusComponent', () => {
    let component: BgStatusComponent;
    let fixture: ComponentFixture<BgStatusComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BgStatusComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BgStatusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

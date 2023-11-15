import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgDetailsComponent } from './bg-details.component';

describe('BgDetailsComponent', () => {
    let component: BgDetailsComponent;
    let fixture: ComponentFixture<BgDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BgDetailsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BgDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

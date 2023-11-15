import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgDraftsComponent } from './bg-drafts.component';

describe('BgDraftsComponent', () => {
    let component: BgDraftsComponent;
    let fixture: ComponentFixture<BgDraftsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BgDraftsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BgDraftsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

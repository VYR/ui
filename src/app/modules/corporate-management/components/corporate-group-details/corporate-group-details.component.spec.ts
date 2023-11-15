import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateGroupDetailsComponent } from './corporate-group-details.component';

describe('CorporateGroupDetailsComponent', () => {
    let component: CorporateGroupDetailsComponent;
    let fixture: ComponentFixture<CorporateGroupDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CorporateGroupDetailsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CorporateGroupDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

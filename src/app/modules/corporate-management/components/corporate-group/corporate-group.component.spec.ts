import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateGroupComponent } from './corporate-group.component';

describe('CorporateGroupComponent', () => {
    let component: CorporateGroupComponent;
    let fixture: ComponentFixture<CorporateGroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CorporateGroupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CorporateGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

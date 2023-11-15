import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibFilterMenuComponent } from './cib-filter-menu.component';

describe('CibFilterMenuComponent', () => {
    let component: CibFilterMenuComponent;
    let fixture: ComponentFixture<CibFilterMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CibFilterMenuComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CibFilterMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

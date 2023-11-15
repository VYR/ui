import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibDrawerLayoutComponent } from './cib-drawer-layout.component';

describe('CibDrawerLayoutComponent', () => {
    let component: CibDrawerLayoutComponent;
    let fixture: ComponentFixture<CibDrawerLayoutComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CibDrawerLayoutComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CibDrawerLayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

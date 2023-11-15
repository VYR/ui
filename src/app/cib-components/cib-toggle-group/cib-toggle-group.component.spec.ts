import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibToggleGroupComponent } from './cib-toggle-group.component';

describe('CibToggleGroupComponent', () => {
    let component: CibToggleGroupComponent;
    let fixture: ComponentFixture<CibToggleGroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CibToggleGroupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CibToggleGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

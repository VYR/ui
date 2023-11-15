import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitlementListComponent } from './entitlement-list.component';

describe('EntitlementListComponent', () => {
    let component: EntitlementListComponent;
    let fixture: ComponentFixture<EntitlementListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EntitlementListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EntitlementListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

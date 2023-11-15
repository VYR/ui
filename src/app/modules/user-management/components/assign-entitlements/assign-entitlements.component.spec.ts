import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEntitlementsComponent } from './assign-entitlements.component';

describe('AssignEntitlementsComponent', () => {
    let component: AssignEntitlementsComponent;
    let fixture: ComponentFixture<AssignEntitlementsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AssignEntitlementsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AssignEntitlementsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

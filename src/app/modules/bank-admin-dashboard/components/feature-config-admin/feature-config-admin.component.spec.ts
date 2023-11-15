import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureConfigAdminComponent } from './feature-config-admin.component';

describe('FeatureConfigAdminComponent', () => {
    let component: FeatureConfigAdminComponent;
    let fixture: ComponentFixture<FeatureConfigAdminComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FeatureConfigAdminComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FeatureConfigAdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureConfigCorporateComponent } from './feature-config-corporate.component';

describe('FeatureConfigCorporateComponent', () => {
    let component: FeatureConfigCorporateComponent;
    let fixture: ComponentFixture<FeatureConfigCorporateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FeatureConfigCorporateComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FeatureConfigCorporateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

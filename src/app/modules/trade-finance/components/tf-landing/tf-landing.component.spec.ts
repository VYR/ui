import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TfLandingComponent } from './tf-landing.component';

describe('TfLandingComponent', () => {
    let component: TfLandingComponent;
    let fixture: ComponentFixture<TfLandingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TfLandingComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TfLandingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

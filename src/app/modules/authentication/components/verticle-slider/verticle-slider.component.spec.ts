import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticleSliderComponent } from './verticle-slider.component';

describe('VerticleSliderComponent', () => {
    let component: VerticleSliderComponent;
    let fixture: ComponentFixture<VerticleSliderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VerticleSliderComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VerticleSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

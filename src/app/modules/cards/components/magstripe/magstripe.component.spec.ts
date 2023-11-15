import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagstripeComponent } from './magstripe.component';

describe('MagstripeComponent', () => {
    let component: MagstripeComponent;
    let fixture: ComponentFixture<MagstripeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MagstripeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MagstripeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

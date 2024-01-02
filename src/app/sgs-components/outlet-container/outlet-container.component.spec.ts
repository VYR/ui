import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletContainerComponent } from './outlet-container.component';

describe('OutletContainerComponent', () => {
    let component: OutletContainerComponent;
    let fixture: ComponentFixture<OutletContainerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OutletContainerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OutletContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

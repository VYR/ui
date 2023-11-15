import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KahramaaComponent } from './kahramaa.component';

describe('KahramaaComponent', () => {
    let component: KahramaaComponent;
    let fixture: ComponentFixture<KahramaaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [KahramaaComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(KahramaaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

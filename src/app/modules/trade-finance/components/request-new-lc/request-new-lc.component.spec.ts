import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestNewLcComponent } from './request-new-lc.component';

describe('RequestNewLcComponent', () => {
    let component: RequestNewLcComponent;
    let fixture: ComponentFixture<RequestNewLcComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RequestNewLcComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RequestNewLcComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

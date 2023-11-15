import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceDeskComponent } from './customer-service-desk.component';

describe('CustomerServiceDeskComponent', () => {
    let component: CustomerServiceDeskComponent;
    let fixture: ComponentFixture<CustomerServiceDeskComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustomerServiceDeskComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomerServiceDeskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

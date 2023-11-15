import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibNotificationComponent } from './cib-notification.component';

describe('CibNotificationComponent', () => {
    let component: CibNotificationComponent;
    let fixture: ComponentFixture<CibNotificationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CibNotificationComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CibNotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

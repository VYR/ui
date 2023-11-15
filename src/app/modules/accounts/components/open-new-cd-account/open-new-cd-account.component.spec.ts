import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenNewCDAccountComponent } from './open-new-cd-account.component';

describe('OpenNewCDAccountComponent', () => {
    let component: OpenNewCDAccountComponent;
    let fixture: ComponentFixture<OpenNewCDAccountComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OpenNewCDAccountComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OpenNewCDAccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

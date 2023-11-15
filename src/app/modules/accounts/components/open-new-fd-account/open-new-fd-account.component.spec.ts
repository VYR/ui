import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenNewFDAccountComponent } from './open-new-fd-account.component';

describe('OpenNewFDAccountComponent', () => {
    let component: OpenNewFDAccountComponent;
    let fixture: ComponentFixture<OpenNewFDAccountComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OpenNewFDAccountComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OpenNewFDAccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAccountViewComponent } from './new-account-view.component';

describe('NewAccountViewComponent', () => {
    let component: NewAccountViewComponent;
    let fixture: ComponentFixture<NewAccountViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewAccountViewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NewAccountViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

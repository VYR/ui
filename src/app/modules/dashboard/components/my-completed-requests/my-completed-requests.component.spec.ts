import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCompletedRequestsComponent } from './my-completed-requests.component';

describe('MyCompletedRequestsComponent', () => {
    let component: MyCompletedRequestsComponent;
    let fixture: ComponentFixture<MyCompletedRequestsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MyCompletedRequestsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MyCompletedRequestsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

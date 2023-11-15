import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsListTableComponent } from './requests-list-table.component';

describe('RequestsListTableComponent', () => {
    let component: RequestsListTableComponent;
    let fixture: ComponentFixture<RequestsListTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RequestsListTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RequestsListTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

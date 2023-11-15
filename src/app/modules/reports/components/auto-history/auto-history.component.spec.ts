import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoHistoryComponent } from './auto-history.component';

describe('AutoHistoryComponent', () => {
    let component: AutoHistoryComponent;
    let fixture: ComponentFixture<AutoHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AutoHistoryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AutoHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

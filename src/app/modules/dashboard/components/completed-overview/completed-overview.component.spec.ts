import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedOverviewComponent } from './completed-overview.component';

describe('CompletedOverviewComponent', () => {
    let component: CompletedOverviewComponent;
    let fixture: ComponentFixture<CompletedOverviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CompletedOverviewComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CompletedOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

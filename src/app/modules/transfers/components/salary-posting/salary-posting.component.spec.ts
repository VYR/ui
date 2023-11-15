import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryPostingComponent } from './salary-posting.component';

describe('SalaryPostingComponent', () => {
    let component: SalaryPostingComponent;
    let fixture: ComponentFixture<SalaryPostingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SalaryPostingComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SalaryPostingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

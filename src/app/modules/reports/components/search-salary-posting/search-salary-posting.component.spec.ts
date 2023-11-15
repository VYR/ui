import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSalaryPostingComponent } from './search-salary-posting.component';

describe('SearchSalaryPostingComponent', () => {
    let component: SearchSalaryPostingComponent;
    let fixture: ComponentFixture<SearchSalaryPostingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchSalaryPostingComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchSalaryPostingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

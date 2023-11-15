import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDividendPayComponent } from './search-dividend-pay.component';

describe('SearchDividendPayComponent', () => {
    let component: SearchDividendPayComponent;
    let fixture: ComponentFixture<SearchDividendPayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchDividendPayComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchDividendPayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

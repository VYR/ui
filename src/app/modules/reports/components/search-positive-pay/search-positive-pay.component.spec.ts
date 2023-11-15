import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPositivePayComponent } from './search-positive-pay.component';

describe('SearchPositivePayComponent', () => {
    let component: SearchPositivePayComponent;
    let fixture: ComponentFixture<SearchPositivePayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchPositivePayComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchPositivePayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFutureDatedTransferComponent } from './search-future-dated-transfer.component';

describe('SearchFutureDatedTransferComponent', () => {
    let component: SearchFutureDatedTransferComponent;
    let fixture: ComponentFixture<SearchFutureDatedTransferComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchFutureDatedTransferComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchFutureDatedTransferComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

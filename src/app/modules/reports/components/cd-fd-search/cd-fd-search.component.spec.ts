import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdFdSearchComponent } from './cd-fd-search.component';

describe('CdFdSearchComponent', () => {
    let component: CdFdSearchComponent;
    let fixture: ComponentFixture<CdFdSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CdFdSearchComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CdFdSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

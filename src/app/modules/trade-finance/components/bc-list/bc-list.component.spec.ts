import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcListComponent } from './bc-list.component';

describe('BcListComponent', () => {
    let component: BcListComponent;
    let fixture: ComponentFixture<BcListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BcListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(BcListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibInputChipComponent } from './cib-input-chip.component';

describe('CibInputChipComponent', () => {
    let component: CibInputChipComponent;
    let fixture: ComponentFixture<CibInputChipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CibInputChipComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CibInputChipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CibCardComponent } from './cib-card.component';

describe('CibCardComponent', () => {
    let component: CibCardComponent;
    let fixture: ComponentFixture<CibCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CibCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CibCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

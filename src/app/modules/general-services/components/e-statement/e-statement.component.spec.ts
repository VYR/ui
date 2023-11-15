import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EStatementComponent } from './e-statement.component';

describe('EStatementComponent', () => {
    let component: EStatementComponent;
    let fixture: ComponentFixture<EStatementComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EStatementComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EStatementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

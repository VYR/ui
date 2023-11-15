import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DhareebaComponent } from './dhareeba.component';

describe('DhareebaComponent', () => {
    let component: DhareebaComponent;
    let fixture: ComponentFixture<DhareebaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DhareebaComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DhareebaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

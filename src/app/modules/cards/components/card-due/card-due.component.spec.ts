import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDueComponent } from './card-due.component';

describe('CardDueComponent', () => {
    let component: CardDueComponent;
    let fixture: ComponentFixture<CardDueComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CardDueComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CardDueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

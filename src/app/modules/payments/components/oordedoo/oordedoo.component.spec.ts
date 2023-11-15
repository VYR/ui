import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OordedooComponent } from './oordedoo.component';

describe('OordedooComponent', () => {
    let component: OordedooComponent;
    let fixture: ComponentFixture<OordedooComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OordedooComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OordedooComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

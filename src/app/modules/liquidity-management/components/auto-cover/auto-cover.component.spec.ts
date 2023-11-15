import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCoverComponent } from './auto-cover.component';

describe('AutoCoverComponent', () => {
    let component: AutoCoverComponent;
    let fixture: ComponentFixture<AutoCoverComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AutoCoverComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AutoCoverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

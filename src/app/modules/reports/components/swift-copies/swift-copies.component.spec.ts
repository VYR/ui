import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiftCopiesComponent } from './swift-copies.component';

describe('SwiftCopiesComponent', () => {
    let component: SwiftCopiesComponent;
    let fixture: ComponentFixture<SwiftCopiesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SwiftCopiesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SwiftCopiesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

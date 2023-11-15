import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterH2hComponent } from './register-h2h.component';

describe('RegisterH2hComponent', () => {
    let component: RegisterH2hComponent;
    let fixture: ComponentFixture<RegisterH2hComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RegisterH2hComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterH2hComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationConfigComponent } from './application-config.component';

describe('ApplicationConfigComponent', () => {
    let component: ApplicationConfigComponent;
    let fixture: ComponentFixture<ApplicationConfigComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ApplicationConfigComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ApplicationConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostToHostComponent } from './host-to-host.component';

describe('HostToHostComponent', () => {
    let component: HostToHostComponent;
    let fixture: ComponentFixture<HostToHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HostToHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(HostToHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

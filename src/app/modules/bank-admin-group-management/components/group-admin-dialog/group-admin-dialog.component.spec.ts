import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupAdminDialogComponent } from './group-admin-dialog.component';

describe('GroupAdminDialogComponent', () => {
    let component: GroupAdminDialogComponent;
    let fixture: ComponentFixture<GroupAdminDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GroupAdminDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GroupAdminDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

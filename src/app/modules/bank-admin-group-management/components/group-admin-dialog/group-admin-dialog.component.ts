import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
@Component({
    selector: 'app-group-admin-dialog',
    templateUrl: './group-admin-dialog.component.html',
    styleUrls: ['./group-admin-dialog.component.scss'],
})
export class GroupAdminDialogComponent {
    showStatus = false;
    DECISION = DECISION;
    constructor(public dialogRef: MatDialogRef<GroupAdminDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    action(action: DECISION) {
        this.dialogRef.close({
            decision: action,
            data: this.data,
        });
    }
}

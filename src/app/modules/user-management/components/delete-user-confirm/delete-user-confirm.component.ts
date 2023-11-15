import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-user',
    templateUrl: './delete-user-confirm.component.html',
    styleUrls: ['./delete-user-confirm.component.scss'],
})
export class DeleteUserConfirmComponent {
    message: String;
    constructor(public dialogRef: MatDialogRef<DeleteUserConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.message = this.data.data?.message;
    }

    onUpdateUser(event: boolean) {
        this.dialogRef.close();
    }

    submit() {
        this.dialogRef.close({ action: 'success' });
    }
}

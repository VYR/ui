import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-cheque-details',
    templateUrl: './cheque-details.component.html',
    styleUrls: ['./cheque-details.component.scss'],
})
export class ChequeDetailsComponent implements OnInit {
    fields: any;

    constructor(public dialogRef: MatDialogRef<ChequeDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(): void {
        this.fields = this.data.fields;
    }

    onCancel() {
        this.dialogRef.close({ event: 'cancel' });
    }
}

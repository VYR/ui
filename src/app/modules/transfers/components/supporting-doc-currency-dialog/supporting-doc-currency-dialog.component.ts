import { Component, OnInit, Inject, Input } from '@angular/core';
import { DECISION } from 'src/app/shared/enums';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-supporting-doc-currency-dialog',
    templateUrl: './supporting-doc-currency-dialog.component.html',
    styleUrls: ['./supporting-doc-currency-dialog.component.scss'],
})
export class SupportingDocCurrencyDialogComponent {
    DECISION = DECISION;

    constructor(public dialogRef: MatDialogRef<SupportingDocCurrencyDialogComponent>) {}

    action(action: DECISION) {
        this.dialogRef.close({
            decision: action,
        });
    }
}

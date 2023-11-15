import { Component, Inject } from '@angular/core';
import { DECISION, SALARY_POSTING_COLUMNS } from 'src/app/shared/enums';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-salary-posting-error-dialog',
    templateUrl: './salary-posting-error-dialog.component.html',
    styleUrls: ['./salary-posting-error-dialog.component.scss'],
})
export class SalaryPostingErrorDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<SalaryPostingErrorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}
    DECISION = DECISION;
    SALARY_POSTING_COLUMNS = SALARY_POSTING_COLUMNS;

    action(action: DECISION) {
        this.dialogRef.close({
            decision: action,
            data: this.data,
        });
    }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { OperationsApprovalsSandbox } from '../operations-approvals.sandbox';

@Component({
    selector: 'app-operations-approvals-action',
    templateUrl: './operations-approvals-action.component.html',
    styleUrls: ['./operations-approvals-action.component.scss'],
})
export class OperationsApprovalsActionComponent {
    parentData: any;
    form: FormGroup = new FormGroup({});
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private sandBox: OperationsApprovalsSandbox,
        public dialogRef: MatDialogRef<OperationsApprovalsActionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    actOnRequest() {
        const payload = {
            request: {
                srid: this.parentData.event.requestId,
                srstatus: this.form.controls['actionStatus'].value,
                srnotes: this.form.controls['actionMessage'].value,
            },
        };

        this.sandBox.serviceRequestAction(payload).subscribe((res: any) => {
            this.dialogRef.close();
            this.router.navigate([APP_ROUTES.OPERATION_APPROVAL_SERVICE]);
        });
    }

    action() {
        this.dialogRef.close({});
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            actionMessage: [null, [Validators.required]],
            actionStatus: [null, [Validators.required]],
        });
        this.parentData = this.data;
    }
}

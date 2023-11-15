import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DECISION } from 'src/app/shared/enums';
import { PreviewComponent } from '../preview/preview.component';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';

@Component({
    selector: 'app-aamali-debit-card-request-confirmation',
    templateUrl: './aamali-debit-card-request-confirmation.component.html',
    styleUrls: ['./aamali-debit-card-request-confirmation.component.scss'],
})
export class AamaliDebitCardRequestConfirmationComponent {
    DECISION = DECISION;
    otpConfig: any;
    otp: string = '';
    isOtpFilled: boolean = false;
    mode: any = DECISION.VERIFY;
    notes: string = '';
    isAgreed: boolean = false;
    termsFileName = '';
    termsUrl = '';
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: CibDialogService,
        public dialogRef: MatDialogRef<AamaliDebitCardRequestConfirmationComponent>
    ) {
        this.mode = this.data.data.action;
        this.termsFileName = this.data.data?.termsFileName || '';
        this.termsUrl = this.data.data?.termsUrl || '';
    }

    checkIfDisabled() {
        if (this.otp.length !== 6) return true;
        if (this.mode === DECISION.REJECT && this.notes?.length === 0) return true;
        return false;
    }
    action(action: DECISION) {
        this.data = { ...this.data, ...{ otp: this.otp, notes: this.notes } };
        this.dialogRef.close({
            decision: action,
            data: this.data,
        });
    }

    openTermsDoc() {
        const ref = this.dialog.openOverlayPanel('Terms & Conditions', PreviewComponent, {
            content: window.origin + '/assets/content/cards/Terms.pdf',
        });
        ref.afterClosed().subscribe((res: any) => {
            this.isAgreed = res?.decision || false;
        });
    }
}

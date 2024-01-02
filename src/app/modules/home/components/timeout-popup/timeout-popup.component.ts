import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SgsDrawerLayoutComponent } from 'src/app/sgs-components/sgs-drawer-layout/sgs-drawer-layout.component';

@Component({
    selector: 'app-timeout-popup',
    templateUrl: './timeout-popup.component.html',
    styleUrls: ['./timeout-popup.component.scss'],
})
export class TimeoutPopupComponent implements OnInit {
    timeLeft!: string;
    constructor(public dialogRef: MatDialogRef<SgsDrawerLayoutComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(): void {
        this.data.status.subscribe((status: string) => {
            this.initiateSecondTimer(status);
        });
    }

    initiateSecondTimer(status: string) {
        switch (status) {
            case 'INITIATE_SECOND_TIMER':
                break;

            case 'SECOND_TIMER_STARTED':
                break;

            case 'SECOND_TIMER_STOPPED':
                this.close('LOGOUT');
                break;

            default:
                this.timeLeft = status;
                break;
        }
    }

    close(action: string) {
        this.dialogRef.close({
            action,
        });
    }
}

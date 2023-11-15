import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
    selector: 'app-account-transactions-details',
    templateUrl: './account-transactions-details.component.html',
    styleUrls: ['./account-transactions-details.component.scss'],
})
export class AccountTransationsDetailsComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

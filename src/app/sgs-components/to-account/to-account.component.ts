import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-to-account',
    templateUrl: './to-account.component.html',
    styleUrls: ['./to-account.component.scss'],
})
export class ToAccountComponent implements OnChanges {
    @Input() parentForm: FormGroup = new FormGroup({});
    @Input() toAccounts: any[] = [];
    @Input() reset: boolean = false;
    @Input() type: number = 0;
    @Output() selectAccount = new EventEmitter();
    toAccount: any;

    constructor() {}

    selectToAccount() {
        this.selectAccount.emit(this.toAccount);
    }

    ngOnChanges() {
        this.parentForm.controls['toAccount'].reset();
    }
}

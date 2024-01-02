import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-from-account',
    templateUrl: './from-account.component.html',
    styleUrls: ['./from-account.component.scss'],
})
export class FromAccountComponent implements OnChanges {
    @Input() parentForm: FormGroup = new FormGroup({});
    @Input() fromAccounts: any[] = [];
    @Output() selectAccount = new EventEmitter();
    fromAccount: any;

    constructor() {}

    selectFromAccount() {
        this.selectAccount.emit(this.fromAccount);
    }

    ngOnChanges() {
        this.parentForm.controls['fromAccount'].reset();
    }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-account-select',
    templateUrl: './account-select.component.html',
    styleUrls: ['./account-select.component.scss'],
})
export class AccountSelectComponent {
    @Input() label!: string;
    @Input() options!: Array<any>;
    @Input() formControlName!: string;
    @Input() formGroup!: any;
    @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();

    constructor() {}

    getValue() {
        return this.formGroup.controls[this.formControlName].value;
    }
}

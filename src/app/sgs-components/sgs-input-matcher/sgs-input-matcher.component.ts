import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-sgs-input-matcher',
    templateUrl: './sgs-input-matcher.component.html',
    styleUrls: ['./sgs-input-matcher.component.scss'],
})
export class SgsInputMatcherComponent implements OnChanges {
    isPinNotMatched: boolean = false;
    isValidForm: boolean = false;
    pin: FormControl = new FormControl();
    confirmPin: FormControl = new FormControl();
    @ViewChild('ngOtpInputPin') ngOtpInputPinRef: any;
    @ViewChild('ngOtpInputConfirmPin') ngOtpInputConfirmPin: any;
    @Output() inputMatchEvent: EventEmitter<any> = new EventEmitter<any>();
    @Input() label1: string = 'Enter 4-Digit PIN';
    @Input() label2: string = 'Confirm PIN';
    @Input() errorMessage: string = 'PIN and Confirm PIN does not matched.';
    @Input() isClearData: boolean = false;
    constructor() {}
    onInputChange() {
        if (this.pin.value && this.confirmPin.value)
            if (this.pin.value.length == 4 && this.confirmPin.value.length === 4) {
                this.isPinNotMatched = this.pin.value !== this.confirmPin.value;
                this.isValidForm = this.pin.value === this.confirmPin.value;
            } else {
                this.isValidForm = false;
                this.isPinNotMatched = false;
            }
        this.inputMatchEvent.emit({ value: this.pin.value, status: this.isValidForm });
    }

    resetData() {
        this.ngOtpInputPinRef.setValue(null);
        this.ngOtpInputConfirmPin.setValue(null);
        this.inputMatchEvent.emit({ value: '', status: false });
    }

    ngOnChanges() {
        if (this.isClearData) this.resetData();
    }
}

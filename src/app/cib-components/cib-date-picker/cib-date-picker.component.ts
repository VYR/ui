import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CustomDatePipe } from 'src/app/shared/pipes/date.pipe';

@Component({
    selector: 'app-cib-date-picker',
    templateUrl: './cib-date-picker.component.html',
    styleUrls: ['./cib-date-picker.component.scss'],
})
export class CibDatePickerComponent {
    @Input() parentForm: FormGroup = new FormGroup({});
    @Input() minDate!: Date;
    @Input() maxDate!: Date;
    @Input() placeholder!: string;
    @Input() disabled!: boolean;
    @Input() fomrControlName!: string;
    startDate = null;

    @Output() selectDate = new EventEmitter();
    @Output() selectDateRevFormat = new EventEmitter();
    constructor(private datePipe: CustomDatePipe) {}

    formatDate(ev: MatDatepickerInputEvent<any>): any {
        this.startDate = this.datePipe.transform(ev.value);
        this.selectDateRevFormat.emit(this.datePipe.transformDate(ev.value));
        this.selectDate.emit(this.startDate);
    }
}

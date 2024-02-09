import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CustomDatePipe } from 'src/app/shared/pipes/date.pipe';

@Component({
    selector: 'app-sgs-date-picker',
    templateUrl: './sgs-date-picker.component.html',
    styleUrls: ['./sgs-date-picker.component.scss'],
})
export class SgsDatePickerComponent {
    @Input() parentForm: FormGroup = new FormGroup({});
    @Input() minDate!: Date;
    @Input() maxDate!: Date;
    @Input() placeholder!: string;
    @Input() dateFormat: string='dd-MM-YYYY';
    @Input() disabled!: boolean;
    @Input() fomrControlName!: string;
    startDate = null;

    @Output() selectDate = new EventEmitter();
    constructor(private datePipe: CustomDatePipe) {}

    formatDate(ev: MatDatepickerInputEvent<any>): any {
        this.startDate = this.datePipe.transform(ev.value,this.dateFormat);
        this.selectDate.emit(this.startDate);
    }
}

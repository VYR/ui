import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup } from '@angular/forms';
@Component({
    selector: 'app-sgs-input-chip',
    templateUrl: './sgs-input-chip.component.html',
    styleUrls: ['./sgs-input-chip.component.scss'],
})
export class SgsInputChipComponent {
    @Input() isEmailInput!: boolean;
    @Input() placeholder!: any;
    @Output() enterKeyPressed = new EventEmitter();
    separatorKeysCodes: number[] = [ENTER, COMMA];
    inputCtrl: any = '';
    selectedValues: Array<string> = [];
    constructor() {}

    add(event: any): void {
        const value = (event.target.value || '').trim();
        if (value.length > 0 && this.selectedValues.indexOf(value) === -1) {
            if (this.isEmailInput) {
                if (this.isValidEmail(value)) this.proceedNext(event, value);
            } else {
                this.proceedNext(event, value);
            }
        }
    }

    proceedNext(event: any, value: any) {
        this.selectedValues.push(value);
        event.target.value = '';
        this.inputCtrl = null;
        this.enterKeyPressed.emit(this.selectedValues);
    }

    remove(value: string): void {
        const index = this.selectedValues.indexOf(value);
        if (index >= 0) {
            this.selectedValues.splice(index, 1);
        }
        this.enterKeyPressed.emit(this.selectedValues);
    }

    isValidEmail(value: any) {
        const emailReg: any = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return emailReg.test(value);
    }
}

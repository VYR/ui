import { Directive, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appDisableControl]',
})
export class DisableControlDirective implements OnInit {
    disabled: boolean = false;

    @Input() set appDisableControl(condition: boolean) {
        if (this.disabled !== undefined) {
            this.toggleForm(condition);
        }
        this.disabled = condition;
    }

    constructor(private ngControl: NgControl) {}

    ngOnInit() {
        this.toggleForm(this.disabled);
    }

    toggleForm(condition: boolean) {
        const action = condition ? 'disable' : 'enable';
        if (this.ngControl.control) this.ngControl.control[action]();
    }
}

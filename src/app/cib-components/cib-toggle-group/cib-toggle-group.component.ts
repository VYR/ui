import { Component, Input, OnInit } from '@angular/core';

export interface ToggleOption {
    label: string;
    value: any;
}

@Component({
    selector: 'app-cib-toggle-group',
    templateUrl: './cib-toggle-group.component.html',
    styleUrls: ['./cib-toggle-group.component.scss'],
})
export class CibToggleGroupComponent {
    @Input() formControlName!: string;
    @Input() formGroup!: any;
    @Input() options: Array<ToggleOption> = [];
    @Input() value: any;
    @Input() label!: string;
    @Input() disabled!: boolean;
    @Input() showAsterik!: boolean;

    constructor() {}
}

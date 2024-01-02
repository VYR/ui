import { Component, Input, OnInit } from '@angular/core';

export interface ToggleOption {
    label: string;
    value: any;
}

@Component({
    selector: 'app-sgs-toggle-group',
    templateUrl: './sgs-toggle-group.component.html',
    styleUrls: ['./sgs-toggle-group.component.scss'],
})
export class SgsToggleGroupComponent {
    @Input() formControlName!: string;
    @Input() formGroup!: any;
    @Input() options: Array<ToggleOption> = [];
    @Input() value: any;
    @Input() label!: string;
    @Input() disabled!: boolean;
    @Input() showAsterik!: boolean;

    constructor() {}
}

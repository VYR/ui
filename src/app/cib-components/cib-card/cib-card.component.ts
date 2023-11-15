import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-cib-card',
    templateUrl: './cib-card.component.html',
    styleUrls: ['./cib-card.component.scss'],
})
export class CibCardComponent {
    @Input() isActive!: boolean;
    @Output() _click: EventEmitter<any> = new EventEmitter<any>();
    @Input() styles: any;
    constructor() {}
}

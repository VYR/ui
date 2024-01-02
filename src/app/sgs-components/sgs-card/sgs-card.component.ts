import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-sgs-card',
    templateUrl: './sgs-card.component.html',
    styleUrls: ['./sgs-card.component.scss'],
})
export class SgsCardComponent {
    @Input() isActive!: boolean;
    @Output() _click: EventEmitter<any> = new EventEmitter<any>();
    @Input() styles: any;
    constructor() {}
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-cib-filter-menu',
    templateUrl: './cib-filter-menu.component.html',
    styleUrls: ['./cib-filter-menu.component.scss'],
})
export class CibFilterMenuComponent {
    @Input() options = [];
    @Input() title!: string;
    @Input() category!: string;
    selectedIndex!: number;
    @Output() _select: EventEmitter<number> = new EventEmitter<number>();

    constructor() {}

    onSelectChip(index: number) {
        this.selectedIndex = index;
        this._select.emit(index);
    }
}

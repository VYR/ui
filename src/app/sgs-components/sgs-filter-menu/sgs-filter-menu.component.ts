import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-sgs-filter-menu',
    templateUrl: './sgs-filter-menu.component.html',
    styleUrls: ['./sgs-filter-menu.component.scss'],
})
export class SgsFilterMenuComponent {
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

import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-sgs-legend-card',
    templateUrl: './sgs-legend-card.component.html',
    styleUrls: ['./sgs-legend-card.component.scss'],
})
export class SgsLegendCardComponent {
    @Input() title: string = 'Title';
    constructor() {}
}

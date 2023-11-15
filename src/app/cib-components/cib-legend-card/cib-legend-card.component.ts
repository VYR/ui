import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-cib-legend-card',
    templateUrl: './cib-legend-card.component.html',
    styleUrls: ['./cib-legend-card.component.scss'],
})
export class CibLegendCardComponent {
    @Input() title: string = 'Title';
    constructor() {}
}

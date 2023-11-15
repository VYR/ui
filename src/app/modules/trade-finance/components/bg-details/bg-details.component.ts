import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-bg-details',
    templateUrl: './bg-details.component.html',
    styleUrls: ['./bg-details.component.scss'],
})
export class BgDetailsComponent {
    @Input() selectedBGDetails!: any;
    constructor() {}
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-transfer-info',
    templateUrl: './transfer-info.component.html',
    styleUrls: ['./transfer-info.component.scss'],
})
export class TransferInfoComponent {
    @Input() transfers: any;
    constructor() {}
}

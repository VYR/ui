import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-transfer-header-info',
    templateUrl: './transfer-header-info.component.html',
    styleUrls: ['./transfer-header-info.component.scss'],
})
export class TransferHeaderInfoComponent {
    @Input() transfer: any;
    constructor() {}
}

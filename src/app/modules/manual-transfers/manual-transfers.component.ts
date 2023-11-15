import { Component } from '@angular/core';

@Component({
    selector: 'app-manual-transfers',
    templateUrl: './manual-transfers.component.html',
    styleUrls: ['./manual-transfers.component.scss'],
})
export class ManualTransfersComponent {
    public menu: Array<any> = [
        {
            uuid: 'TRANSFER_SIMPLE_LIST_MAKER',
            name: 'Listing Manual Transfers',
            path: 'manual-transfer-list',
        },
        {
            uuid: 'TRANSFER_SIMPLE_CREATE',
            name: 'Create Manual Transfer',
            path: 'create-manual-transfer',
        },
    ];
}

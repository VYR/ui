import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-future-dated-transfers',
    templateUrl: './future-dated-transfers.component.html',
    styleUrls: ['./future-dated-transfers.component.scss'],
})
export class FutureDatedTransfersComponent {
    public menu: Array<any> = [
        {
            uuid: 'STO_WITH_IN_QIB,STO_WITH_IN_QATAR,STO_INTERNATIONAL',
            name: 'Create Future Dated Transfers',
            path: 'create-sto',
        },
    ];
    constructor() {}
}

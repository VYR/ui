import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-detail-view',
    templateUrl: './detail-view.component.html',
    styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent {
    public menu: Array<any> = [
        {
            uuid: '',
            name: 'Pending Requests',
            path: 'pending',
        },
        {
            uuid: '',
            name: 'Completed Requests',
            path: 'completed',
        },
    ];
    constructor() {}
}

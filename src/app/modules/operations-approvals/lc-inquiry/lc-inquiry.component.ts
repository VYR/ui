import { Component, OnChanges } from '@angular/core';

@Component({
    selector: 'app-lc-inquiry',
    templateUrl: './lc-inquiry.component.html',
    styleUrls: ['./lc-inquiry.component.scss'],
})
export class LcInquiryComponent {
    public menu: Array<any> = [
        {
            uuid: '',
            name: 'Inquiry',
            path: 'lc-inquiry',
        },
        {
            uuid: '',
            name: 'History',
            path: 'lc-history',
        },
    ];
}

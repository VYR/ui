import { Component } from '@angular/core';

@Component({
    selector: 'app-drafts',
    templateUrl: './drafts.component.html',
    styleUrls: ['./drafts.component.scss'],
})
export class DraftsComponent {
    public menu: Array<any> = [
        {
            uuid: '',
            name: 'Transfer Drafts',
            path: 'transfer-drafts',
        },
        {
            uuid: '',
            name: 'Bulk Transfer Drafts',
            path: 'bulk-transfer-drafts',
        },
    ];
}

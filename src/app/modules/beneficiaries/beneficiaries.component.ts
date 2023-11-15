import { Component } from '@angular/core';

@Component({
    selector: 'app-beneficiaries',
    templateUrl: './beneficiaries.component.html',
    styleUrls: ['./beneficiaries.component.scss'],
})
export class BeneficiariesComponent {
    public menu: Array<any> = [
        {
            uuid: '',
            name: 'Beneficiaries',
            path: 'beneficiary-list',
        },
        {
            uuid: 'BENEFICIARY_ADD',
            name: 'Add New Beneficiary',
            path: 'add-beneficiary',
        },
    ];
}

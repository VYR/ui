import { Component, OnInit, Input } from '@angular/core';
import { BeneficiariesSandbox } from '../../beneficiaries.sandbox';

@Component({
    selector: 'app-beneficiary-form',
    templateUrl: './beneficiary-form.component.html',
    styleUrls: ['./beneficiary-form.component.scss'],
})
export class BeneficiaryFormComponent implements OnInit {
    @Input() edit: boolean = false;
    @Input() selectedBeneficiary: any = [];
    countryList: any = [];
    beneficiaryRelations: any = [];
    constructor(private sandBox: BeneficiariesSandbox) {}

    ngOnInit(): void {
        this.getCountryList();
        this.getBeneficiaryRelations();
    }

    public getCountryList() {
        this.sandBox.getCountryList().subscribe((res: any) => {
            this.countryList = res.countries;
        });
    }

    public getBeneficiaryRelations() {
        this.sandBox.getBeneficiaryRelations().subscribe((res: any) => {
            this.beneficiaryRelations = res.relations;
        });
    }
}

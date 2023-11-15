import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UtilService } from 'src/app/utility';
import { Router } from '@angular/router';
import { BeneficiariesSandbox } from '../../beneficiaries.sandbox';

@Component({
    selector: 'app-beneficiary-details',
    templateUrl: './beneficiary-details.component.html',
    styleUrls: ['./beneficiary-details.component.scss'],
})
export class BeneficiaryDetailsComponent implements OnChanges {
    @Input() selectedBeneficiary: any = [];
    @Input() countryList: any = [];
    enableEdit: boolean = false;
    panelOpenState = false;
    auditLogs: any[] = [];
    constructor(private utilService: UtilService, private sandBox: BeneficiariesSandbox, private router: Router) {}

    showEditOption() {
        this.enableEdit = true;
    }

    getCountryName(countryCode: string) {
        return this.utilService.getNameFromList(countryCode, this.countryList, 'name', 'code');
    }

    onTransferClick() {
        this.router.navigate(['home/transfers/single-multiple-transers'], {
            queryParams: { beneficiaryId: this.selectedBeneficiary.beneficiaryId },
        });
    }

    ngOnChanges(): void {
        this.sandBox.getBeneficiaryAuditlog(this.selectedBeneficiary.beneficiaryId).subscribe((response: any) => {
            this.auditLogs = response.data;
        });
    }
}

import { Component, Input } from '@angular/core';
import { AccountsSandbox } from '../../accounts.sandbox';
import * as moment from 'moment';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility/utility.service';

@Component({
    selector: 'app-investment-details',
    templateUrl: './investment-details.component.html',
    styleUrls: ['./investment-details.component.scss'],
})
export class InvestmentDetailsComponent {
    @Input() selectedAccount: any = [];
    deals: any = [];
    hasDeals: boolean = false;
    constructor(public sandBox: AccountsSandbox, private dialog: CibDialogService, private utilService: UtilService) {}

    openDialog(): void {
        this.deals = [];
        this.hasDeals = false;
        this.sandBox.getInvestmentDeals(this.selectedAccount.legacy_no).subscribe((res: any) => {
            if (res?.data?.deals) this.deals = res.data.deals || [];
            this.hasDeals = true;
        });
    }

    ngOnChanges() {
        this.deals = [];
        this.hasDeals = false;
    }

    formatDate(inputDate: any) {
        return moment(inputDate).format('DD-MMM-YYYY');
    }
}

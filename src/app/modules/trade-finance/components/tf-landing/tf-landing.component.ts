import { Component, OnInit } from '@angular/core';
import { TradeFinanceSandbox } from '../../trade-finance.sandbox';

@Component({
    selector: 'app-tf-landing',
    templateUrl: './tf-landing.component.html',
    styleUrls: ['./tf-landing.component.scss'],
})
export class TfLandingComponent {
    public menus: Array<any> = [
        {
            section: 'Letter of Credit',
            menu: [
                {
                    uuid: 'TRADEFINANCE_IMPORT_LC_SAVE,TRADEFINANCE_IMPORT_LC_SUBMIT,LETTER_OF_CREDIT_AMENDMENT_PREVIEW',
                    name: 'Request a New LC',
                    path: 'import-lc',
                },
                {
                    uuid: 'TRADEFINANCE_IMPORT_LC_LIST,TRADEFINANCE_LC_AMEND_LIST',
                    name: 'LC Status',
                    path: 'lc-status',
                },
                {
                    uuid: 'TRADEFINANCE_LCLODGEMENT_LIST',
                    name: 'LC Documents Arrival Notice',
                    path: 'lc-documents-arrival-notice',
                },
                {
                    uuid: 'TRADEFINANCE_IMPORT_LC_DRAFTS_LIST',
                    name: 'LC Drafts',
                    path: 'lc-drafts',
                },
            ],
        },
        {
            section: 'Bank Guarantee',
            menu: [
                {
                    uuid: 'BANK_GUARANTEE_CREATE,BANK_GUARANTEE_SUBMIT,BANK_GUARANTEE_PREVIEW',
                    name: 'Request a New Guarantee',
                    path: 'bank-guarantee',
                },
                {
                    uuid: 'BANK_GUARANTEE_VIEW_DRAFT,BANK_GUARANTEE_VIEW_AMENDMENT_RECORDS',
                    name: 'BG Status',
                    path: 'bg-status',
                },
                {
                    uuid: 'BANK_GUARANTEE_VIEW_DRAFT',
                    name: 'BG Drafts',
                    path: 'bg-drafts',
                },
            ],
        },
        {
            section: 'Export LC',
            menu: [
                {
                    uuid: 'TRADEFINANCE_EXPORT_LC_LIST',
                    name: 'Export LCs Received',
                    path: 'export-lc',
                },
            ],
        },
        {
            section: 'Bills for collection',
            menu: [
                {
                    uuid: 'TRADEFINANCE_LC_CA_DELACPT_LIST',
                    name: 'BC Documents Received',
                    path: 'collection-advicing',
                },
            ],
        },
    ];

    constructor(private sandbox: TradeFinanceSandbox) {}

    onClickSection(menu: any, selected: any) {
        this.sandbox.moduleSelected.next({ menu, selected });
    }
}

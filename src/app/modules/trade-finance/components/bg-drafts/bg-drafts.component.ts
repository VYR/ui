import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CIBTableConfig, ColumnType, SortDirection } from 'src/app/cib-components/cib-table/models/config.model';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { TradeFinanceSandbox } from '../../trade-finance.sandbox';

@Component({
    selector: 'app-bg-drafts',
    templateUrl: './bg-drafts.component.html',
    styleUrls: ['./bg-drafts.component.scss'],
})
export class BgDraftsComponent implements OnInit {
    @ViewChild('menuTrigger') trigger: any;
    tableConfig: CIBTableConfig = {
        columns: [
            {
                key: 'id',
                displayName: 'CIB REFERENCE',
                sortable: true,
            },
            {
                key: 'beneficiaryName',
                displayName: 'BENEFICIARY NAME',
                sortable: true,
            },
            {
                key: 'currency',
                displayName: 'CURRENCY',
                sortable: true,
            },
            {
                key: 'principalAmount',
                displayName: 'AMOUNT',
                type: ColumnType.amount,
                sortable: true,
            },
            {
                key: 'bgProductTypeText',
                displayName: 'BG TYPE',
                sortable: true,
            },
            {
                key: 'expiryDate',
                displayName: 'EXPIRES ON',
                sortable: true,
            },
            {
                key: 'updated',
                displayName: 'REQUEST DATE',
                sortable: true,
            },
            {
                key: 'statusDesc',
                displayName: 'BG STATUS',
                sortable: true,
            },
            {
                key: 'edit',
                displayName: 'Edit',
                type: ColumnType.icon,
                icon: 'la-edit',
                UUID: 'BANK_GUARANTEE_CREATE',
            },
            {
                key: 'delete',
                displayName: 'Delete',
                type: ColumnType.icon,
                icon: 'la-trash-alt',
                UUID: 'BANK_GUARANTEE_DELETE_DRAFT',
            },
        ],
        selection: false,
        totalRecords: 0,
        clientPagination: true,
        data: [],
    };
    public searchBGForm!: FormGroup;
    bgDraftData: any[] = [];
    constructor(
        private sandBox: TradeFinanceSandbox,
        private dialogService: CibDialogService,
        public fb: FormBuilder,
        private utilService: UtilService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getBGDrafts();
        this.searchBGForm = this.fb.group({
            bgBeneficiaryName: [''],
            bgProductTypeText: [''],
        });
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.bgDraftData = this.bgDraftData.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    getBGDrafts() {
        let payload = { type: 'DRAFT' };
        this.sandBox.getBGDrafts(payload).subscribe((res: any) => {
            res.data.forEach((item: any) => {
                item.statusDesc = item.status.statusDesc;
                item.updated = item.updated || item.created;
            });
            this.bgDraftData = res.data;

            this.lazyLoad({ sortKey: 'updated', sortDirection: SortDirection.desc, pageIndex: 0, pageSize: 5 });
        });
    }

    onClickCell(event: any) {
        if (event.key === 'delete') {
            let data = {
                header: '<div>Delete Draft</div>',
                body: '<div>Would you like to delete this Draft</div>',
            };
            let dialogRef = this.dialogService.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    let payload = { bgApplicationId: event.data.id };
                    this.sandBox.deletebankGuarantee(payload).subscribe((res: any) => {
                        this.getBGDrafts();
                        this.utilService.displayNotification('Deleted successfully', 'success');
                    });
                }
            });
        } else {
            let data = {
                header: '<div>Edit Draft</div>',
                body: '<div>Would you like to edit this draft?</div>',
            };
            let dialogRef = this.dialogService.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.sandBox._selectedBG.next({
                        type: 'bgDrafts',
                        data: event.data || [],
                    });
                    this.router.navigate(['home/trade-finance/bank-guarantee']);
                }
            });
        }
    }

    searchBG() {
        let payload = {
            type: 'DRAFT',
            beneficiaryName: this.searchBGForm.value.bgBeneficiaryName
                ? this.searchBGForm.value.bgBeneficiaryName
                : null,
            productType: this.searchBGForm.value.bgProductTypeText ? this.searchBGForm.value.bgProductTypeText : null,
        };
        this.sandBox.getBGDrafts(payload).subscribe((res: any) => {
            res.data.forEach((item: any) => {
                item.statusDesc = item.status.statusDesc;
                item.updated = item.updated || item.created;
            });

            this.bgDraftData = res.data;

            this.lazyLoad({ sortKey: 'updated', sortDirection: SortDirection.desc, pageIndex: 0, pageSize: 5 });

            this.trigger.closeMenu();
            this.searchBGForm.reset();
        });
    }

    loadDataTable() {
        this.tableConfig = {
            ...this.tableConfig,
            data: this.bgDraftData,
            totalRecords: this.bgDraftData.length,
        };
    }

    closeMatmenu() {
        this.searchBGForm.reset();
        this.trigger.closeMenu();
    }
}

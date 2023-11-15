import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CIBTableConfig, ColumnType, SortDirection } from 'src/app/cib-components/cib-table/models/config.model';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { TradeFinanceSandbox } from '../../trade-finance.sandbox';
import { Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/enums/routes';

@Component({
    selector: 'app-lc-drafts',
    templateUrl: './lc-drafts.component.html',
    styleUrls: ['./lc-drafts.component.scss'],
})
export class LcDraftsComponent {
    tableConfig!: CIBTableConfig;
    public filterForm!: FormGroup;
    public cols = [
        {
            key: 'applnId',
            displayName: 'CIB REFERENCE',
            sortable: true,
        },
        {
            key: 'lcBeneficiaryName',
            displayName: 'BENEFICIARY NAME',
            sortable: true,
        },
        {
            key: 'currency',
            displayName: 'AMOUNT',
            sortable: true,
        },
        {
            key: 'amount',
            displayName: 'AMOUNT',
            type: ColumnType.amount,
            sortable: true,
        },
        {
            key: 'lcProductType',
            displayName: 'LC Type',
            sortable: true,
        },
        {
            key: 'updated',
            displayName: 'REQUEST DATE',
            sortable: true,
        },
        {
            key: 'lcExpiryDate',
            displayName: 'EXPIRY DATE',
            sortable: true,
        },
        {
            key: 'statusDesc',
            displayName: 'LC STATUS',
            sortable: true,
        },
        {
            key: 'edit',
            displayName: 'EDIT ',
            type: ColumnType.icon,
            icon: 'la-edit',
            UUID: 'TRADEFINANCE_IMPORT_LC_UPDATE',
        },
        {
            key: 'delete',
            displayName: 'DELETE ',
            type: ColumnType.icon,
            icon: 'la-trash',
            UUID: 'TRADEFINANCE_IMPORT_LC_DELETE',
        },
    ];

    lcdocuments: any = [];

    constructor(
        private sandBox: TradeFinanceSandbox,
        private fb: FormBuilder,
        private dialog: CibDialogService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.filterForm = this.fb.group({
            name: [''],
            type: [''],
        });
        this.getLcDrafts();
    }

    diableFilterButton() {
        return Object.values(this.filterForm.value).every((x: any) => !x);
    }

    public getLcDrafts() {
        this.filterForm.reset();
        this.sandBox.getLcDrafts().subscribe((response: any) => {
            if (response.data) {
                this.lcdocuments = response.data;
                this.lcdocuments.forEach((item: any) => {
                    item.lcBeneficiaryName = item.lcAdvicingBankDetails?.lcBeneficiaryName;
                    item.lcProductType = item.lcbasicDetails?.lcProductType;
                    item.lcExpiryDate = item.lcbasicDetails?.lcExpiryDate;
                    item.statusDesc = item.lcStatusBean?.statusDesc;
                    item.updated = item.updated || item.created;
                });
                this.lazyLoad({ sortKey: 'updated', sortDirection: SortDirection.desc, pageIndex: 0, pageSize: 5 });
            }
        });
    }

    loadDataTable() {
        this.tableConfig = {
            columns: this.cols,
            data: this.lcdocuments,
            selection: false,
            totalRecords: this.lcdocuments.length,
            clientPagination: true,
        };
    }

    public lazyLoad(event: any) {
        if (event.sortKey) {
            this.lcdocuments = this.lcdocuments.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onClickCell(event: any) {
        if (event.key === 'delete') {
            let data = {
                header: '<div>Delete Draft</div>',
                body: '<div>Would you like to delete this draft?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.deleteDraft(event.data);
                }
            });
        } else if (event.key === 'edit') {
            let data = {
                header: '<div>Edit Draft</div>',
                body: '<div>Would you like to edit this LC?</div>',
            };
            let dialogRef = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            dialogRef.afterClosed().subscribe((result: any) => {
                if (result && result.event === 'confirm') {
                    this.sandBox.setLcRequest({ type: 'lcDrafts', data: event.data || [] });
                    this.router.navigate([APP_ROUTES.REQUEST_LC]);
                }
            });
        }
    }

    deleteDraft(rowData: any) {
        this.sandBox.deleteLcDrafts(rowData.applnId).subscribe((response: any) => {
            if (response.status === 'SUCCESS') {
                this.getLcDrafts();
            }
        });
    }

    filterTable() {
        this.lcdocuments = this.lcdocuments.filter((item: any) => {
            return (
                (!this.filterForm.controls['type']?.value ||
                    item.lcbasicDetails?.lcProductType
                        ?.toLowerCase()
                        .includes(this.filterForm.controls['type']?.value.toLowerCase())) &&
                (!this.filterForm.controls['name']?.value ||
                    item.lcAdvicingBankDetails?.lcBeneficiaryName
                        ?.toLowerCase()
                        .includes(this.filterForm.controls['name']?.value.toLowerCase()))
            );
        });

        this.lazyLoad({ sortKey: 'updated', sortDirection: SortDirection.desc, pageIndex: 0, pageSize: 5 });
    }
}

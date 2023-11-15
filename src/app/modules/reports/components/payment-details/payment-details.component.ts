import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { APP_ROUTES } from 'src/app/shared/enums/routes';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { ReportsSandbox } from '../../reports.sandbox';
import { DetailViewComponent } from '../detail-view/detail-view.component';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';

@Component({
    selector: 'app-payment-details',
    templateUrl: './payment-details.component.html',
    styleUrls: ['./payment-details.component.scss'],
})
export class PaymentDetailsComponent implements OnInit {
    queryParams!: any;
    paymentDetailsHistory: any = [];
    constructor(
        private dialog: CibDialogService,
        private utilService: UtilService,
        private sandBox: ReportsSandbox,
        private router: Router,
        private as: ApplicationContextService
    ) {}
    @Input() data: any = [];

    tableConfig!: CIBTableConfig;
    tableConfigHistory!: CIBTableConfig;

    @Output() _onClose = new EventEmitter<boolean>();

    paymentDetails: any = [];

    public cols = [
        {
            key: 'paymentId',
            displayName: 'Payment ID',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'execDateTimeFormatted',
            displayName: 'Execution Date',
            sortable: true,
        },
        {
            key: 'execDateTime',
            displayName: 'Execution Time',
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'STATUS',
            type: ColumnType.status,
            sortable: true,
        },
        {
            key: 'delete',
            displayName: '',
            type: ColumnType.icon,
            icon: 'la-trash',
            sortable: true,
            uuid: 'MODIFY_STO',
        },
    ];

    public colsHistory = [
        {
            key: 'paymentId',
            displayName: 'Payment ID',
            type: ColumnType.link,
            sortable: true,
        },
        {
            key: 'execDateTimeFormatted',
            displayName: 'Execution Date',
            sortable: true,
        },
        {
            key: 'execDateTime',
            displayName: 'Execution Time',
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'STATUS',
            type: ColumnType.status,
            sortable: true,
        },
    ];

    ngOnInit() {
        if (this.data) {
            this.paymentDetails = this.data.paymentDetails;
            this.paymentDetailsHistory = this.data.paymentHistory;

            this.tableConfigHistory = {
                columns: this.colsHistory,
                data: this.paymentDetailsHistory,
                selection: false,
                totalRecords: this.paymentDetailsHistory?.length,
            };

            this.tableConfig = {
                columns: this.cols,
                data: this.paymentDetails,
                selection: false,
                totalRecords: this.paymentDetails.length,
            };
        }
    }

    goBack() {
        this._onClose.emit(true);
    }

    generateExcelHistory() {
        this.utilService.exportAsExcelFile(
            this.formatDataForExcel(this.paymentDetailsHistory || []),
            'FUTURE_DATED_TRANSFERS'
        );
        this.utilService.displayNotification('Excel generated successfully!', 'success');
    }

    generatePdf() {
        this.queryParams = {
            pageSize: 10000,
            pageIndex: 0,
            downloadtype: 'pdf',
            parentReferenceId: this.data.parentFDP,
        };
        this.sandBox.getSTOList(this.queryParams).subscribe((res: any) => {});
    }

    generateExcel() {
        this.utilService.exportAsExcelFile(
            this.formatDataForExcel(this.paymentDetails || []),
            'FUTURE_DATED_TRANSFERS'
        );
        this.utilService.displayNotification('Excel generated successfully!', 'success');
    }

    formatDataForExcel(data: any) {
        const temp: any = [];
        data.forEach((ele: any) => {
            let tempObject: any = {};
            tempObject['REFERENCE NUMBER'] = ele.paymentReference;
            tempObject['PAYMENT ID'] = ele.paymentId;
            tempObject['EXECUTION DATE'] = ele.execDateTimeFormatted;
            tempObject['EXECUTION TIME'] = ele.execDateTime;
            tempObject['STATUS'] = ele.status;
            tempObject['REMARK'] = ele.statusDescription;
            temp.push(tempObject);
        });
        return temp;
    }

    onClickCell(event: any) {
        if (event.key === 'paymentId') {
            this.openSidePanel(event.data);
        }
        if (event.key === 'delete') {
            let data = {
                header: '<div>Delete Standing Order</div>',
                body: '<div>Do you want to delete this Standing Order ?</div>',
            };

            const ref = this.dialog.openDialog(CibDialogType.small, ConfirmationDialogComponent, data);
            ref.afterClosed().subscribe((res) => {
                if (res.event === 'confirm') {
                    this.deleteFDP(event.data);
                }
            });
        }
    }

    deleteFDP(selectedRow: any) {
        const payload = {
            childId: selectedRow.paymentId,
            action: 'CLEARONE',
            parentFDPId: this.data.parentFDP,
        };

        this.sandBox.deleteFdp(payload).subscribe((res: any) => {
            this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
                this.router.navigate([APP_ROUTES.SEARCH_STO]);
            });
        });
    }

    openSidePanel(selectedRow: any) {
        let fieldInfo = [
            { fieldName: 'FDP Reference', fieldValue: this.data.parentFDP },
            { fieldName: 'From Account', fieldValue: this.data.fromAccount },
            { fieldName: 'To Account', fieldValue: this.data.toAccount },
            { fieldName: 'Currency', fieldValue: this.data.benefCurrency },
            { fieldName: 'Amount', fieldValue: this.data.amount },
            { fieldName: 'Charge Type ', fieldValue: this.data.chargeType },
            { fieldName: 'Occurance', fieldValue: this.data.occurence },
            { fieldName: 'Frequency', fieldValue: this.data.fdpType === '1' ? 'ONE-TIME' : this.data.frequencySet },
            { fieldName: 'Customer Reference', fieldValue: this.data.purposeCustRef },
            { fieldName: 'Payment ID', fieldValue: selectedRow.paymentId },
            { fieldName: 'Execution Date', fieldValue: selectedRow.execDateTimeFormatted },
            { fieldName: 'Execution Time', fieldValue: selectedRow.execDateTime },
            { fieldName: 'Payment Status', fieldValue: selectedRow.status },
            { fieldName: 'Reference Number', fieldValue: selectedRow.paymentReference },
            { fieldName: 'Remark', fieldValue: selectedRow.statusDescription },
            { fieldName: 'Created Date', fieldValue: this.data.createdOn },
            { fieldName: 'Created By', fieldValue: this.data.firstNameEng + this.data.lastNameEng },
        ];

        let data = {
            headerName: 'Future Dated Transfers Details',
            isOtpNeeded: false,
            fields: fieldInfo,
            fxTransaction: this.data.fxTransaction,
        };
        const dialogRef = this.dialog.openDrawer('Future Dated Transfers Details', DetailViewComponent, data);
    }
}

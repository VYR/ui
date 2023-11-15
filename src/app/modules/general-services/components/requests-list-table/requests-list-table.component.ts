import { Component, Input } from '@angular/core';
import { GeneralServicesSandbox } from '../../general-services.sandbox';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import { GeneralServicePopupComponent } from '../general-service-popup/general-service-popup.component';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { SERVICE_REQUEST_TYPES } from 'src/app/modules/general-services/constants/constants';
@Component({
    selector: 'app-requests-list-table',
    templateUrl: './requests-list-table.component.html',
    styleUrls: ['./requests-list-table.component.scss'],
})
export class RequestsListTableComponent {
    @Input() requestType: any;
    @Input() disableDropdown: boolean = false;
    selectedType: any;
    sortedData: any = [];
    serviceRequestTypes: any = [];
    tableConfig: CIBTableConfig = new CIBTableConfig();
    public cols = [
        {
            key: 'requestDateTime',
            displayName: 'DATE',
            sortable: true,
            type: ColumnType.date,
        },
        {
            key: 'requestId',
            displayName: 'SERVICE REQUEST ID',
            sortable: true,
            type: ColumnType.link,
        },
        {
            key: 'requestDescription',
            displayName: 'DESCRIPTION',
            sortable: true,
        },
        {
            key: 'status',
            displayName: 'STATUS',
            sortable: true,
            type: ColumnType.status,
        },
    ];
    constructor(private sandBox: GeneralServicesSandbox, private dialog: CibDialogService) {}

    ngOnInit() {
        this.selectedType = this.requestType.type;
        this.serviceRequestTypes = SERVICE_REQUEST_TYPES.filter((val: any) => val.isDropDown);
    }

    public lazyLoad(event: any) {
        event.pageSize = event.pageSize || 5;
        event.pageIndex = event.pageIndex || 0;
        event.requestType = this.selectedType;
        this.getRequests(event);
    }

    getRequests(payload: any) {
        this.sandBox.getRequests(payload).subscribe((res: any) => {
            if (res?.data?.content) {
                this.sortedData = res?.data?.content || [];
                this.sortedData.forEach((property: any) => {
                    if (property.hasOwnProperty('requestType') && property.hasOwnProperty('status')) {
                        if (property.requestType == '1') {
                            if (property.status == 'APPROVED') property.status = 'COMPLETED';
                            if (
                                ['CREATED', 'SUBMITTED', 'REJECTED', 'COMPLETED', 'FAILED'].indexOf(property.status) ==
                                -1
                            )
                                property.status = 'PROCESSING';
                        }
                    }
                });
                this.loadDataTable(res.data.totalElements || 0);
            }
        });
    }

    loadDataTable(totalRecords: number) {
        this.tableConfig = {
            columns: this.cols,
            data: this.sortedData,
            selection: false,
            totalRecords: totalRecords,
        };
    }

    onClickCell(event: any) {
        const payLoad = {
            hideConfirm: true,
            details: {
                data: event.data,
            },
        };
        const ref = this.dialog.openDrawer(this.requestType.popUpTitle, GeneralServicePopupComponent, payLoad);
        ref.afterClosed().subscribe((result: any) => {});
    }

    onRequestTypeChange(req: any) {
        this.sortedData = [];
        this.tableConfig = {
            columns: [],
            data: [],
            selection: false,
            totalRecords: 0,
        };
        let payLoad: any = {};
        payLoad.pageSize = 5;
        payLoad.pageIndex = 0;
        payLoad.requestType = req.selectedType;
        this.lazyLoad(payLoad);
    }

    generateExcel() {
        let payLoad: any = {};
        payLoad.pageSize = 50000;
        payLoad.pageIndex = 0;
        payLoad.requestType = this.selectedType;
        this.sandBox.getRequests(payLoad).subscribe((res: any) => {
            if (res?.data?.content) {
                let excelData = res?.data?.content || [];
                excelData.forEach((property: any) => {
                    if (property.hasOwnProperty('requestType') && property.hasOwnProperty('status')) {
                        if (property.requestType == '1') {
                            if (property.status == 'APPROVED') property.status = 'COMPLETED';
                            if (
                                ['CREATED', 'SUBMITTED', 'REJECTED', 'COMPLETED', 'FAILED'].indexOf(property.status) ==
                                -1
                            )
                                property.status = 'PROCESSING';
                        }
                    }
                });
                this.sandBox.generateExcelData(excelData);
            }
        });
    }
}

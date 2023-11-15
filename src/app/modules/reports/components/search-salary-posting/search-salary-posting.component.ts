import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import {
    CIBTableConfig,
    CIBTableQuery,
    ColumnType,
    SortDirection,
} from 'src/app/cib-components/cib-table/models/config.model';
import { SALARY_POSTING_HEADER } from 'src/app/modules/transfers/constants/meta-data';
import { SALARY_POSTING_COLUMNS } from 'src/app/shared/enums';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';
import { UtilService } from 'src/app/utility';
import { ReportsSandbox } from '../../reports.sandbox';
import { SalaryPostingDataTableComponent } from '../salary-posting-data-table/salary-posting-data-table.component';

@Component({
    selector: 'app-search-salary-posting',
    templateUrl: './search-salary-posting.component.html',
    styleUrls: ['./search-salary-posting.component.scss'],
})
export class SearchSalaryPostingComponent implements OnInit {
    salaryPostingList: any = [];
    salaryPostingListEntries: any = [];
    tableConfig!: CIBTableConfig;

    constructor(
        private utilService: UtilService,
        private _formBuilder: FormBuilder,
        private sandBox: ReportsSandbox,
        private dialog: CibDialogService
    ) {}

    searchForm: FormGroup = new FormGroup({});
    minDate = new Date(new Date().getFullYear(), new Date().getMonth() - 6, new Date().getDate() + 1);
    maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    startDateLabel = 'From Date';
    toDateLabel = 'To Date';
    startDate = null;
    endDate = null;
    params: any = { pageIndex: 0, pageSize: 5, sortDirection: SortDirection.desc, sortKey: 'loadDate' };
    fileStatusList = ['APPROVED', 'POSTING', 'POSTED', 'PARTIALLY COMPLETED', 'COMPLETED'];
    public cols = [
        {
            key: 'loadDate',
            displayName: 'CREATED DATE',
            type: ColumnType.date,
            sortable: true,
        },
        {
            key: 'fileFTNumber',
            displayName: 'FT NUMBER',
            sortable: true,
        },
        {
            key: 'fileName',
            displayName: 'FILE NAME',
            sortable: true,
            type: ColumnType.link,
        },
        {
            key: 'status',
            displayName: 'FILE STATUS',
            type: ColumnType.status,
            sortable: true,
        },
        {
            key: 'statusDesc',
            displayName: 'REMARK',
            sortable: true,
        },
    ];

    ngOnInit() {
        this.searchForm = this._formBuilder.group({
            fromDate: [null, Validators.required],
            toDate: [null, Validators.required],
            fileName: [null, ''],
        });
    }

    getStartDate(ev: any) {
        this.startDate = ev;
    }

    getEndDate(ev: any) {
        this.endDate = ev;
    }

    query: CIBTableQuery = this.params;

    onClickCell(event: any) {
        if (event.key === 'fileName') {
            if (event.data) {
                let params = {
                    fileName: event.data?.fileName || '',
                    debitAccountNumber: event.data?.payerIBAN || '',
                    pageIndex: this.params.pageIndex,
                    pageSize: this.params.pageSize,
                    sortField: 'valueDate',
                    sort: this.params.sortDirection,
                };
                let data = {
                    columns: SALARY_POSTING_HEADER,
                    params: params,
                };
                this.dialog.openOverlayPanel('Salary Posting Details', SalaryPostingDataTableComponent, data);
            }
        }
    }

    lazyLoad(query: CIBTableQuery) {
        this.query = query;
        this.searchSalaryPosting(this.query);
    }

    resetView() {
        this.salaryPostingList = [];
        this.tableConfig = {
            columns: [],
            data: [],
            selection: false,
            totalRecords: 0,
        };
        this.searchForm.reset();
    }

    searchSalaryPosting(params: any) {
        if (this.startDate && this.endDate) {
            let payload = {
                fromDate: this.startDate,
                toDate: this.endDate,
                fileName: this.searchForm.controls['fileName'].value || '',
                pageIndex: params.pageIndex,
                pageSize: params.pageSize,
                sortField: params.sortKey,
                sort: params.sortDirection,
            };

            this.sandBox.getSalaryPostingList(payload).subscribe((res: any) => {
                if (res.data) {
                    this.salaryPostingList = res.data?.content || [];
                    this.salaryPostingList = this.salaryPostingList.map((value: any) => {
                        value.statusDesc = '';
                        value.status = value?.status ? value.status.toUpperCase() : '';
                        if (this.fileStatusList.includes(value.status)) value.statusDesc = '';
                        if (!this.fileStatusList.includes(value.status)) value.statusDesc = value.status;
                        return value;
                    });
                    let config = {
                        columns: this.cols,
                        data: this.salaryPostingList,
                        selection: false,
                        totalRecords: this.salaryPostingList.length,
                    };
                    this.tableConfig = config;
                }
            });
        }
    }

    reloadDatatable() {
        this.salaryPostingList = [];
        this.tableConfig = {
            columns: [],
            data: [],
            selection: false,
            totalRecords: 0,
        };
        this.searchSalaryPosting(this.params);
    }

    generateExcel() {
        if (this.salaryPostingList.length > 0) {
            this.utilService.exportAsExcelFile(this.formatDataForExcel(this.salaryPostingList || []), 'Salary_Posting');
            this.utilService.displayNotification('Excel generated successfully!', 'success');
        }
    }

    formatDataForExcel(data: any) {
        const temp: any = [];
        data.forEach((ele: any) => {
            let tempObject: any = {};
            tempObject['CREATED DATE'] = moment(ele.loadDate).format('DD-MMM-YYYY HH:mm:ss A');
            tempObject['FT NUMBER'] = ele.fileFTNumber;
            tempObject['FILE NAME'] = ele.fileName;
            tempObject['FILE STATUS'] = ele.status;
            tempObject['REMARK'] = ele.statusDesc;
            temp.push(tempObject);
        });
        return temp;
    }

    generatePdf() {
        let params = {
            fromDate: this.startDate,
            toDate: this.endDate,
            fileName: this.searchForm.controls['fileName'].value || '',
            pageIndex: this.params.pageIndex,
            pageSize: this.params.pageSize,
            sortField: this.params.sortKey,
            sort: this.params.sortDirection,
            downloadType: 'pdf',
        };

        this.sandBox.getSalaryPostingList(params).subscribe((res: any) => {
            if (res.data && res.data.length > 0) {
                this.utilService.downloadPdf(res.data, 'Salary_Posting');
                this.utilService.displayNotification('PDF generated successfully!', 'success');
            }
        });
    }
}

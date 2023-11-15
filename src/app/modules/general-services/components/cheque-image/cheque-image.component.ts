import { Component, OnInit } from '@angular/core';
import { GeneralServicesSandbox } from '../../general-services.sandbox';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { CIBTableConfig, ColumnType } from 'src/app/cib-components/cib-table/models/config.model';
import * as moment from 'moment';
@Component({
    selector: 'app-cheque-image',
    templateUrl: './cheque-image.component.html',
    styleUrls: ['./cheque-image.component.scss'],
})
export class ChequeImageComponent implements OnInit {
    sortedData: any = [];
    tableConfig: CIBTableConfig = new CIBTableConfig();
    chequeImageRequestForm!: UntypedFormGroup;
    maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    isImageFetched: boolean = false;
    frontImageUrl = '';
    backImageUrl: any = '';
    cols = [
        {
            key: 'dateTime',
            displayName: 'DATE',
            sortable: true,
            type: ColumnType.date,
        },
        {
            key: 'chequeNo',
            displayName: 'CHEQUE NUMBER',
            sortable: true,
        },
        {
            key: 'txnReference',
            displayName: 'FT REFERENCE',
            sortable: true,
        },
        {
            key: 'credit',
            displayName: 'AMOUNT',
            sortable: true,
        },
        {
            key: 'edit',
            displayName: '',
            type: ColumnType.icon,
            icon: 'las la-file-image',
        },
    ];
    constructor(private sandBox: GeneralServicesSandbox, private fb: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.chequeImageRequestForm = this.fb.group({
            chequeNumber: [null, [Validators.required]],
            amount: [null],
            requestDate: [null],
        });
    }

    getChequesList() {
        this.isImageFetched = false;
        this.frontImageUrl = '';
        this.backImageUrl = '';
        let formData = this.chequeImageRequestForm.value;
        let payload: any = {
            seq: formData.chequeNumber,
            type: 0,
            requestType: 'LIST',
        };
        if (formData.amount) payload.amount = formData.amount;
        if (formData.requestDate) payload.date = moment(formData.requestDate).format('DD-MMM-YYYY');
        this.sandBox.chequeImages(payload).subscribe((res: any) => {
            if (res) {
                this.sortedData = res?.data || [];
                if (this.sortedData.length > 0)
                    this.sortedData.map((el: any) => {
                        if (el.debit) el.credit = el.debit;
                    });
                this.loadDataTable();
            }
        });
    }
    onClickCell(selectedCheque: any) {
        this.isImageFetched = false;
        this.frontImageUrl = '';
        this.backImageUrl = '';
        let payload: any = {
            seq: selectedCheque.chequeSeqNo,
            requestType: 'IMAGE',
            type: 0,
        };
        this.sandBox.chequeImages(payload).subscribe((res: any) => {
            if (res) {
                this.isImageFetched = true;
                if (res.data.faceImg) this.frontImageUrl = res.data.faceImg;
                if (res.data.backImg) this.backImageUrl = res.data.backImg;
            }
        });
    }

    lazyLoad(event: any) {
        if (event.sortKey) {
            this.sortedData = this.sortedData.sort((a: any, b: any) => {
                const isAsc = event.sortDirection === 'ASC';
                return this.sandBox.compare(a[event.sortKey], b[event.sortKey], isAsc);
            });
            this.loadDataTable();
        }
    }
    loadDataTable() {
        this.tableConfig = {
            columns: this.cols,
            data: this.sortedData,
            selection: false,
            totalRecords: this.sortedData.length,
            clientPagination: true,
        };
    }
}

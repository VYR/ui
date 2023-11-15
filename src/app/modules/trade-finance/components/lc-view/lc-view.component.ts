import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadComponent } from 'src/app/cib-components/file-upload/file-upload.component';
import { DECISION } from 'src/app/shared/enums/common';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';

@Component({
    selector: 'app-lg-view',
    templateUrl: './lc-view.component.html',
    styleUrls: ['./lc-view.component.scss'],
})
export class LcViewComponent {
    transactions: Array<any> = [];
    transactionsHistory: Array<any> = [];
    allowedFileTypes = ['png', 'JPG', 'jpeg', 'PDF'];
    DECISION = DECISION;
    parentData: any;
    pageType: any = 'lc';
    applnId: any;
    showHistory: boolean = false;
    fileName: any = [];
    comments: any;
    fileErrMsg: string = '';
    fileSuccessMsg: string = '';

    fileDocuments: any = [];

    @ViewChild('fileUpload') fileUpload!: FileUploadComponent;

    constructor(
        public dialogRef: MatDialogRef<LcViewComponent>,
        private dialog: CibDialogService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.parentData = this.data;
    }
}

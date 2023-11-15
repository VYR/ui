import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadComponent } from 'src/app/cib-components/file-upload/file-upload.component';
import { DECISION } from 'src/app/shared/enums/common';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { GeneralServicesSandbox } from '../../general-services/general-services.sandbox';
import { DeleteDhareebaRequestConfirmComponent } from '../../payments/components/delete-dhareeba-request-confirm/delete-dhareeba-request-confirm.component';
import { DeleteRequestConfirmComponent } from '../delete-request-confirm/delete-request-confirm.component';
import { OperationsApprovalsSandbox } from '../operations-approvals.sandbox';

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
        private sandBox: OperationsApprovalsSandbox,
        public dialogRef: MatDialogRef<LcViewComponent>,
        private dialog: CibDialogService,
        private generalSandBox: GeneralServicesSandbox,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.applnId = this.data.applnId;
        this.pageType = this.data.pageType;
        this.transactions = [];
        if (!this.data.data) return;
        this.parentData = this.data.data;
        this.fileDocuments = this.parentData.documents;
        let requestObject: any = {};
        const serviceRequestdata = this.parentData;
        requestObject = { ...serviceRequestdata };
        this.transactions.push(requestObject);
        if (this.data.type !== 'action') {
            this.getHistory();
        }
    }

    getDownload(document: any) {
        const payload = { applicationId: document.id };
        this.sandBox.downloadFile(payload, document.customerFileName, document.fileType).subscribe();
    }

    public getHistory() {
        let refNo =
            this.parentData?.isAmendRequest === 'Y'
                ? this.parentData.parentLC
                    ? this.parentData.parentLC
                    : this.parentData.txnRefNo
                : this.parentData.applnId
                ? this.parentData.applnId
                : this.parentData.txnRefNo;
        this.sandBox.historyList(this.pageType, refNo).subscribe((res: any) => {
            this.transactionsHistory = res.data;
            this.showHistory = true;
        });
    }

    getFileName(document: any) {
        const fileName: any = [];
        document.forEach((data: any) => {
            fileName.push(data.customerFileName);
        });
        return fileName;
    }

    onAction(inputValue: any, commentValue: any) {
        let payload = {};

        const deleteAction = {
            action: inputValue,
            applnId: this.applnId,
        };
        if (this.pageType === 'LC') {
            payload = {
                applnId: this.applnId,
                lcInstructions: [{ lcComments: commentValue }],
            };
        } else {
            payload = {
                bgApplicationId: this.applnId,
                validateOTPRequest: {
                    softTokenUser: false,
                    otp: '',
                },
                bankGuaranteeNotes: [{ comments: commentValue }],
            };
        }

        if (inputValue == 'Reject') {
            const ref = this.dialog.openDialog(CibDialogType.small, DeleteRequestConfirmComponent, deleteAction);
            ref.afterClosed().subscribe((res: any) => {
                if (res.decision === DECISION.CONFIRM) {
                    this.sandBox.actionInuiryList(this.pageType, payload, res.data.action).subscribe((res: any) => {
                        this.dialogRef.close();
                    });
                }
            });
        } else {
            this.sandBox.actionInuiryList(this.pageType, payload, inputValue).subscribe((res: any) => {
                this.dialogRef.close();
            });
        }
        this.comments = null;
    }

    onFileSelected(file: any) {
        let payload = {
            applnId: this.applnId,
        };
        if (file) {
            this.fileSuccessMsg = file.name;
            this.fileErrMsg = !this.generalSandBox.isFileTypeAllowed(file.name, this.allowedFileTypes)
                ? 'Invalid file format'
                : !this.generalSandBox.isFileSizeAllowed(file.size, 5, 'MB')
                ? 'Invalid file size ' + this.generalSandBox.getFileSize(file.size, 'MB')
                : '';
            if (this.fileErrMsg === '') {
                const formData = new FormData();
                formData.append('files', file);
                this.sandBox.fileUploadHisotry(this.pageType, payload, formData).subscribe((res: any) => {
                    this.fileUpload.deleteFile();
                    this.fileDocuments = res.data.documents;
                });
            }
        }
    }

    deleteFile(file: any) {
        const ref = this.dialog.openDialog(CibDialogType.small, DeleteRequestConfirmComponent, file);
        ref.afterClosed().subscribe((res: any) => {
            if (res.decision === DECISION.CONFIRM) {
                this.sandBox.deleteFileList(this.pageType, file).subscribe((res: any) => {
                    const index = this.fileDocuments.findIndex((x: any) => x.id === file.id);
                    if (index !== -1) {
                        this.fileDocuments.splice(index, 1);
                    }
                });
            }
        });
    }
}

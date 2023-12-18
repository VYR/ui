import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/app/utility/utility.service';
import { CorporateManagementSandbox } from '../../corporate-management.sandbox';

@Component({
    selector: 'app-corporate-details',
    templateUrl: './corporate-details.component.html',
    styleUrls: ['./corporate-details.component.scss'],
})
export class CorporateDetailsComponent implements OnInit {
    @Input() corporateDetails!: any;
    @Input() showEdit: any = false;
    @Output() closeDetails: EventEmitter<any> = new EventEmitter<any>();
    corporateAuthorization: any = [
        {
            label: 'Zero Authorization',
            value: 'zeroAuthorization',
        },
        {
            label: 'Other Authorization',
            value: 'otherAuthorization',
        },
    ];
    public corporateUpdateForm!: UntypedFormGroup;
    selectedFile: any;
    isMandateFileAdded: boolean = false;
    customMandate: any = {};

    constructor(
        private sandBox: CorporateManagementSandbox,
        public fb: UntypedFormBuilder,
        private utilService: UtilService
    ) {}

    ngOnInit(): void {
        this.customMandate = this.corporateDetails.customerMandate || {};
        this.corporateUpdateForm = this.fb.group({
            authorization: [this.customMandate.authorization, [Validators.required]],
        });
    }

    closeCorporateDetails() {
        this.closeDetails.emit();
    }

    downloadDoc(document: any) {
        const payload = {
            applicationId: document.id,
        };
        this.sandBox.downloadFile(payload, document.customerFileName, document.fileType).subscribe();
    }

    addMandate() {
        this.isMandateFileAdded = true;
    }

    onFileSelected(file: any) {
        this.isMandateFileAdded = false;
        this.selectedFile = file;
    }

    submitCorporateDetails() {
        if (this.corporateDetails.customerMandate && this.corporateDetails.customerMandate.updateRequestPending) {
            this.utilService.displayNotification(
                `A request for the submitted corporate is pending for approval and current request cannot be taken`,
                'error'
            );
        } else {
            let payload: any = {
                authorization: this.corporateUpdateForm.value.authorization,
                mandateUploaded: this.corporateDetails.customerMandate?.mandateUploaded || 'Y',
                rimnumber: this.corporateDetails.uniqueUserId,
            };
            if (this.corporateDetails.customerMandate?.mandateId)
                payload.mandateId = this.corporateDetails.customerMandate?.mandateId;

            this.sandBox.updateCorporate(payload).subscribe((res: any) => {
                this.uploadMandateFile(res.data);
            });
        }
    }

    uploadMandateFile(responseId: any) {
        if (this.selectedFile) {
            let uploadFormData = new FormData();
            uploadFormData.append('files', this.selectedFile);
            let queryParams = {
                id: responseId,
                moduleName: 'mandate_upload',
            };
            this.sandBox.uploadCorporateFile(uploadFormData, queryParams).subscribe((response: any) => {
                this.showEdit = false;
            });
        } else {
            this.showEdit = false;
        }
    }

    disableSubmit() {
        if (Object.keys(this.customMandate?.documents || {})?.length) return false;
        return !this.selectedFile || this.corporateUpdateForm.invalid;
    }
}

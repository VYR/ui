import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CorporateManagementSandbox } from '../../corporate-management.sandbox';

@Component({
    selector: 'app-register-h2h',
    templateUrl: './register-h2h.component.html',
    styleUrls: ['./register-h2h.component.scss'],
})
export class RegisterH2hComponent implements OnInit {
    h2hUserDetailsId: any;
    userList: any;
    isRimValid: boolean = false;
    form: FormGroup = new FormGroup({});
    rimInput: any;
    fileDetails: any;
    fileContent: any;

    constructor(private _formBuilder: FormBuilder, private sandBox: CorporateManagementSandbox) {}

    ngOnInit(): void {
        this.formBuilder();
    }

    enableSearch(): boolean {
        return this.rimInput && this.rimInput.toString().length > 0;
    }

    onFileSelected(files: any) {
        this.fileContent = '';
        this.fileDetails = '';
        if (files) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.fileContent = reader.result;
                this.fileDetails = {
                    name: files.name,
                };
            };
            reader.readAsText(files);
        }
    }

    searchRIM() {
        this.form.reset();
        this.isRimValid = false;
        this.h2hUserDetailsId = '';
        this.fileDetails = {};
        this.fileContent = '';
        this.userList = [];
        this.sandBox.getH2hUsers(this.rimInput).subscribe((res: any) => {
            if (res.data && res.data.length > 0) {
                this.userList = res.data;
                this.isRimValid = true;
                this.sandBox.getH2hCustomerDetails(this.rimInput).subscribe((res: any) => {
                    if (res?.data) {
                        if (res.data.h2hUserDetailsId) {
                            this.h2hUserDetailsId = res.data.h2hUserDetailsId;
                            this.form.controls['emailID'].setValue(res.data.emailID);
                            this.form.controls['isH2HDirectRequired'].setValue(res.data.isH2HDirectRequired);
                            if (res.data.isEncryptionRequired) {
                                this.form.controls['isEncryptionRequired'].setValue(res.data.isEncryptionRequired);
                                this.form.controls['keyValue'].setValue(res.data.qibencryptionRequired ? '2' : '1');
                                if (res.data.qibencryptionRequired) {
                                    const userName = this.userList.filter((obj: any) => obj.userId == res.data.userId);
                                    this.form.controls['userName'].setValue(userName?.[0]);
                                } else {
                                    this.fileDetails = {
                                        name: res.data.fileName,
                                    };
                                    this.fileContent = res.data.fileContent;
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    formBuilder() {
        return (this.form = this._formBuilder.group({
            emailID: [null, ''],
            isEncryptionRequired: [null, ''],
            isH2HDirectRequired: [null, ''],
            keyValue: ['1', ''],
            userName: [null, ''],
        }));
    }

    updateCustomer() {
        let isRegistered = false;
        if (this.h2hUserDetailsId) isRegistered = true;
        let payload: any = {
            h2hUserDetailsId: this.h2hUserDetailsId,
            userId: this.form.controls['userName']?.value?.userId,
            isEncryptionRequired: this.form.controls['isEncryptionRequired']?.value,
            rimNumber: this.rimInput.toString(),
            userName: this.form.controls['userName']?.value?.username,
            emailID: this.form.controls['emailID'].value,
            isH2HDirectRequired: this.form.controls['isH2HDirectRequired'].value,
            isQIBEncryptionRequired: this.form.controls['keyValue'].value === '2',
            fileContent: this.fileContent,
        };
        if (this.fileDetails) {
            payload.fileName = this.fileDetails.name;
        }

        this.sandBox.addAndUpdateH2hCustomerDetails(payload, isRegistered).subscribe((res: any) => {
            this.form.reset();
            this.rimInput = '';
            this.isRimValid = false;
            this.h2hUserDetailsId = '';
            this.fileDetails = '';
            this.fileContent = '';
            this.userList = [];
        });
    }
}

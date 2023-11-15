import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CIBTableConfig, CIBTableQuery, SortDirection } from 'src/app/cib-components/cib-table/models/config.model';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { SettingsSandbox } from 'src/app/modules/settings/settings.sandbox';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { CorporateManagementSandbox } from '../../corporate-management.sandbox';

@Component({
    selector: 'app-delink-to-device',
    templateUrl: './delink-to-device.component.html',
    styleUrls: ['./delink-to-device.component.scss'],
})
export class DelinkToDeviceComponent implements OnInit {
    searchForm: FormGroup = new FormGroup({});
    params: any = { pageIndex: 0, pageSize: 5, sortDirection: SortDirection.desc, sortKey: 'created' };
    query: CIBTableQuery = this.params;
    tableConfig!: CIBTableConfig;
    devicesList: any = [];
    formValid: boolean = false;

    constructor(
        private _formBuilder: FormBuilder,
        private sandBox: CorporateManagementSandbox,
        private dialog: CibDialogService
    ) {}

    ngOnInit(): void {
        this.searchFormBuilder();
    }

    searchFormBuilder() {
        return (this.searchForm = this._formBuilder.group({
            rimNumber: [null],
            userName: [null, ''],
            deviceModel: [null, ''],
        }));
    }

    searchDevice() {
        this.getDeviceList();
    }

    _payload() {
        let payloadObj = {
            rim: this.searchForm.controls['rimNumber'].value,
            userName: this.searchForm.controls['userName']?.value?.toUpperCase(),
            deviceModel: this.searchForm.controls['deviceModel']?.value,
        };
        return payloadObj;
    }

    getDeviceList() {
        let payload = this._payload();
        this.sandBox.getDeviceList(payload).subscribe((res: any) => {
            this.devicesList = res.data?.data;
        });
    }

    onDlinkClick(device: any) {
        let data = {
            header: '<div>De-Link the Device</div>',
            body: '<div>Would You like to De-Link device?</div>',
        };

        let dialogRef = this.dialog.openDialog(CibDialogType.medium, ConfirmationDialogComponent, data);

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result && result.event === 'confirm') {
                this.sandBox.deRegisterDevice(device.deviceId).subscribe((res: any) => {
                    this.getDeviceList();
                });
            }
        });
    }
}

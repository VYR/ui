import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/cib-components/confirmation-dialog/confirmation-dialog.component';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { CibDialogService, CibDialogType } from 'src/app/shared/services/cib-dialog.service';
import { SettingsSandbox } from './settings.sandbox';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    devicesList: any = [];
    activeIndex: number = 0;
    showsearch = false;
    @ViewChild('dialogBody') dialogBody!: ElementRef;

    constructor(private sandBox: SettingsSandbox, private dialog: CibDialogService) {}

    ngOnInit(): void {
        this.getDeviceList();
    }

    getDeviceList() {
        this.sandBox.getSettingsList().subscribe((res: any) => {
            this.devicesList = res.data;
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

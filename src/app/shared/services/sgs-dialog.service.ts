import { ComponentType } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SgsDrawerLayoutComponent } from 'src/app/sgs-components/sgs-drawer-layout/sgs-drawer-layout.component';
import { ConfigService } from 'src/app/configuration';

@Injectable({
    providedIn: 'root',
})
export class SgsDialogService {
    private config!: any;

    constructor(private dialog: MatDialog, private configService: ConfigService) {
        this.config = this.configService.get('dialog');
    }

    openDialog(type: SgsDialogType, component: ComponentType<unknown>, data: any) {
        this.config = this.configService.get('dialog');
        return this.dialog.open(component, {
            data: data,
            width: this.config[type].width,
            enterAnimationDuration: this.config.enterAnimationDuration,
            exitAnimationDuration: this.config.exitAnimationDuration,
            panelClass: 'sgs-dialog',
            disableClose: true,
        });
    }

    closeAllDialogs() {
        const dialogs = this.dialog.openDialogs;
        dialogs.forEach((d: any) => {
            d.close();
        });
    }

    openDrawer(title: string, component: ComponentType<unknown>, data: any, disableClose: boolean = true) {
        this.config = this.configService.get('dialog');
        return this.dialog.open(SgsDrawerLayoutComponent, {
            data: {
                title,
                data,
                component,
            },
            width: '28rem',
            height: '100%',
            disableClose,
            enterAnimationDuration: this.config.enterAnimationDuration,
            exitAnimationDuration: this.config.exitAnimationDuration,
            position: {
                top: '0',
                right: '0',
            },
            panelClass: 'sgs-drawer',
        });
    }

    openOverlayPanel(
        title: string,
        component: ComponentType<unknown>,
        data: any,
        type: SgsDialogType = SgsDialogType.large,
        disableClose: boolean = true
    ) {
        this.config = this.configService.get('dialog');
        return this.dialog.open(SgsDrawerLayoutComponent, {
            data: {
                title,
                data,
                component,
            },
            width: this.config[type].width,
            maxHeight: '90%',
            disableClose,
            enterAnimationDuration: this.config.enterAnimationDuration,
            exitAnimationDuration: this.config.exitAnimationDuration,
            panelClass: 'sgs-drawer',
        });
    }

    closePanel() {
        return this.dialog.closeAll();
    }
}

export enum SgsDialogType {
    small = 'small',
    medium = 'medium',
    large = 'large',
}

import { Component, OnInit } from '@angular/core';
import { GeneralServicesSandbox } from './general-services.sandbox';
import { SERVICE_REQUEST_TYPES } from './constants/constants';

@Component({
    selector: 'app-general-services',
    templateUrl: './general-services.component.html',
    styleUrls: ['./general-services.component.scss'],
})
export class GeneralServicesComponent implements OnInit {
    SERVICE_REQUEST_TYPES = SERVICE_REQUEST_TYPES;
    menu: any[] = [];
    constructor(private sandBox: GeneralServicesSandbox) {}
    ngOnInit() {
        this.menu = SERVICE_REQUEST_TYPES.filter((x) => x.isMenu);
        this.sandBox.getDataOnPageLoad().subscribe();
    }
}

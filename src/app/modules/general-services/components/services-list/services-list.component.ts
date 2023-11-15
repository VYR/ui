import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SERVICE_REQUEST_TYPES } from '../../constants/constants';
@Component({
    selector: 'app-services-list',
    templateUrl: './services-list.component.html',
    styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent {
    types: any[] = SERVICE_REQUEST_TYPES;
    constructor(private router: Router) {}

    setActiveRequest(path: string) {
        this.router.navigate([path]);
    }
}

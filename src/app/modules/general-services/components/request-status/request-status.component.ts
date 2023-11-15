import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-request-status',
    templateUrl: './request-status.component.html',
    styleUrls: ['./request-status.component.scss'],
})
export class RequestStatusComponent {
    @Input() data: any;
    constructor(private router: Router) {}

    public closeSuccessMessage() {
        this.router.navigate(['home/general-services/list']);
    }
}

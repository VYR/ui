import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-corporate-deposit-card-request-success',
    templateUrl: './corporate-deposit-card-request-success.component.html',
    styleUrls: ['./corporate-deposit-card-request-success.component.scss'],
})
export class CorporateDepositCardRequestSuccessComponent {
    @Input() requestSuccessData!: any;
    constructor(private router: Router) {}

    public closeSuccessMessage() {
        this.router.navigate(['home/general-services/list']);
    }
}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from 'src/app/shared/enums/routes';

@Component({
    selector: 'app-aamali-debit-card-request-success',
    templateUrl: './aamali-debit-card-request-success.component.html',
    styleUrls: ['./aamali-debit-card-request-success.component.scss'],
})
export class AamaliDebitCardRequestSuccessComponent {
    @Input() requestSuccessData!: any;
    constructor(private router: Router) {}

    public closeSuccessMessage() {
        this.router.navigate([APP_ROUTES.GENERAL_SERVICES + '/list']);
    }
}

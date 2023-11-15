import { Component, OnInit } from '@angular/core';
import { OperationsApprovalsSandbox } from '../operations-approvals.sandbox';

@Component({
    selector: 'app-service-request',
    templateUrl: './service-request.component.html',
    styleUrls: ['./service-request.component.scss'],
})
export class ServiceRequestComponent {
    public requestType: any;
    queryParams: any = {
        count: true,
        requestType: '6,18,19',
    };

    constructor(private sandBox: OperationsApprovalsSandbox) {}

    ngOnInit(): void {
        this.sandBox.getServiceRequestTypeList(this.queryParams).subscribe((res: any) => {
            this.requestType = res.data;
        });
    }
}

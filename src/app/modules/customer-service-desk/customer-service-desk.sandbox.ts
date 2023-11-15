import { Injectable } from '@angular/core';
import { CustomerServiceDeskService } from './customer-service-desk.service';
import { catchError, map, tap, throwError } from 'rxjs';
import { UtilService } from 'src/app/utility';
@Injectable({
    providedIn: 'root',
})
export class CustomerServiceDeskSandbox {
    _rawData: any;
    constructor(private service: CustomerServiceDeskService, private utilService: UtilService) {}

    csdRequestTypeList() {
        return this.service.csdRequestTypeList();
    }

    actionCsdList(params: any) {
        return this.service.actionCsdList(params).pipe(
            tap((res: any) => {
                if (params.action === 'REJECT')
                    this.utilService.displayNotification(`The request has been rejected successfully`, 'success');
                else {
                    const ref = res.data[0] || {};
                    ref.status === 'SUCCESS'
                        ? this.utilService.displayNotification(
                              `The request got approved successfully and FT reference has been generated ` + ref.ftRef,
                              'success'
                          )
                        : this.utilService.displayNotification(
                              `The request got approved successfully but transfer failed as ` + ref.ftRef,
                              'error'
                          );
                }
            })
        );
    }
}

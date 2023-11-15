import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/utility';
import { AuditTrailService } from './audit-trail.service';
import { tap } from 'rxjs';
import * as moment from 'moment';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { USER_TYPE } from 'src/app/shared/enums';

@Injectable({
    providedIn: 'root',
})
export class AuditTrailSandbox {
    userContext!: UserContext;
    constructor(
        private auditTrailService: AuditTrailService,
        private appContext: ApplicationContextService,
        private util: UtilService
    ) {
        this.appContext.currentUser.subscribe((res) => (this.userContext = res));
    }

    getUsersUnderRim(rim: any) {
        const type: any = this.userContext.userType;

        return this.auditTrailService.getUsersUnderRim(rim, type);
    }

    getAuditReport(payload: any, downloadType?: any) {
        const type: any = this.userContext.userType;
        if (payload.downloadType && payload.downloadType === 'pdf') {
            return this.auditTrailService.getAuditReport(payload, type).pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.util.downloadPdf(res.data, 'Audit_Trail');
                        this.util.displayNotification('PDF generated successfully!', 'success');
                    }
                })
            );
        } else if (downloadType === 'excel') {
            return this.auditTrailService.getAuditReport(payload, type).pipe(
                tap((res: any) => {
                    if (res.data && res.data.length > 0) {
                        this.util.exportAsExcelFile(this.formatAuditTrailForExcel(res.data || [], type), 'Audit Trail');
                        this.util.displayNotification('Excel generated successfully!', 'success');
                    }
                })
            );
        } else return this.auditTrailService.getAuditReport(payload, type);
    }

    formatAuditTrailForExcel(data: any, type: any) {
        const temps: any = [];
        data.forEach((res: any) => {
            let temp: any = {};
            if (type === USER_TYPE.BANK_ADMIN) temp['User Name'] = res.userName;
            else temp['Admin Name'] = res.userName;

            temp['Activity'] = res.activity;
            if (type === USER_TYPE.BANK_ADMIN) temp['Service Type'] = res.activityKey;
            temp['Date and Time'] = moment(res.activityPerformedOnDate).format('YYYY-MM-DD hh:mm A');

            temps.push(temp);
        });
        return temps;
    }
}

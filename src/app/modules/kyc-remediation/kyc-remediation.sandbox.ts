import { Injectable } from '@angular/core';
import { UtilService } from 'src/app/utility';
import { catchError, map, tap, throwError } from 'rxjs';
import * as moment from 'moment';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { USER_TYPE } from 'src/app/shared/enums';
import { KycRemediationService } from './kyc-remediation.service';

@Injectable({
    providedIn: 'root',
})
export class KycRemediationSandbox {
    _rawData: any;
    constructor(
        private kycRemediationService: KycRemediationService,
        private appContext: ApplicationContextService,
        private utilService: UtilService
    ) {}
    uploadCustomFile(file: any) {
        return this.utilService.readFromExcel(file).pipe(
            map(
                (res: any) => {
                    if (res.data.length === 0) {
                        this.utilService.displayNotification('Please upload a file with Valid data', 'error');
                    }
                    return JSON.parse(JSON.stringify(res.data));
                },
                catchError((error: any) => {
                    return throwError(error);
                })
            )
        );
    }

    public uploadData(files: any, selectedFileType: any) {
        return this.utilService.readFromExcel(files).pipe(
            map(
                (res: any) => {
                    console.log(res);
                    if (res.data.length === 0) {
                        this.utilService.displayNotification('Please upload a file with Valid data', 'error');
                    }
                    this._rawData = JSON.parse(JSON.stringify(res.data));
                    console.log(this._rawData);
                    return this._rawData;
                    //return this._validateJSONData(res.data, selectedFileType, res.fileName);
                },
                catchError((error: any) => {
                    return throwError(error);
                })
            )
        );
    }

    getKycRemediation() {
        return this.kycRemediationService.getKycRemediation();
    }

    saveKycRemediation(req: any) {
        return this.kycRemediationService.saveKycRemediation(req, 'KycRemediation');
    }
}

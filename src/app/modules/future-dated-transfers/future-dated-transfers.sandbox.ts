import { Injectable } from '@angular/core';
import { FutureDatedTransferService } from './future-dated-transfers.service';

@Injectable({
    providedIn: 'root',
})
export class FutureDatedTransferSandbox {
    constructor(private fdtService: FutureDatedTransferService) {}
    getPurposeCodes() {
        return this.fdtService.getPurposeCodes();
    }

    getTimeFreq() {
        return this.fdtService.getTimeFreq();
    }

    verifySTO(payload: any, pathVar: string) {
        return this.fdtService.verifySTO(payload, pathVar);
    }
}

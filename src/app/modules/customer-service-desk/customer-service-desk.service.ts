import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class CustomerServiceDeskService {
    constructor(private http: ServerInteractionService) {}

    csdRequestTypeList() {
        return this.http.get(Operations.CSD_REQUEST_LIST);
    }

    actionCsdList(params: any) {
        return this.http.put(Operations.CSD_ACTION_LIST, params);
    }
}

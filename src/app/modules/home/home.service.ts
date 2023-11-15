import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class HomeService {
    constructor(private http: ServerInteractionService) {}

    rimSelection(rimNumber: string) {
        return this.http.post(Operations.RIM_SELECTION, { rimNumber });
    }

    refreshToken() {
        return this.http.get(Operations.REFRESH_TOKEN);
    }
}

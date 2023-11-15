import { Injectable } from '@angular/core';
import { ServerInteractionService } from 'src/app/http-core';
import { Operations } from 'src/app/shared/enums/operations';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    constructor(private http: ServerInteractionService) {}

    getDeviceSettingsList(userInfo: any) {
        return this.http.post(Operations.GET_DEVICE_SETTINGS_LIST, userInfo);
    }

    deRegisterDevice(deviceInfo: any) {
        return this.http.post(Operations.DE_REGISTER_DEVICE, deviceInfo);
    }
}

import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Organization, UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { HomeService } from './home.service';

@Injectable({
    providedIn: 'root',
})
export class HomeSandbox {
    currentUser!:UserContext;
    constructor(
        private service: HomeService,
        private appContext: ApplicationContextService,
        private authService: AuthenticationService
    ) {
        this.currentUser=appContext.getCurrentUser();
    }

    rimSelect(organization: Organization) {
        return this.service.rimSelection(organization.uniqueUserId).pipe(
            tap((res: any) => {
                this.appContext.updateRimSelection(organization, res.data);
            })
        );
    }

    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
    logout() {
        // return this.authService.logout().pipe(
        //     tap((res: any) => {
        //         this.appContext.logout();
        //     })
        // );
        this.appContext.logout();
    }

    refreshToken() {
        const access_token = this.appContext.getCurrentUser().access_token;
        return this.service.refreshToken().pipe(
            tap((res: any) => {
                if (res.data && res.data.Authorization) this.appContext.updateToken(res.data.Authorization);
            })
        );
    }
}

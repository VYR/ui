import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';

import { ApplicationContextService } from '../services/application-context.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad {
    constructor(private router: Router, private appContext: ApplicationContextService) {}

    public canLoad(): boolean {
        if (!this.appContext.isAuthenticated()) {
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}

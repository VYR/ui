import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/configuration';
import { USER_TYPE } from 'src/app/shared/enums';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { HomeSandbox } from '../../home.sandbox';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    USER_TYPE = USER_TYPE;
    iconMenus: Array<any> = [];
    public activeRouter: any;
    user!: UserContext;
    @Output() logoutAction: EventEmitter<any> = new EventEmitter<any>();
    constructor(
        private router: Router,
        private appContext: ApplicationContextService,
        private config: ConfigService
    ) {
        this.appContext.currentUser.subscribe((res: any) => (this.user = res));
        if(this.user?.userType>-1){
            this.iconMenus = this.config.get('modules')[this.user.userType].filter((x: any) => x.location === 'header');
            router.events.subscribe((event: any) => {
                this.activeRouter = event.url;
            });
        }
        else {
            this.router.navigate(['/login']);
        }
    }

    onSettingsClick() {
        this.router.navigate(['home/settings']);
    }

    logout() {
        this.logoutAction.emit();
    }
}

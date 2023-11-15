import { Component } from '@angular/core';
import { ConfigService } from 'src/app/configuration';
import { USER_TYPE } from 'src/app/shared/enums';
import { Organization, UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { HomeSandbox } from '../../home.sandbox';

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
    USER_TYPE = USER_TYPE;
    menu: Array<any> = [];
    modules: any = {};

    public activeRouter: any;
    currentUser: UserContext = new UserContext();
    constructor(appContext: ApplicationContextService, private homeSandBox: HomeSandbox, configService: ConfigService) {
        appContext.currentUser.subscribe((res) => {
            this.currentUser = res;
            const modules: Array<any> = configService.get('modules');
            this.menu = (modules[res.userType] || []).filter((x: any) => !x.location);
        });
    }

    public toggleRimSelection(selected: Organization) {
        this.homeSandBox.rimSelect(selected).subscribe(() => {});
    }
}

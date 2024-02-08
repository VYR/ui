import { Component } from '@angular/core';
import { ConfigService } from 'src/app/configuration';
import { USER_TYPE } from 'src/app/shared/enums';
import { SchemeType, UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { AdminSandbox } from '../../admin.sandbox';
import { Router } from '@angular/router';

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
    USER_TYPE = USER_TYPE;
    menu: Array<any> = [];
    modules: any = {
        "1" :   [
                    {
                        path:'/admin/individual/schemes',
                        icon: 'las la-university',
                        name: 'Schemes'
                    },
                    {
                        path:'/admin/individual/scheme-names',
                        icon: 'las la-credit-card',
                        name: 'Scheme Names'
                    }
                ],
        "2" :   [
                    {
                        path:'/admin/group/schemes',
                        icon: 'las la-university',
                        name: 'Schemes'
                    },
                    {
                        path:'/admin/group/scheme-names',
                        icon: 'las la-credit-card',
                        name: 'Scheme Names'
                    }
                ]
    };

    public activeRouter: any;
    schemeTypes:Array<any>=[];
    currentUser: UserContext = new UserContext();
    constructor(private router:Router,appContext: ApplicationContextService, private homeSandBox: AdminSandbox, configService: ConfigService) {
        appContext.currentUser.subscribe((res) => {
            this.currentUser = res;
            this.schemeTypes=this.currentUser.schemeTypes || [];
            this.menu = (this.modules[this.currentUser.schemeTypeSelected.schemeType] || []);
        });
    }

    public toggleUserSelection(selected: SchemeType) {
        this.homeSandBox.userSelect(selected);
        console.log('/admin/'+(selected.schemeType===1?'individual':'group'));
        this.router.navigate(['/admin/'+(selected.schemeType===1?'individual':'group')]);
    }
}

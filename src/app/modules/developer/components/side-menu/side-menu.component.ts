import { Component } from '@angular/core';
import { ConfigService } from 'src/app/configuration';
import { USER_TYPE } from 'src/app/shared/enums';
import { SchemeType, UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { DeveloperSandbox } from '../../developer.sandbox';
import { Router } from '@angular/router';

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
    USER_TYPE = USER_TYPE;
    menu: Array<any> = [
        {
            path:'/developer/schemes',
            icon: 'las la-university',
            name: 'Schemes'
        },
        {
            path:'/developer/super-employees-list',
            icon: 'las la-university',
            name: 'Super Employees'
        },
        {
            path:'/developer/employee',
            icon: 'las la-university',
            name: 'Employees'
        },
        {
            path:'/developer/promoters',
            icon: 'las la-university',
            name: 'Promoters'
        },
        {
            path:'/developer/settings',
            icon: 'las la-university',
            name: 'Settings'
        },
        {
            path:'/developer/scheme-members-list',
            icon: 'las la-university',
            name: 'Scheme Members'
        },
        {
            path:'/developer/site-updates',
            icon: 'las la-university',
            name: 'Site Updates'
        },
    ];

    public activeRouter: any;
    schemeTypes:Array<any>=[];
    currentUser: UserContext = new UserContext();
    constructor(private router:Router,appContext: ApplicationContextService, private homeSandBox: DeveloperSandbox, configService: ConfigService) {
        appContext.currentUser.subscribe((res) => {
            this.currentUser = res;   
        });
    }

    public toggleUserSelection(selected: SchemeType) {
        this.homeSandBox.userSelect(selected);
        console.log('/developer/'+(selected.schemeType===1?'individual':'group'));
        this.router.navigate(['/developer/'+(selected.schemeType===1?'individual':'group')]);
    }
}

import { Component } from '@angular/core';
import { ConfigService } from 'src/app/configuration';
import { USER_TYPE } from 'src/app/shared/enums';
import { SchemeType, UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { SuperEmployeeSandbox } from '../../super-empolyee.sandbox';
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
            path:'/super-employee/schemes',
            icon: 'las la-university',
            name: 'Schemes'
        },
        {
            path:'/super-employee/employee',
            icon: 'las la-university',
            name: 'Employees'
        },
        {
            path:'/super-employee/promoters',
            icon: 'las la-university',
            name: 'Promoters'
        },
        {
            path:'/super-employee/scheme-members-list',
            icon: 'las la-university',
            name: 'Scheme Members'
        }
    ];

    public activeRouter: any;
    schemeTypes:Array<any>=[];
    currentUser: UserContext = new UserContext();
    constructor(private router:Router,appContext: ApplicationContextService, private homeSandBox: SuperEmployeeSandbox, configService: ConfigService) {
        appContext.currentUser.subscribe((res) => {
            this.currentUser = res;   
        });
    }

    public toggleUserSelection(selected: SchemeType) {
        this.homeSandBox.userSelect(selected);
        console.log('/super-employee/'+(selected.schemeType===1?'individual':'group'));
        this.router.navigate(['/super-employee/'+(selected.schemeType===1?'individual':'group')]);
    }
}

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
    menu: Array<any> = [
        {
            path:'/admin/schemes',
            icon: 'las la-university',
            name: 'Schemes'
        },
        {
            path:'/admin/scheme-names',
            icon: 'las la-university',
            name: 'Scheme Names'
        },
        {
            path:'/admin/super-employees-list',
            icon: 'las la-university',
            name: 'Super Employees'
        },
        {
            path:'/admin/employee',
            icon: 'las la-university',
            name: 'Employees'
        },
        {
            path:'/admin/promoters',
            icon: 'las la-university',
            name: 'Promoters'
        },
        {
            path:'/admin/scheme-members-list',
            icon: 'las la-university',
            name: 'Scheme Members'
        }
    ];

    public activeRouter: any;
    schemeTypes:Array<any>=[];
    currentUser: UserContext = new UserContext();
    constructor(private router:Router,appContext: ApplicationContextService, private homeSandBox: AdminSandbox, configService: ConfigService) {
        appContext.currentUser.subscribe((res) => {
            this.currentUser = res;   
        });
    }

    public toggleUserSelection(selected: SchemeType) {
        this.homeSandBox.userSelect(selected);
        console.log('/admin/'+(selected.schemeType===1?'individual':'group'));
        this.router.navigate(['/admin/'+(selected.schemeType===1?'individual':'group')]);
    }
}

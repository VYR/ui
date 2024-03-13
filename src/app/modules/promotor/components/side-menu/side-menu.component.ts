import { Component } from '@angular/core';
import { ConfigService } from 'src/app/configuration';
import { USER_TYPE } from 'src/app/shared/enums';
import { SchemeType, UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { PromoterSandbox } from '../../promoter.sandbox';
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
            path:'/promoter/scheme-members-list',
            icon: 'las la-university',
            name: 'Scheme Members'
        },        
        {
            path:'/promoter/referral-amount',
            icon: 'las la-university',
            name: 'Referral Amount'
        }
    ];

    public activeRouter: any;
    schemeTypes:Array<any>=[];
    currentUser: UserContext = new UserContext();
    constructor(private router:Router,appContext: ApplicationContextService, private sandbox: PromoterSandbox, configService: ConfigService) {
        appContext.currentUser.subscribe((res) => {
            this.currentUser = res;   
        });
    }

    public toggleUserSelection(selected: SchemeType) {
        this.sandbox.userSelect(selected);
        console.log('/super-employee/'+(selected.schemeType===1?'individual':'group'));
        this.router.navigate(['/super-employee/'+(selected.schemeType===1?'individual':'group')]);
    }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { interval, mergeMap, Subscription } from 'rxjs';
import { UserContext, Organization } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { IdleTimeoutService } from 'src/app/shared/services/idle-timeout.service';
import { TimeoutPopupComponent } from './components/timeout-popup/timeout-popup.component';
import { HomeSandbox } from './home.sandbox';
import { ConfigService } from 'src/app/configuration';
import { USER_TYPE } from 'src/app/shared/enums';
import { Router } from '@angular/router';
import { CartComponent } from './components/online-food/cart/cart.component';
import { OnlineFoodViewDetailsComponent } from './components/online-food/online-food-view-details/online-food-view-details.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [IdleTimeoutService],
})
export class HomeComponent implements OnInit {
    user: UserContext = new UserContext();
    refreshToken!: Subscription;
    USER_TYPE = USER_TYPE;
    menu: Array<any> = [];
    modules: any = {};
    cartItems:any=0;

    public activeRouter: any;
    constructor(
        private dialog: SgsDialogService,
        private router:Router,
        private idleTimeoutService: IdleTimeoutService,
        private sandbox: HomeSandbox,
        private appContext: ApplicationContextService,
        private configService: ConfigService
    ) {
        appContext.currentUser.subscribe((res) => {
            this.user = res;
            const modules: Array<any> = configService.get('modules');
            this.menu = (modules[this.user.userType] || []).filter((x: any) => !x.location);
            this.cartItems=(this.user?.cart || []).reduce((total,value) => {return total+value.quantity;},0);
        });
    }

    ngOnInit(): void {
    /*     this.idleTimeoutService.initilizeSessionTimeout();
        this.idleTimeoutService.userIdlenessChecker!.subscribe((status: string) => {
            this.initiateFirstTimer(status);
        });
        const currentUser = this.appContext.getCurrentUser();
        this.refreshToken = interval(((currentUser.expirationTime || 1800) - 120) * 1000)
            .pipe(mergeMap(() => this.sandbox.refreshToken()))
            .subscribe((data: any) => {}); */
    }
    goToPage(path:any){
        this.router.navigate([path]);
    }
    openCartPage(){
        const ref = this.dialog.openOverlayPanel('Cart', CartComponent,SgsDialogType.large);
        ref.afterClosed().subscribe((res) => {});
    }
    
    openPage(page:any){
        let name='';
        if(page==='profile'){
            name='Profile';
        }
        if(page==='orders'){
            name='Orders';
        }
        const ref = this.dialog.openOverlayPanel(name, OnlineFoodViewDetailsComponent,{
            type:page            
        },SgsDialogType.large);
        ref.afterClosed().subscribe((res) => {});
    }
    private initiateFirstTimer(status: string) {
        switch (status) {
            case 'INITIATE_TIMER':
                break;
            case 'RESET_TIMER':
                break;
            case 'STOPPED_TIMER':
                this.showSendTimerDialog();
                break;
            default:
                break;
        }
    }

    private showSendTimerDialog() {
        const ref = this.dialog.openDialog(SgsDialogType.small, TimeoutPopupComponent, {
            status: this.idleTimeoutService.secondLevelUserIdleChecker,
        });
        ref.afterClosed().subscribe((data: any) => {
            this.action(data.action);
        });
    }

    action(type: string) {
        IdleTimeoutService.runSecondTimer = false;
        if (type === 'LOGOUT') {
            IdleTimeoutService.runTimer = false;
            this.sandbox.logout().subscribe();
        } else {
            this.idleTimeoutService.initilizeSessionTimeout();
        }
    }

    ngOnDestroy() {
        if (this.refreshToken) {
            this.refreshToken.unsubscribe();
        }
        IdleTimeoutService.runTimer = false;
        this.idleTimeoutService.ngOnDestroy();
    }
}

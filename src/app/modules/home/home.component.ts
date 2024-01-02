import { Component, OnInit } from '@angular/core';
import { interval, mergeMap, Subscription } from 'rxjs';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { SgsDialogService, SgsDialogType } from 'src/app/shared/services/sgs-dialog.service';
import { IdleTimeoutService } from 'src/app/shared/services/idle-timeout.service';
import { TimeoutPopupComponent } from './components/timeout-popup/timeout-popup.component';
import { HomeSandbox } from './home.sandbox';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [IdleTimeoutService],
})
export class HomeComponent implements OnInit {
    user: UserContext = new UserContext();
    refreshToken!: Subscription;

    constructor(
        private dialog: SgsDialogService,
        private idleTimeoutService: IdleTimeoutService,
        private sandbox: HomeSandbox,
        private appContext: ApplicationContextService
    ) {}

    ngOnInit(): void {
       // this.idleTimeoutService.initilizeSessionTimeout();
        this.idleTimeoutService.userIdlenessChecker!.subscribe((status: string) => {
            //this.initiateFirstTimer(status);
        });
        const currentUser = this.appContext.getCurrentUser();
        this.refreshToken = interval(((currentUser.expirationTime || 1800) - 120) * 1000)
            .pipe(mergeMap(() => this.sandbox.refreshToken()))
            .subscribe((data: any) => {});
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
            this.sandbox.logout();
            //.subscribe();
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

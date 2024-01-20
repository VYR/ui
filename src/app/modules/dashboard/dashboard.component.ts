import { Component } from '@angular/core';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    constructor(private appContext:ApplicationContextService) {
        this.appContext.setPageTitle('Dashboard');  }
}

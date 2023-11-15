import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-cib-notification',
    templateUrl: './cib-notification.component.html',
    styleUrls: ['./cib-notification.component.scss'],
})
export class CibNotificationComponent {
    @Input() variant: string = 'success'; // error, warning, info
    @Input() headerTitle: string = '';
    @Input() title: string = '';
    @Input() subtitle: string = '';

    constructor() {}
}

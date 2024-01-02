import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-sgs-notification',
    templateUrl: './sgs-notification.component.html',
    styleUrls: ['./sgs-notification.component.scss'],
})
export class SgsNotificationComponent {
    @Input() variant: string = 'success'; // error, warning, info
    @Input() headerTitle: string = '';
    @Input() title: string = '';
    @Input() subtitle: string = '';

    constructor() {}
}

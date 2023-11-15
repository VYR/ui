import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-operations-comments-history',
    templateUrl: './operations-comments-history.html',
    styleUrls: ['./operations-comments-history.component.scss'],
})
export class OperationsCommentsHistoryComponent {
    @Input() comments: any = [];

    constructor() {}
}

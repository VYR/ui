import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-comments-history',
    templateUrl: './comments-history.html',
    styleUrls: ['./comments-history.component.scss'],
})
export class CommentsHistoryComponent {
    @Input() comments: any = [];

    constructor() {}
}

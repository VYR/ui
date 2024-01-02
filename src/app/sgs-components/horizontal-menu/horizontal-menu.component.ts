import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-horizontal-menu',
    templateUrl: './horizontal-menu.component.html',
    styleUrls: ['./horizontal-menu.component.scss'],
})
export class HorizontalMenuComponent {
    @Input() menu: Array<any> = [];
    public activeRouter: any;
    constructor() {}
}

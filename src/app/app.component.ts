import { Component, OnInit } from '@angular/core';
import { ConfigService } from './configuration';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    spinnerType: string = '';
    constructor(private config: ConfigService) {}

    ngOnInit(): void {
        this.spinnerType = this.config.get('spinner').type;
    }
}

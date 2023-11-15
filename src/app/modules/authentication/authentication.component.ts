import { Component, OnInit } from '@angular/core';
import { UserContext } from 'src/app/shared/models';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent {
    user = new UserContext();
    constructor() {}
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

@Component({
    selector: 'app-no-access',
    templateUrl: './no-access.component.html',
    styleUrls: ['./no-access.component.scss'],
})
export class NoAccessComponent {
    module!: string;
    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.module = (this.route.snapshot.paramMap.get('module') || '').replace('-', ' ');
    }
}

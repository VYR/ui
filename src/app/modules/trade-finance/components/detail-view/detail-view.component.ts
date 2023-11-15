import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-detail-view',
    templateUrl: './detail-view.component.html',
    styleUrls: ['./detail-view.component.scss'],
})
export class DetailViewComponent implements OnInit {
    parentData: any;
    pageType: any = '';
    constructor(public dialogRef: MatDialogRef<DetailViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit(): void {
        this.parentData = this.data.data;
        this.pageType = this.data.type;
    }
}

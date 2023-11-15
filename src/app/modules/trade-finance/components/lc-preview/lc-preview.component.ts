import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-lc-preview',
    templateUrl: './lc-preview.component.html',
    styleUrls: ['./lc-preview.component.scss'],
})
export class LcPreviewComponent implements OnInit {
    content: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer) {}

    ngOnInit(): void {
        this.content = this.sanitizer.bypassSecurityTrustResourceUrl(
            `data:application/pdf;base64,${this.data.content}`
        );
    }
}

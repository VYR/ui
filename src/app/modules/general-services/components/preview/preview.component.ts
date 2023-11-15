import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-preview',
    templateUrl: './preview.component.html',
    styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
    content: any;
    constructor(
        public dialogRef: MatDialogRef<PreviewComponent>,
        private sanitizer: DomSanitizer,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.content = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.data.content}`);
    }
    sendReponse() {
        this.dialogRef.close({
            decision: true,
        });
    }
}

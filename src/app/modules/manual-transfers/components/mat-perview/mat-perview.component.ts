import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserContext } from 'src/app/shared/models';
import { ApplicationContextService } from 'src/app/shared/services/application-context.service';
import { CibDialogService } from 'src/app/shared/services/cib-dialog.service';

@Component({
    selector: 'app-mat-perview',
    templateUrl: './mat-perview.component.html',
    styleUrls: ['./mat-perview.component.scss'],
})
export class MatPerviewComponent {
    rimData: any;
    staticData: any;
    selectedTransfer: any;
    todayDate: any = new Date();
    user: any;

    constructor(
        public dialogRef: MatDialogRef<MatPerviewComponent>,
        private dialog: CibDialogService,
        private appContext: ApplicationContextService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        this.staticData = {
            subject: 'Sub: FUND TRANSFER REQUEST',
            bankName: 'Qatar Islamic Branch',
            senderName: 'Branch Manager',
            note: 'Please process local/ international payment as per below particulars and oblige.',
            endNote:
                'We certify that we are aware of the terms and conditions related to the domestic/international transfers and have since obtained a copy of the same from QIB for our information and records.',
            regards: 'Yours faithfully',
        };
        this.appContext.currentUser.subscribe((user: UserContext) => {
            this.user = user;
        });
        this.selectedTransfer = this.data.data;
    }

    printDocument(template: any) {
        var contents = template.innerHTML;
        var frame1: any = document.createElement('iframe');
        frame1.name = 'frame1';
        frame1.style.position = 'absolute';
        frame1.style.top = '-1000000px';
        document.body.appendChild(frame1);
        var frameDoc = frame1.contentWindow
            ? frame1.contentWindow
            : frame1.contentDocument.document
            ? frame1.contentDocument.document
            : frame1.contentDocument;
        frameDoc.document.open();
        frameDoc.document.write(contents);
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            const frame = window.frames[0];
            frame.focus();
            frame.print();
            document.body.removeChild(frame1);
        });
        return;
    }
}

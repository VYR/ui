import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewDemoComponent } from '../view-demo/view-demo.component';
@Component({
    selector: 'app-know-more',
    templateUrl: './know-more.component.html',
    styleUrls: ['./know-more.component.scss'],
})
export class KnowMoreComponent {
    constructor(public dialog: MatDialog) {}

    otherLinks = [
        {
            icon: 'assets/images/qib_forgot_cred.png',
            heading: 'View Demos',
            subLink: 'Click to view our demos',
            alt: 'View demo',
        },
        {
            icon: 'assets/images/qib_online_acc.png',
            heading: 'New Corporate User?',
            subLink: 'Download Registration Form',
            alt: 'Download form',
        },
        {
            icon: 'assets/images/qib_security_tip.png',
            heading: 'Security Tips',
            subLink: 'How We Protect You!',
            alt: 'Security Tips',
        },
        {
            icon: 'assets/images/contactUs.png',
            headingOne: 'Call Us:',
            subLink1: 'T: +974 40335241, +974 40335158 or +974 40335157',
            headingTwo: 'Mail Us:',
            subLink2: 'COB@qib.com.qa',
            headingThree: 'Working Hours (Sunday - Thursday):',
            subLink3: '7.30 am - 2.30 pm',
            alt: 'Call Us',
        },
    ];

    onOtherLinksClick(selectedLink: any) {
        switch (selectedLink) {
            case 'Click to view our demos':
                this.openViewDemoDDialog();
                break;
            case 'Download Registration Form':
                var w = window.innerWidth;
                var h = window.innerHeight;
                window.open(
                    'https://www.qib.com.qa/en/wholesale/corporate/corporate-online-banking/#tab-2',
                    'CIB',
                    'innerWidth=w,innerHeight=h,resizable,scrollbars,status'
                );
                break;
            case 'How We Protect You!':
                var w = window.innerWidth;
                var h = window.innerHeight;
                window.open(
                    'https://www.qib.com.qa/en/useful-tools/security-tips/index.aspx',
                    'CIB',
                    'innerWidth=w,innerHeight=h,resizable,scrollbars,status'
                );
                break;
            default:
                break;
        }
    }

    openViewDemoDDialog() {
        const dialogRef = this.dialog.open(ViewDemoComponent);
        dialogRef.afterClosed().subscribe();
    }
}

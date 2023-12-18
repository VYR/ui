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
            icon: 'assets/images/sgs_forgot_cred.png',
            heading: 'View Demos',
            subLink: 'Click to view our demos',
            alt: 'View demo',
        },
        {
            icon: 'assets/images/sgs_security_tip.png',
            heading: 'Security Tips',
            subLink: 'How We Protect You!',
            alt: 'Security Tips',
        },
        {
            icon: 'assets/images/contactUs.png',
            headingOne: 'Call Us:',
            subLink1: 'T: +91 040389241, +91 040389241 or +91 040389241',
            headingTwo: 'Mail Us:',
            subLink2: 'contact@sgs.com',
            headingThree: 'Working Hours (Monday - Friday):',
            subLink3: '10.30 am - 5.30 pm',
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
                    '#',
                    'SGS',
                    'innerWidth=w,innerHeight=h,resizable,scrollbars,status'
                );
                break;
            case 'How We Protect You!':
                var w = window.innerWidth;
                var h = window.innerHeight;
                window.open(
                    '#',
                    'SGS',
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

import { Component, OnInit } from '@angular/core';
import { AuthenticationSandbox } from '../../authentication.sandbox';

@Component({
    selector: 'app-verticle-slider',
    templateUrl: './verticle-slider.component.html',
    styleUrls: ['./verticle-slider.component.scss'],
})
export class VerticleSliderComponent implements OnInit {
    constructor(private authenticationSandBox: AuthenticationSandbox) {}

    slideConfig = {};

    ngOnInit(): void {
        this.slideConfig = this.authenticationSandBox.getVerticalSliderConfig();
    }

    images = [
        {
            image: 'assets/images/carousal-one.jpg',
            heading: 'Accounts & Cash Management',
            content:
                'QIBs Accounts and Cash Management Services offer a full range of receivable and payable services to meet your complex cash management needs.',
        },
        {
            image: 'assets/images/carousal-two.jpg',
            heading: 'Trade Finance & Services',
            content:
                'QIB offers a wide range of trade services designed to facilitate your domestic and international trade procedures.',
        },
        {
            image: 'assets/images/carousal-three.jpg',
            heading: 'Financial Solutions',
            content: 'Whether you want to improve cash flow, cover expenses or plan for business growth.',
        },
        {
            image: 'assets/images/carousal-four.jpg',
            heading: 'Treasury Services',
            content: 'QIB treasury groups team of dedicated treasury and capital markets professionals.',
        },
        {
            image: 'assets/images/carousal-five.jpg',
            heading: 'Contact Us',
            content: 'For any inquiry about QIB Corporate Banking solutions, please do not hesitate to contact us.',
        },
    ];
}

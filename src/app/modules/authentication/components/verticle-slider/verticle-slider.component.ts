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
            heading: 'Save Gold Scheme',
            content:
                'Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter ',
        },
        {
            image: 'assets/images/carousal-two.jpg',
            heading: 'Users',
            content:
                'Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter ',
         },
        {
            image: 'assets/images/carousal-three.jpg',
            heading: 'Dealers',
            content:
            'Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter Matter ',
        },
    ];
}

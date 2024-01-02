import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-outlet-container',
    templateUrl: './outlet-container.component.html',
    styleUrls: ['./outlet-container.component.scss'],
})
export class OutletContainerComponent implements AfterViewInit {
    @ViewChild('outletContainer') outletContainer!: ElementRef;
    @ViewChild('menuContainer') menuContainer!: ElementRef;

    ngAfterViewInit() {
        const clientHeight = document.documentElement.clientHeight;
        let menuHeight = this.menuContainer.nativeElement.offsetHeight;
        let height = clientHeight - 115 - (menuHeight ? menuHeight : 0);
        height = height / 16;
        this.outletContainer.nativeElement.style.maxHeight = `${height}rem`;
    }
}

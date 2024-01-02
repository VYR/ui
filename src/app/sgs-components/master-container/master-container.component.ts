import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'app-master-container',
    templateUrl: './master-container.component.html',
    styleUrls: ['./master-container.component.scss'],
})
export class MasterContainerComponent implements AfterViewInit {
    @ViewChild('header') header!: ElementRef;
    @ViewChild('body') body!: ElementRef;
    @Input() collapsable: boolean = false;
    @Input() opened = true;
    @Input() variant: string = 'parmary';
    @Output() _onToggle = new EventEmitter<boolean>();

    toggle() {
        if (this.collapsable) this.opened = !this.opened;
        this._onToggle.emit(this.opened);
    }

    ngAfterViewInit() {
        if (!this.body) return;
        let height = this.header.nativeElement.offsetHeight;
        const clientHeight = document.documentElement.clientHeight;
        height = clientHeight - (height + 180);
        height = height / 16;
        this.body.nativeElement.style.maxHeight = `${height}rem`;
    }
}

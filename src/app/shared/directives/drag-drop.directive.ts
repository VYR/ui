import { Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[appDragDrop]',
})
export class DragDropDirective {
    // tslint:disable-next-line:no-output-on-prefix
    @Output() public fileDropped = new EventEmitter<any>();

    @HostBinding('style.background-color') private background = 'transparent';
    @HostBinding('style.opacity') private opacity = '1';

    // Dragover listener
    @HostListener('dragover', ['$event']) public onDragOver(evt: any) {
        evt.preventDefault();
        evt.stopPropagation();
        this.opacity = '0.8';
    }

    // Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
        evt.preventDefault();
        evt.stopPropagation();
        this.opacity = '1';
    }

    // Drop listener
    @HostListener('drop', ['$event']) public ondrop(evt: any) {
        evt.preventDefault();
        evt.stopPropagation();
        this.opacity = '1';
        this.fileDropped.emit(evt.dataTransfer);
    }
}

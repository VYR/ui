import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appOnlyNumbers]',
})
export class OnlyNumbersDirective {
    constructor() {}

    @HostListener('keypress', ['$event']) public onKeyPress(event: any) {
        return this.validateField(event);
    }

    @HostListener('paste', ['$event']) public onPaste(event: any) {
        return this.validateField(event);
    }

    validateField(event: any) {
        let charCode = event.which ? event.which : event.keyCode;
        return (charCode > 47 && charCode < 58);
    }
}
